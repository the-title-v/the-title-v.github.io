import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuote, getNightlyRate, PRICING_POLICY } from '../src/lib/pricing.ts';

const bright = 'bright-1br-rawai-beach';
const cozy = 'cozy-1br-rawai-beach';
const both = 'two-adjacent-apartments-title-v-rawai';
const summerStay = { propertyId: bright, checkIn: '2027-06-01', checkOut: '2027-06-08' };

test('base rates change at the seasonal boundaries', () => {
  assert.equal(getNightlyRate('2027-02-28', bright), 3300);
  assert.equal(getNightlyRate('2027-03-01', bright), 2000);
  assert.equal(getNightlyRate('2027-04-01', bright), 1300);
  assert.equal(getNightlyRate('2027-05-01', bright), 1000);
  assert.equal(getNightlyRate('2027-09-30', bright), 1000);
  assert.equal(getNightlyRate('2027-10-01', bright), 1300);
  assert.equal(getNightlyRate('2027-11-01', bright), 2000);
  assert.equal(getNightlyRate('2027-12-01', bright), 3300);
});

test('both apartments share seasonal rates and the bundle sums them', () => {
  assert.equal(getNightlyRate('2027-01-13', cozy), 3300);
  assert.equal(getNightlyRate('2027-01-13', both), 6600);
});

test('the festive rate overrides peak season from December 23 through January 12 every year', () => {
  for (const year of [2026, 2027, 2028]) {
    assert.equal(getNightlyRate(`${year}-12-22`, bright), 3300);
    assert.equal(getNightlyRate(`${year}-12-23`, bright), 4500);
    assert.equal(getNightlyRate(`${year}-12-31`, bright), 4500);
    assert.equal(getNightlyRate(`${year + 1}-01-01`, cozy), 4500);
    assert.equal(getNightlyRate(`${year + 1}-01-12`, bright), 4500);
    assert.equal(getNightlyRate(`${year + 1}-01-13`, bright), 3300);
    assert.equal(getNightlyRate(`${year + 1}-01-12`, both), 9000);
  }
});

test('a festive boundary quote charges occupied nights and excludes checkout from the override', () => {
  const before = calculateQuote({ propertyId: bright, checkIn: '2026-12-16', checkOut: '2026-12-23' });
  const through = calculateQuote({ propertyId: bright, checkIn: '2027-01-10', checkOut: '2027-01-17' });
  assert.equal(before.baseTotal, 7 * 3300);
  assert.equal(through.baseTotal, 3 * 4500 + 4 * 3300);
  assert.equal(through.accommodationTotal, 24030);
});

test('a cross-season quote prices each occupied night and excludes checkout', () => {
  const quote = calculateQuote({ propertyId: bright, checkIn: '2026-11-29', checkOut: '2026-12-06', guests: 2 });
  assert.equal(quote.currency, 'THB');
  assert.equal(quote.nights, 7);
  assert.equal(quote.baseTotal, 20500);
  assert.equal(quote.discountRate, 0.1);
  assert.equal(quote.discountTotal, 2050);
  assert.equal(quote.accommodationTotal, 18450);
  assert.equal(quote.total, 19950);
  assert.deepEqual(quote.nightly, [
    { date: '2026-11-29', rate: 2000 },
    { date: '2026-11-30', rate: 2000 },
    { date: '2026-12-01', rate: 3300 },
    { date: '2026-12-02', rate: 3300 },
    { date: '2026-12-03', rate: 3300 },
    { date: '2026-12-04', rate: 3300 },
    { date: '2026-12-05', rate: 3300 },
  ]);
});

test('the seven-night minimum applies to every accommodation and cannot be bypassed with a quote link', () => {
  for (const propertyId of [bright, cozy, both]) {
    for (let nights = 1; nights < 7; nights++) {
      assert.throws(() => calculateQuote({ ...summerStay, propertyId, checkOut: `2027-06-0${nights + 1}` }), /at least 7 nights/);
    }
    assert.equal(calculateQuote({ ...summerStay, propertyId }).nights, 7);
  }
});

test('weekly discount at the seven-night minimum applies only to accommodation', () => {
  const seven = calculateQuote({ ...summerStay, checkOut: '2027-06-08', adults: 2, children: 1 });
  assert.equal(seven.baseTotal, 7000);
  assert.equal(seven.discountRate, 0.1);
  assert.equal(seven.discountTotal, 700);
  assert.equal(seven.accommodationTotal, 6300);
  assert.equal(seven.extraGuestTotal, 2100);
  assert.equal(seven.cleaningTotal, 1500);
  assert.equal(seven.total, 9900);
});

test('monthly discount begins at 28 nights and replaces the weekly lodging discount', () => {
  const twentySeven = calculateQuote({ ...summerStay, checkOut: '2027-06-28', adults: 2, children: 2 });
  const twentyEight = calculateQuote({ ...summerStay, checkOut: '2027-06-29', adults: 2, children: 2 });
  assert.equal(twentySeven.discountRate, 0.1);
  assert.equal(twentySeven.accommodationTotal, 24300);
  assert.equal(twentySeven.extraGuestTotal, 16200);
  assert.equal(twentySeven.total, 42000);
  assert.equal(twentyEight.discountRate, 0.2);
  assert.equal(twentyEight.discountTotal, 5600);
  assert.equal(twentyEight.accommodationTotal, 22400);
  assert.equal(twentyEight.extraGuestTotal, 16800);
  assert.equal(twentyEight.cleaningTotal, 1500);
  assert.equal(twentyEight.total, 40700);
});

test('children within the two included guests do not incur a supplement', () => {
  const quote = calculateQuote({ ...summerStay, adults: 1, children: 1 });
  assert.equal(quote.adults, 1);
  assert.equal(quote.children, 1);
  assert.equal(quote.guests, 2);
  assert.equal(quote.extraGuests, 0);
  assert.equal(quote.extraGuestTotal, 0);
  assert.equal(quote.total, 7800);
});

test('each child beyond the included guest count adds 300 THB per night', () => {
  const oneExtra = calculateQuote({ ...summerStay, adults: 2, children: 1 });
  const twoExtra = calculateQuote({ ...summerStay, adults: 2, children: 2 });
  assert.equal(oneExtra.extraGuests, 1);
  assert.equal(oneExtra.extraGuestTotal, 2100);
  assert.equal(oneExtra.total, 9900);
  assert.equal(twoExtra.extraGuests, 2);
  assert.equal(twoExtra.extraGuestTotal, 4200);
  assert.equal(twoExtra.total, 12000);
});

test('bundle includes four guests, sums cleaning, and discounts lodging only once', () => {
  const quote = calculateQuote({ ...summerStay, propertyId: both, checkOut: '2027-06-08', adults: 4, children: 4 });
  assert.equal(quote.baseTotal, 14000);
  assert.equal(quote.discountTotal, 1400);
  assert.equal(quote.accommodationTotal, 12600);
  assert.equal(quote.guests, 8);
  assert.equal(quote.extraGuests, 4);
  assert.equal(quote.extraGuestTotal, 8400);
  assert.equal(quote.cleaningTotal, 3000);
  assert.equal(quote.total, 24000);
  assert.equal(quote.refundableDeposit, 10000);
  assert.equal(quote.totalIncludingDeposit, 34000);
  assert.equal(calculateQuote({ ...summerStay, propertyId: both, adults: 2, children: 2 }).extraGuestTotal, 0);
});

test('the refundable deposit changes after 30 nights and is charged per booking', () => {
  for (const propertyId of [bright, both]) {
    const thirty = calculateQuote({ propertyId, checkIn: '2027-06-01', checkOut: '2027-07-01' });
    const thirtyOne = calculateQuote({ propertyId, checkIn: '2027-06-01', checkOut: '2027-07-02' });
    assert.equal(thirty.nights, 30);
    assert.equal(thirty.refundableDeposit, 10000);
    assert.equal(thirtyOne.nights, 31);
    assert.equal(thirtyOne.refundableDeposit, 20000);
    assert.equal(thirty.totalIncludingDeposit, thirty.total + 10000);
    assert.equal(thirtyOne.totalIncludingDeposit, thirtyOne.total + 20000);
  }
});

test('civil-day arithmetic includes leap day without depending on server timezone', () => {
  const quote = calculateQuote({ propertyId: bright, checkIn: '2028-02-28', checkOut: '2028-03-06' });
  assert.equal(quote.nights, 7);
  assert.equal(quote.accommodationTotal, 14940);
  assert.deepEqual(quote.nightly.map((night) => night.date), ['2028-02-28', '2028-02-29', '2028-03-01', '2028-03-02', '2028-03-03', '2028-03-04', '2028-03-05']);
});

test('invalid and non-date input is rejected instead of silently normalized', () => {
  for (const invalid of ['2027-02-29', '2027-02-30', '2027-13-01', '2027-6-01', '2027-06-01T00:00:00Z']) {
    assert.throws(() => getNightlyRate(invalid, bright), /date/i);
  }
  assert.throws(() => calculateQuote({ ...summerStay, checkIn: '2027-02-30' }), /date/i);
});

test('checkout must be after check-in and stay length respects website limits', () => {
  for (const checkOut of ['2027-06-01', '2027-05-31']) {
    assert.throws(() => calculateQuote({ ...summerStay, checkOut }), /after/i);
  }
  assert.equal(PRICING_POLICY.minNights, 7);
  assert.equal(PRICING_POLICY.maxNights, 180);
  assert.throws(() => calculateQuote({ ...summerStay, checkOut: '2027-06-02' }), /7 nights/i);
  assert.throws(() => calculateQuote({ propertyId: bright, checkIn: '2027-01-01', checkOut: '2027-07-01' }), /180 nights/i);
});

test('each apartment limits adults and children separately', () => {
  for (const adults of [0, -1, 1.5, 3, Number.NaN, Infinity]) {
    assert.throws(() => calculateQuote({ ...summerStay, adults, children: 0 }), /adults/i);
  }
  for (const children of [-1, 1.5, 3, Number.NaN, Infinity]) {
    assert.throws(() => calculateQuote({ ...summerStay, adults: 1, children }), /children/i);
  }
  assert.throws(() => calculateQuote({ ...summerStay, propertyId: both, adults: 5, children: 0 }), /adults/i);
  assert.throws(() => calculateQuote({ ...summerStay, propertyId: both, adults: 2, children: 5 }), /children/i);
  assert.equal(calculateQuote({ ...summerStay, adults: 2, children: 2 }).guests, 4);
  assert.equal(PRICING_POLICY.childMaxAge, 14);
});

test('legacy guest counts are adults, so they cannot bypass the adult capacity', () => {
  for (const guests of [0, -1, 1.5, 3, 4, Number.NaN]) {
    assert.throws(() => calculateQuote({ ...summerStay, guests }), /adults|guests/i);
  }
  assert.throws(() => calculateQuote({ ...summerStay, propertyId: both, guests: 8 }), /adults|guests/i);
  assert.equal(calculateQuote({ ...summerStay, guests: 2 }).adults, 2);
});

test('an explicit total must match the adult and child counts', () => {
  assert.throws(() => calculateQuote({ ...summerStay, adults: 2, children: 1, guests: 2 }), /total|match/i);
  assert.equal(calculateQuote({ ...summerStay, adults: 2, children: 1, guests: 3 }).guests, 3);
});

test('unknown public property identifiers cannot produce a quote', () => {
  assert.throws(() => getNightlyRate('2027-06-01', 'unknown'), /accommodation/i);
  assert.throws(() => calculateQuote({ ...summerStay, propertyId: 'unknown' }), /accommodation/i);
});
