import test from 'node:test';
import assert from 'node:assert/strict';
import { CURRENCIES, FX_CACHE_KEY, FX_MAX_AGE_MS, formatCurrency, getExchangeRates, parseExchangeRates, type CurrencyCode } from '../src/lib/currency.ts';

const now = Date.parse('2026-10-23T12:00:00Z');
const day = 86_400_000;
const payload = (updatedAt = now - 12 * 3_600_000) => ({
  result: 'success', base_code: 'THB',
  time_last_update_unix: updatedAt / 1000,
  time_next_update_unix: (updatedAt + day) / 1000,
  rates: { THB: 1, USD: 0.03, EUR: 0.027, GBP: 0.023, AUD: 0.045, CAD: 0.041, RUB: 2.4, CNY: 0.21 },
});
const memoryStorage = (cached?: unknown) => {
  const values = new Map<string, string>();
  if (cached !== undefined) values.set(FX_CACHE_KEY, JSON.stringify(cached));
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
};
const offline = async (): Promise<Response> => { throw new Error('Offline'); };

test('the selector supports local baht and seven foreign currencies', () => {
  assert.deepEqual(CURRENCIES.map(currency => currency.code), ['THB', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'RUB', 'CNY']);
});

test('the THB feed is validated and preserves the provider update date', () => {
  const rates = parseExchangeRates(payload(), now);
  assert.equal(rates.updatedAt, now - 12 * 3_600_000);
  assert.equal(rates.nextUpdateAt, now + 12 * 3_600_000);
  assert.equal(rates.rates.USD, 0.03);
});

test('invalid, partial, nonpositive and wrong-base FX feeds cannot become conversions', () => {
  for (const invalid of [null, [], {}, { ...payload(), result: 'error' }, { ...payload(), base_code: 'USD' },
    { ...payload(), rates: {} }, { ...payload(), rates: { ...payload().rates, THB: 2 } },
    ...[0, -1, Infinity, NaN, '0.03', undefined].map(USD => ({ ...payload(), rates: { ...payload().rates, USD } })),
    { ...payload(), time_last_update_unix: '1792713600' },
    { ...payload(), time_next_update_unix: payload().time_last_update_unix },
    payload(now + day), payload(now - FX_MAX_AGE_MS - 1_000),
  ]) assert.throws(() => parseExchangeRates(invalid, now), /exchange|rate|date|currency/i);
});

test('fresh cache avoids another request and new rates are cached after a successful fetch', async () => {
  const storage = memoryStorage(payload());
  let calls = 0;
  const fetcher = async () => { calls++; return new Response(JSON.stringify(payload())); };
  assert.equal((await getExchangeRates({ storage, fetcher, now })).status, 'ready');
  assert.equal(calls, 0);
  const empty = memoryStorage();
  const result = await getExchangeRates({ storage: empty, fetcher, now });
  assert.equal(result.status, 'ready');
  assert.equal(result.snapshot?.rates.CNY, 0.21);
  assert.equal(calls, 1);
  assert.ok(empty.getItem(FX_CACHE_KEY));
});

test('a failed refresh retains usable saved rates with their original date', async () => {
  const old = payload(now - 2 * day);
  for (const fetcher of [offline, async () => new Response('Rate limited', { status: 429 }), async () => new Response('{invalid'), async () => new Response(JSON.stringify({ ...payload(), rates: {} }))]) {
    const result = await getExchangeRates({ storage: memoryStorage(old), fetcher, now });
    assert.equal(result.status, 'saved');
    assert.equal(result.snapshot?.updatedAt, old.time_last_update_unix * 1000);
  }
});

test('missing, corrupt or expired cache falls back to THB when FX cannot be fetched', async () => {
  const corrupt = { getItem: () => '{invalid', setItem: () => {} };
  const blockedStorage = { getItem: () => { throw new Error('Blocked'); }, setItem: () => { throw new Error('Blocked'); } };
  for (const storage of [memoryStorage(), memoryStorage(payload(now - FX_MAX_AGE_MS - 1_000)), corrupt, blockedStorage]) {
    const result = await getExchangeRates({ storage, fetcher: offline, now });
    assert.equal(result.status, 'unavailable');
    assert.equal(result.snapshot, null);
    assert.equal(formatCurrency(1500, 'USD', result.snapshot), '฿1,500');
  }
});

test('FX requests time out even if the transport never responds', async () => {
  let signal: AbortSignal | undefined;
  const result = await getExchangeRates({ now, timeoutMs: 5, fetcher: async (_url, init) => {
    signal = init?.signal as AbortSignal;
    return new Promise<Response>(() => {});
  } });
  assert.equal(result.status, 'unavailable');
  assert.equal(signal?.aborted, true);
});

test('storage restrictions do not discard a successful network conversion', async () => {
  const storage = { getItem: () => null, setItem: () => { throw new Error('Quota'); } };
  const result = await getExchangeRates({ now, storage, fetcher: async () => new Response(JSON.stringify(payload())) });
  assert.equal(result.status, 'ready');
});

test('converted totals and small utility charges remain readable without mutating THB accounting', () => {
  const snapshot = parseExchangeRates(payload(), now);
  assert.equal(formatCurrency(1500, 'THB', snapshot), '฿1,500');
  assert.equal(formatCurrency(1500, 'USD', snapshot), 'USD 45');
  assert.equal(formatCurrency(6, 'USD', snapshot), 'USD 0.18');
  assert.equal(formatCurrency(55, 'EUR', snapshot), 'EUR 1.49');
  assert.equal(formatCurrency(3300, 'THB', snapshot, true), '3.3k');
  assert.equal(formatCurrency(3300, 'USD', snapshot, true), '99');
  for (const currency of CURRENCIES) assert.doesNotMatch(formatCurrency(4500, currency.code as CurrencyCode, snapshot), /NaN|Infinity/);
  assert.equal(snapshot.rates.THB, 1);
});
