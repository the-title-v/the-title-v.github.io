export const REVIEWS_CHECKED_AT = '2026-10-23';

export interface GuestReviewExcerpt {
  id: string;
  guestInitials: string;
  publishedMonth: string;
  rating: number;
  translatedByAirbnb: boolean;
  quote: string;
}

export interface ReviewListing {
  propertyId: 'bright-1br-rawai-beach' | 'cozy-1br-rawai-beach';
  shortName: string;
  airbnbListingId: string;
  rating: number;
  reviewCount: number;
  sourceUrl: string;
  excerpts: readonly GuestReviewExcerpt[];
}

export const reviewListings: readonly ReviewListing[] = [
  {
    propertyId: 'bright-1br-rawai-beach',
    shortName: 'Bright',
    airbnbListingId: '622135535519576635',
    rating: 4.78,
    reviewCount: 18,
    sourceUrl: 'https://www.airbnb.com/rooms/622135535519576635/reviews',
    excerpts: [
      {
        id: '1660656235230149014',
        guestInitials: 'Y.',
        publishedMonth: '2026-04',
        rating: 5,
        translatedByAirbnb: true,
        quote: 'The accommodation is clean and fully equipped with amenities.',
      },
      {
        id: '1706973743425704242',
        guestInitials: 'Y.',
        publishedMonth: '2026-06',
        rating: 5,
        translatedByAirbnb: false,
        quote: 'It was super easy to check in',
      },
      {
        id: '1341768971058083244',
        guestInitials: 'O.',
        publishedMonth: '2025-01',
        rating: 5,
        translatedByAirbnb: true,
        quote: 'Our children also felt comfortable.',
      },
    ],
  },
  {
    propertyId: 'cozy-1br-rawai-beach',
    shortName: 'Cozy',
    airbnbListingId: '922904332708842126',
    rating: 4.71,
    reviewCount: 14,
    sourceUrl: 'https://www.airbnb.com/rooms/922904332708842126/reviews',
    excerpts: [
      {
        id: '1793129636294950373',
        guestInitials: 'D.',
        publishedMonth: '2026-10',
        rating: 5,
        translatedByAirbnb: true,
        quote: 'A wonderful new apartment in a very nice neighbourhood.',
      },
      {
        id: '1663576174412676857',
        guestInitials: 'J. M.',
        publishedMonth: '2026-04',
        rating: 5,
        translatedByAirbnb: false,
        quote: 'Neighbours were silent and respectful.',
      },
      {
        id: '1227979530876346094',
        guestInitials: 'V.',
        publishedMonth: '2024-08',
        rating: 5,
        translatedByAirbnb: false,
        quote: 'This apartment was fabulous, very comfortable with everything we needed.',
      },
    ],
  },
];
