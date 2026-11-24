/**
 * Client-side site search — no server or Meilisearch required.
 *
 * Builds an in-browser index at module load from the same content that powers
 * the site (service categories + their how-to guides, barangays, and the main
 * pages), then runs a small token-based scorer over it. Everything is bundled,
 * so results are instant and work fully offline.
 *
 * If VITE_MEILISEARCH_HOST is ever configured, the Meilisearch path in
 * ../lib/meilisearch can be reintroduced; this module is the zero-setup default.
 */
import * as yaml from 'js-yaml';
import { serviceCategories } from '../data/yamlLoader';
import { barangays } from '../data/barangays';

export type SearchKind = 'service' | 'government' | 'barangay' | 'page';

export interface ClientSearchHit {
  id: string;
  title: string;
  description: string;
  /** Short badge label shown on the result card. */
  category: string;
  kind: SearchKind;
  url: string;
}

interface IndexYaml {
  pages?: { name: string; slug: string; description?: string }[];
}

// Eagerly bundle every service category index.yaml as raw text.
const serviceIndexFiles = import.meta.glob(
  '../../content/services/*/index.yaml',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

function categoryNameFor(slug: string): string {
  const cat = serviceCategories.categories.find(c => c.slug === slug);
  return cat ? cat.category : slug;
}

function buildServiceHits(): ClientSearchHit[] {
  const hits: ClientSearchHit[] = [];

  // Category landing pages.
  for (const cat of serviceCategories.categories) {
    hits.push({
      id: `service-cat-${cat.slug}`,
      title: cat.category,
      description: cat.description ?? '',
      category: 'Service category',
      kind: 'service',
      url: `/services/${cat.slug}`,
    });
  }

  // Individual how-to guides under each category.
  for (const [path, raw] of Object.entries(serviceIndexFiles)) {
    const match = path.match(/content\/services\/([^/]+)\/index\.yaml$/);
    if (!match) continue;
    const catSlug = match[1];
    const catName = categoryNameFor(catSlug);
    let data: IndexYaml;
    try {
      data = (yaml.load(raw) as IndexYaml) ?? {};
    } catch {
      data = {};
    }
    for (const page of data.pages ?? []) {
      hits.push({
        id: `service-${catSlug}-${page.slug}`,
        title: page.name,
        description: page.description ?? '',
        category: catName,
        kind: 'service',
        url: `/services/${catSlug}/${page.slug}`,
      });
    }
  }

  return hits;
}

function buildBarangayHits(): ClientSearchHit[] {
  return barangays.map(b => ({
    id: `barangay-${b.slug}`,
    title: b.name,
    description:
      (b.tags && b.tags.length ? `${b.tags.join(', ')}. ` : '') +
      `Barangay of Botolan — population ${b.population2020.toLocaleString()} (2020).`,
    category: 'Barangay',
    kind: 'barangay' as const,
    url: `/barangays/${b.slug}`,
  }));
}

// Key standalone pages worth surfacing in search.
const staticPageHits: ClientSearchHit[] = [
  {
    id: 'page-barangays',
    title: 'Barangays',
    description:
      'Directory of Botolan’s 31 barangays with population and history.',
    category: 'Page',
    kind: 'page',
    url: '/barangays',
  },
  {
    id: 'page-schools',
    title: 'Schools',
    description: 'Public and private schools serving Botolan.',
    category: 'Page',
    kind: 'page',
    url: '/schools',
  },
  {
    id: 'page-tourism',
    title: 'Tourism',
    description: 'Mount Pinatubo, attractions, and festivals in Botolan.',
    category: 'Page',
    kind: 'page',
    url: '/tourism',
  },
  {
    id: 'page-statistics',
    title: 'Statistics',
    description: 'Population trends and key figures for Botolan.',
    category: 'Page',
    kind: 'page',
    url: '/statistics',
  },
  {
    id: 'page-hotlines',
    title: 'Emergency Hotlines',
    description:
      'MDRRMO, police, fire, health, and emergency contact numbers for Botolan.',
    category: 'Emergency',
    kind: 'page',
    url: '/hotlines',
  },
  {
    id: 'page-projects',
    title: 'Budget Projects',
    description: 'National-budget-funded projects for Botolan.',
    category: 'Transparency',
    kind: 'government',
    url: '/projects',
  },
  {
    id: 'page-transparency',
    title: 'Transparency Portal',
    description: 'Open data and transparency resources for Botolan.',
    category: 'Transparency',
    kind: 'government',
    url: '/transparency',
  },
  {
    id: 'page-full-disclosure',
    title: 'Full Disclosure',
    description: 'DILG Full Disclosure Policy financial documents.',
    category: 'Transparency',
    kind: 'government',
    url: '/full-disclosure',
  },
  {
    id: 'page-citizens-charter',
    title: "Citizen's Charter",
    description:
      'Frontline services, requirements, fees, and processing times.',
    category: 'Transparency',
    kind: 'government',
    url: '/citizens-charter',
  },
  {
    id: 'page-directory',
    title: 'Government Directory',
    description: 'Municipal offices and barangay captains of Botolan.',
    category: 'Government',
    kind: 'government',
    url: '/directory',
  },
  {
    id: 'page-government',
    title: 'Government Offices',
    description: 'Executive and legislative offices of Botolan.',
    category: 'Government',
    kind: 'government',
    url: '/government/departments',
  },
  {
    id: 'page-about',
    title: 'About & Contact',
    description: 'About this community portal and how to get in touch.',
    category: 'Page',
    kind: 'page',
    url: '/about',
  },
];

// Build the index once at module load.
const INDEX: ClientSearchHit[] = [
  ...buildServiceHits(),
  ...buildBarangayHits(),
  ...staticPageHits,
];

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
}

/** Score a hit against the query tokens. Returns 0 when not all tokens match. */
function scoreHit(hit: ClientSearchHit, tokens: string[]): number {
  const title = normalize(hit.title);
  const category = normalize(hit.category);
  const description = normalize(hit.description);
  let score = 0;

  for (const token of tokens) {
    const inTitle = title.includes(token);
    const inCategory = category.includes(token);
    const inDescription = description.includes(token);
    if (!inTitle && !inCategory && !inDescription) {
      return 0; // every token must appear somewhere (AND match)
    }
    if (inTitle) {
      score += 5;
      if (title.startsWith(token)) score += 3;
      if (new RegExp(`\\b${token}`).test(title)) score += 2;
    }
    if (inCategory) score += 2;
    if (inDescription) score += 1;
  }
  return score;
}

export const isSearchEnabled = true;

export function searchContent(query: string, limit = 25): ClientSearchHit[] {
  const q = normalize(query).trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];

  return INDEX.map(hit => ({ hit, score: scoreHit(hit, tokens) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || a.hit.title.localeCompare(b.hit.title))
    .slice(0, limit)
    .map(r => r.hit);
}

/** Total number of indexed items (useful for debugging / display). */
export const searchIndexSize = INDEX.length;
