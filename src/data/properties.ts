export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Property {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string[];
  airbnbUrl: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  beds: string[];
  floor: string;
  hero: GalleryImage;
  gallery: GalleryImage[];
  amenities: string[];
  highlights: { title: string; description: string }[];
  practical: { title: string; description: string }[];
  relatedGuides: string[];
}

export const images: Record<string, GalleryImage> = {
  brightLiving: {
    src: '/images/bright-living-room.webp', width: 1920, height: 1440,
    alt: 'Bright apartment living room with a cream sofa, balcony doors, and a separate bedroom',
    caption: 'The living room in Title V New & Bright 1BR at Rawai Beach.',
  },
  brightBedroom: {
    src: '/images/bright-bedroom.webp', width: 1200, height: 900,
    alt: 'Queen bed with striped cushions and storage in the Bright apartment',
    caption: 'A separate queen bedroom in the Bright apartment.',
  },
  brightKitchen: {
    src: '/images/bright-kitchen.webp', width: 1200, height: 830,
    alt: 'Bright apartment kitchen with a refrigerator, hob, microwave, and wood cabinets',
  },
  brightWide: {
    src: '/images/bright-interior-wide.webp', width: 1200, height: 900,
    alt: 'Wide view of the Bright apartment kitchen, sofa, bedroom, and balcony',
  },
  brightBathroom: {
    src: '/images/bright-bathroom.webp', width: 1200, height: 900,
    alt: 'Bright apartment bathroom with a round basin and glass-enclosed shower',
  },
  brightBalcony: {
    src: '/images/bright-balcony.webp', width: 1200, height: 900,
    alt: 'Bright apartment balcony with two wooden chairs, a small table, and garden views',
  },
  brightWorkspace: {
    src: '/images/bright-workspace.webp', width: 1200, height: 969,
    alt: 'Desk and white chair beside the television in the Bright apartment',
    caption: 'A dedicated place to open your laptop in the Bright apartment.',
  },
  cozyLiving: {
    src: '/images/cozy-living-room.webp', width: 1920, height: 1440,
    alt: 'Cozy apartment living room with a gray sofa, balcony doors, and sliding bedroom partition',
    caption: 'The living room in Title V New & Cozy 1BR at Rawai Beach.',
  },
  cozyBedroom: {
    src: '/images/cozy-bedroom.webp', width: 1200, height: 900,
    alt: 'Queen bed with checkered cushions and a wardrobe in the Cozy apartment',
    caption: 'A separate queen bedroom in the Cozy apartment.',
  },
  cozyKitchen: {
    src: '/images/cozy-kitchen.webp', width: 1200, height: 1014,
    alt: 'Cozy apartment kitchen with an electric hob, microwave, refrigerator, and utensils',
  },
  cozyWorkspace: {
    src: '/images/cozy-workspace.webp', width: 1200, height: 884,
    alt: 'White desk and chair with a mirror in the Cozy apartment',
    caption: 'The dedicated desk in the Cozy apartment.',
  },
  cozyDining: {
    src: '/images/cozy-dining.webp', width: 1200, height: 900,
    alt: 'Small dining table for two beside the sofa in the Cozy apartment',
  },
  cozyBathroom: {
    src: '/images/cozy-bathroom.webp', width: 1200, height: 900,
    alt: 'Cozy apartment bathroom with basin, toilet, and glass-enclosed shower',
  },
  cozyBalcony: {
    src: '/images/cozy-balcony.webp', width: 1200, height: 900,
    alt: 'Cozy apartment balcony with a round table, two chairs, and greenery outside',
  },
  cozyLaundry: {
    src: '/images/cozy-laundry.webp', width: 1200, height: 1067,
    alt: 'Front-loading washing machine in the Cozy apartment',
  },
  poolSide: {
    src: '/images/pool-side.webp', width: 1920, height: 1440,
    alt: 'Curving shared pool surrounded by trees and The Title V apartment buildings',
    caption: 'One of the shared pools at The Title V.',
  },
  centralPool: {
    src: '/images/central-pool.webp', width: 1920, height: 1393,
    alt: 'The Title V central pool with sun loungers, trees, and apartment buildings',
    caption: 'The shared central pool at The Title V.',
  },
  poolCourtyard: {
    src: '/images/pool-courtyard.webp', width: 1920, height: 1440,
    alt: 'Turquoise shared pool between landscaped courtyards and The Title V buildings',
    caption: 'Pool time, close to home.',
  },
  gardenWalkway: {
    src: '/images/garden-walkway.webp', width: 1200, height: 900,
    alt: 'Covered walkway beside a shared pool and landscaped gardens at The Title V',
  },
  gardenPools: {
    src: '/images/garden-pools.webp', width: 900, height: 1200,
    alt: 'A long shared swimming pool beside The Title V apartment buildings',
  },
  entrance: {
    src: '/images/residence-entrance.webp', width: 1200, height: 900,
    alt: 'Covered building entrance and tropical planting at The Title V',
  },
  coworking: {
    src: '/images/coworking-area.webp', width: 1200, height: 900,
    alt: 'Shared coworking room with tables, chairs, and garden-facing windows',
    caption: 'The residence also has a shared coworking area.',
  },
  gym: {
    src: '/images/fitness-room.webp', width: 1200, height: 900,
    alt: 'Windows of The Title V shared fitness room facing the pool courtyard',
  },
  sauna: {
    src: '/images/sauna-area.webp', width: 1200, height: 900,
    alt: 'Entrance to the sauna and steam-room area at The Title V',
  },
  childrensPool: {
    src: '/images/childrens-pool.webp', width: 1200, height: 900,
    alt: 'Small round shared children’s pool in a landscaped courtyard at The Title V',
    caption: 'A separate children’s pool in the shared grounds.',
  },
  playground: {
    src: '/images/playground.webp', width: 900, height: 1200,
    alt: 'Small outdoor playground with colorful slides beneath trees at The Title V',
  },
  beachRoadEntrance: {
    src: '/images/beach-road-entrance.webp', width: 1200, height: 879,
    alt: 'The Title entrance signs beside the road and tropical trees',
  },
  rawai: {
    src: '/images/rawai-waterfront.webp', width: 1920, height: 1440,
    alt: 'Longtail boats offshore at the Rawai waterfront, viewed from the sand',
    caption: 'The Rawai waterfront. This is a neighborhood view, not a view from the apartments.',
  },
  seafoodMarket: {
    src: '/images/rawai-seafood-market.webp', width: 1200, height: 1200,
    alt: 'Seafood stalls with fish and shellfish at a local Rawai market',
    caption: 'A market photo from your host’s Airbnb gallery.',
  },
  groceries: {
    src: '/images/grocery-produce.webp', width: 1200, height: 800,
    alt: 'Fresh fruit and produce in a supermarket featured in the listing gallery',
    caption: 'Everyday shopping, pictured in the listing’s neighborhood gallery.',
  },
  cafe: {
    src: '/images/rawai-cafe.webp', width: 1200, height: 1200,
    alt: 'A café exterior with windows facing the Rawai waterfront',
    caption: 'A neighborhood café pictured in the listing gallery.',
  },
  bus: {
    src: '/images/rawai-bus-stop.webp', width: 1200, height: 900,
    alt: 'A Phuket Smart Bus stopped beside a bus-stop sign in Rawai',
    caption: 'Check the operator’s current route and timetable before travel.',
  },
};

const sharedAmenities = [
  'Kitchen with electric hob', 'Refrigerator and microwave', 'Kettle and toaster',
  'Dedicated workspace', 'Wi-Fi and Ethernet', 'Air conditioning in both rooms',
  'Smart TV', 'Washing machine', 'Private balcony', 'Shared swimming pools',
  'Shared gym', 'Sauna and steam room', 'Shared coworking area',
  'Free on-site parking', 'Elevator', 'Self check-in',
];

const singlePractical = [
  { title: 'Sleeping arrangements', description: 'A queen bed in the bedroom and a convertible sofa in the living room. Share your guest count and children’s ages so we can confirm the setup.' },
  { title: 'Your arrival', description: 'The apartment is on the second floor, with elevator access. Check-in instructions and the arrival contact are shared with your confirmed booking.' },
  { title: 'Your full quote', description: 'Ask for your dates and length of stay. We will confirm the total, utility allowance, cleaning, deposit, and cancellation terms before you book.' },
  { title: 'Around the residence', description: 'Pools, gym, sauna, and coworking are shared facilities. Opening hours and access follow the residence’s rules.' },
];

export const properties: Property[] = [
  {
    slug: 'bright-1br-rawai-beach',
    name: 'Title V New & Bright 1BR at Rawai Beach',
    eyebrow: 'A light-filled island home',
    summary: 'A separate bedroom, a sunlit living room, and your own balcony. Settle into an easy Rawai routine, with the pools just downstairs.',
    description: [
      'Large windows, warm wood, and a pale sofa give this one-bedroom apartment its easy, airy feel. Sliding doors separate the queen bedroom from the living area, with space to unpack and stay a while.',
      'Make breakfast in the kitchen, open your laptop at the desk, or take your coffee outside. A washing machine and air conditioning in both rooms make everyday life simple.',
    ],
    airbnbUrl: 'https://www.airbnb.com/rooms/622135535519576635',
    guests: 4, bedrooms: 1, bathrooms: 1, areaSqm: 37,
    beds: ['1 queen bed', '1 sofa bed'], floor: 'Second floor · elevator access',
    hero: images.brightLiving,
    gallery: [images.brightLiving, images.brightBedroom, images.brightKitchen, images.brightBathroom, images.brightBalcony, images.brightWorkspace, images.centralPool, images.coworking, images.gym],
    amenities: sharedAmenities,
    highlights: [
      { title: 'Room to unwind', description: 'A separate bedroom, living area, and furnished balcony.' },
      { title: 'A practical place to stay', description: 'A kitchen, washer, desk, and room to unpack.' },
      { title: 'The residence is part of the stay', description: 'Shared pools, gardens, a gym, and a sauna.' },
    ],
    practical: singlePractical,
    relatedGuides: ['long-stays-in-rawai', 'work-from-phuket', 'rawai-neighborhood-guide'],
  },
  {
    slug: 'cozy-1br-rawai-beach',
    name: 'Title V New & Cozy 1BR at Rawai Beach',
    eyebrow: 'Your comfortable Rawai retreat',
    summary: 'Warm interiors, a garden-facing balcony, and a separate queen bedroom. A comfortable base for beach days, quiet evenings, and longer stays.',
    description: [
      'A gray sofa, warm wood floors, and generous windows make an inviting place to come home to. The queen bedroom is separated from the living room by sliding doors and curtains.',
      'There is a kitchen for breakfast at home, a dedicated desk, and a balcony table for a slower start to the day. Keep the evening simple with a meal in, or head out to discover Rawai.',
    ],
    airbnbUrl: 'https://www.airbnb.com/rooms/922904332708842126',
    guests: 4, bedrooms: 1, bathrooms: 1, areaSqm: 37,
    beds: ['1 queen bed', '1 sofa bed'], floor: 'Second floor · elevator access',
    hero: images.cozyLiving,
    gallery: [images.cozyLiving, images.cozyBedroom, images.cozyKitchen, images.cozyBathroom, images.cozyBalcony, images.cozyWorkspace, images.cozyDining, images.cozyLaundry, images.poolSide],
    amenities: [...sharedAmenities, 'Espresso machine'],
    highlights: [
      { title: 'A home for slow mornings', description: 'A balcony table, a kitchen, and a separate bedroom.' },
      { title: 'Space for your everyday rhythm', description: 'A desk, Wi-Fi, a washing machine, and a sofa bed.' },
      { title: 'More beyond the apartment', description: 'Share the residence’s pools, gardens, gym, and coworking area.' },
    ],
    practical: singlePractical,
    relatedGuides: ['phuket-with-children', 'rawai-food-and-markets', 'nai-harn-and-ya-nui-beaches'],
  },
  {
    slug: 'two-adjacent-apartments-title-v-rawai',
    name: 'Two Adjacent 1BR Apartments in Title V Rawai',
    eyebrow: 'Stay together. Keep your own space.',
    summary: 'Book Bright and Cozy together: two adjacent apartments, two kitchens, two bathrooms, and the freedom to keep your own rhythm.',
    description: [
      'Travel with family or friends and stay close, with a complete apartment for each household. These two adjacent homes are each 37 m², with their own bedroom, living room, kitchen, bathroom, and balcony.',
      'Meet for a pool morning or dinner out, then return to your own space. Each apartment has a queen bed and sofa bed, so tell us who is coming and we will help confirm a comfortable arrangement.',
    ],
    airbnbUrl: 'https://www.airbnb.com/rooms/926800271304117606',
    guests: 8, bedrooms: 2, bathrooms: 2, areaSqm: 74,
    beds: ['2 queen beds', '2 sofa beds'], floor: 'Two adjacent apartments · second floor',
    hero: images.brightWide,
    gallery: [images.brightLiving, images.cozyLiving, images.brightBedroom, images.cozyBedroom, images.brightKitchen, images.cozyKitchen, images.brightBalcony, images.cozyBalcony, images.centralPool],
    amenities: ['Two separate apartments', 'Two kitchens', 'Two bathrooms', 'Two balconies', ...sharedAmenities],
    highlights: [
      { title: 'A home for each household', description: 'Two complete apartments, each with a separate queen bedroom.' },
      { title: 'Easy time together', description: 'Stay next door and share the same residence facilities.' },
      { title: 'Book both for the same dates', description: 'We confirm availability for the pair before you make plans.' },
    ],
    practical: [
      { title: 'Two independent homes', description: 'These are adjacent apartments with separate entrances. There is no advertised internal connecting door.' },
      { title: 'Plan the sleeping arrangement', description: 'The combined listing accommodates up to eight guests across two queen beds and two sofa beds. Please include children’s ages in your inquiry.' },
      { title: 'Both calendars matter', description: 'The pair can only be reserved when both apartments are available for your full stay. Send one inquiry for the entire group.' },
      { title: 'One clear booking conversation', description: 'Ask for a written quote for both homes, including the utility allowance per apartment, cleaning, deposit, and cancellation terms.' },
    ],
    relatedGuides: ['two-apartments-for-family-and-friends', 'phuket-with-children', 'a-slow-week-in-rawai'],
  },
];

export const propertyBySlug = (slug: string) => properties.find((property) => property.slug === slug);
