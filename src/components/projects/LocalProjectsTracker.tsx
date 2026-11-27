import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Download,
  ExternalLink,
  Landmark,
  type LucideIcon,
  MapPin,
  Truck,
} from 'lucide-react';
import {
  PROJECT_CATEGORY_META,
  PROJECT_STATUS_META,
  constructionProgram2025,
  localProjects,
  localProjectsToCsv,
  localProjectsTotal,
  projectSources,
  type LocalProject,
  type ProjectCategory,
} from '../../data/budget';
import { formatPeso, formatPesoCompact } from '../../lib/format';
import { cn } from '../../lib/utils';

const CATEGORY_ICON: Record<ProjectCategory, LucideIcon> = {
  commercial: Building2,
  government: Landmark,
  logistics: Truck,
  land: MapPin,
};

function reduceMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}

/** Reveal flag flipped on the next frame so width transitions animate. */
function useRevealed() {
  const [shown, setShown] = useState(() => reduceMotion());
  useEffect(() => {
    if (shown) return;
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, [shown]);
  return shown;
}

function downloadCsv(items: LocalProject[]) {
  const blob = new Blob([localProjectsToCsv(items)], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'botolan-2025-municipal-projects.csv';
  a.click();
  URL.revokeObjectURL(url);
}

type Filter = 'all' | ProjectCategory;

export default function LocalProjectsTracker() {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = useRevealed();

  const categoriesPresent = useMemo(() => {
    const set = new Set(localProjects.map(p => p.category));
    return (Object.keys(PROJECT_CATEGORY_META) as ProjectCategory[]).filter(k =>
      set.has(k)
    );
  }, []);

  const visible = useMemo(
    () =>
      filter === 'all'
        ? localProjects
        : localProjects.filter(p => p.category === filter),
    [filter]
  );

  const maxAmount = useMemo(
    () => Math.max(...localProjects.map(p => p.amount)),
    []
  );

  return (
    <section aria-labelledby="local-projects-heading" className="space-y-6">
      <div>
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary-700">
          Municipal projects
        </p>
        <h2
          id="local-projects-heading"
          className="font-display text-2xl font-bold text-gray-900 md:text-3xl"
        >
          Botolan&rsquo;s own 2025 capital projects
        </h2>
        <p className="mt-2 max-w-3xl text-gray-600">
          The municipality&rsquo;s 2025 development program — the projects the
          LGU funds and builds itself, separate from the national-government
          budget lines further down this page.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-600">Capital projects (2025)</div>
          <div className="mt-1 text-3xl font-bold text-gray-900">
            {localProjects.length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-600">Land Bank construction</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {formatPesoCompact(constructionProgram2025)}
          </div>
          <div className="mt-0.5 text-xs text-gray-400">
            4 construction projects
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-600">Total programmed</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {formatPesoCompact(localProjectsTotal)}
          </div>
          <div className="mt-0.5 text-xs text-gray-400">
            incl. land acquisition
          </div>
        </div>
      </div>

      {/* Share-of-investment bars */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="mb-4 font-display text-lg font-bold text-gray-900">
          Where the 2025 investment goes
        </p>
        <div className="space-y-3">
          {localProjects.map((p, i) => {
            const meta = PROJECT_CATEGORY_META[p.category];
            return (
              <div key={p.id}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate text-gray-700">
                    {p.title}
                  </span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    {formatPesoCompact(p.amount)}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: shown ? `${(p.amount / maxAmount) * 100}%` : '0%',
                      background: meta.color,
                      transition: `width 0.9s ease-out ${i * 80}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category filter + CSV */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium',
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          All ({localProjects.length})
        </button>
        {categoriesPresent.map(key => {
          const n = localProjects.filter(p => p.category === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium',
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {PROJECT_CATEGORY_META[key].label} ({n})
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => downloadCsv(visible)}
          className="ml-auto inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download CSV
        </button>
      </div>

      {/* Project cards */}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.map(p => {
          const meta = PROJECT_CATEGORY_META[p.category];
          const status = PROJECT_STATUS_META[p.status];
          const Icon = CATEGORY_ICON[p.category];
          return (
            <li
              key={p.id}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ background: `${meta.color}14`, color: meta.color }}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden={true} />
                  {meta.label}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                    status.chip
                  )}
                >
                  <span
                    className={cn('h-1.5 w-1.5 rounded-full', status.dot)}
                  />
                  {status.label}
                </span>
              </div>

              <h3 className="mt-3 font-display text-lg font-bold text-gray-900">
                {p.title}
              </h3>
              {p.description && (
                <p className="mt-1.5 text-sm text-gray-600">{p.description}</p>
              )}

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
                <div>
                  <dt className="text-gray-500">Budget</dt>
                  <dd className="font-semibold text-gray-900">
                    {formatPeso(p.amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Year</dt>
                  <dd className="font-semibold text-gray-900">{p.year}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-gray-500">Funding</dt>
                  <dd className="text-gray-700">{p.fundingSource}</dd>
                </div>
              </dl>

              {!p.statusConfirmed && (
                <p className="mt-3 text-xs text-gray-400">
                  Physical &amp; financial progress to be updated as the LGU
                  publishes it.
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Provenance */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-semibold text-gray-900">
          Where these figures come from
        </p>
        <p className="mt-1.5 text-sm text-gray-600">
          Project titles and budgets are from public reporting of
          Botolan&rsquo;s 2025 development program. The four construction
          projects ({formatPesoCompact(constructionProgram2025)}) are funded
          through a Land Bank facility; the lot acquisition is a separate
          municipal item.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {projectSources.map(src => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {src.label}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
