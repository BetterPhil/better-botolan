import { useEffect, useState } from 'react';
import { formatPesoShort } from '../../data/budget';

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

/** Animate a number from 0 → value with an ease-out cubic. */
function useCountUp(value: number, duration = 1100) {
  const [display, setDisplay] = useState(() => (reduceMotion() ? value : 0));
  useEffect(() => {
    if (reduceMotion()) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setDisplay(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

const R = 52;
const CIRC = 2 * Math.PI * R;

/**
 * Hero treatment for the NTA-dependence figure: a radial gauge with an
 * animated percentage, the "₱8 of every ₱10" framing, and a national-vs-local
 * split bar — on a bold gradient card.
 */
export default function NtaGauge({
  ntaShare,
  ntaAmount,
  localAmount,
}: {
  ntaShare: number;
  ntaAmount: number;
  localAmount: number;
}) {
  const pct = useCountUp(ntaShare * 100);
  const localPct = 100 - ntaShare * 100;
  const outOfTen = Math.round(ntaShare * 10);
  const dash = (pct / 100) * CIRC;

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-blue-900 p-6 text-white shadow-[var(--bb-shadow-lift,0_20px_40px_rgba(2,6,23,.25))] sm:p-8">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
        {/* Radial gauge */}
        <div className="relative shrink-0">
          <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="12"
            />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="url(#ntaGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
              style={{ transition: 'stroke-dasharray 0.2s linear' }}
            />
            <defs>
              <linearGradient id="ntaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold leading-none">
              {pct.toFixed(1)}
              <span className="text-xl align-top">%</span>
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-widest text-blue-100">
              from the nation
            </span>
          </div>
        </div>

        {/* Framing */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">
            About ₱{outOfTen} of every ₱10 Botolan has comes from the national
            government.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-blue-100">
            It arrives as the National Tax Allotment (
            {formatPesoShort(ntaAmount)}). Only {localPct.toFixed(1)}% —{' '}
            {formatPesoShort(localAmount)} — is money Botolan raises itself
            through local taxes and fees.
          </p>

          {/* Split bar */}
          <div className="mt-5">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-l-full bg-white"
                style={{
                  width: `${ntaShare * 100}%`,
                  transition: 'width 1s ease-out',
                }}
              />
              <div
                className="h-full bg-emerald-300"
                style={{
                  width: `${localPct}%`,
                  transition: 'width 1s ease-out',
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-blue-100">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white" />
                National (NTA)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Local sources
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
