import {
  Church,
  Flag,
  Landmark,
  Mountain,
  Sprout,
  Users,
  Waves,
  type LucideIcon,
} from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { historyEvents, type HistoryEvent } from '../../data/history';

const icons: Record<HistoryEvent['icon'], LucideIcon> = {
  mountain: Mountain,
  church: Church,
  flag: Flag,
  landmark: Landmark,
  sprout: Sprout,
  waves: Waves,
  users: Users,
};

function TimelineItem({
  event,
  index,
}: {
  event: HistoryEvent;
  index: number;
}) {
  const { ref, shown } = useReveal<HTMLLIElement>();
  const Icon = icons[event.icon];

  return (
    <li
      ref={ref}
      className="relative pl-16 pb-10 last:pb-0"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(18px)',
        transition: `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`,
      }}
    >
      <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-[var(--bb-shadow-card)]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)]">
        <span className="bb-kicker">{event.year}</span>
        <h3 className="mt-3 font-display text-xl font-semibold text-gray-900">
          {event.title}
        </h3>
        <p className="mt-2 leading-relaxed text-gray-700">{event.body}</p>
      </div>
    </li>
  );
}

export default function HistoryTimeline() {
  return (
    <ol className="relative">
      <span
        aria-hidden="true"
        className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary-200 via-primary-200 to-transparent"
      />
      {historyEvents.map((event, i) => (
        <TimelineItem key={event.year} event={event} index={i} />
      ))}
    </ol>
  );
}
