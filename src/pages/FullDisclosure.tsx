import {
  Banknote,
  ExternalLink,
  FileSearch,
  Landmark,
  Package,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import {
  FDP_ABOUT,
  FDP_PORTAL,
  disclosureDocs,
  type DisclosureDoc,
} from '../data/disclosureDocs';
import { siteConfig } from '../config/site';

const groupIcon: Record<DisclosureDoc['group'], LucideIcon> = {
  'Budget & Finance': Banknote,
  Procurement: Package,
  'Special Funds': Landmark,
};
const groups: DisclosureDoc['group'][] = [
  'Budget & Finance',
  'Procurement',
  'Special Funds',
];

export default function FullDisclosure() {
  return (
    <>
      <SEO
        title="Full Disclosure"
        description={`Full Disclosure Policy documents for ${siteConfig.name}, as published on the DILG FDP Portal.`}
        keywords={`${siteConfig.shortName} full disclosure, DILG, budget, transparency`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Transparency', href: '/transparency' },
            { label: 'Full Disclosure', href: '/full-disclosure' },
          ]}
        />

        <SectionHeading
          kicker="Transparency"
          title="Full Disclosure Policy"
          description="Under the DILG's Full Disclosure Policy, every LGU publishes key budget, finance and procurement documents for the public."
        />

        {/* Intro / portal link */}
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="max-w-xl text-sm text-gray-700">
              The official documents for {siteConfig.name} are hosted on the
              DILG Full Disclosure Policy Portal. Search for{' '}
              <strong>Botolan, Zambales</strong> there to view and download the
              latest filings.
            </p>
          </div>
          <a
            href={FDP_PORTAL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <FileSearch className="h-4 w-4" aria-hidden="true" />
            Open the FDP Portal
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Document groups */}
        <div className="space-y-10">
          {groups.map(group => {
            const Icon = groupIcon[group];
            const docs = disclosureDocs.filter(d => d.group === group);
            return (
              <div key={group}>
                <div className="mb-4 flex items-center gap-2">
                  <Icon
                    className="h-5 w-5 text-primary-600"
                    aria-hidden="true"
                  />
                  <h2 className="font-display text-xl font-semibold text-gray-900">
                    {group}
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {docs.map(doc => (
                    <div
                      key={doc.name}
                      className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {doc.name}
                      </h3>
                      <p className="mt-1 flex-1 text-sm text-gray-600">
                        {doc.description}
                      </p>
                      <a
                        href={FDP_PORTAL}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Find on FDP Portal
                        <ExternalLink
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-xs text-gray-500">
          This page lists the standard documents required under the DILG Full
          Disclosure Policy. The actual filings are published on the{' '}
          <a
            href={FDP_ABOUT}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary-700"
          >
            DILG FDP Portal
          </a>
          . If a document is not yet posted, you may request it from the
          Municipal Government of {siteConfig.shortName}.
        </p>
      </Section>
    </>
  );
}
