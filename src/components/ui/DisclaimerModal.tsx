import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, Info, ShieldCheck, X } from 'lucide-react';
import { siteConfig } from '../../config/site';

const STORAGE_KEY = 'bb-disclaimer-ack:v1';

/**
 * A one-time disclaimer shown on first visit. The acknowledgement is stored
 * in localStorage so it won't reappear on every page or repeat visit.
 */
export default function DisclaimerModal() {
  const [open, setOpen] = useState(true);
  const acceptRef = useRef<HTMLButtonElement | null>(null);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore: non-persistent is fine, it will show again next time
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    acceptRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bb-disclaimer-title"
      aria-describedby="bb-disclaimer-body"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        style={{ animation: 'bb-fade 0.25s ease-out' }}
        onClick={dismiss}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ animation: 'bb-pop 0.28s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="relative bg-gradient-to-r from-primary-700 to-primary-900 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary-100">
                Please note
              </p>
              <h2
                id="bb-disclaimer-title"
                className="font-display text-xl font-semibold leading-tight"
              >
                Community-run portal
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p id="bb-disclaimer-body" className="text-gray-700 leading-relaxed">
            This is <strong>not the official website</strong> of the Local
            Government Unit of {siteConfig.shortName}. It is a community-run
            portal that gathers public information to make it easier to find.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary-50 p-3 text-sm text-primary-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              For official records and transactions, please contact or visit the
              official LGU of {siteConfig.shortName}.
            </span>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {siteConfig.websiteUrl && (
              <a
                href={siteConfig.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Official LGU website
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <button
              ref={acceptRef}
              type="button"
              onClick={dismiss}
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              I understand
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bb-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bb-pop {
          from { opacity: 0; transform: translateY(12px) scale(0.97) }
          to   { opacity: 1; transform: none }
        }
      `}</style>
    </div>
  );
}
