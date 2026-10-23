import { PRICING_POLICY, resolveOccupancy, type Quote } from './pricing';
import { whatsappUrl } from '../data/site';

export function bangkokToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
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

export function buildWhatsAppRequest(propertyName: string, quote: Quote, calendarStatus: 'live' | 'unavailable'): string {
  const money = (value: number) => `${value.toLocaleString('en-US')} THB`;
  const lines = [
    `Hello, I’d like to enquire about ${propertyName}.`,
    `Check-in: ${quote.checkIn} (from 15:00)`,
    `Check-out: ${quote.checkOut} (by 12:00; ${quote.nights} nights)`,
    `${quote.guests} guest${quote.guests === 1 ? '' : 's'} (${quote.adults} adult${quote.adults === 1 ? '' : 's'}, ${quote.children} ${quote.children === 1 ? 'child' : 'children'} aged ${PRICING_POLICY.childMaxAge} or under). Guests aged 15+ count as adults.`,
    `Accommodation (${quote.nights} nights, before discount): ${money(quote.baseTotal)}`,
    ...(quote.discountRate ? [
      `${quote.discountLabel} discount (${quote.discountRate * 100}%, accommodation only): −${money(quote.discountTotal)}`,
      `Accommodation after discount: ${money(quote.accommodationTotal)}`,
    ] : []),
    `Extra children (${quote.extraGuests} × ${PRICING_POLICY.extraGuestNightlyRate} THB × ${quote.nights} nights): ${money(quote.extraGuestTotal)}`,
    `Cleaning (per stay): ${money(quote.cleaningTotal)}`,
    `Stay total (excluding utilities and refundable deposit): ${money(quote.total)}`,
    `Refundable deposit (separate, per booking): ${money(quote.refundableDeposit)}`,
    `Stay total plus refundable deposit (excluding utilities): ${money(quote.totalIncludingDeposit)}`,
    `Water: ${PRICING_POLICY.waterPerCubicMeter} THB/m³; electricity: ${PRICING_POLICY.electricityPerKwh} THB/kWh. Both are metered and excluded from the estimate.`,
    'A local agent will meet us for check-in. Early check-in and late check-out are on request, subject to availability and may cost extra.',
    calendarStatus === 'live' ? 'The website calendar showed no date conflicts when checked.' : 'The calendar could not be verified for these dates.',
    'Please confirm availability, the estimate, deposit arrangements, payment and cancellation terms.',
    'I understand this is a request, not a confirmed booking.',
  ];
  return `${whatsappUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}
