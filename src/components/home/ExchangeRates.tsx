import { useMemo, useState } from 'react';
import { ArrowRight, RefreshCw, TrendingUp } from 'lucide-react';
import { FX_CURRENCIES, useExchangeRates } from '../../hooks/useExchangeRates';
import { useFxHistory, type FxPoint } from '../../hooks/useFxHistory';
import { cn } from '../../lib/utils';

/** Currency → ISO country code for the flag CDN. */
const FLAG_CC: Record<string, string> = {
  USD: 'us',
  SAR: 'sa',
  AED: 'ae',
  QAR: 'qa',
  HKD: 'hk',
  SGD: 'sg',
  EUR: 'eu',
  GBP: 'gb',
  JPY: 'jp',
  CAD: 'ca',
};

const PESO = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 2,
});

function rateDecimals(code: string) {
  return code === 'JPY' ? 3 : 2;
}

function fmtRate(value: number, code: string) {
  return `₱${value.toFixed(rateDecimals(code))}`;
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

/** Fresh if the last update was under 24h ago (helper keeps render pure). */
function isFresh(updated: string): boolean {
  const t = new Date(updated).getTime();
  if (isNaN(t)) return true;
  return Date.now() - t < 24 * 60 * 60 * 1000;
}

/** Flag image with graceful fallback to the currency code. */
function Flag({ code, className }: { code: string; className?: string }) {
  const cc = FLAG_CC[code];
  const [err, setErr] = useState(false);
  if (err || !cc) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500',
          className
        )}
      >
        {code.slice(0, 2)}
      </span>
    );
  }
  return (
    <img
      src={`https://flagcdn.com/${cc}.svg`}
      alt=""
      loading="lazy"
      onError={() => setErr(true)}
      className={cn('rounded object-cover ring-1 ring-black/10', className)}
    />
  );
}

/** Small sparkline from a value series. */
function Sparkline({
  points,
  stroke,
  className,
}: {
  points: FxPoint[];
  stroke: string;
  className?: string;
}) {
  if (points.length < 2) return null;
  const vals = points.map(p => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const n = vals.length - 1;
  const coords = vals.map((v, i) => {
    const x = (i / n) * 100;
    const y = 28 - ((v - min) / span) * 26 - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = coords.join(' ');
  const area = `0,30 ${line} 100,30`;
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <polygon points={area} fill={stroke} opacity={0.12} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function ChangePill({ pct, light }: { pct?: number; light?: boolean }) {
  if (pct == null) return null;
  const up = pct >= 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
        light
          ? 'bg-white/15 text-white'
          : up
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-rose-50 text-rose-700'
      )}
    >
      {up ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

export default function ExchangeRates() {
  const { data, loading, error, refresh } = useExchangeRates();
  const history = useFxHistory();
  const [selected, setSelected] = useState('USD');
  const [amount, setAmount] = useState('100');

  const amountNum = useMemo(() => {
    const n = parseFloat(amount.replace(/,/g, ''));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }, [amount]);

  const rate = data?.rates[selected];
  const converted = rate != null ? amountNum * rate : null;
  const selName =
    FX_CURRENCIES.find(c => c.code === selected)?.name ?? selected;

  const fresh = data ? isFresh(data.updated) : true;

  const others = FX_CURRENCIES.filter(c => c.code !== selected);

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
              For OFW families — type an amount to see what it&rsquo;s worth in
              pesos (₱).
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {data && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                  fresh
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    fresh ? 'bg-emerald-500' : 'bg-amber-500'
                  )}
                />
                Updated {fmtUpdated(data.updated)}
              </span>
            )}
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
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
            {/* Featured + converter */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-blue-900 p-6 text-white shadow-[var(--bb-shadow-lift,0_20px_40px_rgba(2,6,23,.25))] sm:p-7">
              <div className="flex items-center gap-3">
                <Flag code={selected} className="h-7 w-10" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold">
                      {selected}
                    </span>
                    <ChangePill pct={history?.changePct[selected]} light />
                  </div>
                  <div className="text-sm text-blue-100">{selName}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-blue-200">1 {selected} =</div>
                  <div className="font-display text-2xl font-bold">
                    {rate != null ? (
                      fmtRate(rate, selected)
                    ) : (
                      <span className="inline-block h-7 w-20 animate-pulse rounded bg-white/20" />
                    )}
                  </div>
                </div>
              </div>

              {/* sparkline */}
              <div className="mt-4 h-12">
                {history?.series[selected] && (
                  <Sparkline
                    points={history.series[selected]}
                    stroke="#bfdbfe"
                    className="h-12 w-full"
                  />
                )}
              </div>

              {/* converter */}
              <div className="mt-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <label
                  htmlFor="fx-amount"
                  className="text-xs font-medium text-blue-100"
                >
                  Amount in {selected}
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    id="fx-amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={e =>
                      setAmount(e.target.value.replace(/[^\d.]/g, ''))
                    }
                    className="w-32 rounded-lg bg-white/90 px-3 py-2 font-display text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-blue-200"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="text-xs text-blue-200">In pesos</div>
                    <div className="truncate font-display text-2xl font-bold">
                      {converted != null ? PESO.format(converted) : '—'}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[100, 500, 1000].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(String(q))}
                      className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/25"
                    >
                      {q.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              {history?.pegged[selected] && (
                <p className="mt-3 text-xs text-blue-200">
                  Trend derived from the USD peg (1 {selected} fixed to the US
                  dollar).
                </p>
              )}
            </div>

            {/* Trend grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {others.map(cur => {
                const r = data?.rates[cur.code];
                const pct = history?.changePct[cur.code];
                const up = (pct ?? 0) >= 0;
                return (
                  <button
                    key={cur.code}
                    type="button"
                    onClick={() => setSelected(cur.code)}
                    className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-3.5 text-left shadow-[var(--bb-shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <div className="flex items-center gap-2">
                      <Flag code={cur.code} className="h-4 w-6" />
                      <span className="text-sm font-bold text-gray-900">
                        {cur.code}
                      </span>
                      <ChangePill pct={pct} />
                    </div>
                    <div className="mt-2 font-display text-xl font-bold text-gray-900">
                      {r != null ? (
                        fmtRate(r, cur.code)
                      ) : (
                        <span className="inline-block h-6 w-14 animate-pulse rounded bg-gray-100" />
                      )}
                    </div>
                    <div className="mt-1 h-7">
                      {history?.series[cur.code] && (
                        <Sparkline
                          points={history.series[cur.code]}
                          stroke={up ? '#16a34a' : '#dc2626'}
                          className="h-7 w-full"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Indicative rates from ExchangeRate-API (open.er-api.com); 30-day trend
          from the European Central Bank via Frankfurter (pegged Gulf currencies
          derived from the USD). For remittances, always confirm the exact rate
          with your bank or provider.
        </p>
      </div>
    </section>
  );
}
