import { useEffect, useState } from 'react';

/**
 * ~30-day history for the exchange-rate sparklines, from the free, no-key
 * Frankfurter API (European Central Bank reference rates). Values are PHP per
 * 1 foreign unit, per day.
 *
 * The ECB set doesn't include the Gulf currencies (SAR, AED, QAR) — but those
 * are HARD-PEGGED to the US dollar, so we derive their series from the USD
 * series using the official pegs. Fails gracefully: on any error the hook
 * returns empty data and the UI simply omits the trend lines.
 */

/** Currencies the ECB/Frankfurter dataset covers directly, vs PHP. */
const ECB_SYMBOLS = ['USD', 'EUR', 'GBP', 'JPY', 'HKD', 'SGD', 'CAD'];

/** Gulf currencies hard-pegged to the USD (units per 1 USD). */
const USD_PEG: Record<string, number> = {
  SAR: 3.75,
  AED: 3.6725,
  QAR: 3.64,
};

export interface FxPoint {
  date: string;
  value: number; // PHP per 1 unit
}

export interface FxHistory {
  series: Record<string, FxPoint[]>;
  /** window change (first → last), in %. */
  changePct: Record<string, number>;
  /** true for currencies derived from the USD peg. */
  pegged: Record<string, boolean>;
}

const CACHE_KEY = 'bb-fxhist:v1';
const TTL_MS = 12 * 60 * 60 * 1000;

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function readCache(): FxHistory | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { t: number; v: FxHistory };
    if (Date.now() - p.t > TTL_MS) return null;
    return p.v;
  } catch {
    return null;
  }
}

export function useFxHistory(): FxHistory | null {
  const [hist, setHist] = useState<FxHistory | null>(() => readCache());

  useEffect(() => {
    if (hist) return;

    let cancelled = false;
    const start = daysAgoISO(34);
    const url = `https://api.frankfurter.app/${start}..?base=PHP&symbols=${ECB_SYMBOLS.join(',')}`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((j: { rates?: Record<string, Record<string, number>> }) => {
        if (cancelled) return;
        if (!j.rates) throw new Error('no rates');
        const dates = Object.keys(j.rates).sort();
        const series: Record<string, FxPoint[]> = {};
        const pegged: Record<string, boolean> = {};

        // ECB-covered: PHP per unit = 1 / (foreign units per PHP).
        for (const code of ECB_SYMBOLS) {
          series[code] = dates
            .map(d => {
              const perPhp = j.rates![d]?.[code];
              return perPhp
                ? { date: d, value: 1 / perPhp }
                : { date: d, value: NaN };
            })
            .filter(p => !Number.isNaN(p.value));
        }

        // Pegged Gulf currencies derived from the USD series.
        const usdByDate = new Map(series.USD.map(p => [p.date, p.value]));
        for (const [code, peg] of Object.entries(USD_PEG)) {
          series[code] = dates
            .filter(d => usdByDate.has(d))
            .map(d => ({ date: d, value: usdByDate.get(d)! / peg }));
          pegged[code] = true;
        }

        const changePct: Record<string, number> = {};
        for (const code of Object.keys(series)) {
          const s = series[code];
          if (s.length >= 2) {
            changePct[code] =
              ((s[s.length - 1].value - s[0].value) / s[0].value) * 100;
          }
        }

        const v: FxHistory = { series, changePct, pegged };
        setHist(v);
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ t: Date.now(), v })
          );
        } catch {
          /* best-effort cache */
        }
      })
      .catch(() => {
        if (!cancelled) setHist({ series: {}, changePct: {}, pegged: {} });
      });

    return () => {
      cancelled = true;
    };
  }, [hist]);

  return hist;
}
