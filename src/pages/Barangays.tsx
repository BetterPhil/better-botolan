import { useMemo, useState } from 'react';
import { Search, Users, ArrowRight, UserRound } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import BarangayLogo from '../components/barangays/BarangayLogo';
import BarangayModal from '../components/barangays/BarangayModal';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';
import {
  BARANGAY_COUNT,
  BARANGAY_SOURCE,
  POPULATION_TOTAL_2020,
  barangays,
  getCaptain,
  type Barangay,
} from '../data/barangays';

type SortKey = 'name' | 'population';

const numberFmt = new Intl.NumberFormat('en-PH');

function growth(b: Barangay): number | null {
  if (!b.population2015) return null;
  return ((b.population2020 - b.population2015) / b.population2015) * 100;
}

export default function Barangays() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [selected, setSelected] = useState<Barangay | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? barangays.filter(b => b.name.toLowerCase().includes(q))
      : barangays;
    const sorted = [...filtered].sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : b.population2020 - a.population2020
    );
    return sorted;
  }, [query, sort]);

  return (
    <>
      <SEO
        title="Barangays"
        description={`Directory of the ${BARANGAY_COUNT} barangays of ${siteConfig.name}, ${siteConfig.province}, with populations.`}
        keywords={`${siteConfig.shortName} barangays, Zambales, population, directory`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Barangays' }]}
        />

        <SectionHeading
          kicker="Directory"
          title={`The ${BARANGAY_COUNT} Barangays of ${siteConfig.shortName}`}
          description={`${siteConfig.name} is made up of ${BARANGAY_COUNT} barangays. Populations are from the 2020 Census (PSA).`}
        />

        {/* Summary tiles */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="text-sm text-gray-600">Barangays</div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              {BARANGAY_COUNT}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="text-sm text-gray-600">Population (2020)</div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              {numberFmt.format(POPULATION_TOTAL_2020)}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="text-sm text-gray-600">Largest barangay</div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              Taugtog
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <label htmlFor="bgy-search" className="sr-only">
              Search barangays
            </label>
            <input
              id="bgy-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search barangay…"
              className="w-full bg-transparent py-2.5 text-sm text-gray-900 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Sort:</span>
            <button
              type="button"
              onClick={() => setSort('name')}
              className={`rounded-full px-3 py-1.5 font-medium ${
                sort === 'name'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              A–Z
            </button>
            <button
              type="button"
              onClick={() => setSort('population')}
              className={`rounded-full px-3 py-1.5 font-medium ${
                sort === 'population'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Population
            </button>
          </div>
        </div>

        {/* Grid of barangays */}
        {rows.length === 0 ? (
          <p className="text-gray-600">No barangay matches “{query}”.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(b => {
              const g = growth(b);
              const captain = getCaptain(b.slug);
              return (
                <li key={b.slug}>
                  <button
                    type="button"
                    onClick={() => setSelected(b)}
                    className="group flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-[var(--bb-shadow-card)] transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[var(--bb-shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  >
                    <div className="flex items-center gap-3">
                      <BarangayLogo slug={b.slug} name={b.name} size={48} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900 group-hover:text-primary-700">
                          {b.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {b.poblacion && (
                            <span className="rounded-full bg-secondary-50 px-2 py-0.5 text-[11px] font-medium text-secondary-700">
                              Poblacion
                            </span>
                          )}
                          {b.history && b.history.length > 0 && (
                            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700">
                              History
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {captain && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-600">
                        <UserRound
                          className="h-3.5 w-3.5 text-primary-600"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          <span className="text-gray-400">Captain: </span>
                          {captain}
                        </span>
                      </div>
                    )}

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Users className="h-3.5 w-3.5" aria-hidden="true" />
                          Population (2020)
                        </div>
                        <div className="font-display text-2xl font-semibold text-gray-900">
                          {numberFmt.format(b.population2020)}
                        </div>
                      </div>
                      {g !== null && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            g >= 0
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                          title="Change from 2015 to 2020"
                        >
                          {g >= 0 ? '+' : ''}
                          {g.toFixed(1)}%
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs font-medium text-gray-400">
                        View details
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-8 text-xs text-gray-500">
          Source: Philippine Statistics Authority, 2020 Census of Population and
          Housing, via{' '}
          <a
            href={BARANGAY_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary-700"
          >
            PhilAtlas
          </a>
          . The 2024 municipal total is 70,340; barangay-level 2024 figures are
          not all published yet.
        </p>
      </Section>

      <BarangayModal barangay={selected} onClose={() => setSelected(null)} />
    </>
  );
}
