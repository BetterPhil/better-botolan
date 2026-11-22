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

export default function ServicesSection({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { t } = useTranslation();

  const getIcon = (category: string) => {
    const IconComponent = LucideIcons[
      category as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayedCategories.map(category => (
          <Link
            key={category.slug}
            to={`/services/${category.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--bb-shadow-card)] transition duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[var(--bb-shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors duration-200 group-hover:bg-primary-600 group-hover:text-white">
              {getIcon(category.icon)}
            </div>

            <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-700">
              {category.category}
            </h3>

            <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
              {category.description}
            </p>

            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary-600">
              Explore
              <LucideIcons.ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
