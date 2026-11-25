import { useEffect } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  BookOpen,
  TrendingDown,
  TrendingUp,
  Users,
  UserRound,
  X,
} from 'lucide-react';
import BarangayLogo from './BarangayLogo';
import {
  getCaptain,
  personInitials,
  PUNONG_BARANGAYS_ASOF,
  type Barangay,
} from '../../data/barangays';

const numberFmt = new Intl.NumberFormat('en-PH');

export default function BarangayModal({
  barangay,
  onClose,
}: {
  barangay: Barangay | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!barangay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [barangay, onClose]);

  if (!barangay) return null;
  const b = barangay;
  const captain = getCaptain(b.slug);
  const hasHistory = Boolean(b.history && b.history.length > 0);
  const growth = b.population2015
    ? ((b.population2020 - b.population2015) / b.population2015) * 100
    : null;

  return (
    <div
      className="bb-bgy-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${b.name} details`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-blue-950/55 backdrop-blur-sm"
      />

      <div className="bb-bgy-panel relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Gradient header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 p-6 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-8 h-40 w-40 rounded-full bg-white/5"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 backdrop-blur transition-colors hover:bg-white/30"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="relative flex items-center gap-4">
            <span className="rounded-2xl bg-white/15 p-1 ring-1 ring-white/20">
              <BarangayLogo slug={b.slug} name={b.name} size={64} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                Barangay
              </p>
              <h2 className="truncate font-display text-3xl font-bold leading-tight">
                {b.name.replace(/\s*\(Pob\.\)/i, '')}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {b.poblacion && (
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold">
                    Poblacion
                  </span>
                )}
                {hasHistory && (
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold">
                    History
                  </span>
                )}
                {b.tags?.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Captain */}
          {captain ? (
            <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-600 font-display text-lg font-bold text-white shadow-sm">
                {personInitials(captain)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
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
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
              Barangay captain to be confirmed.
            </div>
          )}

          {/* Population stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                Population 2020
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-gray-900">
                {numberFmt.format(b.population2020)}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">Population 2015</p>
              <p className="mt-1 font-display text-2xl font-bold text-gray-900">
                {numberFmt.format(b.population2015)}
              </p>
              {growth !== null && (
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${
                    growth >= 0 ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {growth >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {growth >= 0 ? '+' : ''}
                  {growth.toFixed(1)}% since 2015
                </p>
              )}
            </div>
          </div>

          {/* History */}
          {hasHistory ? (
            <div className="mt-4">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                History
              </p>
              <p className="line-clamp-4 text-sm leading-relaxed text-gray-700">
                {b.history?.[0]}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">
              No recorded history yet — contributions are welcome.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 bg-gray-50 p-4">
          <Link
            to={`/barangays/${b.slug}`}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            View full barangay page
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-bgy-overlay { animation: bb-bgy-fade 0.15s ease-out; }
          .bb-bgy-panel { animation: bb-bgy-pop 0.22s cubic-bezier(.2,.8,.2,1); }
          @keyframes bb-bgy-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bb-bgy-pop {
            from { opacity: 0; transform: translateY(14px) scale(0.97); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </div>
  );
}
