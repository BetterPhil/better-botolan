import Section from '../components/ui/Section';
import { useParams, Link } from 'react-router';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import {
  serviceCategories,
  getCategorySubcategories,
  type Subcategory,
  type CategoryIndex,
} from '../data/yamlLoader';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ServicesSection from '../components/home/ServicesSection';
import SEO from '../components/SEO';
import { Banner } from '@bettergov/kapwa/banner';
import { useState, useEffect } from 'react';

const Services: React.FC = () => {
  const { category } = useParams();
  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    layout: 'list',
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadedCategory, setLoadedCategory] = useState<string | undefined>();
  const subcategories: Subcategory[] = categoryIndex.pages;

  const getCategory = () => {
    return serviceCategories.categories.find(c => c.slug === category);
  };

  const categoryData = getCategory();
  const categorySlug = category && categoryData ? category : undefined;
  const Icon = LucideIcons[
    categoryData?.icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ className?: string }>;

  if (categorySlug !== loadedCategory) {
    setLoadedCategory(categorySlug);
    setLoading(Boolean(categorySlug));
    setCategoryIndex({ layout: 'list', pages: [] });
  }

  useEffect(() => {
    if (!categorySlug) return;

    let cancelled = false;
    getCategorySubcategories(categorySlug)
      .then(index => {
        if (!cancelled) setCategoryIndex(index);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  if (!category) {
    return (
      <>
        <SEO
          title="Services"
          description={`All services provided by the ${import.meta.env.VITE_GOVERNMENT_NAME} government. Find what you need for citizenship, business, education, and more.`}
          keywords="government services, public services, local government, civic services"
        />
        <ServicesSection
          title={`All local government services`}
          description={`All services provided by the ${import.meta.env.VITE_GOVERNMENT_NAME} government. Find what you need for citizenship, business, education, and more.`}
        />
      </>
    );
  }
  if (!categoryData) {
    return (
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title="Category not found"
          description="The category you are looking for does not exist."
          icon
        />
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={categoryData.category || category}
        description={categoryData.description}
        keywords={`${categoryData.category}, government services, public services, local government`}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />

        {/* Category header */}
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-gradient-to-br from-primary-50 to-white p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-[var(--bb-shadow-card)]">
            {Icon && <Icon className="h-8 w-8" />}
          </span>
          <div>
            <span className="bb-kicker">Services</span>
            <Heading level={1} className="mt-2 mb-1">
              {categoryData.category || category}
            </Heading>
            <Text className="text-gray-600">{categoryData.description}</Text>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <>
            {categoryIndex.title && (
              <Heading level={3}>{categoryIndex.title}</Heading>
            )}
            {categoryIndex.description && (
              <Text className="text-gray-600 mb-4">
                {categoryIndex.description}
              </Text>
            )}

            {subcategories.length > 0 && (
              <p className="mb-4 text-sm font-medium text-gray-500">
                {subcategories.length}{' '}
                {subcategories.length === 1 ? 'guide' : 'guides'} in this
                category
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {subcategories.map((subcategory, index) => (
                <Link
                  key={subcategory.slug}
                  to={`/services/${category}/${subcategory.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-[var(--bb-shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[var(--bb-shadow-lift)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-semibold text-primary-700 transition-colors duration-200 group-hover:bg-primary-600 group-hover:text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary-700">
                      {subcategory.name}
                    </h3>
                    {subcategory.description && (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600 line-clamp-2">
                        {subcategory.description}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                      Read guide
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Section>
    </>
  );
};

export default Services;
