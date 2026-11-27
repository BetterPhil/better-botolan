import { CloudOff } from 'lucide-react';

/**
 * Small reassurance pill for pages whose content is bundled (not API-driven)
 * and therefore available even with no signal — e.g. Hotlines, Preparedness.
 */
export default function OfflineReadyBadge({
  className = '',
  label = 'Available offline',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 ${className}`}
      title="This page works even without an internet connection once you've opened the site."
    >
      <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
