import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Github,
  ScrollText,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Banner } from '@bettergov/kapwa/banner';
import {
  getBarangay,
  getCaptain,
  personInitials,
  PUNONG_BARANGAYS_ASOF,
  BARANGAY_SOURCE,
} from '../data/barangays';
import BarangayLogo from '../components/barangays/BarangayLogo';
import { siteConfig } from '../config/site';

const numberFmt = new Intl.NumberFormat('en-PH');

export default function BarangayDetail() {
  const { slug } = useParams();
  const barangay = slug ? getBarangay(slug) : undefined;

  if (!barangay) {
    return (
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title="Barangay not found"
          description="We couldn't find that barangay. It may have been renamed or mistyped."
          icon
        />
        <Link
          to="/barangays"
          className="mt-6 inline-flex items-center gap-1 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all barangays
        </Link>
      </Section>
    );
  }

  const growth =
    barangay.population2015 > 0
      ? ((barangay.population2020 - barangay.population2015) /
          barangay.population2015) *
        100
      : null;
  const grew = (growth ?? 0) >= 0;
  const hasHistory = (barangay.history?.length ?? 0) > 0;
  const captain = getCaptain(barangay.slug);

  return (
    <>
      <SEO
        title={`${barangay.name} — Barangay`}
        description={`Profile and history of Barangay ${barangay.name}, ${siteConfig.name}, ${siteConfig.province}.`}
        keywords={`${barangay.name}, ${siteConfig.shortName} barangay, Zambales, history`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Barangays', href: '/barangays' },
            { label: barangay.name },
          ]}
        />

        {/* Header */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <BarangayLogo slug={barangay.slug} name={barangay.name} size={64} />
            <div>
              <span className="bb-kicker">Barangay</span>
              <Heading level={1} className="mt-2 mb-0">
                {barangay.name}
              </Heading>
              {barangay.tags && barangay.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {barangay.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {captain && (
            <div className="mt-6 flex items-center gap-4 rounded-xl border border-primary-100 bg-white/70 p-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 font-display text-lg font-bold text-white shadow-sm">
                {personInitials(captain)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  Punong Barangay
                </p>
                <p className="font-display text-lg font-semibold text-gray-900">
                  {captain}
                </p>
                <p className="text-xs text-gray-400">
                  As of {PUNONG_BARANGAYS_ASOF}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Users className="h-4 w-4" aria-hidden="true" />
              Population (2020)
            </div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              {numberFmt.format(barangay.population2020)}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
            <div className="text-sm text-gray-500">Population (2015)</div>
            <div className="font-display text-3xl font-semibold text-gray-900">
              {numberFmt.format(barangay.population2015)}
            </div>
          </div>
          {growth !== null && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]">
              <div className="text-sm text-gray-500">Change 2015–2020</div>
              <div
                className={`flex items-center gap-1 font-display text-3xl font-semibold ${
                  grew ? 'text-green-700' : 'text-gray-700'
                }`}
              >
                {grew ? (
                  <TrendingUp className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-6 w-6" aria-hidden="true" />
                )}
                {grew ? '+' : ''}
                {growth.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary-600" aria-hidden="true" />
          <Heading level={2} className="mb-0">
            History
          </Heading>
        </div>

        {hasHistory ? (
          <div className="mt-6 max-w-3xl">
            <article className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)] sm:p-8">
              {barangay.history!.map((para, i) => (
                <p key={i} className="leading-relaxed text-gray-700">
                  {para}
                </p>
              ))}
            </article>
            {barangay.sources && barangay.sources.length > 0 && (
              <p className="mt-4 text-xs text-gray-500">
                Sources:{' '}
                {barangay.sources.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && ' · '}
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 underline hover:text-primary-700"
                    >
                      {s.label}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        ) : (
          /* Modern empty state */
          <div className="mt-6 max-w-3xl">
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 p-8 text-center sm:p-12">
              <div
                aria-hidden="true"
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-[var(--bb-shadow-card)]"
              >
                <ScrollText className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900">
                No history recorded yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-gray-600">
                We don&apos;t have a documented history for Barangay{' '}
                {barangay.name} yet. If you know its story — how it was named,
                its founding families, or notable events — help us add it.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={`${siteConfig.repoUrl}/issues/new?title=History+for+Barangay+${encodeURIComponent(
                    barangay.name
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Contribute its history
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link
            to="/barangays"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all barangays
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Population figures:{' '}
          <a
            href={BARANGAY_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary-700"
          >
            PSA via PhilAtlas
          </a>
          .
        </p>
      </Section>
    </>
  );
}
