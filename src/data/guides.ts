import { comparisonGuides } from './comparisons';
import { decisionGuides } from './decision-guides';
import { listicleGuides } from './listicles';
import { images, type GalleryImage } from './properties';
import { localSources, placeMapUrl, residenceLocation } from './location';

export interface GuideSource {
  title: string;
  url: string;
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  links?: GuideSource[];
  table?: { headings: string[]; rows: string[][] };
}

export interface Guide {
  slug: string;
  title: string;
  seoTitle?: string;
  heading?: string;
  metaDescription?: string;
  intro?: string;
  updatedAt?: string;
  category?: 'comparison' | 'listicle';
  eyebrow: string;
  summary: string;
  hero: GalleryImage;
  heroCredit?: { author: string; url: string; license?: string; licenseUrl?: string };
  readTime: string;
  sections: GuideSection[];
  sources: GuideSource[];
  relatedGuides: string[];
}

const map = (title: string, query: string): GuideSource => ({ title, url: placeMapUrl(query) });
const guideLink = (title: string, slug: string): GuideSource => ({ title, url: `/guides/${slug}/` });
const sources = {
  bright: { title: 'Bright apartment on Airbnb', url: 'https://www.airbnb.com/rooms/622135535519576635' },
  cozy: { title: 'Cozy apartment on Airbnb', url: 'https://www.airbnb.com/rooms/922904332708842126' },
  pair: { title: 'Both apartments on Airbnb', url: 'https://www.airbnb.com/rooms/926800271304117606' },
  rawai: { title: 'Rawai Beach', url: 'https://www.phuket.go.th/eng/Beaches-Rawai%20Beach.php' },
  naiHarn: { title: 'Nai Harn Beach', url: 'https://www.phuket.go.th/eng/Beaches-Nai%20Harn%20Beach.php' },
  yaNui: { title: 'Ya Nui Beach', url: 'https://www.phuket.go.th/eng/Beaches-Ya%20Nui%20Beach.php' },
  cape: { title: 'Promthep Cape', url: 'https://www.phuket.go.th/eng/Attractions-Capes.php' },
  airport: { title: 'Phuket Airport transport', url: 'https://phuket.airportthai.co.th/service/way-to-airport/detail/97' },
  airportTaxi: { title: 'Airport Limousine prices & pickup points', url: 'https://phuketairportlimousine.com/product/limousine-service-phuket-area-dropoff/' },
  bus: { title: 'Smart Bus timetable', url: 'https://phuketsmartbus.com/timetable/' },
  busHome: { title: 'Smart Bus stops & live tracking', url: 'https://phuketsmartbus.com/' },
  grab: { title: 'Grab Thailand · car services & booking help', url: 'https://www.grab.com/th/en/transport/' },
  townBus: { title: 'Airport Bus 8411 timetable', url: 'https://www.airportbusphuket.com/time-table/' },
  townBusFare: { title: 'Airport Bus 8411 fares', url: 'https://www.airportbusphuket.com/price-table/' },
  weather: { title: 'Phuket weather', url: 'https://www.tmd.go.th/en/weather/province/phuket' },
  thaiHua: { title: 'Thai Hua Museum', url: 'https://www.phuket.go.th/eng/Museums-Phuket%20Thai%20Hua%20Museum.php' },
  oldTown: { title: 'Phuket Old Town', url: 'https://www.tourismthailand.org/Articles/stroll-the-historic-roads-in-phuket-old-town' },
  kims: { title: 'Kim’s Rawai branch & photo gallery', url: 'https://www.kimsmassagespa.com/kimsrawaibeach' },
  kimsMenu: { title: 'Kim’s massage menu · choose Rawai / Kim’s 3', url: 'https://www.kimsmassagespa.com/packages' },
  park: { title: 'Rawai Park opening hours & events', url: 'https://www.rawaipark.com/' },
  parkRules: { title: 'Rawai Park age limits & visitor rules', url: 'https://www.rawaipark.com/rules' },
  isp: { title: 'ISP Nursery & Kindergarten', url: 'https://www.ispkindergarten.com/' },
  lighthouse: { title: 'Lighthouse International School', url: 'https://lighthousephuket.com/' },
  lighthouseContacts: { title: 'Lighthouse campus maps & contacts', url: 'https://lighthousephuket.com/contact/' },
  lighthouseKindergarten: { title: 'Lighthouse kindergartens', url: 'https://kindergartenphuket.com/' },
  bcis: { title: 'BCIS Phuket', url: 'https://www.bcisphuket.ac.th/' },
  treeMontessori: { title: 'Tree Montessori programmes & contact', url: 'https://treemontessori.com/en/' },
  buds: { title: 'Buds International School', url: 'https://www.buds-phuket.com/' },
  oakMeadow: { title: 'Oak Meadow International School', url: 'https://oakmeadow.ac.th/' },
  oakMeadowAdmissions: { title: 'Oak Meadow admissions & trial placements', url: 'https://oakmeadow.ac.th/pages/overview' },
  headStart: { title: 'HeadStart schools & campuses', url: 'https://headstartphuket.com/en/our-school/' },
  qsi: { title: 'QSI International School of Phuket', url: 'https://phuket.qsi.org/' },
  qsiAdmissions: { title: 'QSI admissions & placement', url: 'https://phuket.qsi.org/admissions' },
  kajonkiet: { title: 'Kajonkiet International School Phuket', url: 'https://www.kisp.academy/' },
  bisp: { title: 'British International School, Phuket', url: 'https://www.bisphuket.ac.th/' },
  krungsri: { title: 'Krungsri branch & ATM finder', url: 'https://www.krungsri.com/en/locations' },
  scbAtms: { title: 'SCB ATM locations', url: 'https://www.scb.co.th/getmedia/7e4e4401-347b-4fdb-a934-010c8fcd5bfd/scb-easy-id-atm-service.pdf' },
};

const naiHarnPhoto: GalleryImage = {
  src: '/images/guide-nai-harn.webp', width: 1752, height: 1168,
  alt: 'Nai Harn’s sandy bay, clear blue water and green headland',
  caption: 'Nai Harn Beach.',
};
const naiHarnCredit = {
  author: 'Tuderna',
  url: 'https://commons.wikimedia.org/wiki/File:Nai_Harn_beach_(%E0%B8%AB%E0%B8%B2%E0%B8%94%E0%B9%83%E0%B8%99%E0%B8%AB%E0%B8%B2%E0%B8%99)_-_panoramio.jpg',
  license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
};

export const guides: Guide[] = [
  {
    slug: 'rawai-neighborhood-guide', title: 'Your first days in Rawai', eyebrow: 'The neighborhood',
    summary: 'Seafood by the water, a stocked fridge and a beach day nearby. Start with the places you’ll use most.',
    hero: images.rawai, readTime: '2 min read',
    sections: [
      {
        heading: 'Start at the waterfront',
        paragraphs: ['Rawai is a working waterfront lined with longtail boats and seafood restaurants. Come for a morning walk, lunch by the water or a boat trip to the nearby islands. For swimming, head to Nai Harn or Ya Nui.', 'The Title V is close to the waterfront. Save the residence pin before your first walk so your return is easy.'],
        links: [{ title: 'The Title V on the map', url: residenceLocation.mapsUrl }, map('Rawai waterfront', 'Rawai Beach Phuket')],
      },
      {
        heading: 'Coffee, groceries and a first dinner',
        paragraphs: ['Tops Rawayana at Mixxmall is handy for fruit, drinking water and breakfast supplies. There’s a Starbucks in the same complex. We Café Rawai is another option for coffee, salads and a light lunch.', 'For dinner, try the seafood stalls and restaurants beside Rawai Pier. Nikita’s on the waterfront works well when your group wants a mix of Thai food, seafood and pizza.'],
        links: [guideLink('Food, cafés & groceries', 'rawai-food-and-markets'), guideLink('Banks, ATMs & exchange', 'rawai-banks-and-atms')],
      },
      {
        heading: 'Keep the first outing close',
        paragraphs: ['A beach afternoon at Nai Harn and sunset at Promthep Cape make an easy introduction to southern Phuket. Choose one or both depending on your energy after the flight.', 'Save longer drives for another day. There’s plenty nearby for a relaxed start: the residence pools, a massage at Kim’s Rawai branch, or a waterfront meal with the children.'],
        links: [guideLink('Choose a beach', 'nai-harn-and-ya-nui-beaches'), guideLink('Kim’s Massage in Rawai', 'rawai-massage-and-wellness')],
      },
    ],
    sources: [sources.rawai, localSources.mixxmall],
    relatedGuides: ['rawai-food-and-markets', 'nai-harn-and-ya-nui-beaches', 'getting-around-south-phuket'],
  },
  {
    slug: 'nai-harn-and-ya-nui-beaches', title: 'Nai Harn and Ya Nui: choose your beach', eyebrow: 'Beach days',
    summary: 'A wide sandy bay or a small cove? Both are a short drive from Rawai, and each is worth an unhurried visit.',
    hero: naiHarnPhoto, heroCredit: naiHarnCredit, readTime: '2 min read',
    sections: [
      {
        heading: 'Nai Harn for a full beach day',
        paragraphs: ['Nai Harn has a broad sweep of sand between green headlands, with a lake just inland. It’s the natural choice when you want a few hours at the beach rather than a quick stop.', 'Bring water, a towel and sun protection. Go early for a gentler start to the day, or come later when the light softens. A car or taxi keeps the journey from Rawai simple.'],
        links: [map('Nai Harn Beach on the map', 'Nai Harn Beach Phuket')],
      },
      {
        heading: 'Ya Nui for a smaller cove',
        paragraphs: ['Ya Nui sits between the Windmill viewpoint and Promthep Cape. Its compact bay makes a lovely stop on a drive around the southern coast.', 'On calm days, ask at the beach about snorkeling or kayak rental. Pair it with the viewpoint, then return to Rawai for dinner.'],
        links: [map('Ya Nui Beach on the map', 'Ya Nui Beach Phuket'), guideLink('Sunset at Promthep Cape', 'promthep-cape-sunset')],
      },
      {
        heading: 'Look at the flags first',
        paragraphs: ['Sea conditions change through the year, and strong currents can reach these bays. A red flag means stay out of the water. Follow the lifeguards’ advice; a walk on the sand or an afternoon by the pool is a good alternative.', 'Rawai itself is best for boats, seafood and a waterfront walk. Make Nai Harn or Ya Nui your swimming outing when conditions are suitable.'],
        links: [guideLink('Phuket through the seasons', 'phuket-seasons')],
      },
    ],
    sources: [sources.naiHarn, sources.yaNui, sources.weather],
    relatedGuides: ['promthep-cape-sunset', 'phuket-with-children', 'phuket-seasons'],
  },
  {
    slug: 'long-stays-in-rawai', title: 'Monthly stays in Rawai', eyebrow: 'A week or a month',
    seoTitle: 'Monthly Apartment Rentals in Rawai | The Title V',
    heading: 'A monthly apartment rental in Rawai: what to expect',
    metaDescription: 'Plan a month at The Title V in Rawai, Phuket: furnished apartments, discounts from 28 nights, separate utilities, deposits and everyday essentials.',
    intro: 'Settle into Bright or Cozy for 28 nights or longer, subject to availability. Each furnished one-bedroom apartment has a kitchen, washing machine, balcony and workspace.',
    updatedAt: '2026-11-01',
    summary: 'Furnished apartments, discounts from 28 nights and the costs to budget for a month in Rawai.',
    hero: images.brightBalcony, readTime: '4 min read',
    sections: [
      {
        heading: 'Space for everyday life',
        paragraphs: ['Bright and Cozy each have a separate queen bedroom, a living room with a sofa bed, a kitchen, washer, balcony and desk. You can make breakfast, do laundry and keep work separate from bedtime during a longer stay.', 'Both are furnished one-bedroom apartments at The Title V. Their layouts are similar, with different interiors; compare the actual photos before choosing your home for the month.'],
        links: [{ title: 'Inside Bright', url: '/stays/bright-1br-rawai-beach/' }, { title: 'Inside Cozy', url: '/stays/cozy-1br-rawai-beach/' }],
      },
      {
        heading: 'Price your exact dates',
        paragraphs: ['The minimum stay is seven nights. Accommodation receives a 10% discount for 7–27 nights or a 20% discount for 28 nights or longer. These discounts apply to accommodation only.', 'Enter your complete arrival and departure dates: seasonal nightly rates can change during one stay. Your monthly estimate reflects each occupied night, your apartment choice and guests.'],
        links: [{ title: 'Check dates & prices', url: '/book/' }, { title: 'Seasonal rates & discounts', url: '/rates/' }],
      },
      {
        heading: 'Budget for the whole stay',
        paragraphs: ['Alongside accommodation, allow for cleaning and any additional children, then keep metered utilities and the refundable deposit separate in your budget.'],
        table: {
          headings: ['Cost', 'What to allow for'],
          rows: [
            ['Cleaning', '฿1,500 per apartment per stay; ฿3,000 for both apartments.'],
            ['Guests', 'Two guests are included per apartment. Additional children beyond that count cost ฿300 per child per night. Each home allows at most two adults and two children aged 14 or under; guests aged 15+ count as adults.'],
            ['Electricity and water', 'Metered separately at ฿6/kWh and ฿55/m³. These charges are extra and are not included in the calculated stay total.'],
            ['Refundable security deposit', '฿10,000 through 30 nights; ฿20,000 for 31 nights or longer. It is separate from the stay price and charged once per booking, including a booking for both apartments.'],
          ],
        },
        links: [{ title: 'Booking terms & costs', url: '/booking-terms/' }],
      },
      {
        heading: '28 nights and 31 nights mean different things',
        paragraphs: ['The monthly accommodation discount starts at 28 nights. The higher deposit starts at 31 nights, so a 28-, 29- or 30-night booking receives the 20% accommodation discount with a ฿10,000 refundable deposit.', 'If you may extend, tell our booking team before relying on a later departure. We need to check the extra dates and confirm the revised price and any deposit change. Availability for an initial month does not reserve the following month.'],
      },
      {
        heading: 'Build your own routine',
        paragraphs: ['Use Tops Rawayana for groceries, find a favorite breakfast spot, and plan how you’ll get to the beach and other regular stops. The shared gym and coworking area give you a change of scene, subject to the residence’s opening hours and rules.', 'Working during your stay or coming with children? Tell us your working hours, equipment needs and the children’s ages before booking.'],
        links: [guideLink('Working from Rawai', 'work-from-phuket'), guideLink('Groceries & everyday food', 'rawai-food-and-markets'), guideLink('Local schools & kindergartens', 'rawai-schools-and-kindergartens')],
      },
      {
        heading: 'Still choosing your base in Phuket?',
        paragraphs: ['Choose around the places you expect to visit repeatedly. If you are comparing similarly named residences in Rawai, start with the development and exact apartment. For Nai Yang or Bang Tao, consider how those areas fit your daily plans before choosing Rawai.'],
        links: [guideLink('The Title developments in Rawai', 'the-title-rawai-phases-comparison'), guideLink('Cielo and The Title V in Rawai', 'title-cielo-vs-title-v-rawai'), guideLink('Halo in Nai Yang or The Title V in Rawai', 'title-halo-nai-yang-vs-title-v-rawai'), guideLink('Legendary in Bang Tao or The Title V in Rawai', 'title-legendary-bang-tao-vs-title-v-rawai')],
      },
    ],
    sources: [sources.bright, sources.cozy],
    relatedGuides: ['work-from-phuket', 'rawai-food-and-markets', 'rawai-schools-and-kindergartens'],
  },
  {
    slug: 'work-from-phuket', title: 'Work from Rawai', eyebrow: 'Work & island life',
    seoTitle: 'Working from Rawai: Apartment Wi-Fi & Workspaces',
    heading: 'Work from Phuket from your own apartment in Rawai',
    metaDescription: 'Explore the desks, Wi-Fi and everyday setup at The Title V in Rawai. See connection evidence and ask about your work needs before booking.',
    intro: 'Plan your working days around a separate bedroom, a desk and your own kitchen in Rawai. Review the actual workspace and connection evidence, then tell our team what your work requires.',
    updatedAt: '2026-11-01',
    summary: 'See the real desks, the original Cozy connection test and the everyday setup for working from Rawai.',
    hero: images.brightWorkspace, readTime: '3 min read',
    sections: [
      {
        heading: 'Look at your actual workspace',
        paragraphs: ['Each apartment has a dedicated desk, chair, Wi-Fi and Ethernet connection. The Bright workspace photo above and the individual apartment galleries show the actual setups.', 'Tell us if you need space for a monitor, particular power outlets or two people working at once. Ask our booking team to confirm the setup before booking, and bring the adapters and cables your own equipment uses.'],
        links: [{ title: 'Bright photos & workspace', url: '/stays/bright-1br-rawai-beach/' }, { title: 'Cozy photos & workspace', url: '/stays/cozy-1br-rawai-beach/' }],
      },
      {
        heading: 'Connection evidence for your work needs',
        paragraphs: ['The apartments have 100 Mbps internet plans with Wi-Fi and Ethernet. The original Cozy speed-test screenshot records 97.7 Mbps download; its test date is not shown. The screenshot documents Cozy’s connection on that occasion.', 'Speeds vary. If your work depends on video calls, large uploads or a VPN, request a fresh test for the apartment you plan to book and describe what you need.'],
        links: [{ title: 'View the original Cozy speed test', url: '/images/wifi-speed-test.jpg' }],
      },
      {
        heading: 'A change of scene',
        paragraphs: ['The residence has a shared coworking area as well as your apartment desk. Its use follows the residence’s opening hours and access rules; check the current arrangements before planning your working day around it.', 'For calls, consider the actual apartment layout and who else will be at home. If two households often have meetings at the same time, the adjacent apartments give each household its own desk, bedroom and living room.'],
        links: [guideLink('Staying in both apartments', 'two-apartments-for-family-and-friends')],
      },
      {
        heading: 'Leave room for the rest of the day',
        paragraphs: ['Thailand stays on UTC+7 throughout the year. Work out your meeting times before choosing a daily routine, especially when your home country changes its clocks.', 'A morning beach visit, lunch at We Café or a walk along Rawai’s waterfront can fit around work without a long drive. Keep one day free for Old Town or a boat outing when the sea is calm.'],
        links: [guideLink('Cafés & everyday food', 'rawai-food-and-markets'), guideLink('A slow week in Rawai', 'a-slow-week-in-rawai')],
      },
      {
        heading: 'Stay for a working week or a month',
        paragraphs: ['Stays start at seven nights. For 28 nights or longer, review the monthly guide for accommodation discounts, cleaning, utilities and the separate refundable deposit, then check the full dates you need.'],
        links: [guideLink('Monthly stays & full costs', 'long-stays-in-rawai'), { title: 'Check The Title V dates', url: '/book/' }],
      },
    ],
    sources: [sources.bright, sources.cozy],
    relatedGuides: ['long-stays-in-rawai', 'two-apartments-for-family-and-friends', 'rawai-neighborhood-guide'],
  },
  {
    slug: 'phuket-with-children', title: 'Rawai with children', eyebrow: 'Family time',
    seoTitle: 'Rawai with Children: Apartments & Family Stays',
    heading: 'Plan a family apartment stay in Rawai',
    metaDescription: 'Plan a family stay at The Title V in Rawai: sleeping arrangements, age limits, shared facilities and local outings, with an option for two households.',
    intro: 'Choose one apartment for up to two adults and two children aged 14 or under, or reserve both homes for two households. Each apartment has its own bedroom, kitchen and sofa bed.',
    updatedAt: '2026-11-01',
    summary: 'Sleeping arrangements, children’s ages, everyday costs and small outings for a family stay in Rawai.',
    hero: images.childrensPool, readTime: '3 min read',
    sections: [
      {
        heading: 'Start with sleeping and meals',
        paragraphs: ['Each apartment accommodates at most two adults and two children aged 14 or under, with a queen bed in the bedroom and a sofa bed in the living room. Guests aged 15 or over count as adults, so include every guest’s age when planning who sleeps in each home.', 'The kitchen is useful for familiar breakfasts and snacks, and the washer helps with beach clothes. If you need a cot, high chair or other baby equipment, ask before booking so the team can confirm what is available.'],
      },
      {
        heading: 'Plan the family budget',
        paragraphs: ['The base rate includes two guests per apartment. Additional children beyond those two guests cost ฿300 per child per night. The seven-night minimum applies, and weekly or monthly discounts apply only to accommodation.', 'Cleaning is ฿1,500 per apartment per stay. Metered electricity and water cost extra; the refundable security deposit is separate from the stay price. Check the full dates and children’s ages for your estimate.'],
        links: [{ title: 'Check family dates & prices', url: '/book/' }, { title: 'Guest limits & booking terms', url: '/booking-terms/' }],
      },
      {
        heading: 'Two households can stay side by side',
        paragraphs: ['Bright and Cozy are adjacent, independent homes, each with its own entrance, kitchen and bathroom. There is no internal connecting door. Both together accommodate up to four adults and four children aged 14 or under, with the limits respected in each apartment.', 'Plan which adults and children will use each home before booking. The pair works when each household wants its own living space and bedtime routine.'],
        links: [{ title: 'See the two adjacent apartments', url: '/stays/two-adjacent-apartments-title-v-rawai/' }, guideLink('Planning a shared trip', 'two-apartments-for-family-and-friends')],
      },
      {
        heading: 'Pool mornings and a beach afternoon',
        paragraphs: ['The residence has shared pools, a children’s pool and an outdoor playground. Stay with children around the water and play areas.', 'For a beach trip, try Nai Harn when the sea is calm. Bring shade and water, follow the flags, and leave time to return for a rest. One outing a day is often plenty in the heat.'],
        links: [guideLink('Nai Harn & Ya Nui', 'nai-harn-and-ya-nui-beaches')],
      },
      {
        heading: 'A few plans beyond the pool',
        paragraphs: ['Rawai Park is closed for improvements from November 2026, according to its official notice checked on 4 November. Wait for a confirmed reopening before planning a visit. The residence’s shared children’s pool and small playground offer time close to home, with adult supervision.', 'For a longer stay, contact local nurseries and schools before arrival. Start with your child’s age, language and dates, then arrange a visit.'],
        links: [guideLink('Check the Rawai Park closure update', 'rawai-park-with-children'), guideLink('Schools & kindergartens', 'rawai-schools-and-kindergartens')],
      },
    ],
    sources: [sources.bright, sources.cozy, sources.park],
    relatedGuides: ['rawai-park-with-children', 'rawai-schools-and-kindergartens', 'two-apartments-for-family-and-friends'],
  },
  {
    slug: 'phuket-airport-to-rawai', title: 'Phuket Airport to Rawai: taxi or bus?', eyebrow: 'Getting here',
    summary: 'A direct car for an easy arrival, or the ฿100 coastal bus. Here are the fares, pickup points and departures.',
    hero: images.bus, readTime: '3 min read',
    sections: [
      {
        heading: 'Taxi: straight to the apartment',
        paragraphs: ['Phuket Airport Limousine lists Rawai at ฿1,000 for a taxi with up to three passengers, or ฿1,400 for a Fortuner with up to four. Its Fortuner service is listed for 07:00–18:00. Agree the fare and luggage space when booking; request child seats ahead.', 'The operator’s counters are outside Domestic Exit 1 and International Exit 2. A prebooked car is the simplest option with children, several bags or a late arrival. Grab also shows a fare and pickup instructions in the app.'],
        links: [sources.airportTaxi],
      },
      {
        heading: 'Smart Bus: ฿100 along the coast',
        paragraphs: ['The Phuket Smart Bus runs from the Domestic Terminal through Surin, Kamala, Patong, Karon and Kata to Rawai Beach. The fare is ฿100 per person. The published journey takes about 2 hours 10 minutes to 2 hours 40 minutes, before traffic delays.', 'Departures below are from the operator’s timetable checked on 23 October 2026. Open the live tracker before walking to the stop.'],
        table: {
          headings: ['Direction', 'Departures'],
          rows: [
            ['Airport → Rawai', '08:15; every 30 minutes from 09:00 to 22:00; then 22:40 and 23:30.'],
            ['Rawai → Airport', '06:45, 07:45, 08:45, 09:45; then 10:20 and 10:45, repeating each hour through 17:45; 18:20, 18:40 and 19:30.'],
          ],
        },
        links: [sources.bus, sources.busHome, map('Rawai Smart Bus stop', 'Phuket Smart Bus Rawai Beach bus stop')],
      },
      {
        heading: 'The other airport bus goes to town',
        paragraphs: ['Airport Bus 8411 costs ฿100 to Phuket Town’s Bus Terminal 1. It does not continue to Rawai, so you’ll need another ride from town. Choose the Smart Bus for a direct coastal route to Rawai.'],
        links: [sources.townBus, sources.townBusFare],
      },
      {
        heading: 'Arriving at The Title V',
        paragraphs: ['Give your driver the full destination: The Title V (Rawai–Phuket), 555 Wiset Road. Our local agent will meet you for the handover. Send your flight details and keep the arrival instructions on your phone.', 'Check-in starts at 15:00. For the return trip, leave plenty of time for traffic as well as your airline’s check-in deadline.'],
        links: [{ title: 'The Title V directions', url: residenceLocation.directionsUrl }],
      },
    ],
    sources: [sources.airport],
    relatedGuides: ['getting-around-south-phuket', 'rawai-neighborhood-guide', 'rawai-banks-and-atms'],
  },
  {
    slug: 'getting-around-south-phuket', title: 'Getting around southern Phuket', eyebrow: 'Local transport',
    summary: 'Plan Rawai without a scooter: local errands, booked car rides, beach outings and the coastal bus.',
    updatedAt: '2026-11-01',
    hero: images.bus, readTime: '3 min read',
    sections: [
      {
        heading: 'Staying in Rawai without a scooter',
        paragraphs: ['Plan around the places you will actually use: the residence entrance, groceries, meals and your chosen beaches. Save each exact map pin before arrival, then check the route on foot in daylight before making it part of your daily routine.', 'Look at pavements, road crossings, lighting and how the route suits your group. A map’s walking suggestion does not establish an accessible or comfortable route. For heavy shopping, rain or a route you do not want to walk, arrange a car ride.'],
        table: {
          headings: ['Your outing', 'How to plan it'],
          rows: [
            ['Groceries and meals in Rawai', 'Save Tops Rawayana at Mixxmall and the waterfront restaurants you want to use. Combine a small shop with a meal; plan a ride back for bulky supplies.'],
            ['Nai Harn, Ya Nui or Promthep Cape', 'Arrange a taxi or car for the beach or viewpoint, with an agreed pickup place and return plan.'],
            ['Kata, Karon or Patong', 'Compare a direct car ride with the coastal Smart Bus. Check the last return service before choosing your outward trip.'],
            ['Old Town or several stops in one day', 'Agree the route with a driver and ask whether the quote includes waiting, extra stops and the return to Rawai.'],
          ],
        },
        links: [guideLink('Groceries & places to eat', 'rawai-food-and-markets'), { title: 'The residence and local map', url: '/location/' }, map('Tops Rawayana at Mixxmall', 'Tops Rawayana Phuket')],
      },
      {
        heading: 'Taxis and app rides',
        paragraphs: ['Save The Title V’s map pin and use the actual entrance as your pickup or return point. For a taxi, agree the fare before leaving. For an app ride, enter the destination, check the offered vehicle and pickup point, and review the fare before confirming.', 'Grab lists car services in Phuket and lets you message the driver in the app. Check the options available for your particular trip. For beaches and sunset viewpoints, arrange how you’ll get back; request child seats in advance and confirm that the driver can provide them.'],
        links: [{ title: 'Save The Title V on the map', url: residenceLocation.mapsUrl }, sources.grab],
      },
      {
        heading: 'The ฿100 coastal bus',
        paragraphs: ['Phuket Smart Bus links Rawai with Kata, Karon, Patong and the airport along the coast. The operator’s timetable, checked on 1 November 2026, lists the Airport–Rawai route at ฿100.', 'Check the current stops, departure and return times before setting out, then use the live tracker. The bus serves its route and stops, so plan the journey between your stop and your actual destination too. Times can change with traffic.'],
        links: [sources.bus, sources.busHome, guideLink('Airport transfers & fares', 'phuket-airport-to-rawai')],
      },
      {
        heading: 'Renting a car or scooter',
        paragraphs: ['Enigma rents cars and scooters in Rawai; Anda Rawai is another local motorbike option. Compare the total price, deposit, insurance and pickup or delivery arrangements.', 'A car is usually more practical with children or several beach bags. For a scooter, wear a properly fitted helmet and make sure your licence and insurance cover the bike.'],
        links: [{ title: 'Enigma rentals', url: localSources.rental.url }, { title: 'Anda Rawai rentals', url: localSources.bike.url }],
      },
    ],
    sources: [],
    relatedGuides: ['phuket-airport-to-rawai', 'nai-harn-and-ya-nui-beaches', 'promthep-cape-sunset'],
  },
  {
    slug: 'rawai-food-and-markets', title: 'Where to eat, get coffee and buy groceries', eyebrow: 'Everyday favorites',
    summary: 'A few useful starting points for breakfast, a stocked fridge and dinner by the sea.',
    hero: images.seafoodMarket, readTime: '2 min read',
    sections: [
      {
        heading: 'Groceries and morning coffee',
        paragraphs: ['Tops Rawayana at Mixxmall is a handy supermarket for breakfast ingredients, fruit, drinking water and household supplies. Starbucks is in the same complex, so you can combine coffee with a small grocery run.', 'Keep the first shop simple. The apartments have a hob, microwave and fridge for easy meals at home.'],
        links: [map('Tops Rawayana', 'Tops Rawayana Phuket'), map('Starbucks at Mixxmall', 'Starbucks Rawayana Mixxmall Rawai Phuket')],
      },
      {
        heading: 'Seafood beside Rawai Pier',
        paragraphs: ['At Rawai Seafood Market, choose seafood at the stalls and have a nearby restaurant cook it. Agree the ingredient price and the separate cooking charge before buying.', 'Mook Manee is a useful restaurant to start with in the market area. You can also order directly from the restaurant if you prefer a simpler dinner.'],
        links: [guideLink('How the seafood market works', 'rawai-seafood-market'), map('Mook Manee', 'Mook Manee Rawai Phuket')],
      },
      {
        heading: 'When everyone wants something different',
        paragraphs: ['Nikita’s on the waterfront serves Thai food, seafood, pizza and other international dishes. It works well for a mixed group after a day out.', 'We Café Rawai is a good option for salads, café food and coffee. Choose the Rawai branch when opening directions.'],
        links: [map('Nikita’s Beach Restaurant', 'Nikitas Beach Restaurant Rawai Phuket'), map('We Café Rawai', 'WeCafe Rawai Phuket')],
      },
    ],
    sources: [localSources.tops, localSources.mixxmall, localSources.weCafe, localSources.nikitas],
    relatedGuides: ['rawai-seafood-market', 'rawai-banks-and-atms', 'phuket-festivals-and-night-markets'],
  },
  {
    slug: 'a-slow-week-in-rawai', title: 'A slow week in Rawai', eyebrow: 'Seven easy days',
    summary: 'A loose plan with beaches, good food and enough room to do very little.',
    hero: images.poolCourtyard, readTime: '2 min read',
    sections: [
      {
        heading: 'Days 1–2: settle in, then find the beach',
        paragraphs: ['On arrival, unpack, pick up a few groceries and have dinner nearby. The pools and a short waterfront walk are enough for the first afternoon.', 'Make Nai Harn your first proper outing. Spend a few hours on the sand, come home for a rest, then choose a restaurant along Rawai’s waterfront.'],
        links: [guideLink('Nai Harn & Ya Nui', 'nai-harn-and-ya-nui-beaches')],
      },
      {
        heading: 'Days 3–4: one outing, one quiet day',
        paragraphs: ['Choose a longtail trip if the sea is calm, or head to Phuket Old Town for a walk and lunch. Keep the following day light: breakfast on the balcony, a swim and a massage at Kim’s Rawai branch.', 'With children, keep an afternoon for the residence’s shared children’s pool and small playground, with adult supervision. Rawai Park is closed for improvements from November 2026; check its reopening notice before adding it to your plans.'],
        links: [guideLink('Longtail trips from Rawai', 'island-trips-from-rawai'), guideLink('Rawai Park', 'rawai-park-with-children'), guideLink('Festivals & night markets', 'phuket-festivals-and-night-markets')],
      },
      {
        heading: 'Days 5–7: the southern coast, then favorites',
        paragraphs: ['Try Ya Nui and the Windmill viewpoint, finishing with sunset at Promthep Cape. On another evening, take your time over dinner at the seafood market.', 'Leave your final full day open. Revisit your favorite beach, enjoy the residence, or do the outing the weather postponed. Arrange the airport ride before the last evening.'],
        links: [guideLink('Promthep Cape', 'promthep-cape-sunset'), guideLink('Airport transport', 'phuket-airport-to-rawai')],
      },
    ],
    sources: [sources.oldTown],
    relatedGuides: ['rawai-food-and-markets', 'phuket-rainy-day-guide', 'island-trips-from-rawai'],
  },
  {
    slug: 'promthep-cape-sunset', title: 'Sunset at Promthep Cape', eyebrow: 'The southern coast',
    summary: 'An open sea horizon and one of Phuket’s classic evening views, close to Rawai.',
    hero: {
      src: '/images/guide-promthep.webp', width: 1920, height: 1440,
      alt: 'Palm trees and the view along the coast from Promthep Cape toward Nai Harn', caption: 'The view along the coast from Promthep Cape.',
    },
    heroCredit: { author: 'ADwarf', url: 'https://commons.wikimedia.org/wiki/File:Promthep_Cape_03.jpg', license: 'Public domain', licenseUrl: 'https://commons.wikimedia.org/wiki/File:Promthep_Cape_03.jpg#Licensing' },
    readTime: '2 min read',
    sections: [
      {
        heading: 'Arrive before the sun goes down',
        paragraphs: ['Aim to arrive about 30–45 minutes before sunset. That gives you time to walk up from the parking area and enjoy the changing light without rushing.', 'The main viewpoint looks over the headland and offshore islands. You don’t need to scramble down the cape to enjoy the view. Keep children close around the steps and edges.'],
        links: [map('Promthep Cape on the map', 'Promthep Cape Phuket')],
      },
      {
        heading: 'Make an afternoon of the southern coast',
        paragraphs: ['Ya Nui Beach and the Windmill viewpoint are nearby stops if you want a longer outing. Spend the afternoon at the beach, then continue to the cape as the day cools.', 'Take water and wear shoes you’re comfortable walking in. If rain moves in, save the viewpoint for another evening.'],
        links: [map('Windmill viewpoint', 'Windmill Viewpoint Phuket'), guideLink('Nai Harn & Ya Nui', 'nai-harn-and-ya-nui-beaches')],
      },
      {
        heading: 'Dinner back in Rawai',
        paragraphs: ['Agree a pickup place with your driver before wandering off. Sunset draws visitors, so allow a little patience on the way out.', 'Back at the waterfront, choose seafood by the pier or an easy dinner at Nikita’s. The view is the main event; the rest of the evening can stay simple.'],
        links: [guideLink('Dinner on the waterfront', 'rawai-food-and-markets')],
      },
    ],
    sources: [sources.cape],
    relatedGuides: ['nai-harn-and-ya-nui-beaches', 'rawai-seafood-market', 'getting-around-south-phuket'],
  },
  {
    slug: 'phuket-rainy-day-guide', title: 'A rainy day in Rawai', eyebrow: 'A change of plans',
    summary: 'Coffee, a massage, a museum or a quiet day at home. Keep a few easy options ready.',
    hero: images.cozyLiving, readTime: '2 min read',
    sections: [
      {
        heading: 'Stay local',
        paragraphs: ['Start with coffee and a late breakfast, then book a massage at Kim’s Rawai branch. Mixxmall is useful for groceries and a café stop when you want a small outing close to home.', 'Heavy rain is a good reason to leave the scooter parked and take a car. Save the beach and boat trip for a better weather window.'],
        links: [guideLink('Kim’s Massage in Rawai', 'rawai-massage-and-wellness'), guideLink('Cafés & groceries', 'rawai-food-and-markets')],
      },
      {
        heading: 'Make a day of Old Town',
        paragraphs: ['If you feel like going farther, combine Phuket Old Town with Thai Hua Museum and lunch. The museum is a good place to learn about Phuket’s Chinese heritage.', 'Check the museum’s opening hours before the drive. Leave space between stops so you can wait out a shower over coffee.'],
        links: [map('Thai Hua Museum', 'Phuket Thai Hua Museum'), sources.oldTown],
      },
      {
        heading: 'Enjoy the apartment',
        paragraphs: ['Cook something simple, read on the sofa or catch up with work at the desk. A separate living room and washing machine make a day in useful as well as restful.', 'You can also use the shared gym and coworking area during opening hours. A holiday doesn’t need a full schedule every day.'],
      },
    ],
    sources: [sources.thaiHua, sources.weather],
    relatedGuides: ['rawai-massage-and-wellness', 'rawai-food-and-markets', 'phuket-seasons'],
  },
  {
    slug: 'two-apartments-for-family-and-friends', title: 'Travel together, with a home each', eyebrow: 'Family & friends',
    seoTitle: 'Planning a Group Stay in Two Rawai Apartments',
    heading: 'Plan a trip together with a separate home for each household',
    metaDescription: 'Plan a shared trip in Bright and Cozy at The Title V: separate entrances, sleeping arrangements, arrival plans and dates that work for both homes.',
    intro: 'Two adjacent apartments let two households stay close while keeping separate kitchens, bathrooms and routines.',
    updatedAt: '2026-11-01',
    summary: 'Plan sleeping arrangements, shared outings and separate arrivals for a trip in Bright and Cozy.',
    hero: images.pairedApartments, readTime: '3 min read',
    sections: [
      {
        heading: 'Choose who stays in each home',
        paragraphs: ['Bright and Cozy are two independent 37 m² apartments next door to each other. Each has its own entrance, queen bedroom, living room with sofa bed, kitchen, bathroom and balcony. There is no internal connecting door.', 'Plan your room allocation before booking: each apartment allows at most two adults and two children aged 14 or under. Guests aged 15 or over count as adults. Across both homes, the maximum is four adults and four children, with each apartment’s limit respected.'],
        links: [{ title: 'Photos & details of the two adjacent apartments', url: '/stays/two-adjacent-apartments-title-v-rawai/' }],
      },
      {
        heading: 'Time together and space to retreat',
        paragraphs: ['Agree a simple shared plan, such as a beach morning or dinner, while leaving each household free to keep its own mornings and bedtimes. The dining table in each apartment seats two, so a restaurant is the practical choice for a meal with the whole group.', 'If part of the group is working, compare the workspace photos and meeting hours before deciding who stays where. Each home has its own desk and internet connection. For young children, plan which adults will be with them in each separate home.'],
        links: [guideLink('Working from Rawai', 'work-from-phuket')],
      },
      {
        heading: 'Agree the dates and shared costs',
        paragraphs: ['The minimum stay is seven nights. Send one enquiry with the full dates, every guest and the children’s ages, plus your proposed household split. Both apartments need to be available for the whole stay; mention different departure dates before making plans.', 'Cleaning for both apartments is ฿3,000 per stay. Metered electricity and water are extra. The refundable deposit is charged once per booking: ฿10,000 through 30 nights or ฿20,000 from 31 nights, shown separately from the stay price. Agree how your households will share these costs before booking.'],
        links: [{ title: 'Check dates for both apartments', url: '/book/' }, { title: 'Booking terms & all guest charges', url: '/booking-terms/' }],
      },
      {
        heading: 'Coordinate arrivals and the first day',
        paragraphs: ['Share both flight details and arrival times with our local agent if you are travelling separately. Check-in starts at 15:00; ask ahead about an earlier arrival, which depends on availability and may cost extra.', 'Choose who will handle the first grocery run and where you will meet once both households are settled. For a shared taxi outing, confirm the vehicle has room for everyone and any child seats you need.'],
        links: [guideLink('Airport transfers', 'phuket-airport-to-rawai'), guideLink('Getting around together', 'getting-around-south-phuket')],
      },
    ],
    sources: [sources.pair],
    relatedGuides: ['phuket-with-children', 'work-from-phuket', 'a-slow-week-in-rawai'],
  },
  {
    slug: 'rawai-seafood-market', title: 'Dinner at Rawai Seafood Market', eyebrow: 'By the pier',
    summary: 'Choose fresh seafood, have it cooked nearby and settle in for a waterfront dinner.',
    hero: images.seafoodMarket, readTime: '2 min read',
    sections: [
      {
        heading: 'Choose your seafood',
        paragraphs: ['The market is beside Rawai Pier, with stalls and restaurants close together. Have a look around before buying; fish, prawns and shellfish are sold by weight.', 'Ask the price, watch the weighing and agree the total. Then take your seafood to a nearby restaurant to cook, or simply order a meal directly from a restaurant.'],
        links: [map('Rawai Seafood Market on the map', 'Rawai Seafood Market Phuket')],
      },
      {
        heading: 'Agree the cooking charge',
        paragraphs: ['The seafood and its preparation are usually two separate bills. Ask how much the restaurant will charge before handing over your purchase, including rice, sauces and side dishes.', 'Tell the restaurant how many people are eating, how spicy you like the food and how you’d like it cooked. Mention any food allergies clearly.'],
      },
      {
        heading: 'A couple of places to start',
        paragraphs: ['Mook Manee, beside the market, serves seafood and is listed in the MICHELIN Guide. Look at its menu and seafood selection before deciding what to order.', 'If part of the group would prefer pizza or other dishes, Nikita’s is an easy alternative along the waterfront. Leave time for a walk after dinner.'],
        links: [map('Mook Manee', 'Mook Manee Rawai Phuket'), map('Nikita’s', 'Nikitas Beach Restaurant Rawai Phuket')],
      },
    ],
    sources: [localSources.mookManee, localSources.nikitas],
    relatedGuides: ['rawai-food-and-markets', 'rawai-neighborhood-guide', 'island-trips-from-rawai'],
  },
  {
    slug: 'island-trips-from-rawai', title: 'A longtail day from Rawai', eyebrow: 'Out on the water',
    summary: 'Bon Island and Coral Island are close enough for a day out. Choose a calm day and agree the whole trip before leaving.',
    hero: images.rawai, readTime: '2 min read',
    sections: [
      {
        heading: 'Bon Island for a simple outing',
        paragraphs: ['Longtails from Rawai can take you to Bon Island, also called Koh Bon. It’s a natural option when you want an island trip starting near the apartment.', 'Ask where the boat lands, whether the captain waits and how the return works. Find out what food, shade and toilets will be available, then pack accordingly.'],
        links: [map('Bon Island', 'Koh Bon Island Rawai Phuket')],
      },
      {
        heading: 'Coral Island for a longer beach day',
        paragraphs: ['Coral Island is also called Koh Hey or Koh Hae. Trips use different beaches and offer different activities, so choose the actual itinerary rather than just the island name.', 'JC Tour publishes private longtail trips to Bon and Coral Island. Ask for the departure point of your chosen trip; some Phuket island tours leave from Chalong.'],
        links: [{ title: 'Private longtail itineraries', url: localSources.charter.url }],
      },
      {
        heading: 'Before you set off',
        paragraphs: ['Check the weather and ask the captain about the sea. If it’s rough, choose another day.', 'Agree the full price, return time, landing fees, food and snorkeling equipment. Ask for life jackets that fit everyone, including children. Keep the captain’s contact on your phone and avoid a boat outing on the morning of a flight.'],
        links: [sources.weather],
      },
    ],
    sources: [localSources.bon, { title: 'Coral Island', url: 'https://www.phuket.go.th/eng/Is-Hey%20Island.php' }],
    relatedGuides: ['rawai-seafood-market', 'nai-harn-and-ya-nui-beaches', 'phuket-rainy-day-guide'],
  },
  {
    slug: 'rawai-massage-and-wellness', title: 'A massage at Kim’s in Rawai', eyebrow: 'A quieter afternoon',
    summary: 'Kim’s has a branch on Rawai Beach Road, handy for a massage followed by dinner on the waterfront.',
    hero: {
      src: '/images/guide-kims-rawai.webp', width: 960, height: 640,
      alt: 'Kim’s 3 Massage & Spa storefront on Rawai Beach Road at dusk', caption: 'Kim’s 3 on Rawai Beach Road.',
    },
    heroCredit: {
      author: 'Kim’s Massage & Spa', url: 'https://www.kimsmassagespa.com/kimsrawaibeach',
    },
    readTime: '2 min read',
    sections: [
      {
        heading: 'Choose Kim’s 3 · Rawai Beach',
        paragraphs: ['Kim’s Massage & Spa has several branches in Phuket. The local one is Kim’s 3 at 50/5 Wiset Road, on Rawai Beach Road.', 'Walk in or book ahead, especially for two people together. Use the Rawai branch gallery and menu below to see the rooms and choose a treatment.'],
        links: [map('Kim’s 3 Rawai on the map', "Kim's Massage Spa 3 50/5 Wiset Road Rawai Phuket"), sources.kims],
      },
      {
        heading: 'Pick the treatment and pressure',
        paragraphs: ['Kim’s publishes a separate Rawai menu. Choose the treatment and length you want, then ask for the current price when booking.', 'Tell the therapist whether you prefer gentle or firm pressure, and speak up during the session if you want it changed. If you’re booking for two, ask whether you can have appointments at the same time.'],
        links: [sources.kimsMenu],
      },
      {
        heading: 'Book directly',
        paragraphs: ['Call the Rawai branch on +66 76 510 510 or use Kim’s WhatsApp on +66 81 979 0021. Include “Kim’s 3 Rawai”, your date, time, treatment and number of people.', 'Leave the rest of the afternoon easy: coffee, a stroll by the boats and dinner on the waterfront are all good companions to a massage.'],
        links: [{ title: 'Call Kim’s Rawai', url: 'tel:+6676510510' }, { title: 'WhatsApp Kim’s', url: 'https://wa.me/66819790021' }],
      },
    ],
    sources: [],
    relatedGuides: ['phuket-rainy-day-guide', 'rawai-food-and-markets', 'long-stays-in-rawai'],
  },
  {
    slug: 'rawai-park-with-children', title: 'Rawai Park: temporary closure from November 2026', eyebrow: 'Family outing update',
    summary: 'Rawai Park is closed for improvements from November 2026. Check its official reopening updates before planning a family visit.',
    updatedAt: '2026-11-04',
    hero: {
      src: '/images/guide-rawai-park-courtyard.webp', width: 960, height: 641,
      alt: 'Rawai Park’s colorful building with its name, mascot and landscaped courtyard', caption: 'The courtyard at Rawai Park.',
    },
    heroCredit: { author: 'Rawai Park', url: 'https://www.rawaipark.com/' },
    readTime: '2 min read',
    sections: [
      {
        heading: 'Closed for improvements',
        paragraphs: ['Rawai Park’s official website announces a closure for facility improvements from November 2026. The notice checked on 4 November does not give a reopening date and directs visitors to its social channels for updates.'],
        links: [sources.park],
      },
      {
        heading: 'Before a future visit',
        paragraphs: ['Wait for the park to confirm reopening, then check the available play areas, age rules, opening hours and admission price. Older hours and activity descriptions do not confirm that the park is currently open.'],
        links: [sources.park, sources.parkRules],
      },
      {
        heading: 'An easy family day at The Title V',
        paragraphs: ['For a day close to the apartment, enjoy the residence’s shared children’s pool and small outdoor playground, following the residence rules and supervising children throughout. A waterfront meal makes an easy change of scene afterward.'],
        links: [guideLink('More ideas for Rawai with children', 'phuket-with-children'), { title: 'Explore The Title V facilities', url: '/residence/' }],
      },
    ],
    sources: [],
    relatedGuides: ['phuket-with-children', 'rawai-schools-and-kindergartens', 'rawai-food-and-markets'],
  },
  {
    slug: 'rawai-schools-and-kindergartens', title: 'Schools in Rawai, Chalong & central Phuket', eyebrow: 'Longer family stays',
    seoTitle: 'Phuket International Schools: Rawai, Chalong & Central | The Title V',
    summary: 'Explore ten schools and kindergartens, from Montessori in Rawai to Oak Meadow, HeadStart and international campuses across central Phuket.',
    metaDescription: 'Explore schools in Rawai, Chalong and central Phuket: Tree Montessori, Oak Meadow, BCIS, HeadStart, QSI, Kajonkiet and BISP, with official links and maps.',
    intro: 'Find a school that fits your child and your days in Phuket. Start with Rawai and Chalong, then explore the international campuses in Wichit, Kathu and Koh Kaew.',
    updatedAt: '2026-11-01',
    hero: {
      src: '/images/guide-isp-rawai.webp', width: 960, height: 640,
      alt: 'The ISP Nursery and Kindergarten campus building in Rawai', caption: 'ISP Nursery & Kindergarten in Rawai.',
    },
    heroCredit: { author: 'ISP Nursery & Kindergarten', url: 'https://www.ispkindergarten.com/' },
    readTime: '6 min read',
    sections: [
      {
        heading: 'Start with the area and your child’s age',
        paragraphs: ['For a family stay at The Title V, the daily journey matters as much as the curriculum. Shortlist a few schools, visit during term time and try the drive at morning drop-off and afternoon pickup.'],
        bullets: ['Rawai: ISP Nursery & Kindergarten, Tree Montessori and Lighthouse’s primary campus.', 'Chalong: BCIS, Buds and Lighthouse’s Chalong kindergarten.', 'Central Phuket and farther north: Oak Meadow and HeadStart Chaofah City in Wichit, QSI and Kajonkiet International in Kathu, and BISP in Koh Kaew.'],
      },
      {
        heading: 'ISP Nursery & Kindergarten · Rawai',
        paragraphs: ['ISP’s Rawai campus takes children aged two to six and follows the British Early Years Foundation Stage. Its website has the daily schedule, campus photos and 2026–27 fees.', 'This is a useful first option for younger children. Ask about your exact dates, settling-in time, naps and the minimum enrolment period.'],
        links: [sources.isp, map('ISP Nursery & Kindergarten map', 'ISP Nursery Kindergarten Rawai Phuket')],
      },
      {
        heading: 'Tree Montessori · Rawai',
        paragraphs: ['International Montessori Kindergarten “Tree” is on Soi Metta in Rawai. It lists junior groups for ages 1½–3 and senior groups for ages 3–6, with daily Montessori sessions and multilingual learning.', 'A local option for families looking for Montessori in Rawai. Ask which languages are used in your child’s group, how settling in works and which programmes are currently enrolling.'],
        links: [sources.treeMontessori, map('Tree Montessori map', 'Tree Montessori Kindergarten 43/232 Soi Metta Rawai Phuket')],
      },
      {
        heading: 'Lighthouse · Rawai and Chalong',
        paragraphs: ['Lighthouse offers kindergarten, primary and secondary education. Its primary campus is at 21/1 Soi Salika in Rawai, and its secondary campus is at 95/43 Moo 4, Soi Sanya Yukhunthon.', 'The kindergarten group lists Rawai and Chalong options for ages one to seven. Tell admissions your child’s age so they can direct you to the right campus and explain the Canadian and Cambridge pathways.'],
        links: [sources.lighthouse, sources.lighthouseKindergarten, sources.lighthouseContacts],
      },
      {
        heading: 'BCIS Phuket · Chalong',
        paragraphs: ['BCIS offers British Cambridge and French curricula for ages 2–18, from early years through secondary education. Its campus is at 28/89 Moo 4 in Chalong.', 'Include it on your shortlist if you want a choice of English or French education. Ask admissions about the right programme, language support and transport from Rawai.'],
        links: [sources.bcis, map('BCIS Phuket map', 'BCIS International School Phuket 28/89 Chalong')],
      },
      {
        heading: 'Buds International School · Chalong',
        paragraphs: ['Buds has nursery, kindergarten and primary programmes on Soi Palai 2 in Chalong. Its English-medium teaching uses the American Common Core curriculum, with small classes and a published age range of 18 months to 12 years.', 'For a younger child or a primary pupil, ask about the current class group and enrolment options for your stay. Request a complete fee quote, including meals, aftercare and transport.'],
        links: [sources.buds, map('Buds International School map', 'Buds International School 4/6 Soi Palai 2 Chalong Phuket')],
      },
      {
        heading: 'Oak Meadow International School · Wichit',
        paragraphs: ['Oak Meadow offers an American curriculum from nursery and kindergarten through primary, middle and high school. Its address is 10/49 in Wichit, between the Chalong area and Phuket Town.', 'It’s an option for families who want to continue a US education pathway. Admissions also lists trial placements: ask which year groups can accommodate your child, the minimum duration and the correct campus for your visit.'],
        links: [sources.oakMeadow, sources.oakMeadowAdmissions, map('Oak Meadow campus map', 'Oak Meadow International School 10/49 Wichit Phuket')],
      },
      {
        heading: 'HeadStart International School · Chaofah City, Wichit',
        paragraphs: ['HeadStart follows a British curriculum, with foundation, primary, secondary and sixth-form stages for ages 2–18. Its pathways include Cambridge IGCSEs and A levels.', 'For central Phuket, look at the Chaofah City campus on Vichitsongkram Road in Wichit. HeadStart also has a separate Cherngtalay campus, so specify Chaofah City when booking a tour or asking about a school bus from Rawai.'],
        links: [sources.headStart, map('HeadStart Chaofah City map', 'HeadStart International School Chaofah City Campus 39/99 Phuket')],
      },
      {
        heading: 'QSI International School of Phuket · Kathu',
        paragraphs: ['QSI accepts students aged 3–18 and teaches in English. Its mastery-learning approach lets students work towards a secure understanding of each topic before moving on; placement includes checks of English and mathematics.', 'The campus is on the bypass road in Kathu. Families moving between school systems can ask how placement works, what English support is available and how previous learning will transfer.'],
        links: [sources.qsi, sources.qsiAdmissions, map('QSI Phuket map', 'QSI International School Phuket 81/4 Kathu')],
      },
      {
        heading: 'Kajonkiet International School Phuket · Kathu',
        paragraphs: ['Kajonkiet International School Phuket, often shortened to KIS, is an English-medium day school for ages 2–18. It follows England’s national curriculum and has its international campus in Kathu.', 'Use the full school name when arranging a visit: the wider Kajonkiet group has several schools and nursery locations. Ask about year-group placement, English support and transport for the international campus.'],
        links: [sources.kajonkiet, map('Kajonkiet International School map', 'Kajonkiet International School Phuket Kathu')],
      },
      {
        heading: 'British International School, Phuket · Koh Kaew',
        paragraphs: ['British International School, Phuket, or BISP, offers early years, primary and secondary education, with IGCSE and IB Diploma pathways. Its day and boarding campus is in Koh Kaew, farther north than Wichit and Kathu.', 'Consider it if you’re exploring a longer school stay or an IB pathway. From Rawai, test the full journey at school-run times and ask about transport before choosing a daily commute.'],
        links: [sources.bisp, map('BISP campus map', 'British International School Phuket 59 Moo 2 Koh Kaew')],
      },
      {
        heading: 'Ask these questions first',
        paragraphs: ['Send each school your child’s age, home language, current year group and planned dates. Places, fees and short-stay arrangements need confirmation directly with admissions.'],
        bullets: ['Is there a place for the full stay, and what is the minimum enrolment period?', 'Which curriculum and teaching languages will my child follow, and what language support is available?', 'What are the school hours, holidays and settling-in arrangements?', 'What is the total, including registration, meals, uniform, aftercare and transport?', 'Is there a school-bus route serving our Rawai address, and how long is the actual journey?'],
      },
    ],
    sources: [],
    relatedGuides: ['long-stays-in-rawai', 'phuket-with-children', 'rawai-park-with-children'],
  },
  {
    slug: 'rawai-banks-and-atms', title: 'Banks, ATMs and cash in Rawai', eyebrow: 'Everyday essentials',
    summary: 'Named places for a cash withdrawal, bank visit or currency exchange, with map links to save.',
    hero: {
      src: '/images/guide-krungsri-rawai.webp', width: 1920, height: 1440,
      alt: 'Krungsri Bank’s Ban Sai Yuan branch in Rawai', caption: 'Krungsri’s Ban Sai Yuan branch in Rawai, photographed in 2010.',
    },
    heroCredit: { author: 'ADwarf', url: 'https://commons.wikimedia.org/wiki/File:Bank_of_Ayudhya_Phuket.jpg', license: 'Public domain', licenseUrl: 'https://commons.wikimedia.org/wiki/File:Bank_of_Ayudhya_Phuket.jpg#Licensing' },
    readTime: '2 min read',
    sections: [
      {
        heading: 'An ATM near Rawai Beach',
        paragraphs: ['SCB lists an ATM at Lotus’s Go Fresh, Rawai Beach, store 2038. It’s a specific place to look for cash while you’re near the waterfront.', 'Read the charge on the screen before confirming a withdrawal, and keep a little cash for markets, small shops and transport. Your own bank may charge separately.'],
        links: [map('SCB ATM · Lotus’s Go Fresh Rawai Beach', "SCB ATM Lotus's Go Fresh Rawai Beach 2038 Phuket")],
      },
      {
        heading: 'Bank branches in Rawai and Chalong',
        paragraphs: ['Krungsri has a Ban Sai Yuan (Rawai) branch and a Ha Yaek Chalong Phuket branch near Chalong Circle. Choose Rawai for a local errand, or combine Chalong with shopping farther north.', 'Check branch hours before leaving. If you need counter service, call ahead to ask which documents to bring.'],
        links: [map('Krungsri · Ban Sai Yuan, Rawai', 'Krungsri Bank Ban Sai Yuan Rawai Phuket'), map('Krungsri · Ha Yaek Chalong', 'Krungsri Bank Ha Yaek Chalong Phuket'), sources.krungsri],
      },
      {
        heading: 'Changing cash',
        paragraphs: ['Money Shop has a Rawai exchange office at 57/62 Rawai. Compare the final baht amount for the currency and notes you’re exchanging, and bring your passport.', 'Make cash errands part of a grocery or coffee stop so you don’t have to plan a separate trip. Keep your return pin for The Title V saved on your phone.'],
        links: [map('Money Shop Rawai', 'Money Shop 57/62 Rawai Phuket'), { title: 'Money Shop locations', url: localSources.money.url }],
      },
    ],
    sources: [sources.scbAtms],
    relatedGuides: ['rawai-food-and-markets', 'rawai-neighborhood-guide', 'getting-around-south-phuket'],
  },
  {
    slug: 'phuket-seasons', title: 'Phuket through the seasons', eyebrow: 'When to visit',
    summary: 'Drier months, tropical showers and changing seas. Choose the time of year that suits your kind of holiday.',
    hero: {
      src: '/images/guide-phuket-seasons.webp', width: 1440, height: 613,
      alt: 'Palm trees silhouetted against an orange sunset and clouds at Mai Khao, Phuket',
      caption: 'An April sunset at Mai Khao.',
    },
    heroCredit: { author: 'Dennis Wong', url: 'https://commons.wikimedia.org/wiki/File:Sunset_at_Mai_Khao_Beach.jpg', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' },
    readTime: '2 min read',
    sections: [
      {
        heading: 'Choose your month',
        paragraphs: ['Phuket stays warm all year. December to March usually makes beach and boat plans easier; May to October suits a more flexible holiday. November is a changeover month, so don’t count on settled weather just yet.'],
        table: {
          headings: ['Months', 'What to expect'],
          rows: [
            ['January–February', 'Usually the driest months. A popular time for beach holidays.'],
            ['March–April', 'Hotter days, with showers becoming more frequent.'],
            ['May–August', 'More rain, with showers and dry breaks.'],
            ['September–October', 'Typically the wettest stretch. Keep plans flexible.'],
            ['November', 'Rain generally eases, but the weather is still changeable.'],
            ['December', 'Drier weather becomes more established. Book holiday travel early.'],
          ],
        },
        links: [sources.weather, { title: 'Seasonal apartment prices', url: '/rates/' }],
      },
      {
        heading: 'Rain doesn’t always take the whole day',
        paragraphs: ['Some days bring a heavy shower followed by a dry stretch; others stay wet for longer. Keep a café, massage or museum visit in reserve, and use dry gaps for a walk.', 'The weeks around the start and end of the main season can be quieter. They work well if you’re happy to choose outings as the weather unfolds.'],
        links: [guideLink('Ideas for a rainy day', 'phuket-rainy-day-guide')],
      },
      {
        heading: 'Let the sea decide',
        paragraphs: ['West-coast beaches can have large waves and strong currents, especially from May to October. Check the flags even when the sun comes out. A red flag means stay out of the water; follow the lifeguards’ advice.', 'For a boat trip, ask the operator about conditions and leave a spare day in case the weather changes.'],
        links: [guideLink('Nai Harn & Ya Nui', 'nai-harn-and-ya-nui-beaches'), { title: 'Sea forecast', url: 'https://www.tmd.go.th/en/forecast/shipping' }],
      },
      {
        heading: 'Pack for sun and showers',
        paragraphs: ['Bring light clothes, a hat, sunscreen and shoes with grip. A small umbrella and a waterproof phone pouch are handy. Keep water with you, and save longer walks for the cooler part of the day.'],
      },
    ],
    sources: [{ title: 'Thailand tourism: planning an Andaman trip', url: 'https://www.tatnews.org/2026/10/the-andaman-opens-its-doors-again/' }],
    relatedGuides: ['nai-harn-and-ya-nui-beaches', 'phuket-rainy-day-guide', 'phuket-festivals-and-night-markets'],
  },
  {
    slug: 'phuket-festivals-and-night-markets', title: 'Phuket festivals & night markets', eyebrow: 'After the beach',
    summary: 'Sunday walks in Old Town, dinner among the stalls and festivals worth planning an evening around.',
    hero: {
      src: '/images/guide-phuket-walking-street.webp', width: 1440, height: 1080,
      alt: 'Food stalls and visitors between colorful shophouses on Thalang Road in Phuket Old Town',
      caption: 'Sunday market stalls on Thalang Road, Phuket Old Town.',
    },
    heroCredit: { author: 'Christophe95', url: 'https://commons.wikimedia.org/wiki/File:Phuket_Weekend_Market.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
    readTime: '2 min read',
    sections: [
      {
        heading: 'Choose your market',
        paragraphs: ['Pick one market for dinner, then leave time to wander. For a first visit, choose Lard Yai if you’re here on a Sunday. Bring small baht notes and share a few dishes so there’s room to try more.'],
        table: {
          headings: ['Market', 'When & what to go for'],
          rows: [
            ['Lard Yai · Sunday Walking Street', 'Sunday, 16:00–22:00. Street food and small gifts along colorful Thalang Road. Pair it with an afternoon in Old Town.'],
            ['Naka Weekend Market', 'Saturday–Sunday, from 16:00. Dinner plus a longer browse for clothes, souvenirs and accessories.'],
            ['Chillva Market', 'Monday–Saturday, 17:00–23:00. Food stalls, fashion and live music in Samkong, north of Old Town. Closed Sunday.'],
          ],
        },
        links: [map('Lard Yai map', 'Phuket Sunday Walking Street Lard Yai Thalang Road'), map('Naka map', 'Naka Weekend Market Wirat Hong Yok Road Phuket'), map('Chillva map', 'Chillva Market 141/2 Yaowarat Road Phuket')],
      },
      {
        heading: 'Festivals through the year',
        paragraphs: ['These are the usual times of year. Open the latest event listings for this year’s dates and venues.'],
        table: {
          headings: ['Festival', 'When & what to expect'],
          rows: [
            ['Chinese New Year & Old Town Festival', 'Usually January–February. Food fairs and cultural performances in Old Town. The local festival has its own announced dates.'],
            ['Songkran', '13–15 April. Thai New Year brings water celebrations and temple traditions. Patong and Phuket Town hold local events; keep your phone in a waterproof pouch.'],
            ['Vegetarian Festival', 'Nine days in September or October. Vegetarian food, shrine ceremonies and street processions. Some rituals are intense; the food stalls offer a gentler introduction.'],
            ['Loy Krathong', 'Full moon, usually November. Candlelit floats and waterside celebrations. Choose an announced local event for the evening.'],
          ],
        },
        links: [{ title: 'Latest festival dates & venues', url: 'https://www.tatnews.org/category/thailand-events-festivals/' }],
      },
      {
        heading: 'An easy evening from Rawai',
        paragraphs: ['Take a taxi or app car, save the market pin and arrange your return pickup away from the busiest entrance. With children, arrive near opening time and keep the plan to one market.', 'For a bus outing, check the route and last departure first. Prefer to stay close? Have dinner at Rawai Seafood Market and take a walk by the waterfront.'],
        links: [{ title: 'Phuket bus routes', url: 'https://onemap.phuket.cloud' }, guideLink('Dinner at Rawai Seafood Market', 'rawai-seafood-market')],
      },
    ],
    sources: [
      { title: 'Lard Yai updates', url: 'https://www.facebook.com/phuketwalkingstreet' },
      { title: 'Naka Market hours & events', url: 'https://www.phuketnakamarket.com/naka-weekend-market/' },
      { title: 'Chillva updates', url: 'https://www.facebook.com/Chillvamarket/' },
      { title: 'Chillva visitor information · Phuket Smart Bus', url: 'https://www.phuketsmartbus.com/blog/chillva-market-phuket' },
    ],
    relatedGuides: ['rawai-food-and-markets', 'a-slow-week-in-rawai', 'phuket-seasons'],
  },
  ...comparisonGuides,
  ...decisionGuides,
  ...listicleGuides,
];

export const guideBySlug = (slug: string) => guides.find((guide) => guide.slug === slug);
