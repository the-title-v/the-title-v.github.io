export interface LocalSource { title: string; url: string }

export const residenceLocation = {
  name: 'The Title V (Rawai–Phuket)',
  address: '555 Wiset Road, Rawai, Mueang Phuket, Phuket 83130, Thailand',
  query: 'The Title V (Rawai-Phuket), 555 Wiset Road, Rawai, Phuket 83130',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Title+V+%28Rawai-Phuket%29%2C+555+Wiset+Road%2C+Rawai%2C+Phuket+83130',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=The+Title+V+%28Rawai-Phuket%29%2C+555+Wiset+Road%2C+Rawai%2C+Phuket+83130',
  embedUrl: 'https://maps.google.com/maps?q=The%20Title%20V%20%28Rawai-Phuket%29%2C%20555%20Wiset%20Road%2C%20Rawai%2C%20Phuket%2083130&z=16&output=embed',
};

export const localSources = {
  titleV: { title: 'The Title V · condominium map listing', url: residenceLocation.mapsUrl },
  residence: { title: 'Phuket.net · The Title V project and facilities', url: 'https://www.phuket.net/property/project/the-title-v/' },
  tops: { title: 'Tops · Rawayana Phuket branch', url: 'https://corporate.tops.co.th/store-branch/tops-rawayana-phuket/' },
  mixxmall: { title: 'Rawayana · Mixxmall shops and cafés', url: 'https://central.rawayanabeachfront.com/facilities/mixxmall-rawayana' },
  weCafe: { title: 'We Café · Rawai branch and menu', url: 'https://wecafephuket2012.com/en/' },
  market: { title: 'Phuket 101 · Rawai Seafood Market', url: 'https://www.phuket101.net/rawai-seafood-market/' },
  mookManee: { title: 'MICHELIN Guide · Mook Manee', url: 'https://guide.michelin.com/gb/en/phuket-region/phuket/restaurant/mook-manee' },
  nikitas: { title: 'Nikita’s · A Taste of Rawai', url: 'https://www.atasteofrawai.info/nikitas' },
  bon: { title: 'Phuket Provincial Government · Bon Island', url: 'https://www.phuket.go.th/eng/Is-Bon%20Island.php' },
  charter: { title: 'JC Tour · private longtail charters from Rawai', url: 'https://www.jctour-phuket.com/charterlongtail/index.php' },
  bus: { title: 'Phuket Smart Bus · timetable and route', url: 'https://phuketsmartbus.com/timetable' },
  rental: { title: 'Enigma · car and scooter rental in Rawai', url: 'https://enigmarentals.com/' },
  bike: { title: 'Anda Rawai · motorbike rental', url: 'https://andarawai.com/' },
  money: { title: 'Money Shop · Rawai exchange office', url: 'https://moneyshopphuket.com/' },
  atm: { title: 'Bangkok Bank · current ATM and branch locator', url: 'https://www.bangkokbank.com/Locate-Us' },
  park: { title: 'Rawai Park · play areas and visitor information', url: 'https://www.rawaipark.com/' },
} satisfies Record<string, LocalSource>;

export const placeMapUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export interface NearbyPlace {
  name: string;
  journey: string;
  reason: string;
  tip: string;
  mapQuery: string;
  source: LocalSource;
}

export interface NearbyGroup {
  id: string;
  title: string;
  intro: string;
  guide: { label: string; href: string };
  places: NearbyPlace[];
}

export const nearbyGroups: NearbyGroup[] = [
  {
    id: 'beaches', title: 'The coast, three ways',
    intro: 'Walk beside Rawai’s boats, then take a ride to the southern bays when you want time on the sand.',
    guide: { label: 'Choose your beach', href: '/guides/nai-harn-and-ya-nui-beaches/' },
    places: [
      { name: 'Rawai waterfront', journey: 'Near the residence · walk', reason: 'The close-to-home choice for a morning stroll, sea views, seafood and longtail departures.', tip: 'Rawai is a working waterfront; plan your main swimming outing at another beach.', mapQuery: 'Rawai Beach Phuket', source: { title: 'Phuket Provincial Government · Rawai', url: 'https://www.phuket.go.th/eng/Beaches-Rawai%20Beach.php' } },
      { name: 'Nai Harn Beach', journey: 'Southern coast · drive', reason: 'A broad sandy bay for a full beach outing, with a lake just inland.', tip: 'Check warning flags on arrival. Sea conditions can make a day on the sand the better choice.', mapQuery: 'Nai Harn Beach Phuket', source: { title: 'Phuket Provincial Government · Nai Harn', url: 'https://www.phuket.go.th/eng/Beaches-Nai%20Harn%20Beach.php' } },
      { name: 'Ya Nui Beach', journey: 'Southern coast · drive', reason: 'A smaller cove between the Windmill viewpoint and Promthep Cape; easy to pair with a coastal outing.', tip: 'Check conditions and equipment availability locally before planning snorkeling or kayaking.', mapQuery: 'Ya Nui Beach Phuket', source: { title: 'Phuket Provincial Government · Ya Nui', url: 'https://www.phuket.go.th/eng/Beaches-Ya%20Nui%20Beach.php' } },
      { name: 'Promthep Cape', journey: 'Southern headland · drive', reason: 'An open sea horizon and a classic late-afternoon viewpoint at Phuket’s southern end.', tip: 'Arrange the return journey and allow time for steps and other sunset visitors.', mapQuery: 'Promthep Cape Phuket', source: { title: 'Phuket Provincial Government · capes', url: 'https://www.phuket.go.th/eng/Attractions-Capes.php' } },
    ],
  },
  {
    id: 'coffee-groceries', title: 'Coffee, breakfast & a stocked fridge',
    intro: 'Start with the nearby waterfront shops. A small first grocery run is usually all you need after the flight.',
    guide: { label: 'Food and grocery guide', href: '/guides/rawai-food-and-markets/' },
    places: [
      { name: 'Tops Rawayana', journey: 'Mixxmall · local walk', reason: 'A practical supermarket stop for breakfast ingredients, fruit, drinking water and apartment supplies.', tip: 'The official branch page has its current opening hours and exact map pin.', mapQuery: 'Tops Rawayana Phuket', source: localSources.tops },
      { name: 'Starbucks · Mixxmall Rawayana', journey: 'Mixxmall · local walk', reason: 'A familiar coffee stop in the same complex as Tops, so you can combine coffee with the first grocery run.', tip: 'Choose the Rawayana Mixxmall branch on Rawai Beach Road when opening directions.', mapQuery: 'Starbucks Rawayana Mixxmall Rawai Phuket', source: localSources.mixxmall },
      { name: 'We Café · Rawai', journey: 'Rawai waterfront · local walk', reason: 'A useful lunch option when you feel like salads and café food between seafood dinners.', tip: 'Use the Rawai branch link on the café’s website; it also has branches elsewhere in Phuket.', mapQuery: 'WeCafe Rawai Phuket', source: localSources.weCafe },
    ],
  },
  {
    id: 'food', title: 'A table by the water',
    intro: 'Fresh seafood, a table by the sea, or something for everyone.',
    guide: { label: 'Plan a seafood-market visit', href: '/guides/rawai-seafood-market/' },
    places: [
      { name: 'Rawai Seafood Market', journey: 'By Rawai Pier · waterfront walk', reason: 'Choose seafood at the stalls and ask one of the nearby restaurants to prepare it.', tip: 'Agree the weight, ingredient price and separate cooking charge before buying.', mapQuery: 'Rawai Seafood Market Phuket', source: localSources.market },
      { name: 'Mook Manee', journey: 'Seafood-market area · waterfront walk', reason: 'A lively seafood restaurant beside the market, listed in the MICHELIN Guide.', tip: 'Ask whether you are choosing from its own stock or bringing seafood from a stall, then confirm the total.', mapQuery: 'Mook Manee Rawai Phuket', source: localSources.mookManee },
      { name: 'Nikita’s Beach Restaurant', journey: 'Rawai waterfront · waterfront walk', reason: 'A waterside choice for a mixed group: Thai dishes, seafood, pizza and other international options.', tip: 'Useful when everyone wants a different kind of dinner; check the current menu before visiting.', mapQuery: 'Nikitas Beach Restaurant Rawai Phuket', source: localSources.nikitas },
    ],
  },
  {
    id: 'massage', title: 'Make time for a massage',
    intro: 'A familiar Phuket name for a foot massage or a longer spa session.',
    guide: { label: 'Kim’s Massage in Rawai', href: '/guides/rawai-massage-and-wellness/' },
    places: [
      { name: 'Kim’s Massage · Rawai Beach', journey: '50/5 Wiset Road · Rawai waterfront', reason: 'Kim’s 3 is the Rawai Beach branch of the well-known Phuket massage group. Choose Thai, foot or oil massage from its menu.', tip: 'Book directly for your preferred time.', mapQuery: 'Kims Massage 3 Rawai Beach Phuket', source: { title: 'Kim’s Rawai Beach', url: 'https://www.kimsmassagespa.com/kimsrawaibeach' } },
    ],
  },
  {
    id: 'islands', title: 'A day beyond the shore',
    intro: 'Rawai’s longtails put nearby islands within reach. Choose the plan after checking the sea and the operator’s arrangements.',
    guide: { label: 'Plan an island day', href: '/guides/island-trips-from-rawai/' },
    places: [
      { name: 'Bon Island · Koh Bon', journey: 'Longtail from Rawai · boat trip', reason: 'A small island just off Rawai, reached by longtail boat.', tip: 'Confirm the return boat, landing point, available facilities and weather decision before leaving.', mapQuery: 'Koh Bon Island Rawai Phuket', source: localSources.bon },
      { name: 'Private longtail with JC Tour', journey: 'Rawai departure · arrange ahead', reason: 'An operator with published private-charter itineraries for Bon and other nearby islands.', tip: 'Request a written quote with the route, boat capacity, transfer, life jackets and cancellation terms.', mapQuery: 'Rawai Beach Phuket longtail boats', source: localSources.charter },
    ],
  },
  {
    id: 'essentials', title: 'The useful everyday stops',
    intro: 'A bus ride, cash for the day and somewhere for the children to play.',
    guide: { label: 'Banks, cash & ATMs nearby', href: '/guides/rawai-banks-and-atms/' },
    places: [
      { name: 'Phuket Smart Bus · Rawai', journey: 'Rawai Beach stop · walk to pickup', reason: 'The coastal airport route also links Rawai with Kata, Karon and Patong.', tip: 'Use the operator’s current stop map, timetable and live tracking; this is not a door-to-door airport transfer.', mapQuery: 'Phuket Smart Bus Rawai Beach bus stop', source: localSources.bus },
      { name: 'Enigma · cars & scooters', journey: 'Rawai · pickup or agreed delivery', reason: 'One provider for comparing a car with a scooter; its website lists the available vehicle types and rental terms.', tip: 'Ask about delivery, minimum rental, insurance, deposit and child seats before reserving.', mapQuery: 'Enigma Phuket car scooter rental Rawai', source: localSources.rental },
      { name: 'Anda Rawai · motorbikes', journey: 'Rawai · check pickup point', reason: 'A second established local provider to compare for a scooter rental.', tip: 'Confirm the required licence, insurance and helmet fit; rent only a vehicle you are trained to ride.', mapQuery: 'Anda Rawai motorbike rental Phuket', source: localSources.bike },
      { name: 'Money Shop · Rawai', journey: '57/62 Rawai · local walk', reason: 'Exchange cash on Rawai’s waterfront.', tip: 'Compare the final baht amount and any fees for your exact currency and amount; bring the required identification.', mapQuery: 'Money Shop Rawai 57/62 Phuket', source: localSources.money },
      { name: 'Bank ATMs', journey: 'Search around Rawai Beach Road', reason: 'Find nearby branches and cash machines in our banks guide.', tip: 'Check the fee shown on screen and your own bank’s terms. We do not promise a particular machine will be working.', mapQuery: 'bank ATM near Rawai Beach Road Phuket', source: localSources.atm },
      { name: 'Rawai Park', journey: 'Nearby family outing · walk', reason: 'A separate local attraction with children’s play areas and water play, useful when you want a change from the residence.', tip: 'Admission is separate from your stay. Check current opening days, age rules and facilities on its own website.', mapQuery: 'Rawai Park Phuket', source: localSources.park },
    ],
  },
];
