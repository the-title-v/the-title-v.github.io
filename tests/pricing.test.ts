import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuote, getNightlyRate, PRICING_POLICY } from '../src/lib/pricing.ts';

const bright = 'bright-1br-rawai-beach';
const cozy = 'cozy-1br-rawai-beach';
const both = 'two-adjacent-apartments-title-v-rawai';

test('historical reference rates change at the seasonal boundaries', () => {
  assert.equal(getNightlyRate('2027-02-28', bright), 3300);
  assert.equal(getNightlyRate('2027-03-01', bright), 2000);
  assert.equal(getNightlyRate('2027-04-01', bright), 1300);
  assert.equal(getNightlyRate('2027-05-01', bright), 1000);
  assert.equal(getNightlyRate('2027-09-30', bright), 1000);
  assert.equal(getNightlyRate('2027-10-01', bright), 1300);
  assert.equal(getNightlyRate('2027-11-01', bright), 2000);
  assert.equal(getNightlyRate('2027-12-01', bright), 3300);
});

test('both apartments share pooled reference rates and the bundle sums them', () => {
  assert.equal(getNightlyRate('2027-01-10', cozy), 3300);
  assert.equal(getNightlyRate('2027-01-10', both), 6600);
});

test('a cross-season quote prices each occupied night and excludes checkout', () => {
  const quote = calculateQuote({ propertyId: bright, checkIn: '2026-11-29', checkOut: '2026-12-03', guests: 2 });
  assert.equal(quote.currency, 'THB');
  assert.equal(quote.nights, 4);
  assert.equal(quote.baseTotal, 10600);
  assert.equal(quote.discountRate, 0);
  assert.equal(quote.discountTotal, 0);
  assert.equal(quote.total, 10600);
  assert.deepEqual(quote.nightly, [
    { date: '2026-11-29', rate: 2000 },
    { date: '2026-11-30', rate: 2000 },
    { date: '2026-12-01', rate: 3300 },
    { date: '2026-12-02', rate: 3300 },
  ]);
});

test('weekly discount starts at seven nights', () => {
  const six = calculateQuote({ propertyId: cozy, checkIn: '2027-06-01', checkOut: '2027-06-07' });
  const seven = calculateQuote({ propertyId: cozy, checkIn: '2027-06-01', checkOut: '2027-06-08' });
  assert.equal(six.total, 6000);
  assert.equal(six.discountRate, 0);
  assert.equal(seven.baseTotal, 7000);
  assert.equal(seven.discountRate, 0.1);
  assert.equal(seven.discountTotal, 700);
  assert.equal(seven.total, 6300);
});

test('monthly discount begins at 28 nights and replaces the weekly discount', () => {
  const twentySeven = calculateQuote({ propertyId: cozy, checkIn: '2027-06-01', checkOut: '2027-06-28' });
  const twentyEight = calculateQuote({ propertyId: cozy, checkIn: '2027-06-01', checkOut: '2027-06-29' });
  assert.equal(twentySeven.discountRate, 0.1);
  assert.equal(twentySeven.total, 24300);
  assert.equal(twentyEight.discountRate, 0.2);
  assert.equal(twentyEight.discountTotal, 5600);
  assert.equal(twentyEight.total, 22400);
});

test('bundle discount applies once to the combined accommodation total', () => {
  const quote = calculateQuote({ propertyId: both, checkIn: '2027-06-01', checkOut: '2027-06-08', guests: 8 });
  assert.equal(quote.baseTotal, 14000);
  assert.equal(quote.discountTotal, 1400);
  assert.equal(quote.total, 12600);
});

test('civil-day arithmetic includes leap day without depending on server timezone', () => {
  const quote = calculateQuote({ propertyId: bright, checkIn: '2028-02-28', checkOut: '2028-03-02' });
  assert.equal(quote.nights, 3);
  assert.equal(quote.total, 8600);
  assert.deepEqual(quote.nightly.map((night) => night.date), ['2028-02-28', '2028-02-29', '2028-03-01']);
});

test('invalid and non-date input is rejected instead of silently normalized', () => {
  for (const invalid of ['2027-02-29', '2027-02-30', '2027-13-01', '2027-6-01', '2027-06-01T00:00:00Z']) {
    assert.throws(() => getNightlyRate(invalid, bright), /date/i);
  }
  assert.throws(() => calculateQuote({ propertyId: bright, checkIn: '2027-02-30', checkOut: '2027-03-05' }), /date/i);
});

test('checkout must be after check-in and stay length respects editable website limits', () => {
  for (const checkOut of ['2027-06-01', '2027-05-31']) {
    assert.throws(() => calculateQuote({ propertyId: bright, checkIn: '2027-06-01', checkOut }), /after/i);
  }
  assert.equal(PRICING_POLICY.minNights, 2);
  assert.equal(PRICING_POLICY.maxNights, 180);
  assert.throws(() => calculateQuote({ propertyId: bright, checkIn: '2027-06-01', checkOut: '2027-06-02' }), /2 nights/i);
  assert.throws(() => calculateQuote({ propertyId: bright, checkIn: '2027-01-01', checkOut: '2027-07-01' }), /180 nights/i);
});

test('guest counts must be positive integers within the selected accommodation capacity', () => {
  for (const guests of [0, -1, 1.5, 5, Number.NaN]) {
    assert.throws(() => calculateQuote({ propertyId: bright, checkIn: '2027-06-01', checkOut: '2027-06-04', guests }), /guests/i);
  }
  assert.throws(() => calculateQuote({ propertyId: both, checkIn: '2027-06-01', checkOut: '2027-06-04', guests: 9 }), /guests/i);
  assert.equal(calculateQuote({ propertyId: bright, checkIn: '2027-06-01', checkOut: '2027-06-04', guests: 4 }).total, 3000);
});

test('unknown public property identifiers cannot produce a quote', () => {
  assert.throws(() => getNightlyRate('2027-06-01', 'unknown'), /accommodation/i);
  assert.throws(() => calculateQuote({ propertyId: 'unknown', checkIn: '2027-06-01', checkOut: '2027-06-04' }), /accommodation/i);
});
