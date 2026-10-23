import { images, type GalleryImage } from './properties';

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
        heading: 'Decide what you want from your evenings',
        paragraphs: [
          'An apartment stay works particularly well when you enjoy a mix of dinners out and quiet evenings at home. Cook something simple, sit on the balcony, or head back to a place you liked at lunchtime. If your plans revolve around another part of Phuket every night, consider that journey when choosing your base.',
        ],
      },
    ],
    sources: [sources.rawai, sources.naiHarn, sources.yaNui, sources.bright],
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
          'Ask how electricity and water are included or measured, how any excess use is charged, and when meter readings are taken. Also settle the cleaning arrangement, deposit, payment schedule, and cancellation terms before making plans around the reservation.',
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
          'Each apartment is listed for up to four guests, with one queen bed and a convertible sofa in the living room. Share the ages of the children and who will sleep where. A maximum guest count does not tell you whether a particular arrangement will feel comfortable for your family.',
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
          'Traveling with grandparents or another family? Booking the two adjacent apartments gives each household its own kitchen, bathroom, and evening space while keeping everyone close.',
        ],
      },
    ],
    sources: [sources.bright, sources.cozy, sources.pair, sources.phuket],
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
          'Once your booking is confirmed, save the residence name, entrance location, host contact, and check-in instructions in one place. Download a copy you can open without a connection. Send the correct entrance pin to your driver instead of relying on a similar building name.',
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
    sources: [sources.airport, sources.bus, sources.busHome],
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
        heading: 'Plan around the outing, not a single mode of transport',
        paragraphs: [
          'You do not need to solve every journey in the same way. A local meal, a beach afternoon, and a full day in Phuket Town ask different things of your transport. Group places that make sense together, then decide whether a bus, car, or arranged ride suits that particular plan.',
          'Check the route from the residence entrance, not just the name Rawai. The part between your door and a main road or bus stop is still part of the journey, particularly in heat, rain, or with children.',
        ],
      },
      {
        heading: 'Use the bus when its route fits',
        paragraphs: [
          'Phuket Smart Bus connects Rawai with stops along the west coast and the airport. Its website offers a timetable, payment information, and live tracking. It can be a useful option when your destination is on the route and you have time to travel at the service’s pace.',
          'Check both directions before leaving. Save the location of the return stop, the last suitable service, and a backup way home. The bus photograph in the listing is a helpful orientation image, not a current timetable.',
        ],
      },
      {
        heading: 'Use a car or driver for a more specific plan',
        paragraphs: [
          'For several stops, a family group, or a destination away from the bus route, a car or booked driver may be easier. Agree on whether the price covers one journey, waiting time, or a complete outing, and describe the luggage or child-seat needs before confirming.',
          'If you intend to drive yourself, check the rental provider’s requirements and your cover before reserving. Choose a vehicle and roads you are comfortable with. You can enjoy a Rawai stay without making an unfamiliar type of transport part of the holiday.',
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
    sources: [sources.airport, sources.bus, sources.busHome, sources.weather],
    relatedGuides: ['phuket-airport-to-rawai', 'promthep-cape-sunset', 'a-slow-week-in-rawai'],
  },
  {
    slug: 'rawai-food-and-markets',
    title: 'Good food, and the pleasure of a kitchen',
    eyebrow: 'Everyday Rawai',
    summary: 'Leave room for seafood by the water, a favorite breakfast place, and a few easy meals in your own apartment.',
    hero: images.seafoodMarket,
    readTime: '4 min read',
    sections: [
      {
        heading: 'Make time for the waterfront',
        paragraphs: [
          'Rawai’s waterfront and seafood market are part of the neighborhood described in the apartment listings. An easy way to begin is to look around without committing immediately: see the stalls, compare menus, and choose somewhere that suits your appetite and budget.',
          'Before ordering seafood, confirm the portion or weight, the total price, and any separate preparation charges. If you have dietary requirements, explain them directly and check the response rather than relying on the appearance of a dish.',
        ],
      },
      {
        heading: 'Let breakfast stay simple',
        paragraphs: [
          'The apartment kitchens include a refrigerator, electric hob, microwave, kettle, toaster, utensils, and dishes. That makes a small breakfast at home practical, even if most of your meals happen out. Buy what you enjoy using rather than trying to reproduce an entire kitchen cupboard.',
          'A little fruit, a few familiar breakfast items, and drinking water are a useful start. If you plan to cook regularly, look through the kitchen when you arrive before making a larger shop.',
        ],
      },
      {
        heading: 'Build your own small list of favorites',
        paragraphs: [
          'Instead of following a long list of places to tick off, find one dependable breakfast, one easy dinner, and one café that suits your pace. Check today’s opening times and menu directly. Places, prices, and hours change, and a recommendation is most useful when it still fits the day you want to go.',
          'Ask your host for current suggestions during your stay and describe what you enjoy: local dishes, a relaxed family meal, a quiet table, or somewhere convenient for a late arrival.',
        ],
      },
      {
        heading: 'Keep a meal in reserve',
        paragraphs: [
          'A simple dinner at home can be the best end to a full beach day. It also keeps plans easy when children are tired or a shower of rain changes the evening. The dining table is set for two in each apartment, so think about the seating arrangement if you intend to eat together as a larger group.',
          'For a change of scene on another day, Phuket Old Town offers a different setting of historic streets and local food. Give that outing its own time rather than squeezing it into a quick grocery errand.',
        ],
      },
    ],
    sources: [sources.bright, sources.cozy, sources.rawai, sources.oldTown],
    relatedGuides: ['rawai-neighborhood-guide', 'long-stays-in-rawai', 'phuket-rainy-day-guide'],
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
          'Each apartment has one queen bed and one sofa bed. The combined Airbnb listing allows up to eight guests, but a useful inquiry says more than eight: include the number of adults, children’s ages, and the sleeping arrangement you have in mind.',
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
        bullets: ['Confirm that the quote covers both apartments for the full date range.', 'Ask about cleaning and utility allowances for each apartment.', 'Agree on the deposit, payment, and cancellation arrangements.', 'Share flight or arrival information for each part of the group.'],
      },
    ],
    sources: [sources.pair, sources.bright, sources.cozy],
    relatedGuides: ['phuket-with-children', 'work-from-phuket', 'a-slow-week-in-rawai'],
  },
];

export const guideBySlug = (slug: string) => guides.find((guide) => guide.slug === slug);
