/**
 * The 31 barangays of Botolan, Zambales.
 * Population: 2020 Census of Population and Housing (PSA), via PhilAtlas.
 * The 2024 POPCEN municipal total is 70,340; barangay-level 2024 figures
 * are not all published, so these are the 2020 official counts.
 *
 * Source: https://www.philatlas.com/luzon/r03/zambales/botolan.html
 * TODO: add each barangay's captain and contact as they are verified.
 */

export interface Barangay {
  name: string;
  population2020: number;
  population2015: number;
  /** Marked true for the Poblacion (town-center) barangay. */
  poblacion?: boolean;
}

export const BARANGAY_SOURCE =
  'https://www.philatlas.com/luzon/r03/zambales/botolan.html';

export const barangays: Barangay[] = [
  { name: 'Bancal', population2020: 1146, population2015: 1142 },
  { name: 'Bangan', population2020: 1444, population2015: 1327 },
  { name: 'Batonlapoc', population2020: 1455, population2015: 1092 },
  { name: 'Belbel', population2020: 376, population2015: 372 },
  { name: 'Beneg', population2020: 1969, population2015: 1575 },
  { name: 'Binuclutan', population2020: 1239, population2015: 1126 },
  { name: 'Burgos', population2020: 741, population2015: 650 },
  { name: 'Cabatuan', population2020: 814, population2015: 507 },
  { name: 'Capayawan', population2020: 1187, population2015: 1010 },
  { name: 'Carael', population2020: 2405, population2015: 2057 },
  { name: 'Danacbunga', population2020: 3053, population2015: 2970 },
  { name: 'Maguisguis', population2020: 598, population2015: 664 },
  { name: 'Malomboy', population2020: 864, population2015: 276 },
  { name: 'Mambog', population2020: 4524, population2015: 4145 },
  { name: 'Moraza', population2020: 453, population2015: 501 },
  { name: 'Nacolcol', population2020: 495, population2015: 776 },
  { name: 'Owaog-Nibloc', population2020: 420, population2015: 479 },
  { name: 'Paco', population2020: 1935, population2015: 1598 },
  { name: 'Palis', population2020: 455, population2015: 409 },
  { name: 'Panan', population2020: 2926, population2015: 2728 },
  { name: 'Parel', population2020: 1257, population2015: 1091 },
  { name: 'Paudpod', population2020: 946, population2015: 860 },
  { name: 'Poonbato', population2020: 1333, population2015: 998 },
  { name: 'Porac', population2020: 3579, population2015: 3306 },
  { name: 'San Isidro', population2020: 1802, population2015: 1533 },
  { name: 'San Juan', population2020: 8856, population2015: 7002 },
  { name: 'San Miguel', population2020: 1518, population2015: 1355 },
  { name: 'Santiago', population2020: 2331, population2015: 2025 },
  {
    name: 'Tampo (Pob.)',
    population2020: 1827,
    population2015: 1733,
    poblacion: true,
  },
  { name: 'Taugtog', population2020: 14122, population2015: 11393 },
  { name: 'Villar', population2020: 669, population2015: 1007 },
];

export const BARANGAY_COUNT = 31;
export const POPULATION_TOTAL_2020 = 66739;
