/**
 * The 31 barangays of Botolan, Zambales.
 * Population: 2020 Census of Population and Housing (PSA), via PhilAtlas.
 * The 2024 POPCEN municipal total is 70,340; barangay-level 2024 figures
 * are not all published, so these are the 2020 official counts.
 *
 * History is drawn from public sources (Wikipedia and Inquirer reporting on
 * the Aeta of Botolan). Only barangays with documented history carry a
 * `history` field; the rest show an empty state inviting contributions.
 *
 * Population source: https://www.philatlas.com/luzon/r03/zambales/botolan.html
 */

export interface BarangaySource {
  label: string;
  url: string;
}

export interface Barangay {
  name: string;
  /** URL-safe id used for /barangays/:slug */
  slug: string;
  population2020: number;
  population2015: number;
  /** Marked true for the Poblacion (town-center) barangay. */
  poblacion?: boolean;
  /** Short descriptive labels, e.g. 'Resettlement area'. */
  tags?: string[];
  /** One or more paragraphs of documented history. */
  history?: string[];
  sources?: BarangaySource[];
}

export const BARANGAY_SOURCE =
  'https://www.philatlas.com/luzon/r03/zambales/botolan.html';

export const barangays: Barangay[] = [
  {
    name: 'Bancal',
    slug: 'bancal',
    population2020: 1146,
    population2015: 1142,
  },
  {
    name: 'Bangan',
    slug: 'bangan',
    population2020: 1444,
    population2015: 1327,
  },
  {
    name: 'Batonlapoc',
    slug: 'batonlapoc',
    population2020: 1455,
    population2015: 1092,
    tags: ['Health services hub'],
    history: [
      "Batonlapoc is home to Botolan's Rural Health Unit I. A hemodialysis facility serving residents of the municipality operates in the barangay, making it a center for local health services.",
    ],
  },
  {
    name: 'Belbel',
    slug: 'belbel',
    population2020: 376,
    population2015: 372,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Belbel was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  { name: 'Beneg', slug: 'beneg', population2020: 1969, population2015: 1575 },
  {
    name: 'Binuclutan',
    slug: 'binuclutan',
    population2020: 1239,
    population2015: 1126,
  },
  {
    name: 'Burgos',
    slug: 'burgos',
    population2020: 741,
    population2015: 650,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Burgos was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'In May 1991, Aeta of the Lakas group marched back to Sitio Ugek in Burgos to perform a ritual. Their elders had concluded that geothermal drilling on the mountain disturbed Apo Namalyari, the deity they believe dwells on Pinatubo.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  {
    name: 'Cabatuan',
    slug: 'cabatuan',
    population2020: 814,
    population2015: 507,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Cabatuan was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  {
    name: 'Capayawan',
    slug: 'capayawan',
    population2020: 1187,
    population2015: 1010,
  },
  {
    name: 'Carael',
    slug: 'carael',
    population2020: 2405,
    population2015: 2057,
  },
  {
    name: 'Danacbunga',
    slug: 'danacbunga',
    population2020: 3053,
    population2015: 2970,
  },
  {
    name: 'Maguisguis',
    slug: 'maguisguis',
    population2020: 598,
    population2015: 664,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Maguisguis was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  {
    name: 'Malomboy',
    slug: 'malomboy',
    population2020: 864,
    population2015: 276,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Malomboy was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  {
    name: 'Mambog',
    slug: 'mambog',
    population2020: 4524,
    population2015: 4145,
    tags: ['Resettlement area'],
    history: [
      'In 1993 the Aeta organization Lakas bought and developed the Bihawo resettlement site in Mambog for families displaced by the 1991 Mount Pinatubo eruption. It became one of the places where evacuees from the upland Baytan villages rebuilt their lives.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  {
    name: 'Moraza',
    slug: 'moraza',
    population2020: 453,
    population2015: 501,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Moraza was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  {
    name: 'Nacolcol',
    slug: 'nacolcol',
    population2020: 495,
    population2015: 776,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Nacolcol was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  {
    name: 'Owaog-Nibloc',
    slug: 'owaog-nibloc',
    population2020: 420,
    population2015: 479,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Owaog-Nibloc was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  { name: 'Paco', slug: 'paco', population2020: 1935, population2015: 1598 },
  {
    name: 'Palis',
    slug: 'palis',
    population2020: 455,
    population2015: 409,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Palis was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Since the late 1990s, some Aeta families have returned to their ancestral land here to farm, though mostly on their own rather than through an organized program.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
  { name: 'Panan', slug: 'panan', population2020: 2926, population2015: 2728 },
  { name: 'Parel', slug: 'parel', population2020: 1257, population2015: 1091 },
  {
    name: 'Paudpod',
    slug: 'paudpod',
    population2020: 946,
    population2015: 860,
  },
  {
    name: 'Poonbato',
    slug: 'poonbato',
    population2020: 1333,
    population2015: 998,
    tags: ['Baytan (Aeta) village', 'Marian devotion'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Poonbato was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Poonbato gave its name to Ina Poon Bato — “Mother on the Rock” — a centuries-old Marian devotion that began when the Aeta venerated a wooden image found on a large rock here. After the eruption, the devotion and its community were moved to the Loob-Bunga resettlement.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
      {
        label: 'Wikipedia: Botolan',
        url: 'https://en.wikipedia.org/wiki/Botolan',
      },
    ],
  },
  { name: 'Porac', slug: 'porac', population2020: 3579, population2015: 3306 },
  {
    name: 'San Isidro',
    slug: 'san-isidro',
    population2020: 1802,
    population2015: 1533,
  },
  {
    name: 'San Juan',
    slug: 'san-juan',
    population2020: 8856,
    population2015: 7002,
  },
  {
    name: 'San Miguel',
    slug: 'san-miguel',
    population2020: 1518,
    population2015: 1355,
  },
  {
    name: 'Santiago',
    slug: 'santiago',
    population2020: 2331,
    population2015: 2025,
  },
  {
    name: 'Tampo (Pob.)',
    slug: 'tampo',
    population2020: 1827,
    population2015: 1733,
    poblacion: true,
    tags: ['Poblacion'],
    history: [
      'Tampo is the Poblacion — the town center of Botolan. When Mount Pinatubo erupted in 1991, thousands of Aeta families from the upland Baytan villages were first evacuated to schools here before being moved to the resettlement sites.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
      {
        label: 'Wikipedia: Botolan',
        url: 'https://en.wikipedia.org/wiki/Botolan',
      },
    ],
  },
  {
    name: 'Taugtog',
    slug: 'taugtog',
    population2020: 14122,
    population2015: 11393,
    tags: ['Resettlement area'],
    history: [
      'New Taugtog, a resettlement area within Taugtog, grew after the 1991 Mount Pinatubo eruption and is today the most populous barangay of Botolan. It is home to the Dr. Florentino C. Doble Memorial Hospital, which serves the municipality.',
    ],
    sources: [
      {
        label: 'Wikipedia: Botolan',
        url: 'https://en.wikipedia.org/wiki/Botolan',
      },
    ],
  },
  {
    name: 'Villar',
    slug: 'villar',
    population2020: 669,
    population2015: 1007,
    tags: ['Baytan (Aeta) village'],
    history: [
      "Before the 1991 eruption of Mount Pinatubo, Villar was one of the eleven upland Aeta villages collectively known as Baytan. In April 1991 its residents were evacuated to schools in Botolan's town center, and the village was emptied as ash and lahar swept the slopes.",
      'Aeta families still go up to Villar to farm during the dry months and move back down to the lowland resettlements when the rains come — a seasonal rhythm reflected in its shifting population.',
    ],
    sources: [
      {
        label: 'Inquirer: Pinatubo Aetas still far from home',
        url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
      },
    ],
  },
];

export const BARANGAY_COUNT = 31;
export const POPULATION_TOTAL_2020 = 66739;

export function getBarangay(slug: string): Barangay | undefined {
  return barangays.find(b => b.slug === slug);
}
