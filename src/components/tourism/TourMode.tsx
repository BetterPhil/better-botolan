import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Church,
  ChevronLeft,
  ChevronRight,
  Cross,
  Droplets,
  ExternalLink,
  Flag,
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
const INTRO_MS = 1600; // compass intro length
const TOTAL = attractions.length;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

interface TourModeProps {
  open: boolean;
  onClose: () => void;
  startIndex?: number;
  withIntro?: boolean;
}

export default function TourMode({
  open,
  onClose,
  startIndex = 0,
  withIntro = false,
}: TourModeProps) {
  const [index, setIndex] = useState(startIndex);
  const [errored, setErrored] = useState<Set<string>>(new Set());
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [phase, setPhase] = useState<'intro' | 'tour'>(() =>
    withIntro && !prefersReducedMotion() ? 'intro' : 'tour'
  );
  const trailRef = useRef<HTMLDivElement>(null);

  const go = useCallback((delta: number) => {
    setIndex(i => (i + delta + TOTAL) % TOTAL);
  }, []);

  // Compass intro → tour.
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = window.setTimeout(() => setPhase('tour'), INTRO_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

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
      if (e.key === 'Escape') onClose();
      if (phase !== 'tour') return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ') {
        e.preventDefault();
        setPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, phase, go, onClose]);

  // Auto-advance.
  useEffect(() => {
    if (!open || phase !== 'tour' || !playing) return;
    const id = window.setTimeout(() => go(1), DURATION);
    return () => window.clearTimeout(id);
  }, [open, phase, playing, index, go]);

  // Keep the active trail node in view.
  useEffect(() => {
    const el = trailRef.current?.querySelector<HTMLElement>(
      `[data-node="${index}"]`
    );
    el?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [index]);

  if (!open) return null;

  const a = attractions[index];
  const meta = CATEGORY_META[a.category];
  const Icon = iconMap[a.icon];
  const showImage = !errored.has(a.slug);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Botolan tour"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close tour"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {phase === 'intro' ? (
        /* ---------- Compass intro ---------- */
        <div className="relative flex flex-col items-center text-white">
          <svg
            viewBox="0 0 100 100"
            className="bb-compass h-36 w-36 sm:h-44 sm:w-44"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
            />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="6"
                x2="50"
                y2="12"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                transform={`rotate(${i * 45} 50 50)`}
              />
            ))}
            <g className="bb-needle">
              <polygon points="50,16 56,50 44,50" fill="#e11d48" />
              <polygon points="50,84 56,50 44,50" fill="#ffffff" />
              <circle cx="50" cy="50" r="4" fill="#fff" />
            </g>
          </svg>
          <p className="bb-intro-text mt-6 font-display text-xl font-semibold tracking-wide">
            Preparing your Botolan tour…
          </p>
        </div>
      ) : (
        /* ---------- Tour modal ---------- */
        <div className="bb-tour-panel relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Image / gradient hero */}
          <div className="relative h-60 shrink-0 overflow-hidden sm:h-80">
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
                  className={cn(
                    'h-full w-full bg-gradient-to-br',
                    meta.gradient
                  )}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />
            {!showImage && (
              <Icon
                className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-white/20"
                aria-hidden="true"
              />
            )}

            {/* Progress bar */}
            <div className="absolute inset-x-0 top-0 flex gap-1 p-3">
              {attractions.map((stop, i) => (
                <div
                  key={stop.slug}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
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

            {/* Top row: badge + close */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-6">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow',
                  meta.gradient
                )}
              >
                {meta.label}
                <span className="font-mono font-normal opacity-85">
                  {String(index + 1).padStart(2, '0')} / {TOTAL}
                </span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Side arrows */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur transition-colors hover:bg-white/30"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Title block on the image */}
            <div
              key={`t-${index}`}
              className="bb-tour-caption absolute inset-x-0 bottom-0 p-5 text-white sm:p-6"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                {a.tag}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-4xl">
                {a.name}
              </h2>
              {a.location && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-white/85">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {a.location}
                </p>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <p className="leading-relaxed text-gray-700">{a.blurb}</p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying(p => !p)}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
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
          </div>

          {/* Tour trail with arrows */}
          <div
            ref={trailRef}
            className="flex items-center gap-1 overflow-x-auto border-t border-gray-100 bg-gray-50 px-4 py-3"
          >
            {attractions.map((stop, i) => {
              const StopIcon = iconMap[stop.icon];
              const stopMeta = CATEGORY_META[stop.category];
              const active = i === index;
              const done = i < index;
              return (
                <div key={stop.slug} className="flex items-center">
                  <button
                    type="button"
                    data-node={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to ${stop.name}`}
                    aria-current={active}
                    className={cn(
                      'flex shrink-0 items-center justify-center rounded-full transition-all',
                      active
                        ? cn(
                            'h-10 w-10 text-white shadow-md ring-4 ring-white',
                            stopMeta.node
                          )
                        : done
                          ? cn('h-8 w-8 text-white', stopMeta.node)
                          : 'h-8 w-8 bg-gray-200 text-gray-500 hover:bg-gray-300'
                    )}
                  >
                    <StopIcon
                      className={active ? 'h-5 w-5' : 'h-4 w-4'}
                      aria-hidden="true"
                    />
                  </button>
                  {i < TOTAL - 1 && (
                    <ChevronRight
                      className="bb-arrow mx-0.5 h-4 w-4 shrink-0 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .bb-tour-kenburns, .bb-tour-caption, .bb-tour-panel, .bb-compass, .bb-needle, .bb-intro-text, .bb-tour-progress, .bb-arrow { }
        @media (prefers-reduced-motion: no-preference) {
          .bb-tour-panel { animation: bb-panel-in 0.35s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes bb-panel-in {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to { opacity: 1; transform: none; }
          }
          .bb-tour-kenburns { animation: bb-kb 8s ease-out both; }
          @keyframes bb-kb {
            0% { opacity: 0; transform: scale(1.03); }
            14% { opacity: 1; }
            100% { transform: scale(1.1); }
          }
          .bb-tour-caption { animation: bb-cap 0.5s ease-out both; }
          @keyframes bb-cap {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: none; }
          }
          .bb-tour-progress { animation: bb-fill linear forwards; }
          @keyframes bb-fill { from { width: 0%; } to { width: 100%; } }
          .bb-compass { animation: bb-cspin 1.6s cubic-bezier(.2,.8,.15,1) both; transform-origin: 50% 50%; }
          @keyframes bb-cspin {
            0% { opacity: 0; transform: rotate(-80deg) scale(0.6); }
            35% { opacity: 1; }
            100% { opacity: 1; transform: rotate(360deg) scale(1); }
          }
          .bb-needle { transform-origin: 50% 50%; animation: bb-nspin 1.6s cubic-bezier(.15,.9,.1,1) both; }
          @keyframes bb-nspin { from { transform: rotate(0deg); } to { transform: rotate(1080deg); } }
          .bb-intro-text { animation: bb-pulse 1.3s ease-in-out infinite; }
          @keyframes bb-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
          .bb-arrow { animation: bb-arrow 1.2s ease-in-out infinite; }
          @keyframes bb-arrow {
            0%,100% { transform: translateX(0); opacity: 0.5; }
            50% { transform: translateX(2px); opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}
