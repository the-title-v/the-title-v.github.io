import { images, type GalleryImage } from './properties';
import { localSources } from './location';

export interface GuideSource {
  title: string;
  url: string;
}

export interface Guide {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  hero: GalleryImage;
  readTime: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  sources: GuideSource[];
  relatedGuides: string[];
}

const sources = {
  bright: { title: 'Bright apartment · public Airbnb listing', url: 'https://www.airbnb.com/rooms/622135535519576635' },
  cozy: { title: 'Cozy apartment · public Airbnb listing', url: 'https://www.airbnb.com/rooms/922904332708842126' },
  pair: { title: 'Two adjacent apartments · public Airbnb listing', url: 'https://www.airbnb.com/rooms/926800271304117606' },
  rawai: { title: 'Phuket Provincial Government · Rawai Beach', url: 'https://www.phuket.go.th/eng/Beaches-Rawai%20Beach.php' },
  naiHarn: { title: 'Phuket Provincial Government · Nai Harn Beach', url: 'https://www.phuket.go.th/eng/Beaches-Nai%20Harn%20Beach.php' },
  yaNui: { title: 'Phuket Provincial Government · Ya Nui Beach', url: 'https://www.phuket.go.th/eng/Beaches-Ya%20Nui%20Beach.php' },
  cape: { title: 'Phuket Provincial Government · Promthep Cape', url: 'https://www.phuket.go.th/eng/Attractions-Capes.php' },
  airport: { title: 'Airports of Thailand · Phuket airport transport', url: 'https://phuket.airportthai.co.th/service/way-to-airport/detail/97' },
  bus: { title: 'Phuket Smart Bus · current timetable', url: 'https://phuketsmartbus.com/timetable' },
  busHome: { title: 'Phuket Smart Bus · routes and live tracking', url: 'https://phuketsmartbus.com/' },
  weather: { title: 'Thai Meteorological Department · Phuket forecast', url: 'https://www.tmd.go.th/en/weather/province/phuket' },
  thaiHua: { title: 'Phuket Provincial Government · Thai Hua Museum', url: 'https://www.phuket.go.th/eng/Museums-Phuket%20Thai%20Hua%20Museum.php' },
  oldTown: { title: 'Tourism Authority of Thailand · Phuket Old Town', url: 'https://www.tourismthailand.org/Articles/stroll-the-historic-roads-in-phuket-old-town' },
  phuket: { title: 'Tourism Authority of Thailand · Phuket', url: 'https://www.tourismthailand.org/Destinations/Provinces/phuket/350' },
};

export const guides: Guide[] = [
  {
    slug: 'rawai-neighborhood-guide',
    title: 'Find your rhythm in Rawai',
    eyebrow: 'The neighborhood',
    summary: 'A waterfront of longtail boats, everyday cafés, and an easy base for exploring Phuket’s south. Here is how to make Rawai feel familiar.',
    hero: images.rawai,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Start at the waterfront',
        paragraphs: [
          'Rawai is a working waterfront as well as a place to stay. Boats line the shore, restaurants face the sea, and the horizon is dotted with nearby islands. It rewards a slow first walk: notice the entrance you came from, find somewhere for breakfast, and save the location of a useful shop.',
          'Think of the waterfront as somewhere to wander and eat. For a dedicated beach day, plan a separate outing to Nai Harn or Ya Nui and choose your activities around the conditions that day.',
        ],
      },
      {
        heading: 'A base for the southern part of the island',
        paragraphs: [
          'Rawai, Nai Harn, Ya Nui, and Promthep Cape give you several different ways to spend an afternoon without building your holiday around long excursions. They are distinct places, so use a current map for the route you actually intend to take. A short line on a map does not tell you about hills, traffic, or walking conditions.',
          'The Title V apartments sit within a residence near Rawai’s waterfront. The photos of boats and the shoreline show the neighborhood; the apartment balconies look toward the residence and its greenery.',
        ],
      },
      {
        heading: 'Make the first day deliberately small',
        paragraphs: [
          'A grocery stop, a meal nearby, and a little time around the residence are enough after a travel day. Unpack properly if you are staying longer. Learning your immediate surroundings before planning island-wide days makes the rest of the week easier.',
        ],
        bullets: [
          'Save the residence entrance and your check-in instructions on your phone.',
          'Buy a modest first supply of breakfast items and drinking water.',
          'Pick one outing for tomorrow, with a return journey in mind.',
          'Leave time to explore the pools and shared spaces when they are open.',
        ],
      },
      {
        heading: 'Save the practical stops as well',
        paragraphs: [
          'Tops and Starbucks at Mixxmall Rawayana make a useful first grocery-and-coffee stop. Money Shop lists a Rawai currency-exchange office at 57/62 Rawai; compare the final amount for the cash you want to exchange and check its current opening hours.',
          'For cash withdrawals, open a current bank ATM locator or search around Rawai Beach Road, then check the machine’s displayed charge and your own bank’s fees. Save your chosen machine, the residence entrance and the Rawai Smart Bus stop before you need them.',
        ],
      },
    ],
    sources: [sources.rawai, sources.naiHarn, sources.yaNui, sources.bright, localSources.mixxmall, localSources.tops, localSources.money, localSources.atm],
    relatedGuides: ['rawai-food-and-markets', 'nai-harn-and-ya-nui-beaches', 'getting-around-south-phuket'],
  },
  {
    slug: 'nai-harn-and-ya-nui-beaches',
    title: 'Nai Harn, Ya Nui, and the Rawai waterfront',
    eyebrow: 'Beach days',
    summary: 'Three nearby coastal settings with different personalities. Choose a full beach day, a smaller cove, or a walk beside the boats.',
    hero: images.rawai,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Nai Harn for an unhurried beach outing',
        paragraphs: [
          'Nai Harn is a sandy bay north of Promthep Cape, with a freshwater lagoon inland. It is a familiar choice for visitors planning time on the sand. Give it its own part of the day instead of rushing between several beaches: arrive, see the conditions, and decide whether the day calls for swimming, sitting in the shade, or simply walking.',
          'Arrange transport with the return in mind. Bring what you need for several hours, but keep the plan easy to change if the weather or sea does not suit you.',
        ],
      },
      {
        heading: 'Ya Nui for a different scale',
        paragraphs: [
          'Ya Nui is a small cove between the Windmill viewpoint and Promthep Cape. Its smaller scale gives it a different feel from Nai Harn. It is a good place to consider when you want a shorter stop as part of exploring the southern coast.',
          'A small bay can still have changing conditions. Check the signs and advice on arrival, and let what you see determine the activity. Equipment rentals and other services should be confirmed locally rather than assumed from an older recommendation.',
        ],
      },
      {
        heading: 'Rawai for the waterfront atmosphere',
        paragraphs: [
          'Rawai’s shore is associated with longtail boats, island departures, and seafood. Use it as a place to enjoy the view and the neighborhood. It is a different setting from a beach day at Nai Harn, even though all three places are part of the same southern Phuket stay.',
          'An early waterfront walk can fit around breakfast or the beginning of a day out. Keep an eye on the boats and the changing shoreline, then head to the beach you have chosen for a longer stay on the sand.',
        ],
      },
      {
        heading: 'Make the conditions part of the plan',
        paragraphs: [
          'Phuket’s official visitor guidance calls attention to beach warning flags, and the provincial Nai Harn guide warns of strong seasonal currents. Follow flags and local instructions, including a red flag that means you should stay out of the water. A pool afternoon or a shore walk can be a better choice on a rough day.',
        ],
        bullets: ['Check the current Phuket forecast before setting out.', 'Pack water, sun protection, and a change of clothes.', 'Keep a dry place for your phone and return-journey details.', 'Choose one main beach and leave room to linger.'],
      },
    ],
    sources: [sources.naiHarn, sources.yaNui, sources.rawai, sources.phuket, sources.weather],
    relatedGuides: ['promthep-cape-sunset', 'phuket-with-children', 'a-slow-week-in-rawai'],
  },
  {
    slug: 'long-stays-in-rawai',
    title: 'Make a longer stay feel like home',
    eyebrow: 'A week, a month, a little longer',
    summary: 'The practical details that matter once you stop living out of a suitcase: a real routine, a clear quote, and space for everyday life.',
    hero: images.brightBalcony,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Choose for an ordinary Tuesday',
        paragraphs: [
          'For a longer visit, picture a normal day as well as a holiday highlight. Where will you make breakfast, take a call, dry clothes, and put your suitcase? A separate bedroom and living room give the day more shape, while a kitchen and washing machine reduce the small errands that otherwise fill a stay.',
          'Both apartments have a queen bedroom, sofa bed, kitchen, washer, balcony, and dedicated workspace. Their layouts are similar, so compare the individual photos to choose the interior you prefer.',
        ],
      },
      {
        heading: 'Compare the full cost for your dates',
        paragraphs: [
          'Send your complete date range, including any flexibility, and ask for one written total. A monthly stay may cross more than one pricing period, so multiplying a nightly starting price is not a reliable quote. Confirm whether extending the stay would depend on another booking.',
          'Review the electricity and water meter-reading arrangements, cleaning charge, deposit, payment schedule, and cancellation terms in the written quote before making plans around the reservation.',
        ],
      },
      {
        heading: 'Build a simple weekly rhythm',
        paragraphs: [
          'Start with a few repeatable habits: a grocery day, a preferred breakfast spot, and a beach outing that fits around work or family time. Buy supplies gradually rather than filling every cupboard on the first day. You will quickly learn what you actually enjoy preparing at home.',
          'The shared gym, pools, and coworking area give you more options within the residence. Check the operating hours when you arrive and plan around the fact that these are shared spaces.',
        ],
      },
      {
        heading: 'Mention the details that change the fit',
        paragraphs: [
          'If your stay involves frequent video calls, a child’s naps, lots of luggage, or two people working at once, tell us before you choose. A longer visit deserves a more specific conversation than a simple guest count.',
        ],
        bullets: ['Your preferred arrival and departure dates, plus any flexibility.', 'Who is staying, including the ages of children.', 'Work requirements and the need for a recent connection test.', 'Any equipment, access, or cleaning requirements to confirm in advance.'],
      },
    ],
    sources: [sources.bright, sources.cozy],
    relatedGuides: ['work-from-phuket', 'rawai-food-and-markets', 'getting-around-south-phuket'],
  },
  {
    slug: 'work-from-phuket',
    title: 'Work days, with room for island life',
    eyebrow: 'Working from Rawai',
    summary: 'Plan a comfortable place to work, check the connection you need, and give your day a beginning and an end.',
    hero: images.brightWorkspace,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Look at the actual workspace',
        paragraphs: [
          'A work-friendly stay begins with the place where you will sit each day. Both apartments have a dedicated desk, a chair, Wi-Fi, and an Ethernet connection listed. The individual galleries show the actual desks, so you can assess the surface, chair, and surrounding space before booking.',
          'If you travel with a monitor, need a particular cable, or plan to work with a second person, mention it in your inquiry. The photographs do not promise office equipment beyond what is visible and confirmed.',
        ],
      },
      {
        heading: 'Match the connection to your work',
        paragraphs: [
          'The Airbnb descriptions advertise a 100 Mbit/s connection, and the Cozy amenities display a measured speed of 93 Mbps. These are listing details rather than a guarantee for every device or hour. For important calls or large transfers, ask for a recent test from the apartment you intend to reserve.',
          'Download essential files before a deadline and consider what backup access you would use if your work cannot tolerate an interruption. Your employer’s requirements may also determine whether a shared network or remote location suits the work you do.',
        ],
      },
      {
        heading: 'Give different tasks different spaces',
        paragraphs: [
          'The residence has a shared coworking area as another place to sit. It can be useful for a change of scene, but it is not a reserved private office. Check its hours and atmosphere before relying on it for a confidential or time-sensitive call.',
          'If two people have overlapping meetings, discuss the layout carefully. Sliding doors separate the bedroom and living room, but that is not the same as two soundproof offices. For two households or independent work schedules, the adjacent-apartment option gives you a full home each.',
        ],
      },
      {
        heading: 'Leave a little space around the working day',
        paragraphs: [
          'Pick a dependable breakfast, a realistic lunch break, and a stopping time. Save longer outings for days when your calendar permits them. A pool break or a waterfront walk can fit a quieter day without turning every afternoon into a race across the island.',
        ],
        bullets: ['Share your working hours and any essential connection needs.', 'Ask about the specific apartment rather than a general building connection.', 'Bring the adapters and cables your own equipment needs.', 'Plan transport before making a café or beach part of a tight schedule.'],
      },
    ],
    sources: [sources.bright, sources.cozy, sources.pair],
    relatedGuides: ['long-stays-in-rawai', 'two-apartments-for-family-and-friends', 'rawai-neighborhood-guide'],
  },
  {
    slug: 'phuket-with-children',
    title: 'An easier Rawai stay with children',
    eyebrow: 'Family time',
    summary: 'Start with the sleeping arrangement, keep beach days flexible, and make room for the routines that help everyone enjoy the trip.',
    hero: images.childrensPool,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Plan the sleeping arrangement first',
        paragraphs: [
          'Each apartment accommodates up to two adults and two children aged 14 or younger, with one queen bed and a convertible sofa in the living room. Share the children’s ages and your preferred sleeping arrangement when booking.',
          'The bedroom is separated from the living area by sliding doors. This gives you two zones for the evening, though it is worth considering how much quiet you need around naps or an early bedtime. Ask about any baby equipment before booking; do not assume it is already in the apartment.',
        ],
      },
      {
        heading: 'Keep the useful routines',
        paragraphs: [
          'A kitchen helps when breakfast needs to happen early or someone wants a familiar meal. The washing machine and drying rack make it easier to pack for beach clothes without bringing a suitcase for every eventuality. Set aside time on arrival to work out the appliances and where everything belongs.',
          'Both apartments are on the second floor with elevator access listed. If you are bringing a stroller or need a particular access arrangement, check the route and dimensions that matter to you in advance.',
        ],
      },
      {
        heading: 'Pools are part of the day, not the whole plan',
        paragraphs: [
          'The residence has shared pools, including a children’s pool, and a small outdoor playground pictured in the listing gallery. Follow the posted rules and supervise children around the water. A children’s pool should not be taken to mean there is a lifeguard or that children can use it alone.',
          'Alternate active time with shade, a meal, and a break in the apartment. On beach days, check flags and local instructions before anyone enters the sea.',
        ],
      },
      {
        heading: 'Make outings easy to shorten',
        paragraphs: [
          'One beach or one main outing is often enough for a day with younger children. Arrange the return journey before everyone is tired, and keep an easy dinner option in reserve. The best plan is one you can bring forward, slow down, or finish early.',
          'Rawai Park is a separate nearby family attraction with play areas and water play. Check its current opening days, admission and age guidance before going. For a relaxed afternoon, combine one outing with a meal and a break at the apartment.',
        ],
      },
    ],
    sources: [sources.bright, sources.cozy, sources.pair, sources.phuket, localSources.park],
    relatedGuides: ['two-apartments-for-family-and-friends', 'nai-harn-and-ya-nui-beaches', 'phuket-airport-to-rawai'],
  },
  {
    slug: 'phuket-airport-to-rawai',
    title: 'Arriving in Rawai, without the rush',
    eyebrow: 'Getting here',
    summary: 'Plan the transfer around your arrival time, luggage, and group. Then make the final part of the journey simple.',
    hero: images.entrance,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Use your flight details to choose the transfer',
        paragraphs: [
          'Before choosing transport, consider when you land, how many people are traveling, and how much luggage you have. Add time for immigration where relevant, baggage collection, and finding the meeting point. Avoid promising yourself a fixed arrival time at the apartment before those details are known.',
          'For a late arrival, a family group, or bulky bags, a prearranged car or van can make the last part of the trip simpler. Confirm the full price, luggage capacity, meeting instructions, and what happens if the flight is delayed directly with the provider.',
        ],
      },
      {
        heading: 'Consider the coastal bus route',
        paragraphs: [
          'Airports of Thailand lists Phuket Smart Bus as an airport transport option serving the west-coast beach route through to Rawai. The operator publishes a current timetable and live tracking. Check those directly before deciding whether the departure time and journey suit your arrival.',
          'A route to Rawai does not automatically mean a door-to-door ride to the apartment. Identify the stop you plan to use and the final leg to the residence, especially if you are arriving after dark or carrying several bags. Use the current fare and payment information from the operator.',
        ],
      },
      {
        heading: 'Keep the arrival information together',
        paragraphs: [
          'Save The Title V (Rawai–Phuket), 555 Wiset Road, Rawai, Phuket 83130, together with the entrance pin and check-in contact sent by the booking team. A local agent meets and greets guests; share flight changes so the meeting can be coordinated. Several residences nearby use The Title name, so keep the V in your destination.',
        ],
        bullets: ['Flight number and scheduled arrival date and time.', 'Number of travelers, luggage, and any child-seat requirements.', 'Transfer provider’s meeting instructions and contact.', 'Your confirmed apartment and check-in instructions.'],
      },
      {
        heading: 'Make departure day just as clear',
        paragraphs: [
          'Plan the return transfer before your final evening. Check the airline’s recommended airport arrival time and allow for the journey and traffic. If you are using a bus, choose a departure with a comfortable margin and have another option in mind if the service no longer fits your flight.',
          'Early check-in, late checkout, and luggage arrangements depend on the booking schedule and must be confirmed separately. Let us know what you need before you set the day’s plans.',
        ],
      },
    ],
    sources: [sources.airport, sources.bus, sources.busHome, localSources.titleV],
    relatedGuides: ['getting-around-south-phuket', 'rawai-neighborhood-guide', 'phuket-with-children'],
  },
  {
    slug: 'getting-around-south-phuket',
    title: 'Getting around southern Phuket',
    eyebrow: 'Local journeys',
    summary: 'Choose transport for the day you have planned: a waterfront stroll, a coastal bus ride, or a car for a few places together.',
    hero: images.bus,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Walk locally, ride to the beach',
        paragraphs: [
          'The Rawai waterfront, Tops and Starbucks at Mixxmall, and local meals can fit into a walk from The Title V. Nai Harn, Ya Nui and Promthep Cape are separate outings: a car or arranged ride is usually the more practical plan for those coastal roads.',
          'Open directions from the residence entrance before leaving. A short distance on a map does not show pavement quality, crossings, heat or hills. In rain, after dark, or with a tired child, a ride may suit even a local errand.',
        ],
      },
      {
        heading: 'Use the bus when its route fits',
        paragraphs: [
          'Phuket Smart Bus runs the coastal route from Rawai through Kata, Karon and Patong toward the airport. It is useful when the destination lies on that route and your day has room for stops. It does not serve every southern beach or take you to the apartment door.',
          'Check both directions before leaving. Save the location of the return stop, the last suitable service, and a backup way home. The bus photograph in the listing is a helpful orientation image, not a current timetable.',
        ],
      },
      {
        heading: 'Compare a driver, a car and a scooter',
        paragraphs: [
          'A booked driver is useful for an airport transfer, several stops or a family outing. Agree the total, waiting time, return pickup and child-seat needs. A rental car can make groceries and beach equipment easier during a longer stay; ask the booking team about residence parking.',
          'Enigma publishes both car and scooter options in Rawai; Anda Rawai is another local motorbike provider to compare. Confirm the vehicle, pickup or delivery, deposit, insurance, licence requirements and damage record directly. For a scooter, bring the appropriate riding experience and check helmet fit; it is not a necessary part of staying in Rawai.',
        ],
      },
      {
        heading: 'Leave some space in the day',
        paragraphs: [
          'Traffic, rain, and the time it takes to gather a group can change a journey. Use live mapping on the day and give a sunset outing or restaurant reservation a little breathing room. Planning one main destination often makes a better afternoon than fitting in every viewpoint.',
        ],
        bullets: ['Save the residence entrance before setting out.', 'Confirm the fare or scope of the booking before the ride.', 'Check the return journey while you still have time to choose.', 'Keep transport flexible when the weather changes.'],
      },
    ],
    sources: [sources.airport, sources.bus, sources.busHome, sources.weather, localSources.rental, localSources.bike, localSources.mixxmall],
    relatedGuides: ['phuket-airport-to-rawai', 'promthep-cape-sunset', 'a-slow-week-in-rawai'],
  },
  {
    slug: 'rawai-food-and-markets',
    title: 'Where to eat, get coffee and buy groceries',
    eyebrow: 'Everyday Rawai',
    summary: 'Start with Tops and Starbucks at Mixxmall, add a salad lunch at We Café, then choose a seafood dinner by the water.',
    hero: images.seafoodMarket,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Tops and Starbucks: one useful first stop',
        paragraphs: [
          'Mixxmall Rawayana on Rawai Beach Road brings a Tops supermarket and Starbucks together in one stop. It is a useful place to begin after checking in: pick up breakfast ingredients and drinking water, then pause for a familiar coffee.',
          'Use the Tops Rawayana branch page for its current hours and map. When looking for Starbucks, select Rawayana Mixxmall rather than a branch farther away in Chalong. Both are local walking options from the residence, with the exact route depending on the entrance you use.',
        ],
      },
      {
        heading: 'We Café for lunch, Nikita’s for a mixed group',
        paragraphs: [
          'We Café’s Rawai branch is a place to consider for salads and café food when you want a lighter lunch. Its own site has the menu and a link to the correct branch, which helps distinguish it from the Chao Fah and Samkong locations.',
          'Nikita’s Beach Restaurant offers Thai food, seafood, wood-fired pizza and international dishes beside the water. That breadth makes it a useful option when a group cannot agree on one cuisine. Check the current menu and table availability directly.',
        ],
      },
      {
        heading: 'Seafood at the market and Mook Manee',
        paragraphs: [
          'The seafood-market area beside Rawai Pier is a different kind of evening: choose seafood from the stalls and arrange to have it cooked by a nearby restaurant. Confirm the weight, ingredient price and preparation charge before committing.',
          'Mook Manee is one specific restaurant to explore in this area, with a live-seafood selection described by the MICHELIN Guide. You can also keep the evening simpler by ordering from a restaurant menu. Explain allergies or dietary requirements directly before ordering.',
        ],
      },
      {
        heading: 'Leave room for meals at home',
        paragraphs: [
          'Each kitchen has a refrigerator, electric hob, microwave, kettle, toaster, utensils and dishes. Look through it before a larger shop and buy what suits your normal breakfast or a simple dinner. The dining table is set for two in each apartment.',
          'Keep a small meal in reserve for a late beach day or a rainy evening. Ask the booking team for a current local suggestion if you have a particular cuisine, budget or arrival time in mind.',
        ],
      },
    ],
    sources: [localSources.tops, localSources.mixxmall, localSources.weCafe, localSources.nikitas, localSources.market, localSources.mookManee, sources.bright],
    relatedGuides: ['rawai-seafood-market', 'rawai-neighborhood-guide', 'long-stays-in-rawai'],
  },
  {
    slug: 'a-slow-week-in-rawai',
    title: 'A slow week in Rawai',
    eyebrow: 'A little inspiration',
    summary: 'An adaptable seven-day outline with a few good outings and plenty of time to enjoy the place you are staying.',
    hero: images.poolCourtyard,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Days one and two: settle in, then find the sea',
        paragraphs: [
          'Keep arrival day for the apartment and the immediate neighborhood. Put your bags away, pick up breakfast supplies, and have a meal without a complicated journey. If the timing suits, take a first walk by Rawai’s boats and waterfront.',
          'Make the next day your main beach outing. Choose Nai Harn or Ya Nui, check the conditions, and allow the afternoon to unfold. There is no need to visit both just because they appear on the same map. Come home with enough time to shower and enjoy dinner.',
        ],
      },
      {
        heading: 'Days three and four: a wider view and a day close to home',
        paragraphs: [
          'Set aside a day for Phuket Old Town if you would like a change from the coast. Walk a few historic streets, take a long lunch, and consider Thai Hua Museum for more context on the island’s Chinese heritage. Check opening times and your transport before setting out.',
          'Follow the outing with a quieter day: breakfast on the balcony, time at the residence, a grocery top-up, or a book beside the pool when it is open. A free day is useful space for laundry, work, or doing very little.',
        ],
      },
      {
        heading: 'Days five and six: choose one special outing',
        paragraphs: [
          'Rawai has boats serving nearby islands. If an island trip appeals, speak to an operator about the route, weather, equipment, inclusions, and cancellation terms before committing. Keep this as a flexible part of the week rather than an essential promise on a particular day.',
          'Use another afternoon for Promthep Cape and the southern coast. Check the sunset time and conditions, then choose a comfortable place to enjoy the view. Alternatively, return to the beach or café you liked best. Repeating a good day is part of a holiday too.',
        ],
      },
      {
        heading: 'Day seven: keep the final hours easy',
        paragraphs: [
          'Confirm the return transfer, leave time to pack, and choose something close by for the last meal. Avoid making departure day dependent on a boat trip or a long journey across the island. You will enjoy the final morning more when the practical details are already settled.',
        ],
        bullets: ['Swap the order around your arrival time and the daily weather.', 'Choose one main outing per day, with open space around it.', 'Keep a beach day and an indoor alternative available.', 'Use this as an outline to adapt, not a timetable to complete.'],
      },
    ],
    sources: [sources.rawai, sources.naiHarn, sources.yaNui, sources.oldTown, sources.thaiHua, sources.cape, sources.weather],
    relatedGuides: ['promthep-cape-sunset', 'phuket-rainy-day-guide', 'rawai-food-and-markets'],
  },
  {
    slug: 'promthep-cape-sunset',
    title: 'An evening at Promthep Cape',
    eyebrow: 'Southern horizons',
    summary: 'Make a little room for the view at Phuket’s southern end, with a flexible plan for getting there and coming home.',
    hero: images.rawai,
    readTime: '3 min read',
    sections: [
      {
        heading: 'Give the cape its own moment',
        paragraphs: [
          'Promthep Cape is a rocky headland at the southern end of Phuket, known for its sunset views. The provincial visitor guide describes steps leading to the viewpoint and views toward the offshore islands. It is somewhere to arrive with time to look around instead of appearing just as the light changes.',
          'Start from Rawai with enough space in the afternoon to enjoy the coast. A visit can be as simple as spending time at the main viewpoint, watching the light move across the water, and choosing an easy dinner afterward.',
        ],
      },
      {
        heading: 'Check the sky, then the time',
        paragraphs: [
          'A clear horizon and the day’s clouds affect what you will see. Check the current forecast and sunset time before leaving, and keep expectations open: a dramatic sky, a soft evening, and a cloudy visit can all be different experiences of the same place.',
          'If conditions are poor, move the outing to another evening instead of forcing it into the schedule. A flexible stay gives you more chances than a single packed afternoon.',
        ],
      },
      {
        heading: 'Choose a comfortable way to visit',
        paragraphs: [
          'Arrange the outward and return journey together. If a driver is waiting, agree on the time and meeting point. If you are traveling independently, save the pickup location while there is still daylight and leave room for other visitors doing the same journey.',
          'Wear footwear suited to steps and stay on the established visitor routes. You do not need to scramble down the headland to enjoy a view. Let the group’s comfort and the light determine when to head back.',
        ],
      },
      {
        heading: 'Keep the rest of the evening light',
        paragraphs: [
          'Pair the visit with an easy dinner rather than a tight reservation across the island. Another option is a late afternoon around Nai Harn or Ya Nui followed by the cape, as long as the group still feels like moving. One pleasant stop is enough if you would rather linger.',
        ],
      },
    ],
    sources: [sources.cape, sources.yaNui, sources.naiHarn, sources.weather],
    relatedGuides: ['nai-harn-and-ya-nui-beaches', 'getting-around-south-phuket', 'a-slow-week-in-rawai'],
  },
  {
    slug: 'phuket-rainy-day-guide',
    title: 'When the island asks you to slow down',
    eyebrow: 'Rainy-day plans',
    summary: 'Keep a second kind of day in mind: a museum, an unhurried lunch, a useful errand, or time at home with the balcony doors in view.',
    hero: images.cozyLiving,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Plan from the day’s forecast',
        paragraphs: [
          'A weather symbol alone is not a whole day’s plan. Use the Thai Meteorological Department’s Phuket forecast and current warnings to decide what fits. A passing shower and a day of unsettled weather call for different choices, and marine conditions matter separately if you are considering a boat trip.',
          'Keep beach and island plans movable where possible. Check the operator’s decision and cancellation terms for a booked excursion, and follow local flags and instructions at the shore.',
        ],
      },
      {
        heading: 'Give Phuket Town time beyond a photo stop',
        paragraphs: [
          'Phuket Old Town offers historic streets, local food, and places to spend time under a roof between walks. Thai Hua Museum on Krabi Road explores Phuket’s Chinese history in a former school building. It provides a different perspective on the island from a week focused entirely on the coast.',
          'Check current opening hours before traveling, and pair one indoor visit with lunch rather than a long list of stops. Travel conditions still matter on a wet day, so decide whether the outing makes sense before arranging the journey.',
        ],
      },
      {
        heading: 'Enjoy the apartment you chose',
        paragraphs: [
          'A separate living room can be especially welcome when a plan changes. Make a meal, catch up on reading, or use a quiet stretch for work. The desk, kitchen, and washer make a day close to home useful without needing to turn it into a sightseeing project.',
          'The residence’s shared gym and coworking area may give you another place to spend time during their opening hours. Ask about current access rather than assuming every shared facility is available throughout the day.',
        ],
      },
      {
        heading: 'Keep an easy alternate plan ready',
        paragraphs: [
          'Before the week begins, save one indoor place you would enjoy, one local meal that is easy to reach, and something you like doing at home. This gives you choices when the weather turns without sending you back into a long search for activities.',
        ],
        bullets: ['Check weather and marine warnings before deciding on the day.', 'Confirm the opening hours of the indoor place you choose.', 'Allow more flexibility for transport and wet walking routes.', 'Move the beach outing to a better window when you can.'],
      },
    ],
    sources: [sources.weather, sources.oldTown, sources.thaiHua, sources.bright, sources.cozy, sources.phuket],
    relatedGuides: ['a-slow-week-in-rawai', 'rawai-food-and-markets', 'long-stays-in-rawai'],
  },
  {
    slug: 'two-apartments-for-family-and-friends',
    title: 'Travel together, with a home each',
    eyebrow: 'Family and friends',
    summary: 'Two adjacent apartments can make a shared trip feel easier: time together when you want it, and your own space at the end of the day.',
    hero: images.brightWide,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Understand the arrangement',
        paragraphs: [
          'The combined listing brings together Bright and Cozy, two adjacent one-bedroom apartments at The Title V. Each is 37 m² and has its own bedroom, living area, kitchen, bathroom, and balcony. You are booking two complete homes with separate entrances; an internal connecting door is not advertised.',
          'This arrangement can suit two couples, friends, or an extended family who want to stay close while keeping their own morning and evening routines. It is worth comparing both galleries so everyone understands the rooms they will use.',
        ],
      },
      {
        heading: 'Decide who sleeps where',
        paragraphs: [
          'Each apartment has one queen bed and one sofa bed, with a maximum of two adults and two children aged 14 or younger. Booking both gives a combined maximum of four adults and four children in that age range. Include every guest and the children’s ages in the inquiry.',
          'If someone needs privacy for early work, a child has an early bedtime, or a member of the group prefers quieter mornings, allocate the apartments around those routines. Separate bathrooms and kitchens can make those differences much easier to manage.',
        ],
      },
      {
        heading: 'Know where you will spend time together',
        paragraphs: [
          'The pools and shared grounds give the group places to meet during the residence’s opening hours. Outings and meals out can be shared, while each household still has somewhere to retreat. Treat the shared facilities as common spaces used by other residents too.',
          'The dining table in each apartment is set for two. If you imagine all eight guests sitting down to a meal in one apartment, discuss that expectation before booking. Two homes provide flexibility, but they do not create a large combined dining room.',
        ],
      },
      {
        heading: 'Ask about both apartments in one conversation',
        paragraphs: [
          'Send the full group’s dates and guest details in a single inquiry. Both apartments need to be available for the whole stay, including any proposed extension. If different households arrive on different days, include those details so the check-in arrangements can be planned clearly.',
        ],
        bullets: ['Confirm that the quote covers both apartments for the full date range.', 'Review the cleaning charge and metered utilities for each apartment.', 'Agree on the deposit, payment, and cancellation arrangements.', 'Share flight or arrival information for each part of the group.'],
      },
    ],
    sources: [sources.pair, sources.bright, sources.cozy],
    relatedGuides: ['phuket-with-children', 'work-from-phuket', 'a-slow-week-in-rawai'],
  },
  {
    slug: 'rawai-seafood-market',
    title: 'A practical evening at Rawai Seafood Market',
    eyebrow: 'At the waterfront',
    summary: 'Choose the seafood, agree the cooking, and enjoy dinner near Rawai Pier. Here is how to make the market visit straightforward.',
    hero: images.seafoodMarket,
    readTime: '3 min read',
    sections: [
      {
        heading: 'Find the market by Rawai Pier',
        paragraphs: [
          'Rawai Seafood Market occupies a short strip beside the pier, with seafood stalls and restaurants close together. It is a waterfront outing from The Title V: open the market pin, choose a comfortable walking route, and allow time to look around before you buy.',
          'The common arrangement is to purchase seafood at a stall and take it to a nearby restaurant for cooking. You can also order directly at a restaurant, which may suit a smaller appetite or a group that wants a simpler evening.',
        ],
      },
      {
        heading: 'Agree two parts of the bill',
        paragraphs: [
          'Start with the ingredients. Ask for the price by weight, watch the weighing, and confirm the total for the seafood you choose. Then ask the restaurant what it will charge to prepare it and how that charge is calculated. Drinks, rice, sauces and side dishes may be additional.',
          'Choose the cooking method before handing over the seafood. A whole fish, prawns and shellfish can lead to very different meals; tell the restaurant how many people are eating and whether you prefer mild or spicy food.',
        ],
        bullets: ['Confirm the ingredient total before paying the stall.', 'Agree the restaurant’s cooking charge and any extras.', 'Describe allergies or dietary requirements directly.', 'Keep enough time for the meal rather than scheduling a tight pickup.'],
      },
      {
        heading: 'A restaurant to start with: Mook Manee',
        paragraphs: [
          'Mook Manee is a named option in the seafood-market area. The MICHELIN Guide describes its live-seafood selection and location beside the market. Use that as a starting point to inspect the menu and ask how your chosen meal would work.',
          'The recommendation is about the type of experience, not a promise of a particular catch, bill or table. Menus and availability change; confirm everything with the restaurant on the day.',
        ],
      },
      {
        heading: 'Keep another dinner option in mind',
        paragraphs: [
          'If someone in the group does not want seafood, Nikita’s offers a broader mix of Thai and international dishes, including pizza, on the Rawai waterfront. For a salad-focused meal, look at the Rawai branch of We Café.',
          'After dinner, use the saved Title V entrance pin for the return. A waterfront walk can be pleasant, but choose a ride if the weather, darkness or the group’s energy makes that easier.',
        ],
      },
    ],
    sources: [localSources.market, localSources.mookManee, localSources.nikitas, localSources.weCafe],
    relatedGuides: ['rawai-food-and-markets', 'rawai-neighborhood-guide', 'island-trips-from-rawai'],
  },
  {
    slug: 'island-trips-from-rawai',
    title: 'A longtail day from Rawai',
    eyebrow: 'Offshore plans',
    summary: 'Bon Island and Coral Island are places to explore with a local boat operator. Build the day around the sea, your group and a clear return plan.',
    hero: images.rawai,
    readTime: '3 min read',
    sections: [
      {
        heading: 'Bon Island for a nearby island outing',
        paragraphs: [
          'The provincial visitor guide identifies chartered longtails from Rawai to Bon Island, also written Koh Bon. It is an option to discuss when you want an island day beginning near your accommodation.',
          'Ask which beach the boat will use, whether the captain waits, and how you will arrange the return. Confirm food, shade, toilets and other facilities for your visit instead of assuming everything shown in an older photo is available.',
        ],
      },
      {
        heading: 'Coral Island: choose the beach and activities',
        paragraphs: [
          'Coral Island is also called Koh Hey or Koh Hae. Tour operators publish different beach and activity combinations, so the island name alone does not describe the day you are buying. Ask for the specific landing beach and the time available there.',
          'JC Tour publishes private longtail itineraries for Bon and Coral Island. Its Bon itinerary identifies a Rawai departure; confirm the departure point for the exact package you choose. Other trips advertised on the same website can begin elsewhere in Phuket.',
        ],
      },
      {
        heading: 'Get the whole plan in one quote',
        paragraphs: [
          'Tell the operator how many adults and children are travelling, the children’s ages, and whether anyone needs help boarding. Confirm the boat’s capacity, transfer to the departure point, landing fees, food and snorkeling equipment before comparing prices.',
          'Ask about correctly sized life jackets, the captain’s contact, the return pickup and the weather cancellation policy. Keep the agreed plan available on your phone and share it with everyone in the group.',
        ],
        bullets: ['Exact departure and landing points.', 'Private or shared boat, capacity and inclusions.', 'Return time, contact and backup arrangements.', 'Weather decision, cancellation and refund terms.'],
      },
      {
        heading: 'Let the conditions choose the day',
        paragraphs: [
          'Check the Thai Meteorological Department’s current forecast and marine warnings, then follow the operator’s decision about whether the trip should run. A nearby island still means open-water travel, and yesterday’s conditions do not settle today’s plan.',
          'Keep a land-based alternative ready: a meal on the Rawai waterfront, a massage appointment or time around the residence. Avoid putting a boat trip on the morning of a flight.',
        ],
      },
    ],
    sources: [localSources.bon, { title: 'Phuket Provincial Government · Hey / Coral Island', url: 'https://www.phuket.go.th/eng/Is-Hey%20Island.php' }, localSources.charter, sources.weather],
    relatedGuides: ['rawai-seafood-market', 'nai-harn-and-ya-nui-beaches', 'phuket-rainy-day-guide'],
  },
  {
    slug: 'rawai-massage-and-wellness',
    title: 'Find the right massage in Rawai',
    eyebrow: 'A quieter afternoon',
    summary: 'Two local options with published menus, plus a few details that make booking the right treatment easier.',
    hero: images.gardenWalkway,
    readTime: '3 min read',
    sections: [
      {
        heading: 'Nam Phueng for a range of familiar treatments',
        paragraphs: [
          'Nam Phueng’s Rawai location publishes Thai, foot, oil and more focused massage choices. Start with the treatment menu and session length, then contact the provider to confirm the appointment and price.',
          'Specify the Rawai branch when booking, because the business also advertises Chalong. Save the confirmed location and plan a ride if the route does not suit a walk from the waterfront.',
        ],
      },
      {
        heading: 'Nua for a dedicated studio at Fisherman Way',
        paragraphs: [
          'Nua Thai Massage publishes a detailed menu with Thai, aroma-oil, foot and other treatments at Fisherman Way on Wiset Road. The menu is useful when you want to compare the focus and duration before reserving.',
          'Fisherman Way is farther north in Rawai, so treat this as a planned ride rather than a quick stroll beside the apartment. Allow time to arrive without rushing and confirm the return transport.',
        ],
      },
      {
        heading: 'Book the experience you actually want',
        paragraphs: [
          'Tell the provider whether you want gentle pressure or a firmer massage, a full-body treatment or attention to a particular area, and whether two people want appointments at the same time. Ask about the room arrangement if privacy matters to you.',
          'Confirm the full price, duration, availability and cancellation terms directly. Speak up if the pressure is uncomfortable; the session should reflect your preference, not an assumption based on the menu title.',
        ],
        bullets: ['The exact branch and appointment time.', 'Treatment style, duration and preferred pressure.', 'One or two guests, and preferred room arrangement.', 'The current total and cancellation terms.'],
      },
      {
        heading: 'Or keep the afternoon at the residence',
        paragraphs: [
          'The Title V has shared pools, a sauna and a steam-room area for guests to use under the residence’s rules. They can make an unplanned afternoon feel complete without arranging an outing.',
          'These are shared condominium facilities. Massage appointments at outside businesses are separate from the apartment stay, and the garden photo above shows the residence rather than either massage provider.',
        ],
      },
    ],
    sources: [localSources.namPhueng, { title: 'Nam Phueng · current massage menu', url: 'https://www.namphueng.co.th/massagepricelist' }, localSources.nua, sources.bright],
    relatedGuides: ['phuket-rainy-day-guide', 'rawai-food-and-markets', 'long-stays-in-rawai'],
  },
];

export const guideBySlug = (slug: string) => guides.find((guide) => guide.slug === slug);
