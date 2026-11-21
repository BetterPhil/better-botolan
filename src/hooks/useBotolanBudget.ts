import { useEffect, useState } from 'react';
import { fetchProjectsForPlace, type BudgetResult } from '../lib/budgetApi';

interface Settled {
  attempt: number;
  result: BudgetResult | null;
  error: string | null;
}

/**
 * Loads Botolan's FY2027 budget lines from the BetterGov Budget API.
 * `reload()` retries after a failure.
 */
export function useBotolanBudget(place = 'Botolan') {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchProjectsForPlace(place, controller.signal)
      .then(result => setSettled({ attempt, result, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({
          attempt,
          result: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    return () => controller.abort();
  }, [place, attempt]);

  const loading = settled === null || settled.attempt !== attempt;

  return {
    loading,
    result: loading ? null : settled.result,
    error: loading ? null : settled.error,
    reload: () => setAttempt(n => n + 1),
  };
}
