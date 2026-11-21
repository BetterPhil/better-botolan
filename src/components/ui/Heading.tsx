import React from 'react';
import { cn } from '../../lib/utils';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

// h1/h2 use the display serif (set globally in index.css) with tight leading.
// h3-h6 stay in the sans UI font for labels and sub-sections.
const headingStyles: Record<number, string> = {
  1: 'font-display text-4xl md:text-5xl font-semibold mb-4 leading-[1.05] tracking-tight',
  2: 'font-display text-3xl md:text-4xl font-semibold mb-4 leading-[1.1] tracking-tight',
  3: 'text-xl md:text-2xl font-semibold mb-3 leading-snug',
  4: 'text-lg md:text-xl font-semibold mb-3 leading-snug',
  5: 'text-base md:text-lg font-semibold mb-2 leading-snug',
  6: 'text-sm md:text-base font-semibold mb-2 leading-snug',
};

export function Heading({ level = 1, children, className }: HeadingProps) {
  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return React.createElement(
    HeadingTag,
    { className: cn(headingStyles[level], className) },
    children
  );
}
