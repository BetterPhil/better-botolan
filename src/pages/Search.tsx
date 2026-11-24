import { useMemo } from 'react';
import { Link } from 'react-router';
import { useQueryState } from 'nuqs';
import { Search as SearchIcon } from 'lucide-react';
import {
  searchContent,
  searchIndexSize,
  type ClientSearchHit,
} from '../lib/clientSearch';

const badgeClass: Record<ClientSearchHit['kind'], string> = {
  service: 'bg-blue-100 text-blue-700',
  government: 'bg-green-100 text-green-700',
  barangay: 'bg-amber-100 text-amber-700',
  page: 'bg-gray-100 text-gray-600',
};

export default function Search() {
  const [query, setQuery] = useQueryState('q', { defaultValue: '' });

  const results = useMemo(() => searchContent(query), [query]);
  const trimmed = query.trim();

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>

      <div className="relative mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value || null)}
          placeholder="Search services, barangays, offices, guides..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          autoFocus
        />
      </div>

      {!trimmed && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Start typing to search across {searchIndexSize} services, barangays,
          and pages.
        </div>
      )}

      {trimmed && results.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No results for{' '}
          <span className="font-medium">&ldquo;{trimmed}&rdquo;</span>
        </div>
      )}

      {trimmed && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;
            {trimmed}&rdquo;
          </p>
          {results.map(hit => (
            <Link key={hit.id} to={hit.url} className="block group">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass[hit.kind]}`}
                  >
                    {hit.category}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-primary-700">
                  {hit.title}
                </h2>
                {hit.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {hit.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
