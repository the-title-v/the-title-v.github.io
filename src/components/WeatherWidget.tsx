import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, CloudSun, Cloud, CloudRain, CloudLightning, CloudFog, CloudSnow, CircleHelp, ChevronDown, Droplets, Wind } from 'lucide-react';
import { parseForecast, weatherLabel, forecastDayLabel, WEATHER_CACHE_KEY, WEATHER_TTL, WEATHER_URL, type Weather } from '../lib/weather';
import '../styles/weather.css';

function WeatherIcon({ code, size = 22 }: { code: string; size?: number }) {
  const condition = weatherLabel(code);
  const Icon = condition === 'Thunderstorms' ? CloudLightning : condition === 'Showers' || condition === 'Heavy rain' ? CloudRain
    : condition === 'Sun & cloud' ? CloudSun : condition === 'Clear skies' ? (code.endsWith('_night') ? Moon : Sun)
    : condition === 'Misty' ? CloudFog : condition === 'Snow' || condition === 'Sleet' ? CloudSnow : condition === 'Cloudy' ? Cloud : CircleHelp;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" className={condition === 'Conditions unavailable' ? 'weather-condition-unknown' : undefined} />;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [clock, setClock] = useState(0);
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    let controller: AbortController | null = null;
    let mounted = true;
    let retryAt = 0;
    let busy = false;
    const refresh = async () => {
      setClock(Date.now());
      if (busy || Date.now() < retryAt) return;
      busy = true;
      controller = new AbortController();
      const timer = window.setTimeout(() => controller?.abort(), 10000);
      setWeather(null);
      setStatus('loading');
      try {
        let cached: { payload: unknown; expires: number } | null = null;
        try { cached = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) ?? 'null'); } catch { /* Storage can be disabled. */ }
        if (cached && Number.isFinite(cached.expires) && cached.expires > Date.now() && cached.expires <= Date.now() + 2 * WEATHER_TTL) {
          try { const parsed = parseForecast(cached.payload); retryAt = cached.expires; if (mounted) { setWeather(parsed); setStatus('ready'); } return; } catch { /* A malformed cache is refreshed. */ }
        }
        // Simple CORS request: the browser's Origin identifies this website to MET Norway.
        const response = await fetch(WEATHER_URL, { signal: controller.signal, credentials: 'omit' });
        if (!response.ok) throw new Error('Weather unavailable');
        const payload: unknown = await response.json();
        const parsed = parseForecast(payload);
        const expires = Math.max(Date.now() + WEATHER_TTL, Math.min(Date.parse(response.headers.get('Expires') ?? '') || 0, Date.now() + 2 * WEATHER_TTL));
        retryAt = expires;
        try { localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ payload, expires })); } catch { /* Cache is optional. */ }
        if (mounted) { setWeather(parsed); setStatus('ready'); }
      } catch { retryAt = Date.now() + 5 * 60_000; if (mounted) { setWeather(null); setStatus('error'); } }
      finally { busy = false; clearTimeout(timer); }
    };
    void refresh();
    const wake = () => { if (document.visibilityState === 'visible') void refresh(); };
    const interval = window.setInterval(wake, 60_000);
    window.addEventListener('focus', wake);
    document.addEventListener('visibilitychange', wake);
    const close = (event: MouseEvent) => { if (details.current && !details.current.contains(event.target as Node)) details.current.open = false; };
    document.addEventListener('click', close);
    return () => { mounted = false; controller?.abort(); clearInterval(interval); window.removeEventListener('focus', wake); document.removeEventListener('visibilitychange', wake); document.removeEventListener('click', close); };
  }, []);
  return <details className="weather-widget" ref={details} onKeyDown={e => { if (e.key === 'Escape' && details.current) { details.current.open = false; details.current.querySelector('summary')?.focus(); } }}>
    <summary aria-label="Rawai weather and five-day forecast">
      <WeatherIcon code={weather?.symbol ?? 'unknown'} />
      <span><small>RAWAI</small><strong>{weather ? `${weather.temperature}°` : 'Weather'}</strong></span><ChevronDown size={12} aria-hidden="true" />
    </summary>
    <div className="weather-panel" role="region" aria-label="Rawai forecast">
      <p className="eyebrow">A LITTLE LOOK OUTSIDE</p>
      <div className="weather-heading"><h2>Today in <em>Rawai.</em></h2>{weather && <WeatherIcon code={weather.symbol} size={46}/>}</div>
      <div aria-live="polite">{weather ? <>
        <div className="weather-now"><span>{weather.temperature}<sup>°C</sup></span><div><strong>{weatherLabel(weather.symbol)}</strong><small>Forecast for now</small></div></div>
        <div className="weather-details">{weather.humidity !== null && <span><Droplets size={14}/>{weather.humidity}% humidity</span>}{weather.wind !== null && <span><Wind size={14}/>{weather.wind} km/h</span>}</div>
        <div className="weather-days">{weather.days.map(day => <div key={day.date}><span>{forecastDayLabel(day.date, clock)}</span><WeatherIcon code={day.symbol}/><strong>{day.high}° <small>{day.low}°</small></strong><span className="sr-only">{weatherLabel(day.symbol)}</span></div>)}</div>
        <p className="weather-updated">Updated {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', timeZone: 'Asia/Bangkok' }).format(new Date(weather.updatedAt))} · Phuket time</p>
      </> : <p className="weather-loading">{status === 'loading' ? 'A moment — checking the forecast…' : 'The forecast is taking a break. Try the full forecast below.'}</p>}</div>
      <div className="weather-footer"><a href="https://www.tmd.go.th/en/weather/province/phuket" target="_blank" rel="noopener noreferrer">Full forecast ↗</a><span><a href="https://www.met.no/en" target="_blank" rel="noopener noreferrer">MET Norway</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a><small>Daily summary by The Title V</small></span></div>
    </div>
  </details>;
}
