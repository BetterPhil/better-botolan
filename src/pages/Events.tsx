import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, MapPin } from 'lucide-react';
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

export default function Events() {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedKey, setSelectedKey] = useState(dayKey(today));

  // Events of the viewed year, grouped by day key.
  const eventsByDay = useMemo(() => {
    const map = new Map<string, BotolanEvent[]>();
    for (const { event, date } of eventsForYear(viewYear)) {
      const key = dayKey(date);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [viewYear]);

  // Upcoming: from today across this year and next, first 6.
  const upcoming = useMemo(() => {
    const all = [
      ...eventsForYear(today.getFullYear()),
      ...eventsForYear(today.getFullYear() + 1),
    ];
    return all.filter(e => e.date.getTime() >= today.getTime()).slice(0, 6);
  }, [today]);

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Calendar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            {/* Month nav */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {MONTHS[viewMonth]} {viewYear}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => goMonth(-1)}
                  aria-label="Previous month"
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewYear(today.getFullYear());
                    setViewMonth(today.getMonth());
                    setSelectedKey(todayKey);
                  }}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-50"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => goMonth(1)}
                  aria-label="Next month"
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-primary-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Weekday header */}
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
              {WEEKDAYS.map(w => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`blank-${i}`} />;
                const date = new Date(viewYear, viewMonth, day);
                const key = dayKey(date);
                const dayEvents = eventsByDay.get(key) ?? [];
                const isToday = key === todayKey;
                const isSelected = key === selectedKey;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedKey(key)}
                    className={cn(
                      'relative flex aspect-square flex-col items-center justify-start rounded-lg p-1.5 text-sm transition-colors',
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : isToday
                          ? 'bg-primary-50 text-primary-700'
                          : dayEvents.length
                            ? 'hover:bg-gray-100'
                            : isWeekend
                              ? 'text-gray-400 hover:bg-gray-50'
                              : 'text-gray-700 hover:bg-gray-50'
                    )}
                    aria-label={`${longDate.format(date)}${
                      dayEvents.length ? `, ${dayEvents.length} event(s)` : ''
                    }`}
                  >
                    <span className={cn(isToday && !isSelected && 'font-bold')}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="mt-auto flex flex-wrap items-center justify-center gap-0.5 pb-0.5">
                        {dayEvents.slice(0, 3).map((ev, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              isSelected
                                ? 'bg-white'
                                : CATEGORY_STYLES[ev.category].dot
                            )}
                          />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
              {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map(cat => (
                <span
                  key={cat}
                  className="flex items-center gap-1.5 text-xs text-gray-500"
                >
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      CATEGORY_STYLES[cat].dot
                    )}
                  />
                  {CATEGORY_LABELS[cat]}
                </span>
              ))}
            </div>
          </div>

          {/* Side: selected day + upcoming */}
          <div className="space-y-6">
            {/* Selected day */}
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
                    <EventRow key={ev.id} ev={ev} />
                  ))}
                </ul>
              )}
            </div>

            {/* Upcoming */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary-600" />
                <h3 className="font-bold text-gray-900">Upcoming</h3>
              </div>
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No upcoming events listed.
                </p>
              ) : (
                <ul className="space-y-3">
                  {upcoming.map(({ event, date }) => (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setViewYear(date.getFullYear());
                          setViewMonth(date.getMonth());
                          setSelectedKey(dayKey(date));
                        }}
                        className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-gray-50"
                      >
                        <span className="flex w-11 shrink-0 flex-col items-center rounded-lg bg-primary-50 py-1 text-primary-700">
                          <span className="text-[10px] font-semibold uppercase">
                            {MONTHS[date.getMonth()].slice(0, 3)}
                          </span>
                          <span className="text-lg font-bold leading-none">
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
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Contribute note */}
        <p className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
          Showing national holidays. Botolan town fiestas, barangay fiestas, and
          LGU activities can be added in{' '}
          <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-700">
            src/data/events.ts
          </code>
          . Eid&rsquo;l Fitr and Eid&rsquo;l Adha are proclaimed yearly and
          should be added once their dates are set.
        </p>
      </Section>
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

function EventRow({ ev }: { ev: BotolanEvent }) {
  return (
    <li className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
      <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
      <EventTags ev={ev} />
      {ev.location && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {ev.location}
        </p>
      )}
      {ev.description && (
        <p className="mt-1 text-xs text-gray-600">{ev.description}</p>
      )}
    </li>
  );
}
