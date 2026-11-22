/**
 * Key elected leaders serving Botolan (2025-2028 term).
 * Sources: COMELEC 2025 results (via news media) and Wikipedia.
 *
 * PHOTOS: add each leader's photo to public/leaders/ and set `photo` to the
 * file name (e.g. 'governor.jpg'). Use only images you have the right to use —
 * official portraits released by the official's own office, or photos you took.
 * Until a photo is set, a clean monogram placeholder is shown.
 *
 * Recommended image: square, at least 400x400px, JPG or WebP.
 */

export interface Leader {
  name: string;
  position: string;
  scope: string;
  party?: string;
  note?: string;
  /** File name under public/leaders/, or null for a monogram placeholder. */
  photo: string | null;
  /** Official or source link for verification. */
  sourceUrl?: string;
}

export const leaders: Leader[] = [
  {
    name: 'Hermogenes E. Ebdane Jr.',
    position: 'Provincial Governor',
    scope: 'Province of Zambales',
    party: 'Sulong Zambales Party',
    note: 'Re-elected in 2025. Leads the provincial government of Zambales.',
    photo: 'gov.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/2025_Zambales_local_elections',
  },
  {
    name: 'Doris "Bing" E. Maniquiz',
    position: 'Representative',
    scope: 'Zambales 2nd District (includes Botolan)',
    party: 'Lakas–CMD',
    note: 'Re-elected in 2025. A former Mayor of Botolan (2013–2022).',
    photo: 'doris.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Doris_Maniquiz',
  },
  {
    name: 'Jun Omar C. Ebdane',
    position: 'Municipal Mayor',
    scope: 'Municipality of Botolan',
    party: 'Sulong Zambales Party',
    note: 'Re-elected in May 2025. Chief executive of the municipality.',
    photo: 'omar.jpg',
  },
  {
    name: 'Atty. Edmund Dante D. Perez',
    position: 'Municipal Vice Mayor',
    scope: 'Municipality of Botolan',
    party: 'Sulong Zambales Party',
    note: 'Presiding officer of the Sangguniang Bayan.',
    photo: 'vice_perez.jpg',
  },
];

/** Builds initials for the monogram placeholder. */
export function initials(name: string): string {
  const cleaned = name
    .replace(/"[^"]*"/g, ' ')
    .replace(/\b(Atty|Jr|Sr|Dr)\.?/g, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}
