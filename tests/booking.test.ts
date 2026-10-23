import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppRequest, bangkokToday, addDays } from '../src/lib/booking.ts';
import { calculateQuote } from '../src/lib/pricing.ts';

test('WhatsApp handoff preserves the exact apartment name, dates, guests and discounted estimate without claiming a reservation', () => {
  const quote = calculateQuote({ propertyId: 'bright-1br-rawai-beach', checkIn: '2027-05-01', checkOut: '2027-05-08', guests: 3 });
  const url = new URL(buildWhatsAppRequest('Title V New & Bright 1BR at Rawai Beach', quote, 'live'));
  assert.equal(url.origin + url.pathname, 'https://wa.me/79139098949');
  const text = url.searchParams.get('text')!;
  assert.match(text, /Title V New & Bright 1BR at Rawai Beach/);
  assert.match(text, /2027-05-01/);
  assert.match(text, /2027-05-08/);
  assert.match(text, /3 guests/);
  assert.match(text, /6,300 THB/);
  assert.match(text, /10%/);
  assert.match(text, /Please confirm/);
  assert.doesNotMatch(text, /booking confirmed|reserved/i);
});
test('An unavailable calendar produces an explicit confirmation request', () => {
  const quote = calculateQuote({ propertyId: 'cozy-1br-rawai-beach', checkIn: '2027-10-01', checkOut: '2027-10-03' });
  assert.match(new URL(buildWhatsAppRequest('Cozy', quote, 'unavailable')).searchParams.get('text')!, /calendar could not be verified/);
});
test('Bangkok date and date arithmetic handle midnight and month boundaries', () => {
  assert.equal(bangkokToday(new Date('2026-10-22T18:00:00Z')), '2026-10-23');
  assert.equal(addDays('2028-02-28', 2), '2028-03-01');
});
