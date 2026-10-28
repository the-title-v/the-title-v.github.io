import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { selectWebAnalytics, webAnalyticsLoader } from '../src/lib/web-analytics';
import { verifyWebAnalyticsHtml } from '../scripts/lib/web-analytics.mjs';

const github = 'the-title-v.github.io';
const cloudflare = 'stay.the-title-v.workers.dev';
const githubToken = 'a'.repeat(32);
const cloudflareToken = 'b'.repeat(32);
const registrations = { [github]: githubToken, [cloudflare]: cloudflareToken };

test('each exact production hostname selects its own registration', () => {
  assert.deepEqual(selectWebAnalytics(new URL(`https://${github}/book/?stay=7`), registrations, true), { hostname: github, token: githubToken });
  assert.deepEqual(selectWebAnalytics(new URL(`https://${cloudflare}/`), registrations, true), { hostname: cloudflare, token: cloudflareToken });
});

test('development and unknown origins do not enable analytics or require tokens', () => {
  for (const origin of ['http://localhost:4321', 'http://127.0.0.1:4321', 'https://preview.example', `https://preview.${cloudflare}`, `https://${github}.example`]) {
    assert.equal(selectWebAnalytics(new URL(origin), registrations, true), null);
  }
  assert.equal(selectWebAnalytics(undefined, registrations, true), null);
  assert.equal(selectWebAnalytics(new URL(`https://${github}`), {}, false), null);
  assert.equal(selectWebAnalytics(new URL(`https://${github}`), registrations, false), null);
});

test('production registration must contain exactly 32 hexadecimal characters', () => {
  for (const value of [undefined, null, 123, '', 'c'.repeat(31), 'd'.repeat(33), 'g'.repeat(32), ` ${githubToken}`, { token: githubToken }]) {
    assert.throws(() => selectWebAnalytics(new URL(`https://${github}`), { [github]: value }, true), error => {
      assert(error instanceof Error);
      assert.match(error.message, /Cloudflare Web Analytics.*32 hexadecimal/i);
      assert(error.message.includes(github));
      if (typeof value === 'string' && value.length > 20) assert(!error.message.includes(value));
      return true;
    });
  }
  for (const config of [null, [], false, 'invalid']) assert.throws(() => selectWebAnalytics(new URL(`https://${github}`), config, true));
  assert.equal(selectWebAnalytics(new URL(`https://${github}`), { [github]: 'ABCDEF0123456789ABCDEF0123456789' }, true)?.token, 'ABCDEF0123456789ABCDEF0123456789');
});

function executeLoader(hostname: string) {
  const scripts: Array<{ type?: string; src?: string; dataset: Record<string, string> }> = [];
  const document = {
    createElement(tag: string) { assert.equal(tag, 'script'); return { dataset: {} }; },
    head: { appendChild(script: typeof scripts[number]) { scripts.push(script); } },
  };
  const config = selectWebAnalytics(new URL(`https://${github}`), registrations, true)!;
  runInNewContext(webAnalyticsLoader(config), { location: { hostname }, document });
  return scripts;
}

test('runtime host guard keeps production builds quiet on localhost and other hosts', () => {
  for (const host of ['localhost', '127.0.0.1', cloudflare, `preview.${github}`, `${github}.example`]) {
    assert.deepEqual(executeLoader(host), []);
  }
});

test('matching runtime hostname loads one official module beacon with SPA monitoring disabled', () => {
  const scripts = executeLoader(github);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://static.cloudflareinsights.com/beacon.min.js');
  assert.equal(scripts[0].type, 'module');
  assert.deepEqual(JSON.parse(scripts[0].dataset.cfBeacon), { token: githubToken, spa: false });
});

test('HTML verifier requires exactly the configured guarded loader on every production page', () => {
  const analytics = selectWebAnalytics(new URL(`https://${github}`), registrations, true)!;
  const script = `<script data-web-analytics>${webAnalyticsLoader(analytics)}</script>`;
  const page = (content: string) => `<!doctype html><html lang="en"><head><meta charset="UTF-8">${content}</head><body></body></html>`;
  verifyWebAnalyticsHtml(page(script), analytics, '404.html');
  for (const html of ['', script + script, script.replace(githubToken, cloudflareToken), script.replace('!==', '==='), script.replace('false', 'true'), script + '<script src="https://static.cloudflareinsights.com/beacon.min.js"></script>']) {
    assert.throws(() => verifyWebAnalyticsHtml(page(html), analytics, '404.html'), /analytics.*404.html/i);
  }
});

test('HTML verifier rejects loaders that browsers cannot execute', () => {
  const analytics = selectWebAnalytics(new URL(`https://${github}`), registrations, true)!;
  const script = `<script data-web-analytics>${webAnalyticsLoader(analytics)}</script>`;
  const page = (content: string) => `<!doctype html><html lang="en"><head><meta charset="UTF-8">${content}</head><body></body></html>`;
  for (const content of [
    `<!-- ${script} -->`,
    script.replace('<script ', '<script type="application/json" '),
    script.replace('<script ', '<script src="/unrelated.js" '),
    script.replace('<script ', '<script nomodule '),
    `<template>${script}</template>`,
    `<template><template></template>${script}</template>`,
    `<noscript>${script}</noscript>`,
    `<textarea>${script}</textarea>`,
    `<template><head>${script}</head></template>`,
  ]) {
    assert.throws(() => verifyWebAnalyticsHtml(page(content), analytics, '404.html'), /analytics.*404.html/i);
  }
});

test('HTML verifier rejects analytics on unknown origins', () => {
  verifyWebAnalyticsHtml('<html></html>', null, 'index.html');
  assert.throws(() => verifyWebAnalyticsHtml('<script src="https://static.cloudflareinsights.com/beacon.min.js"></script>', null, 'index.html'), /analytics/i);
});
