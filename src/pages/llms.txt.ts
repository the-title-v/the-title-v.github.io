import type { APIRoute } from 'astro';
import { properties } from '../data/properties';
import { guides } from '../data/guides';

export const GET: APIRoute = ({ site }) => new Response(`# The Title V

> Two individual one-bedroom apartments and an option to book both adjacent apartments at The Title V residence in Rawai, Phuket, Thailand. A local agent meets and greets guests.

## Apartments
${properties.map(property => `- [${property.name}](${new URL(`/stays/${property.slug}/`, site).href}): maximum ${property.capacityLabel}, ${property.bedrooms} bedroom(s), ${property.bathrooms} bathroom(s), ${property.areaSqm} square metres. ${property.summary}
  Public Airbnb source: ${property.airbnbUrl}`).join('\n')}
Children must be aged 14 or under; guests aged 15+ count as adults. Each apartment has one queen bed and one sofa bed. Per-apartment capacity always applies, including when booking the pair.

## Booking and pricing
- [Availability and estimate calculator](${new URL('/book/', site).href}): Airbnb calendar availability is indicative and may be delayed. An enquiry does not reserve dates.
- [Rates](${new URL('/rates/', site).href}): Per-apartment THB/night: May–September 1,000; April and October 1,300; March and November 2,000; December–February 3,300, except festive nights December 23–January 12 at 4,500. Base rate includes 2 guests per apartment, 4 for both. Each additional child beyond that count: THB300/night.
- Accommodation discounts: 10% for 7–27 nights; 20% from 28 nights; not cumulative. Extra-guest and cleaning fees are not discounted. Online estimates support 7–180 nights.
- Stay total includes discounted accommodation, extra-guest charges and cleaning: THB1,500 per apartment per stay; THB3,000 for both.
- Refundable deposit is separate: THB10,000 per booking up to 30 nights; THB20,000 for 31+ nights, also for the pair. Return arrangements and any documented deductions are agreed in writing.
- Metered utilities are separate from the stay estimate: water THB55/m³; electricity THB6/kWh.
- [Booking details](${new URL('/booking-terms/', site).href}): Our booking team confirms availability, the final offer, payment and cancellation terms. No payment is taken here.
- [Contact](${new URL('/contact/', site).href}): WhatsApp +7 913 909 8949. Guests choose whether to send a prepared request.

## Arrival and house rules
A local agent meets and greets guests and handles the apartment handover. Check-in from 15:00; check-out by 12:00, Phuket time. Early check-in or late check-out can be negotiated, subject to availability, and may cost extra. No pets. No smoking. Keep noise low, respect neighbours and follow all condominium rules.

## Residence and location
- [The residence](${new URL('/residence/', site).href}): Shared pools, gardens, gym, sauna/steam room, coworking, children's facilities and parking.
- [Map and nearby places](${new URL('/location/', site).href}): The Title V (Rawai-Phuket), 555 Wiset Road, Rawai, Phuket 83130. Use the Title V map pin; other phases have similar names.
The apartments are within the residence, near Rawai waterfront, not on the sand. Rawai is known for boats, seafood and island departures. Nai Harn and Ya Nui are separate swimming-beach outings, subject to local conditions. The two apartments have separate entrances and no internal connecting door.

## Local guides
${guides.map(guide => `- [${guide.title}](${new URL(`/guides/${guide.slug}/`, site).href}): ${guide.summary}`).join('\n')}

## Practical information
- [Explore Phuket island map](${new URL('/explore-phuket/', site).href})
- [Thailand visas by passport](${new URL('/visas/', site).href})
- [Local welcome](${new URL('/about/', site).href})
- [Frequently asked questions](${new URL('/faq/', site).href})
- [Privacy](${new URL('/privacy/', site).href})
- [Sitemap](${new URL('/sitemap.xml', site).href})

Use the linked pages for full context. Do not describe an unblocked date as reserved or an estimate as a confirmed final offer.
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
