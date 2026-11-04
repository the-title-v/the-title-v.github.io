import type { Guide } from './guides';
import { images } from './properties';
import { calculateQuote, PRICING_POLICY, type Quote, type QuoteInput } from '../lib/pricing';

const money = (value: number) => `฿${value.toLocaleString('en-US')}`;
const examples: { label: string; dates: string; input: QuoteInput }[] = [
  {
    label: 'A couple over Christmas', dates: '20–27 December 2026',
    input: { propertyId: 'bright-1br-rawai-beach', checkIn: '2026-12-20', checkOut: '2026-12-27', adults: 2, children: 0 },
  },
  {
    label: 'A family for two weeks', dates: '1–15 February 2027',
    input: { propertyId: 'cozy-1br-rawai-beach', checkIn: '2027-02-01', checkOut: '2027-02-15', adults: 2, children: 2 },
  },
  {
    label: 'A couple for February', dates: '1 February–1 March 2027',
    input: { propertyId: 'bright-1br-rawai-beach', checkIn: '2027-02-01', checkOut: '2027-03-01', adults: 2, children: 0 },
  },
  {
    label: 'A couple for March', dates: '1 March–1 April 2027',
    input: { propertyId: 'cozy-1br-rawai-beach', checkIn: '2027-03-01', checkOut: '2027-04-01', adults: 2, children: 0 },
  },
  {
    label: 'Two couples in two apartments', dates: '1–29 May 2027',
    input: { propertyId: 'two-adjacent-apartments-title-v-rawai', checkIn: '2027-05-01', checkOut: '2027-05-29', adults: 4, children: 0 },
  },
];
const quotes = examples.map(example => calculateQuote(example.input));
const breakdown = (quote: Quote) => ({
  headings: ['Budget line', 'Amount'],
  rows: [
    ['Accommodation before discount', money(quote.baseTotal)],
    [`${quote.discountLabel} discount (${quote.discountRate * 100}%)`, `−${money(quote.discountTotal)}`],
    ['Accommodation after discount', money(quote.accommodationTotal)],
    ['Additional children', money(quote.extraGuestTotal)],
    ['Cleaning for the stay', money(quote.cleaningTotal)],
    ['Stay estimate', money(quote.total)],
    ['Refundable deposit, separate', money(quote.refundableDeposit)],
    ['Stay estimate plus deposit; utilities extra', money(quote.totalIncludingDeposit)],
  ],
});

export const stayBudgetGuide: Guide = {
  slug: 'title-v-rawai-stay-budget-examples',
  title: '5 worked examples of a stay budget at The Title V',
  seoTitle: '5 Rawai Apartment Stay Budget Examples | The Title V',
  heading: '5 worked examples of a stay budget at The Title V',
  metaDescription: 'Compare five dated Rawai apartment budgets for couples, families and two apartments, with accommodation discounts, cleaning and refundable deposits explained.',
  intro: `Your dates, length of stay and group determine the apartment estimate. These five examples use our published direct-stay rates and show accommodation, cleaning and any additional-child charges, with the refundable deposit kept separate. Electricity at ${money(PRICING_POLICY.electricityPerKwh)}/kWh and water at ${money(PRICING_POLICY.waterPerCubicMeter)}/m³ are extra. Food, transport and activities are outside these apartment budgets.`,
  updatedAt: '2026-11-04',
  category: 'listicle',
  eyebrow: 'Put numbers to your plans',
  summary: 'A Christmas week, a family fortnight and three longer stays: see exactly how the apartment estimate adds up.',
  hero: images.cozyDining,
  readTime: '5 min read',
  sections: [
    {
      heading: 'Five examples at a glance',
      paragraphs: [
        'These are planning examples using rates reviewed on 4 November 2026, not offers of available dates. Check-in is included in the night count; check-out is not. The booking team confirms your dates, final price, payment schedule and cancellation terms in writing before payment.',
        `Stays of ${PRICING_POLICY.weeklyMinNights}–${PRICING_POLICY.monthlyMinNights - 1} nights receive ${PRICING_POLICY.weeklyDiscountRate * 100}% off accommodation; ${PRICING_POLICY.monthlyMinNights} nights or more receive ${PRICING_POLICY.monthlyDiscountRate * 100}%. The discounts do not stack and do not reduce cleaning or additional-child charges.`,
      ],
      table: {
        headings: ['Example and dates', 'Stay estimate', 'Refundable deposit extra'],
        rows: examples.map((example, index) => [
          `${example.label} · ${example.dates} · ${quotes[index].nights} nights`,
          money(quotes[index].total), money(quotes[index].refundableDeposit),
        ]),
      },
      links: [{ title: 'Calculate your own dates and guests', url: '/book/' }],
    },
    {
      heading: '1. A couple staying for a Christmas week',
      paragraphs: [
        `For two adults in Bright, arriving on 20 December and leaving on 27 December 2026, the seven occupied nights cross a rate change. The first three nights cost ${money(quotes[0].nightly[0].rate)} each; the four nights from 23 December cost ${money(quotes[0].nightly[3].rate)} each.`,
        `The weekly discount brings accommodation to ${money(quotes[0].accommodationTotal)}. With cleaning, the stay estimate is ${money(quotes[0].total)}. Set aside the refundable deposit separately, then allow for your actual metered utilities and everyday spending. A week with different dates can have a different total.`,
      ],
      table: breakdown(quotes[0]),
      links: [{ title: 'See the Bright apartment', url: '/stays/bright-1br-rawai-beach/' }],
    },
    {
      heading: '2. A family spending two weeks in February',
      paragraphs: [
        `This example puts two adults and two children aged ${PRICING_POLICY.childMaxAge} or under in Cozy from 1 to 15 February 2027. The base rate includes two guests; the two additional children add ${money(PRICING_POLICY.extraGuestNightlyRate)} each per night, or ${money(quotes[1].extraGuestTotal)} over fourteen nights.`,
        `After the accommodation discount, the children's charges and cleaning bring the estimate to ${money(quotes[1].total)}. The queen bedroom and living-room sofa bed are the sleeping spaces. Guests aged ${PRICING_POLICY.childMaxAge + 1} or older count as adults, so include every child's age when requesting a stay.`,
      ],
      table: breakdown(quotes[1]),
      links: [{ title: 'Plan your family stay', url: '/guides/phuket-with-children/' }],
    },
    {
      heading: '3. A couple staying for all of February',
      paragraphs: [
        `From 1 February to 1 March 2027 is twenty-eight nights. For two adults in Bright, that qualifies for the ${PRICING_POLICY.monthlyDiscountRate * 100}% monthly accommodation discount, giving a stay estimate of ${money(quotes[2].total)} including cleaning. No additional-guest charge applies.`,
        `The refundable deposit remains ${money(quotes[2].refundableDeposit)} because this booking is no longer than thirty nights. A monthly discount is based on the number of nights, so you can also qualify without arriving on the first day of a calendar month. Use your exact dates to see the seasonal rates.`,
      ],
      table: breakdown(quotes[2]),
      links: [{ title: 'Read the monthly-stay cost checklist', url: '/guides/monthly-condo-rawai-cost-checklist/' }],
    },
    {
      heading: '4. A couple making March their island month',
      paragraphs: [
        `Two adults staying in Cozy from 1 March to 1 April 2027 have thirty-one nights at the published March rate of ${money(quotes[3].nightly[0].rate)}. After the monthly discount and cleaning, their stay estimate is ${money(quotes[3].total)}.`,
        `For bookings of ${PRICING_POLICY.longStayDepositMinNights} nights or more, the refundable deposit becomes ${money(quotes[3].refundableDeposit)} per booking. That changes the funds to set aside; it is not an extra accommodation charge. Confirm the deposit return arrangements in your written booking terms.`,
      ],
      table: breakdown(quotes[3]),
      links: [{ title: 'Explore monthly stays in Rawai', url: '/guides/long-stays-in-rawai/' }],
    },
    {
      heading: '5. Two couples booking both apartments in May',
      paragraphs: [
        `For four adults, two in Bright and two in Cozy, 1–29 May 2027 is a twenty-eight-night booking for both adjacent apartments. Accommodation for both starts at ${money(quotes[4].baseTotal)} before the monthly discount. Cleaning is ${money(quotes[4].cleaningTotal)} for the pair, making the combined stay estimate ${money(quotes[4].total)}.`,
        `The refundable deposit is ${money(quotes[4].refundableDeposit)} for this single booking covering both apartments. If the two couples divide the stay estimate equally, each couple's share is ${money(quotes[4].total / 2)}, before the deposit and utilities. Each home has its own entrance, kitchen and bathroom. Confirm both apartments are available together for your dates.`,
      ],
      table: breakdown(quotes[4]),
      links: [{ title: 'Explore the two adjacent apartments', url: '/stays/two-adjacent-apartments-title-v-rawai/' }],
    },
    {
      heading: 'Turn an example into your own plan',
      paragraphs: [
        `Metered utilities depend on use. To illustrate the arithmetic only, 100 kWh of electricity plus 5 m³ of water would cost ${money(100 * PRICING_POLICY.electricityPerKwh + 5 * PRICING_POLICY.waterPerCubicMeter)}; those quantities are not a consumption forecast for any of these stays. Ask about readings and settlement at handover.`,
        'Enter your accommodation, dates and full group in the booking calendar, then send the request to our booking team. An enquiry does not reserve the dates. Keep the confirmed stay price, separate charges and refundable deposit as three clear parts of your plan.',
      ],
      links: [{ title: 'Check dates and request your stay', url: '/book/' }],
    },
  ],
  sources: [
    { title: 'The Title V seasonal rates and stay discounts', url: '/rates/' },
    { title: 'The Title V deposit, utilities and booking terms', url: '/booking-terms/' },
    { title: 'Calculate a direct-stay estimate', url: '/book/' },
  ],
  relatedGuides: ['monthly-condo-rawai-cost-checklist', 'rawai-direct-airbnb-booking-comparison', 'adjacent-apartments-rawai-trip-ideas'],
};
