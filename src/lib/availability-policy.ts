export const AVAILABILITY_PROPERTIES = [
  'bright-1br-rawai-beach',
  'cozy-1br-rawai-beach',
  'two-adjacent-apartments-title-v-rawai',
] as const;

// A scheduled import is indicative, never a reservation guarantee.
export const AVAILABILITY_FRESH_MS = 60 * 60 * 1000;
export const AVAILABILITY_REFRESH_MS = 5 * 60 * 1000;
