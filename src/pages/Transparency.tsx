import { Link } from 'react-router';
import {
  ArrowRight,
  Banknote,
  ExternalLink,
  FileText,
  Megaphone,
  ScrollText,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import { siteConfig } from '../config/site';
import { BUDGET_SITE } from '../lib/budgetApi';

export default function Transparency() {
  return (
    <>
      <SEO
        title="Transparency"
        description={`Budget, projects, ordinances and public notices for ${siteConfig.name}.`}
        keywords={`${siteConfig.shortName}, transparency, budget, ordinances, full disclosure`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Transparency' }]}
        />

        <Heading level={1}>Transparency</Heading>
        <Text className="mt-2 max-w-3xl text-gray-600">
          Public information about how {siteConfig.name} is funded and governed.
          Where a national source exists, we link to it directly so you can
          check the original.
        </Text>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Budget: live, links to our Projects page */}
          <article className="rounded-xl border border-gray-200 border-t-4 border-t-primary-600 bg-white p-6">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
              <Banknote className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">
              Budget &amp; projects
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              FY2027 national-budget projects that name {siteConfig.shortName},
              drawn live from the BetterGov.ph Budget API.
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View budget projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          {/* Ordinances: placeholder until collected */}
          <article className="rounded-xl border border-gray-200 border-t-4 border-t-gray-300 bg-white p-6">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <ScrollText className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">
              Ordinances &amp; resolutions
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Local laws passed by the Sangguniang Bayan. This section is being
              built. If you have copies of Botolan ordinances, please help us
              add them.
            </p>
            <a
              href={`${siteConfig.repoUrl}/issues`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Contribute ordinances
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>

          {/* Public notices: placeholder */}
          <article className="rounded-xl border border-gray-200 border-t-4 border-t-gray-300 bg-white p-6">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Megaphone className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">
              Public notices
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Bid notices, hiring announcements and other public postings. This
              section is being built.
            </p>
          </article>

          {/* Full Disclosure Policy explainer */}
          <article className="rounded-xl border border-gray-200 border-t-4 border-t-gray-300 bg-white p-6">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <FileText className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-gray-900">
              Full Disclosure Policy
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Under DILG rules, LGUs publish key budget and finance documents,
              such as the budget, procurement and financial statements. Ask the
              Municipal Hall for Botolan&apos;s Full Disclosure postings.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-xl bg-gray-50 p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Where the budget data comes from
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            The budget figures on this portal come from the{' '}
            <a
              href={`${BUDGET_SITE}/docs`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-0.5 text-primary-600 underline"
            >
              BetterGov.ph Budget API
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            , which is built from Department of Budget and Management (DBM)
            publications. Always verify against official DBM documents before
            citing in formal work.
          </p>
        </div>
      </Section>
    </>
  );
}
