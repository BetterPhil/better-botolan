/**
 * Botolan events & calendar data.
 *
 * HOW TO ADD AN EVENT
 * -------------------
 * Append an object to the `botolanEvents` array below.
 *
 *  - One-off or movable date → use `date: '2026-05-17'` (ISO YYYY-MM-DD).
 *  - Repeats every year on a fixed date → use `annual: { month: 5, day: 17 }`
 *    (month is 1-12). It will show on that date for whichever year is viewed.
 *  - Set `confirmed: false` for anything whose date still needs to be verified
 *    with the LGU — it renders with a "To be confirmed" tag.
 *
 * National holidays below are the fixed-date ones plus the movable 2026 dates.
 * Eid'l Fitr and Eid'l Adha are proclaimed yearly and are intentionally left
 * out — add them once the Malacañang proclamation sets the dates.
 *
 * Botolan fiestas, barangay fiestas, and LGU activities should be added here by
 * the LGU / community (see the commented examples at the bottom).
 */

export type EventCategory =
  'holiday' | 'special' | 'fiesta' | 'lgu' | 'community';

export interface BotolanEvent {
  id: string;
  title: string;
  /** Specific date for one-off / movable events, ISO 'YYYY-MM-DD'. */
  date?: string;
  /** Fixed annual date (repeats every year). month is 1-12. */
  annual?: { month: number; day: number };
  category: EventCategory;
  location?: string;
  description?: string;
  /** false → still needs LGU confirmation (shown with a tag). Default true. */
  confirmed?: boolean;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  holiday: 'Regular Holiday',
  special: 'Special Day',
  fiesta: 'Fiesta',
  lgu: 'LGU Activity',
  community: 'Community',
};

/** Tailwind color tokens per category (dot, text, soft background). */
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
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    badge: 'bg-blue-50 text-blue-700',
  },
  community: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700',
  },
};

export const botolanEvents: BotolanEvent[] = [
  // ---- Regular holidays (fixed date, every year) ----
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

  // ---- Special (non-working) days, fixed date ----
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
    id: 'last-day-year',
    title: 'Last Day of the Year',
    annual: { month: 12, day: 31 },
    category: 'special',
  },

  // ---- Movable holidays — specific to 2026 ----
  {
    id: 'chinese-new-year-2026',
    title: 'Chinese New Year',
    date: '2026-02-17',
    category: 'special',
  },
  {
    id: 'maundy-thursday-2026',
    title: 'Maundy Thursday',
    date: '2026-04-02',
    category: 'holiday',
  },
  {
    id: 'good-friday-2026',
    title: 'Good Friday',
    date: '2026-04-03',
    category: 'holiday',
  },
  {
    id: 'black-saturday-2026',
    title: 'Black Saturday',
    date: '2026-04-04',
    category: 'special',
  },
  {
    id: 'heroes-day-2026',
    title: 'National Heroes Day',
    date: '2026-08-31',
    category: 'holiday',
  },

  // ---- Botolan local events ----
  // Add the town fiesta, barangay fiestas, and LGU activities here.
  // Example (uncomment and set the real date):
  //
  // {
  //   id: 'botolan-town-fiesta',
  //   title: 'Botolan Town Fiesta',
  //   date: '2026-00-00',          // set the real date
  //   category: 'fiesta',
  //   location: 'Poblacion, Botolan',
  //   description: 'Annual town fiesta in honor of the patron saint.',
  //   confirmed: false,
  // },
  // {
  //   id: 'barangay-assembly-q1',
  //   title: 'Barangay Assembly Day',
  //   date: '2026-00-00',
  //   category: 'lgu',
  //   description: 'Quarterly barangay assembly across all 31 barangays.',
  //   confirmed: false,
  // },
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
