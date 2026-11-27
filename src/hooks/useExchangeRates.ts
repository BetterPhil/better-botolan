import { useCallback, useEffect, useState } from 'react';

/**
 * Live foreign-exchange rates expressed in Philippine pesos (₱), from the free,
 * no-key ExchangeRate-API (open.er-api.com). Values are "1 foreign unit = ₱X".
 * Rates refresh about once a day; we cache them per session and fail gracefully.
 */

/** Foreign currencies to show, most relevant to OFW families. */
export const FX_CURRENCIES: { code: string; flag: string; name: string }[] = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal' },
  { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
  { code: 'QAR', flag: '🇶🇦', name: 'Qatari Riyal' },
  { code: 'HKD', flag: '🇭🇰', name: 'Hong Kong Dollar' },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar' },
];

export interface FxData {
  /** code → pesos per 1 unit of that currency */
  rates: Record<string, number>;
  updated: string;
}

const CACHE_KEY = 'bb-fx:v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

function readCache(): FxData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; v: FxData };
    if (Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return parsed.v;
  } catch {
    return null;
  }
}

export function useExchangeRates() {
  const [data, setData] = useState<FxData | null>(() => readCache());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback((force = false) => {
    if (!force && readCache()) return;
    setLoading(true);
    setError(false);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(
        (j: {
          result: string;
          rates: Record<string, number>;
          time_last_update_utc: string;
        }) => {
          if (j.result !== 'success' || !j.rates?.PHP)
            throw new Error('bad data');
          const phpPerUsd = j.rates.PHP;
          const rates: Record<string, number> = {};
          for (const { code } of FX_CURRENCIES) {
            // 1 CODE in PHP = (PHP per USD) / (CODE per USD)
            const perUsd = code === 'USD' ? 1 : j.rates[code];
            if (perUsd) rates[code] = phpPerUsd / perUsd;
          }
          const next: FxData = { rates, updated: j.time_last_update_utc };
          setData(next);
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ t: Date.now(), v: next })
            );
          } catch {
            /* cache best-effort */
          }
        }
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data) load();
  }, [data, load]);

  return { data, loading, error, refresh: () => load(true) };
}
