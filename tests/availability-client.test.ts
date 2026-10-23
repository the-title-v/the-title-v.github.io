import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AVAILABILITY_FRESH_MS,
  AVAILABILITY_REQUEST_TIMEOUT_MS,
  availabilityFreshFor,
  requestAvailability,
  unverifiedAvailability,
  type ClientAvailability,
} from '../src/lib/availability-client.ts';

const PROPERTY = 'bright-1br-rawai-beach';
const NOW = Date.parse('2026-10-23T10:00:00.000Z');
const OLD_BLOCK = { start: '2027-01-04', end: '2027-01-08' };
const NEW_BLOCK = { start: '2027-01-12', end: '2027-01-15' };
const previous: ClientAvailability = {
  status: 'snapshot', blocked: [OLD_BLOCK], checkedAt: new Date(NOW - 3_600_000).toISOString(),
};
const live = (age = 0, blocked = [NEW_BLOCK]) => ({
  status: 'snapshot', blocked, checkedAt: new Date(NOW - age).toISOString(),
});
const json = (body: unknown) => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });

function deadline() {
  let callback: (() => void) | undefined;
  let scheduledMs = 0;
  let cancelled = false;
  return {
    scheduleTimeout: (run: () => void, delay: number) => {
      callback = run;
      scheduledMs = delay;
      return () => { cancelled = true; };
    },
    fire: () => { assert.ok(callback); callback(); },
    get scheduledMs() { return scheduledMs; },
    get cancelled() { return cancelled; },
  };
}

test('freshness expires at the original checkedAt deadline, not one hour after receipt', () => {
  assert.equal(AVAILABILITY_FRESH_MS, 3_600_000);
  assert.equal(availabilityFreshFor(live(3_599_999) as ClientAvailability, NOW), 1);
  assert.equal(availabilityFreshFor(live(3_600_000) as ClientAvailability, NOW), 0);
  assert.equal(availabilityFreshFor(live(7_200_000) as ClientAvailability, NOW), 0);
  assert.equal(availabilityFreshFor(live(-1) as ClientAvailability, NOW), 0);
  assert.equal(availabilityFreshFor({ status: 'unavailable', blocked: [], checkedAt: null }, NOW), 0);
  assert.equal(availabilityFreshFor({ status: 'snapshot', blocked: [], checkedAt: 'not-a-date' }, NOW), 0);
});

test('a successful refresh replaces old blocks and strips all unexpected response metadata', async () => {
  const timer = deadline();
  const result = await requestAvailability(PROPERTY, {
    previous, now: () => NOW, scheduleTimeout: timer.scheduleTimeout,
    fetch: async (url, init) => {
      assert.equal(url, `/availability/${PROPERTY}.json`);
      assert.equal(init?.cache, 'no-store');
      assert.ok(init?.signal);
      return json({ ...live(), blocked: [{ ...NEW_BLOCK, summary: 'Synthetic private metadata' }], privateUrl: 'synthetic-secret' });
    },
  });
  assert.deepEqual(result, live());
  assert.equal(timer.cancelled, true);
  assert.doesNotMatch(JSON.stringify(result), /Synthetic|privateUrl|synthetic-secret|summary/);
});

test('an almost expired cached success retains only its actual remaining freshness', async () => {
  const result = await requestAvailability(PROPERTY, { now: () => NOW, fetch: async () => json(live(3_599_999)) });
  assert.equal(result.status, 'snapshot');
  assert.equal(availabilityFreshFor(result, NOW), 1);
});

test('a browser request deadline resolves as unverified and retains known blocked dates', async () => {
  const timer = deadline();
  let requestSignal: AbortSignal | undefined;
  const pending = requestAvailability(PROPERTY, {
    previous, now: () => NOW, scheduleTimeout: timer.scheduleTimeout,
    fetch: async (_url, init) => { requestSignal = init?.signal as AbortSignal; return new Promise<Response>(() => {}); },
  });
  assert.equal(AVAILABILITY_REQUEST_TIMEOUT_MS, 12_000);
  assert.equal(timer.scheduledMs, 12_000);
  timer.fire();
  const result = await pending;
  assert.equal(result.status, 'unavailable');
  assert.equal(result.checkedAt, null);
  assert.deepEqual(result.blocked, [OLD_BLOCK]);
  assert.equal(requestSignal?.aborted, true);
  assert.equal(timer.cancelled, true);
});

test('the same deadline covers a response body that stalls after headers', async () => {
  const timer = deadline();
  let responseStarted!: () => void;
  const started = new Promise<void>((resolve) => { responseStarted = resolve; });
  const pending = requestAvailability(PROPERTY, {
    previous, now: () => NOW, scheduleTimeout: timer.scheduleTimeout,
    fetch: async (_url, init) => {
      const stream = new ReadableStream({
        start(controller) {
          init?.signal?.addEventListener('abort', () => controller.error(new Error('Synthetic abort')), { once: true });
        },
      });
      responseStarted();
      return new Response(stream);
    },
  });
  await started;
  timer.fire();
  assert.equal((await pending).status, 'unavailable');
});

test('superseded property requests reject as cancellation rather than publishing unavailable state', async () => {
  const controller = new AbortController();
  const timer = deadline();
  let requestSignal: AbortSignal | undefined;
  const pending = requestAvailability(PROPERTY, {
    signal: controller.signal, previous, scheduleTimeout: timer.scheduleTimeout,
    fetch: async (_url, init) => { requestSignal = init?.signal as AbortSignal; return new Promise<Response>(() => {}); },
  });
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(requestSignal?.aborted, true);
  assert.equal(timer.cancelled, true);
});

test('already cancelled requests do not start a fetch', async () => {
  const controller = new AbortController();
  controller.abort();
  let called = false;
  await assert.rejects(requestAvailability(PROPERTY, {
    signal: controller.signal,
    fetch: async () => { called = true; return json(live()); },
  }), { name: 'AbortError' });
  assert.equal(called, false);
});

test('stale or future-dated responses cannot renew snapshot status and retain conservative blocks', async () => {
  for (const age of [3_600_000, 7_200_000, -1]) {
    const result = await requestAvailability(PROPERTY, { previous, now: () => NOW, fetch: async () => json(live(age)) });
    assert.equal(result.status, 'unavailable');
    assert.equal(result.checkedAt, null);
    assert.deepEqual(result.blocked, [OLD_BLOCK, NEW_BLOCK]);
  }
});

test('partial bundle failure merges newly known occupied dates with previously known dates', async () => {
  const result = await requestAvailability('two-adjacent-apartments-title-v-rawai', {
    previous, now: () => NOW,
    fetch: async () => json({ status: 'unavailable', checkedAt: null, blocked: [NEW_BLOCK], message: 'Synthetic upstream error details' }),
  });
  assert.equal(result.status, 'unavailable');
  assert.deepEqual(result.blocked, [OLD_BLOCK, NEW_BLOCK]);
  assert.doesNotMatch(JSON.stringify(result), /Synthetic upstream/);
});

test('malformed response shapes and invalid blocked dates fail closed', async () => {
  const invalid = [
    null,
    [],
    { status: 'snapshot', checkedAt: new Date(NOW).toISOString() },
    { status: 'confirmed', blocked: [], checkedAt: new Date(NOW).toISOString() },
    { status: 'snapshot', blocked: [], checkedAt: null },
    { status: 'snapshot', blocked: [], checkedAt: 'not-a-date' },
    { ...live(), blocked: [{ start: '2027-02-30', end: '2027-03-03' }] },
    { ...live(), blocked: [{ start: '2027-01-08', end: '2027-01-04' }] },
  ];
  for (const response of invalid) {
    const result = await requestAvailability(PROPERTY, { previous, now: () => NOW, fetch: async () => json(response) });
    assert.equal(result.status, 'unavailable');
    assert.deepEqual(result.blocked, [OLD_BLOCK]);
  }
});

test('HTTP, JSON and connection errors retain known blocks without exposing source errors', async () => {
  const fetchers: typeof fetch[] = [
    async () => new Response('Synthetic secret', { status: 503 }),
    async () => new Response('<html>not json</html>'),
    async () => { throw new Error('Synthetic private connection details'); },
  ];
  for (const fetch of fetchers) {
    const result = await requestAvailability(PROPERTY, { previous, now: () => NOW, fetch });
    assert.equal(result.status, 'unavailable');
    assert.deepEqual(result.blocked, [OLD_BLOCK]);
    assert.doesNotMatch(JSON.stringify(result), /Synthetic|secret|connection/);
  }
});

test('unverified state detaches known ranges and never retains an old success timestamp', () => {
  const result = unverifiedAvailability(previous);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.checkedAt, null);
  assert.deepEqual(result.blocked, [OLD_BLOCK]);
  result.blocked[0].start = '2027-01-01';
  assert.equal(previous.blocked[0].start, '2027-01-04');
});


test('unknown property identifiers never request a resource or leak the input', async () => {
  for (const property of ['unknown', '../private', 'https://example.test/feed']) {
    let requested = false;
    const result = await requestAvailability(property, { fetch: async () => { requested = true; return json(live()); } });
    assert.equal(requested, false);
    assert.deepEqual(result, { status: 'unavailable', blocked: [], checkedAt: null });
  }
});

test('an older CDN snapshot cannot reopen nights blocked by a newer known update', async () => {
  const recent = live(5 * 60_000, [OLD_BLOCK]) as ClientAvailability;
  const result = await requestAvailability(PROPERTY, {
    previous: recent, now: () => NOW,
    fetch: async () => json(live(20 * 60_000, [])),
  });
  assert.deepEqual(result, recent);
  assert.notEqual(result.blocked, recent.blocked);
});

test('an older response cannot renew an expired known snapshot', async () => {
  const recent = live(AVAILABILITY_FRESH_MS, [OLD_BLOCK]) as ClientAvailability;
  const result = await requestAvailability(PROPERTY, {
    previous: recent, now: () => NOW,
    fetch: async () => json(live(AVAILABILITY_FRESH_MS + 60_000, [])),
  });
  assert.deepEqual(result, { status: 'unavailable', blocked: [OLD_BLOCK], checkedAt: null });
});

test('a transient failure cannot erase the timestamp used to reject an older CDN update', async () => {
  const recent = live(5 * 60_000, [OLD_BLOCK]) as ClientAvailability;
  const failed = await requestAvailability(PROPERTY, {
    previous: recent, now: () => NOW,
    fetch: async () => new Response('unavailable', { status: 503 }),
  });
  assert.equal(failed.status, 'unavailable');
  const result = await requestAvailability(PROPERTY, {
    previous: failed, lastSuccessful: recent, now: () => NOW,
    fetch: async () => json(live(20 * 60_000, [])),
  });
  assert.deepEqual(result, recent);
});
