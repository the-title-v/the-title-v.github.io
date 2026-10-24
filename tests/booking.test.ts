import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as booking from '../src/lib/booking.ts';
import { calculateQuote } from '../src/lib/pricing.ts';

const bright = 'bright-1br-rawai-beach';
const both = 'two-adjacent-apartments-title-v-rawai';

test('WhatsApp request keeps the booking essentials in at most five short lines', () => {
  const quote = calculateQuote({ propertyId: bright, checkIn: '2027-05-01', checkOut: '2027-05-08', adults: 2, children: 1 });
  const url = new URL(booking.buildWhatsAppRequest('Title V New & Bright 1BR at Rawai Beach', quote, 'snapshot'));
  assert.equal(url.origin + url.pathname, 'https://wa.me/79139098949');
  const text = url.searchParams.get('text')!;
  assert.ok(text.length <= 400, `Request is too long: ${text.length} characters`);
  assert.ok(text.split('\n').length <= 5);
  assert.match(text, /Title V New & Bright 1BR at Rawai Beach/);
  assert.match(text, /2027-05-01.*2027-05-08.*7 nights/);
  assert.match(text, /2 adults.*1 child.*14 or under/);
  assert.match(text, /Estimate: 9,900 THB.*cleaning.*utilities.*deposit extra/);
  assert.match(text, /Please confirm availability and price/);
  assert.doesNotMatch(text, /booking confirmed|reserved|due now|before discount|check-in.*15:00|THB\/kWh/i);
});

test('a combined monthly request uses the stay total without adding the refundable deposit', () => {
  const quote = calculateQuote({ propertyId: both, checkIn: '2027-06-01', checkOut: '2027-07-02', adults: 4, children: 4 });
  const text = new URL(booking.buildWhatsAppRequest('Two adjacent apartments', quote, 'snapshot')).searchParams.get('text')!;
  assert.match(text, /4 adults.*4 children/);
  assert.match(text, /31 nights/);
  assert.match(text, /Estimate: 89,800 THB/);
  assert.doesNotMatch(text, /109,800/);
  assert.ok(text.length <= 400);
});

test('an unavailable calendar keeps a short, explicit confirmation request', () => {
  const quote = calculateQuote({ propertyId: 'cozy-1br-rawai-beach', checkIn: '2027-10-01', checkOut: '2027-10-08' });
  const text = new URL(booking.buildWhatsAppRequest('Cozy', quote, 'unavailable')).searchParams.get('text')!;
  assert.match(text, /Please confirm availability and price/);
  assert.match(text, /calendar is unverified/);
  assert.ok(text.length <= 400);
  assert.ok(text.split('\n').length <= 5);
});

test('a solo request omits an empty child count and safely encodes apartment names', () => {
  const quote = calculateQuote({ propertyId: bright, checkIn: '2027-05-01', checkOut: '2027-05-08', adults: 1, children: 0 });
  const url = new URL(booking.buildWhatsAppRequest('Bright & Cozy + pool?', quote, 'snapshot'));
  const text = url.searchParams.get('text')!;
  assert.match(text, /Bright & Cozy \+ pool\?/);
  assert.match(text, /1 adult\n/);
  assert.doesNotMatch(text, /0 children|1 adults/);
  assert.deepEqual([...url.searchParams.keys()], ['text']);
});

test('booking links accept separate adult and child counts and default to two adults', () => {
  assert.deepEqual(booking.readBookingOccupancy(new URLSearchParams('adults=2&children=1'), bright), { adults: 2, children: 1, guests: 3 });
  assert.deepEqual(booking.readBookingOccupancy(new URLSearchParams(), bright), { adults: 2, children: 0, guests: 2 });
  assert.deepEqual(booking.readBookingOccupancy(new URLSearchParams('adults=4&children=4'), both), { adults: 4, children: 4, guests: 8 });
});

test('booking links cannot bypass capacity using new or legacy counts', () => {
  for (const query of ['adults=3', 'guests=4', 'adults=2&children=3', 'adults=2&children=2&guests=2']) {
    assert.throws(() => booking.readBookingOccupancy(new URLSearchParams(query), bright), /adults|children|match/i);
  }
  assert.throws(() => booking.readBookingOccupancy(new URLSearchParams('guests=8'), both), /adults/i);
  assert.deepEqual(booking.readBookingOccupancy(new URLSearchParams('guests=2'), bright), { adults: 2, children: 0, guests: 2 });
});

test('booking links reject malformed and duplicate occupancy parameters', () => {
  for (const query of ['adults=', 'adults=NaN', 'adults=2.5', 'adults=2e0', 'adults=-1', 'children=Infinity', 'children=-1', 'adults=2&adults=3', 'children=0&children=2', 'guests=2&guests=4']) {
    assert.throws(() => booking.readBookingOccupancy(new URLSearchParams(query), bright), /count|once|adults|children/i);
  }
});

test('Bangkok date and date arithmetic handle midnight and month boundaries', () => {
  assert.equal(booking.bangkokToday(new Date('2026-10-22T18:00:00Z')), '2026-10-23');
  assert.equal(booking.addDays('2028-02-28', 2), '2028-03-01');
});
