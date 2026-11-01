import type { Guide } from './guides';
import { images } from './properties';
import { placeMapUrl, residenceLocation } from './location';

const checked = '2026-11-01';
const sources = {
  phases: {
    title: 'Rhom Bho Property · March 2024 investor document, Rawai project identities (PDF pages 26–32)',
    url: 'https://investor.rhombho.co.th/storage/document/notification-of-the-allocation-of-newly-issued-ordinary-shares/2024/notification-of-the-allocation-en.pdf',
  },
  phase12Listing: {
    title: 'Zu Phuket Property · example rental marketed as Phase 1–2 · checked 1 November 2026',
    url: 'https://www.zuproperty.com/property/beach-front-condo-in-rawai-for-rent/',
  },
  phase3Listing: {
    title: 'Phuket Serenity Villas · individual Phase III one-bedroom listing · updated 14 October 2026',
    url: 'https://phuketserenityvillas.com/properties/apartment-for-rent-at-the-title-rawai-d409/',
  },
  cielo: {
    title: 'The Title · Cielo Rawai project and August 2026 progress · checked 1 November 2026',
    url: 'https://thetitleresidence.com/condominium/cielo-rawai/',
  },
  cieloNews: {
    title: 'The Title · Cielo location and design announcement · 26 March 2025',
    url: 'https://thetitleresidence.com/news/rhom-bho-property-the-title-moves-forward-unstoppably-laying-the-foundation-for-three-new-projects-after-eia-approval-and-advancing-full-scale-construction/',
  },
  halo: {
    title: 'The Title · Halo 1 Naiyang factsheet and official map · checked 1 November 2026',
    url: 'https://thetitleresidence.com/condominium/the-halo-1/',
  },
  haloListing: {
    title: 'Sanbada Real Estate · individual Halo 1 rental options · checked 1 November 2026',
    url: 'https://www.sanbadathai.com/property-detail.php?id=284&lang=en',
  },
  legendary: {
    title: 'The Title · Legendary Bang-Tao factsheet and official map · checked 1 November 2026',
    url: 'https://thetitleresidence.com/condominium/legendarybang-tao/',
  },
  rentalPortfolio: {
    title: 'Holidays Phuket · named Legendary apartment listings · checked 1 November 2026',
    url: 'https://holidaysphuket.com/en',
  },
  projects: {
    title: 'The Title · separate project names and development status · checked 1 November 2026',
    url: 'https://thetitleresidence.com/',
  },
  naiYang: {
    title: 'Phuket Provincial Government · Nai Yang Beach',
    url: 'https://www.phuket.go.th/eng/Beaches-Nai%20Yang%20Beach.php',
  },
  sirinat: {
    title: 'Tourism Authority of Thailand · Sirinat National Park and Nai Yang',
    url: 'https://www.tourismthailand.org/Attraction/sirinart-national-park',
  },
  bangTao: {
    title: 'Phuket Provincial Government · Bang Tao Beach',
    url: 'https://www.phuket.go.th/eng/Beaches-Bang%20Tao%20Beach.php',
  },
  rawai: {
    title: 'Phuket Provincial Government · Rawai waterfront and island boats',
    url: 'https://www.phuket.go.th/eng/Beaches-Rawai%20Beach.php',
  },
  naiHarn: {
    title: 'Phuket Provincial Government · Nai Harn Beach',
    url: 'https://www.phuket.go.th/eng/Beaches-Nai%20Harn%20Beach.php',
  },
  airport: {
    title: 'Airports of Thailand · Phuket Airport transport options',
    url: 'https://phuket.airportthai.co.th/service/transportation',
  },
  bright: { title: 'Our Bright apartment · photos, layout and equipment', url: '/stays/bright-1br-rawai-beach/' },
  cozy: { title: 'Our Cozy apartment · photos, layout and equipment', url: '/stays/cozy-1br-rawai-beach/' },
  terms: { title: 'Our Title V booking terms', url: '/booking-terms/' },
};

const maps = {
  titleV: { title: 'The Title V · residence map', url: residenceLocation.mapsUrl },
  cielo: { title: 'Cielo Rawai · developer’s map pin', url: 'https://maps.app.goo.gl/pRW5ohsxnVd47JHg6' },
  halo: { title: 'Halo 1 Nai Yang · developer’s map pin', url: 'https://maps.app.goo.gl/wFSefa4DqsyYVo8V9' },
  legendary: { title: 'Legendary Bang Tao · developer’s map pin', url: 'https://maps.app.goo.gl/18UuAN3DX3LBHJkx5' },
};
const map = (title: string, query: string) => ({ title, url: placeMapUrl(query) });

export const comparisonGuides: Guide[] = [
  {
    slug: 'the-title-rawai-phases-comparison',
    title: 'The Title Rawai phases 1–2, III or V?',
    seoTitle: 'The Title Rawai 1–2, III or V? Rental Comparison',
    heading: 'The Title Rawai phases 1–2, III and V: compare before renting',
    metaDescription: 'Comparing a rental at The Title Rawai phases 1–2, III or V? Check the location and apartment details, then see our two one-bedroom rentals at The Title V.',
    eyebrow: 'Compare Rawai apartments',
    summary: 'Understand the phase names, compare a real apartment and choose the Rawai stay that fits your dates and group.',
    intro: 'Looking at a rental in The Title Rawai phases 1–2 or III? Start with the exact residence and apartment. Here we compare the names, layouts and booking questions with Bright and Cozy, our two 37 m² one-bedroom apartments at The Title V, for stays of seven nights or longer.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.centralPool, caption: 'The shared central pool at The Title V in Rawai, where our Bright and Cozy apartments are located.' },
    readTime: '6 min read',
    sections: [
      {
        heading: 'Which Title residence is in the listing?',
        paragraphs: [
          'The phase number matters. The developer’s March 2024 investor document identifies Rawai phases 1, 2, 3 and 5 separately. Rental listings sometimes combine the first two as “Phase 1–2”; Roman III means 3, and V means 5. A listing that says only “The Title Rawai” still needs a phase, building and arrival pin.',
          'The table below resolves the names. Its building descriptions come from historical developer information and help identify the projects; they do not describe the condition, furnishing or facilities access of a particular rental today.',
        ],
        table: {
          headings: ['Name in a search or listing', 'Phase', 'Published project form', 'What to confirm'],
          rows: [
            ['The Title Rawai I / Phase 1', '1', 'Four-storey buildings in Rawai', 'Exact phase and apartment when advertised as 1–2'],
            ['The Title Rawai II / Phase 2', '2', 'Four-storey buildings beside Phase 1', 'Building and entrance within the 1–2 grouping'],
            ['The Title Rawai III / Phase 3', '3', 'Four-storey buildings in Rawai', 'Actual rental layout, floor and arrival pin'],
            ['The Title V / Rawai Phase 5', '5', 'Five-storey buildings in Rawai', 'Bright or Cozy when booking through this site'],
          ],
        },
        links: [sources.phases, sources.phase12Listing],
      },
      {
        heading: 'Compare the actual one-bedroom apartment',
        paragraphs: [
          'An apartment in an earlier phase may be a better fit if its layout gives you the space you want. For a concrete example, Phuket Serenity Villas describes one Phase III rental as a 49 m² one-bedroom apartment on the top floor, with a kitchen, washing machine and pool view. Its page was updated on 14 October 2026 and checked for this guide on 1 November. Those details belong to that listing alone.',
          'Bright and Cozy are each 37 m², on the second floor with elevator access. Each has a separate queen bedroom, a living room with a sofa bed, kitchen, washer, balcony and dedicated desk. Compare the photographs room by room: where a child will sleep, whether the bedroom closes, and where two people can spend time when one is working.',
        ],
        table: {
          headings: ['Apartment detail', 'The cited Phase III rental', 'Our Bright or Cozy apartment at Title V'],
          rows: [
            ['Floor area', '49 m² in the operator’s listing', '37 m² per apartment'],
            ['Bedroom and living space', 'One bedroom; living-room sofa bed described for a child', 'Separate queen bedroom; living-room sofa bed'],
            ['Kitchen and laundry', 'Kitchen and washing machine listed', 'Hob, refrigerator, microwave and own washing machine'],
            ['Floor and outlook', 'Top floor; pool view described', 'Second floor; see each apartment’s balcony photographs'],
            ['Length of stay', 'Holiday and longer rentals advertised; ask for the exact minimum', 'Seven nights minimum; longer stays depend on dates'],
          ],
        },
        links: [sources.phase3Listing, sources.bright, sources.cozy],
      },
      {
        heading: 'Check the entrance against your daily route',
        paragraphs: [
          'All these options put your search in Rawai, but a shared brand does not give them the same front door. Ask the operator to mark the pedestrian entrance you can actually use. Then check the route to your chosen café, grocery shop and pickup point, including the return after dinner.',
          'For our apartments, start with The Title V pin and the location guide below. Rawai’s waterfront is a place for boat departures, seafood and a stroll. We suggest Nai Harn or Ya Nui for a separate beach outing. Choose your residence around the journey you will repeat, rather than a straight-line distance to the sea.',
        ],
        links: [
          map('Find The Title Rawai phases 1–2 on the map', 'The Title Rawai Phase 1 2 Phuket'),
          map('Find The Title Rawai III on the map', 'The Title Rawai Phase 3 Phuket'),
          maps.titleV,
          { title: 'Our entrance, groceries and local stops', url: '/location/' },
          sources.rawai,
        ],
      },
      {
        heading: 'Match the contract to a week or a month',
        paragraphs: [
          'A monthly headline price does not always mean a one-month booking is offered. The Phase 1–2 example linked above specifies a one-year contract. The Phase III example advertises both holiday and longer stays. Ask about the exact dates and minimum before comparing the totals; neither example establishes a rule for its whole phase.',
          'For Bright or Cozy, cleaning is ฿1,500 per apartment per stay. Electricity is ฿6/kWh and water ฿55/m³, metered separately. The refundable deposit is ฿10,000 per booking for up to 30 nights, or ฿20,000 for 31 nights or more. Keep that deposit separate from the accommodation cost when comparing offers.',
          'Confirm which pools and other shared facilities your rental includes, their opening arrangements, who meets you and the cancellation terms. A booking at one phase should never be taken as permission to use another phase’s facilities.',
        ],
        links: [sources.phase12Listing, sources.phase3Listing, sources.terms, { title: 'Title V rates and stay calculator', url: '/rates/' }],
      },
      {
        heading: 'When each option fits',
        paragraphs: [
          'Keep a Phase 1–2 or III apartment on your shortlist when its specific layout, entrance, outlook or longer contract suits you. A requirement for a particular apartment or phase is a good reason to book that exact option with its operator.',
          'Bright or Cozy fits a couple or a family that wants a photographed one-bedroom home at The Title V for at least a week. Each accepts at most 2 adults and 2 children aged 14 or under; guests aged 15 or older count as adults. For two households, Both combines the two adjacent apartments, each with its own entrance, kitchen and bathroom. There is no internal connecting door.',
          'Compare the two interiors, then enter your dates for The Title V. This website offers Bright, Cozy and the pair; bookings for the other Rawai phases are made with their own operators.',
        ],
        links: [
          { title: 'Compare Bright and Cozy at The Title V', url: '/stays/' },
          { title: 'Check dates for The Title V', url: '/book/' },
          { title: 'See the two adjacent Title V apartments', url: '/stays/two-adjacent-apartments-title-v-rawai/' },
        ],
      },
    ],
    sources: [sources.phases, sources.phase12Listing, sources.phase3Listing, sources.rawai, sources.bright, sources.cozy, sources.terms],
    relatedGuides: ['title-cielo-vs-title-v-rawai', 'rawai-neighborhood-guide', 'two-apartments-for-family-and-friends'],
  },
  {
    slug: 'title-cielo-vs-title-v-rawai',
    title: 'The Title Cielo or The Title V in Rawai?',
    seoTitle: 'The Title Cielo vs The Title V: Rawai Stay Comparison',
    heading: 'Considering The Title Cielo? Compare it with The Title V',
    metaDescription: 'Considering The Title Cielo Rawai? Compare verified project details, location and rental questions with Bright and Cozy, our two apartments at The Title V.',
    eyebrow: 'Two Rawai projects',
    summary: 'Compare Cielo’s published project details with a specific Title V stay, from the arrival location to the apartment you will actually use.',
    intro: 'If you are looking for a rental at The Title Cielo Rawai, first confirm the apartment and arrangements for your travel dates. Cielo and The Title V are separate Rawai developments. Our offering here is Bright and Cozy at The Title V: two furnished 37 m² one-bedroom apartments with a seven-night minimum.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.brightLiving, caption: 'The Bright apartment at The Title V in Rawai. This is one of the apartments offered on this website.' },
    readTime: '5 min read',
    sections: [
      {
        heading: 'What the current Cielo project page establishes',
        paragraphs: [
          'On 1 November 2026, Cielo’s official page displayed an August 2026 construction update at 97.1%. That is a dated progress report, not confirmation that a particular apartment has been handed over, furnished or made available for your stay. It also does not establish that rentals are unavailable.',
          'The developer describes a coastal European design and a lagoon-style pool in its March 2025 announcement. If that setting is what attracts you to Cielo, ask the rental operator for recent photographs of the apartment and the facilities you intend to use, along with confirmation that they will be accessible on your dates.',
        ],
        table: {
          headings: ['What you need to know', 'Cielo Rawai', 'Bright and Cozy at The Title V'],
          rows: [
            ['Residence identity', 'Separate development in the Rawai Beach area', 'Our two apartments are in Rawai Phase 5'],
            ['Published status', 'Official page shows August 2026 progress of 97.1%, checked 1 November', 'Furnished apartments with individual photo galleries and booking details'],
            ['Apartment evidence', 'Request the actual rental’s recent photos, layout and inventory', 'Each is 37 m² with a separate bedroom, kitchen, washer, desk and balcony'],
            ['Facilities for your dates', 'Confirm what is open and included with the rental operator', 'Shared residence facilities; access follows condominium rules'],
            ['Booking route', 'Confirm the named Cielo rental with its operator', 'Choose Bright, Cozy or Both on this website'],
          ],
        },
        links: [sources.cielo, sources.cieloNews, sources.bright, sources.cozy],
      },
      {
        heading: 'The same Rawai plans, two different entrances',
        paragraphs: [
          'Cielo is a same-area comparison for a traveller who already wants Rawai. Its developer’s map and The Title V map let you place each residence against your plans. Save the exact entrance from your chosen operator for arrival; a development pin alone may not show the gate you will use.',
          'Put three regular stops on your map: your breakfast or grocery stop, the waterfront meeting point for any boat trip, and your beach destination. Rawai’s boat-lined waterfront and the sandy bay at Nai Harn are different outings. This matters more than treating every “near Rawai Beach” description as the same daily routine.',
          'If you already have friends staying in Cielo or need to be in that particular building, check that option first. If your aim is simply to spend a week or month in Rawai, the apartment layout and full-stay terms can decide between the two locations.',
        ],
        links: [maps.cielo, maps.titleV, map('Rawai waterfront', 'Rawai Beach Phuket'), map('Nai Harn Beach', 'Nai Harn Beach Phuket'), { title: 'Food and grocery stops around our Title V apartments', url: '/guides/rawai-food-and-markets/' }],
      },
      {
        heading: 'Turn the floor plan into a real stay',
        paragraphs: [
          'Cielo’s official gallery separates exterior, facilities and show-unit images. Use those to understand the design, then ask for photographs of the apartment being offered to you. Look for the exact bed, sofa, dining space, balcony outlook and kitchen equipment; ask whether the photos show the finished rental you will receive.',
          'For a working month, check where the desk is, whether the chair suits your workday and whether internet is installed in that apartment. For a family stay, check the bedroom door, the additional bed and the permitted guest ages. For everyday cooking, a room labelled “kitchen” is less useful than an inventory of the hob, refrigerator, microwave and utensils.',
          'Bright and Cozy have similar layouts with different interiors. Their queen bedrooms are separate from the living rooms; each has its own washing machine and desk. Our galleries show the actual apartments, so you can choose the interior before entering your dates.',
        ],
        links: [sources.cielo, sources.bright, sources.cozy, { title: 'Working from our Rawai apartments', url: '/guides/work-from-phuket/' }],
      },
      {
        heading: 'Confirm the arrival and the whole-stay price',
        paragraphs: [
          'For a Cielo offer, ask who will confirm that the specific apartment is ready, who handles the key handover and what the written terms provide if the apartment cannot be supplied on the agreed date. A project brochure and a booking confirmation answer different questions. Keep the confirmation for the exact rental with your travel documents.',
          'Compare the same arrival and departure dates, number of adults and children’s ages. Request the accommodation total, cleaning, utility rates, refundable deposit, payment schedule and cancellation terms. Developer apartment-sale prices have no useful role in this holiday-rental calculation.',
          'For our Title V apartments, the minimum is seven nights and a local agent handles the arrival handover. Cleaning costs ฿1,500 per apartment per stay. Metered electricity at ฿6/kWh and water at ฿55/m³ are separate. The refundable deposit is ฿10,000 per booking up to 30 nights, or ฿20,000 for a longer stay. The calculator applies the stay’s accommodation discounts before you send an enquiry.',
        ],
        links: [sources.terms, { title: 'Our Title V rates and included costs', url: '/rates/' }],
      },
      {
        heading: 'Choose the stay that meets your reason for coming',
        paragraphs: [
          'Continue with Cielo if its specific design, apartment or location is central to your trip and the operator can confirm the finished rental and arrangements for your dates. There is no reason to change residences solely because another one shares The Title name.',
          'Consider Bright or Cozy when you want Rawai, a separate bedroom and practical everyday equipment for a stay of at least seven nights. Each allows up to 2 adults and 2 children aged 14 or under. If two households want their own space, our adjacent pair provides two entrances, two kitchens and two bathrooms, with no internal connecting door.',
          'The apartment and date links below are for The Title V. For a named Cielo unit, use its rental operator’s booking channel.',
        ],
        links: [
          { title: 'See Bright and Cozy at The Title V', url: '/stays/' },
          { title: 'Check The Title V dates and prices', url: '/book/' },
          { title: 'Compare the other Title Rawai phases', url: '/guides/the-title-rawai-phases-comparison/' },
        ],
      },
    ],
    sources: [sources.cielo, sources.cieloNews, sources.rawai, sources.naiHarn, sources.bright, sources.cozy, sources.terms],
    relatedGuides: ['the-title-rawai-phases-comparison', 'long-stays-in-rawai', 'work-from-phuket'],
  },
  {
    slug: 'title-halo-nai-yang-vs-title-v-rawai',
    title: 'The Title Halo Nai Yang or The Title V Rawai?',
    seoTitle: 'The Title Halo Nai Yang vs The Title V Rawai',
    heading: 'The Title Halo in Nai Yang or The Title V in Rawai?',
    metaDescription: 'Compare The Title Halo in Nai Yang with The Title V in Rawai: location, daily travel and apartment details. Explore our two Rawai rentals for seven nights or more.',
    eyebrow: 'Nai Yang or Rawai',
    summary: 'An airport-area beach base or a stay on Phuket’s southern coast? Choose around the places you will return to each day.',
    intro: 'Choosing between a rental at The Title Halo in Nai Yang and The Title V in Rawai starts with the area. Halo is near Phuket Airport; Rawai is a base for the southern coast. This website offers Bright and Cozy at The Title V, two 37 m² one-bedroom apartments for seven nights or longer.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.rawai, caption: 'Longtail boats on the Rawai waterfront, near our Title V apartments in southern Phuket.' },
    readTime: '5 min read',
    sections: [
      {
        heading: 'Locate the right Title project first',
        paragraphs: [
          'The developer calls this project The Title Halo 1 (Naiyang Beach). Nai Yang and Naiyang are two spellings of the same area. Nai Harn is a different beach in southern Phuket, near Rawai. Make sure that distinction survives when you share a listing with your travel companions or arrange an airport pickup.',
          'Halo is also separate from The Title Serenity Naiyang and the older Title Residencies Naiyang projects. The developer’s current index lists Halo and Serenity individually. On 1 November 2026 it described Halo as ready to move; availability and rental conditions still come from the operator of the apartment you choose.',
        ],
        table: {
          headings: ['Decision', 'The Title Halo 1 · Nai Yang', 'Our Title V apartments · Rawai'],
          rows: [
            ['Area', 'Nai Yang, in the airport area', 'Rawai, in southern Phuket'],
            ['Beach setting', 'Nai Yang Beach and the Sirinat National Park area', 'Rawai waterfront; separate outings to Nai Harn and Ya Nui'],
            ['Published layout choices', 'Developer lists 1BR at 36–51 m² and 2BR at 59–64 m²', 'Bright and Cozy are each 37 m², with one separate bedroom'],
            ['Best starting point for your shortlist', 'Frequent airport journeys or plans around Nai Yang', 'Plans centred on Rawai and the southern bays'],
            ['Rental length', 'Confirm with the selected unit’s operator', 'Seven nights minimum'],
          ],
        },
        links: [sources.halo, sources.projects, sources.naiYang, sources.phases],
      },
      {
        heading: 'Count the journeys you will repeat',
        paragraphs: [
          'If you expect repeated airport visits, want to meet someone arriving on another flight, or have most of your plans around Nai Yang, keep Halo high on the shortlist. The official provincial beach guide places Nai Yang near the airport. A stay there can serve a different itinerary from a holiday based in Rawai.',
          'If your list is Rawai waterfront dinners, southern beach days and time around Nai Harn, our Title V location is worth comparing. For a month, plot the regular journeys first: a school, workplace, fitness class, grocery shop or the beach you expect to use most. An airport transfer happens once in each direction; an unsuitable everyday route repeats throughout the stay.',
          'Open the residence maps alongside the airport pin and request a current route for your planned arrival time. Airports of Thailand lists taxi, limousine, bus and car-rental options. Choose the transfer after checking your landing time, luggage and the exact destination; this guide does not promise a fixed driving time.',
        ],
        links: [maps.halo, maps.titleV, map('Phuket International Airport', 'Phuket International Airport'), sources.airport, { title: 'Planning the airport journey to Rawai', url: '/guides/phuket-airport-to-rawai/' }],
      },
      {
        heading: 'Picture the beach day you want',
        paragraphs: [
          'Nai Yang offers a sandy beach with tree shade in the Sirinat National Park area. The Tourism Authority of Thailand describes a shoreline with accommodation and restaurants. It is a sensible area to investigate if you want your routine to revolve around that beach and its surroundings.',
          'Rawai’s appeal is a different routine: boats along the shore, meals by the waterfront and outings to southern beaches. Nai Harn has a sandy bay with a lake inland; Ya Nui is another option for a coastal outing. Check current beach flags and conditions wherever you stay.',
          'The route from a condominium entrance to the sand or shops matters. Ask the Halo operator for the gate and beach approach they use. For Title V, use our location guide to plan groceries and waterfront stops. Choose a walk you are comfortable doing with your group rather than relying on a brochure distance.',
        ],
        links: [sources.sirinat, sources.rawai, sources.naiHarn, { title: 'Nai Harn and Ya Nui beach guide', url: '/guides/nai-harn-and-ya-nui-beaches/' }, { title: 'Title V local routes and essentials', url: '/location/' }],
      },
      {
        heading: 'For a month, compare the furnished unit',
        paragraphs: [
          'Halo’s developer offers more than one apartment size, and its one-bedroom category is a range. A direct Sanbada rental page, checked on 1 November 2026, describes 36 m² and 46 m² options and advertises stays from seven days. That is an operator’s offer, not a stay policy for every Halo apartment. Ask which unit, floor, bed setup and equipment are included in your quote.',
          'If you work during the trip, request photographs of the desk and chair and a recent connection test from the selected apartment. Check the kitchen inventory and whether the washing machine is in the unit. A development-wide amenities list cannot answer those everyday questions.',
          'Bright and Cozy each have their own kitchen, washing machine, balcony and dedicated desk. Shared pools, gym, sauna and coworking are part of the Title V residence, with access governed by its rules. Compare those practical needs first, then the full cost for your dates.',
        ],
        links: [sources.haloListing, sources.bright, sources.cozy, { title: 'Our workspaces and internet details', url: '/guides/work-from-phuket/' }],
      },
      {
        heading: 'When to stay in Nai Yang, and when Rawai fits',
        paragraphs: [
          'Choose a suitable Halo rental if you want Nai Yang itself, need frequent airport access or prefer one of its larger layouts. A short airport stopover is a separate search: our apartments have a seven-night minimum, so they would not fit a one- or two-night visit.',
          'Consider Bright or Cozy if southern Phuket is where you want to spend your days and a 37 m² one-bedroom apartment fits your group. Each accepts up to 2 adults and 2 children aged 14 or under. For two households, Both offers the adjacent apartments with separate entrances, kitchens and bathrooms; there is no internal connecting door.',
          'For a fair cost comparison, include cleaning, utilities and the refundable deposit in the questions you send to either operator. Our Title V cleaning fee is ฿1,500 per apartment per stay; electricity and water are metered separately. Use the booking terms and date calculator below for the full breakdown. All bookings made through this website are for our Title V apartments in Rawai.',
        ],
        links: [
          { title: 'Explore our apartments at The Title V in Rawai', url: '/stays/' },
          { title: 'Check The Title V dates and stay estimate', url: '/book/' },
          sources.terms,
        ],
      },
    ],
    sources: [sources.halo, sources.haloListing, sources.projects, sources.phases, sources.naiYang, sources.sirinat, sources.rawai, sources.naiHarn, sources.airport, sources.bright, sources.cozy, sources.terms],
    relatedGuides: ['title-legendary-bang-tao-vs-title-v-rawai', 'phuket-airport-to-rawai', 'long-stays-in-rawai'],
  },
  {
    slug: 'title-legendary-bang-tao-vs-title-v-rawai',
    title: 'The Title Legendary Bang Tao or The Title V Rawai?',
    seoTitle: 'The Title Legendary Bang Tao vs The Title V Rawai',
    heading: 'The Title Legendary in Bang Tao or The Title V in Rawai?',
    metaDescription: 'Compare The Title Legendary in Bang Tao with The Title V in Rawai: area, apartment layouts and stay requirements. See our two one-bedroom rentals in Rawai.',
    eyebrow: 'Bang Tao or Rawai',
    summary: 'Compare the area and the space: a choice of Legendary layouts in Bang Tao, or one of our one-bedroom apartments and adjacent pair in Rawai.',
    intro: 'A rental at The Title Legendary Bang Tao and a stay at The Title V put you in different parts of Phuket. Start with your regular destinations, then choose the apartment layout. Here you can book Bright and Cozy at The Title V in Rawai, individually or as two adjacent apartments, for seven nights or longer.',
    updatedAt: checked,
    category: 'comparison',
    hero: { ...images.pairedApartments, caption: 'Our Bright and Cozy apartments at The Title V in Rawai. The two interiors are shown side by side; each apartment has its own entrance.' },
    readTime: '6 min read',
    sections: [
      {
        heading: 'Choose the area around the week you have planned',
        paragraphs: [
          'The Title Legendary is in the Bang Tao Beach area. It is a distinct development from The Title Heritage and The Modeva, which also appear in the developer’s Bang Tao project portfolio. Check the full name and exact apartment when comparing listings; “The Title Bang Tao” alone is not enough.',
          'Bang Tao is a broad beach area, with the Laguna resort area towards the northern part of the bay. If your plans are centred there, look at Legendary’s map against the specific places you will visit. Rawai makes sense for a different collection of days: waterfront meals, boat departures and outings around the southern coast.',
        ],
        table: {
          headings: ['Your priority', 'A Legendary rental in Bang Tao', 'Our apartments at The Title V in Rawai'],
          rows: [
            ['Most days around Bang Tao or Laguna', 'Keep this area on your shortlist', 'Compare the repeated journeys before changing area'],
            ['Most days around Rawai and Nai Harn', 'Check how often you would travel south', 'A southern Phuket base for those plans'],
            ['One larger home for the whole group', 'Developer lists several one- and two-bedroom layouts; find a matching rental', 'We offer 37 m² one-bedroom apartments and an adjacent pair'],
            ['Two households wanting separate space', 'Ask for the exact available layout or units', 'Both gives each household its own entrance, kitchen and bathroom'],
            ['A stay under seven nights', 'Ask the selected rental operator about its minimum', 'Our seven-night minimum would not fit'],
          ],
        },
        links: [sources.legendary, sources.projects, sources.bangTao, maps.legendary, maps.titleV],
      },
      {
        heading: 'Compare beach access and everyday stops',
        paragraphs: [
          'The provincial tourism guide describes Bang Tao as one of Phuket’s longest beaches. For an apartment stay, choose the beach access point you intend to use and check the route from Legendary’s entrance. The length of the bay means that “Bang Tao Beach” is not a precise meeting point.',
          'In Rawai, we recommend the waterfront for a walk, seafood and boat departures, then Nai Harn or Ya Nui for a separate beach outing. That routine suits travellers who want several southern-coast stops rather than every day on the same stretch of sand.',
          'Before deciding, mark a supermarket, an ordinary dinner option and your main activity near each proposed apartment. Ask the operator which gate is available to guests and how you will get home after dinner. Use current routes and transport quotes for the journeys you will actually make; a development’s distance-to-beach claim is not a checked walking route.',
        ],
        links: [
          map('Bang Tao Beach', 'Bang Tao Beach Phuket'),
          map('Laguna Phuket', 'Laguna Phuket'),
          map('Rawai waterfront', 'Rawai Beach Phuket'),
          { title: 'Our Rawai location and everyday stops', url: '/location/' },
          { title: 'Nai Harn and Ya Nui outings', url: '/guides/nai-harn-and-ya-nui-beaches/' },
        ],
      },
      {
        heading: 'One larger apartment or two separate homes?',
        paragraphs: [
          'Legendary’s official factsheet lists studios, several one-bedroom categories and several two-bedroom categories. For example, the standard one-bedroom range is 40–44 m² and the standard two-bedroom range is 65–70 m²; other named layouts are larger. Treat those as project specifications and ask to see the floor plan of the actual rental.',
          'The distinction appears in real rental marketing too: Holidays Phuket’s portfolio, checked on 1 November 2026, describes named Legendary one-bedroom options at 44 m² and 60 m². A search for “one bedroom at Legendary” can therefore lead to materially different spaces. A larger one-bedroom still needs its bed arrangement and occupancy confirmed.',
          'Our Both option totals 74 m² across two adjacent 37 m² apartments. It provides two queen bedrooms, two living rooms with sofa beds, two kitchens and two bathrooms. The entrances are separate and there is no internal connecting door. It works well for two households wanting independence; it is not one internally connected two-bedroom apartment.',
        ],
        table: {
          headings: ['Layout question', 'A single larger apartment', 'Our two adjacent Title V apartments'],
          rows: [
            ['Moving between bedrooms', 'Check the actual internal floor plan', 'Go through separate apartment entrances'],
            ['Meals and time together', 'Check the dining seats and shared living-room size', 'Two separate kitchens and living rooms'],
            ['Different bedtimes or work calls', 'Depends on the bedroom separation and common space', 'Each household has its own apartment and desk'],
            ['Children sleeping away from parents', 'Choose a layout that supports your supervision needs', 'Plan children within each household’s apartment'],
            ['Maximum group in our inventory', 'Confirm the selected rental’s occupancy policy', '4 adults + 4 children aged 14 or under, respecting each apartment’s 2-adult limit'],
          ],
        },
        links: [sources.legendary, sources.rentalPortfolio, { title: 'Photos and layout of Both at The Title V', url: '/stays/two-adjacent-apartments-title-v-rawai/' }],
      },
      {
        heading: 'Choose the facilities you will use',
        paragraphs: [
          'The developer’s project index described Legendary as ready to move when checked on 1 November 2026. For a rental, the useful next question is what your booking includes now: access to the pool or gym you want, opening times, parking arrangements and any temporary closures. Confirm these with the apartment operator for your dates.',
          'For Bright and Cozy, the equipment is shown in each apartment’s gallery: kitchen, washing machine, private balcony and dedicated desk. The residence has shared pools, a gym, sauna and coworking area, with access following condominium rules. If a particular facility decides your trip, ask about it before confirming.',
          'For a working stay, focus on the desk, chair, connection and the space for calls. For a family trip, focus on the bed setup, capacity and daily journeys with the children. A long facilities list is only useful when it includes the things your group expects to use.',
        ],
        links: [sources.projects, sources.bright, sources.cozy, { title: 'The Title V residence and shared spaces', url: '/residence/' }],
      },
      {
        heading: 'Compare a quote for the same dates and group',
        paragraphs: [
          'Request the total for the same occupied nights, number of adults and children’s ages. Keep cleaning, utilities and the refundable deposit visible. Compare cancellation and payment terms as well as the room rate, especially if a monthly offer depends on a longer contract.',
          'For our Title V apartments, cleaning is ฿1,500 for one apartment or ฿3,000 for Both. The base rate includes two guests per apartment; each additional child beyond that count costs ฿300 per night. Electricity at ฿6/kWh and water at ฿55/m³ are metered separately. The refundable deposit per booking is ฿10,000 up to 30 nights or ฿20,000 from 31 nights.',
          'Our calculator applies weekly or monthly discounts to accommodation and shows the stay estimate for the selected dates. Compare it with a written quote for your chosen Legendary apartment. A starting rate on a portfolio page cannot establish which stay costs less for your trip.',
        ],
        links: [sources.terms, { title: 'Title V rates and discounts', url: '/rates/' }],
      },
      {
        heading: 'Choose Bang Tao when it fits; consider Rawai when your plans do',
        paragraphs: [
          'Stay with a suitable Legendary option if Bang Tao is where you want to spend your days, your group needs a particular larger layout or you have already found the apartment that meets your requirements. A single connected home may be the right choice for a household that wants everyone together.',
          'Consider Bright or Cozy for a week or longer in Rawai, or Both when two households value separate homes beside each other. Each apartment accepts up to 2 adults and 2 children aged 14 or under; guests aged 15 or older count as adults. Check the photos, then enter your dates to see whether our Title V option fits.',
          'The links below book only our apartments at The Title V. For Legendary, arrange the exact apartment with its rental operator.',
        ],
        links: [
          { title: 'Compare our two apartments at The Title V', url: '/stays/' },
          { title: 'Check The Title V dates and prices', url: '/book/' },
          { title: 'See Both: the adjacent Title V apartments', url: '/stays/two-adjacent-apartments-title-v-rawai/' },
        ],
      },
    ],
    sources: [sources.legendary, sources.projects, sources.rentalPortfolio, sources.bangTao, sources.rawai, sources.naiHarn, sources.bright, sources.cozy, sources.terms],
    relatedGuides: ['title-halo-nai-yang-vs-title-v-rawai', 'two-apartments-for-family-and-friends', 'long-stays-in-rawai'],
  },
];
