const pesoFull = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

/** Exact pesos, e.g. ₱16,000,000. Null means "no such line", never zero. */
export function formatPeso(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return pesoFull.format(value);
}

/** Short form for headlines, e.g. ₱1.25 billion. */
export function formatPesoCompact(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e9) return `₱${(value / 1e9).toFixed(2)} billion`;
  if (abs >= 1e6) return `₱${(value / 1e6).toFixed(1)} million`;
  return pesoFull.format(value);
}

/** Signed change, e.g. +₱5,000,000 or −₱2,000,000. */
export function formatDelta(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (value === 0) return '₱0';
  const sign = value > 0 ? '+' : '−';
  return `${sign}${pesoFull.format(Math.abs(value))}`;
}
