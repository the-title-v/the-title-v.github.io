import { PRICING_POLICY, resolveOccupancy, type Quote } from './pricing';
import { isStayAvailable, type BlockedDateRange } from './calendar';
import { whatsappUrl } from '../data/site';
import type { CurrencyCode } from './currency';

export function bangkokToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

/** Explain impossible minimum stays using known blocks, even if their snapshot is stale. */
export function minimumStayIssue(checkIn: string, horizon: string, blocked: readonly BlockedDateRange[]): 'blocked' | 'horizon' | null {
  if (!checkIn) return null;
  const arrival = Date.parse(`${checkIn}T12:00:00Z`);
  if (!Number.isFinite(arrival) || new Date(arrival).toISOString().slice(0, 10) !== checkIn) return null;
  const earliestCheckOut = addDays(checkIn, PRICING_POLICY.minNights);
  if (earliestCheckOut > horizon) return 'horizon';
  return isStayAvailable(checkIn, earliestCheckOut, blocked) ? null : 'blocked';
}

export const formatTHB = (value: number) => `฿${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`;

/** Validate shared links with exactly the same occupancy rules as the calculator. */
export function readBookingOccupancy(params: URLSearchParams, propertyId: string) {
  const count = (key: 'adults' | 'children' | 'guests') => {
    const values = params.getAll(key);
    if (values.length > 1) throw new RangeError(`Include the ${key} count only once.`);
    if (!values.length) return undefined;
    if (!/^\d+$/.test(values[0])) throw new RangeError(`Use a whole number for the ${key} count.`);
    return Number(values[0]);
  };
  return resolveOccupancy(propertyId, { adults: count('adults'), children: count('children'), guests: count('guests') });
}

export type BookingSelection = {
  property: string; checkIn: string; checkOut: string;
  adults: number; children: number; guestLinkError: string;
};

/** Restore only supported selections; availability is always checked separately. */
export function readBookingSelection(params: URLSearchParams, properties: readonly string[], today = bangkokToday()): BookingSelection {
  const requested = params.get('property') || '';
  const property = properties.includes(requested) ? requested : properties[0];
  const selection: BookingSelection = { property, checkIn: '', checkOut: '', adults: 2, children: 0, guestLinkError: '' };
  try {
    const occupancy = readBookingOccupancy(params, property);
    selection.adults = occupancy.adults;
    selection.children = occupancy.children;
  } catch (error) {
    selection.guestLinkError = error instanceof Error ? error.message : 'Please check your guest counts.';
  }
  const validDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const time = Date.parse(`${value}T12:00:00Z`);
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
  };
  const arrival = params.get('checkIn') || '';
  const departure = params.get('checkOut') || '';
  const horizon = addDays(today, 365);
  if (validDate(arrival) && arrival >= today && arrival <= horizon) {
    selection.checkIn = arrival;
    if (validDate(departure) && departure > arrival && departure <= horizon) selection.checkOut = departure;
  }
  return selection;
}

/** Keep a copyable URL without dropping campaign parameters or page anchors. */
export function bookingUrl(href: string, selection: BookingSelection, currency: CurrencyCode): string {
  const url = new URL(href);
  url.searchParams.set('property', selection.property);
  for (const key of ['checkIn', 'checkOut'] as const) {
    if (selection[key]) url.searchParams.set(key, selection[key]);
    else url.searchParams.delete(key);
  }
  // Do not silently turn an invalid guest link into an accepted quote on reload.
  if (!selection.guestLinkError) {
    url.searchParams.delete('guests');
    url.searchParams.set('adults', String(selection.adults));
    url.searchParams.set('children', String(selection.children));
  }
  url.searchParams.set('currency', currency);
  return url.href;
}

export function buildWhatsAppRequest(propertyName: string, quote: Quote, calendarStatus: 'snapshot' | 'unavailable'): string {
  const money = (value: number) => `${value.toLocaleString('en-US')} THB`;
  const guests = `${quote.adults} adult${quote.adults === 1 ? '' : 's'}${quote.children ? `, ${quote.children} ${quote.children === 1 ? 'child' : 'children'} (${PRICING_POLICY.childMaxAge} or under)` : ''}`;
  const lines = [
    `Hello, I’d like to enquire about ${propertyName}.`,
    `${quote.checkIn} → ${quote.checkOut} (${quote.nights} nights)`,
    guests,
    `Estimate: ${money(quote.total)} including cleaning; utilities and deposit extra.`,
    calendarStatus === 'snapshot'
      ? 'Please confirm availability and price.'
      : 'Please confirm availability and price — the calendar is unverified.',
  ];
  return `${whatsappUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}
