import type { Quote } from './pricing';
import { whatsappUrl } from '../data/site';

export function bangkokToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export const formatTHB = (value: number) => `฿${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`;

export function buildWhatsAppRequest(propertyName: string, quote: Quote, calendarStatus: 'live' | 'unavailable'): string {
  const lines = [
    `Hi your host, I’d like to enquire about ${propertyName}.`,
    `Check-in: ${quote.checkIn}`,
    `Check-out: ${quote.checkOut} (${quote.nights} nights)`,
    `${quote.guests} guests`,
    `Estimated accommodation: ${quote.total.toLocaleString('en-US')} THB`,
    ...(quote.discountRate ? [`Includes ${quote.discountRate * 100}% ${quote.discountLabel?.toLowerCase()} discount.`] : []),
    calendarStatus === 'live' ? 'The website calendar showed no date conflicts when checked.' : 'The calendar could not be verified for these dates.',
    'Please confirm availability, the final total including utilities/cleaning, any deposit, payment and cancellation terms.',
    'I understand this is a request, not a confirmed booking.',
  ];
  return `${whatsappUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}
