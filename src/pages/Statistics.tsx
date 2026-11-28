import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Banknote,
  ExternalLink,
  Landmark,
  Layers,
  Lightbulb,
  Ruler,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { barangays, POPULATION_TOTAL_2020 } from '../data/barangays';
import { priorYearSummary } from '../data/budget';
import { siteConfig } from '../config/site';

const fmt = new Intl.NumberFormat('en-PH');

// Municipal totals (PSA).
const POP_2015 = 57707;
const POP_2024 = 70340; // 2024 POPCEN municipal count
const MEDIAN_AGE_2015 = 23.85;
const HOUSEHOLDS_2015 = 13702;
const AVG_HH_2015 = 4.21;
const GROWTH_2015_2020 = 3.11; // PSA annualized

const trend = [
  { year: 2015, value: POP_2015 },
  { year: 2020, value: POPULATION_TOTAL_2020 },
  { year: 2024, value: POP_2024 },
];

// FY2025 public money per resident (official BLGF SRE ÷ 2024 population).
const incomePerCapita = priorYearSummary.income / POP_2024;
const ntaPerCapita = priorYearSummary.nta / POP_2024;
const spendPerCapita = priorYearSummary.expenditures / POP_2024;

// Growth 2020 -> 2024.
const growthTotal =
  ((POP_2024 - POPULATION_TOTAL_2020) / POPULATION_TOTAL_2020) * 100;
const growthAnnual =
  (Math.pow(POP_2024 / POPULATION_TOTAL_2020, 1 / 4) - 1) * 100;

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

function useRevealed() {
  const [shown, setShown] = useState(() => reduceMotion());
  useEffect(() => {
    if (shown) return;
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, [shown]);
  return shown;
}

function CountUp({
  value,
  format = (n: number) => fmt.format(Math.round(n)),
  duration = 1000,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const animate = !reduceMotion();
  const [display, setDisplay] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setDisplay(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animate, duration]);
  return <>{format(animate ? display : value)}</>;
}

interface Tile {
  label: string;
  value: React.ReactNode;
  icon: typeof Users;
  accent: string;
}

const tiles: Tile[] = [
  {
    label: 'Population (2024)',
    value: <CountUp value={POP_2024} />,
    icon: Users,
    accent: '#2563eb',
  },
  {
    label: 'Growth 2020–24',
    value: `+${growthTotal.toFixed(1)}%`,
    icon: TrendingUp,
    accent: '#16a34a',
  },
  { label: 'Barangays', value: '31', icon: Layers, accent: '#7c3aed' },
  {
    label: 'Land area',
    value: '735.28 km²',
    icon: Ruler,
    accent: '#0891b2',
  },
  { label: 'Density', value: '96 / km²', icon: Sparkles, accent: '#ea580c' },
  { label: 'Income class', value: '1st', icon: Landmark, accent: '#d97706' },
];

/** Simple animated area chart for the population trend. */
function PopulationChart() {
  const shown = useRevealed();
  const minY = 55000;
  const maxY = 72000;
  const X = (y: number) => 8 + ((y - 2015) / (2024 - 2015)) * 84;
  const Y = (v: number) => 50 - ((v - minY) / (maxY - minY)) * 36;
  const line = trend.map(t => `${X(t.year)},${Y(t.value)}`).join(' ');
  const area = `8,50 ${line} 92,50`;
  const d = 'M ' + trend.map(t => `${X(t.year)} ${Y(t.value)}`).join(' L ');

  return (
    <svg
      viewBox="0 0 100 60"
      className="w-full"
      role="img"
      aria-label="Population over time"
    >
      <defs>
        <linearGradient id="popFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={area}
        fill="url(#popFill)"
        style={{
          opacity: shown ? 1 : 0,
          transition: 'opacity 0.8s ease-out 0.3s',
        }}
      />
      <path
        d={d}
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={shown ? 0 : 1}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
      {trend.map((t, i) => (
        <g key={t.year}>
          <circle
            cx={X(t.year)}
            cy={Y(t.value)}
            r="1.6"
            fill="#fff"
            stroke="#2563eb"
            strokeWidth="1.2"
            style={{
              opacity: shown ? 1 : 0,
              transition: `opacity 0.4s ease-out ${0.6 + i * 0.15}s`,
            }}
          />
          <text
            x={X(t.year)}
            y={Y(t.value) - 3}
            textAnchor="middle"
            fontSize="3.2"
            fontWeight="700"
            fill="#0f172a"
          >
            {fmt.format(t.value)}
          </text>
          <text
            x={X(t.year)}
            y="57"
            textAnchor="middle"
            fontSize="3"
            fill="#64748b"
          >
            {t.year}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Insight({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-[var(--bb-shadow-card)]">
      <span className="mt-0.5 shrink-0 text-primary-600">{icon}</span>
      <p className="text-sm leading-relaxed text-gray-700">{children}</p>
    </div>
  );
}

const PESO0 = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

export default function Statistics() {
  const topBarangays = useMemo(
    () =>
      [...barangays]
        .sort((a, b) => b.population2020 - a.population2020)
        .slice(0, 10),
    []
  );
  const topMax = topBarangays[0]?.population2020 ?? 1;
  const topShare =
    ((topBarangays[0]?.population2020 ?? 0) / POPULATION_TOTAL_2020) * 100;
  const shown = useRevealed();

  return (
    <>
      <SEO
        title="Statistics"
        description={`Population and key statistics for ${siteConfig.name}, Zambales, from PSA census data.`}
        keywords={`${siteConfig.shortName} statistics, population, census, Zambales`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Statistics' }]}
        />

        <SectionHeading
          kicker="Data"
          title={`${siteConfig.shortName} at a glance`}
          description="Key figures for the municipality — who lives here, and what public money means per resident. From the Philippine Statistics Authority and BLGF."
        />

        {/* Tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map(t => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[var(--bb-shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${t.accent}, ${t.accent}b0)`,
                  }}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="text-xs text-gray-500">{t.label}</div>
                <div className="mt-0.5 font-display text-2xl font-bold text-gray-900">
                  {t.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interpretation */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Insight icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}>
            Botolan has added about{' '}
            <strong>{fmt.format(POP_2024 - POP_2015)} residents</strong> since
            2015 — but growth is <strong>slowing</strong>: {GROWTH_2015_2020}% a
            year from 2015–2020, down to about {growthAnnual.toFixed(1)}% a year
            from 2020–2024.
          </Insight>
          <Insight icon={<Users className="h-5 w-5" aria-hidden="true" />}>
            It&rsquo;s a <strong>young town</strong> — a median age of about{' '}
            {MEDIAN_AGE_2015} (2015) — with {fmt.format(HOUSEHOLDS_2015)}{' '}
            households averaging {AVG_HH_2015} members each.
          </Insight>
          <Insight icon={<Layers className="h-5 w-5" aria-hidden="true" />}>
            People are <strong>unevenly spread</strong>: about{' '}
            {topShare.toFixed(0)}% live in {topBarangays[0]?.name} alone, while
            many of the 31 barangays have fewer than 2,000 residents.
          </Insight>
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)]">
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp
                className="h-5 w-5 text-primary-600"
                aria-hidden="true"
              />
              <h2 className="font-display text-xl font-bold text-gray-900">
                Population over time
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              {fmt.format(POP_2015)} in 2015 → {fmt.format(POP_2024)} in 2024.
            </p>
            <PopulationChart />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)]">
            <h2 className="mb-5 font-display text-xl font-bold text-gray-900">
              Largest barangays (2020)
            </h2>
            <div className="space-y-2.5">
              {topBarangays.map((b, i) => {
                const rankColor =
                  i === 0
                    ? '#2563eb'
                    : i === 1
                      ? '#3b82f6'
                      : i === 2
                        ? '#60a5fa'
                        : '#cbd5e1';
                return (
                  <div key={b.slug}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        <span className="mr-1 inline-block w-5 text-gray-400">
                          {i + 1}.
                        </span>
                        {b.name}
                      </span>
                      <span className="text-gray-900">
                        {fmt.format(b.population2020)}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: shown
                            ? `${(b.population2020 / topMax) * 100}%`
                            : '0%',
                          background: rankColor,
                          transition: `width 0.9s ease-out ${i * 60}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Public money per resident */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary-600" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-gray-900">
              Public money per resident
            </h2>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-200">
              {priorYearSummary.label}
            </span>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm text-gray-600">
            Dividing Botolan&rsquo;s official {priorYearSummary.label} budget by
            its {fmt.format(POP_2024)} residents shows what public money means
            per person.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: 'Income per resident',
                value: incomePerCapita,
                note: 'all sources',
              },
              {
                label: 'From the national NTA',
                value: ntaPerCapita,
                note: 'per resident',
              },
              {
                label: 'Spent per resident',
                value: spendPerCapita,
                note: 'operating',
              },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="mt-1 font-display text-2xl font-bold text-gray-900">
                  <CountUp value={s.value} format={n => PESO0.format(n)} />
                </div>
                <div className="mt-0.5 text-xs text-gray-400">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
            <Lightbulb
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p>
              Most of this is the national NTA, not locally raised — see the
              full breakdown on the{' '}
              <Link
                to="/budget"
                className="inline-flex items-center gap-0.5 font-medium text-primary-700 underline"
              >
                budget dashboard
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Sources: Philippine Statistics Authority (2015 &amp; 2020 Census, 2024
          POPCEN; median age &amp; households from 2015), via{' '}
          <a
            href="https://www.philatlas.com/luzon/r03/zambales/botolan.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 underline hover:text-primary-700"
          >
            PhilAtlas
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          . The latest official headcount is the 2024 POPCEN municipal total; no
          2025 municipal census exists, and barangay-level 2024 data is not yet
          fully published. Per-resident figures use the official{' '}
          {priorYearSummary.label} BLGF SRE budget ÷ the 2024 population.
        </p>
      </Section>
    </>
  );
}
