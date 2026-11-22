import { useState } from 'react';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { initials, leaders, type Leader } from '../../data/leaders';

function LeaderPhoto({ leader }: { leader: Leader }) {
  const [failed, setFailed] = useState(false);
  const showImage = leader.photo && !failed;

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-700 to-primary-900">
      {showImage ? (
        <img
          src={`/leaders/${leader.photo}`}
          alt={`${leader.name}, ${leader.position}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span
            aria-hidden="true"
            className="font-display text-6xl font-semibold text-white/90"
          >
            {initials(leader.name)}
          </span>
          <span className="sr-only">{leader.name} — photo to be added</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <span className="inline-block rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary-700">
          {leader.position}
        </span>
      </div>
    </div>
  );
}

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[var(--bb-shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--bb-shadow-lift)]"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(18px)',
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
      }}
    >
      <LeaderPhoto leader={leader} />
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold leading-tight text-gray-900">
          {leader.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-primary-700">
          {leader.scope}
        </p>
        {leader.party && (
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {leader.party}
          </p>
        )}
        {leader.note && (
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {leader.note}
          </p>
        )}
        {leader.sourceUrl && (
          <a
            href={leader.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 underline hover:text-primary-700"
          >
            Source
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function LeadersGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {leaders.map((leader, i) => (
        <LeaderCard key={leader.name} leader={leader} index={i} />
      ))}
    </div>
  );
}
