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
  maxAdultsPerApartment: 2,
  maxChildrenPerApartment: 2,
  childMaxAge: 14,
  includedGuestsPerApartment: 2,
  extraGuestNightlyRate: 300,
  cleaningPerApartment: 1500,
  shortStayDeposit: 10000,
  longStayDeposit: 20000,
  longStayDepositMinNights: 31,
  waterPerCubicMeter: 55,
  electricityPerKwh: 6,
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
  adults?: number;
  /** Children aged 14 or under. Guests aged 15+ must be counted as adults. */
  children?: number;
  /** Legacy guests-only requests count every guest as an adult. */
  guests?: number;
};

export type Occupancy = { adults: number; children: number; guests: number };

export type Quote = {
  propertyId: PropertyId;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guests: number;
  currency: 'THB';
  nights: number;
  baseTotal: number;
  discountRate: number;
  discountTotal: number;
  discountLabel: 'Weekly stay' | 'Monthly stay' | null;
  accommodationTotal: number;
  extraGuests: number;
  extraGuestTotal: number;
  cleaningTotal: number;
  refundableDeposit: number;
  /** Stay total, excluding the refundable deposit and metered utilities. */
  total: number;
  totalIncludingDeposit: number;
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

export function getOccupancyLimits(propertyId: string) {
  const apartments = apartmentCount(propertyId);
  return {
    maxAdults: apartments * PRICING_POLICY.maxAdultsPerApartment,
    maxChildren: apartments * PRICING_POLICY.maxChildrenPerApartment,
    includedGuests: apartments * PRICING_POLICY.includedGuestsPerApartment,
  };
}

export function resolveOccupancy(propertyId: string, input: Pick<QuoteInput, 'adults' | 'children' | 'guests'>): Occupancy {
  const { maxAdults, maxChildren } = getOccupancyLimits(propertyId);
  const adults = input.adults ?? input.guests ?? 2;
  const children = input.children ?? 0;
  if (!Number.isInteger(adults) || adults < 1 || adults > maxAdults) {
    throw new RangeError(`Choose between 1 and ${maxAdults} adults. Guests aged 15 or over count as adults.`);
  }
  if (!Number.isInteger(children) || children < 0 || children > maxChildren) {
    throw new RangeError(`Choose between 0 and ${maxChildren} children aged ${PRICING_POLICY.childMaxAge} or under.`);
  }
  const guests = adults + children;
  if (input.guests !== undefined && input.guests !== guests) {
    throw new RangeError('The total guest count must match the adults and children.');
  }
  return { adults, children, guests };
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

/** Stay estimate with separate fees and refundable deposit. Availability is checked separately. */
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
  const occupancy = resolveOccupancy(input.propertyId, input);

  const nightly = Array.from({ length: nights }, (_, index) => {
    const date = new Date(start + index * DAY_MS).toISOString().slice(0, 10);
    return { date, rate: getNightlyRate(date, input.propertyId) };
  });
  const baseTotal = nightly.reduce((sum, night) => sum + night.rate, 0);
  const monthly = nights >= PRICING_POLICY.monthlyMinNights;
  const weekly = nights >= PRICING_POLICY.weeklyMinNights;
  const discountRate = monthly ? PRICING_POLICY.monthlyDiscountRate : weekly ? PRICING_POLICY.weeklyDiscountRate : 0;
  const discountTotal = Math.round(baseTotal * discountRate);
  const accommodationTotal = baseTotal - discountTotal;
  const extraGuests = Math.max(0, occupancy.guests - apartments * PRICING_POLICY.includedGuestsPerApartment);
  const extraGuestTotal = extraGuests * PRICING_POLICY.extraGuestNightlyRate * nights;
  const cleaningTotal = apartments * PRICING_POLICY.cleaningPerApartment;
  const refundableDeposit = nights >= PRICING_POLICY.longStayDepositMinNights
    ? PRICING_POLICY.longStayDeposit : PRICING_POLICY.shortStayDeposit;
  const total = accommodationTotal + extraGuestTotal + cleaningTotal;

  return {
    propertyId: input.propertyId as PropertyId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    ...occupancy,
    currency: PRICING_POLICY.currency,
    nights,
    baseTotal,
    discountRate,
    discountTotal,
    discountLabel: monthly ? 'Monthly stay' : weekly ? 'Weekly stay' : null,
    accommodationTotal,
    extraGuests,
    extraGuestTotal,
    cleaningTotal,
    refundableDeposit,
    total,
    totalIncludingDeposit: total + refundableDeposit,
    nightly,
  };
}
