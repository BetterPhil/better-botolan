import { ExternalLink, Landmark, MapPin, Mountain, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { highlights } from '../../data/facts';
import { siteConfig } from '../../config/site';

const icons: Record<string, LucideIcon> = {
  pinatubo: Mountain,
  turtles: Waves,
  location: MapPin,
  history: Landmark,
};

export default function DiscoverBotolan() {
  return (
    <section aria-labelledby="discover-heading" className="bg-gray-50 py-14">
      <div className="container mx-auto px-4">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary-700">
          Discover
        </p>
        <h2
          id="discover-heading"
          className="mb-8 text-2xl font-bold text-gray-900 md:text-4xl"
        >
          Know {siteConfig.shortName}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(item => {
            const Icon = icons[item.id] ?? MapPin;
            return (
              <article
                key={item.id}
                className="flex flex-col rounded-xl border border-gray-200 border-t-4 border-t-primary-600 bg-white p-6 shadow-sm"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-gray-700">
                  {item.body}
                </p>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-gray-500 underline hover:text-primary-700"
                >
                  {item.source}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
