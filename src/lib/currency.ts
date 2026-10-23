export type CurrencyCode = 'THB' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'RUB' | 'CNY';
export const CURRENCIES: { code: CurrencyCode; name: string }[] = [
  { code: 'THB', name: 'Thai baht' },
  { code: 'USD', name: 'US dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British pound' },
  { code: 'AUD', name: 'Australian dollar' },
  { code: 'CAD', name: 'Canadian dollar' },
  { code: 'RUB', name: 'Russian ruble' },
  { code: 'CNY', name: 'Chinese yuan' },
];
export const FX_CACHE_KEY = 'title-v-fx-v1';
export const FX_MAX_AGE_MS = 72 * 3_600_000;
export const FX_ENDPOINT = 'https://open.er-api.com/v6/latest/THB';
const DAY_MS = 86_400_000;
type RateStorage = Pick<Storage, 'getItem' | 'setItem'>;
type RateFetcher = (url: string, init?: RequestInit) => Promise<Pick<Response, 'ok' | 'json'>>;
export type ExchangeSnapshot = { updatedAt: number; nextUpdateAt: number; rates: Record<CurrencyCode, number> };
export type ExchangeResult = { status: 'ready' | 'saved' | 'unavailable'; snapshot: ExchangeSnapshot | null };

/** Reject invalid or outdated data before it can affect any displayed price. */
export function parseExchangeRates(payload: unknown, now = Date.now()): ExchangeSnapshot {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid exchange-rate response.');
  const data = payload as Record<string, unknown>;
  if (data.result !== 'success' || data.base_code !== 'THB') throw new Error('Invalid exchange-rate currency.');
  const updatedAt = typeof data.time_last_update_unix === 'number' ? data.time_last_update_unix * 1000 : NaN;
  const nextUpdateAt = typeof data.time_next_update_unix === 'number' ? data.time_next_update_unix * 1000 : NaN;
  if (!Number.isSafeInteger(updatedAt) || !Number.isSafeInteger(nextUpdateAt)
    || updatedAt <= 0 || updatedAt > now + 300_000 || now - updatedAt >= FX_MAX_AGE_MS
    || nextUpdateAt <= updatedAt || nextUpdateAt - updatedAt > 2 * DAY_MS) {
    throw new Error('Invalid or expired exchange-rate date.');
  }
  const inputRates = data.rates as Record<string, unknown> | undefined;
  const rates = {} as Record<CurrencyCode, number>;
  for (const { code } of CURRENCIES) {
    const value = inputRates?.[code];
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new Error('Invalid exchange rate.');
    rates[code] = value;
  }
  if (rates.THB !== 1) throw new Error('Invalid base-currency exchange rate.');
  return { updatedAt, nextUpdateAt, rates };
}

function beforeNextUpdate(snapshot: ExchangeSnapshot, now: number): boolean {
  return now < snapshot.nextUpdateAt && now - snapshot.updatedAt < DAY_MS;
}

/** Runs in the browser; no key, backend, or bundled exchange-rate data. */
export async function getExchangeRates({ storage, fetcher = fetch, now = Date.now(), timeoutMs = 5000 }: {
  storage?: RateStorage; fetcher?: RateFetcher; now?: number; timeoutMs?: number;
} = {}): Promise<ExchangeResult> {
  let previous: ExchangeSnapshot | null = null;
  try {
    const saved = storage?.getItem(FX_CACHE_KEY);
    if (saved) previous = parseExchangeRates(JSON.parse(saved), now);
  } catch { /* Storage may be disabled, corrupt, or expired. */ }
  if (previous && beforeNextUpdate(previous, now)) return { status: 'ready', snapshot: previous };

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(new Error('Exchange-rate request timed out.')); }, timeoutMs);
    });
    const snapshot = await Promise.race([
      (async () => {
        const response = await fetcher(FX_ENDPOINT, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
        if (!response.ok) throw new Error('Exchange rates are unavailable.');
        return parseExchangeRates(await response.json(), now);
      })(),
      timeout,
    ]);
    try {
      storage?.setItem(FX_CACHE_KEY, JSON.stringify({
        result: 'success', base_code: 'THB',
        time_last_update_unix: snapshot.updatedAt / 1000,
        time_next_update_unix: snapshot.nextUpdateAt / 1000,
        rates: snapshot.rates,
      }));
    } catch { /* A storage restriction does not invalidate the fetched rates. */ }
    return { status: beforeNextUpdate(snapshot, now) ? 'ready' : 'saved', snapshot };
  } catch {
    return { status: previous ? 'saved' : 'unavailable', snapshot: previous };
  } finally {
    clearTimeout(timer);
  }
}

/** Display-only conversion. Quote calculations and requests always retain integer THB. */
export function formatCurrency(amountTHB: number, currency: CurrencyCode, snapshot: ExchangeSnapshot | null, compact = false): string {
  const rate = snapshot?.rates[currency];
  const code = currency === 'THB' || !rate ? 'THB' : currency;
  const amount = code === 'THB' ? amountTHB : amountTHB * rate!;
  if (compact) return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(amount).toLowerCase();
  const digits = code !== 'THB' && amount !== 0 && Math.abs(amount) < 10 ? 2 : 0;
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const number = new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(rounded);
  return code === 'THB' ? `฿${number}` : `${code} ${number}`;
}
