import { useState } from 'react';

/** Two-letter monogram for the fallback (no logo file yet). */
function initials(name: string): string {
  const cleaned = name.replace(/\(Pob\.\)/gi, '').replace(/-/g, ' ');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Shows a barangay's logo from public/barangays/<slug>.png.
 * If the file is missing, it falls back to a clean red monogram, so the
 * grid always looks finished even before every logo is added.
 */
export default function BarangayLogo({
  slug,
  name,
  size = 48,
}: {
  slug: string;
  name: string;
  size?: number;
}) {
  const [step, setStep] = useState(0);

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-600 to-primary-900 text-white ring-1 ring-black/5"
      style={{ width: size, height: size }}
    >
      {step < 2 ? (
        <img
          src={`/barangays/${slug}.${step === 0 ? 'jpg' : 'png'}`}
          alt={`${name} barangay logo`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setStep(s => s + 1)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-display font-semibold leading-none"
          style={{ fontSize: Math.round(size * 0.36) }}
        >
          {initials(name)}
        </span>
      )}
    </span>
  );
}
