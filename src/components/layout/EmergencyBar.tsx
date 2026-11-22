import { ArrowRight, TriangleAlert } from 'lucide-react';
import { emergencyHotlines } from '../../data/hotlines';
import { Link } from 'react-router';

export default function EmergencyBar() {
  const hotlines = emergencyHotlines.filter(h => h.number.trim() !== '');

  return (
    <div className="bg-primary-700 text-white text-sm">
      <div className="container mx-auto px-4 flex items-center gap-6 h-11">
        <span className="flex items-center gap-2 font-semibold shrink-0">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          Emergency
        </span>

        <ul className="flex items-center gap-5 overflow-x-auto whitespace-nowrap flex-1">
          {hotlines.map(({ label, number, icon: Icon }) => (
            <li key={label} className="shrink-0">
              <a
                href={`tel:${number.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 hover:underline"
              >
                <Icon className="h-4 w-4 opacity-80" aria-hidden="true" />
                <span className="font-medium">{label}</span>
                <span className="font-mono tracking-wide">{number}</span>
              </a>
            </li>
          ))}
        </ul>

        <Link
          to="/hotlines"
          className="hidden md:flex items-center gap-1 font-semibold shrink-0 hover:underline"
        >
          View all hotlines
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
