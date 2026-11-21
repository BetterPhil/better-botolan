import { ExternalLink } from 'lucide-react';
import type { Disclaimer } from '../../lib/budgetApi';

/**
 * Renders the disclaimers the Budget API attaches to every response.
 * The API's terms require these to stay with any figure we republish.
 */
export default function BudgetDisclaimers({
  disclaimers,
}: {
  disclaimers: Disclaimer[];
}) {
  if (disclaimers.length === 0) return null;

  return (
    <aside className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <h3 className="mb-2 font-semibold">
        Please read before you share these figures
      </h3>
      <ul className="space-y-2">
        {disclaimers.map(d => (
          <li key={d.id}>
            <span className="font-medium">{d.title}</span> {d.body}
            {d.url && (
              <>
                {' '}
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 underline"
                >
                  Details
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
