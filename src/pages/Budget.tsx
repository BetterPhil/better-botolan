import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  HandCoins,
  Info,
  Lightbulb,
  PieChart,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import NtaGauge from '../components/budget/NtaGauge';
import BudgetSideNav from '../components/budget/BudgetSideNav';
import { siteConfig } from '../config/site';
import {
  SRE_CURRENT,
  SRE_PRIOR,
  budgetGlossary,
  budgetSources,
  expendituresCurrent,
  formatPesoFull,
  formatPesoShort,
  incomeCurrent,
  keyFigures,
  ntaShare,
  priorYearSummary,
  socialServicesCurrent,
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

function DonutPanel({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: SpendItem[];
}) {
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
        {icon}
        {title}
      </p>
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative shrink-0">
          <Donut items={items} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400">Total</span>
            <span className="font-display text-xl font-bold text-gray-900">
              {formatPesoShort(total)}
            </span>
          </div>
        </div>
        <ul className="w-full space-y-2">
          {items.map(item => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="truncate text-gray-700">{item.label}</span>
              </span>
              <span className="shrink-0 font-semibold text-gray-900">
                {formatPesoShort(item.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Plain-language "what this means" callout. */
function Insight({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <Lightbulb
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
        aria-hidden="true"
      />
      <p className="text-sm leading-relaxed text-amber-900">
        <span className="font-semibold">What this means: </span>
        {children}
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">
      {children}
    </h2>
  );
}

export default function Budget() {
  const localTotal = incomeCurrent
    .filter(i => i.label !== 'National Tax Allotment')
    .reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <SEO
        title="Where the Money Goes — Budget"
        description={`A plain-language look at how the Municipality of ${siteConfig.shortName}, Zambales raises and spends public money.`}
        keywords={`${siteConfig.shortName} budget, transparency, spending, NTA, SRE`}
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
          description="A plain-language look at how Botolan raises and spends public money — so residents, students and researchers can study it clearly."
        />

        {/* Current period label */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
          <span className="h-2 w-2 rounded-full bg-primary-500" />
          {SRE_CURRENT.periodLabel} · {SRE_CURRENT.coverage}
        </div>

        {/* Docs-style layout: sticky nav + content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
          <BudgetSideNav />

          <div className="min-w-0 space-y-14">
            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-24">
              <SectionTitle>Overview</SectionTitle>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {keyFigures.map(fig => (
                  <div
                    key={fig.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                      {fig.label}
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-gray-900">
                      {fig.value != null ? (
                        <CountUpPeso value={fig.value} />
                      ) : (
                        fig.display
                      )}
                    </p>
                    <p className="mt-1.5 text-xs text-gray-500">{fig.detail}</p>
                  </div>
                ))}
              </div>
              <Insight>
                Almost all of Botolan&rsquo;s money comes from the national
                government, and most of it is spent on running the local
                government and on social services like health and welfare. The
                sections below break down where it comes from and where it goes.
              </Insight>
            </section>

            {/* INCOME */}
            <section id="income" className="scroll-mt-24">
              <SectionTitle>Where the money comes from</SectionTitle>
              <div className="mt-4">
                <DonutPanel
                  icon={
                    <HandCoins
                      className="h-5 w-5 text-primary-600"
                      aria-hidden="true"
                    />
                  }
                  title="Income by source"
                  items={incomeCurrent}
                />
              </div>
              <Insight>
                Income has three parts. The{' '}
                <strong>National Tax Allotment (NTA)</strong> is Botolan&rsquo;s
                share of national taxes, sent by the national government.{' '}
                <strong>Local tax revenue</strong> is what residents and
                businesses pay in local taxes, like real-property and business
                tax. <strong>Non-tax revenue</strong> is fees and charges for
                government services. The NTA is by far the largest.
              </Insight>
            </section>

            {/* DEPENDENCE (hero) */}
            <section id="dependence" className="scroll-mt-24">
              <SectionTitle>How much depends on the nation</SectionTitle>
              <div className="mt-4">
                <NtaGauge
                  ntaShare={ntaShare}
                  ntaAmount={399_038_038}
                  localAmount={localTotal}
                />
              </div>
              <Insight>
                Like most Philippine towns, Botolan leans heavily on the
                national government. Because the NTA is such a large share, the
                town has limited money it fully controls on its own, and
                national decisions about the NTA strongly affect local services.
                Growing local revenue is how a town gains more independence.
              </Insight>
            </section>

            {/* SPENDING */}
            <section id="spending" className="scroll-mt-24">
              <SectionTitle>Where the money goes</SectionTitle>
              <div className="mt-4">
                <DonutPanel
                  icon={
                    <PieChart
                      className="h-5 w-5 text-primary-600"
                      aria-hidden="true"
                    />
                  }
                  title="Spending by purpose"
                  items={expendituresCurrent}
                />
              </div>
              <Insight>
                Spending is grouped by purpose.{' '}
                <strong>General Public Services</strong> keeps the government
                running — offices, administration, and peace &amp; order.{' '}
                <strong>Social Services</strong> covers health, welfare,
                education and housing, the services residents feel most
                directly. <strong>Economic Services</strong> supports
                agriculture, livelihood and local infrastructure.{' '}
                <strong>Debt Service</strong> is interest paid on loans.
              </Insight>
            </section>

            {/* SOCIAL */}
            <section id="social" className="scroll-mt-24">
              <SectionTitle>Social services up close</SectionTitle>
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                  <TrendingUp
                    className="h-5 w-5 text-primary-600"
                    aria-hidden="true"
                  />
                  Social services spending
                </p>
                <Bars items={socialServicesCurrent} />
              </div>
              <Insight>
                These are the services residents feel most. Health and social
                welfare take the largest shares, followed by education —
                together{' '}
                {formatPesoShort(
                  socialServicesCurrent.reduce((s, i) => s + i.amount, 0)
                )}{' '}
                so far this year.
              </Insight>
            </section>

            {/* COMPARE */}
            <section id="compare" className="scroll-mt-24">
              <SectionTitle>Compared with last year</SectionTitle>
              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="font-display text-lg font-bold text-gray-900">
                  {priorYearSummary.label}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  The last complete year. The {SRE_CURRENT.periodLabel} figures
                  above cover only 9 months, so these totals are{' '}
                  <span className="font-semibold">not</span> directly comparable
                  — compare the shares, not the totals.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { k: 'Total income', v: priorYearSummary.income },
                    {
                      k: 'Total expenditures',
                      v: priorYearSummary.expenditures,
                    },
                    { k: 'National Tax Allotment', v: priorYearSummary.nta },
                  ].map(x => (
                    <div
                      key={x.k}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <p className="text-xs text-gray-500">{x.k}</p>
                      <p className="mt-1 font-display text-xl font-bold text-gray-900">
                        {formatPesoShort(x.v)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="scroll-mt-24">
              <SectionTitle>About the data</SectionTitle>

              {/* Glossary */}
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                  <BookOpen
                    className="h-5 w-5 text-primary-600"
                    aria-hidden="true"
                  />
                  Terms, in plain language
                </p>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {budgetGlossary.map(g => (
                    <div key={g.term}>
                      <dt className="text-sm font-semibold text-gray-900">
                        {g.term}
                      </dt>
                      <dd className="mt-0.5 text-sm text-gray-600">
                        {g.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Sources */}
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                  <Wallet
                    className="h-5 w-5 text-blue-600"
                    aria-hidden="true"
                  />
                  Official sources
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  These figures are the Bureau of Local Government Finance
                  (BLGF) Statement of Receipts &amp; Expenditures for Botolan —{' '}
                  {SRE_CURRENT.periodLabel} ({SRE_CURRENT.status}) for the
                  headline, with {SRE_PRIOR.periodLabel} for context. Verify or
                  go deeper at the official portals:
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
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Provenance */}
              <p className="mt-6 flex items-start gap-2 text-xs text-gray-400">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                Source: BLGF Statement of Receipts &amp; Expenditures,{' '}
                {SRE_CURRENT.periodLabel} ({SRE_CURRENT.status}), extracted{' '}
                {SRE_CURRENT.extracted}; {SRE_CURRENT.coverage}. Headline totals
                — income {formatPesoFull(480_463_638)}, expenditures{' '}
                {formatPesoFull(318_598_042)} — are for 9 months, not a full
                year. Figures are actual receipts and expenditures, not the
                appropriations ordinance. Acknowledgement to the BLGF as the
                data source.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </>
  );
}
