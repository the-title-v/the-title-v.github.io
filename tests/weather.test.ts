import test from 'node:test';
import assert from 'node:assert/strict';
import { parseForecast, weatherLabel, forecastDayLabel } from '../src/lib/weather';

const now = Date.parse('2026-10-23T17:30:00Z');
const point = (time: string, temp: number, symbol = 'partlycloudy_day') => ({ time, data: { instant: { details: { air_temperature: temp, relative_humidity: 76, wind_speed: 3 } }, next_1_hours: { summary: { symbol_code: symbol }, details: { precipitation_amount: 1.2 } } } });
const forecast = (points: unknown[], updated = '2026-10-23T17:00:00Z') => ({ properties: { meta: { updated_at: updated }, timeseries: points } });

test('weather groups by Phuket date and uses the nearest forecast for now', () => {
  const result = parseForecast(forecast([point('2026-10-23T17:00:00Z', 28), point('2026-10-23T18:00:00Z', 27), point('2026-10-24T05:00:00Z', 31)]), now);
  assert.equal(result.temperature, 28);
  assert.equal(result.days[0].date, '2026-10-24');
  assert.equal(result.days[0].high, 31);
  assert.equal(result.days[0].low, 27);
});
test('weather rejects missing or stale data instead of showing invented conditions', () => {
  assert.throws(() => parseForecast({}, now));
  assert.throws(() => parseForecast(forecast([], '2026-10-22T00:00:00Z'), now));
  assert.throws(() => parseForecast(forecast([point('2026-10-23T17:00:00Z', NaN)]), now));
  assert.throws(() => parseForecast(forecast([point('2026-10-20T17:00:00Z', 30)]), now));
});
test('missing, invalid and unknown symbols preserve temperature without inventing cloudy conditions', () => {
  for (const code of [undefined, null, 42, '', 'unrecognized', 'fake_rain', 'notcloudy', 'clearsky_evening']) {
    const sample = point('2026-10-23T17:00:00Z', 28);
    (sample.data.next_1_hours.summary as { symbol_code: unknown }).symbol_code = code;
    const result = parseForecast(forecast([sample]), now);
    assert.equal(result.temperature, 28);
    assert.equal(result.symbol, 'unknown');
    assert.equal(result.days[0].symbol, 'unknown');
    assert.equal(weatherLabel(result.symbol), 'Conditions unavailable');
  }
});
test('only recognised conditions receive weather labels', () => {
  assert.equal(weatherLabel('cloudy'), 'Cloudy');
  assert.equal(weatherLabel('clearsky_night'), 'Clear skies');
  assert.equal(weatherLabel('partlycloudy_day'), 'Sun & cloud');
  assert.equal(weatherLabel('lightrainshowers_day'), 'Showers');
  assert.equal(weatherLabel('heavyrain'), 'Heavy rain');
  assert.equal(weatherLabel('fog'), 'Misty');
  assert.equal(weatherLabel('snow'), 'Snow');
  assert.equal(weatherLabel('sleet'), 'Sleet');
  for (const code of ['unknown', 'notrain', 'verycloudy', '']) assert.equal(weatherLabel(code), 'Conditions unavailable');
});
test('a first sample after midnight is labelled by its Phuket day, never automatically Today', () => {
  const beforeMidnight = Date.parse('2026-10-23T16:30:00Z');
  assert.equal(forecastDayLabel('2026-10-24', beforeMidnight), 'Sat');
  assert.equal(forecastDayLabel('2026-10-24', now), 'Today');
});
