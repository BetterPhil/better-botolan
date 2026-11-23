import {
  Church,
  ExternalLink,
  Leaf,
  type LucideIcon,
  Mountain,
  PartyPopper,
  Waves,
} from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import BotolanMap from '../components/map/BotolanMap';
import { attractions, type Attraction } from '../data/attractions';
import { festivals } from '../data/history';
import { siteConfig } from '../config/site';

const icons: Record<Attraction['icon'], LucideIcon> = {
  mountain: Mountain,
  church: Church,
  waves: Waves,
  leaf: Leaf,
};

export default function Tourism() {
  return (
    <>
      <SEO
        title="Tourism & Attractions"
        description={`Discover ${siteConfig.name}, Zambales: Mount Pinatubo's crater lake, the Ina Poon Bato shrine, coastline, and festivals.`}
        keywords={`${siteConfig.shortName} tourism, Mount Pinatubo, Ina Poon Bato, Zambales, festivals`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(61,6,16,0.72), rgba(77,10,28,0.55) 45%, rgba(61,6,16,0.85)), url(/images/pinatubo-hero.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <Breadcrumbs
            className="mb-6 [&_*]:text-primary-100"
            items={[{ label: 'Home', href: '/' }, { label: 'Tourism' }]}
          />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary-100">
            Discover
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight md:text-5xl">
            Explore {siteConfig.shortName}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-100">
            From the crater lake of Mount Pinatubo to turtle-nesting beaches and
            centuries-old devotions — there is a lot to discover in Botolan.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-14">
        {/* Attractions */}
        <SectionHeading kicker="Places" title="Things to see" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {attractions.map(a => {
            const Icon = icons[a.icon];
            return (
              <article
                key={a.name}
                className="flex flex-col rounded-2xl border border-gray-200 border-t-4 border-t-primary-600 bg-white p-6 shadow-[var(--bb-shadow-card)]"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                  {a.tag}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-gray-900">
                  {a.name}
                </h3>
                <p className="mt-2 flex-1 leading-relaxed text-gray-700">
                  {a.blurb}
                </p>
                {a.source && (
                  <a
                    href={a.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs text-gray-400 underline hover:text-primary-700"
                  >
                    {a.source.label}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </article>
            );
          })}
        </div>

        {/* Map */}
        <div className="mt-14">
          <SectionHeading
            kicker="Map"
            title="Botolan on the map"
            description="Key locations in Botolan. More points (offices, health facilities, evacuation centers) will be added over time."
          />
          <BotolanMap />
        </div>

        {/* Festivals */}
        <div className="mt-14">
          <SectionHeading kicker="Calendar" title="Festivals & traditions" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {festivals.map(f => (
              <article
                key={f.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)]"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-50 text-secondary-700">
                  <PartyPopper className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {f.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary-700">
                  {f.when}
                </p>
                <p className="mt-3 leading-relaxed text-gray-700">{f.about}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
