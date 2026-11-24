import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../../config/site';
import { isSearchEnabled } from '../../lib/clientSearch';
import { useSearchModal } from '../../context/SearchModalContext';
import { serviceCategories } from '../../data/yamlLoader';

// TODO (Part 4/5): add "Explore Projects" and "View Statistics" once built.
const quickActions = [
  { label: 'Find a Service', href: '/services' },
  { label: 'Government Offices', href: '/government/departments' },
  { label: `About ${siteConfig.shortName}`, href: '/about' },
];

export default function Hero() {
  const { t } = useTranslation();
  const { openSearch } = useSearchModal();
  const [query, setQuery] = useState('');

  const topics = serviceCategories.categories.slice(0, 6);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openSearch(query.trim());
  };

  return (
    <section className="relative overflow-hidden bg-primary-900 text-white">
      {/* Mount Pinatubo backdrop (public/images/pinatubo-hero.svg) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(1, 92, 16, 0.7), rgba(2, 86, 60, 0.5) 45%, rgba(30, 75, 70, 0.8)), url(/images/pinatubo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-20 container mx-auto px-4 py-16 md:py-24 text-center">
        <p className="mb-6 font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-primary-100">
          {siteConfig.name}, {siteConfig.province}
        </p>

        <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          Public Information for {siteConfig.shortName}, Malighay Panlumateng.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-primary-100">
          {t('hero.subtitle')}
        </p>

        {isSearchEnabled ? (
          <form
            onSubmit={handleSearch}
            role="search"
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-2 rounded-lg bg-white p-2 shadow-xl sm:flex-row"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search services, offices and public records
            </label>
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search services, offices, barangays, or public records…"
                className="w-full bg-transparent py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Search
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        ) : (
          // Search needs Meilisearch (VITE_MEILISEARCH_HOST). Until it is set
          // up (Part 8), show browse-by-topic chips instead.
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-wider text-primary-200">
              Browse by topic
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {topics.map(topic => (
                <li key={topic.slug}>
                  <Link
                    to={`/services/${topic.slug}`}
                    className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
                  >
                    {topic.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {quickActions.map(action => (
            <Link
              key={action.href}
              to={action.href}
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/15"
            >
              {action.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
