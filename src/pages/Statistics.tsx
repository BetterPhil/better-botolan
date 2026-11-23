import { useMemo } from 'react';
import {
  ExternalLink,
  Landmark,
  Layers,
  Ruler,
  TrendingUp,
  Users,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { barangays, POPULATION_TOTAL_2020 } from '../data/barangays';
import { siteConfig } from '../config/site';

const fmt = new Intl.NumberFormat('en-PH');

// Municipal totals (PSA). 2024 is the POPCEN municipal count.
const POP_2024 = 70340;

const trend = [
  { year: '2015', value: 57707, note: 'barangay census sum' },
  { year: '2020', value: POPULATION_TOTAL_2020, note: 'census' },
  { year: '2024', value: POP_2024, note: 'POPCEN' },
];

const tiles = [
  { label: 'Population (2024)', value: fmt.format(POP_2024), icon: Users },
  { label: 'Barangays', value: '31', icon: Layers },
  { label: 'Land area', value: '735.28 km²', icon: Ruler },
  { label: 'Density', value: '96 / km²', icon: Layers },
  { label: 'Income class', value: '1st', icon: Landmark },
];

export default function Statistics() {
  const topBarangays = useMemo(
    () =>
      [...barangays]
        .sort((a, b) => b.population2020 - a.population2020)
        .slice(0, 10),
    []
  );
  const trendMax = Math.max(...trend.map(t => t.value));
  const topMax = topBarangays[0]?.population2020 ?? 1;
  const growth = (
    ((POP_2024 - POPULATION_TOTAL_2020) / POPULATION_TOTAL_2020) *
    100
  ).toFixed(1);

  return (
    <>
      <SEO
        title="Statistics"
        description={`Population and key statistics for ${siteConfig.name}, Zambales, from PSA census data.`}
        keywords={`${siteConfig.shortName} statistics, population, census, Zambales`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Statistics' }]}
        />

        <SectionHeading
          kicker="Data"
          title={`${siteConfig.shortName} at a glance`}
          description="Key figures for the municipality, from the Philippine Statistics Authority."
        />

        {/* Tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map(t => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)]"
              >
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Icon
                    className="h-4 w-4 text-primary-600"
                    aria-hidden="true"
                  />
                  {t.label}
                </div>
                <div className="mt-1 font-display text-2xl font-semibold text-gray-900 md:text-3xl">
                  {t.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Population trend */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)]">
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp
                className="h-5 w-5 text-primary-600"
                aria-hidden="true"
              />
              <h2 className="font-display text-xl font-semibold text-gray-900">
                Population over time
              </h2>
            </div>
            <p className="mb-5 text-sm text-gray-500">
              Up {growth}% from 2020 to 2024.
            </p>
            <div className="space-y-4">
              {trend.map(t => (
                <div key={t.year}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{t.year}</span>
                    <span className="font-semibold text-gray-900">
                      {fmt.format(t.value)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
                      style={{ width: `${(t.value / trendMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Largest barangays */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)]">
            <h2 className="mb-5 font-display text-xl font-semibold text-gray-900">
              Largest barangays (2020)
            </h2>
            <div className="space-y-3">
              {topBarangays.map((b, i) => (
                <div key={b.slug}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {i + 1}. {b.name}
                    </span>
                    <span className="text-gray-900">
                      {fmt.format(b.population2020)}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary-600"
                      style={{ width: `${(b.population2020 / topMax) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Sources: Philippine Statistics Authority (2015 &amp; 2020 Census, 2024
          POPCEN), via{' '}
          <a
            href="https://www.philatlas.com/luzon/r03/zambales/botolan.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 underline hover:text-primary-700"
          >
            PhilAtlas
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          . The 2024 figure is the municipal POPCEN total; barangay-level 2024
          data is not yet fully published.
        </p>
      </Section>
    </>
  );
}
