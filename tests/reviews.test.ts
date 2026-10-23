import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { properties } from '../src/data/properties.ts';

const dataUrl = new URL('../src/data/reviews.ts', import.meta.url);
const pageUrl = new URL('../src/pages/reviews.astro', import.meta.url);
const loadReviews = async () => {
  assert.ok(existsSync(dataUrl), 'The verified review dataset must exist');
  return import('../src/data/reviews.ts');
};

test('ratings preserve the live Airbnb totals for each individual apartment', async () => {
  const { reviewListings, REVIEWS_CHECKED_AT } = await loadReviews();
  assert.equal(REVIEWS_CHECKED_AT, '2026-10-23');
  assert.deepEqual(reviewListings.map(({ propertyId, rating, reviewCount }) => ({ propertyId, rating, reviewCount })), [
    { propertyId: 'bright-1br-rawai-beach', rating: 4.78, reviewCount: 18 },
    { propertyId: 'cozy-1br-rawai-beach', rating: 4.71, reviewCount: 14 },
  ]);
  for (const listing of reviewListings) {
    assert.ok(listing.rating > 0 && listing.rating <= 5);
    assert.ok(Number.isInteger(listing.reviewCount) && listing.reviewCount >= listing.excerpts.length);
  }
});

test('review sources belong to their apartment and never lend a rating to the pair', async () => {
  const { reviewListings } = await loadReviews();
  assert.equal(new Set(reviewListings.map(listing => listing.propertyId)).size, reviewListings.length);
  for (const listing of reviewListings) {
    const property = properties.find(item => item.slug === listing.propertyId);
    assert.ok(property);
    assert.equal(property.bedrooms, 1);
    assert.equal(listing.sourceUrl, `${property.airbnbUrl}/reviews`);
    assert.equal(new URL(listing.sourceUrl).pathname, `/rooms/${listing.airbnbListingId}/reviews`);
    assert.equal(new URL(listing.sourceUrl).origin, 'https://www.airbnb.com');
  }
});

test('public review records contain only initials and the permitted source fields', async () => {
  const { reviewListings } = await loadReviews();
  for (const listing of reviewListings) {
    assert.deepEqual(Object.keys(listing).sort(), ['airbnbListingId', 'excerpts', 'propertyId', 'rating', 'reviewCount', 'shortName', 'sourceUrl'].sort());
    for (const excerpt of listing.excerpts) {
      assert.deepEqual(Object.keys(excerpt).sort(), ['guestInitials', 'id', 'publishedMonth', 'quote', 'rating', 'translatedByAirbnb'].sort());
      assert.match(excerpt.guestInitials, /^[A-Z]\.(?: [A-Z]\.)?$/);
      assert.doesNotMatch(excerpt.quote, /https?:|www\.|@|<|>|\r|\n/);
      assert.equal(excerpt.quote, excerpt.quote.trim());
    }
  }
});

test('each selected review retains its verified ID, month, rating and translation flag', async () => {
  const { reviewListings, REVIEWS_CHECKED_AT } = await loadReviews();
  const expected = [
    ['1660656235230149014', 'Y.', '2026-04', 5, true],
    ['1706973743425704242', 'Y.', '2026-06', 5, false],
    ['1341768971058083244', 'O.', '2025-01', 5, true],
    ['1793129636294950373', 'D.', '2026-10', 5, true],
    ['1663576174412676857', 'J. M.', '2026-04', 5, false],
    ['1227979530876346094', 'V.', '2024-08', 5, false],
  ];
  const excerpts = reviewListings.flatMap(listing => listing.excerpts);
  assert.equal(new Set(excerpts.map(excerpt => excerpt.id)).size, 6);
  assert.deepEqual(excerpts.map(excerpt => [excerpt.id, excerpt.guestInitials, excerpt.publishedMonth, excerpt.rating, excerpt.translatedByAirbnb]), expected);
  for (const excerpt of excerpts) {
    assert.match(excerpt.publishedMonth, /^\d{4}-(0[1-9]|1[0-2])$/);
    assert.ok(excerpt.publishedMonth <= REVIEWS_CHECKED_AT.slice(0, 7));
  }
});

test('each listing has three short excerpts within its 25-word quotation budget', async () => {
  const { reviewListings } = await loadReviews();
  for (const listing of reviewListings) {
    assert.equal(listing.excerpts.length, 3);
    const totalWords = listing.excerpts.flatMap(excerpt => excerpt.quote.split(/\s+/)).length;
    assert.ok(totalWords > 0 && totalWords <= 25, `${listing.shortName}: ${totalWords} quoted words`);
    const digest = createHash('sha256').update(listing.excerpts.map(excerpt => excerpt.quote).join('\n')).digest('hex');
    assert.equal(digest, listing.propertyId === 'bright-1br-rawai-beach'
      ? '1a9bbccdc850818cd020a9f33859eb928984276bed56ba7baac1ba41b07a1172'
      : '7af13c3c4f124e2f071128c608a8bbc91b3c33ad6740aaa9a65503b854db2836', 'Excerpts must preserve the verified wording');
  }
});

test('the review page identifies selections and adds no rating schema or client data island', async () => {
  assert.ok(existsSync(pageUrl), 'The static reviews page must exist');
  const page = await readFile(pageUrl, 'utf8');
  assert.match(page, /Selected guest highlights/);
  assert.match(page, /names abbreviated/i);
  assert.match(page, /Translated by Airbnb/);
  assert.match(page, /Read all .*reviews on Airbnb/);
  assert.match(page, /id=\{listing\.propertyId\}/);
  assert.doesNotMatch(page, /AggregateRating|['"]@type['"]\s*:\s*['"]Review['"]|client:|<script|set:html/);
});
