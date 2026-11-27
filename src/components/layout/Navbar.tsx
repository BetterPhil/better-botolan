import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  BarChart3,
  BookUser,
  CalendarDays,
  ChevronDown,
  Coins,
  Compass,
  Eye,
  FileText,
  GraduationCap,
  Landmark,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Newspaper,
  Search,
  ScrollText,
  ShieldAlert,
} from 'lucide-react';
import { serviceCategories } from '../../data/yamlLoader';
import { isSearchEnabled } from '../../lib/clientSearch';
import { useSearchModal } from '../../context/SearchModalContext';
import { siteConfig } from '../../config/site';
import { cn } from '../../lib/utils';
import EmergencyBar from './EmergencyBar';
import UtilityBar from './UtilityBar';

interface MegaItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

interface NavGroup {
  label: string;
  /** Landing page for the group (optional — groups like "Discover" have none). */
  href?: string;
  items?: MegaItem[];
  /** 2 → two-column mega panel. */
  columns?: 1 | 2;
  /** Align the panel to the right edge (for triggers near the right). */
  align?: 'left' | 'right';
}

const serviceItems: MegaItem[] = serviceCategories.categories.map(c => ({
  label: c.category,
  href: `/services/${c.slug}`,
}));

const NAV: NavGroup[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    columns: 2,
    items: serviceItems,
  },
  {
    label: 'Discover',
    items: [
      {
        label: 'Tourism',
        href: '/tourism',
        description: 'Explore Botolan',
        icon: Compass,
      },
      {
        label: 'Events',
        href: '/events',
        description: 'Fiestas & holidays',
        icon: CalendarDays,
      },
      {
        label: 'News',
        href: '/news',
        description: 'Advisories & updates',
        icon: Newspaper,
      },
    ],
  },
  {
    label: 'Community',
    items: [
      {
        label: 'Barangays',
        href: '/barangays',
        description: 'All 31 barangays',
        icon: MapPin,
      },
      {
        label: 'Schools',
        href: '/schools',
        description: 'Education in Botolan',
        icon: GraduationCap,
      },
      {
        label: 'Safety',
        href: '/preparedness',
        description: 'Disaster preparedness',
        icon: ShieldAlert,
      },
      {
        label: 'Feedback',
        href: '/feedback',
        description: 'Report or suggest',
        icon: MessageSquare,
      },
    ],
  },
  {
    label: 'Government',
    align: 'right',
    items: [
      {
        label: 'Officials',
        href: '/government/departments',
        description: 'Executive & legislative',
        icon: Landmark,
      },
      {
        label: 'Directory',
        href: '/directory',
        description: 'Offices & contacts',
        icon: BookUser,
      },
    ],
  },
  {
    label: 'Transparency',
    href: '/transparency',
    columns: 2,
    align: 'right',
    items: [
      {
        label: 'Budget Dashboard',
        href: '/budget',
        description: 'Where the money goes',
        icon: Coins,
      },
      {
        label: 'Budget Projects',
        href: '/projects',
        description: 'National-funded projects',
        icon: Coins,
      },
      {
        label: 'Transparency Portal',
        href: '/transparency',
        description: 'Open data hub',
        icon: Eye,
      },
      {
        label: 'Full Disclosure',
        href: '/full-disclosure',
        description: 'DILG FDP documents',
        icon: FileText,
      },
      {
        label: "Citizen's Charter",
        href: '/citizens-charter',
        description: 'Services & requirements',
        icon: ScrollText,
      },
      {
        label: 'Statistics',
        href: '/statistics',
        description: 'Population & figures',
        icon: BarChart3,
      },
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
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { pathname } = useLocation();
  const { openSearch } = useSearchModal();

  const linkActive = (href: string) =>
    href === '/' ? pathname === '/' : topSegment(pathname) === topSegment(href);

  const groupActive = (group: NavGroup) =>
    (group.href ? linkActive(group.href) : false) ||
    (group.items?.some(i => topSegment(pathname) === topSegment(i.href)) ??
      false);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenGroup(null);
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
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV.map(group =>
                group.items ? (
                  <div key={group.label} className="relative group">
                    {group.href ? (
                      <Link
                        to={group.href}
                        className={cn(
                          'flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-colors',
                          groupActive(group)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                        )}
                      >
                        {group.label}
                        <ChevronDown
                          className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={cn(
                          'flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition-colors',
                          groupActive(group)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                        )}
                        aria-haspopup="true"
                      >
                        {group.label}
                        <ChevronDown
                          className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                          aria-hidden="true"
                        />
                      </button>
                    )}

                    {/* Mega panel */}
                    <div
                      className={cn(
                        'absolute top-full pt-2 z-50 invisible translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
                        group.align === 'right' ? 'right-0' : 'left-0'
                      )}
                    >
                      <div
                        className={cn(
                          'grid gap-0.5 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5',
                          group.columns === 2
                            ? 'w-[33rem] grid-cols-2'
                            : 'w-72 grid-cols-1'
                        )}
                      >
                        {group.items.map(item => (
                          <MegaLink key={item.href} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={group.label}
                    to={group.href ?? '/'}
                    className={cn(
                      'rounded-lg px-3 py-2 font-medium transition-colors',
                      linkActive(group.href ?? '/')
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    )}
                  >
                    {group.label}
                  </Link>
                )
              )}

              {isSearchEnabled && (
                <button
                  type="button"
                  onClick={() => openSearch()}
                  aria-label="Search"
                  className="ml-1 rounded-lg p-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Mobile menu button — animated burger */}
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

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            'lg:hidden grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="min-h-0 overflow-hidden border-t border-gray-200">
            <div className="container mx-auto px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {NAV.map((group, index) => (
                <div
                  key={group.label}
                  className={isOpen ? 'bb-nav-item' : undefined}
                  style={
                    isOpen ? { animationDelay: `${index * 40}ms` } : undefined
                  }
                >
                  {group.items ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGroup(
                            openGroup === group.label ? null : group.label
                          )
                        }
                        aria-expanded={openGroup === group.label}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {group.label}
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 transition-transform duration-200',
                            openGroup === group.label && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        className={cn(
                          'grid transition-[grid-template-rows] duration-200 ease-out',
                          openGroup === group.label
                            ? 'grid-rows-[1fr]'
                            : 'grid-rows-[0fr]'
                        )}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="ml-3 space-y-0.5 border-l border-gray-200 pl-3 py-1">
                            {group.items.map(item => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={closeMenu}
                                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-700"
                                >
                                  {Icon && (
                                    <Icon
                                      className="h-4 w-4 text-primary-600"
                                      aria-hidden="true"
                                    />
                                  )}
                                  {item.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={group.href ?? '/'}
                      onClick={closeMenu}
                      className={cn(
                        'block rounded-lg px-3 py-2 font-medium',
                        linkActive(group.href ?? '/')
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {group.label}
                    </Link>
                  )}
                </div>
              ))}

              {isSearchEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    openSearch();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                  Search
                </button>
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

function MegaLink({ item }: { item: MegaItem }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className="group/item flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-primary-50"
    >
      {Icon ? (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-colors group-hover/item:bg-primary-100">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : (
        <span
          className="mt-2 ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300"
          aria-hidden="true"
        />
      )}
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-900 group-hover/item:text-primary-700">
          {item.label}
        </span>
        {item.description && (
          <span className="block text-xs text-gray-500">
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}
