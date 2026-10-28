export interface WebAnalytics { hostname: string; token: string; }

const productionHosts = ['the-title-v.github.io', 'stay.the-title-v.workers.dev'];

export function selectWebAnalytics(site: URL | undefined, registrations: unknown, production: boolean): WebAnalytics | null {
  if (!production || !site || !productionHosts.includes(site.hostname)) return null;
  const token = registrations && typeof registrations === 'object' && !Array.isArray(registrations)
    ? (registrations as Record<string, unknown>)[site.hostname] : undefined;
  if (typeof token !== 'string' || !/^[a-f\d]{32}$/i.test(token)) {
    throw new Error(`Cloudflare Web Analytics for ${site.hostname} requires a token of exactly 32 hexadecimal characters in src/data/web-analytics.json.`);
  }
  return { hostname: site.hostname, token };
}

export function webAnalyticsLoader({ hostname, token }: WebAnalytics): string {
  return `(()=>{if(location.hostname!==${JSON.stringify(hostname)})return;const beacon=document.createElement('script');beacon.type='module';beacon.src='https://static.cloudflareinsights.com/beacon.min.js';beacon.dataset.cfBeacon=${JSON.stringify(JSON.stringify({ token, spa: false }))};document.head.appendChild(beacon);})();`;
}
