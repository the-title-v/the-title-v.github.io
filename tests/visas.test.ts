import test from 'node:test';
import assert from 'node:assert/strict';
import { getVisaAdvice } from '../src/lib/visas';
import { visaCountries, popularVisaCountries, otherVisaCountries, visaSources } from '../src/data/visas';

test('the September 2026 tourism scheme grants 30 days, not the superseded 60 days', () => {
  for (const code of ['GB', 'US', 'CA', 'DE', 'AU', 'IN', 'FR', 'UA', 'TW', 'FJ', 'KG']) {
    const advice = getVisaAdvice(code);
    assert.equal(advice.kind, 'visa-exempt', code);
    assert.equal(advice.days, 30, code);
    assert.equal(advice.basis, 'tourism-scheme', code);
  }
});

test('bilateral passports retain their separate 14, 30 and 90 day routes', () => {
  for (const [codes, days] of [
    [['KH', 'MM'], 14],
    [['CN', 'HK', 'KZ', 'LA', 'MO', 'MN', 'RU', 'TL', 'VN'], 30],
    [['AR', 'BR', 'CL', 'PE', 'KR'], 90],
  ] as const) {
    for (const code of codes) {
      const advice = getVisaAdvice(code);
      assert.equal(advice.kind, 'visa-exempt', code);
      assert.equal(advice.days, days, code);
      assert.equal(advice.basis, 'bilateral', code);
    }
  }
});

test('short exemptions and paid Visa on Arrival remain distinct', () => {
  for (const code of ['MU', 'SC']) {
    assert.equal(getVisaAdvice(code).kind, 'visa-exempt');
    assert.equal(getVisaAdvice(code).days, 15);
  }
  for (const code of ['AZ', 'BY', 'RS']) {
    assert.equal(getVisaAdvice(code).kind, 'visa-on-arrival');
    assert.equal(getVisaAdvice(code).days, 15);
  }
});

test('former exemption and VOA passports now require an advance application', () => {
  for (const code of ['UZ', 'AM', 'MX', 'LK', 'PK', 'MD']) {
    const advice = getVisaAdvice(code);
    assert.equal(advice.kind, 'visa-required', code);
    assert.equal(advice.days, undefined);
  }
});

test('Myanmar airport restriction and Chinese cumulative limit are surfaced', () => {
  assert.match(getVisaAdvice('MM').notes.join(' '), /international airports only/i);
  assert.match(getVisaAdvice('CN').notes.join(' '), /90 days in any 180-day period/i);
});

test('blank, unknown and special documents never receive a visa-free claim', () => {
  assert.equal(getVisaAdvice('').kind, 'unselected');
  for (const code of ['OTHER', 'ZZ', 'gb', ' GB ', '__proto__', 'constructor']) {
    const advice = getVisaAdvice(code);
    assert.equal(advice.kind, 'check', code);
    assert.equal(advice.days, undefined, code);
  }
  assert.equal(getVisaAdvice('TH').kind, 'thai');
});

test('country selector has ten popular choices then a complete non-duplicated alphabetic list', () => {
  assert.equal(popularVisaCountries.length, 10);
  const all = [...popularVisaCountries, ...otherVisaCountries];
  assert.equal(new Set(all.map(country => country.code)).size, all.length);
  assert.equal(all.length, visaCountries.length);
  assert.ok(all.length >= 199, 'includes all 195 widely recognised states plus Hong Kong, Macao, Taiwan and Kosovo');
  assert.deepEqual(otherVisaCountries.map(country => country.name), otherVisaCountries.map(country => country.name).sort((a, b) => a.localeCompare(b, 'en')));
  for (const code of ['AF', 'VA', 'PS', 'XK', 'HK', 'MO', 'TW', 'SS', 'TH']) assert.ok(all.some(country => country.code === code), code);
});

test('every selected ordinary passport has a deliberate route and official source', () => {
  for (const country of visaCountries) {
    const advice = getVisaAdvice(country.code);
    assert.notEqual(advice.kind, 'unselected', country.name);
    assert.notEqual(advice.kind, 'check', country.name);
  }
  for (const source of Object.values(visaSources)) {
    assert.match(new URL(source).hostname, /(^|\.)(go\.th|thaiembassy\.org)$/);
  }
});

// Server rendering checks the same component that Astro ships as a static island.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import VisaFinder from '../src/components/VisaFinder';

test('DTV stays a conditional application route rather than a citizenship entitlement', () => {
  const html = renderToStaticMarkup(createElement(VisaFinder, { initialCountry: 'US' }));
  assert.match(html, /Citizenship alone does not establish eligibility/);
  assert.match(html, /500,000/);
  assert.match(html, /permanent residence/);
  assert.match(html, /criminal record/);
  assert.doesNotMatch(html, /you (are eligible|qualify) for (a )?DTV/i);
});

test('unknown travel documents and Thai passports do not display foreign visa eligibility', () => {
  const unknown = renderToStaticMarkup(createElement(VisaFinder, { initialCountry: 'OTHER' }));
  assert.match(unknown, /Check your travel document/);
  assert.doesNotMatch(unknown, /visa-free|days per entry|Visa on Arrival ·/);
  const thai = renderToStaticMarkup(createElement(VisaFinder, { initialCountry: 'TH' }));
  assert.match(thai, /Travelling on a Thai passport/);
  assert.doesNotMatch(thai, /Apply for a Tourist Visa|Destination Thailand Visa/);
});

test('visa-required results give an advance application, while the default makes no entry claim', () => {
  const required = renderToStaticMarkup(createElement(VisaFinder, { initialCountry: 'UZ' }));
  assert.match(required, /Apply before you travel/);
  assert.doesNotMatch(required, /days, visa-free|Visa on Arrival ·/);
  const blank = renderToStaticMarkup(createElement(VisaFinder));
  assert.match(blank, /Choose your passport to see/);
  assert.doesNotMatch(blank, /days, visa-free|Visa on Arrival ·/);
});
