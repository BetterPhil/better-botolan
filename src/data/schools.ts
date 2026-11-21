/**
 * Public and private schools in Botolan, Zambales.
 * Source: TeacherPH school directory (compiled from DepEd data).
 * https://www.teacherph.com/schools/zambales/botolan
 *
 * Level is inferred from the school name (Elementary / Secondary / Integrated).
 * Verify enrolment and exact level against the DepEd Schools Division of Zambales.
 */

export type SchoolLevel = 'Elementary' | 'Secondary' | 'Integrated' | 'Other';
export type SchoolSector = 'Public' | 'Private';

export interface School {
  name: string;
  sector: SchoolSector;
  level: SchoolLevel;
}

export const SCHOOLS_SOURCE =
  'https://www.teacherph.com/schools/zambales/botolan';

export const schools: School[] = [
  { name: 'Alao Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Bancal Integrated School', sector: 'Public', level: 'Integrated' },
  {
    name: 'Bangan-Capayawan Integrated School',
    sector: 'Public',
    level: 'Integrated',
  },
  {
    name: 'Baquilan Resettlement High School',
    sector: 'Public',
    level: 'Secondary',
  },
  { name: 'Baquilan Resettlement School I', sector: 'Public', level: 'Other' },
  { name: 'Baquilan Resettlement School II', sector: 'Public', level: 'Other' },
  {
    name: 'Batonlapoc Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  { name: 'Belbel Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Beneg Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Beneg National High School', sector: 'Public', level: 'Secondary' },
  { name: 'Bihawo Elementary School', sector: 'Public', level: 'Elementary' },
  {
    name: 'Binoclutan Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  {
    name: 'Botolan National High School',
    sector: 'Public',
    level: 'Secondary',
  },
  {
    name: 'Botolan North Integrated School',
    sector: 'Public',
    level: 'Integrated',
  },
  {
    name: 'Botolan South Central School',
    sector: 'Public',
    level: 'Elementary',
  },
  { name: 'Bucao Integrated School', sector: 'Public', level: 'Integrated' },
  { name: 'Buen Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Burgos Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Cabatuan Integrated School', sector: 'Public', level: 'Integrated' },
  { name: 'Carael Integrated School', sector: 'Public', level: 'Integrated' },
  {
    name: 'Danacbunga Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  {
    name: 'Dojoc Balite Integrated School',
    sector: 'Public',
    level: 'Integrated',
  },
  {
    name: 'Kainomayan Village Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  { name: 'Lakas High School', sector: 'Public', level: 'Secondary' },
  {
    name: 'Loob Bunga High School (Resettlement School)',
    sector: 'Public',
    level: 'Secondary',
  },
  {
    name: 'Loob-Bunga I Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  {
    name: 'Loob-Bunga II Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  {
    name: 'Loob-Bunga III Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  {
    name: 'Maguisguis Integrated School',
    sector: 'Public',
    level: 'Integrated',
  },
  { name: 'Mambog Integrated School', sector: 'Public', level: 'Integrated' },
  { name: 'Moraza Integrated School', sector: 'Public', level: 'Integrated' },
  { name: 'Nacolcol Integrated School', sector: 'Public', level: 'Integrated' },
  {
    name: 'New Taugtog Elementary School II',
    sector: 'Public',
    level: 'Elementary',
  },
  {
    name: 'New Taugtog I Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  {
    name: 'New Taugtog National High School',
    sector: 'Public',
    level: 'Secondary',
  },
  {
    name: 'Owaog-Nebloc Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  { name: 'Paitan Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Palis Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Panan Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Panan National High School', sector: 'Public', level: 'Secondary' },
  { name: 'Parel Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Paudpod Elementary School', sector: 'Public', level: 'Elementary' },
  { name: 'Poonbato Integrated School', sector: 'Public', level: 'Integrated' },
  { name: 'Porac Integrated School', sector: 'Public', level: 'Integrated' },
  {
    name: 'San Isidro Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  { name: 'San Juan Integrated School', sector: 'Public', level: 'Integrated' },
  {
    name: 'San Miguel Elementary School',
    sector: 'Public',
    level: 'Elementary',
  },
  { name: 'Santiago Integrated School', sector: 'Public', level: 'Integrated' },
  { name: 'Villar Integrated School', sector: 'Public', level: 'Integrated' },
  {
    name: 'Casa Mambog Learning Center, Inc.',
    sector: 'Private',
    level: 'Other',
  },
  {
    name: 'Fountain of Blessings Development Center, Inc.',
    sector: 'Private',
    level: 'Other',
  },
  {
    name: 'Lyceum of Central Luzon - Zambales, Inc.',
    sector: 'Private',
    level: 'Other',
  },
  {
    name: 'Lyceum of Western Luzon - Zambales, Inc.',
    sector: 'Private',
    level: 'Other',
  },
  {
    name: 'Mother Theresa Collegio De Zambales',
    sector: 'Private',
    level: 'Other',
  },
  {
    name: 'Sta. Monica Parochial Institute of Botolan, Inc.',
    sector: 'Private',
    level: 'Other',
  },
];

export const SCHOOLS_PUBLIC = 49;
export const SCHOOLS_PRIVATE = 6;
export const SCHOOLS_TOTAL = 55;
