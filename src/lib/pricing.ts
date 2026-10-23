/** Public reference pricing. Source and limitations: docs/pricing-methodology.md. */
export type PropertyId =
  | 'bright-1br-rawai-beach'
  | 'cozy-1br-rawai-beach'
  | 'two-adjacent-apartments-title-v-rawai';

export const PRICING_POLICY = {
  currency: 'THB',
  timeZone: 'Asia/Bangkok',
  minNights: 2,
  maxNights: 180,
  maxGuestsPerApartment: 4,
  weeklyMinNights: 7,
  weeklyDiscountRate: 0.1,
  monthlyMinNights: 28,
  monthlyDiscountRate: 0.2,
} as const;

export const SEASONAL_RATES = [
  { id: 'green', name: 'Green season', months: [5, 6, 7, 8, 9], nightlyRate: 1000 },
  { id: 'shoulder', name: 'Shoulder season', months: [4, 10], nightlyRate: 1300 },
  { id: 'high', name: 'High season', months: [3, 11], nightlyRate: 2000 },
  { id: 'peak', name: 'Peak season', months: [12, 1, 2], nightlyRate: 3300 },
] as const;

const APARTMENT_COUNTS: Record<PropertyId, number> = {
  'bright-1br-rawai-beach': 1,
  'cozy-1br-rawai-beach': 1,
  'two-adjacent-apartments-title-v-rawai': 2,
};
const DAY_MS = 86_400_000;

export type QuoteInput = {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
};

export type Quote = {
  propertyId: PropertyId;
  checkIn: string;
  checkOut: string;
  guests: number;
  currency: 'THB';
  nights: number;
  baseTotal: number;
  discountRate: number;
  discountTotal: number;
  discountLabel: 'Weekly stay' | 'Monthly stay' | null;
  total: number;
  nightly: { date: string; rate: number }[];
};

function dateToTime(date: string): number {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new RangeError('Use a valid date in YYYY-MM-DD format.');
  }
  const time = Date.parse(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date) {
    throw new RangeError('Use a valid calendar date.');
  }
  return time;
}

function apartmentCount(propertyId: string): number {
  if (!Object.hasOwn(APARTMENT_COUNTS, propertyId)) {
    throw new RangeError('Choose a valid accommodation.');
  }
  return APARTMENT_COUNTS[propertyId as PropertyId];
}

/** A date is a Bangkok civil date; it is never parsed in the server's local zone. */
export function getNightlyRate(date: string, propertyId: string): number {
  const time = dateToTime(date);
  const apartments = apartmentCount(propertyId);
  const month = new Date(time).getUTCMonth() + 1;
  const season = SEASONAL_RATES.find((entry) => (entry.months as readonly number[]).includes(month));
  if (!season) throw new RangeError('No reference rate is configured for this date.');
  return season.nightlyRate * apartments;
}

/** Accommodation estimate only. Availability and host confirmation are separate. */
export function calculateQuote(input: QuoteInput): Quote {
  const apartments = apartmentCount(input.propertyId);
  const start = dateToTime(input.checkIn);
  const end = dateToTime(input.checkOut);
  if (end <= start) throw new RangeError('Check-out must be after check-in.');
  const nights = (end - start) / DAY_MS;
  if (nights < PRICING_POLICY.minNights) {
    throw new RangeError(`Choose a stay of at least ${PRICING_POLICY.minNights} nights.`);
  }
  if (nights > PRICING_POLICY.maxNights) {
    throw new RangeError(`For stays longer than ${PRICING_POLICY.maxNights} nights, contact the host.`);
  }
  const guests = input.guests ?? 2;
  const maxGuests = apartments * PRICING_POLICY.maxGuestsPerApartment;
  if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests) {
    throw new RangeError(`Choose between 1 and ${maxGuests} guests for this accommodation.`);
  }

  const nightly = Array.from({ length: nights }, (_, index) => {
    const date = new Date(start + index * DAY_MS).toISOString().slice(0, 10);
    return { date, rate: getNightlyRate(date, input.propertyId) };
  });
  const baseTotal = nightly.reduce((sum, night) => sum + night.rate, 0);
  const monthly = nights >= PRICING_POLICY.monthlyMinNights;
  const weekly = nights >= PRICING_POLICY.weeklyMinNights;
  const discountRate = monthly ? PRICING_POLICY.monthlyDiscountRate : weekly ? PRICING_POLICY.weeklyDiscountRate : 0;
  const discountTotal = Math.round(baseTotal * discountRate);

  return {
    propertyId: input.propertyId as PropertyId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests,
    currency: PRICING_POLICY.currency,
    nights,
    baseTotal,
    discountRate,
    discountTotal,
    discountLabel: monthly ? 'Monthly stay' : weekly ? 'Weekly stay' : null,
    total: baseTotal - discountTotal,
    nightly,
  };
}
