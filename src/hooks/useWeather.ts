import { useEffect, useState } from 'react';
import { siteConfig } from '../config/site';

/**
 * Live weather for Botolan from Open-Meteo (free, no key, CORS-open).
 * We keep it simple and resilient: a failure never breaks the page.
 */
export interface WeatherNow {
  temperature: number;
  apparent: number;
  humidity: number;
  windSpeed: number;
  code: number;
  isDay: boolean;
  precipProbMax: number;
  updatedAt: string;
}

const CACHE_KEY = 'bb-weather:v1';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min

function readCache(): WeatherNow | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; v: WeatherNow };
    if (Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return parsed.v;
  } catch {
    return null;
  }
}

export function useWeather() {
  const [data, setData] = useState<WeatherNow | null>(() => readCache());
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) return;
    const controller = new AbortController();
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${siteConfig.latitude}` +
      `&longitude=${siteConfig.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
      `&daily=precipitation_probability_max&forecast_days=1&timezone=Asia%2FManila`;

    fetch(url, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(
        (j: {
          current: Record<string, number>;
          daily: { precipitation_probability_max: number[] };
        }) => {
          const now: WeatherNow = {
            temperature: Math.round(j.current.temperature_2m),
            apparent: Math.round(j.current.apparent_temperature),
            humidity: Math.round(j.current.relative_humidity_2m),
            windSpeed: Math.round(j.current.wind_speed_10m),
            code: j.current.weather_code,
            isDay: j.current.is_day === 1,
            precipProbMax: j.daily.precipitation_probability_max?.[0] ?? 0,
            updatedAt: new Date().toISOString(),
          };
          setData(now);
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ t: Date.now(), v: now })
            );
          } catch {
            // cache is best-effort
          }
        }
      )
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });

    return () => controller.abort();
  }, [data]);

  return { data, error };
}

/** Maps a WMO weather code to a short label. */
export function weatherLabel(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Fog';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}
