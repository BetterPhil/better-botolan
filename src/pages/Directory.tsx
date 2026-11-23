import { useMemo, useState } from 'react';
import { Building2, Phone, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import BarangayLogo from '../components/barangays/BarangayLogo';
import { departments } from '../data/departments';
import { barangays } from '../data/barangays';
import { siteConfig } from '../config/site';

const TBC = 'To be confirmed';

export default function Directory() {
  const [query, setQuery] = useState('');

  const bgys = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...barangays]
      .filter(b => (q ? b.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  return (
    <>
      <SEO
        title="Government Directory"
        description={`Municipal offices and barangay captains of ${siteConfig.name}, Zambales.`}
        keywords={`${siteConfig.shortName} directory, offices, barangay captains, officials`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Directory' }]}
        />

        <SectionHeading
          kicker="Directory"
          title="Government Directory"
          description="Municipal offices and the 31 barangay captains. Entries marked 'To be confirmed' are being verified with the Municipal Hall."
        />

        {/* Departments */}
        <h2 className="mb-4 font-display text-xl font-semibold text-gray-900">
          Municipal offices
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(d => (
            <div
              key={d.name}
              className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold leading-snug text-gray-900">
                  {d.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                  <UserRound
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  {d.head ?? TBC}
                </p>
                {d.contact && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    {d.contact}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Barangay captains */}
        <div className="mt-12 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-semibold text-gray-900">
            Barangay captains
          </h2>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 sm:w-72">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            <label htmlFor="dir-search" className="sr-only">
              Search barangay
            </label>
            <input
              id="dir-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search barangay…"
              className="w-full bg-transparent py-2.5 text-sm text-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-3 rounded-lg bg-primary-50 px-4 py-2 text-xs text-primary-800">
          Liga ng mga Barangay (ABC) President:{' '}
          <strong>Hon. Fernando D. Onate Jr.</strong>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bgys.map(b => (
            <li key={b.slug}>
              <Link
                to={`/barangays/${b.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-[var(--bb-shadow-card)] transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[var(--bb-shadow-lift)]"
              >
                <BarangayLogo slug={b.slug} name={b.name} size={40} />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-primary-700">
                    {b.name}
                  </h3>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                    Captain: {TBC}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs text-gray-500">
          Help complete this directory: if you know an office head or barangay
          captain, let us know so we can verify and add them.
        </p>
      </Section>
    </>
  );
}
