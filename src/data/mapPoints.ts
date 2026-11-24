/**
 * Points of interest in Botolan for the interactive map.
 * Coordinates are decimal degrees (WGS84).
 *
 * Verified points carry real coordinates. To add more (barangay halls,
 * schools, health stations, evacuation centers), append entries here with
 * their lat/lng — the map and its legend update automatically.
 *
 * Sources: config (town center) and latlong.net (Mount Pinatubo).
 */

export type PointCategory =
  'government' | 'landmark' | 'health' | 'school' | 'evacuation';

export interface MapPoint {
  name: string;
  category: PointCategory;
  lat: number;
  lng: number;
  description?: string;
}

export const categoryMeta: Record<
  PointCategory,
  { label: string; color: string }
> = {
  government: { label: 'Government', color: '#2563eb' },
  landmark: { label: 'Landmark', color: '#7d5900' },
  health: { label: 'Health', color: '#007a3d' },
  school: { label: 'School', color: '#1d4ed8' },
  evacuation: { label: 'Evacuation', color: '#9333ea' },
};

// Centre + default zoom for the map view.
export const BOTOLAN_CENTER: [number, number] = [15.23, 120.13];
export const BOTOLAN_ZOOM = 11;

export const mapPoints: MapPoint[] = [
  {
    name: 'Botolan town proper (Poblacion)',
    category: 'government',
    lat: 15.2896,
    lng: 120.0245,
    description:
      'The town center of Botolan, where the Municipal Hall and main offices are located.',
  },
  {
    name: 'Mount Pinatubo Crater Lake',
    category: 'landmark',
    lat: 15.1501,
    lng: 120.3465,
    description:
      "The summit crater lake of Mount Pinatubo lies within Botolan's territory. The volcano erupted in June 1991.",
  },
  // TODO: add more verified points, e.g.
  // { name: 'Botolan Rural Health Unit I (Batonlapoc)', category: 'health', lat: ..., lng: ... },
  // { name: 'Dr. Florentino C. Doble Memorial Hospital (New Taugtog)', category: 'health', lat: ..., lng: ... },
];
