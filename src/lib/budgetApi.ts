/**
 * Client for the BetterGov.PH Budget Data API (public, no key, CORS-open).
 * Docs: https://budget.bettergov.ph/docs
 *
 * Rules this client follows (from the API's own terms):
 *  - Amounts are exact pesos. null = "this version has no such line", never 0.
 *  - The NEP and the House bill are two versions of ONE budget. They are
 *    compared, never added. We therefore total each version separately.
 *  - Rows are candidates for checking, not findings. Keep the disclaimers.
 *  - Responses change at most a few times a year, so we cache aggressively.
 */

export const BUDGET_API_BASE = 'https://budget.bettergov.ph/api/v1';
export const BUDGET_SITE = 'https://budget.bettergov.ph';

export type ProgramKey = 'dpwh' | 'fmr' | 'hfep' | 'nia';

export const PROGRAMS: Record<ProgramKey, { label: string; short: string }> = {
  dpwh: { label: 'DPWH infrastructure', short: 'DPWH' },
  fmr: { label: 'DA farm-to-market roads', short: 'Farm-to-market roads' },
  hfep: { label: 'DOH health facilities', short: 'Health facilities' },
  nia: { label: 'NIA irrigation', short: 'Irrigation' },
};

export const PROGRAM_KEYS = Object.keys(PROGRAMS) as ProgramKey[];

export interface Disclaimer {
  id: string;
  title: string;
  body: string;
  url?: string;
}

/** One project line, as the API returns it (extra fields are ignored). */
export interface ApiRow {
  id: string;
  title: string;
  status_label?: string;
  trace?: string;
  held?: boolean;
  nep_php?: number | null;
  house_php?: number | null;
  delta_php?: number | null;
  office?: string;
  region?: string;
  url?: string;
  pdf_url?: Record<string, string | null> | null;
}

export interface ProjectRow extends ApiRow {
  program: ProgramKey;
}

export interface BudgetResult {
  rows: ProjectRow[];
  disclaimers: Disclaimer[];
  /** Programs that could not be loaded (network or API error). */
  failed: ProgramKey[];
  fetchedAt: number;
}

interface ProjectsResponse {
  disclaimers?: Disclaimer[];
  data?: {
    total?: number;
    rows?: ApiRow[];
    next_offset?: number | null;
  };
}

const PAGE_SIZE = 200;
const MAX_PAGES = 10;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_PREFIX = 'bb-budget:v1:';

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; v: T };
    if (Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return parsed.v;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ t: Date.now(), v: value })
    );
  } catch {
    // Storage can be full or blocked. The page still works without a cache.
  }
}

interface ProgramPage {
  rows: ApiRow[];
  disclaimers: Disclaimer[];
}

/** Every row of one program whose title, program, region or office names `q`. */
async function fetchProgram(
  program: ProgramKey,
  q: string,
  signal?: AbortSignal
): Promise<ProgramPage> {
  const cacheKey = `${program}:${q.toLowerCase()}`;
  const cached = readCache<ProgramPage>(cacheKey);
  if (cached) return cached;

  const rows: ApiRow[] = [];
  let disclaimers: Disclaimer[] = [];
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url =
      `${BUDGET_API_BASE}/hgab/2027/datasets/${program}/projects` +
      `?q=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&offset=${offset}`;
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Budget API returned ${response.status} for ${program}`);
    }
    const json = (await response.json()) as ProjectsResponse;
    rows.push(...(json.data?.rows ?? []));
    if (page === 0 && json.disclaimers) disclaimers = json.disclaimers;

    const next = json.data?.next_offset;
    if (next === null || next === undefined) break;
    offset = next;
  }

  const result = { rows, disclaimers };
  writeCache(cacheKey, result);
  return result;
}

/**
 * Loads the FY2027 project lines that name `place` in all four programs.
 * One program failing does not hide the others.
 */
export async function fetchProjectsForPlace(
  place: string,
  signal?: AbortSignal
): Promise<BudgetResult> {
  const settled = await Promise.allSettled(
    PROGRAM_KEYS.map(key => fetchProgram(key, place, signal))
  );

  const rows: ProjectRow[] = [];
  const failed: ProgramKey[] = [];
  let disclaimers: Disclaimer[] = [];

  settled.forEach((outcome, index) => {
    const program = PROGRAM_KEYS[index];
    if (outcome.status === 'fulfilled') {
      rows.push(...outcome.value.rows.map(row => ({ ...row, program })));
      if (disclaimers.length === 0) disclaimers = outcome.value.disclaimers;
    } else {
      failed.push(program);
    }
  });

  return { rows, disclaimers, failed, fetchedAt: Date.now() };
}

/** Totals per version. These are NEVER added together. */
export function totalsFor(rows: ProjectRow[]) {
  let nep = 0;
  let house = 0;
  for (const row of rows) {
    nep += row.nep_php ?? 0;
    house += row.house_php ?? 0;
  }
  return { count: rows.length, nep, house };
}

/** Fallback text, used only if the API response carries no disclaimers. */
export const FALLBACK_DISCLAIMERS: Disclaimer[] = [
  {
    id: 'disclaimer-no-allegations',
    title: 'No allegations.',
    body: 'An insertion, deletion, or amount-change candidate describes a provisional comparison between identified sources. That classification alone does not establish irregularity or wrongdoing by any office or official and should not be represented as such. Absence from an API snapshot likewise does not establish absence from the published NEP or concealment.',
    url: `${BUDGET_SITE}/hgab/2027/methodology#disclaimer-no-allegations`,
  },
];

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function rowsToCsv(rows: ProjectRow[]): string {
  const header = [
    'program',
    'title',
    'status',
    'nep_php',
    'house_php',
    'delta_php',
    'source_url',
  ];
  const lines = rows.map(row =>
    [
      PROGRAMS[row.program].short,
      row.title,
      row.status_label ?? row.trace ?? '',
      row.nep_php,
      row.house_php,
      row.delta_php,
      row.url ?? '',
    ]
      .map(csvCell)
      .join(',')
  );
  return [header.join(','), ...lines].join('\n');
}
