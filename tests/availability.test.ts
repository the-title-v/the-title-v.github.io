import assert from 'node:assert/strict';
import test from 'node:test';
import { createAvailabilityService } from '../src/lib/availability.server.ts';

const BRIGHT = 'bright-1br-rawai-beach';
const COZY = 'cozy-1br-rawai-beach';
const BOTH = 'two-adjacent-apartments-title-v-rawai';
const START = Date.parse('2026-10-23T12:00:00.000Z');
const urls = {
  bright: 'https://www.airbnb.com/calendar/ical/101.ics?s=private-bright-token',
  cozy: 'https://www.airbnb.com/calendar/ical/202.ics?s=private-cozy-token',
};
const calendar = (...events: string[]) => ['BEGIN:VCALENDAR', 'VERSION:2.0', ...events, 'END:VCALENDAR'].join('\r\n');
const event = (start: string, end: string) => [
  'BEGIN:VEVENT', `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`,
  'SUMMARY:Private Guest Name', 'DESCRIPTION:Private guest email and reservation', 'UID:private-reservation', 'END:VEVENT',
].join('\r\n');
const feed = (source: string) => new Response(source, { headers: { 'Content-Type': 'text/calendar' } });

test('returns only sanitized blocked dates with the actual successful-fetch timestamp', async () => {
  let now = START;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], now: () => now,
    fetch: async (_url, init) => {
      assert.equal(init?.redirect, 'error');
      assert.ok(init?.signal);
      now += 250;
      return feed(calendar(event('20270104', '20270108')));
    },
  });
  const result = await getAvailability(BRIGHT);
  assert.deepEqual(result, {
    status: 'live', blocked: [{ start: '2027-01-04', end: '2027-01-08' }],
    checkedAt: '2026-10-23T12:00:00.250Z',
  });
  assert.doesNotMatch(JSON.stringify(result), /Private|private|airbnb|https|reservation/);
});

test('caches successful feeds for five minutes without changing their checkedAt time', async () => {
  let now = START;
  let requests = 0;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], now: () => now,
    fetch: async () => { requests++; return feed(calendar(event('20270104', '20270108'))); },
  });
  const first = await getAvailability(BRIGHT);
  now += 299_999;
  assert.deepEqual(await getAvailability(BRIGHT), first);
  assert.equal(requests, 1);
  now += 1;
  assert.equal((await getAvailability(BRIGHT)).checkedAt, new Date(now).toISOString());
  assert.equal(requests, 2);
});

test('never serves a stale success when a refresh fails and retries on the next request', async () => {
  let now = START;
  let fail = false;
  let requests = 0;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], now: () => now,
    fetch: async () => {
      requests++;
      if (fail) throw new Error(`Private upstream failure ${urls.bright}`);
      return feed(calendar(event('20270104', '20270108')));
    },
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'live');
  now += 300_000;
  fail = true;
  const result = await getAvailability(BRIGHT);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.checkedAt, null);
  assert.doesNotMatch(JSON.stringify(result), /token|airbnb|Private upstream/);
  fail = false;
  assert.equal((await getAvailability(BRIGHT)).status, 'live');
  assert.equal(requests, 3);
});

test('combines both calendars with a merged union and the older successful timestamp', async () => {
  let now = START;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], now: () => now,
    fetch: async (url) => String(url).includes('/101.')
      ? feed(calendar(event('20270104', '20270108')))
      : feed(calendar(event('20270107', '20270110'), event('20270120', '20270122'))),
  });
  await getAvailability(BRIGHT);
  now += 1_000;
  const result = await getAvailability(BOTH);
  assert.deepEqual(result, {
    status: 'live',
    blocked: [{ start: '2027-01-04', end: '2027-01-10' }, { start: '2027-01-20', end: '2027-01-22' }],
    checkedAt: new Date(START).toISOString(),
  });
});

test('marks the combination unavailable if either feed fails while retaining known blocked dates', async () => {
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], now: () => START,
    fetch: async (url) => String(url).includes('/101.')
      ? feed(calendar(event('20270104', '20270108')))
      : new Response('upstream failed', { status: 503 }),
  });
  const result = await getAvailability(BOTH);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.checkedAt, null);
  assert.deepEqual(result.blocked, [{ start: '2027-01-04', end: '2027-01-08' }]);
});

test('accepts a valid empty calendar but fails closed on malformed or truncated calendars', async () => {
  for (const source of ['', '<html>upstream login page</html>', 'BEGIN:VCALENDAR\r\nVERSION:2.0',
    calendar('BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20270230\r\nDTEND;VALUE=DATE:20270302\r\nEND:VEVENT')]) {
    const getAvailability = createAvailabilityService({ getFeedUrl: (id) => urls[id], fetch: async () => feed(source) });
    const result = await getAvailability(BRIGHT);
    assert.equal(result.status, 'unavailable');
    assert.equal(result.checkedAt, null);
    assert.deepEqual(result.blocked, []);
  }
  const getAvailability = createAvailabilityService({ getFeedUrl: (id) => urls[id], fetch: async () => feed(calendar()) });
  assert.equal((await getAvailability(BRIGHT)).status, 'live');
});

test('rejects unsupported feed destinations before making any request', async () => {
  const unsafe = [undefined, 'http://www.airbnb.com/calendar/ical/101.ics?s=secret',
    'https://airbnb.com.evil.test/calendar/ical/101.ics?s=secret',
    'https://127.0.0.1/calendar/ical/101.ics', 'https://www.airbnb.com/rooms/101',
    'https://user:password@www.airbnb.com/calendar/ical/101.ics',
    'https://www.airbnb.com:8443/calendar/ical/101.ics',
    'https://www.airbnb.com/calendar/ical/101.ics#fragment',
    'https://www.airbnb.com/calendar/ical/%2E%2E/101.ics'];
  for (const url of unsafe) {
    let requested = false;
    const getAvailability = createAvailabilityService({
      getFeedUrl: () => url,
      fetch: async () => { requested = true; return feed(calendar()); },
    });
    assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
    assert.equal(requested, false);
  }
});

test('allows the exact apex Airbnb hostname for calendar feeds', async () => {
  const getAvailability = createAvailabilityService({
    getFeedUrl: () => 'https://airbnb.com/calendar/ical/101.ics?s=private',
    fetch: async () => feed(calendar()),
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'live');
});

test('does not follow redirects or disclose their locations', async () => {
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id],
    fetch: async (_url, init) => {
      assert.equal(init?.redirect, 'error');
      return new Response(null, { status: 302, headers: { Location: 'http://127.0.0.1/private' } });
    },
  });
  const result = await getAvailability(BRIGHT);
  assert.equal(result.status, 'unavailable');
  assert.doesNotMatch(JSON.stringify(result), /127\.0\.0\.1|private|Location/);
});

test('limits streamed response bytes even when content-length is missing', async () => {
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], maxBytes: 64,
    fetch: async () => feed(calendar(event('20270104', '20270108'))),
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
});

test('rejects oversized content-length before attempting to parse a small body', async () => {
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], maxBytes: 64,
    fetch: async () => new Response(calendar(), { headers: { 'Content-Length': '10000000' } }),
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
});

test('times out a stalled fetch, aborts it, and does not cache the failure', async () => {
  let aborted = false;
  let requests = 0;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], timeoutMs: 15,
    fetch: async (_url, init) => {
      requests++;
      if (requests > 1) return feed(calendar());
      init?.signal?.addEventListener('abort', () => { aborted = true; }, { once: true });
      return new Promise<Response>(() => {});
    },
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
  assert.equal(aborted, true);
  assert.equal((await getAvailability(BRIGHT)).status, 'live');
});

test('shares in-flight requests for the same feed across individual and combined requests', async () => {
  let requests = 0;
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id],
    fetch: async () => { requests++; await ready; return feed(calendar()); },
  });
  const responses = [getAvailability(BRIGHT), getAvailability(BRIGHT), getAvailability(COZY), getAvailability(BOTH)];
  release();
  assert.ok((await Promise.all(responses)).every((result) => result.status === 'live'));
  assert.equal(requests, 2);
});

test('returns detached ranges so consumers cannot poison cached availability', async () => {
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], fetch: async () => feed(calendar(event('20270104', '20270108'))),
  });
  const first = await getAvailability(BRIGHT);
  assert.equal(first.status, 'live');
  first.blocked[0]!.start = '1999-01-01';
  first.blocked.push({ start: '1999-01-01', end: '1999-01-02' });
  assert.deepEqual((await getAvailability(BRIGHT)).blocked, [{ start: '2027-01-04', end: '2027-01-08' }]);
});

test('rejects unknown properties without fetching private feeds', async () => {
  let requests = 0;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], fetch: async () => { requests++; return feed(calendar()); },
  });
  const result = await getAvailability('unknown-property');
  assert.equal(result.status, 'unavailable');
  assert.equal(result.checkedAt, null);
  assert.equal(requests, 0);
});

test('reads feed configuration at request time and fails closed if a feed is removed', async () => {
  let configured: string | undefined;
  let requests = 0;
  const getAvailability = createAvailabilityService({
    getFeedUrl: () => configured,
    fetch: async () => { requests++; return feed(calendar()); },
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
  configured = urls.bright;
  assert.equal((await getAvailability(BRIGHT)).status, 'live');
  configured = undefined;
  assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
  assert.equal(requests, 1);
});

test('cancels rejected upstream response bodies instead of leaving them open', async () => {
  let cancelled = false;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id],
    fetch: async () => new Response(new ReadableStream({ cancel() { cancelled = true; } }), { status: 503 }),
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
  assert.equal(cancelled, true);
});

test('times out and cancels a stalled calendar body after headers arrive', async () => {
  let cancelled = false;
  const getAvailability = createAvailabilityService({
    getFeedUrl: (id) => urls[id], timeoutMs: 15,
    fetch: async () => new Response(new ReadableStream({ cancel() { cancelled = true; } })),
  });
  assert.equal((await getAvailability(BRIGHT)).status, 'unavailable');
  assert.equal(cancelled, true);
});

test('API rejects missing or unknown properties with no-store JSON', async () => {
  const { GET } = await import('../src/pages/api/availability.ts');
  for (const query of ['', '?property=unknown-property']) {
    const response = await GET({ url: new URL(`https://example.test/api/availability/${query}`) } as Parameters<typeof GET>[0]);
    assert.equal(response.status, 400);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    assert.equal((await response.json()).status, 'unavailable');
  }
});

test('API exposes a configured-property failure as unavailable without private details', async () => {
  const { GET } = await import('../src/pages/api/availability.ts');
  const previousBright = process.env.AIRBNB_ICAL_BRIGHT;
  const previousCozy = process.env.AIRBNB_ICAL_COZY;
  delete process.env.AIRBNB_ICAL_BRIGHT;
  delete process.env.AIRBNB_ICAL_COZY;
  try {
    const response = await GET({ url: new URL(`https://example.test/api/availability/?property=${BOTH}`) } as Parameters<typeof GET>[0]);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.equal(body.status, 'unavailable');
    assert.equal(body.checkedAt, null);
    assert.deepEqual(body.blocked, []);
    assert.doesNotMatch(JSON.stringify(body), /AIRBNB|token|https|\.ics|undefined/);
  } finally {
    if (previousBright !== undefined) process.env.AIRBNB_ICAL_BRIGHT = previousBright;
    if (previousCozy !== undefined) process.env.AIRBNB_ICAL_COZY = previousCozy;
  }
});
