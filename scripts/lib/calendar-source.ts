import { mergeBlockedRanges, parseICal, type BlockedDateRange } from '../../src/lib/calendar';

type FeedId = 'bright' | 'cozy';

const PROPERTY_FEEDS = {
  'bright-1br-rawai-beach': ['bright'],
  'cozy-1br-rawai-beach': ['cozy'],
  'two-adjacent-apartments-title-v-rawai': ['bright', 'cozy'],
} as const satisfies Record<string, readonly FeedId[]>;

export type AvailabilityProperty = keyof typeof PROPERTY_FEEDS;

const UNAVAILABLE_MESSAGE = 'Availability is temporarily unavailable. Please contact us to confirm your dates.';

export type AvailabilityResponse = {
  status: 'live' | 'unavailable';
  blocked: BlockedDateRange[];
  checkedAt: string | null;
  message?: string;
};

type AvailabilityDependencies = {
  getFeedUrl: (feed: FeedId) => string | undefined;
  fetch?: typeof globalThis.fetch;
  now?: () => number;
  cacheTtlMs?: number;
  timeoutMs?: number;
  maxBytes?: number;
};

type CachedFeed = { blocked: BlockedDateRange[]; checkedAt: number };

export function isAvailabilityProperty(value: string): value is AvailabilityProperty {
  return Object.hasOwn(PROPERTY_FEEDS, value);
}

function unavailable(blocked: BlockedDateRange[] = []): AvailabilityResponse {
  return { status: 'unavailable', blocked, checkedAt: null, message: UNAVAILABLE_MESSAGE };
}

function validatedFeedUrl(value: string | undefined): string {
  if (!value) throw new Error('Calendar is not configured');
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    !['airbnb.com', 'www.airbnb.com'].includes(url.hostname) ||
    url.username || url.password || url.port || url.hash ||
    !/^\/calendar\/ical\/[A-Za-z0-9_-]+\.ics$/.test(url.pathname)
  ) throw new Error('Invalid calendar configuration');
  return url.href;
}

async function readBoundedCalendar(response: Response, maxBytes: number, signal: AbortSignal): Promise<string> {
  if (response.status !== 200 || response.redirected || !response.body) {
    if (response.body) void response.body.cancel().catch(() => {});
    throw new Error('Calendar fetch failed');
  }
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    void response.body.cancel().catch(() => {});
    throw new Error('Calendar is too large');
  }
  const reader = response.body.getReader();
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const chunks: string[] = [];
  let bytes = 0;
  try {
    while (true) {
      signal.throwIfAborted();
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        cancel();
        throw new Error('Calendar is too large');
      }
      chunks.push(decoder.decode(value, { stream: true }));
    }
    signal.throwIfAborted();
    chunks.push(decoder.decode());
    return chunks.join('');
  } finally {
    signal.removeEventListener('abort', cancel);
    reader.releaseLock();
  }
}

/** Cache only normalized date ranges and their successful-fetch time. */
export function createAvailabilityService(dependencies: AvailabilityDependencies) {
  const fetchCalendar = dependencies.fetch ?? globalThis.fetch;
  const now = dependencies.now ?? Date.now;
  const cacheTtlMs = dependencies.cacheTtlMs ?? 5 * 60 * 1_000;
  const timeoutMs = dependencies.timeoutMs ?? 10_000;
  const maxBytes = dependencies.maxBytes ?? 1_048_576;
  const cache = new Map<FeedId, CachedFeed>();
  const pending = new Map<FeedId, Promise<CachedFeed | null>>();

  async function fetchFeed(url: string): Promise<CachedFeed> {
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_resolve, reject) => {
      timeout = setTimeout(() => {
        controller.abort();
        reject(new Error('Calendar request timed out'));
      }, timeoutMs);
    });
    try {
      return await Promise.race([
        (async () => {
          const response = await fetchCalendar(url, {
            redirect: 'error', signal: controller.signal, cache: 'no-store',
            headers: { Accept: 'text/calendar' },
          });
          const source = await readBoundedCalendar(response, maxBytes, controller.signal);
          const blocked = parseICal(source).map(({ start, end }) => ({ start, end }));
          return { blocked, checkedAt: now() };
        })(),
        deadline,
      ]);
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
    }
  }

  async function readFeed(id: FeedId): Promise<CachedFeed | null> {
    let url: string;
    try {
      // Resolve configuration on every request, including cache hits.
      url = validatedFeedUrl(dependencies.getFeedUrl(id));
    } catch {
      cache.delete(id);
      return null;
    }
    const cached = cache.get(id);
    const age = cached ? now() - cached.checkedAt : Infinity;
    if (cached && age >= 0 && age < cacheTtlMs) return cached;
    const active = pending.get(id);
    if (active) return active;

    const request = fetchFeed(url)
      .then((entry) => { cache.set(id, entry); return entry; })
      .catch(() => {
        // Never promote stale events to a fresh success or expose source errors.
        cache.delete(id);
        return null;
      })
      .finally(() => { pending.delete(id); });
    pending.set(id, request);
    return request;
  }

  return async (property: string): Promise<AvailabilityResponse> => {
    if (!isAvailabilityProperty(property)) return unavailable();
    const results = await Promise.all(PROPERTY_FEEDS[property].map(readFeed));
    const successful = results.filter((result): result is CachedFeed => result !== null);
    const blocked = mergeBlockedRanges(successful.flatMap((result) => result.blocked))
      .map(({ start, end }) => ({ start, end }));
    if (successful.length !== results.length) return unavailable(blocked);
    return {
      status: 'live', blocked,
      checkedAt: new Date(Math.min(...successful.map((result) => result.checkedAt))).toISOString(),
    };
  };
}
