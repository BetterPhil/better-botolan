import { useMemo, useState } from 'react';
import { GraduationCap, School as SchoolIcon, Search } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';
import {
  SCHOOLS_PRIVATE,
  SCHOOLS_PUBLIC,
  SCHOOLS_SOURCE,
  SCHOOLS_TOTAL,
  schools,
  type SchoolLevel,
} from '../data/schools';

type Filter = 'all' | 'Public' | 'Private' | SchoolLevel;

const levelColor: Record<string, string> = {
  Elementary: 'bg-primary-50 text-primary-700',
  Secondary: 'bg-secondary-50 text-secondary-700',
  Integrated: 'bg-green-50 text-green-700',
  Other: 'bg-gray-100 text-gray-600',
};

export default function Schools() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schools
      .filter(s => {
        if (filter === 'Public' || filter === 'Private')
          return s.sector === filter;
        if (filter !== 'all') return s.level === filter;
        return true;
      })
      .filter(s => (q ? s.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, filter]);

  const chips: Filter[] = [
    'all',
    'Public',
    'Private',
    'Elementary',
    'Secondary',
    'Integrated',
  ];

  return (
    <>
      <SEO
        title="Schools"
        description={`Directory of public and private schools in ${siteConfig.name}, ${siteConfig.province}.`}
        keywords={`${siteConfig.shortName} schools, DepEd, education, Zambales`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Schools' }]}
        />

        <SectionHeading
          kicker="Directory"
          title={`Schools in ${siteConfig.shortName}`}
          description={`${SCHOOLS_TOTAL} schools serve Botolan. Level is inferred from each school's name; verify with the DepEd Schools Division of Zambales.`}
        />

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="text-sm text-gray-600">Total</div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              {SCHOOLS_TOTAL}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="text-sm text-gray-600">Public</div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              {SCHOOLS_PUBLIC}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="text-sm text-gray-600">Private</div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              {SCHOOLS_PRIVATE}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <label htmlFor="school-search" className="sr-only">
              Search schools
            </label>
            <input
              id="school-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search school…"
              className="w-full bg-transparent py-2.5 text-sm text-gray-900 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {chips.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  filter === c
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="text-gray-600">No school matches “{query}”.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(s => (
              <li
                key={s.name}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--bb-shadow-card)] transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[var(--bb-shadow-lift)]"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  {s.sector === 'Public' ? (
                    <SchoolIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {s.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {s.sector}
                    </span>
                    {s.level !== 'Other' && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${levelColor[s.level]}`}
                      >
                        {s.level}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-xs text-gray-500">
          Source: DepEd data via{' '}
          <a
            href={SCHOOLS_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary-700"
          >
            TeacherPH
          </a>
          . School levels are inferred from names and should be confirmed with
          the DepEd Schools Division of Zambales.
        </p>
      </Section>
    </>
  );
}
