import { cn } from '../../lib/utils';
import { Heading } from './Heading';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
  /** Center the block (used on full-width bands). */
  center?: boolean;
}

/**
 * A consistent section header: a small uppercase kicker label, a serif
 * heading, and an optional one-line description. Used across the homepage
 * and content pages so every section has the same rhythm.
 */
export function SectionHeading({
  kicker,
  title,
  description,
  className,
  center = false,
}: SectionHeadingProps) {
  return (
    <div className={cn(center && 'text-center', 'mb-8', className)}>
      {kicker && <span className="bb-kicker">{kicker}</span>}
      <Heading level={2} className={cn(kicker && 'mt-3', 'mb-0')}>
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            'mt-3 text-gray-600',
            center ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
