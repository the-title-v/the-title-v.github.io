import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BookingWidget from '../src/components/BookingWidget.tsx';

const stays = [
  { slug: 'bright-1br-rawai-beach', name: 'Bright apartment', guests: 4, image: '/bright.webp' },
  { slug: 'cozy-1br-rawai-beach', name: 'Cozy apartment', guests: 4, image: '/cozy.webp' },
  { slug: 'two-adjacent-apartments-title-v-rawai', name: 'Two adjacent apartments', guests: 8, image: '/pair.webp' },
];
const render = () => renderToStaticMarkup(createElement(BookingWidget, { stays }));

test('the booking widget has one inline calendar without a second native date picker', () => {
  const markup = render();
  assert.equal((markup.match(/aria-label="Availability calendar"/g) || []).length, 1);
  assert.doesNotMatch(markup, /type="date"/);
  assert.match(markup, /Choose your dates/);
  assert.match(markup, /aria-label="Choose check-in date"/);
  assert.match(markup, /aria-label="Choose check-out date"/);
});

test('adult and child selectors express the single apartment limits separately', () => {
  const markup = render();
  const adults = markup.match(/<select[^>]*id="booking-adults"[^>]*>(.*?)<\/select>/)?.[1];
  const children = markup.match(/<select[^>]*id="booking-children"[^>]*>(.*?)<\/select>/)?.[1];
  assert.ok(adults, 'Adults have their own selector');
  assert.ok(children, 'Children have their own selector');
  assert.equal((adults.match(/<option/g) || []).length, 2);
  assert.equal((children.match(/<option/g) || []).length, 3);
  assert.match(markup, /14 or under/);
  assert.match(markup, /15\+/);
});

test('the widget communicates arrival and metered utility terms without an owner name', () => {
  const markup = render();
  assert.match(markup, /15:00/);
  assert.match(markup, /12:00/);
  assert.match(markup, /local agent/i);
  assert.match(markup, /55.*m³/);
  assert.match(markup, /6.*kWh/);
  assert.match(markup, /subject to availability.*extra/i);
  assert.doesNotMatch(markup, /PRIVATE_IDENTITY_PLACEHOLDER/i);
});


test('the calendar explains delayed data without claiming automatic Airbnb refreshes', () => {
  const markup = render();
  assert.match(markup, /Loading calendar updates/);
  assert.match(markup, /Calendar data can be delayed/i);
  assert.doesNotMatch(markup, /Checking the Airbnb calendars|update periodically|automatically refresh/i);
});
