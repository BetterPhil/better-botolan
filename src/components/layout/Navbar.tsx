import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronDown, Search } from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import { isMeilisearchEnabled } from '../../lib/meilisearch';
import { siteConfig } from '../../config/site';
import { cn } from '../../lib/utils';
import type { NavigationItem } from '../../types';
import EmergencyBar from './EmergencyBar';
import UtilityBar from './UtilityBar';

// Services / Government come from mainNavigation. The transparency-related
// pages are grouped into one dropdown so the bar doesn't overflow.
const navItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  ...mainNavigation,
  { label: 'Barangays', href: '/barangays' },
  { label: 'Schools', href: '/schools' },
  { label: 'Tourism', href: '/tourism' },
  {
    label: 'Transparency',
    href: '/transparency',
    children: [
      { label: 'Budget Projects', href: '/projects' },
      { label: 'Transparency Portal', href: '/transparency' },
      { label: 'Full Disclosure', href: '/full-disclosure' },
      { label: "Citizen's Charter", href: '/citizens-charter' },
      { label: 'Statistics', href: '/statistics' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function topSegment(href: string) {
  return href.split('/')[1] ?? '';
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { pathname } = useLocation();

  const isActive = (item: NavigationItem) =>
    item.href === '/'
      ? pathname === '/'
      : topSegment(pathname) === topSegment(item.href);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <>
      <EmergencyBar />
      <UtilityBar />

      <nav
        className="bg-white shadow-sm sticky top-0 z-50"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={closeMenu}
            >
              <img
                src="/botolan.png"
                alt=""
                className="h-12 w-12"
                width={48}
                height={48}
              />
              <span className="leading-tight">
                <span className="block text-xs font-medium text-primary-600">
                  Better
                </span>
                <span className="block text-xl font-bold text-gray-900">
                  {siteConfig.shortName}
                </span>
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <div key={item.label} className="relative group">
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-1 rounded-lg px-4 py-2 font-medium transition-colors',
                      isActive(item)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {item.children && (
                    <div className="absolute left-0 top-full pt-2 w-64 invisible translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isMeilisearchEnabled && (
                <Link
                  to="/search"
                  aria-label="Search"
                  className="ml-2 rounded-lg p-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </Link>
              )}
            </div>

            {/* Mobile menu button — animated burger that morphs to an X */}
            <button
              type="button"
              onClick={() => setIsOpen(open => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <span className="sr-only">Toggle main menu</span>
              <span className="relative block h-6 w-6" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-1 h-0.5 w-4 rounded-full bg-current transition-all duration-300',
                    isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[7px]'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-1 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition-all duration-300',
                    isOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'absolute left-1 h-0.5 w-4 rounded-full bg-current transition-all duration-300',
                    isOpen
                      ? 'top-1/2 -translate-y-1/2 -rotate-45'
                      : 'top-[15px]'
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu — smooth height reveal + staggered item fade-in */}
        <div
          id="mobile-menu"
          className={cn(
            'lg:hidden grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="min-h-0 overflow-hidden border-t border-gray-200">
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navItems.map((item, index) => (
                <div
                  key={item.label}
                  className={isOpen ? 'bb-nav-item' : undefined}
                  style={
                    isOpen ? { animationDelay: `${index * 45}ms` } : undefined
                  }
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSubmenu(
                            openSubmenu === item.label ? null : item.label
                          )
                        }
                        aria-expanded={openSubmenu === item.label}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 transition-transform duration-200',
                            openSubmenu === item.label && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        className={cn(
                          'grid transition-[grid-template-rows] duration-200 ease-out',
                          openSubmenu === item.label
                            ? 'grid-rows-[1fr]'
                            : 'grid-rows-[0fr]'
                        )}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="ml-4 space-y-1 border-l border-gray-200 pl-3 py-1">
                            {item.children.map(child => (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={closeMenu}
                                className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={closeMenu}
                      className={cn(
                        'block rounded-lg px-3 py-2 font-medium',
                        isActive(item)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {isMeilisearchEnabled && (
                <Link
                  to="/search"
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Search
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .bb-nav-item {
            opacity: 0;
            animation: bb-nav-in 0.3s ease-out forwards;
          }
          @keyframes bb-nav-in {
            from { opacity: 0; transform: translateX(-8px); }
            to   { opacity: 1; transform: none; }
          }
        }
      `}</style>
    </>
  );
}
