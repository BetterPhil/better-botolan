import { useEffect, useState } from 'react';
import { BUDGET_SECTIONS } from '../../data/budget';
import { cn } from '../../lib/utils';

/**
 * Sticky table-of-contents for the budget dashboard.
 * - Desktop: a vertical rail that sticks beside the content.
 * - Mobile: a horizontal, scrollable pill bar that sticks under the navbar.
 * The active section is tracked with an IntersectionObserver (scroll-spy).
 */
export default function BudgetSideNav() {
  const [active, setActive] = useState(BUDGET_SECTIONS[0].id);

  useEffect(() => {
    const sections = BUDGET_SECTIONS.map(s =>
      document.getElementById(s.id)
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const onJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
    setActive(id);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      aria-label="Budget sections"
      className="lg:sticky lg:top-24 lg:self-start"
    >
      <p className="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 lg:block">
        On this page
      </p>
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {BUDGET_SECTIONS.map(s => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                onClick={e => onJump(e, s.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors lg:rounded-lg',
                  isActive
                    ? 'bg-primary-600 text-white lg:bg-primary-50 lg:text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 lg:bg-transparent lg:hover:bg-gray-100'
                )}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
