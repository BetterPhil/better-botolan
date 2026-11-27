/**
 * Budget & spending data for the "Where the money goes" dashboard.
 *
 * VERIFIED figures are from public reporting of Mayor Jun Omar Ebdane's 2025
 * State of the Municipal Address (SOMA) and the 2023 Cities & Municipalities
 * Competitive Index (CMCI). Full official income / National Tax Allotment /
 * expenditure statements come from BLGF and DBM — linked below and left for the
 * LGU to fill with exact figures (marked confirmed: false).
 *
 * Sources:
 *  - Punto! Central Luzon / Business Mirror / Manila Times (Botolan 2025 program)
 *  - DILG Full Disclosure Policy Portal, BLGF SRE, DBM NTA
 */

export interface BudgetSource {
  label: string;
  url: string;
}

export const budgetSources: BudgetSource[] = [
  {
    label: 'DILG Full Disclosure Policy Portal',
    url: 'https://fdpp.dilg.gov.ph/',
  },
  {
    label: 'Bureau of Local Government Finance (BLGF)',
    url: 'https://blgf.gov.ph/',
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
    id: 'local-revenue',
    label: 'Local revenue',
    value: 494_200_000,
    prefix: '₱',
    detail:
      'Third-largest local revenue in Zambales (2023 Cities & Municipalities Competitive Index).',
    confirmed: true,
  },
  {
    id: 'dev-program-2025',
    label: '2025 development program',
    value: 199_900_000,
    prefix: '₱',
    detail:
      'Big-ticket projects announced for 2025 (Land Bank funding facility).',
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
  {
    id: 'nta',
    label: 'National Tax Allotment',
    value: null,
    display: 'To confirm',
    detail:
      "Botolan's annual NTA share from the national government — add the DBM figure here.",
    confirmed: false,
  },
];

export interface SpendItem {
  label: string;
  amount: number;
  color: string;
  note?: string;
}

/** Reported 2024 program spending (SOMA accomplishments). */
export const spending2024: SpendItem[] = [
  {
    label: 'Infrastructure (20% Dev. Fund)',
    amount: 41_800_000,
    color: '#2563eb',
  },
  {
    label: 'Disaster Preparedness & Mitigation',
    amount: 12_000_000,
    color: '#0ea5e9',
  },
  { label: 'College Scholarships', amount: 8_500_000, color: '#059669' },
  { label: 'High School Scholarships', amount: 4_120_000, color: '#f59e0b' },
  {
    label: 'Seal of Good Local Governance',
    amount: 1_300_000,
    color: '#8b5cf6',
  },
  { label: 'Anti-Drug Abuse Council', amount: 150_000, color: '#ef4444' },
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
