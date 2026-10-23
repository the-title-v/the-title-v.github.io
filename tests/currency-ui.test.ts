import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import CurrencyRates from '../src/components/CurrencyRates.tsx';

test('the public rates page leaves the historical pricing rationale in internal documentation', async () => {
  const source = await readFile(new URL('../src/pages/rates.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /historical stays|recorded income|How the reference was calculated/i);
  assert.match(source, /7-night minimum/);
});

test('the public rate table presents the three winter periods without overlapping base dates', () => {
  const markup = renderToStaticMarkup(createElement(CurrencyRates));
  assert.match(markup, /Peak season<\/th><td>1–22 Dec &amp; Feb<\/td><td>฿3,300/);
  assert.match(markup, /Festive season<\/th><td>23 Dec–12 Jan<\/td><td>฿4,500/);
  assert.match(markup, /January peak<\/th><td>13–31 Jan<\/td><td>฿4,000/);
  assert.doesNotMatch(markup, /Dec–Feb|historical stays|recorded income/i);
});
