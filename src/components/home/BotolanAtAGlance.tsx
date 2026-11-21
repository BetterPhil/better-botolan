import {
  ExternalLink,
  Landmark,
  Layers,
  Ruler,
  Users,
  Map as MapIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { quickFacts } from '../../data/facts';
import { siteConfig } from '../../config/site';

const icons: Record<string, LucideIcon> = {
  population: Users,
  barangays: MapIcon,
  area: Ruler,
  density: Layers,
  'income-class': Landmark,
};

export default function BotolanAtAGlance() {
  // Unique sources, so the footnote lists each one once.
  const sources = Array.from(
    new Map(quickFacts.map(f => [f.sourceUrl, f.source])).entries()
  );

  return (
    <section
      aria-labelledby="glance-heading"
      className="relative z-10 -mt-10 pb-4"
    >
      <div className="container mx-auto px-4">
        <div className="rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5 md:p-8">
          <h2
            id="glance-heading"
            className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary-700"
          >
            {siteConfig.shortName} at a glance
          </h2>

          <dl className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {quickFacts.map(fact => {
              const Icon = icons[fact.id] ?? Layers;
              return (
                <div key={fact.id} title={fact.detail}>
                  <dt className="flex items-center gap-2 text-sm text-gray-600">
                    <Icon
                      className="h-4 w-4 text-primary-600"
                      aria-hidden="true"
                    />
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                    {fact.value}
                  </dd>
                </div>
              );
            })}
          </dl>

          <p className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-500">
            Sources:{' '}
            {sources.map(([url, name], index) => (
              <span key={url}>
                {index > 0 && ' · '}
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 underline hover:text-primary-700"
                >
                  {name}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </span>
            ))}
            . Figures are the latest verified; see the linked sources for
            details.
          </p>
        </div>
      </div>
    </section>
  );
}
