import test from 'node:test';
import assert from 'node:assert/strict';
import { CalendarParseError, isStayAvailable, mergeBlockedRanges, parseICal } from '../src/lib/calendar.ts';

function calendar(...events: string[]) {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', ...events, 'END:VCALENDAR', ''].join('\r\n');
}

function event(...properties: string[]) {
  return ['BEGIN:VEVENT', ...properties, 'END:VEVENT'].join('\r\n');
}

test('all-day Airbnb dates have an exclusive end and expose no event metadata', () => {
  const result = parseICal(calendar(event(
    'DTSTART;VALUE=DATE:20270104',
    'DTEND;VALUE=DATE:20270108',
    'SUMMARY:Private test reservation',
    'DESCRIPTION:Synthetic private details must not be returned',
    'UID:synthetic-reservation@example.invalid',
  )));
  assert.deepEqual(result, [{ start: '2027-01-04', end: '2027-01-08' }]);
  assert.equal(JSON.stringify(result).includes('Private'), false);
});

test('folded CRLF and LF lines are unfolded before dates are parsed', () => {
  assert.deepEqual(parseICal(calendar(event(
    'DTSTART;VALUE=DATE:2027\r\n 0104',
    'DTEND;VALUE=DATE:2027\n\t0108',
  ))), [{ start: '2027-01-04', end: '2027-01-08' }]);
});

test('cancelled and transparent events do not block a stay', () => {
  assert.deepEqual(parseICal(calendar(
    event('DTSTART;VALUE=DATE:20270104', 'DTEND;VALUE=DATE:20270108', 'STATUS:CANCELLED'),
    event('DTSTART;VALUE=DATE:20270109', 'DTEND;VALUE=DATE:20270112', 'TRANSP:TRANSPARENT'),
  )), []);
});

test('a valid empty calendar is distinct from an invalid feed', () => {
  assert.deepEqual(parseICal(calendar()), []);
  for (const invalid of ['', '<html>Service unavailable</html>', 'BEGIN:VCALENDAR\nVERSION:2.0', 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nEND:VCALENDAR']) {
    assert.throws(() => parseICal(invalid), CalendarParseError);
  }
});

test('an all-day event without DTEND lasts one day, including month boundaries', () => {
  assert.deepEqual(parseICal(calendar(event('DTSTART;VALUE=DATE:20280229'))), [{ start: '2028-02-29', end: '2028-03-01' }]);
});

test('all-day DURATION supports day and week units', () => {
  assert.deepEqual(parseICal(calendar(event('DTSTART;VALUE=DATE:20270104', 'DURATION:P1W'))), [{ start: '2027-01-04', end: '2027-01-11' }]);
  assert.deepEqual(parseICal(calendar(event('DTSTART;VALUE=DATE:20270104', 'DURATION:P2D'))), [{ start: '2027-01-04', end: '2027-01-06' }]);
});

test('overlapping and adjacent blocks merge without changing the input', () => {
  const ranges = [{ start: '2027-01-08', end: '2027-01-10' }, { start: '2027-01-04', end: '2027-01-08' }, { start: '2027-01-05', end: '2027-01-07' }];
  const original = JSON.stringify(ranges);
  assert.deepEqual(mergeBlockedRanges(ranges), [{ start: '2027-01-04', end: '2027-01-10' }]);
  assert.equal(JSON.stringify(ranges), original);
});

test('parser returns normalized ranges in date order', () => {
  assert.deepEqual(parseICal(calendar(
    event('DTSTART;VALUE=DATE:20270201', 'DTEND;VALUE=DATE:20270204'),
    event('DTSTART;VALUE=DATE:20270104', 'DTEND;VALUE=DATE:20270108'),
    event('DTSTART;VALUE=DATE:20270106', 'DTEND;VALUE=DATE:20270110'),
  )), [{ start: '2027-01-04', end: '2027-01-10' }, { start: '2027-02-01', end: '2027-02-04' }]);
});

test('guests can arrive on a blocked stay checkout date or depart on its arrival date', () => {
  const blocked = [{ start: '2027-01-04', end: '2027-01-08' }];
  assert.equal(isStayAvailable('2027-01-08', '2027-01-12', blocked), true);
  assert.equal(isStayAvailable('2027-01-01', '2027-01-04', blocked), true);
  assert.equal(isStayAvailable('2027-01-03', '2027-01-05', blocked), false);
  assert.equal(isStayAvailable('2027-01-05', '2027-01-06', blocked), false);
  assert.equal(isStayAvailable('2027-01-01', '2027-01-12', blocked), false);
});

test('combined accommodation is blocked when either apartment is blocked', () => {
  const bright = [{ start: '2027-01-04', end: '2027-01-08' }];
  const cozy = [{ start: '2027-01-10', end: '2027-01-12' }];
  const bundle = mergeBlockedRanges([...bright, ...cozy]);
  assert.equal(isStayAvailable('2027-01-06', '2027-01-09', bundle), false);
  assert.equal(isStayAvailable('2027-01-09', '2027-01-11', bundle), false);
  assert.equal(isStayAvailable('2027-01-08', '2027-01-10', bundle), true);
});

test('UTC timed events become occupied Bangkok civil days', () => {
  assert.deepEqual(parseICal(calendar(event('DTSTART:20270103T180000Z', 'DTEND:20270105T170000Z'))), [{ start: '2027-01-04', end: '2027-01-06' }]);
});

test('Bangkok and floating timed events conservatively block every touched civil day', () => {
  assert.deepEqual(parseICal(calendar(event('DTSTART;TZID=Asia/Bangkok:20270104T140000', 'DTEND;TZID=Asia/Bangkok:20270106T110000'))), [{ start: '2027-01-04', end: '2027-01-07' }]);
  assert.deepEqual(parseICal(calendar(event('DTSTART:20270104T140000', 'DTEND:20270106T110000'))), [{ start: '2027-01-04', end: '2027-01-07' }]);
});

test('malformed active dates and invalid ranges fail closed', () => {
  const invalidEvents = [
    event('DTEND;VALUE=DATE:20270108'),
    event('DTSTART;VALUE=DATE:20270230', 'DTEND;VALUE=DATE:20270304'),
    event('DTSTART;VALUE=DATE:20270108', 'DTEND;VALUE=DATE:20270104'),
    event('DTSTART;VALUE=DATE:20270108', 'DTEND;VALUE=DATE:20270108'),
    event('DTSTART;VALUE=DATE:20270104', 'DTEND:20270108T000000Z'),
    event('DTSTART;VALUE=DATE:20270104', 'DTEND;VALUE=DATE:20270108', 'DURATION:P2D'),
    event('DTSTART;VALUE=DATE:20270104', 'DTSTART;VALUE=DATE:20270105'),
    event('DTSTART:20270104T250000Z', 'DTEND:20270106T110000Z'),
  ];
  for (const invalid of invalidEvents) assert.throws(() => parseICal(calendar(invalid)), CalendarParseError);
});

test('unsupported recurrence and timezones fail closed rather than omit busy dates', () => {
  assert.throws(() => parseICal(calendar(event('DTSTART;VALUE=DATE:20270104', 'RRULE:FREQ=WEEKLY'))), CalendarParseError);
  assert.throws(() => parseICal(calendar(event('DTSTART;TZID=Europe/London:20270104T140000', 'DTEND;TZID=Europe/London:20270106T110000'))), CalendarParseError);
});

test('unsupported busy-time components cannot be mistaken for an empty event calendar', () => {
  assert.throws(() => parseICal(calendar(
    'BEGIN:VFREEBUSY\r\nFREEBUSY:20270104T000000Z/20270108T000000Z\r\nEND:VFREEBUSY',
  )), CalendarParseError);
});

test('conflicting date parameters fail closed', () => {
  assert.throws(() => parseICal(calendar(event(
    'DTSTART;VALUE=DATE;VALUE=DATE:20270104',
    'DTEND;VALUE=DATE:20270108',
  ))), CalendarParseError);
});

test('malformed availability inputs cannot be reported as available', () => {
  assert.throws(() => isStayAvailable('2027-02-30', '2027-03-03', []), /date/i);
  assert.throws(() => isStayAvailable('2027-03-03', '2027-03-03', []), /after/i);
  assert.throws(() => isStayAvailable('2027-03-03', '2027-03-04', [{ start: '2027-03-05', end: '2027-03-01' }]), /after/i);
});
