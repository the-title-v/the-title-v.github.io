import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as booking from '../src/lib/booking.ts';
import * as currency from '../src/lib/currency.ts';

const properties = ['bright-1br-rawai-beach', 'cozy-1br-rawai-beach', 'two-adjacent-apartments-title-v-rawai'];
const today = '2026-11-10';
const selection = {
  property: properties[2], checkIn: '2027-05-01', checkOut: '2027-05-29',
  adults: 4, children: 3, guestLinkError: '',
};

test('a copied booking URL restores apartment, dates and guests', () => {
  assert.equal(typeof booking.bookingUrl, 'function');
  assert.equal(typeof booking.readBookingSelection, 'function');
  const url = new URL(booking.bookingUrl('https://example.com/book/', selection, 'EUR'));
  assert.deepEqual(booking.readBookingSelection(url.searchParams, properties, today), selection);
  assert.equal(url.searchParams.get('currency'), 'EUR');
});

test('changing selections preserves unrelated query parameters and the fragment', () => {
  const original = 'https://example.com/book/?utm_source=friend&property=old&checkIn=2027-01-01&checkOut=2027-01-08&guests=2#estimate';
  const url = new URL(booking.bookingUrl(original, selection, 'CAD'));
  assert.equal(url.origin + url.pathname, 'https://example.com/book/');
  assert.equal(url.searchParams.get('utm_source'), 'friend');
  assert.equal(url.hash, '#estimate');
  assert.equal(url.searchParams.get('guests'), null);
  assert.deepEqual(url.searchParams.getAll('property'), [properties[2]]);
  assert.equal(booking.bookingUrl(url.href, selection, 'CAD'), url.href);
});

test('cleared and partially selected dates do not leave old dates in a permalink', () => {
  const original = booking.bookingUrl('https://example.com/book/', selection, 'THB');
  const cleared = new URL(booking.bookingUrl(original, { ...selection, checkIn: '', checkOut: '' }, 'THB'));
  assert.equal(cleared.searchParams.has('checkIn'), false);
  assert.equal(cleared.searchParams.has('checkOut'), false);
  const partial = new URL(booking.bookingUrl(original, { ...selection, checkOut: '' }, 'THB'));
  assert.equal(partial.searchParams.get('checkIn'), selection.checkIn);
  assert.equal(partial.searchParams.has('checkOut'), false);
  assert.equal(booking.readBookingSelection(partial.searchParams, properties, today).checkOut, '');
});

test('shared dates reject impossible, expired, reversed and out-of-horizon values', () => {
  for (const arrival of ['2027-02-30', '2026-11-09', '2027-11-11', '2027-5-01', 'invalid']) {
    const result = booking.readBookingSelection(new URLSearchParams({ checkIn: arrival, checkOut: '2027-05-08' }), properties, today);
    assert.equal(result.checkIn, '', arrival);
    assert.equal(result.checkOut, '', arrival);
  }
  for (const departure of ['2027-02-30', '2027-02-01', '2027-01-31', '2027-11-11', 'invalid']) {
    const result = booking.readBookingSelection(new URLSearchParams({ checkIn: '2027-02-01', checkOut: departure }), properties, today);
    assert.equal(result.checkIn, '2027-02-01');
    assert.equal(result.checkOut, '', departure);
  }
  assert.equal(booking.readBookingSelection(new URLSearchParams('checkIn=2028-02-29&checkOut=2028-03-07'), properties, '2028-01-01').checkIn, '2028-02-29');
});

test('old links keep their occupancy checks until the guest selection is corrected', () => {
  const original = new URL('https://example.com/book/?property=bright-1br-rawai-beach&guests=4');
  const invalid = booking.readBookingSelection(original.searchParams, properties, today);
  assert.match(invalid.guestLinkError, /adults/i);
  const updated = new URL(booking.bookingUrl(original.href, { ...invalid, checkIn: '2027-05-01' }, 'USD'));
  assert.equal(updated.searchParams.get('guests'), '4');
  assert.equal(updated.searchParams.has('adults'), false);
  assert.ok(booking.readBookingSelection(updated.searchParams, properties, today).guestLinkError);
  const corrected = new URL(booking.bookingUrl(updated.href, { ...invalid, guestLinkError: '' }, 'USD'));
  assert.equal(corrected.searchParams.has('guests'), false);
  assert.equal(corrected.searchParams.get('adults'), '2');
});

test('unknown apartments fall back safely and compatible legacy links still restore', () => {
  const fallback = booking.readBookingSelection(new URLSearchParams('property=missing'), properties, today);
  assert.equal(fallback.property, properties[0]);
  assert.equal(fallback.adults, 2);
  assert.equal(fallback.children, 0);
  assert.equal(fallback.guestLinkError, '');
  const legacy = booking.readBookingSelection(new URLSearchParams('property=cozy-1br-rawai-beach&guests=1'), properties, today);
  assert.equal(legacy.property, properties[1]);
  assert.equal(legacy.adults, 1);
});

test('permalink currency takes priority over browser preferences, including explicit THB', () => {
  assert.equal(typeof currency.readDisplayCurrency, 'function');
  assert.equal(currency.readDisplayCurrency('EUR', 'USD'), 'EUR');
  assert.equal(currency.readDisplayCurrency('THB', 'USD'), 'THB');
  assert.equal(currency.readDisplayCurrency(null, 'CAD'), 'CAD');
  assert.equal(currency.readDisplayCurrency('invalid', 'GBP'), 'GBP');
  assert.equal(currency.readDisplayCurrency('invalid', 'invalid'), 'THB');
  assert.equal(currency.readDisplayCurrency(null, null), 'THB');
});
