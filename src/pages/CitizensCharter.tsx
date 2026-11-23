import { useMemo, useState } from 'react';
import { ArrowRight, Clock, Info, Receipt, Search } from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { charterServices } from '../data/charter';
import { siteConfig } from '../config/site';

export default function CitizensCharter() {
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? charterServices.filter(
          s =>
            s.service.toLowerCase().includes(q) ||
            s.office.toLowerCase().includes(q)
        )
      : charterServices;
    const map = new Map<string, typeof charterServices>();
    filtered.forEach(s => {
      const list = map.get(s.office) ?? [];
      list.push(s);
      map.set(s.office, list);
    });
    return Array.from(map.entries());
  }, [query]);

  return (
    <>
      <SEO
        title="Citizen's Charter"
        description={`Frontline services of ${siteConfig.name}: requirements, fees and processing times.`}
        keywords={`${siteConfig.shortName} citizen's charter, services, requirements, ARTA, RA 11032`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: "Citizen's Charter" }]}
        />

        <SectionHeading
          kicker="Services"
          title="Citizen's Charter"
          description="The frontline services of the municipality, with their requirements. Under RA 11032, transactions are acted on within 3 working days (simple), 7 (complex) or 20 (highly technical)."
        />

        {/* notice */}
        <div className="mb-8 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Official <strong>fees</strong> and exact{' '}
            <strong>processing times</strong> are set by the LGU&apos;s official
            Citizen&apos;s Charter. Items marked &ldquo;To be confirmed&rdquo;
            should be verified with the office before you go.
          </span>
        </div>

        {/* search */}
        <div className="mb-8 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3">
          <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <label htmlFor="charter-search" className="sr-only">
            Search services
          </label>
          <input
            id="charter-search"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search a service or office…"
            className="w-full bg-transparent py-2.5 text-sm text-gray-900 focus:outline-none"
          />
        </div>

        {grouped.length === 0 ? (
          <p className="text-gray-600">
            No service matches &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="space-y-10">
            {grouped.map(([office, services]) => (
              <div key={office}>
                <h2 className="mb-4 font-display text-xl font-semibold text-gray-900">
                  {office}
                </h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {services.map(s => (
                    <div
                      key={s.service}
                      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {s.service}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">
                          <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                          {s.fee}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {s.processingTime}
                        </span>
                      </div>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Requirements
                      </p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
                        {s.requirements.map(r => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-xs text-gray-400">
                          {s.legalBasis ? `Legal basis: ${s.legalBasis}` : ''}
                        </span>
                        {s.guideHref && (
                          <Link
                            to={s.guideHref}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            How-to guide
                            <ArrowRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-gray-500">
          Service details are derived from this portal&apos;s how-to guides and
          national law. For the official Citizen&apos;s Charter with exact fees
          and timelines, contact the Municipal Government of{' '}
          {siteConfig.shortName}.
        </p>
      </Section>
    </>
  );
}
