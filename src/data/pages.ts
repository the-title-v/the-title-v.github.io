import { site, whatsappUrl } from './site';

export const informationPages = [
  {
    slug: 'about', eyebrow: 'A LOCAL WELCOME', title: 'Feel at home, from arrival.',
    description: 'Meet your local host team at The Title V, Rawai: a personal welcome, two comfortable apartments and direct booking for a week or longer.',
    intro: 'Your own apartment. A friendly face when you arrive.',
    image: '/images/residence-entrance.webp', alt: 'Covered entrance and tropical planting at The Title V',
    sections: [
      { heading: 'We’ll meet you here', paragraphs: ['Our local agent welcomes you, hands over the keys and shows you the essentials. Send your flight details and arrival time before you travel.', 'Check in from 3 pm and check out by noon. Ask us about earlier or later arrangements.'] },
      { heading: 'Space to settle in', paragraphs: ['Bright and Cozy sit next door to each other. Each has a queen bedroom, a living room with a sofa bed, a kitchen, a washer and a balcony — plus shared pools and gardens downstairs.'] },
      { heading: 'Book with a conversation', paragraphs: ['Choose your dates and send us an enquiry. We’ll confirm your price, availability and booking details on WhatsApp.'] },
    ], cta: 'Say hello', ctaUrl: 'https://wa.me/79139098949',
  },
  {
    slug: 'contact', eyebrow: 'WE’RE HERE TO HELP', title: 'Contact us.',
    description: 'Contact The Title V on WhatsApp for questions about our Rawai apartments, your stay or a booking.',
    intro: 'Questions about the apartments or your stay? Message our booking team on WhatsApp.',
    image: '/images/garden-walkway.webp', alt: 'Shaded walkway through the gardens at The Title V',
    sections: [
      { heading: 'Say hello on WhatsApp', paragraphs: [`WhatsApp: ${site.whatsappDisplay}.`, 'Ask us anything — you don’t need to choose dates or an apartment first.'] },
    ], cta: `WhatsApp ${site.whatsappDisplay}`, ctaUrl: whatsappUrl,
  },
  {
    slug: 'booking-terms', eyebrow: 'GOOD TO KNOW', title: 'The details of your stay.',
    description: 'The Title V stay details: seven-night minimum, guest limits, cleaning, deposits, utilities, arrival times and house rules.',
    intro: 'The essentials, before you book.',
    sections: [
      { heading: 'Booking & payment', paragraphs: ['Stays start at seven nights. Send an enquiry from the calendar; our team confirms availability, your final price, payment schedule and cancellation terms in writing before you pay. An enquiry does not hold dates.'] },
      { heading: 'Your group', paragraphs: ['Each apartment sleeps up to 2 adults and 2 children aged 14 or under, with a queen bed and sofa bed. Guests aged 15+ count as adults. Book both apartments for up to 4 adults and 4 children, with the same limit in each.', 'Two guests are included per apartment. Each additional child costs ฿300 per night.'] },
      { heading: 'Rates & cleaning', paragraphs: ['Accommodation is discounted 10% for 7–27 nights or 20% for 28+ nights. Each night uses its seasonal rate, including festive pricing from December 23 to January 12.', 'Cleaning is ฿1,500 per apartment per stay (฿3,000 for both), included in your estimate. Cleaning and extra-child charges are not discounted.'] },
      { heading: 'Refundable deposit', paragraphs: ['฿10,000 per booking for up to 30 nights; ฿20,000 for longer stays, including when booking both apartments. It is separate from the stay price. We agree on return arrangements and any deductions before booking.'] },
      { heading: 'Electricity & water', paragraphs: ['Electricity: ฿6/kWh. Water: ฿55/m³. Both are metered and charged by use; your local agent explains the readings at handover.'] },
      { heading: 'Arrival & departure', paragraphs: ['Our local agent meets you on arrival. Check-in is from 3 pm and check-out is by noon, Phuket time. Early check-in or late check-out may be available at extra cost — please arrange it ahead.'] },
      { heading: 'House rules', paragraphs: ['No pets. No smoking. Keep noise low, respect neighbours and follow the condominium’s rules, including pool and gym hours.'] },
      { heading: 'Changes & cancellations', paragraphs: ['Payment, cancellation and refund conditions are agreed in writing for your booking. Contact us if your plans change. The website takes no payments.'] },
    ], cta: 'Ask about your stay', ctaUrl: 'https://wa.me/79139098949',
  },
  {
    slug: 'privacy', eyebrow: 'YOUR PRIVACY', title: 'A simple stay starts here.',
    description: 'How The Title V handles booking selections, weather, currency, maps and WhatsApp enquiries. No account or card details required.',
    intro: 'Browse freely. You choose when to contact us.',
    sections: [
      { heading: 'Booking selections', paragraphs: ['Your apartment, dates and guest counts are processed in your browser and may appear in the page URL. The website does not ask for an account or card details. Public calendar files show blocked dates and update times. Guest details and private calendar links are never published.'] },
      { heading: 'Weather, currency & maps', paragraphs: ['Weather loads from MET Norway, exchange rates from ExchangeRate-API, and maps from Google Maps or OpenStreetMap. These services receive your IP address and normal browser request details. Weather requests use Rawai’s location, not your device location.', 'Your browser may cache weather and currency data and remember your selected currency. You can clear these through your browser settings.'] },
      { heading: 'Contacting us', paragraphs: ['The booking button opens a prepared WhatsApp message. You decide whether to send it. WhatsApp and other linked services apply their own privacy policies.', 'For privacy questions, contact our booking team on WhatsApp.'] },
    ], cta: 'Contact the booking team', ctaUrl: 'https://wa.me/79139098949',
  },
];
