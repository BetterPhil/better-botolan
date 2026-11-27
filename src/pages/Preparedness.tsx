import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  ExternalLink,
  type LucideIcon,
  Mountain,
  Phone,
  Siren,
  Sun,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import OfflineReadyBadge from '../components/pwa/OfflineReadyBadge';
import BotolanMap from '../components/map/BotolanMap';
import { useWeather, weatherLabel } from '../hooks/useWeather';
import {
  evacuationCenters,
  hazardFacts,
  hazardTools,
  preparednessGuides,
  type HazardKind,
} from '../data/preparedness';
import { botolanHotlines, telHref } from '../data/hotlines';
import { siteConfig } from '../config/site';
import { cn } from '../lib/utils';

function WeatherGlyph({
  code,
  isDay,
  className,
}: {
  code: number;
  isDay: boolean;
  className?: string;
}) {
  const props = { className, 'aria-hidden': true } as const;
  if (code === 0) return isDay ? <Sun {...props} /> : <Cloud {...props} />;
  if (code <= 2) return <CloudSun {...props} />;
  if (code === 3) return <Cloud {...props} />;
  if (code <= 48) return <CloudFog {...props} />;
  if (code <= 57) return <CloudDrizzle {...props} />;
  if (code <= 82) return <CloudRain {...props} />;
  if (code <= 99) return <CloudLightning {...props} />;
  return <Cloud {...props} />;
}

const guideIcon: Record<string, LucideIcon> = {
  waves: Waves,
  wind: Wind,
  activity: Activity,
};

export default function Preparedness() {
  const { data: weather, error: weatherError } = useWeather();
  const [hazard, setHazard] = useState<HazardKind>('lahar-flood');

  const guide =
    preparednessGuides.find(g => g.kind === hazard) ?? preparednessGuides[0];

  const topHotline =
    botolanHotlines.find(o => o.label === 'Emergency Response Team') ??
    botolanHotlines[0];

  return (
    <>
      <SEO
        title="Disaster Preparedness & Safety"
        description={`Hazard information, live weather, evacuation centers, and preparedness guides for ${siteConfig.name}, Zambales.`}
        keywords={`${siteConfig.shortName} disaster, lahar, flood, typhoon, Pinatubo, MDRRMO, preparedness`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Safety' }]}
        />
        <SectionHeading
          kicker="Stay Safe"
          title="Disaster Preparedness & Safety"
          description="Live weather, hazard information, evacuation guidance, and what to do before, during, and after a disaster in Botolan."
        />

        <div className="mt-4">
          <OfflineReadyBadge label="Key info available offline" />
        </div>

        {/* Emergency banner */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-primary-700 to-blue-800 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Siren className="h-8 w-8 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-display text-lg font-bold">In an emergency</p>
              <p className="text-sm text-blue-100">
                MDRRMO Emergency Response Team — available 24/7
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={telHref(topHotline.numbers[0])}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {topHotline.numbers[0]}
            </a>
            <a
              href="/hotlines"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur"
            >
              All hotlines
            </a>
          </div>
        </div>

        {/* Weather + advisories */}
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Live weather · Botolan
            </p>
            {weather ? (
              <>
                <div className="mt-3 flex items-center gap-4">
                  <WeatherGlyph
                    code={weather.code}
                    isDay={weather.isDay}
                    className="h-14 w-14 text-primary-600"
                  />
                  <div>
                    <p className="font-display text-4xl font-bold text-gray-900">
                      {weather.temperature}°C
                    </p>
                    <p className="text-sm text-gray-500">
                      {weatherLabel(weather.code)} · feels like{' '}
                      {weather.apparent}°C
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <WeatherStat
                    icon={Droplets}
                    label="Rain chance"
                    value={`${weather.precipProbMax}%`}
                  />
                  <WeatherStat
                    icon={Wind}
                    label="Wind"
                    value={`${weather.windSpeed} km/h`}
                  />
                  <WeatherStat
                    icon={Thermometer}
                    label="Humidity"
                    value={`${weather.humidity}%`}
                  />
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                {weatherError
                  ? 'Live weather is unavailable right now. Check PAGASA for the latest forecast.'
                  : 'Loading current conditions…'}
              </p>
            )}
            <p className="mt-4 text-xs text-gray-400">
              Source: Open-Meteo. For storm signals and warnings, always follow
              PAGASA and the MDRRMO.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Typhoon & rainfall advisories
            </p>
            <p className="mt-2 text-sm text-gray-600">
              During the rainy season and tropical cyclones, monitor official
              bulletins for Zambales and Central Luzon.
            </p>
            <div className="mt-4 space-y-2">
              <AdvisoryLink
                href="https://www.pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin"
                title="PAGASA Tropical Cyclone Bulletin"
                sub="Storm signals & track"
              />
              <AdvisoryLink
                href="https://www.pagasa.dost.gov.ph/weather"
                title="PAGASA Weather Forecast"
                sub="Daily & 5-day outlook"
              />
            </div>
          </div>
        </div>

        {/* Pinatubo / volcano */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Mountain
              className="mt-0.5 h-8 w-8 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-lg font-bold text-gray-900">
                Mt. Pinatubo status
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Mt. Pinatubo lies within Botolan&rsquo;s territory. For the
                current alert level and any volcanic advisories, check the
                official PHIVOLCS bulletin.
              </p>
            </div>
          </div>
          <a
            href="https://www.phivolcs.dost.gov.ph/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            PHIVOLCS bulletin
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {/* Hazard map + official tools */}
        <div className="mt-12">
          <SectionHeading
            kicker="Know your risk"
            title="Hazard map & assessment tools"
            description="Botolan's barangays face different levels of flood, lahar, and landslide risk. Use the official government tools for the exact rating of your location."
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <BotolanMap />
            </div>
            <div className="space-y-3">
              {hazardTools.map(tool => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-primary-300 hover:bg-primary-50/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-700">
                      {tool.name}
                    </p>
                    <ExternalLink
                      className="h-4 w-4 text-gray-400 group-hover:text-primary-600"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {tool.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
          <ul className="mt-5 space-y-2">
            {hazardFacts.map(fact => (
              <li
                key={fact}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* What to do — interactive guide */}
        <div className="mt-12">
          <SectionHeading
            kicker="Be ready"
            title="What to do"
            description="Before, during, and after the hazards most relevant to Botolan."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {preparednessGuides.map(g => {
              const GIcon = guideIcon[g.icon];
              const active = g.kind === hazard;
              return (
                <button
                  key={g.kind}
                  type="button"
                  onClick={() => setHazard(g.kind)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                    active
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <GIcon className="h-4 w-4" aria-hidden="true" />
                  {g.title}
                </button>
              );
            })}
          </div>

          <div
            key={guide.kind}
            className="bb-guide mt-6 grid gap-4 md:grid-cols-3"
          >
            <GuidePhase
              title="Before"
              color="bg-blue-50 text-blue-700"
              steps={guide.before}
            />
            <GuidePhase
              title="During"
              color="bg-primary-50 text-primary-700"
              steps={guide.during}
            />
            <GuidePhase
              title="After"
              color="bg-emerald-50 text-emerald-700"
              steps={guide.after}
            />
          </div>
        </div>

        {/* Evacuation centers */}
        <div className="mt-12">
          <SectionHeading
            kicker="Where to go"
            title="Evacuation centers"
            description="Confirm your nearest designated evacuation center with your Barangay or the MDRRMO."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {evacuationCenters.map(ec => (
              <div
                key={ec.name}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{ec.name}</h3>
                  {ec.confirmed === false && (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      To confirm
                    </span>
                  )}
                </div>
                {(ec.barangay || ec.type) && (
                  <p className="mt-1 text-xs font-medium text-primary-600">
                    {[ec.type, ec.barangay].filter(Boolean).join(' · ')}
                  </p>
                )}
                {ec.note && (
                  <p className="mt-2 text-sm text-gray-500">{ec.note}</p>
                )}
              </div>
            ))}
          </div>
          {/*  <p className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
            The official list of designated evacuation centers can be added in{' '}
            <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-700">
              src/data/preparedness.ts
            </code>{' '}
            once provided by the MDRRMO.
          </p>*/}
        </div>
      </Section>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-guide { animation: bb-guide-in 0.35s ease-out; }
          @keyframes bb-guide-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </>
  );
}

function WeatherStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-2">
      <Icon className="mx-auto h-4 w-4 text-gray-400" aria-hidden="true" />
      <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-400">{label}</p>
    </div>
  );
}

function AdvisoryLink({
  href,
  title,
  sub,
}: {
  href: string;
  title: string;
  sub: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 transition hover:border-primary-300 hover:bg-primary-50/50"
    >
      <span>
        <span className="block text-sm font-semibold text-gray-900 group-hover:text-primary-700">
          {title}
        </span>
        <span className="block text-xs text-gray-400">{sub}</span>
      </span>
      <ExternalLink
        className="h-4 w-4 text-gray-400 group-hover:text-primary-600"
        aria-hidden="true"
      />
    </a>
  );
}

function GuidePhase({
  title,
  color,
  steps,
}: {
  title: string;
  color: string;
  steps: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <span
        className={cn(
          'inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
          color
        )}
      >
        {title}
      </span>
      <ul className="mt-3 space-y-2">
        {steps.map(s => (
          <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
