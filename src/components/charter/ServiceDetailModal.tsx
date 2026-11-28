import { useEffect } from 'react';
import {
  BadgeCheck,
  Clock,
  FileText,
  MapPin,
  MessageSquareReply,
  Receipt,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import type {
  CharterOffice,
  CharterRequirement,
  CharterService,
} from '../../data/charter';

function normalizeReq(r: string | CharterRequirement): CharterRequirement {
  return typeof r === 'string' ? { text: r } : r;
}

export default function ServiceDetailModal({
  service,
  office,
  onClose,
}: {
  service: CharterService;
  office?: CharterOffice;
  onClose: () => void;
}) {
  // Escape to close + lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const steps = service.steps ?? [];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={service.service}
      onClick={onClose}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-modal-in { animation: bb-modal-in 0.28s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes bb-modal-in {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        }
      `}</style>
      <div
        className="bb-modal-in flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-primary-700 to-blue-900 p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-1.5 text-white hover:bg-white/25"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          {service.official && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Official charter
            </span>
          )}
          <h2 className="pr-8 font-display text-xl font-bold leading-snug sm:text-2xl">
            {service.service}
          </h2>
          {service.note && (
            <p className="mt-1 text-sm text-blue-100">{service.note}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-medium">
              <Receipt className="h-4 w-4" aria-hidden="true" />
              {service.totalFee ?? service.fee}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-medium">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {service.totalTime ?? service.processingTime}
            </span>
            {steps.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-medium">
                {steps.length} steps
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {/* Requirements */}
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-gray-900">
            <FileText className="h-5 w-5 text-primary-600" aria-hidden="true" />
            What to bring
          </h3>
          <ul className="mt-3 space-y-2">
            {service.requirements.map((r, i) => {
              const req = normalizeReq(r);
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {i + 1}
                  </span>
                  <span className="min-w-0 text-sm text-gray-800">
                    {req.text}
                    {req.source && (
                      <span className="mt-0.5 block text-xs font-medium text-primary-600">
                        {req.source}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Process timeline */}
          {steps.length > 0 && (
            <>
              <h3 className="mt-7 flex items-center gap-2 font-display text-lg font-bold text-gray-900">
                <MapPin
                  className="h-5 w-5 text-primary-600"
                  aria-hidden="true"
                />
                Step by step
              </h3>
              <ol className="mt-3 space-y-0">
                {steps.map((step, i) => (
                  <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                    {/* connector */}
                    {i < steps.length - 1 && (
                      <span
                        className="absolute left-[15px] top-8 h-full w-0.5 bg-primary-100"
                        aria-hidden="true"
                      />
                    )}
                    <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 font-display text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      {step.clientStep && (
                        <p className="mb-2 flex items-start gap-1.5 text-sm text-gray-700">
                          <User
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                          />
                          <span>
                            <span className="font-semibold text-emerald-700">
                              You:{' '}
                            </span>
                            {step.clientStep}
                          </span>
                        </p>
                      )}
                      <p className="flex items-start gap-1.5 text-sm text-gray-800">
                        <UserCheck
                          className="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
                          aria-hidden="true"
                        />
                        <span>
                          <span className="font-semibold text-primary-700">
                            Office:{' '}
                          </span>
                          {step.agencyAction}
                        </span>
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                          <Receipt className="h-3 w-3" aria-hidden="true" />
                          {step.fee}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {step.time}
                        </span>
                        {step.responsible.map(p => (
                          <span
                            key={p}
                            className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Totals */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-4">
                <span className="font-display font-bold text-gray-900">
                  Total
                </span>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-semibold text-primary-700 ring-1 ring-inset ring-primary-200">
                    <Receipt className="h-4 w-4" aria-hidden="true" />
                    {service.totalFee ?? service.fee}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-semibold text-primary-700 ring-1 ring-inset ring-primary-200">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {service.totalTime ?? service.processingTime}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Feedback & redress */}
          {office?.feedback && office.feedback.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="flex items-center gap-2 font-semibold text-gray-900">
                <MessageSquareReply
                  className="h-4 w-4 text-primary-600"
                  aria-hidden="true"
                />
                Feedback &amp; complaints
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                {office.feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-5 text-xs text-gray-400">
            {service.legalBasis && <>Legal basis: {service.legalBasis}. </>}
            {office?.source && <>Source: {office.source}.</>}
          </p>
        </div>
      </div>
    </div>
  );
}
