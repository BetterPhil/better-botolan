import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Clock,
  Compass,
  CornerDownLeft,
  FileText,
  type LucideIcon,
  MapPin,
  Phone,
  Search as SearchIcon,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  searchContent,
  searchIndexSize,
  type ClientSearchHit,
  type SearchKind,
} from '../../lib/clientSearch';
import { cn } from '../../lib/utils';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const kindIcon: Record<SearchKind, LucideIcon> = {
  service: ClipboardList,
  barangay: MapPin,
  government: Building2,
  page: FileText,
};

const kindIconClass: Record<SearchKind, string> = {
  service: 'bg-blue-100 text-blue-700',
  barangay: 'bg-amber-100 text-amber-700',
  government: 'bg-sky-100 text-sky-700',
  page: 'bg-slate-100 text-slate-600',
};

const GROUPS: { kind: SearchKind; label: string }[] = [
  { kind: 'service', label: 'Services' },
  { kind: 'barangay', label: 'Barangays' },
  { kind: 'government', label: 'Government & Transparency' },
  { kind: 'page', label: 'Pages' },
];

const SUGGESTIONS = [
  'Business permit',
  'Scholarship',
  'Pinatubo',
  'Hotlines',
  'Garbage schedule',
];

const QUICK_LINKS: { label: string; url: string; icon: LucideIcon }[] = [
  { label: 'Hotlines', url: '/hotlines', icon: Phone },
  { label: 'Services', url: '/services', icon: ClipboardList },
  { label: 'Tourism', url: '/tourism', icon: Compass },
  { label: 'Barangays', url: '/barangays', icon: MapPin },
];

const RECENT_KEY = 'bb-recent-searches';

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string').slice(0, 5)
      : [];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)));
  } catch {
    /* storage unavailable — ignore */
  }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Bold the matched query tokens inside a piece of text. */
function Highlight({
  text,
  query,
}: {
  text: string;
  query: string;
}): ReactNode {
  const raw = query.trim().split(/\s+/).filter(Boolean);
  if (!raw.length) return text;
  const re = new RegExp(`(${raw.map(escapeRegExp).join('|')})`, 'ig');
  const set = new Set(raw.map(r => r.toLowerCase()));
  return (
    <>
      {text.split(re).map((part, i) =>
        set.has(part.toLowerCase()) ? (
          <mark
            key={i}
            className="rounded bg-blue-100 px-0.5 font-semibold text-blue-800"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

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
  const [recent, setRecent] = useState<string[]>(() => loadRecent());

  const results = useMemo(() => searchContent(query), [query]);
  const trimmed = query.trim();

  // Group results by kind (in a fixed order) for section rendering, while
  // keeping one flat ordered list for keyboard navigation.
  const groups = useMemo(
    () =>
      GROUPS.map(g => ({
        ...g,
        items: results.filter(r => r.kind === g.kind),
      })).filter(g => g.items.length > 0),
    [results]
  );
  const ordered = useMemo(() => groups.flatMap(g => g.items), [groups]);

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

  const rememberSearch = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [
      t,
      ...recent.filter(r => r.toLowerCase() !== t.toLowerCase()),
    ].slice(0, 5);
    setRecent(next);
    saveRecent(next);
  };

  const go = (hit: ClientSearchHit) => {
    rememberSearch(query);
    onClose();
    navigate(hit.url);
  };

  const goUrl = (url: string) => {
    onClose();
    navigate(url);
  };

  const clearRecent = () => {
    setRecent([]);
    saveRecent([]);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, ordered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hit = ordered[activeIndex];
      if (hit) go(hit);
    }
  };

  return (
    <div
      className="bb-search-overlay fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[11vh] sm:pt-[13vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
      />

      <div className="bb-search-panel relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-blue-200/70">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500" />

        {/* Input */}
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
          {trimmed && (
            <button
              type="button"
              onClick={() => updateQuery('')}
              aria-label="Clear"
              className="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium text-gray-400 hover:bg-blue-50 hover:text-blue-600"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div
          id="bb-search-results"
          ref={listRef}
          className="max-h-[56vh] overflow-y-auto overscroll-contain p-2"
        >
          {/* Empty state */}
          {!trimmed && (
            <div className="px-2 py-3">
              {recent.length > 0 && (
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      Recent
                    </p>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-xs text-gray-400 hover:text-blue-600"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => updateQuery(r)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Clock
                          className="h-3.5 w-3.5 text-gray-400"
                          aria-hidden="true"
                        />
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                Popular
              </p>
              <div className="mb-5 flex flex-wrap gap-2">
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

              <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Jump to
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {QUICK_LINKS.map(link => {
                  const LinkIcon = link.icon;
                  return (
                    <button
                      key={link.url}
                      type="button"
                      onClick={() => goUrl(link.url)}
                      className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-4 text-sm font-medium text-gray-700 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
                    >
                      <LinkIcon
                        className="h-5 w-5 text-blue-600"
                        aria-hidden="true"
                      />
                      {link.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-5 px-1 text-xs text-gray-400">
                Searching across {searchIndexSize} services, barangays, and
                pages.
              </p>
            </div>
          )}

          {/* No results */}
          {trimmed && ordered.length === 0 && (
            <div className="px-3 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <SearchIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-gray-600">
                No results for{' '}
                <span className="font-semibold text-gray-800">
                  &ldquo;{trimmed}&rdquo;
                </span>
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Try a different word, or use a popular search:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.slice(0, 4).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateQuery(s)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grouped results */}
          {trimmed && ordered.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-xs text-gray-400">
                {ordered.length} result{ordered.length !== 1 ? 's' : ''}
              </p>
              {groups.map(group => (
                <div key={group.kind} className="mb-1">
                  <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {group.label}{' '}
                    <span className="font-normal text-gray-300">
                      ({group.items.length})
                    </span>
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map(hit => {
                      const flatIndex = ordered.indexOf(hit);
                      const active = flatIndex === activeIndex;
                      const HitIcon = kindIcon[hit.kind];
                      return (
                        <li key={hit.id}>
                          <button
                            type="button"
                            data-index={flatIndex}
                            onMouseMove={() => setActiveIndex(flatIndex)}
                            onClick={() => go(hit)}
                            className={cn(
                              'bb-search-item flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                              active
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-transparent hover:bg-blue-50/60'
                            )}
                            style={{
                              animationDelay: `${Math.min(flatIndex, 10) * 25}ms`,
                            }}
                          >
                            <span
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                                kindIconClass[hit.kind]
                              )}
                            >
                              <HitIcon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                <Highlight text={hit.title} query={query} />
                              </p>
                              {hit.description && (
                                <p className="truncate text-xs text-gray-500">
                                  <Highlight
                                    text={hit.description}
                                    query={query}
                                  />
                                </p>
                              )}
                            </div>
                            <ArrowRight
                              className={cn(
                                'h-4 w-4 shrink-0 transition-all',
                                active
                                  ? 'translate-x-0 text-blue-600 opacity-100'
                                  : '-translate-x-1 opacity-0'
                              )}
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-blue-100 bg-blue-50/50 px-4 py-2 text-[11px] text-blue-700/80">
          <span className="flex items-center gap-3">
            <span className="hidden items-center gap-1 sm:flex">
              <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
                ↑
              </kbd>
              <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
                ↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
                <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              </kbd>
              open
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="hidden items-center gap-1 sm:flex">
              <kbd className="rounded bg-white px-1.5 py-0.5 font-sans shadow-sm ring-1 ring-blue-200">
                ⌘K
              </kbd>
              anytime
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm ring-1 ring-blue-200">
                esc
              </kbd>
              close
            </span>
          </span>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-search-overlay { animation: bb-fade 0.15s ease-out; }
          .bb-search-panel { animation: bb-pop 0.2s cubic-bezier(.2,.8,.2,1); }
          @keyframes bb-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bb-pop {
            from { opacity: 0; transform: translateY(-10px) scale(0.97); }
            to { opacity: 1; transform: none; }
          }
          .bb-search-item { animation: bb-item-in 0.28s ease-out both; }
          @keyframes bb-item-in {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </div>
  );
}
