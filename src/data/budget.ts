/**
 * Budget & spending data for the "Where the money goes" dashboard.
 *
 * Income and expenditure figures are OFFICIAL, from the Bureau of Local
 * Government Finance (BLGF) Statement of Receipts & Expenditures (SRE).
 * The HEADLINE figures are the latest available period, FY2026 as of Q3
 * (year-to-date, January–September 2026), extracted 21 October 2026. FY2025
 * (full year) is kept for context. Every rollup in both periods cross-foots
 * exactly (local = tax + non-tax; income = local + external; expenditures =
 * the four sectors). Values are nominal pesos.
 *
 * IMPORTANT: FY2026 figures cover only 9 months, so they are NOT directly
 * comparable to the full FY2025 year — always shown with a "year-to-date" label.
 *
 * The capital-projects list further below (localProjects) is the 2025
 * development PROGRAM — a plan, from news reporting — kept distinct from these
 * SRE actuals.
 *
 * Sources:
 *  - BLGF SRE by LGU, FY2026-Q3 (Preliminary) — primary/current
 *  - BLGF SRE by LGU, FY2025 (Preliminary) — prior full year
 *  - BetterGov.ph Open Data (SRE mirror); DILG FDP; DBM (NTA)
 */

/** The latest reporting period shown as the dashboard headline. */
export const SRE_CURRENT = {
  fy: 2026,
  periodLabel: 'FY2026 · as of Q3',
  coverage: 'Year-to-date (January–September 2026)',
  status: 'Preliminary',
  extracted: '21 October 2026',
};

/** The last complete year, kept for context/comparison. */
export const SRE_PRIOR = {
  fy: 2025,
  periodLabel: 'FY2025 (full year)',
  status: 'Preliminary',
};

export interface BudgetSource {
  label: string;
  url: string;
}

export const budgetSources: BudgetSource[] = [
  {
    label: 'BLGF — Statement of Receipts & Expenditures (SRE)',
    url: 'https://blgf.gov.ph/lgu-fiscal-data/',
  },
  {
    label: 'BetterGov.ph — Open Data (SRE dataset)',
    url: 'https://data.bettergov.ph/datasets/9',
  },
  {
    label: 'DILG Full Disclosure Policy Portal',
    url: 'https://fdpp.dilg.gov.ph/',
  },
  {
    label: 'Department of Budget and Management (DBM)',
    url: 'https://www.dbm.gov.ph/',
  },
];

export interface KeyFigure {
  id: string;
  label: string;
  value: number | null;
  prefix?: string;
  suffix?: string;
  display?: string;
  detail: string;
  confirmed: boolean;
}

export const keyFigures: KeyFigure[] = [
  {
    id: 'total-income',
    label: 'Total income (YTD Q3)',
    value: 480_463_638,
    prefix: '₱',
    detail: 'Current operating income, Jan–Sep 2026 (BLGF SRE, FY2026 Q3).',
    confirmed: true,
  },
  {
    id: 'nta',
    label: 'National Tax Allotment',
    value: 399_038_038,
    prefix: '₱',
    detail: "Botolan's NTA so far in 2026 — 83.1% of the town's income.",
    confirmed: true,
  },
  {
    id: 'total-expenditure',
    label: 'Total expenditures (YTD Q3)',
    value: 318_598_042,
    prefix: '₱',
    detail: 'Current operating expenditures, Jan–Sep 2026 (BLGF SRE).',
    confirmed: true,
  },
  {
    id: 'income-class',
    label: 'Income class',
    value: null,
    display: '1st class',
    detail: 'Municipal income classification (PSA / PSGC).',
    confirmed: true,
  },
];

export interface SpendItem {
  label: string;
  amount: number;
  color: string;
  note?: string;
}

/* ============================ HEADLINE ============================ *
 * Latest period: FY2026 as of Q3 (year-to-date, Jan–Sep 2026).
 * These feed the dashboard's main charts.
 * ================================================================= */

/** Where the money GOES — FY2026 YTD-Q3 expenditures by sector. Total ₱318.60M. */
export const expendituresCurrent: SpendItem[] = [
  { label: 'General Public Services', amount: 143_497_664, color: '#2563eb' },
  { label: 'Social Services', amount: 134_588_765, color: '#0ea5e9' },
  { label: 'Economic Services', amount: 27_462_028, color: '#059669' },
  { label: 'Debt Service (interest)', amount: 13_049_585, color: '#f59e0b' },
];

/** Where the money COMES FROM — FY2026 YTD-Q3 income. Total ₱480.46M; NTA 83.1%. */
export const incomeCurrent: SpendItem[] = [
  { label: 'National Tax Allotment', amount: 399_038_038, color: '#2563eb' },
  { label: 'Local tax revenue', amount: 49_892_136, color: '#059669' },
  { label: 'Non-tax revenue', amount: 31_533_464, color: '#f59e0b' },
];

/** Social Services broken down — FY2026 YTD-Q3. */
export const socialServicesCurrent: SpendItem[] = [
  {
    label: 'Health, Nutrition & Population',
    amount: 57_001_430,
    color: '#0ea5e9',
  },
  { label: 'Social Services & Welfare', amount: 47_298_191, color: '#2563eb' },
  {
    label: 'Education, Culture & Sports',
    amount: 20_413_916,
    color: '#059669',
  },
  { label: 'Housing & Community', amount: 9_505_851, color: '#f59e0b' },
  { label: 'Labor & Employment', amount: 369_377, color: '#8b5cf6' },
];

/** Share of income that comes from the national NTA (0–1), current period. */
export const ntaShare =
  399_038_038 / incomeCurrent.reduce((s, i) => s + i.amount, 0);

/* ===================== PRIOR FULL YEAR (context) ================= *
 * FY2025 full-year totals, shown for comparison. NOT directly
 * comparable to the 9-month FY2026 figures above.
 * ================================================================= */
export interface YearSummary {
  label: string;
  income: number;
  expenditures: number;
  nta: number;
  ntaShare: number;
}

export const priorYearSummary: YearSummary = {
  label: SRE_PRIOR.periodLabel,
  income: 567_250_944,
  expenditures: 429_021_430,
  nta: 457_211_929,
  ntaShare: 457_211_929 / 567_250_944,
};

/* --------- Dashboard navigation + plain-language helpers ---------- */

export interface BudgetSection {
  id: string;
  label: string;
}

/** Sections shown in the dashboard side navigation (and used by scroll-spy). */
export const BUDGET_SECTIONS: BudgetSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'income', label: 'Where it comes from' },
  { id: 'dependence', label: 'National vs local' },
  { id: 'spending', label: 'Where it goes' },
  { id: 'social', label: 'Social services' },
  { id: 'compare', label: 'vs. FY2025' },
  { id: 'about', label: 'About the data' },
];

export interface GlossaryTerm {
  term: string;
  definition: string;
}

/** Plain-language definitions so residents can study the numbers. */
export const budgetGlossary: GlossaryTerm[] = [
  {
    term: 'National Tax Allotment (NTA)',
    definition:
      "Botolan's share of national taxes, sent by the national government. Formerly called the IRA. It is the town's single biggest source of money.",
  },
  {
    term: 'Local sources',
    definition:
      'Money the town raises itself — local taxes (like real property and business tax) plus fees and charges for services.',
  },
  {
    term: 'Current operating income',
    definition:
      'The regular money the town takes in during the period, from both the NTA and local sources.',
  },
  {
    term: 'Current operating expenditures',
    definition:
      'The regular money the town spends to run services and government during the period.',
  },
  {
    term: 'Year-to-date (YTD)',
    definition:
      'Totals so far this year. "As of Q3" means January to September — nine months, not a full year.',
  },
  {
    term: 'SRE',
    definition:
      'Statement of Receipts and Expenditures — the official financial report every LGU files with the BLGF. These numbers come from it.',
  },
];

/* ------------------------------------------------------------------ *
 * Municipal capital projects (2025) — feeds the /projects tracker.
 *
 * VERIFIED against Daily Tribune (17 Jan 2025) and The Manila Times
 * (22 Jan 2025) reporting of Botolan's 2025 program:
 *   - Four CONSTRUCTION projects (₱199.9M) under a Land Bank facility:
 *       Commercial Building ₱90M, New Taugtog commercial spaces ₱70M,
 *       Administrative Building ₱24.9M, Motor Pool ₱15M.
 *   - A SEPARATE land acquisition: four lots, 10.7 ha, ₱26.97M.
 * Physical / financial progress is NOT published in those sources, so
 * every project's status is left as "programmed" (statusConfirmed:false)
 * until the LGU releases updated figures.
 * ------------------------------------------------------------------ */

export type ProjectCategory =
  'commercial' | 'government' | 'logistics' | 'land';

export const PROJECT_CATEGORY_META: Record<
  ProjectCategory,
  { label: string; color: string }
> = {
  commercial: { label: 'Commercial / revenue', color: '#2563eb' },
  government: { label: 'Government facility', color: '#f59e0b' },
  logistics: { label: 'Logistics & equipment', color: '#8b5cf6' },
  land: { label: 'Land acquisition', color: '#059669' },
};

export type ProjectStatus = 'programmed' | 'ongoing' | 'completed';

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; dot: string; chip: string }
> = {
  programmed: {
    label: 'Programmed',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200',
  },
  ongoing: {
    label: 'Ongoing',
    dot: 'bg-blue-500',
    chip: 'bg-blue-50 text-blue-700 ring-blue-200',
  },
  completed: {
    label: 'Completed',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
};

export interface LocalProject {
  id: string;
  title: string;
  amount: number;
  category: ProjectCategory;
  fundingSource: string;
  year: number;
  status: ProjectStatus;
  /** true only when physical/financial progress is verified from a source. */
  statusConfirmed: boolean;
  description?: string;
}

/** Botolan's own 2025 capital projects (SOMA / 2025 development program). */
export const localProjects: LocalProject[] = [
  {
    id: 'commercial-building',
    title: 'Municipal Commercial Building',
    amount: 90_000_000,
    category: 'commercial',
    fundingSource: 'Land Bank funding facility',
    year: 2025,
    status: 'programmed',
    statusConfirmed: false,
    description:
      'Revenue-generating commercial building — the largest project in the 2025 construction program.',
  },
  {
    id: 'taugtog-commercial',
    title: 'New Taugtog Resettlement — commercial spaces',
    amount: 70_000_000,
    category: 'commercial',
    fundingSource: 'Land Bank funding facility',
    year: 2025,
    status: 'programmed',
    statusConfirmed: false,
    description:
      'Commercial spaces at the New Taugtog Resettlement Area to give relocated families a place to earn a living.',
  },
  {
    id: 'lot-acquisition',
    title: 'Lot acquisition — 10.7 hectares (4 lots)',
    amount: 26_970_000,
    category: 'land',
    fundingSource: 'Municipal funds (separate from the Land Bank program)',
    year: 2025,
    status: 'programmed',
    statusConfirmed: false,
    description:
      'Four lots to host the planned motor pool, fire and police stations, an agri-demo center, a materials recovery facility, and a barangay government complex.',
  },
  {
    id: 'admin-building',
    title: 'Municipal Administrative Building',
    amount: 24_900_000,
    category: 'government',
    fundingSource: 'Land Bank funding facility',
    year: 2025,
    status: 'programmed',
    statusConfirmed: false,
    description:
      'New administrative building to consolidate municipal offices.',
  },
  {
    id: 'motor-pool',
    title: 'Municipal Motor Pool',
    amount: 15_000_000,
    category: 'logistics',
    fundingSource: 'Land Bank funding facility',
    year: 2025,
    status: 'programmed',
    statusConfirmed: false,
    description:
      'Central depot and maintenance facility for municipal vehicles and heavy equipment.',
  },
];

/** The four Land Bank construction projects total (excludes land acquisition). */
export const constructionProgram2025 = localProjects
  .filter(p => p.fundingSource.startsWith('Land Bank'))
  .reduce((sum, p) => sum + p.amount, 0);

/** Every 2025 capital project, land acquisition included. */
export const localProjectsTotal = localProjects.reduce(
  (sum, p) => sum + p.amount,
  0
);

/** Sources behind the municipal project figures. */
export const projectSources: BudgetSource[] = [
  {
    label:
      'Daily Tribune — "Botolan lines up P200M infra projects" (17 Jan 2025)',
    url: 'https://tribune.net.ph/2025/01/17/botolan-lines-up-p200m-infra-projects',
  },
  {
    label: 'The Manila Times — Botolan P200M infrastructure (22 Jan 2025)',
    url: 'https://www.manilatimes.net/2025/01/22/regions/botolan-lines-up-p200m-worth-of-infrastructure-projects-in-2025/2042208',
  },
];

/** CSV export of the municipal capital projects. */
export function localProjectsToCsv(items: LocalProject[]): string {
  const cell = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = [
    'title',
    'category',
    'amount_php',
    'funding_source',
    'year',
    'status',
    'status_confirmed',
  ];
  const lines = items.map(p =>
    [
      p.title,
      PROJECT_CATEGORY_META[p.category].label,
      p.amount,
      p.fundingSource,
      p.year,
      PROJECT_STATUS_META[p.status].label,
      p.statusConfirmed,
    ]
      .map(cell)
      .join(',')
  );
  return [header.join(','), ...lines].join('\n');
}

/** 2025 big-ticket projects for the budget dashboard bars (derived). */
export const bigTicket2025: SpendItem[] = localProjects.map(p => ({
  label: p.title,
  amount: p.amount,
  color: PROJECT_CATEGORY_META[p.category].color,
}));

/** Compact peso formatter: 41_800_000 → "₱41.8M". */
export function formatPesoShort(n: number): string {
  if (n >= 1_000_000_000) return `₱${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)
    return `₱${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `₱${(n / 1_000).toFixed(0)}K`;
  return `₱${n}`;
}

export function formatPesoFull(n: number): string {
  return `₱${new Intl.NumberFormat('en-PH').format(n)}`;
}
