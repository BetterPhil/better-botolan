/**
 * Verified facts about Botolan for the homepage.
 *
 * Every entry records WHERE the number came from and WHEN it applies.
 * When PSA releases new figures, edit the values here (nothing else).
 *
 * Last verified: 21 Nov 2026.
 */

export interface Fact {
  id: string;
  label: string;
  value: string;
  detail: string;
  source: string;
  sourceUrl: string;
}

export const quickFacts: Fact[] = [
  {
    id: 'population',
    label: 'Population',
    value: '70,340',
    detail: '2024 Census of Population (POPCEN). Up from 66,739 in 2020.',
    source: 'PSA, 2024 POPCEN',
    sourceUrl: 'https://en.wikipedia.org/wiki/Botolan',
  },
  {
    id: 'barangays',
    label: 'Barangays',
    value: '31',
    detail: 'Each barangay is made up of puroks, and some have sitios.',
    source: 'PSA / PhilAtlas',
    sourceUrl: 'https://www.philatlas.com/luzon/r03/zambales/botolan.html',
  },
  {
    id: 'area',
    label: 'Land area',
    value: '735.28 km²',
    detail:
      'About 20% of Zambales. The largest municipality in the province by area.',
    source: 'PSA / PhilAtlas',
    sourceUrl: 'https://www.philatlas.com/luzon/r03/zambales/botolan.html',
  },
  {
    id: 'density',
    label: 'Density',
    value: '96 / km²',
    detail: '70,340 people over 735.28 km² (computed: 95.66 per km²).',
    source: 'Computed from PSA figures',
    sourceUrl: 'https://en.wikipedia.org/wiki/Botolan',
  },
  {
    id: 'income-class',
    label: 'Income class',
    value: '1st class',
    detail: 'Municipal income classification under the PSGC listing.',
    source: 'PSA, PSGC',
    sourceUrl: 'https://psa.gov.ph/classification/psgc/citimuni/0307100000',
  },
];

export interface Highlight {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceUrl: string;
}

export const highlights: Highlight[] = [
  {
    id: 'pinatubo',
    title: 'Home of Mount Pinatubo',
    body: 'The summit and crater lake of Mount Pinatubo lie within Botolan, near where Zambales, Pampanga and Tarlac meet. The volcano erupted violently in June 1991.',
    source: 'Wikipedia: Zambales',
    sourceUrl: 'https://en.wikipedia.org/wiki/Zambales',
  },
  {
    id: 'turtles',
    title: 'Nesting beaches for sea turtles',
    body: 'Olive ridley, green and hawksbill turtles nest along the Botolan coastline each year between September and January.',
    source: 'Wikipedia: Botolan',
    sourceUrl: 'https://en.wikipedia.org/wiki/Botolan',
  },
  {
    id: 'location',
    title: 'Just south of Iba',
    body: 'Botolan sits about 7 km from Iba, the provincial capital, roughly 71 km from Olongapo and 197 km from Manila.',
    source: 'Wikipedia: Botolan',
    sourceUrl: 'https://en.wikipedia.org/wiki/Botolan',
  },
  {
    id: 'history',
    title: 'One of the oldest towns in Zambales',
    body: 'Botolan was founded in 1572, among the earliest towns in the province alongside Subic.',
    source: 'Wikipedia: Zambales',
    sourceUrl: 'https://en.wikipedia.org/wiki/Zambales',
  },
];
