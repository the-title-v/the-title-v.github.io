import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as booking from '../src/lib/booking.ts';
import { calculateQuote } from '../src/lib/pricing.ts';

const bright = 'bright-1br-rawai-beach';
const both = 'two-adjacent-apartments-title-v-rawai';

test('WhatsApp handoff preserves dates, occupancy and every price component without naming the owner', () => {
  const quote = calculateQuote({ propertyId: bright, checkIn: '2027-05-01', checkOut: '2027-05-08', adults: 2, children: 1 });
  const url = new URL(booking.buildWhatsAppRequest('Title V New & Bright 1BR at Rawai Beach', quote, 'snapshot'));
  assert.equal(url.origin + url.pathname, 'https://wa.me/79139098949');
  const text = url.searchParams.get('text')!;
  assert.match(text, /Title V New & Bright 1BR at Rawai Beach/);
  assert.match(text, /Check-in: 2027-05-01.*15:00/);
  assert.match(text, /Check-out: 2027-05-08.*12:00/);
  assert.match(text, /3 guests.*2 adults.*1 child.*14 or under/);
  assert.match(text, /Accommodation.*7,000 THB/);
  assert.match(text, /10%.*accommodation only.*700 THB/);
  assert.match(text, /Accommodation after discount: 6,300 THB/);
  assert.match(text, /Extra children.*300 THB.*2,100 THB/);
  assert.match(text, /Cleaning.*1,500 THB/);
  assert.match(text, /Stay total.*9,900 THB/);
  assert.match(text, /Refundable deposit.*10,000 THB/);
  assert.match(text, /Stay total plus refundable deposit.*19,900 THB/);
  assert.match(text, /Water.*55 THB\/m³/);
  assert.match(text, /electricity.*6 THB\/kWh/);
  assert.match(text, /metered.*excluded/i);
  assert.match(text, /local agent.*meet/i);
  assert.match(text, /Early check-in.*availability.*extra/i);
  assert.match(text, /Please confirm/);
  assert.doesNotMatch(text, /PRIVATE_IDENTITY_PLACEHOLDER|booking confirmed|reserved|due now/i);
});

test('combined request keeps the deposit per booking and the total consistent', () => {
  const quote = calculateQuote({ propertyId: both, checkIn: '2027-06-01', checkOut: '2027-07-02', adults: 4, children: 4 });
  const text = new URL(booking.buildWhatsAppRequest('Two adjacent apartments', quote, 'snapshot')).searchParams.get('text')!;
  assert.match(text, /8 guests.*4 adults.*4 children/);
  assert.match(text, /Cleaning.*3,000 THB/);
  assert.match(text, /Stay total.*89,800 THB/);
  assert.match(text, /Refundable deposit.*20,000 THB/);
  assert.match(text, /Stay total plus refundable deposit.*109,800 THB/);
});

test('an unavailable calendar produces an explicit confirmation request', () => {
  const quote = calculateQuote({ propertyId: 'cozy-1br-rawai-beach', checkIn: '2027-10-01', checkOut: '2027-10-08' });
  assert.match(new URL(booking.buildWhatsAppRequest('Cozy', quote, 'unavailable')).searchParams.get('text')!, /calendar could not be verified/);
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
