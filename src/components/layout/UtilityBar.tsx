import { useEffect, useState } from 'react';
import { CalendarDays, ExternalLink, MapPin } from 'lucide-react';
import { siteConfig } from '../../config/site';

const formatter = new Intl.DateTimeFormat('en-PH', {
  timeZone: 'Asia/Manila',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function UtilityBar() {
  const now = useNow();

  return (
    <div className="bg-white border-b border-gray-200 text-sm text-gray-700">
      <div className="container mx-auto px-4 flex items-center justify-between h-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary-600" aria-hidden="true" />
            {siteConfig.shortName}, {siteConfig.province}
          </span>
          <a
            href={siteConfig.betterGovUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700"
          >
            BetterGov Philippines
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>

        <span className="hidden sm:flex items-center gap-2">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {formatter.format(now)} PHT
        </span>
      </div>
    </div>
  );
}
