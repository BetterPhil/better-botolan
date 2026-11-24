import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import SearchModal from '../components/search/SearchModal';

interface SearchModalContextValue {
  /** Open the search modal, optionally pre-filled with a query. */
  openSearch: (query?: string) => void;
  closeSearch: () => void;
}

const SearchModalContext = createContext<SearchModalContextValue | null>(null);

export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');
  // Bumped on each open so the modal remounts with a fresh initial query.
  const [instance, setInstance] = useState(0);

  const openSearch = useCallback((query = '') => {
    setInitialQuery(query);
    setInstance(n => n + 1);
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openSearch, closeSearch }),
    [openSearch, closeSearch]
  );

  return (
    <SearchModalContext.Provider value={value}>
      {children}
      <SearchModal
        key={instance}
        open={open}
        onClose={closeSearch}
        initialQuery={initialQuery}
      />
    </SearchModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSearchModal(): SearchModalContextValue {
  const ctx = useContext(SearchModalContext);
  if (!ctx) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return ctx;
}
