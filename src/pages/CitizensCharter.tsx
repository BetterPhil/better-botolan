import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Clock,
  Info,
  ListChecks,
  Mail,
  Phone,
  Receipt,
  Search,
  UserCog,
} from 'lucide-react';
import { Link } from 'react-router';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import ServiceDetailModal from '../components/charter/ServiceDetailModal';
import {
  assessorServices,
  charterOffices,
  charterServices,
  type CharterRequirement,
  type CharterService,
} from '../data/charter';
import { siteConfig } from '../config/site';
import { cn } from '../lib/utils';

const allServices: CharterService[] = [...assessorServices, ...charterServices];

function reqText(r: string | CharterRequirement): string {
  return typeof r === 'string' ? r : r.text;
}

function officeFor(name: string) {
  return charterOffices.find(o => o.name === name);
}

function ServiceCard({
  s,
  onOpen,
}: {
  s: CharterService;
  onOpen: (s: CharterService) => void;
}) {
  const hasSteps = Boolean(s.steps && s.steps.length > 0);
  return (
    <article className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)] transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{s.service}</h3>
        {s.official && (
          <BadgeCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-primary-500"
            aria-label="Official charter"
          />
        )}
      </div>
      {s.note && <p className="mt-1 text-xs text-gray-500">{s.note}</p>}

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">
          <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
          {s.totalFee ?? s.fee}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {s.totalTime ?? s.processingTime}
        </span>
        {hasSteps && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            {s.steps!.length} steps
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Requirements
      </p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
        {s.requirements.slice(0, 3).map((r, i) => (
          <li key={i}>{reqText(r)}</li>
        ))}
        {s.requirements.length > 3 && (
          <li className="list-none text-xs text-gray-400">
            + {s.requirements.length - 3} more
          </li>
        )}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">
          {s.legalBasis ? `Legal basis: ${s.legalBasis}` : ''}
        </span>
        <div className="flex items-center gap-3">
          {s.guideHref && (
            <Link
              to={s.guideHref}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          {hasSteps && (
            <button
              type="button"
              onClick={() => onOpen(s)}
              className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              View process
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CitizensCharter() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<CharterService | null>(null);
  // First office (Municipal Assessor's) open by default.
  const [openOffices, setOpenOffices] = useState<Set<string>>(
    () => new Set([allServices[0]?.office])
  );

  const searching = query.trim().length > 0;

  const toggleOffice = (name: string) =>
    setOpenOffices(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? allServices.filter(
          s =>
            s.service.toLowerCase().includes(q) ||
            s.office.toLowerCase().includes(q)
        )
      : allServices;
    const map = new Map<string, CharterService[]>();
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
          description="The frontline services of the municipality — what to bring, the fees, and how long each step takes. Tap an office to see its services. Under RA 11032, transactions are acted on within 3 working days (simple), 7 (complex) or 20 (highly technical)."
        />

        {/* notice */}
        <div className="mb-8 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Services marked{' '}
            <span className="inline-flex items-center gap-1 font-semibold">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Official
              charter
            </span>{' '}
            are transcribed from the office&apos;s published Citizen&apos;s
            Charter. Others show requirements only; confirm exact fees and times
            with the office.
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
          <div className="space-y-4">
            {grouped.map(([office, services]) => {
              const meta = officeFor(office);
              const isOpen = searching || openOffices.has(office);
              const panelId = `office-${office.replace(/\W+/g, '-')}`;
              return (
                <div
                  key={office}
                  className={cn(
                    'overflow-hidden rounded-2xl border transition-colors',
                    isOpen
                      ? 'border-primary-200 bg-white'
                      : 'border-gray-200 bg-white'
                  )}
                >
                  {/* Accordion trigger */}
                  <button
                    type="button"
                    onClick={() => toggleOffice(office)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className={cn(
                      'flex w-full items-center gap-3 px-5 py-4 text-left transition-colors',
                      isOpen
                        ? 'bg-gradient-to-br from-primary-50/70 to-white'
                        : 'bg-gradient-to-br from-gray-50 to-white hover:from-gray-100'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h2 className="font-display text-lg font-bold text-gray-900 sm:text-xl">
                          {office}
                        </h2>
                        {meta && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-200">
                            <BadgeCheck
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            Official charter
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="hidden shrink-0 text-sm font-medium text-gray-400 sm:inline">
                      {services.length}{' '}
                      {services.length === 1 ? 'service' : 'services'}
                    </span>
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                        isOpen
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 transition-transform duration-300 motion-reduce:transition-none',
                          isOpen && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  {/* Expandable body */}
                  <div
                    id={panelId}
                    className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={cn(
                          'px-5 pb-5',
                          !isOpen && 'pointer-events-none'
                        )}
                        aria-hidden={!isOpen}
                      >
                        {meta && (
                          <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-gray-100 pb-4 text-sm text-gray-600">
                            {meta.head && (
                              <span className="inline-flex items-center gap-1.5">
                                <UserCog
                                  className="h-4 w-4 text-primary-600"
                                  aria-hidden="true"
                                />
                                {meta.head}
                              </span>
                            )}
                            {meta.email && (
                              <a
                                href={`mailto:${meta.email}`}
                                className="inline-flex items-center gap-1.5 hover:text-primary-700"
                              >
                                <Mail
                                  className="h-4 w-4 text-primary-600"
                                  aria-hidden="true"
                                />
                                {meta.email}
                              </a>
                            )}
                            {meta.phone && (
                              <a
                                href={`tel:${meta.phone.replace(/[^\d+]/g, '')}`}
                                className="inline-flex items-center gap-1.5 hover:text-primary-700"
                              >
                                <Phone
                                  className="h-4 w-4 text-primary-600"
                                  aria-hidden="true"
                                />
                                {meta.phone}
                              </a>
                            )}
                          </div>
                        )}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                          {services.map(s => (
                            <ServiceCard
                              key={s.service}
                              s={s}
                              onOpen={setActive}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-10 text-xs text-gray-500">
          Services marked &ldquo;Official charter&rdquo; are transcribed from
          the office&apos;s published Citizen&apos;s Charter. For other offices,
          and for the most current fees and timelines, contact the Municipal
          Government of {siteConfig.shortName}.
        </p>
      </Section>

      {active && (
        <ServiceDetailModal
          service={active}
          office={officeFor(active.office)}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
