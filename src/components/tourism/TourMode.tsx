import { useCallback, useEffect, useState } from 'react';
import {
  Church,
  ChevronLeft,
  ChevronRight,
  Cross,
  Droplets,
  Flag,
  LayoutGrid,
  Landmark,
  type LucideIcon,
  MapPin,
  Mountain,
  Pause,
  Play,
  Shell,
  Ship,
  Sparkles,
  Tent,
  Trees,
  Users,
  Waves,
  X,
} from 'lucide-react';
import {
  attractions,
  attractionImage,
  CATEGORY_META,
  type AttractionIcon,
} from '../../data/attractions';
import { cn } from '../../lib/utils';

const iconMap: Record<AttractionIcon, LucideIcon> = {
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

const DURATION = 6500; // ms per stop when auto-playing
const TOTAL = attractions.length;

interface TourModeProps {
  open: boolean;
  onClose: () => void;
  startIndex?: number;
}

export default function TourMode({
  open,
  onClose,
  startIndex = 0,
}: TourModeProps) {
  const [index, setIndex] = useState(startIndex);
  const [errored, setErrored] = useState<Set<string>>(new Set());
  const [playing, setPlaying] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  });

  const go = useCallback((delta: number) => {
    setIndex(i => (i + delta + TOTAL) % TOTAL);
  }, []);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keyboard navigation.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onClose();
      else if (e.key === ' ') {
        e.preventDefault();
        setPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, onClose]);

  // Auto-advance.
  useEffect(() => {
    if (!open || !playing) return;
    const id = window.setTimeout(() => go(1), DURATION);
    return () => window.clearTimeout(id);
  }, [open, playing, index, go]);

  if (!open) return null;

  const a = attractions[index];
  const meta = CATEGORY_META[a.category];
  const Icon = iconMap[a.icon];
  const showImage = !errored.has(a.slug);

  return (
    <div className="fixed inset-0 z-[100] select-none bg-black text-white">
      {/* Background: photo (Ken Burns) or gradient fallback */}
      <div key={index} className="bb-tour-kenburns absolute inset-0">
        {showImage ? (
          <img
            src={attractionImage(a)}
            alt={a.name}
            className="h-full w-full object-cover"
            onError={() =>
              setErrored(prev => {
                const next = new Set(prev);
                next.add(a.slug);
                return next;
              })
            }
          />
        ) : (
          <div
            className={cn('h-full w-full bg-gradient-to-br', meta.gradient)}
          />
        )}
      </div>

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />

      {/* Big faint icon when there's no photo */}
      {!showImage && (
        <Icon
          className="pointer-events-none absolute left-1/2 top-[38%] h-[34vh] w-[34vh] -translate-x-1/2 -translate-y-1/2 text-white/15"
          aria-hidden="true"
        />
      )}

      {/* Top: progress + meta + close */}
      <div className="absolute inset-x-0 top-0 p-4 sm:p-5">
        <div className="mx-auto flex max-w-6xl gap-1.5">
          {attractions.map((stop, i) => (
            <div
              key={stop.slug}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              {i < index && <div className="h-full w-full bg-white" />}
              {i === index &&
                (playing ? (
                  <div
                    className="bb-tour-progress h-full bg-white"
                    style={{ animationDuration: `${DURATION}ms` }}
                  />
                ) : (
                  <div className="h-full w-1/3 bg-white" />
                ))}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-wide shadow',
              meta.gradient
            )}
          >
            {meta.label}
            <span className="font-mono font-normal opacity-80">
              {String(index + 1).padStart(2, '0')} / {TOTAL}
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tour"
            className="rounded-full bg-white/10 p-2 backdrop-blur transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Side navigation */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur transition-all hover:bg-white/25 sm:left-5 sm:p-3"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 backdrop-blur transition-all hover:bg-white/25 sm:right-5 sm:p-3"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0">
        <div
          key={index}
          className="bb-tour-content mx-auto max-w-6xl px-6 pb-8 sm:px-10 sm:pb-12"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            {a.tag}
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">
            {a.name}
          </h2>
          {a.location && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-white/85">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {a.location}
            </p>
          )}
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {a.blurb}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying(p => !p)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-transform hover:scale-[1.03]"
            >
              {playing ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden="true" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden="true" /> Play
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              Browse all spots
            </button>
            <span className="hidden text-xs text-white/50 sm:inline">
              Use ← → keys · space to pause · esc to exit
            </span>
          </div>

          {/* Dots */}
          <div className="mt-6 flex flex-wrap gap-2">
            {attractions.map((stop, i) => (
              <button
                key={stop.slug}
                type="button"
                aria-label={`Go to ${stop.name}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === index
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-tour-kenburns {
            animation: bb-tour-kb 8s ease-out both;
          }
          @keyframes bb-tour-kb {
            0% { opacity: 0; transform: scale(1.02); }
            12% { opacity: 1; }
            100% { transform: scale(1.1); }
          }
          .bb-tour-content {
            animation: bb-tour-up 0.6s ease-out both;
          }
          @keyframes bb-tour-up {
            from { opacity: 0; transform: translateY(26px); }
            to { opacity: 1; transform: none; }
          }
          .bb-tour-progress {
            animation: bb-tour-fill linear forwards;
          }
          @keyframes bb-tour-fill {
            from { width: 0%; }
            to { width: 100%; }
          }
        }
      `}</style>
    </div>
  );
}
