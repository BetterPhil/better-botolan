/**
 * Disaster preparedness data for Botolan.
 *
 * Hazard info and the preparedness steps are general public-safety guidance
 * (NDRRMC / PHIVOLCS / PAGASA). Official per-location hazard assessment should
 * always be checked via the government tools listed in `hazardTools`.
 *
 * Evacuation centers must be confirmed with the Barangay / MDRRMO — fill the
 * real list below (the seeds are generic examples, clearly marked).
 */

export interface HazardTool {
  name: string;
  description: string;
  url: string;
}

/** Official government hazard / monitoring portals. */
export const hazardTools: HazardTool[] = [
  {
    name: 'HazardHunterPH',
    description:
      'Official per-location hazard assessment — seismic, volcanic, and hydrometeorological (flood, landslide). Search any address or pin a spot in Botolan.',
    url: 'https://hazardhunter.georisk.gov.ph/',
  },
  {
    name: 'GeoRiskPH',
    description:
      'The national hazard and risk information platform of DOST-PHIVOLCS.',
    url: 'https://georisk.gov.ph/',
  },
  {
    name: 'Project NOAH',
    description:
      'Nationwide hazard maps — flood, landslide, and storm-surge layers you can pan over Zambales.',
    url: 'https://noah.up.edu.ph/',
  },
  {
    name: 'PHIVOLCS',
    description:
      'Volcano and earthquake monitoring, including Mt. Pinatubo bulletins and the latest alert level.',
    url: 'https://www.phivolcs.dost.gov.ph/',
  },
  {
    name: 'PAGASA',
    description:
      'Weather forecasts, tropical-cyclone bulletins, and rainfall advisories for Central Luzon.',
    url: 'https://www.pagasa.dost.gov.ph/',
  },
];

/** Botolan-specific hazard context (well-documented, general). */
export const hazardFacts: string[] = [
  'Botolan sits along the western lahar channels of Mt. Pinatubo. The Bucao and Maloma river systems carried massive lahar flows after the 1991 eruption, reshaping low-lying barangays.',
  'Riverside and low-lying barangays are the most flood- and lahar-prone, especially during the southwest monsoon (habagat) and typhoons.',
  'The coastline is exposed to storm surge during strong tropical cyclones.',
  'For the official risk rating of a specific address or barangay, use HazardHunterPH — do not rely on general descriptions alone.',
];

export type HazardKind = 'lahar-flood' | 'typhoon' | 'earthquake';

export interface PreparednessGuide {
  kind: HazardKind;
  title: string;
  icon: 'waves' | 'wind' | 'activity';
  before: string[];
  during: string[];
  after: string[];
}

export const preparednessGuides: PreparednessGuide[] = [
  {
    kind: 'lahar-flood',
    title: 'Lahar & Flood',
    icon: 'waves',
    before: [
      'Know your evacuation route and the nearest evacuation center.',
      'Prepare a go-bag: water, food, medicine, flashlight, IDs, power bank.',
      'Monitor river levels and MDRRMO / PAGASA advisories during heavy rain.',
    ],
    during: [
      'Move to higher ground immediately when advised — do not wait.',
      'Stay away from rivers, creeks, and lahar channels.',
      'Never cross flowing floodwater on foot or by vehicle.',
    ],
    after: [
      'Return only when authorities declare the area safe.',
      'Avoid damaged buildings, bridges, and electrical lines.',
      'Boil or disinfect water before drinking; watch for disease.',
    ],
  },
  {
    kind: 'typhoon',
    title: 'Typhoon',
    icon: 'wind',
    before: [
      'Secure your roof and tie down or bring in loose objects.',
      'Stock food, clean water, medicine, and charge phones / power banks.',
      'Track the storm signal for Zambales via PAGASA.',
    ],
    during: [
      'Stay indoors, away from windows and glass.',
      'Evacuate early if you live in a flood-, lahar-, or surge-prone area.',
      'Keep listening to official advisories.',
    ],
    after: [
      'Watch for fallen power lines and weakened structures.',
      'Report damage and casualties to your Barangay / MDRRMO.',
      'Do not wade through floodwater — it may be contaminated or charged.',
    ],
  },
  {
    kind: 'earthquake',
    title: 'Earthquake',
    icon: 'activity',
    before: [
      'Secure heavy furniture, shelves, and appliances to walls.',
      'Identify safe spots (under sturdy tables) and exits in each room.',
      'Prepare an emergency kit and agree on a family meeting point.',
    ],
    during: [
      'Drop, Cover, and Hold On under a sturdy table until shaking stops.',
      'Stay away from windows, glass, and anything that can fall.',
      'If outdoors, move to an open area away from buildings and posts.',
    ],
    after: [
      'Expect aftershocks; check yourself and others for injuries.',
      'Check for gas leaks, fire, and structural damage before re-entering.',
      'If near the coast and shaking is strong, move inland / to high ground.',
    ],
  },
];

export interface EvacuationCenter {
  name: string;
  barangay?: string;
  type?: string;
  note?: string;
  /** false → not yet confirmed with MDRRMO. */
  confirmed?: boolean;
}

/**
 * EXAMPLES — replace with the official MDRRMO list of designated evacuation
 * centers for Botolan. These generic entries are marked "to be confirmed".
 */
export const evacuationCenters: EvacuationCenter[] = [
  {
    name: 'Botolan Municipal Covered Court / Gymnasium',
    barangay: 'Poblacion',
    type: 'Covered court',
    note: 'Typical town-level evacuation site — confirm with MDRRMO.',
    confirmed: false,
  },
  {
    name: 'Public schools (per barangay)',
    type: 'School',
    note: 'Elementary and national high schools commonly serve as evacuation centers. Ask your Barangay for the one assigned to you.',
    confirmed: false,
  },
  {
    name: 'Barangay halls & covered courts',
    type: 'Barangay facility',
    note: 'Each barangay designates its own evacuation area. Confirm the nearest one with your Barangay officials.',
    confirmed: false,
  },
];
