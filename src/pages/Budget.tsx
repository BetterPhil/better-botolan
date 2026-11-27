import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Info, PieChart, TrendingUp, Wallet } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';
import { cn } from '../lib/utils';
import {
  bigTicket2025,
  budgetSources,
  formatPesoFull,
  formatPesoShort,
  keyFigures,
  spending2024,
  type SpendItem,
} from '../data/budget';

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

/** Reveal flag set on the next frame (so CSS transitions run). */
function useRevealed() {
  const [shown, setShown] = useState(() => reduceMotion());
  useEffect(() => {
    if (shown) return;
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, [shown]);
  return shown;
}

function CountUpPeso({ value }: { value: number }) {
  const animate = !reduceMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 900, 1);
      setDisplay(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animate]);
  return <>{formatPesoShort(animate ? display : value)}</>;
}

const C = 2 * Math.PI * 50;

function Donut({ items }: { items: SpendItem[] }) {
  const shown = useRevealed();
  const total = items.reduce((s, i) => s + i.amount, 0);
  const startAmount = (idx: number) =>
    items.slice(0, idx).reduce((s, it) => s + it.amount, 0);
  return (
    <svg viewBox="0 0 120 120" className="h-56 w-56 -rotate-90">
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="16"
      />
      {items.map((item, idx) => {
        const frac = item.amount / total;
        const arc = frac * C;
        const offsetRot = (startAmount(idx) / total) * 360;
        return (
          <circle
            key={item.label}
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={item.color}
            strokeWidth="16"
            strokeLinecap="butt"
            strokeDasharray={`${arc} ${C}`}
            strokeDashoffset={shown ? 0 : arc}
            transform={`rotate(${offsetRot} 60 60)`}
            style={{ transition: 'stroke-dashoffset 0.9s ease-out' }}
          />
        );
      })}
    </svg>
  );
}

function Bars({ items }: { items: SpendItem[] }) {
  const shown = useRevealed();
  const max = useMemo(() => Math.max(...items.map(i => i.amount)), [items]);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-700">{item.label}</span>
            <span className="font-semibold text-gray-900">
              {formatPesoShort(item.amount)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full"
              style={{
                width: shown ? `${(item.amount / max) * 100}%` : '0%',
                background: item.color,
                transition: `width 0.9s ease-out ${i * 80}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Budget() {
  const total2024 = spending2024.reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <SEO
        title="Where the Money Goes — Budget"
        description={`Budget, spending, and transparency figures for the Municipality of ${siteConfig.shortName}, Zambales.`}
        keywords={`${siteConfig.shortName} budget, transparency, spending, NTA, projects`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Transparency', href: '/transparency' },
            { label: 'Budget' },
          ]}
        />
        <SectionHeading
          kicker="Transparency"
          title="Where the money goes"
          description="Botolan's budget and spending, so residents can see how public funds are used."
        />

        {/* Key figures */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyFigures.map(fig => (
            <div
              key={fig.id}
              className={cn(
                'rounded-2xl border bg-white p-5 shadow-sm',
                fig.confirmed
                  ? 'border-gray-200'
                  : 'border-dashed border-gray-300'
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                {fig.label}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-gray-900">
                {fig.value != null ? (
                  <CountUpPeso value={fig.value} />
                ) : (
                  <span
                    className={!fig.confirmed ? 'text-gray-400' : undefined}
                  >
                    {fig.display}
                  </span>
                )}
              </p>
              <p className="mt-1.5 text-xs text-gray-500">{fig.detail}</p>
            </div>
          ))}
        </div>

        {/* 2024 spending donut */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
              <PieChart
                className="h-5 w-5 text-primary-600"
                aria-hidden="true"
              />
              2024 program spending
            </p>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative shrink-0">
                <Donut items={spending2024} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="font-display text-xl font-bold text-gray-900">
                    {formatPesoShort(total2024)}
                  </span>
                </div>
              </div>
              <ul className="w-full space-y-2">
                {spending2024.map(item => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="truncate text-gray-700">
                        {item.label}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-gray-900">
                      {formatPesoShort(item.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2025 big-ticket bars */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
              <TrendingUp
                className="h-5 w-5 text-primary-600"
                aria-hidden="true"
              />
              2025 big-ticket projects
            </p>
            <Bars items={bigTicket2025} />
            <p className="mt-4 text-xs text-gray-400">
              The four construction projects (₱199.9M) are funded through a Land
              Bank facility; lot acquisition is a separate 2025 item.
            </p>
          </div>
        </div>

        {/* Income vs NTA vs Expenditure note */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
            <Wallet className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Income, NTA & expenditure
          </p>
          <p className="mt-2 text-sm text-gray-600">
            The complete Statement of Receipts & Expenditures — local income,
            the National Tax Allotment (NTA) share, and total expenditures — is
            published by national oversight agencies. Add Botolan&rsquo;s exact
            yearly figures in{' '}
            <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
              src/data/budget.ts
            </code>
            , or view the official records:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {budgetSources.map(src => (
              <a
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                {src.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Provenance */}
        <p className="mt-6 flex items-start gap-2 text-xs text-gray-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Verified figures from public reporting of the 2025 State of the
          Municipal Address and the 2023 Cities &amp; Municipalities Competitive
          Index. Full appropriations are set by the Sangguniang Bayan;{' '}
          {formatPesoFull(total2024)} shown here covers the reported 2024
          program accomplishments, not the entire municipal budget.
        </p>
      </Section>
    </>
  );
}
