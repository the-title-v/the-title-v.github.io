import { properties } from '../data/properties';
import { guides } from '../data/guides';
import { informationPages } from '../data/pages';
export const publicRoutes = ['/', '/stays/', ...properties.map(property => `/stays/${property.slug}/`), '/book/', '/rates/', '/gallery/', '/faq/', '/guides/', ...guides.map(guide => `/guides/${guide.slug}/`), ...informationPages.map(page => `/${page.slug}/`)];
