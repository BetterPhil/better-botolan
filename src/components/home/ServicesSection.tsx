import Section from '../ui/Section';
import * as LucideIcons from 'lucide-react';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router';

import { serviceCategories } from '../../data/yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
  description: string;
  icon: string;
}

/** A distinct accent hue per category — subtle variety, one brand family. */
const ACCENTS: Record<string, string> = {
  'health-services': '#e11d48',
  education: '#d97706',
  business: '#2563eb',
  'social-welfare': '#7c3aed',
  'agriculture-fisheries': '#16a34a',
  'infrastructure-public-works': '#ea580c',
  'garbage-waste-disposal': '#0d9488',
  environment: '#059669',
  'disaster-preparedness': '#dc2626',
  'housing-land-use': '#4f46e5',
  'real-property': '#0284c7',
};
const FALLBACK_ACCENT = '#2563eb';

export default function ServicesSection({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { t } = useTranslation();

  const getIcon = (name: string, className: string) => {
    const IconComponent = LucideIcons[
      name as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  const displayedCategories = serviceCategories.categories as Category[];

  return (
    <Section>
      <span className="bb-kicker">Services</span>
      <Heading level={2} className="mt-3">
        {title || t('services.title')}
      </Heading>
      <Text className="text-gray-600 mb-8 max-w-2xl">
        {description || t('services.description')}
      </Text>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedCategories.map(category => {
          const accent = ACCENTS[category.slug] ?? FALLBACK_ACCENT;
          return (
            <Link
              key={category.slug}
              to={`/services/${category.slug}`}
              style={{ ['--accent']: accent } as React.CSSProperties}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[var(--bb-shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* animated top accent bar */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              {/* corner glow */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `${accent}3a` }}
              />
              {/* watermark icon */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-5 -right-4 opacity-[0.06] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.13]"
                style={{ color: accent }}
              >
                {getIcon(category.icon, 'h-28 w-28')}
              </span>

              {/* gradient icon tile */}
              <div
                className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transform-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accent}, ${accent}b0)`,
                }}
              >
                {getIcon(category.icon, 'h-6 w-6')}
              </div>

              <h3 className="relative mb-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[var(--accent)]">
                {category.category}
              </h3>

              <p className="relative text-sm leading-relaxed text-gray-600 line-clamp-3">
                {category.description}
              </p>

              <span className="relative mt-auto pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-full px-0 py-1.5 text-sm font-semibold text-[var(--accent)] transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:px-4 group-hover:text-white">
                  Explore
                  <LucideIcons.ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
