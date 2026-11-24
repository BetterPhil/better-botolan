/**
 * Tourism attractions in Botolan, Zambales.
 *
 * Source: Municipality of Botolan — Botolan Tourism Office official brochure
 * ("Botolan, Zambales — Yours to Discover!"), organised into the brochure's own
 * four journeys: EXPLORE (heritage), EXPERIENCE (coast & nature),
 * CONQUER (trails & adventure), and WALK IN FAITH (pilgrim sites).
 *
 * PHOTOS: the immersive tour loads an image for each spot from
 *   public/images/tourism/<slug>.jpg
 * Drop a JPG named after each spot's `slug` there and it appears automatically;
 * until then the tour shows a themed gradient panel with the spot's icon.
 */
export type AttractionCategory = 'explore' | 'experience' | 'conquer' | 'faith';

export type AttractionIcon =
  | 'landmark'
  | 'users'
  | 'flag'
  | 'waves'
  | 'ship'
  | 'shell'
  | 'mountain'
  | 'droplets'
  | 'tent'
  | 'trees'
  | 'church'
  | 'cross'
  | 'sparkles';

export interface Attraction {
  slug: string;
  name: string;
  /** Barangay or area within Botolan. */
  location?: string;
  blurb: string;
  tag: string;
  category: AttractionCategory;
  icon: AttractionIcon;
  source?: { label: string; url: string };
}

/** Per-leg presentation metadata (colors + labels, no components). */
export const CATEGORY_META: Record<
  AttractionCategory,
  {
    label: string;
    tagline: string;
    gradient: string;
    accent: string;
    node: string;
  }
> = {
  explore: {
    label: 'Explore',
    tagline: 'the heritage of Botolan',
    gradient: 'from-amber-500 to-orange-500',
    accent: 'text-amber-600',
    node: 'bg-amber-500',
  },
  experience: {
    label: 'Experience',
    tagline: 'the beauty of Botolan',
    gradient: 'from-sky-500 to-cyan-500',
    accent: 'text-sky-600',
    node: 'bg-sky-500',
  },
  conquer: {
    label: 'Conquer',
    tagline: 'the trails of Botolan',
    gradient: 'from-emerald-500 to-green-600',
    accent: 'text-emerald-600',
    node: 'bg-emerald-600',
  },
  faith: {
    label: 'Walk in Faith',
    tagline: 'the pilgrim sites of Botolan',
    gradient: 'from-violet-500 to-fuchsia-500',
    accent: 'text-violet-600',
    node: 'bg-violet-600',
  },
};

/**
 * Actual photo filenames placed in public/images/tourism/.
 * Map a spot's slug to the exact file name on disk (spaces and case included).
 * Any slug not listed here falls back to "<slug>.jpg"; if that file is missing,
 * the tour shows the themed gradient panel instead.
 */
const IMAGE_FILES: Record<string, string> = {
  'balin-pamana': 'balin.jpg',
  'coast-of-botolan': 'coastal.jpg',
  'bancal-river-cruise': 'bancal.jpg',
  'pawikan-release': 'pawikan.jpg',
  'mt-pinatubo': 'pinatubo trail.jpg',
  'tukal-tukal-falls': 'tukaltukal.jpg',
  'camp-kainomayan': 'kainomayan.jpg',
  'glamping-batis': 'glamping.jpg',
  'ina-poon-bato': 'poonbato church.JPG',
  'ifi-ina-poonbato': 'ifi poonbato.jpg',
  'sta-monica-parish': 'stamonica.jpg',
  'poggio-bustone': 'poggio.jpg',
  'dambana-hermitage': 'dambana.jpg',
  'rizal-bust': 'rizalbust.jpg',
};

/** Image URL for a spot's photo (filenames are URL-encoded for spaces). */
export function attractionImage(a: Attraction): string {
  const file = IMAGE_FILES[a.slug] ?? `${a.slug}.jpg`;
  return `/images/tourism/${encodeURIComponent(file)}`;
}

const TOURISM_OFFICE = {
  label: 'Botolan Tourism Office',
  url: 'https://www.facebook.com/botolantourismoffice',
};

export const attractions: Attraction[] = [
  // ============ EXPLORE — the heritage of Botolan ============
  {
    slug: 'balin-pamana',
    name: 'Balin Pamana (Botolan Heritage Center)',
    location: 'Tampo',
    tag: 'Heritage · Museum',
    category: 'explore',
    icon: 'landmark',
    blurb:
      "Botolan's heritage center and museum, showcasing the town's history, culture, and local products — a first stop for understanding Botolan's story.",
    source: TOURISM_OFFICE,
  },
  {
    slug: 'ayta-pride',
    name: 'Indigenous Ayta Pride',
    tag: 'Culture · Ayta',
    category: 'explore',
    icon: 'users',
    blurb:
      'Botolan highly values and celebrates its Indigenous Peoples, Ayta culture, and rich Sambal heritage — kept alive through storytelling, dance, and nature-based traditions that honour Apo Namalyari.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'rizal-bust',
    name: "Botolan's Rizal Bust",
    tag: 'Heritage · Landmark',
    category: 'explore',
    icon: 'flag',
    blurb:
      'A bust of national hero José Rizal — a masterpiece by National Artist for Sculpture Juan Sajid Imao, a point of civic pride in the town.',
    source: TOURISM_OFFICE,
  },

  // ============ EXPERIENCE — the beauty of Botolan ============
  {
    slug: 'coast-of-botolan',
    name: 'Coast of Botolan',
    location:
      'Panan, Binoclutan, Porac, Bangan, Capayawan, Beneg, Danacbunga, Bancal',
    tag: 'Coast · Beaches',
    category: 'experience',
    icon: 'waves',
    blurb:
      'Long stretches of grey volcanic-sand beaches along Botolan’s western coast, with over 70 resorts where comfort meets nature — lush mangroves, quiet shores, and unforgettable sunsets.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'bancal-river-cruise',
    name: 'Bancal River Cruise',
    location: 'Bancal',
    tag: 'Nature · River',
    category: 'experience',
    icon: 'ship',
    blurb:
      'A scenic river cruise through Bancal, gliding past mangroves and riverside life — a relaxed way to take in Botolan’s waterways.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'pawikan-release',
    name: 'Hatchlings to Horizon (Pawikan Release)',
    location: 'Binoclutan, Danacbunga',
    tag: 'Conservation · Sea turtles',
    category: 'experience',
    icon: 'shell',
    blurb:
      'Sea-turtle (pawikan) hatchling releases along the coast — a conservation experience where visitors help send olive ridley, green, and hawksbill hatchlings to the sea.',
    source: TOURISM_OFFICE,
  },

  // ============ CONQUER — the trails of Botolan ============
  {
    slug: 'mt-pinatubo',
    name: 'Mt. Pinatubo Adventures',
    location: 'Villar',
    tag: 'Trekking · Volcano',
    category: 'conquer',
    icon: 'mountain',
    blurb:
      "The trek to Mount Pinatubo's turquoise crater lake, with Botolan's Villar side a jump-off into the lahar landscapes. Once feared for its 1991 eruption, it is now one of Luzon's most striking hikes.",
    source: TOURISM_OFFICE,
  },
  {
    slug: 'tukal-tukal-falls',
    name: 'Tukal-Tukal Falls',
    location: 'Malomboy',
    tag: 'Nature · Falls',
    category: 'conquer',
    icon: 'droplets',
    blurb:
      'A multi-tier waterfall in Malomboy — a rewarding adventure-trek and swimming spot tucked into Botolan’s interior toward the Pinatubo foothills.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'camp-kainomayan',
    name: 'Camp Kainomayan Adventures',
    location: 'San Juan',
    tag: 'Adventure · Eco-tourism',
    category: 'conquer',
    icon: 'tent',
    blurb:
      'An eco-tourism camp in San Juan offering ATV rides, camping, and outdoor activities with views toward the Pinatubo range — a hub for adventure trips into the uplands.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'glamping-batis',
    name: 'Glamping & Batis',
    location: 'San Juan',
    tag: 'Adventure · Camping',
    category: 'conquer',
    icon: 'trees',
    blurb:
      'Glamping beside a natural spring (batis) in San Juan — comfortable outdoor stays for travellers who want nature without roughing it.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'mountain-trails',
    name: 'Botolan Mountain Trails',
    tag: 'Hiking · Mountains',
    category: 'conquer',
    icon: 'mountain',
    blurb:
      'Beyond Pinatubo, hike the trails of Tukal-Tukal, Mt. Calib-ungan, and Mt. Katung-uhan — every step offering breathtaking views and unique lahar landscapes for nature lovers and thrill seekers.',
    source: TOURISM_OFFICE,
  },

  // ============ WALK IN FAITH — pilgrim sites ============
  {
    slug: 'ina-poon-bato',
    name: 'Ina Poon Bato Shrine',
    location: 'Poonbato',
    tag: 'Faith · Patroness',
    category: 'faith',
    icon: 'church',
    blurb:
      'Ina Poon Bato — “Apo Apang,” the patroness of Botolan — is one of the oldest Marian devotions in the country. Her feast is celebrated every January 24 in Brgy. Poonbato, drawing devotees from across the nation.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'sta-monica-parish',
    name: 'Sta. Monica Parish Church',
    location: 'Tampo',
    tag: 'Faith · Parish',
    category: 'faith',
    icon: 'church',
    blurb:
      "The town's Roman Catholic parish church, dedicated to St. Monica — a centre of Botolan's community religious life and fiesta celebrations.",
    source: TOURISM_OFFICE,
  },
  {
    slug: 'ifi-ina-poonbato',
    name: 'IFI – Ina Poonbato Church',
    location: 'Poonbato',
    tag: 'Faith · Pilgrimage',
    category: 'faith',
    icon: 'church',
    blurb:
      'The Iglesia Filipina Independiente church of Ina Poonbato in Brgy. Poonbato — part of the cluster of pilgrimage sites honouring the devotion.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'poggio-bustone',
    name: 'Poggio Bustone Renewal Center',
    location: 'Beneg',
    tag: 'Faith · Retreat',
    category: 'faith',
    icon: 'sparkles',
    blurb:
      'A Catholic renewal and retreat centre in Brgy. Beneg, set in the countryside — used for recollections, retreats, and spiritual renewal.',
    source: TOURISM_OFFICE,
  },
  {
    slug: 'dambana-hermitage',
    name: 'Dambana Eucharistic Hermitage',
    location: 'Danacbunga',
    tag: 'Faith · Hermitage',
    category: 'faith',
    icon: 'cross',
    blurb:
      'A Eucharistic hermitage and prayer retreat in Brgy. Danacbunga — a quiet pilgrimage and reflection site away from the town centre.',
    source: TOURISM_OFFICE,
  },
];
