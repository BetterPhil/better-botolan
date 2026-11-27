import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { FX_CURRENCIES, useExchangeRates } from '../../hooks/useExchangeRates';
import { cn } from '../../lib/utils';

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

function CountUp({
  value,
  decimals = 2,
}: {
  value: number;
  decimals?: number;
}) {
  const animate = !reduceMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const start = performance.now();
    const duration = 800;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animate]);

  return <>{(animate ? display : value).toFixed(decimals)}</>;
}

function fmtUpdated(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

export default function ExchangeRates() {
  const { data, loading, error, refresh } = useExchangeRates();

  return (
    <section aria-labelledby="fx-heading" className="py-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-700">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Exchange rates
            </p>
            <h2
              id="fx-heading"
              className="font-display text-2xl font-bold text-gray-900 md:text-4xl"
            >
              Peso exchange rates
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              For OFW families — the value of{' '}
              <span className="font-semibold">1 foreign unit in pesos (₱)</span>
              .
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            {data && <span>Updated {fmtUpdated(data.updated)}</span>}
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              aria-label="Refresh rates"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw
                className={cn('h-4 w-4', loading && 'animate-spin')}
                aria-hidden="true"
              />
              Refresh
            </button>
          </div>
        </div>

        {error && !data ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            Exchange rates are unavailable right now. Please try again later.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {FX_CURRENCIES.map(cur => {
              const value = data?.rates[cur.code];
              const decimals = cur.code === 'JPY' ? 3 : 2;
              return (
                <div
                  key={cur.code}
                  className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl leading-none" aria-hidden="true">
                      {cur.flag}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {cur.code}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold text-gray-900">
                    {value != null ? (
                      <>
                        <span className="text-base font-semibold text-primary-600">
                          ₱
                        </span>
                        <CountUp value={value} decimals={decimals} />
                      </>
                    ) : (
                      <span className="inline-block h-7 w-16 animate-pulse rounded bg-gray-100" />
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {cur.name}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-4 text-xs italic text-gray-400">
          Indicative rates from ExchangeRate-API (open.er-api.com), updated
          about once a day. For remittances, always confirm the exact rate with
          your bank or remittance provider.
        </p>
      </div>
    </section>
  );
}
