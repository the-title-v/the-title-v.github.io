export const WEATHER_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=7.775&lon=98.321';
export const WEATHER_CACHE_KEY = 'title-v-weather-v1';
export const WEATHER_TTL = 60 * 60 * 1000;
export type WeatherDay = { date: string; high: number; low: number; symbol: string };
export type Weather = { updatedAt: string; temperature: number; symbol: string; humidity: number | null; wind: number | null; days: WeatherDay[] };
type Point = { time: string; data: { instant: { details: { air_temperature: number; relative_humidity?: number; wind_speed?: number } }; next_1_hours?: { summary?: { symbol_code?: string } }; next_6_hours?: { summary?: { symbol_code?: string } } } };
const localDate = (time: number) => new Date(time + 7 * 3600_000).toISOString().slice(0, 10);
// MET Norway's published symbol IDs, including its two legacy "lightss…" spellings.
// https://github.com/metno/weathericons/blob/main/weather/legend.csv
const knownSymbols = new Set([
  'clearsky', 'fair', 'partlycloudy', 'cloudy', 'fog',
  'lightrain', 'rain', 'heavyrain', 'lightrainandthunder', 'rainandthunder', 'heavyrainandthunder',
  'lightrainshowers', 'rainshowers', 'heavyrainshowers', 'lightrainshowersandthunder', 'rainshowersandthunder', 'heavyrainshowersandthunder',
  'lightsleet', 'sleet', 'heavysleet', 'lightsleetandthunder', 'sleetandthunder', 'heavysleetandthunder',
  'lightsleetshowers', 'sleetshowers', 'heavysleetshowers', 'lightssleetshowersandthunder', 'sleetshowersandthunder', 'heavysleetshowersandthunder',
  'lightsnow', 'snow', 'heavysnow', 'lightsnowandthunder', 'snowandthunder', 'heavysnowandthunder',
  'lightsnowshowers', 'snowshowers', 'heavysnowshowers', 'lightssnowshowersandthunder', 'snowshowersandthunder', 'heavysnowshowersandthunder',
]);
const knownSymbol = (code: unknown): code is string => typeof code === 'string'
  && knownSymbols.has(code.replace(/_(day|night|polartwilight)$/, ''));
const symbol = (p: Point) => {
  const code = p.data.next_1_hours?.summary?.symbol_code ?? p.data.next_6_hours?.summary?.symbol_code;
  return knownSymbol(code) ? code : 'unknown';
};
const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

export function forecastDayLabel(date: string, now = Date.now()): string {
  return date === localDate(now) ? 'Today' : new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'Asia/Bangkok' }).format(new Date(`${date}T12:00:00+07:00`));
}

/** A compact view of MET Norway's forecast, grouped into Bangkok calendar days. */
export function parseForecast(payload: unknown, now = Date.now()): Weather {
  const value = payload as { properties?: { meta?: { updated_at?: string }; timeseries?: Point[] } };
  const updatedAt = value?.properties?.meta?.updated_at;
  const updated = Date.parse(updatedAt ?? '');
  if (!updatedAt || !Number.isFinite(updated) || now - updated > 12 * WEATHER_TTL || updated > now + WEATHER_TTL) throw new Error('Forecast is out of date.');
  const points = value.properties?.timeseries;
  if (!Array.isArray(points)) throw new Error('Forecast is unavailable.');
  const valid = points.filter(p => Number.isFinite(Date.parse(p?.time)) && finite(p?.data?.instant?.details?.air_temperature));
  const current = [...valid].sort((a, b) => Math.abs(Date.parse(a.time) - now) - Math.abs(Date.parse(b.time) - now))[0];
  if (!current || Math.abs(Date.parse(current.time) - now) > 2 * WEATHER_TTL) throw new Error('Forecast is unavailable.');
  const groups = new Map<string, Point[]>();
  for (const point of valid) {
    const date = localDate(Date.parse(point.time));
    if (date < localDate(now)) continue;
    groups.set(date, [...(groups.get(date) ?? []), point]);
  }
  const days = [...groups].sort(([a], [b]) => a.localeCompare(b)).slice(0, 5).map(([date, samples]) => {
    const temperatures = samples.map(p => p.data.instant.details.air_temperature);
    const noon = [...samples].sort((a, b) => Math.abs(Date.parse(a.time) - Date.parse(`${date}T05:00:00Z`)) - Math.abs(Date.parse(b.time) - Date.parse(`${date}T05:00:00Z`)))[0];
    return { date, high: Math.round(Math.max(...temperatures)), low: Math.round(Math.min(...temperatures)), symbol: symbol(noon) };
  });
  const details = current.data.instant.details;
  return { updatedAt, temperature: Math.round(details.air_temperature), symbol: symbol(current), humidity: finite(details.relative_humidity) ? Math.round(details.relative_humidity) : null, wind: finite(details.wind_speed) ? Math.round(details.wind_speed * 3.6) : null, days };
}

export function weatherLabel(code: string): string {
  if (!knownSymbol(code)) return 'Conditions unavailable';
  if (code.includes('thunder')) return 'Thunderstorms';
  if (code.includes('rain')) return code.includes('heavy') ? 'Heavy rain' : 'Showers';
  if (code.includes('sleet')) return 'Sleet';
  if (code.includes('snow')) return 'Snow';
  if (code.includes('fog')) return 'Misty';
  if (code.includes('partlycloudy') || code.includes('fair')) return 'Sun & cloud';
  if (code.includes('clearsky')) return 'Clear skies';
  return 'Cloudy';
}
