import type { Guide } from './guides';
import { images } from './properties';

const checked = '2026-11-01';
const links = {
  bright: { title: 'Step inside Bright', url: '/stays/bright-1br-rawai-beach/' },
  cozy: { title: 'Step inside Cozy', url: '/stays/cozy-1br-rawai-beach/' },
  residence: { title: 'Explore the pools and shared facilities', url: '/residence/' },
  location: { title: 'Discover our Rawai neighborhood', url: '/location/' },
  rates: { title: 'See rates and longer-stay discounts', url: '/rates/' },
  terms: { title: 'The details of your stay', url: '/booking-terms/' },
  pair: { title: 'See our two apartments side by side', url: '/stays/two-adjacent-apartments-title-v-rawai/' },
};

export const comparisonGuides: Guide[] = [
  {
    slug: 'the-title-rawai-phases-comparison',
    title: 'The Title Rawai phases 1–2, III or V?',
    seoTitle: 'The Title Rawai 1–2, III or V? Stay at The Title V',
    heading: 'A newer Rawai home, made for holidays',
    metaDescription: 'Considering The Title Rawai phases 1–2 or III? Choose the newer Title V: our apartments, shared pools, gym and quiet setting for a week or longer.',
    eyebrow: 'Choose your Title V stay',
    summary: 'A newer Rawai residence with pools, tropical gardens and the everyday comforts that make a longer holiday easy.',
    intro: 'Considering The Title Rawai phases 1–2 or III? Choose our apartments at the newer Title V: shared pools, tropical gardens and a quiet home for your Rawai holiday.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.centralPool, caption: 'Your morning swim, in the shared central pool at The Title V.' },
    readTime: '3 min read',
    sections: [
      {
        heading: 'A newer setting for your Rawai stay',
        paragraphs: [
          'The Title V is a newer residence than Rawai phases 1–2 and III. Low-rise buildings sit among planted courtyards, with garden paths leading between the pools and your apartment. It is an inviting setting for days when your only plan is breakfast, a swim and a good book.',
          'Set back from the main road, the residence gives you a quiet place to return to while keeping Rawai’s seafood dinners, cafés and boat-lined shore part of your holiday. Enjoy the neighborhood, then come home to your own balcony and a slower evening.',
        ],
        links: [links.location],
      },
      {
        heading: 'More to enjoy within the residence',
        paragraphs: [
          'Start with a dip in a shared pool, fit in a workout at the gym or wind down in the sauna and steam-room area. Tropical planting and poolside loungers make staying close to home an appealing part of the trip.',
          'For families, the children’s pool and small playground add easy breaks between outings. For a working stay, the shared coworking area offers a change of scene from your apartment desk. These shared spaces make it simple to give each day a different pace.',
        ],
        links: [links.residence],
      },
      {
        heading: 'Your own bedroom, kitchen and balcony',
        paragraphs: [
          'Choose Bright for its airy living room and pale sofa, or Cozy for warm interiors and a garden-facing balcony. Each 37 m² home has a separate queen bedroom, a living room with a sofa bed, a kitchen, a washing machine and a dedicated desk.',
          'Make breakfast when you feel like it, wash the beach clothes and close the bedroom door at the end of the day. Each apartment welcomes up to 2 adults and 2 children aged 14 or under, with elevator access to the second floor.',
        ],
        links: [links.bright, links.cozy],
      },
      {
        heading: 'Settle in for a week or more',
        paragraphs: [
          'Book directly with our team and let a local agent welcome you on arrival. Staying 7–27 nights brings 10% off accommodation; from 28 nights, the accommodation discount is 20%. That leaves room in your plans for favorite cafés, pool mornings and another day on the southern coast.',
          'The rates page sets out cleaning, extra-child charges, metered utilities and the separate refundable deposit. Travelling with another household? Bright and Cozy are next door, so you can book both and enjoy the same residence with a complete home each.',
        ],
        links: [links.rates, links.pair],
      },
    ],
    sources: [],
    relatedGuides: ['rawai-neighborhood-guide', 'two-apartments-for-family-and-friends', 'long-stays-in-rawai'],
  },
  {
    slug: 'title-cielo-vs-title-v-rawai',
    title: 'The Title Cielo or The Title V in Rawai?',
    seoTitle: 'The Title Cielo vs The Title V | Your Rawai Stay',
    heading: 'Your Rawai home, with a local welcome',
    metaDescription: 'Considering The Title Cielo Rawai? Meet Bright and Cozy at The Title V: furnished apartments, shared pools and a local welcome for stays from seven nights.',
    eyebrow: 'A personal stay at The Title V',
    summary: 'Choose the apartment you see, speak directly with our booking team and arrive to a local welcome in Rawai.',
    intro: 'Considering The Title Cielo Rawai? Meet Bright and Cozy at The Title V: furnished homes with real apartment galleries, direct booking and a local welcome.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.brightLiving, caption: 'Bright at The Title V: the apartment you see is the home you can choose.' },
    readTime: '3 min read',
    sections: [
      {
        heading: 'Choose the home that feels like you',
        paragraphs: [
          'Bright brings a light-filled living room, warm wood and a pale sofa. Cozy has a softer, snug feel and a garden-facing balcony for coffee outside. Both are our furnished one-bedroom homes at The Title V, and the galleries take you through the actual rooms.',
          'In each 37 m² apartment, a separate queen bedroom gives you somewhere to retreat, while the living room, kitchen and balcony let you settle into your own routine. A washer and desk make the practical side of a longer holiday easy.',
        ],
        links: [links.bright, links.cozy],
      },
      {
        heading: 'A holiday beyond your front door',
        paragraphs: [
          'Your stay includes the pleasures of the residence: shared pools set among tropical gardens, a gym, a sauna and steam-room area, and a coworking space. Swim before breakfast, take a laptop downstairs for a change of scene or keep the afternoon free for a book by the pool.',
          'The children’s pool and small playground make room for younger guests too. It is an easy place to alternate days out with days at home, with your own kitchen, clothes and familiar comforts close by.',
        ],
        links: [links.residence],
      },
      {
        heading: 'Direct contact, from planning to arrival',
        paragraphs: [
          'Tell our booking team when you would like to come, which apartment you prefer and who is travelling. You can discuss the layout and arrival arrangements before confirming, then a local agent welcomes you and handles the handover when you arrive.',
          'Once you have unpacked, Rawai is ready to explore: coffee by the waterfront, seafood for dinner and groceries for breakfast at home. The residence sits back from the waterfront, giving you a quiet setting for the slower moments between outings.',
        ],
        links: [links.location, links.terms],
      },
      {
        heading: 'Take the time to feel at home',
        paragraphs: [
          'Stays start at seven nights, with 10% off accommodation for 7–27 nights and 20% off from 28 nights. Keep a few mornings free, find your favorite lunch spot and enjoy having time to return. Each apartment welcomes up to 2 adults and 2 children aged 14 or under.',
          'Choose your dates to see the stay estimate, including cleaning and any extra-child charges. Metered utilities and the refundable deposit are separate. We confirm availability and final terms with you, so your Rawai plans begin with the apartment you have chosen.',
        ],
        links: [links.rates],
      },
    ],
    sources: [],
    relatedGuides: ['rawai-food-and-markets', 'long-stays-in-rawai', 'work-from-phuket'],
  },
  {
    slug: 'title-halo-nai-yang-vs-title-v-rawai',
    title: 'The Title Halo Nai Yang or The Title V Rawai?',
    seoTitle: 'The Title Halo Nai Yang vs The Title V Rawai',
    heading: 'Make yourself at home in southern Phuket',
    metaDescription: 'Considering The Title Halo Nai Yang? Discover a southern Phuket stay at our Title V apartments: Rawai life, shared pools and Nai Harn and Ya Nui outings.',
    eyebrow: 'Your southern Phuket stay',
    summary: 'Rawai waterfront mornings, Nai Harn and Ya Nui outings, and your own apartment to return to at The Title V.',
    intro: 'Considering The Title Halo in Nai Yang? Make southern Phuket your home at our Title V apartments in Rawai, with waterfront mornings, beach outings and pool afternoons.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.poolCourtyard, caption: 'Come home from the southern coast to the shared pools at The Title V.' },
    readTime: '3 min read',
    sections: [
      {
        heading: 'Put the southern coast into your week',
        paragraphs: [
          'The Title Halo is in Nai Yang; choose our Rawai base when your holiday plans center on Phuket’s southern coast. Start with coffee near the boat-lined waterfront, browse the seafood market and settle at a table by the sea. On another day, take a ride to Nai Harn’s broad bay or the smaller cove at Ya Nui.',
          'Add an evening view from Promthep Cape, or leave the afternoon free for the pool. Rawai’s waterfront is for strolling, seafood and boat departures; Nai Harn and Ya Nui are separate beach trips. Mix the days to suit your mood.',
        ],
        links: [
          { title: 'Plan your Nai Harn and Ya Nui outings', url: '/guides/nai-harn-and-ya-nui-beaches/' },
          { title: 'Find your Rawai food and coffee stops', url: '/guides/rawai-food-and-markets/' },
        ],
      },
      {
        heading: 'Keep some days close to home',
        paragraphs: [
          'Back at The Title V, shared pools and green courtyards make an afternoon at the residence a lovely plan in itself. Swim, find a lounger or sit on your own balcony. The setting is quiet and set back from Rawai’s waterfront, with garden paths linking the buildings.',
          'A shared gym, sauna and steam-room area help you keep a little of your usual routine. Families have a children’s pool and a small playground, so a gentle day at home can still have plenty in it.',
        ],
        links: [links.residence],
      },
      {
        heading: 'Unpack once and live at your pace',
        paragraphs: [
          'Bright and Cozy each give you 37 m² with a separate queen bedroom, a living room with a sofa bed, a kitchen, a washer and a balcony. Bring fruit home from the shop, prepare a quick lunch between outings and refresh the beach clothes whenever you need.',
          'If work is part of the trip, there is a dedicated apartment desk and a shared coworking area. Each home suits up to 2 adults and 2 children aged 14 or under, with the bedroom separate from the living space.',
        ],
        links: [links.bright, links.cozy],
      },
      {
        heading: 'Give yourself a week, or a month',
        paragraphs: [
          'Our seven-night minimum gives you time to find your Rawai rhythm. Stay 7–27 nights for 10% off accommodation, or 28 nights or more for 20% off. Cleaning, extra-child charges, metered utilities and the separate refundable deposit are explained on the rates page.',
          'Plan the airport transfer as part of your arrival, then let the southern coast be the focus of your stay. Book directly with our team, share your arrival details and look forward to a local agent welcoming you at The Title V.',
        ],
        links: [links.rates, { title: 'Plan your arrival from Phuket Airport', url: '/guides/phuket-airport-to-rawai/' }],
      },
    ],
    sources: [],
    relatedGuides: ['rawai-neighborhood-guide', 'nai-harn-and-ya-nui-beaches', 'a-slow-week-in-rawai'],
  },
  {
    slug: 'title-legendary-bang-tao-vs-title-v-rawai',
    title: 'The Title Legendary Bang Tao or The Title V Rawai?',
    seoTitle: 'The Title Legendary Bang Tao vs The Title V Rawai',
    heading: 'Quiet Rawai days, together or next door',
    metaDescription: 'Considering The Title Legendary Bang Tao? Discover our quiet Rawai stay at The Title V: one-bedroom homes, shared pools and adjacent apartments for families.',
    eyebrow: 'Space for your own holiday rhythm',
    summary: 'A quiet Rawai base for a longer stay, with the option of two adjacent homes for family or friends.',
    intro: 'Considering The Title Legendary Bang Tao? Choose our quiet Rawai stay at The Title V. Book Bright or Cozy, or bring family and friends next door with both apartments.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.cozyBalcony, caption: 'A slower start to the day on Cozy’s garden-facing balcony at The Title V.' },
    readTime: '3 min read',
    sections: [
      {
        heading: 'A quiet home for longer Rawai days',
        paragraphs: [
          'The Title Legendary is in Bang Tao; our Title V apartments put you in Rawai for a holiday around Phuket’s southern coast. Set back from the waterfront, the quiet residence is a place to slow down between seafood dinners, Nai Harn outings and days at Ya Nui. Return to your balcony when you feel like staying in.',
          'Bright and Cozy each have a separate queen bedroom, a living room with a sofa bed, a kitchen, a washing machine and a desk. Across 37 m², you have the everyday comforts to unpack and stay a while.',
        ],
        links: [links.location],
      },
      {
        heading: 'Travel together, with a home each',
        paragraphs: [
          'Our two apartments are next door to each other. Book them together and each household has its own bedroom, living room, kitchen, bathroom and balcony. Meet for a swim or dinner out, then keep your own bedtimes, breakfasts and work calls.',
          'Bright and Cozy have separate entrances and no internal connecting door. Each welcomes up to 2 adults and 2 children aged 14 or under, giving the pair room for 4 adults and 4 children within those limits. It is a comfortable way for two families, or a family and grandparents, to stay close while enjoying their independence.',
        ],
        links: [links.pair],
      },
      {
        heading: 'Easy time together in the shared gardens',
        paragraphs: [
          'The shared pools and tropical courtyards give everyone a place to meet beyond the apartments. Younger guests have a children’s pool and a small playground; adults can fit in a workout at the gym or unwind in the sauna and steam-room area.',
          'There is a shared coworking space when someone needs a change from their apartment desk. Having these facilities within the residence makes it easy to enjoy the same holiday at different paces, then come together again for the next outing.',
        ],
        links: [links.residence],
      },
      {
        heading: 'Make more time for your stay',
        paragraphs: [
          'Stay from seven nights, with 10% off accommodation for 7–27 nights and 20% off from 28 nights. Your own kitchen and washer are especially useful over a longer visit, leaving you free to choose between a simple evening in and another dinner by the water.',
          'Our team confirms your dates and apartment choice, and a local agent welcomes you on arrival. For the pair, both homes need to be available for your full stay. Review cleaning, extra-child charges, metered utilities and the separate refundable deposit on the rates page.',
        ],
        links: [links.rates, links.terms],
      },
    ],
    sources: [],
    relatedGuides: ['two-apartments-for-family-and-friends', 'long-stays-in-rawai', 'phuket-with-children'],
  },
];
