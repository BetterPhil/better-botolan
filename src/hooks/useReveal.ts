import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element when it scrolls into view, once.
 * Respects prefers-reduced-motion: if the user prefers less motion, the
 * element starts visible and never animates.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [shown, setShown] = useState(Boolean(prefersReduced));

  useEffect(() => {
    if (prefersReduced || shown) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced, shown]);

  return { ref, shown };
}
