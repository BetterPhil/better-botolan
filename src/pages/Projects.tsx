import { useMemo, useState } from 'react';
import { Banner } from '@bettergov/kapwa/banner';
import { ArrowUpRight, Download, ExternalLink, RefreshCw } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import BudgetDisclaimers from '../components/sections/BudgetDisclaimers';
import { useBotolanBudget } from '../hooks/useBotolanBudget';
import { siteConfig } from '../config/site';
import {
  BUDGET_SITE,
  FALLBACK_DISCLAIMERS,
  PROGRAMS,
  rowsToCsv,
  totalsFor,
  type ProgramKey,
  type ProjectRow,
} from '../lib/budgetApi';
import { formatPeso, formatPesoCompact } from '../lib/format';

type Filter = 'all' | ProgramKey;

function downloadCsv(rows: ProjectRow[]) {
  const blob = new Blob([rowsToCsv(rows)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'botolan-fy2027-budget-projects.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Projects() {
  const { loading, result, error, reload } = useBotolanBudget('Botolan');
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => result?.rows ?? [], [result]);
  const visibleRows = useMemo(
    () => (filter === 'all' ? rows : rows.filter(r => r.program === filter)),
    [rows, filter]
  );
  const totals = useMemo(() => totalsFor(visibleRows), [visibleRows]);

  const programsPresent = useMemo(() => {
    const set = new Set(rows.map(r => r.program));
    return (Object.keys(PROGRAMS) as ProgramKey[]).filter(k => set.has(k));
  }, [rows]);

  const disclaimers =
    result && result.disclaimers.length > 0
      ? result.disclaimers
      : FALLBACK_DISCLAIMERS;

  return (
    <>
      <SEO
        title="Projects"
        description={`FY2027 budget projects for ${siteConfig.name}, from the BetterGov.ph Budget API.`}
        keywords={`${siteConfig.shortName}, budget, projects, FY2027, DPWH, transparency`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
        />

        <Heading level={1}>FY2027 Budget Projects</Heading>
        <Text className="mt-2 max-w-3xl text-gray-600">
          National-government projects whose title names {siteConfig.shortName},
          in the FY2027 budget. Figures come live from the{' '}
          <a
            href={`${BUDGET_SITE}/docs`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 text-primary-600 underline"
          >
            BetterGov.ph Budget API
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          . These are lines in the proposed budget (the NEP) and the House bill,
          not a list of the municipality&apos;s own spending.
        </Text>

        {loading && (
          <div className="mt-8">
            <Banner
              type="info"
              description="Loading budget data from BetterGov.ph…"
            />
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 space-y-4">
            <Banner
              type="error"
              title="Couldn't load the budget data"
              description="The BetterGov.ph Budget API could not be reached. This does not mean there are no projects; please try again."
              icon
            />
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {!loading && result && (
          <div className="mt-8 space-y-6">
            {result.failed.length > 0 && (
              <Banner
                type="warning"
                description={`Some programs could not be loaded (${result.failed
                  .map(k => PROGRAMS[k].short)
                  .join(', ')}). The list below may be incomplete.`}
              />
            )}

            {rows.length === 0 ? (
              <Banner
                type="info"
                title="No FY2027 budget lines name Botolan yet"
                description="The API finds projects by the place named in their title. A project in Botolan funded under a district-wide line may not appear here. Check the BetterGov budget site for the district view."
              />
            ) : (
              <>
                {/* Totals: NEP and House shown separately, never summed. */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="text-sm text-gray-600">
                      Projects naming Botolan
                    </div>
                    <div className="mt-1 text-3xl font-bold text-gray-900">
                      {totals.count}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="text-sm text-gray-600">
                      Proposed budget (NEP)
                    </div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">
                      {formatPesoCompact(totals.nep)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="text-sm text-gray-600">House bill</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">
                      {formatPesoCompact(totals.house)}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  The proposed budget and the House bill are two versions of one
                  budget. They are shown side by side and are never added
                  together.
                </p>

                {/* Program filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                      filter === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({rows.length})
                  </button>
                  {programsPresent.map(key => {
                    const n = rows.filter(r => r.program === key).length;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFilter(key)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                          filter === key
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {PROGRAMS[key].short} ({n})
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => downloadCsv(visibleRows)}
                    className="ml-auto inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download CSV
                  </button>
                </div>

                {/* Project list */}
                <ul className="space-y-3">
                  {visibleRows.map(row => (
                    <li
                      key={`${row.program}-${row.id}`}
                      className="rounded-xl border border-gray-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="inline-block rounded bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                            {PROGRAMS[row.program].short}
                          </span>
                          <h3 className="mt-2 font-medium text-gray-900">
                            {row.title}
                          </h3>
                          {row.status_label && (
                            <p className="mt-1 text-sm text-gray-500">
                              Status: {row.status_label}
                            </p>
                          )}
                        </div>
                        {row.url && (
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                          >
                            Source
                            <ArrowUpRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </a>
                        )}
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm sm:grid-cols-3">
                        <div>
                          <dt className="text-gray-500">Proposed (NEP)</dt>
                          <dd className="font-semibold text-gray-900">
                            {formatPeso(row.nep_php)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">House bill</dt>
                          <dd className="font-semibold text-gray-900">
                            {formatPeso(row.house_php)}
                          </dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <BudgetDisclaimers disclaimers={disclaimers} />

            <p className="text-xs text-gray-500">
              Data: People&apos;s Budget Coalition × BetterGov.PH, FY2027
              budget. Retrieved{' '}
              {new Date(result.fetchedAt).toLocaleDateString('en-PH')}. Verify
              against official DBM documents before citing.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
