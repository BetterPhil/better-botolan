import { ArrowRight, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router';
import { emergencyHotlines, type Hotline } from '../../data/hotlines';

function HotlineItem({
  hotline,
  duplicate = false,
}: {
  hotline: Hotline;
  duplicate?: boolean;
}) {
  const { label, number, icon: Icon } = hotline;
  return (
    <li className="shrink-0" aria-hidden={duplicate || undefined}>
      <a
        href={`tel:${number.replace(/[^\d+]/g, '')}`}
        tabIndex={duplicate ? -1 : undefined}
        className="flex items-center gap-2 hover:underline"
      >
        <Icon className="h-4 w-4 opacity-80" aria-hidden="true" />
        <span className="font-medium">{label}</span>
        <span className="font-mono tracking-wide">{number}</span>
      </a>
    </li>
  );
}

export default function EmergencyBar() {
  const hotlines = emergencyHotlines.filter(h => h.number.trim() !== '');

  return (
    <div className="bg-primary-700 text-white text-sm">
      <div className="container mx-auto px-4 flex items-center gap-4 h-11">
        <span className="flex items-center gap-2 font-semibold shrink-0">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          Emergency
        </span>

        {/* Scrolling ticker. The list is rendered twice so the loop is seamless;
            the second copy is hidden from screen readers. */}
        <div className="bb-ticker relative min-w-0 flex-1 overflow-hidden">
          <ul className="bb-ticker-track flex items-center gap-8 whitespace-nowrap">
            {hotlines.map(h => (
              <HotlineItem key={h.label} hotline={h} />
            ))}
            {hotlines.map(h => (
              <HotlineItem key={`dup-${h.label}`} hotline={h} duplicate />
            ))}
          </ul>
          {/* soft fade at both edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-primary-700 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-primary-700 to-transparent" />
        </div>

        <Link
          to="/hotlines"
          className="hidden md:flex items-center gap-1 font-semibold shrink-0 hover:underline"
        >
          View all hotlines
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <style>{`
        .bb-ticker-track {
          width: max-content;
          animation: bb-ticker 32s linear infinite;
        }
        .bb-ticker:hover .bb-ticker-track {
          animation-play-state: paused;
        }
        @keyframes bb-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bb-ticker-track { animation: none; }
          .bb-ticker { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}
