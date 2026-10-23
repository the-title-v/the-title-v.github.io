/** Privacy-preserving iCal availability: output contains dates only. */
export type BlockedDateRange = { start: string; end: string };

export class CalendarParseError extends Error {
  constructor(message = 'The calendar could not be read. Please confirm availability with the host.') {
    super(message);
    this.name = 'CalendarParseError';
  }
}

const DAY_MS = 86_400_000;
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
type CalendarProperty = { value: string; parameters: Record<string, string> };
type EventProperties = Map<string, CalendarProperty>;
type CalendarDate = { kind: 'date' | 'date-time'; time: number };

function dateToTime(date: string): number {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new CalendarParseError('The calendar contains an invalid date.');
  }
  const time = Date.parse(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date) {
    throw new CalendarParseError('The calendar contains an invalid date.');
  }
  return time;
}

function toDate(time: number): string {
  if (!Number.isFinite(time) || Math.abs(time) > 8.64e15) throw new CalendarParseError('The calendar contains an invalid date.');
  const date = new Date(time).toISOString().slice(0, 10);
  dateToTime(date);
  return date;
}

function assertRange(range: BlockedDateRange): void {
  if (dateToTime(range.end) <= dateToTime(range.start)) {
    throw new CalendarParseError('The end date must be after the start date.');
  }
}

/** Union of occupied dates, also used for the two-apartment option. */
export function mergeBlockedRanges(ranges: readonly BlockedDateRange[]): BlockedDateRange[] {
  const sorted = ranges.map((range) => {
    assertRange(range);
    return { start: range.start, end: range.end };
  }).sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
  const merged: BlockedDateRange[] = [];
  for (const range of sorted) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      if (range.end > previous.end) previous.end = range.end;
    } else {
      merged.push(range);
    }
  }
  return merged;
}

/** Call only with successfully refreshed calendars; [] must never stand for a fetch error. */
export function isStayAvailable(checkIn: string, checkOut: string, ranges: readonly BlockedDateRange[]): boolean {
  assertRange({ start: checkIn, end: checkOut });
  const normalized = mergeBlockedRanges(ranges);
  return !normalized.some((range) => checkIn < range.end && checkOut > range.start);
}

function parseDate(property: CalendarProperty): CalendarDate {
  const value = property.value;
  const type = property.parameters.VALUE?.toUpperCase();
  if (/^\d{8}$/.test(value) && (!type || type === 'DATE')) {
    return { kind: 'date', time: dateToTime(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`) };
  }
  const match = /^(\d{8})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(value);
  if (!match || (type && type !== 'DATE-TIME')) throw new CalendarParseError('The calendar contains an unsupported date format.');
  const [, day, hour, minute, second, utc] = match;
  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) {
    throw new CalendarParseError('The calendar contains an invalid date or time.');
  }
  const zone = property.parameters.TZID;
  if (utc && zone) throw new CalendarParseError('The calendar contains conflicting time zones.');
  if (zone && !['Asia/Bangkok', 'UTC', 'Etc/UTC', 'GMT'].includes(zone)) {
    throw new CalendarParseError('The calendar uses an unsupported time zone.');
  }
  const offset = utc || (zone && zone !== 'Asia/Bangkok') ? 0 : BANGKOK_OFFSET_MS;
  const midnight = dateToTime(`${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`);
  return { kind: 'date-time', time: midnight + (Number(hour) * 3600 + Number(minute) * 60 + Number(second)) * 1000 - offset };
}

function eventRange(properties: EventProperties): BlockedDateRange | null {
  if (properties.get('STATUS')?.value.toUpperCase() === 'CANCELLED' || properties.get('TRANSP')?.value.toUpperCase() === 'TRANSPARENT') return null;
  if (['RRULE', 'RDATE', 'EXDATE', 'RECURRENCE-ID'].some((key) => properties.has(key))) {
    throw new CalendarParseError('Recurring calendar events need host confirmation.');
  }
  const startProperty = properties.get('DTSTART');
  if (!startProperty) throw new CalendarParseError('A calendar event is missing its start date.');
  const start = parseDate(startProperty);
  const endProperty = properties.get('DTEND');
  const duration = properties.get('DURATION');
  if (duration && endProperty) throw new CalendarParseError('A calendar event has conflicting end dates.');
  let end: CalendarDate;
  if (endProperty) {
    end = parseDate(endProperty);
  } else if (start.kind === 'date') {
    // RFC 5545: a DATE event without DTEND/DURATION lasts one civil day.
    let days = 1;
    if (duration) {
      const match = /^P([1-9]\d*)([DW])$/.exec(duration.value);
      if (!match) throw new CalendarParseError('The calendar contains an unsupported duration.');
      days = Number(match[1]) * (match[2] === 'W' ? 7 : 1);
    }
    end = { kind: 'date', time: start.time + days * DAY_MS };
  } else {
    throw new CalendarParseError('Timed calendar events need an explicit end.');
  }
  if (start.kind !== end.kind || end.time <= start.time) throw new CalendarParseError('The calendar contains an invalid date range.');
  // Timed events conservatively block every touched Bangkok civil day.
  const range = start.kind === 'date'
    ? { start: toDate(start.time), end: toDate(end.time) }
    : {
        start: toDate(Math.floor((start.time + BANGKOK_OFFSET_MS) / DAY_MS) * DAY_MS),
        end: toDate(Math.ceil((end.time + BANGKOK_OFFSET_MS) / DAY_MS) * DAY_MS),
      };
  assertRange(range);
  return range;
}

/**
 * Handles Airbnb's all-day VEVENT exports, folded lines, and explicit timed events.
 * Unsupported or malformed active events throw: they must never become free dates.
 * Titles, descriptions, identifiers, and contact details are never returned.
 */
export function parseICal(source: string): BlockedDateRange[] {
  if (typeof source !== 'string') throw new CalendarParseError();
  const lines = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '').split('\n').filter((line) => line.length > 0);
  if (lines[0]?.toUpperCase() !== 'BEGIN:VCALENDAR' || lines.at(-1)?.toUpperCase() !== 'END:VCALENDAR') throw new CalendarParseError();
  const components: string[] = [];
  const ranges: BlockedDateRange[] = [];
  let currentEvent: EventProperties | null = null;
  let calendarCount = 0;
  const relevant = new Set(['DTSTART', 'DTEND', 'DURATION', 'STATUS', 'TRANSP', 'RRULE', 'RDATE', 'EXDATE', 'RECURRENCE-ID']);

  for (const line of lines) {
    const separator = line.indexOf(':');
    if (separator < 1) throw new CalendarParseError();
    const [rawName, ...rawParameters] = line.slice(0, separator).split(';');
    const name = rawName.toUpperCase();
    const value = line.slice(separator + 1).trim();
    if (name === 'BEGIN') {
      const component = value.toUpperCase();
      if (component === 'VFREEBUSY') throw new CalendarParseError('This calendar uses unsupported busy-time records.');
      if (component === 'VCALENDAR') {
        if (components.length || ++calendarCount > 1) throw new CalendarParseError();
      } else if (!components.length) {
        throw new CalendarParseError();
      }
      if (component === 'VEVENT') {
        if (components.length !== 1 || components[0] !== 'VCALENDAR') throw new CalendarParseError();
        currentEvent = new Map();
      }
      components.push(component);
      continue;
    }
    if (name === 'END') {
      const component = value.toUpperCase();
      if (components.pop() !== component) throw new CalendarParseError();
      if (component === 'VEVENT') {
        if (!currentEvent) throw new CalendarParseError();
        const range = eventRange(currentEvent);
        if (range) ranges.push(range);
        currentEvent = null;
      }
      continue;
    }
    if (!components.length) throw new CalendarParseError();
    if (components.at(-1) !== 'VEVENT' || !currentEvent || !relevant.has(name)) continue;
    if (currentEvent.has(name)) throw new CalendarParseError('A calendar event contains duplicate date or status fields.');
    const parameters: Record<string, string> = {};
    for (const parameter of rawParameters) {
      const equal = parameter.indexOf('=');
      if (equal < 1) throw new CalendarParseError();
      const key = parameter.slice(0, equal).toUpperCase();
      if (Object.hasOwn(parameters, key)) throw new CalendarParseError('A calendar date contains duplicate parameters.');
      parameters[key] = parameter.slice(equal + 1).replace(/^"|"$/g, '');
    }
    currentEvent.set(name, { value, parameters });
  }
  if (components.length || currentEvent) throw new CalendarParseError();
  return mergeBlockedRanges(ranges);
}
