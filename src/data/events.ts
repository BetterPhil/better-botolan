/**
 * Botolan events & calendar data.
 *
 * Holidays + town festivals + all barangay fiestas, transcribed from the
 * official Botolan Tourism 2027 Calendar (Municipal Government of Botolan).
 * Barangay fiestas and fixed holidays are annual; movable holidays are given
 * for 2026 and 2027.
 *
 * HOW TO ADD/EDIT: append to `botolanEvents` (or `BARANGAY_FIESTAS`).
 *  - Annual fixed date → annual: { month: 5, day: 17 } (month 1-12)
 *  - Specific/movable → date: '2027-03-25'
 *  - confirmed: false → shows a "to be confirmed" tag
 */

export type EventCategory =
  'holiday' | 'special' | 'fiesta' | 'lgu' | 'community';

export interface BotolanEvent {
  id: string;
  title: string;
  date?: string;
  annual?: { month: number; day: number };
  category: EventCategory;
  location?: string;
  description?: string;
  confirmed?: boolean;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  holiday: 'Regular Holiday',
  special: 'Special Day',
  fiesta: 'Fiesta',
  lgu: 'LGU Activity',
  community: 'Community',
};

export const CATEGORY_STYLES: Record<
  EventCategory,
  { dot: string; text: string; badge: string }
> = {
  holiday: {
    dot: 'bg-primary-500',
    text: 'text-primary-700',
    badge: 'bg-primary-50 text-primary-700',
  },
  special: {
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700',
  },
  fiesta: {
    dot: 'bg-fuchsia-500',
    text: 'text-fuchsia-700',
    badge: 'bg-fuchsia-50 text-fuchsia-700',
  },
  lgu: {
    dot: 'bg-sky-500',
    text: 'text-sky-700',
    badge: 'bg-sky-50 text-sky-700',
  },
  community: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700',
  },
};

// ---- Barangay fiestas (annual) — from the 2027 Botolan calendar ----
const BARANGAY_FIESTAS: {
  brgy: string;
  month: number;
  day: number;
  span?: string;
}[] = [
  { brgy: 'Bangan', month: 1, day: 1 },
  { brgy: 'Capayawan', month: 1, day: 1 },
  { brgy: 'Parel', month: 1, day: 17, span: 'Jan 17 (3rd Sun)' },
  { brgy: 'Bancal', month: 1, day: 19 },
  { brgy: 'Poonbato', month: 1, day: 23, span: 'Jan 23–24' },
  { brgy: 'Binuclutan', month: 1, day: 30 },
  { brgy: 'Malomboy', month: 2, day: 2 },
  { brgy: 'Cabatuan', month: 2, day: 10, span: 'Feb 10–11' },
  { brgy: 'Beneg', month: 2, day: 13, span: 'Feb 13–14' },
  { brgy: 'Maguisguis', month: 2, day: 23, span: 'Feb 23–24' },
  { brgy: 'Carael', month: 2, day: 28 },
  { brgy: 'Panan', month: 3, day: 19 },
  { brgy: 'Palis', month: 3, day: 26, span: 'Mar 26–27' },
  { brgy: 'Moraza', month: 3, day: 29, span: 'Mar 29–30' },
  { brgy: 'Mambog', month: 4, day: 5 },
  { brgy: 'Belbel', month: 4, day: 14 },
  { brgy: 'Porac', month: 4, day: 15, span: 'Apr 15–16' },
  { brgy: 'Nacolcol', month: 4, day: 23, span: 'Apr 23–24' },
  { brgy: 'Batonlapoc', month: 5, day: 4 },
  { brgy: 'Paco', month: 5, day: 4 },
  { brgy: 'Tampo', month: 5, day: 4 },
  { brgy: 'San Isidro', month: 5, day: 15 },
  { brgy: 'San Juan', month: 6, day: 24 },
  { brgy: 'Santiago', month: 7, day: 25 },
  { brgy: 'San Miguel', month: 9, day: 29 },
  { brgy: 'Danacbunga', month: 10, day: 23, span: 'Oct 23–24 (last Sat–Sun)' },
  { brgy: 'Taugtog', month: 11, day: 30 },
  { brgy: 'Villar', month: 12, day: 3, span: 'Dec 3–4' },
  { brgy: 'Paudpod', month: 12, day: 8 },
  { brgy: 'Owaog-Nibloc', month: 12, day: 20, span: 'Dec 20–21' },
  { brgy: 'Santiago', month: 12, day: 26 },
];

const fiestaEvents: BotolanEvent[] = BARANGAY_FIESTAS.map((f, i) => ({
  id: `fiesta-${f.brgy.toLowerCase().replace(/[^a-z]/g, '')}-${f.month}-${i}`,
  title: `Barangay ${f.brgy} Fiesta`,
  annual: { month: f.month, day: f.day },
  category: 'fiesta',
  location: `Brgy. ${f.brgy}, Botolan`,
  description: `Annual barangay fiesta${f.span ? ` (${f.span})` : ''}.`,
}));

export const botolanEvents: BotolanEvent[] = [
  // ===== Regular holidays (fixed) =====
  {
    id: 'new-year',
    title: "New Year's Day",
    annual: { month: 1, day: 1 },
    category: 'holiday',
  },
  {
    id: 'kagitingan',
    title: 'Araw ng Kagitingan',
    annual: { month: 4, day: 9 },
    category: 'holiday',
    description: 'Day of Valor.',
  },
  {
    id: 'labor-day',
    title: 'Labor Day',
    annual: { month: 5, day: 1 },
    category: 'holiday',
  },
  {
    id: 'independence-day',
    title: 'Independence Day',
    annual: { month: 6, day: 12 },
    category: 'holiday',
    description: 'Araw ng Kalayaan.',
  },
  {
    id: 'bonifacio-day',
    title: 'Bonifacio Day',
    annual: { month: 11, day: 30 },
    category: 'holiday',
  },
  {
    id: 'christmas',
    title: 'Christmas Day',
    annual: { month: 12, day: 25 },
    category: 'holiday',
  },
  {
    id: 'rizal-day',
    title: 'Rizal Day',
    annual: { month: 12, day: 30 },
    category: 'holiday',
  },

  // ===== Special (non-working) days (fixed) =====
  {
    id: 'edsa',
    title: 'EDSA People Power Anniversary',
    annual: { month: 2, day: 25 },
    category: 'special',
  },
  {
    id: 'ninoy',
    title: 'Ninoy Aquino Day',
    annual: { month: 8, day: 21 },
    category: 'special',
  },
  {
    id: 'all-saints',
    title: "All Saints' Day",
    annual: { month: 11, day: 1 },
    category: 'special',
  },
  {
    id: 'all-souls',
    title: "All Souls' Day",
    annual: { month: 11, day: 2 },
    category: 'special',
  },
  {
    id: 'immaculate',
    title: 'Feast of the Immaculate Conception',
    annual: { month: 12, day: 8 },
    category: 'special',
  },
  {
    id: 'christmas-eve',
    title: 'Christmas Eve',
    annual: { month: 12, day: 24 },
    category: 'special',
  },
  {
    id: 'new-year-eve',
    title: "New Year's Eve",
    annual: { month: 12, day: 31 },
    category: 'special',
  },

  // ===== Movable holidays — 2027 (from the Botolan calendar) =====
  {
    id: 'cny-2027',
    title: 'Chinese New Year',
    date: '2027-02-06',
    category: 'special',
  },
  {
    id: 'maundy-2027',
    title: 'Maundy Thursday',
    date: '2027-03-25',
    category: 'holiday',
  },
  {
    id: 'goodfri-2027',
    title: 'Good Friday',
    date: '2027-03-26',
    category: 'holiday',
  },
  {
    id: 'blacksat-2027',
    title: 'Black Saturday',
    date: '2027-03-27',
    category: 'special',
  },
  {
    id: 'heroes-2027',
    title: 'National Heroes Day',
    date: '2027-08-30',
    category: 'holiday',
  },

  // ===== Movable holidays — 2026 =====
  {
    id: 'cny-2026',
    title: 'Chinese New Year',
    date: '2026-02-17',
    category: 'special',
  },
  {
    id: 'maundy-2026',
    title: 'Maundy Thursday',
    date: '2026-04-02',
    category: 'holiday',
  },
  {
    id: 'goodfri-2026',
    title: 'Good Friday',
    date: '2026-04-03',
    category: 'holiday',
  },
  {
    id: 'blacksat-2026',
    title: 'Black Saturday',
    date: '2026-04-04',
    category: 'special',
  },
  {
    id: 'heroes-2026',
    title: 'National Heroes Day',
    date: '2026-08-31',
    category: 'holiday',
  },

  // ===== Botolan town festivals =====
  {
    id: 'ina-poon-bato',
    title: 'Feast of Ina Poon Bato',
    annual: { month: 1, day: 24 },
    category: 'fiesta',
    location: 'Brgy. Poonbato, Botolan',
    description:
      '“Apo Apang,” patroness of Botolan — celebrated every January 24 in Brgy. Poonbato, drawing devotees from across the country.',
  },
  {
    id: 'pinatubo-festival',
    title: 'Mt. Pinatubo Festival',
    annual: { month: 5, day: 4 },
    category: 'lgu',
    location: 'Botolan',
    description:
      "Botolan's town festival celebrating the resilient way of life of the Botoleños and the heritage of the Aytas.",
  },
  {
    id: 'pinatubo-35',
    title: '35 Years of the Mt. Pinatubo Eruption',
    date: '2026-06-15',
    category: 'community',
    description: 'Commemoration of the 1991 Mt. Pinatubo eruption.',
  },
  {
    id: 'dinamulag',
    title: 'Dinamulag (Mango) Festival',
    annual: { month: 4, day: 1 },
    category: 'community',
    description:
      'Province of Zambales festival celebrating the sweet carabao (dinamulag) mango harvest (held in April).',
    confirmed: false,
  },

  // ===== Barangay fiestas =====
  ...fiestaEvents,
];

/** Resolve an event's Date for a given year (expands annual events). */
export function eventDate(ev: BotolanEvent, year: number): Date | null {
  if (ev.annual) {
    return new Date(year, ev.annual.month - 1, ev.annual.day);
  }
  if (ev.date) {
    const [y, m, d] = ev.date.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }
  return null;
}

/** All events that fall within a given calendar year, with resolved dates. */
export function eventsForYear(
  year: number
): { event: BotolanEvent; date: Date }[] {
  return botolanEvents
    .map(event => ({ event, date: eventDate(event, year) }))
    .filter((e): e is { event: BotolanEvent; date: Date } => e.date !== null)
    .filter(e => e.date.getFullYear() === year)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
