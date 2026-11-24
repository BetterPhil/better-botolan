import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router';
import {
  Search as SearchIcon,
  X,
  CornerDownLeft,
  ArrowRight,
} from 'lucide-react';
import {
  searchContent,
  searchIndexSize,
  type ClientSearchHit,
} from '../../lib/clientSearch';
import { cn } from '../../lib/utils';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const badgeClass: Record<ClientSearchHit['kind'], string> = {
  service: 'bg-blue-100 text-blue-700',
  government: 'bg-sky-100 text-sky-700',
  barangay: 'bg-amber-100 text-amber-700',
  page: 'bg-slate-100 text-slate-600',
};

const SUGGESTIONS = [
  'Business permit',
  'Scholarship',
  'Pinatubo',
  'Hotlines',
  'Garbage schedule',
];

export default function SearchModal({
  open,
  onClose,
  initialQuery = '',
}: SearchModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchContent(query), [query]);
  const trimmed = query.trim();

  // Update the query and reset the highlight together (no effect needed).
  const updateQuery = (value: string) => {
    setQuery(value);
    setActiveIndex(0);
  };

  // Focus the input when the modal opens.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keep the highlighted row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  const go = (hit: ClientSearchHit) => {
    onClose();
    navigate(hit.url);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = results[activeIndex];
      if (hit) go(hit);
    }
  };

  return (
    <div
      className="bb-search-overlay fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh] sm:pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="bb-search-panel relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-blue-200/70">
        {/* Accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500" />

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-blue-100 px-4 py-3">
          <SearchIcon
            className="h-5 w-5 shrink-0 text-blue-600"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => updateQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search services, barangays, offices, guides…"
            className="w-full bg-transparent py-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
            aria-label="Search the portal"
            aria-controls="bb-search-results"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Results / states */}
        <div
          id="bb-search-results"
          ref={listRef}
          className="max-h-[52vh] overflow-y-auto overscroll-contain p-2"
        >
          {!trimmed && (
            <div className="px-3 py-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
                Try searching for
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateQuery(s)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs text-gray-400">
                Searching across {searchIndexSize} services, barangays, and
                pages.
              </p>
            </div>
          )}

          {trimmed && results.length === 0 && (
            <div className="px-3 py-10 text-center">
              <p className="text-gray-500">
                No results for{' '}
                <span className="font-medium text-gray-700">
                  &ldquo;{trimmed}&rdquo;
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try a different word, or browse Services from the menu.
              </p>
            </div>
          )}

          {trimmed && results.length > 0 && (
            <ul className="space-y-1">
              {results.map((hit, index) => (
                <li key={hit.id}>
                  <button
                    type="button"
                    data-index={index}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => go(hit)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                      index === activeIndex
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-transparent hover:bg-blue-50/60'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[11px] font-medium',
                            badgeClass[hit.kind]
                          )}
                        >
                          {hit.category}
                        </span>
                      </div>
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {hit.title}
                      </p>
                      {hit.description && (
                        <p className="truncate text-xs text-gray-500">
                          {hit.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-opacity',
                        index === activeIndex
                          ? 'text-blue-600 opacity-100'
                          : 'opacity-0'
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint bar */}
        <div className="flex items-center justify-between gap-3 border-t border-blue-100 bg-blue-50/50 px-4 py-2 text-[11px] text-blue-700/80">
          <span className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
                ↑
              </kbd>
              <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
                ↓
              </kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
                <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              </kbd>
              to open
            </span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
              esc
            </kbd>
            to close
          </span>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-search-overlay { animation: bb-fade 0.15s ease-out; }
          .bb-search-panel { animation: bb-pop 0.18s ease-out; }
          @keyframes bb-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bb-pop {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </div>
  );
}
