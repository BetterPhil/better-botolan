import { useEffect, useRef, useState } from 'react';
import {
  Church,
  ChevronDown,
  Compass,
  Cross,
  Droplets,
  ExternalLink,
  Flag,
  Landmark,
  Leaf,
  type LucideIcon,
  MapPin,
  Mountain,
  PartyPopper,
  Play,
  Shell,
  Ship,
  Sparkles,
  Tent,
  Trees,
  Users,
  Waves,
} from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import BotolanMap from '../components/map/BotolanMap';
import {
  attractions,
  type Attraction,
  type AttractionCategory,
  type AttractionIcon,
} from '../data/attractions';
import { festivals } from '../data/history';
import { siteConfig } from '../config/site';
import { cn } from '../lib/utils';
import TourMode from '../components/tourism/TourMode';

const icons: Record<AttractionIcon, LucideIcon> = {
  landmark: Landmark,
  users: Users,
  flag: Flag,
  waves: Waves,
  ship: Ship,
  shell: Shell,
  mountain: Mountain,
  droplets: Droplets,
  tent: Tent,
  trees: Trees,
  church: Church,
  cross: Cross,
  sparkles: Sparkles,
};

interface Leg {
  key: AttractionCategory;
  label: string;
  tagline: string;
  headerIcon: LucideIcon;
  node: string; // node bg
  text: string; // accent text
  chip: string; // gradient for header pill
}

const LEGS: Leg[] = [
  {
    key: 'explore',
    label: 'Explore',
    tagline: 'the heritage of Botolan',
    headerIcon: Landmark,
    node: 'bg-amber-500',
    text: 'text-amber-600',
    chip: 'from-amber-500 to-orange-500',
  },
  {
    key: 'experience',
    label: 'Experience',
    tagline: 'the beauty of Botolan',
    headerIcon: Waves,
    node: 'bg-sky-500',
    text: 'text-sky-600',
    chip: 'from-sky-500 to-cyan-500',
  },
  {
    key: 'conquer',
    label: 'Conquer',
    tagline: 'the trails of Botolan',
    headerIcon: Mountain,
    node: 'bg-emerald-600',
    text: 'text-emerald-600',
    chip: 'from-emerald-500 to-green-600',
  },
  {
    key: 'faith',
    label: 'Walk in Faith',
    tagline: 'the pilgrim sites of Botolan',
    headerIcon: Church,
    node: 'bg-violet-600',
    text: 'text-violet-600',
    chip: 'from-violet-500 to-fuchsia-500',
  },
];

/** Reveal-on-scroll, with a lazy initial value so there is no setState-in-effect. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    return Boolean(reduce) || !('IntersectionObserver' in window);
  });

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  return { ref, visible };
}

function TourStop({
  a,
  number,
  leg,
  delay,
  onOpen,
}: {
  a: Attraction;
  number: number;
  leg: Leg;
  delay: number;
  onOpen: () => void;
}) {
  const { ref, visible } = useReveal();
  const Icon = icons[a.icon];
  return (
    <div
      ref={ref}
      className={cn(
        'bb-reveal relative flex gap-4 sm:gap-5',
        visible && 'is-visible'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Node on the trail */}
      <div
        className={cn(
          'relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white',
          leg.node
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      {/* Card */}
      <article className="mb-6 flex-1 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              'text-[11px] font-bold uppercase tracking-wider',
              leg.text
            )}
          >
            {a.tag}
          </p>
          <span
            className={cn(
              'font-display text-2xl font-bold leading-none opacity-20',
              leg.text
            )}
          >
            {String(number).padStart(2, '0')}
          </span>
        </div>
        <h3 className="mt-1 font-display text-xl font-semibold text-gray-900">
          {a.name}
        </h3>
        {a.location && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {a.location}
          </p>
        )}
        <p className="mt-2.5 leading-relaxed text-gray-700">{a.blurb}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpen}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-[1.04]',
              leg.node
            )}
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            View in tour
          </button>
          {a.source && (
            <a
              href={a.source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-400 underline hover:text-primary-700"
            >
              {a.source.label}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

export default function Tourism() {
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStart, setTourStart] = useState(0);
  // Bumped on each open so TourMode remounts at the chosen stop.
  const [tourInstance, setTourInstance] = useState(0);

  const openTour = (index: number) => {
    setTourStart(index);
    setTourInstance(n => n + 1);
    setTourOpen(true);
  };

  return (
    <>
      <TourMode
        key={tourInstance}
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        startIndex={tourStart}
      />
      <SEO
        title="Tourism & Attractions"
        description={`Discover ${siteConfig.name}, Zambales: Mount Pinatubo, the Ina Poon Bato shrine, beaches, falls, and the heritage of the Sambal and Ayta people.`}
        keywords={`${siteConfig.shortName} tourism, Mount Pinatubo, Ina Poon Bato, Tukal-Tukal Falls, Camp Kainomayan, Zambales`}
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
            Botolan — Yours to Discover
          </h1>
          <p className="mt-4 max-w-xl text-lg text-primary-100">
            A hidden gem on the western coast of Luzon — pristine beaches,
            scenic rivers, and the rugged landscapes of Mount Pinatubo, home to
            the vibrant culture of the Sambal and Ayta people.
          </p>
          <button
            type="button"
            onClick={() => openTour(0)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-800 shadow-sm transition-transform hover:scale-[1.03]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Start the immersive tour
          </button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-14">
        {/* Intro */}
        <div className="mb-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8">
          <p className="leading-relaxed text-gray-700">
            Visitors can enjoy quiet stretches of sand, explore unique
            lahar-formed terrain, trek to breathtaking viewpoints, and immerse
            themselves in the culture of the Sambal people. Fresh seafood, local
            delicacies, and traditional crafts await — follow the trail below
            through four ways to experience Botolan.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {LEGS.map(leg => (
              <span
                key={leg.key}
                className={cn(
                  'rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white',
                  leg.chip
                )}
              >
                {leg.label}
              </span>
            ))}
          </div>
        </div>

        {/* The tour trail */}
        <h2 id="tour" className="sr-only">
          The Botolan tour trail
        </h2>
        {LEGS.map((leg, legIndex) => {
          const stops = attractions.filter(a => a.category === leg.key);
          const HeaderIcon = leg.headerIcon;
          return (
            <section key={leg.key} className={cn(legIndex > 0 && 'mt-4')}>
              {/* Leg header */}
              <div className="mb-6">
                <div
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-1.5 text-white shadow-sm',
                    leg.chip
                  )}
                >
                  <HeaderIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {leg.label}
                  </span>
                </div>
                <p className="mt-2 font-display text-lg italic text-gray-500">
                  {leg.tagline}
                </p>
              </div>

              {/* Stops with the animated trail line */}
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="bb-trail-line absolute left-6 top-6 bottom-6 -translate-x-1/2"
                />
                {stops.map((a, i) => {
                  const globalIndex = attractions.indexOf(a);
                  return (
                    <TourStop
                      key={a.name}
                      a={a}
                      number={globalIndex + 1}
                      leg={leg}
                      delay={i * 60}
                      onOpen={() => openTour(globalIndex)}
                    />
                  );
                })}
              </div>

              {/* Direction arrow to the next leg */}
              {legIndex < LEGS.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown
                    className="bb-bounce h-6 w-6 text-gray-300"
                    aria-hidden="true"
                  />
                </div>
              )}
            </section>
          );
        })}

        {/* Map */}
        <div className="mt-16">
          <SectionHeading
            kicker="Map"
            title="Botolan on the map"
            description="Key locations in Botolan. More points (resorts, trailheads, barangay halls) will be added over time."
          />
          <BotolanMap />
        </div>

        {/* Festivals */}
        <div className="mt-16">
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

        {/* Provenance */}
        <p className="mt-10 flex items-center gap-2 text-sm text-gray-400">
          <Leaf className="h-4 w-4" aria-hidden="true" />
          Places compiled from the{' '}
          <a
            href="https://www.facebook.com/botolantourismoffice"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-primary-700"
          >
            Botolan Tourism Office
          </a>{' '}
          brochure and public sources.
        </p>
      </div>

      <style>{`
        .bb-trail-line {
          width: 2px;
          background-image: repeating-linear-gradient(
            to bottom,
            #cbd5e1 0 7px,
            transparent 7px 14px
          );
          background-size: 2px 14px;
          background-repeat: repeat-y;
        }
        @media (prefers-reduced-motion: no-preference) {
          .bb-reveal {
            opacity: 0;
            transform: translateY(18px);
            transition: opacity 0.55s ease, transform 0.55s ease;
          }
          .bb-reveal.is-visible {
            opacity: 1;
            transform: none;
          }
          .bb-trail-line {
            animation: bb-trail-flow 0.8s linear infinite;
          }
          @keyframes bb-trail-flow {
            to {
              background-position: 0 -14px;
            }
          }
          .bb-bounce {
            animation: bb-bounce 1.4s ease-in-out infinite;
          }
          @keyframes bb-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }
        }
      `}</style>
    </>
  );
}
