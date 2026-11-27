import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  MapPin,
  X,
} from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import SEO from '../components/SEO';
import { cn } from '../lib/utils';
import { siteConfig } from '../config/site';
import {
  eventsForYear,
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  type BotolanEvent,
  type EventCategory,
} from '../data/events';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CATEGORY_GRADIENT: Record<EventCategory, string> = {
  holiday: 'from-blue-600 to-blue-800',
  special: 'from-amber-500 to-orange-500',
  fiesta: 'from-fuchsia-500 to-pink-500',
  lgu: 'from-sky-500 to-cyan-500',
  community: 'from-emerald-500 to-green-600',
};

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[];

function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

const longDate = new Intl.DateTimeFormat('en-PH', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

interface EventEntry {
  event: BotolanEvent;
  date: Date;
}

/** Build and download an .ics file so a visitor can add the event to their own calendar. */
function addToCalendar(event: BotolanEvent, date: Date) {
  const stamp = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
      d.getDate()
    ).padStart(2, '0')}`;
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Better Botolan//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@better-botolan`,
    `DTSTART;VALUE=DATE:${stamp(date)}`,
    `DTEND;VALUE=DATE:${stamp(end)}`,
    `SUMMARY:${event.title}`,
    event.location ? `LOCATION:${event.location}` : '',
    event.description ? `DESCRIPTION:${event.description}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  try {
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    /* download unavailable — ignore */
  }
}

export default function Events() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState(dayKey(today));
  const [monthDir, setMonthDir] = useState(1);
  const [view, setView] = useState<'month' | 'agenda'>('month');
  const [activeCats, setActiveCats] = useState<Set<EventCategory>>(
    () => new Set(ALL_CATEGORIES)
  );
  const [modal, setModal] = useState<EventEntry | null>(null);

  const catOn = (c: EventCategory) => activeCats.has(c);

  const toggleCat = (c: EventCategory) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  // Events of the viewed year, grouped by day key (respecting filters).
  const eventsByDay = useMemo(() => {
    const map = new Map<string, BotolanEvent[]>();
    for (const { event, date } of eventsForYear(viewYear)) {
      if (!activeCats.has(event.category)) continue;
      const key = dayKey(date);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [viewYear, activeCats]);

  // Upcoming across this year and next (respecting filters).
  const upcomingAll = useMemo(() => {
    return [
      ...eventsForYear(today.getFullYear()),
      ...eventsForYear(today.getFullYear() + 1),
    ].filter(
      e =>
        e.date.getTime() >= today.getTime() && activeCats.has(e.event.category)
    );
  }, [today, activeCats]);

  const upcoming = upcomingAll.slice(0, 6);

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goMonth = (delta: number) => {
    setMonthDir(delta);
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const openDay = (date: Date, events: BotolanEvent[]) => {
    setSelectedKey(dayKey(date));
    if (events.length > 0) setModal({ event: events[0], date });
  };

  const selectedEvents = eventsByDay.get(selectedKey) ?? [];
  const selectedDate = (() => {
    const [y, m, d] = selectedKey.split('-').map(Number);
    return new Date(y, m - 1, d);
  })();
  const todayKey = dayKey(today);

  return (
    <>
      <SEO
        title="Events Calendar"
        description={`Holidays, fiestas, and LGU activities in ${siteConfig.name}, Zambales.`}
        keywords={`${siteConfig.shortName} events, holidays, fiesta, calendar, Zambales`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs
          className="mb-8"
          items={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
        />

        <SectionHeading
          kicker="Calendar"
          title="Events & Holidays"
          description="National holidays, town fiestas, and local government activities for Botolan."
        />

        {/* Toolbar: category filters + view toggle */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map(cat => {
              const on = catOn(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCat(cat)}
                  aria-pressed={on}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    on
                      ? 'border-gray-200 bg-white text-gray-700 shadow-sm'
                      : 'border-transparent bg-gray-100 text-gray-400'
                  )}
                >
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-opacity',
                      CATEGORY_STYLES[cat].dot,
                      !on && 'opacity-40'
                    )}
                  />
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setView('month')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                view === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              Month
            </button>
            <button
              type="button"
              onClick={() => setView('agenda')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                view === 'agenda'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <List className="h-4 w-4" aria-hidden="true" />
              Agenda
            </button>
          </div>
        </div>

        {view === 'month' ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Calendar */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-gray-900">
                  {MONTHS[viewMonth]} {viewYear}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goMonth(-1)}
                    aria-label="Previous month"
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMonthDir(
                        today.getFullYear() * 12 + today.getMonth() >=
                          viewYear * 12 + viewMonth
                          ? 1
                          : -1
                      );
                      setViewYear(today.getFullYear());
                      setViewMonth(today.getMonth());
                      setSelectedKey(todayKey);
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => goMonth(1)}
                    aria-label="Next month"
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                {WEEKDAYS.map(w => (
                  <div key={w} className="py-1">
                    {w}
                  </div>
                ))}
              </div>

              {/* Animated day grid (re-keyed per month) with page-flip */}
              <div
                key={`${viewYear}-${viewMonth}`}
                data-dir={monthDir}
                className="bb-cal-grid grid grid-cols-7 gap-1 [perspective:1400px]"
              >
                {cells.map((day, i) => {
                  if (day === null) return <div key={`blank-${i}`} />;
                  const date = new Date(viewYear, viewMonth, day);
                  const key = dayKey(date);
                  const dayEvents = eventsByDay.get(key) ?? [];
                  const isToday = key === todayKey;
                  const isSelected = key === selectedKey;
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const hasEvents = dayEvents.length > 0;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => openDay(date, dayEvents)}
                      className={cn(
                        'relative flex aspect-square flex-col items-center justify-start rounded-lg p-1.5 text-sm transition-all duration-150',
                        isSelected
                          ? 'bg-primary-600 text-white shadow-md'
                          : isToday
                            ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200'
                            : hasEvents
                              ? 'hover:scale-[1.04] hover:bg-primary-50'
                              : isWeekend
                                ? 'text-gray-400 hover:bg-gray-50'
                                : 'text-gray-700 hover:bg-gray-50'
                      )}
                      aria-label={`${longDate.format(date)}${
                        hasEvents ? `, ${dayEvents.length} event(s)` : ''
                      }`}
                    >
                      <span
                        className={cn(isToday && !isSelected && 'font-bold')}
                      >
                        {day}
                      </span>
                      {hasEvents && (
                        <span className="mt-auto flex flex-wrap items-center justify-center gap-0.5 pb-0.5">
                          {dayEvents.slice(0, 3).map((ev, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                'bb-dot h-1.5 w-1.5 rounded-full',
                                isSelected
                                  ? 'bg-white'
                                  : CATEGORY_STYLES[ev.category].dot
                              )}
                              style={{ animationDelay: `${idx * 60}ms` }}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side: selected day + upcoming */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                  {selectedKey === todayKey ? 'Today' : 'Selected day'}
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {longDate.format(selectedDate)}
                </p>
                {selectedEvents.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-400">
                    No events on this day.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {selectedEvents.map(ev => (
                      <li key={ev.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setModal({ event: ev, date: selectedDate })
                          }
                          className="w-full rounded-lg border border-gray-100 bg-gray-50/60 p-3 text-left transition-colors hover:border-primary-200 hover:bg-primary-50/50"
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            {ev.title}
                          </p>
                          <EventTags ev={ev} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary-600" />
                  <h3 className="font-bold text-gray-900">Upcoming</h3>
                </div>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No upcoming events for the selected filters.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {upcoming.map((entry, i) => (
                      <li
                        key={entry.event.id}
                        className="bb-reveal"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <UpcomingRow
                          entry={entry}
                          onOpen={() => setModal(entry)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Agenda view */
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-gray-900">
              Upcoming events
            </h2>
            {upcomingAll.length === 0 ? (
              <p className="text-sm text-gray-400">
                No upcoming events for the selected filters.
              </p>
            ) : (
              <ul className="space-y-1">
                {upcomingAll.map((entry, i) => (
                  <li
                    key={entry.event.id}
                    className="bb-reveal"
                    style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                  >
                    <UpcomingRow
                      entry={entry}
                      onOpen={() => setModal(entry)}
                      big
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Contribute note */}
        {/*<p className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
          Showing national holidays. Botolan town fiestas, barangay fiestas, and
          LGU activities can be added in{' '}
          <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-700">
            src/data/events.ts
          </code>
          .
        </p>*/}
      </Section>

      <EventModal entry={modal} onClose={() => setModal(null)} />

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          /* Book page-turn when changing months */
          .bb-cal-grid[data-dir="1"] {
            transform-origin: left center;
            animation: bb-flip-next 0.5s cubic-bezier(.3,.7,.3,1) both;
          }
          .bb-cal-grid[data-dir="-1"] {
            transform-origin: right center;
            animation: bb-flip-prev 0.5s cubic-bezier(.3,.7,.3,1) both;
          }
          @keyframes bb-flip-next {
            from { transform: rotateY(-78deg); opacity: 0; }
            60% { opacity: 1; }
            to { transform: rotateY(0deg); opacity: 1; }
          }
          @keyframes bb-flip-prev {
            from { transform: rotateY(78deg); opacity: 0; }
            60% { opacity: 1; }
            to { transform: rotateY(0deg); opacity: 1; }
          }
          .bb-dot { animation: bb-pop 0.3s ease-out both; }
          @keyframes bb-pop { from { transform: scale(0); } to { transform: scale(1); } }
          .bb-reveal { animation: bb-reveal-in 0.4s ease-out both; }
          @keyframes bb-reveal-in {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </>
  );
}

function EventTags({ ev }: { ev: BotolanEvent }) {
  const style = CATEGORY_STYLES[ev.category];
  return (
    <span className="mt-1 flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-[10px] font-medium',
          style.badge
        )}
      >
        {CATEGORY_LABELS[ev.category]}
      </span>
      {ev.confirmed === false && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
          To be confirmed
        </span>
      )}
    </span>
  );
}

function UpcomingRow({
  entry,
  onOpen,
  big,
}: {
  entry: EventEntry;
  onOpen: () => void;
  big?: boolean;
}) {
  const { event, date } = entry;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-primary-50/50"
    >
      <span
        className={cn(
          'flex shrink-0 flex-col items-center rounded-lg bg-primary-50 py-1 text-primary-700',
          big ? 'w-14' : 'w-11'
        )}
      >
        <span className="text-[10px] font-semibold uppercase">
          {MONTHS[date.getMonth()].slice(0, 3)}
        </span>
        <span
          className={cn('font-bold leading-none', big ? 'text-2xl' : 'text-lg')}
        >
          {date.getDate()}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-900">
          {event.title}
        </span>
        <EventTags ev={event} />
      </span>
    </button>
  );
}

function EventModal({
  entry,
  onClose,
}: {
  entry: EventEntry | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!entry) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [entry, onClose]);

  if (!entry) return null;
  const { event, date } = entry;

  return (
    <div
      className="bb-ev-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
      />
      <div className="bb-ev-panel relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div
          className={cn(
            'relative bg-gradient-to-br p-6 text-white',
            CATEGORY_GRADIENT[event.category]
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 backdrop-blur transition-colors hover:bg-white/30"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            {CATEGORY_LABELS[event.category]}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {longDate.format(date)}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight">
            {event.title}
          </h2>
        </div>

        <div className="p-6">
          {event.location && (
            <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-600">
              <MapPin className="h-4 w-4 text-primary-600" aria-hidden="true" />
              {event.location}
            </p>
          )}
          {event.description ? (
            <p className="leading-relaxed text-gray-700">{event.description}</p>
          ) : (
            <p className="text-sm text-gray-400">
              A {CATEGORY_LABELS[event.category].toLowerCase()} in Botolan.
            </p>
          )}
          {event.confirmed === false && (
            <p className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
              Date to be confirmed
            </p>
          )}

          <button
            type="button"
            onClick={() => addToCalendar(event, date)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Add to my calendar
            <Download className="h-4 w-4 opacity-80" aria-hidden="true" />
          </button>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-ev-overlay { animation: bb-ev-fade 0.15s ease-out; }
          .bb-ev-panel { animation: bb-ev-pop 0.22s cubic-bezier(.2,.8,.2,1); }
          @keyframes bb-ev-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes bb-ev-pop {
            from { opacity: 0; transform: translateY(14px) scale(0.97); }
            to { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </div>
  );
}
