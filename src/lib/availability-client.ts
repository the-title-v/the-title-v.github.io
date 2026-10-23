import { mergeBlockedRanges, type BlockedDateRange } from './calendar';
import { AVAILABILITY_FRESH_MS, AVAILABILITY_PROPERTIES } from './availability-policy';

export { AVAILABILITY_FRESH_MS, AVAILABILITY_REFRESH_MS } from './availability-policy';
export const AVAILABILITY_REQUEST_TIMEOUT_MS = 12_000;

export type ClientAvailability = {
  status: 'snapshot' | 'unavailable';
  blocked: BlockedDateRange[];
  checkedAt: string | null;
};

type RequestOptions = {
  signal?: AbortSignal;
  previous?: ClientAvailability;
  lastSuccessful?: ClientAvailability;
  fetch?: typeof globalThis.fetch;
  now?: () => number;
  timeoutMs?: number;
  scheduleTimeout?: (callback: () => void, delayMs: number) => () => void;
};

/** The import's successful-check time owns the deadline, including cache hits. */
export function availabilityFreshFor(value: ClientAvailability, now = Date.now()): number {
  if (value.status !== 'snapshot' || typeof value.checkedAt !== 'string') return 0;
  const checkedAt = Date.parse(value.checkedAt);
  const age = now - checkedAt;
  if (!Number.isFinite(age) || age < 0 || age >= AVAILABILITY_FRESH_MS) return 0;
  return AVAILABILITY_FRESH_MS - age;
}

/** Failed refreshes retain known occupied dates, but never retain a live claim. */
export function unverifiedAvailability(...values: (ClientAvailability | null | undefined)[]): ClientAvailability {
  return {
    status: 'unavailable',
    blocked: mergeBlockedRanges(values.flatMap((value) => value?.blocked ?? [])),
    checkedAt: null,
  };
}

function parseResponse(value: unknown): ClientAvailability {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid calendar response');
  const candidate = value as Record<string, unknown>;
  if (!['snapshot', 'unavailable'].includes(candidate.status as string) || !Array.isArray(candidate.blocked)) {
    throw new Error('Invalid calendar response');
  }
  const blocked = mergeBlockedRanges(candidate.blocked.map((range: unknown) => {
    if (!range || typeof range !== 'object') throw new Error('Invalid calendar range');
    const { start, end } = range as Record<string, unknown>;
    if (typeof start !== 'string' || typeof end !== 'string') throw new Error('Invalid calendar range');
    return { start, end };
  }));
  if (candidate.status === 'unavailable') return { status: 'unavailable', blocked, checkedAt: null };
  if (typeof candidate.checkedAt !== 'string' || !Number.isFinite(Date.parse(candidate.checkedAt))) {
    throw new Error('Invalid calendar timestamp');
  }
  // Snapshots contain canonical UTC timestamps; reject silently normalized dates.
  if (new Date(candidate.checkedAt).toISOString() !== candidate.checkedAt) throw new Error('Invalid calendar timestamp');
  return { status: 'snapshot', blocked, checkedAt: candidate.checkedAt };
}

const cancelledRequest = () => new DOMException('Calendar request was cancelled.', 'AbortError');
const scheduleTimeout = (callback: () => void, delayMs: number) => {
  const timer = setTimeout(callback, delayMs);
  return () => clearTimeout(timer);
};

/**
 * Fetch and body parsing share a browser-side deadline. Transport and validation
 * failures resolve as unverified; superseded requests reject with AbortError so
 * their callers cannot overwrite the newly selected accommodation's state.
 */
export async function requestAvailability(property: string, options: RequestOptions = {}): Promise<ClientAvailability> {
  if (options.signal?.aborted) throw cancelledRequest();
  if (!(AVAILABILITY_PROPERTIES as readonly string[]).includes(property)) return unverifiedAvailability();
  const fetchAvailability = options.fetch ?? globalThis.fetch;
  const now = options.now ?? Date.now;
  const controller = new AbortController();
  let cancelDeadline = () => {};
  let cancelSuperseded = () => {};
  const interrupted = new Promise<never>((_resolve, reject) => {
    cancelSuperseded = () => {
      controller.abort();
      reject(cancelledRequest());
    };
    options.signal?.addEventListener('abort', cancelSuperseded, { once: true });
    cancelDeadline = (options.scheduleTimeout ?? scheduleTimeout)(() => {
      controller.abort();
      reject(new Error('Calendar request timed out.'));
    }, options.timeoutMs ?? AVAILABILITY_REQUEST_TIMEOUT_MS);
  });

  try {
    const value = await Promise.race([
      (async () => {
        const response = await fetchAvailability(`/availability/${property}.json`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        controller.signal.throwIfAborted();
        if (!response.ok) throw new Error('Calendar request failed.');
        const result = parseResponse(await response.json());
        controller.signal.throwIfAborted();
        return result;
      })(),
      interrupted,
    ]);
    if (options.signal?.aborted) throw cancelledRequest();
    const receivedAt = now();
    const previous = options.previous;
    const latest = options.lastSuccessful ?? previous;
    if (value.status === 'snapshot' && latest?.status === 'snapshot' &&
        availabilityFreshFor(latest, receivedAt) > 0 &&
        Date.parse(value.checkedAt!) < Date.parse(latest.checkedAt!)) {
      // CDN/deployment propagation can return an earlier import. Keep the newer
      // known snapshot and its original expiry instead of reopening blocked nights.
      return { ...latest, blocked: mergeBlockedRanges([...latest.blocked, ...(previous?.blocked ?? [])]) };
    }
    return availabilityFreshFor(value, receivedAt) > 0 ? value : unverifiedAvailability(previous, value);
  } catch {
    if (options.signal?.aborted) throw cancelledRequest();
    return unverifiedAvailability(options.previous);
  } finally {
    cancelDeadline();
    options.signal?.removeEventListener('abort', cancelSuperseded);
  }
}
