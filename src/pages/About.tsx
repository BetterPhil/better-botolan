import { Link } from 'react-router';
import {
  ArrowRight,
  CalendarHeart,
  ExternalLink,
  Github,
  Info,
  PartyPopper,
} from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import HistoryTimeline from '../components/about/HistoryTimeline';
import { useReveal } from '../hooks/useReveal';
import { siteConfig } from '../config/site';
import { HISTORY_SOURCE, festivals } from '../data/history';

function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {children}
    </div>
  );
}

export default function About() {
  return (
    <>
      <SEO
        title="About & History"
        description={`The story of ${siteConfig.name}, Zambales — from its founding in 1572 to Mount Pinatubo and today — and about this community-run portal.`}
        keywords={`${siteConfig.shortName} history, Zambales, Mount Pinatubo, Ina Poon Bato, 1572`}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pinatubo-hero.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-primary-900/70 to-primary-900/30"
        />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <Breadcrumbs
            className="mb-8 [&_*]:text-primary-100"
            items={[{ label: 'Home', href: '/' }, { label: 'About' }]}
          />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-100">
            Since 1572
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            The story of {siteConfig.shortName}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-100">
            A town at the foot of Mount Pinatubo — home to the Aeta and Sambal,
            to one of the country&apos;s oldest Marian devotions, and to
            communities that rebuilt after the mountain erupted.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-14">
        {/* HISTORY TIMELINE */}
        <FadeIn>
          <SectionHeading
            kicker="History"
            title="From a seeded banana to a town reborn"
            description="A short history of Botolan, drawn from public sources. Each moment shaped the municipality you see today."
          />
        </FadeIn>
        <div className="mt-8">
          <HistoryTimeline />
        </div>
        <p className="mt-6 text-xs text-gray-500">
          History compiled from public sources, chiefly{' '}
          <a
            href={HISTORY_SOURCE}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary-700"
          >
            Wikipedia
          </a>
          , and news coverage of the Ina Poon Bato feast. Dates are approximate
          where the sources are.
        </p>

        {/* FESTIVALS */}
        <FadeIn className="mt-16">
          <SectionHeading kicker="Heritage" title="Festivals and traditions" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {festivals.map(f => (
              <article
                key={f.name}
                className="rounded-2xl border border-gray-200 border-t-4 border-t-primary-600 bg-white p-6 shadow-[var(--bb-shadow-card)]"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <PartyPopper className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {f.name}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700">
                  <CalendarHeart className="h-4 w-4" aria-hidden="true" />
                  {f.when}
                </p>
                <p className="mt-3 leading-relaxed text-gray-700">{f.about}</p>
              </article>
            ))}
          </div>
        </FadeIn>

        {/* ABOUT THE PORTAL */}
        <FadeIn className="mt-16">
          <SectionHeading
            kicker="About this portal"
            title="A community-run window into Botolan"
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <Info
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
                aria-hidden="true"
              />
              <p className="text-sm text-amber-900">
                <strong>This is not an official government website.</strong>{' '}
                Better {siteConfig.shortName} is a volunteer project and is not
                operated by the Municipal Government of {siteConfig.shortName}.
                For official records, certificates and transactions, please{' '}
                <Link to="/contact" className="underline">
                  contact the Municipal Hall directly
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                to: '/services',
                label: 'Services',
                sub: 'Everyday how-to guides',
              },
              {
                to: '/barangays',
                label: 'Barangays',
                sub: 'All 31, with populations',
              },
              {
                to: '/transparency',
                label: 'Transparency',
                sub: 'Budget & resolutions',
              },
              {
                to: '/government/departments/legislative',
                label: 'Government',
                sub: 'Officials & the SB',
              },
            ].map(card => (
              <Link
                key={card.to}
                to={card.to}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)] transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[var(--bb-shadow-lift)]"
              >
                <div className="font-semibold text-gray-900">{card.label}</div>
                <div className="mt-1 text-sm text-gray-600">{card.sub}</div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                  Open
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-gray-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">
                Help improve Better {siteConfig.shortName}
              </h3>
              <p className="mt-1 text-sm text-gray-300">
                Spotted a mistake, or have verified information to add? Everyone
                can contribute.
              </p>
            </div>
            <a
              href={`${siteConfig.repoUrl}/issues`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-gray-900 hover:bg-gray-100"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Contribute on GitHub
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Better {siteConfig.shortName} is part of the Better LGU network
            supported by{' '}
            <a
              href={siteConfig.betterGovUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-primary-700"
            >
              BetterGov.ph
            </a>
            .
          </p>
        </FadeIn>
      </div>
    </>
  );
}
