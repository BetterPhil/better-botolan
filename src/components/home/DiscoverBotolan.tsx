import { Link } from 'react-router';
import {
  ArrowRight,
  Landmark,
  type LucideIcon,
  MapPin,
  Mountain,
  Waves,
} from 'lucide-react';
import { highlights } from '../../data/facts';
import { siteConfig } from '../../config/site';
import { cn } from '../../lib/utils';

type Tone = 'hero' | 'cyan' | 'amber' | 'primary';

interface TileConfig {
  icon: LucideIcon;
  href: string;
  span: string;
  tone: Tone;
}

const TILES: Record<string, TileConfig> = {
  pinatubo: {
    icon: Mountain,
    href: '/tourism',
    span: 'sm:col-span-2 lg:col-span-2 lg:row-span-2',
    tone: 'hero',
  },
  turtles: {
    icon: Waves,
    href: '/tourism',
    span: 'sm:col-span-1 lg:col-span-1',
    tone: 'cyan',
  },
  location: {
    icon: MapPin,
    href: '/barangays',
    span: 'sm:col-span-1 lg:col-span-1',
    tone: 'amber',
  },
  history: {
    icon: Landmark,
    href: '/about',
    span: 'sm:col-span-2 lg:col-span-3',
    tone: 'primary',
  },
};

const toneStyles: Record<
  Exclude<Tone, 'hero'>,
  { iconBox: string; watermark: string; hoverBorder: string }
> = {
  cyan: {
    iconBox: 'bg-cyan-50 text-cyan-700',
    watermark: 'text-cyan-100',
    hoverBorder: 'hover:border-cyan-300',
  },
  amber: {
    iconBox: 'bg-amber-50 text-amber-700',
    watermark: 'text-amber-100',
    hoverBorder: 'hover:border-amber-300',
  },
  primary: {
    iconBox: 'bg-primary-50 text-primary-700',
    watermark: 'text-primary-100',
    hoverBorder: 'hover:border-primary-300',
  },
};

export default function DiscoverBotolan() {
  return (
    <section aria-labelledby="discover-heading" className="bg-gray-50 py-14">
      <div className="container mx-auto px-4">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-700">
          Discover
        </p>
        <h2
          id="discover-heading"
          className="mb-8 font-display text-2xl font-bold text-gray-900 md:text-4xl"
        >
          Know {siteConfig.shortName}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[13rem]">
          {highlights.map(item => {
            const cfg = TILES[item.id] ?? {
              icon: MapPin,
              href: '/about',
              span: '',
              tone: 'primary' as Tone,
            };
            const Icon = cfg.icon;

            if (cfg.tone === 'hero') {
              return (
                <Link
                  key={item.id}
                  to={cfg.href}
                  className={cn(
                    'group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-800 to-blue-900 p-6 text-white shadow-sm transition-all duration-300 hover:shadow-xl',
                    cfg.span
                  )}
                >
                  <Icon
                    className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                    aria-hidden="true"
                  />
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-2xl font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-blue-100">
                    {item.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-3 text-[11px] text-blue-200/80">
                    Source: {item.source}
                  </span>
                </Link>
              );
            }

            const t = toneStyles[cfg.tone];
            return (
              <Link
                key={item.id}
                to={cfg.href}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
                  t.hoverBorder,
                  cfg.span
                )}
              >
                <Icon
                  className={cn(
                    'pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 transition-transform duration-500 group-hover:scale-110',
                    t.watermark
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl',
                    t.iconBox
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="relative font-display text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                  {item.body}
                </p>
                <div className="relative mt-3 flex items-end justify-between">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {item.source}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
