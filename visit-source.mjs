const collector = 'https://source-visits.nora-bennett67.workers.dev';
const storageKey = 'source-visit-last-active';
const visitTimeout = 30 * 60_000;

export const siteByOrigin = new Map([
  ['the-title-v.github.io', 'the-title-v'],
  ['stay.the-title-v.workers.dev', 'the-title-v'],
  ...['infophuket.com', 'truephuket.com', 'phuketferryboats.com'].flatMap(site => [
    [site, site], [`www.${site}`, site],
  ]),
].map(([hostname, site]) => [`https://${hostname}`, site]));

const platforms = {
  bing: ['bing.com'],
  chatgpt: ['chatgpt.com', 'chat.openai.com'],
  claude: ['claude.ai'],
  copilot: ['copilot.microsoft.com'],
  duckduckgo: ['duckduckgo.com'],
  facebook: ['facebook.com', 'fb.com', 'fb.me'],
  gemini: ['gemini.google.com'],
  instagram: ['instagram.com'],
  linkedin: ['linkedin.com'],
  perplexity: ['perplexity.ai'],
  reddit: ['reddit.com', 'redd.it'],
  tiktok: ['tiktok.com'],
  x: ['x.com', 'twitter.com', 't.co'],
  yahoo: ['yahoo.com'],
  youtube: ['youtube.com', 'youtu.be'],
};

export const knownSources = new Set([
  ...Object.keys(platforms), ...siteByOrigin.values(), 'google', 'direct-or-unknown', 'other-referral',
]);

function identifyHost(hostname) {
  for (const [source, domains] of Object.entries(platforms)) {
    if (domains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) return source;
  }
  if (/(^|\.)google\.(?:com|[a-z]{2}|(?:co|com)\.[a-z]{2})$/.test(hostname)) return 'google';
  return siteByOrigin.get(`https://${hostname}`);
}

export function classifySource(href, referrer) {
  const landing = new URL(href);
  const tag = landing.searchParams.get('utm_source')?.trim().toLowerCase();
  if (tag) {
    const taggedSource = identifyHost(tag) ?? tag;
    if (knownSources.has(taggedSource)) return taggedSource;
  }
  if (!referrer) return 'direct-or-unknown';
  const host = new URL(referrer).hostname;
  const source = identifyHost(host);
  if (host === landing.hostname || (source && source === siteByOrigin.get(landing.origin))) return 'direct-or-unknown';
  return source ?? 'other-referral';
}

export async function trackVisit({ href, referrer, navigator, getStorage, send, now }) {
  const landing = new URL(href);
  if (!siteByOrigin.has(landing.origin) || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;

  const checking = landing.searchParams.get('source_tracking_test') === '1';
  let storage;
  if (!checking) {
    try {
      storage = getStorage();
      const previous = Number(storage.getItem(storageKey));
      storage.setItem(storageKey, String(now));
      if (previous > 0 && now >= previous && now - previous < visitTimeout) return;
    } catch { storage = undefined; }
  }

  try {
    const source = classifySource(href, referrer);
    const response = await send(`${collector}/${checking ? 'check' : 'visit'}/${source}`, {
      method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true,
    });
    if (response.ok) return;
  } catch { /* The site remains usable when analytics is unavailable. */ }
  try {
    if (storage?.getItem(storageKey) === String(now)) storage.removeItem(storageKey);
  } catch { /* Browser storage can be disabled. */ }
}

if (typeof document !== 'undefined') {
  const track = () => void trackVisit({
    href: location.href,
    referrer: document.referrer,
    navigator: window.navigator,
    getStorage: () => window.sessionStorage,
    send: (url, options) => fetch(url, options),
    now: Date.now(),
  });
  if (document.prerendering) document.addEventListener('prerenderingchange', track, { once: true });
  else track();
}
