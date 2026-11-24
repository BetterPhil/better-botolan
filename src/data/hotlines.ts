import {
  Ambulance,
  Anchor,
  Flame,
  HeartPulse,
  Hospital,
  Phone,
  Shield,
  ShieldAlert,
  Siren,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Botolan emergency hotlines.
 * Source: official "MDRRMO Emergency Hotline" advisory, Municipal Disaster Risk
 * Reduction & Management Office (LGU Botolan). Reclassified by category.
 * Verified 24 Nov 2026. Re-check periodically and update the numbers here.
 */

export type HotlineCategory = 'emergency' | 'security' | 'health' | 'utility';

export const CATEGORY_LABELS: Record<HotlineCategory, string> = {
  emergency: 'Emergency & Rescue',
  security: 'Police & Security',
  health: 'Medical & Health',
  utility: 'Utilities',
};

/** Order the categories are shown on the Hotlines page. */
export const CATEGORY_ORDER: HotlineCategory[] = [
  'emergency',
  'security',
  'health',
  'utility',
];

/** Full office entry, used by the Hotlines page. */
export interface HotlineOffice {
  label: string;
  numbers: string[];
  icon: LucideIcon;
  category: HotlineCategory;
  note?: string;
  /** Shown in the top emergency bar. */
  priority?: boolean;
}

export const botolanHotlines: HotlineOffice[] = [
  {
    label: 'Unified Emergency',
    numbers: ['911'],
    icon: Phone,
    category: 'emergency',
    note: 'One number for police, fire and medical emergencies.',
    priority: true,
  },

  // ---- Emergency & Rescue ----
  {
    label: 'Emergency Response Team',
    numbers: ['0962 487 5156'],
    icon: Ambulance,
    category: 'emergency',
    note: 'MDRRMO Emergency Response Team (ERT).',
    priority: true,
  },
  {
    label: 'MDRRMO',
    numbers: ['0950 626 5867', '0998 364 3703'],
    icon: Siren,
    category: 'emergency',
    note: 'Municipal Disaster Risk Reduction & Management Office — operates 24/7.',
    priority: true,
  },
  {
    label: 'Bureau of Fire Protection',
    numbers: ['0908 941 2913'],
    icon: Flame,
    category: 'emergency',
    note: 'Botolan Fire Station.',
    priority: true,
  },
  {
    label: 'Philippine Coast Guard',
    numbers: ['0968 687 3995'],
    icon: Anchor,
    category: 'emergency',
    note: 'For maritime and coastal emergencies.',
  },

  // ---- Police & Security ----
  {
    label: 'Botolan Police Station (PNP)',
    numbers: ['0998 598 5512', '0947 923 4917'],
    icon: Shield,
    category: 'security',
    priority: true,
  },
  {
    label: 'RMFB 3',
    numbers: ['0966 869 9382'],
    icon: ShieldAlert,
    category: 'security',
    note: 'Regional Mobile Force Battalion 3 (PNP).',
  },

  // ---- Medical & Health ----
  {
    label: 'Kainomayan Hospital',
    numbers: ['0950 071 9523'],
    icon: Hospital,
    category: 'health',
    note: 'Dr. Florentino C. Doble Memorial Hospital, Botolan.',
  },
  {
    label: 'Municipal Health Office',
    numbers: ['0919 077 2891', '0908 704 0229'],
    icon: HeartPulse,
    category: 'health',
  },

  // ---- Utilities ----
  {
    label: 'ZAMECO II (Botolan)',
    numbers: ['0908 357 5228'],
    icon: Zap,
    category: 'utility',
    note: 'Zambales II Electric Cooperative — power interruptions and line emergencies.',
  },
];

/** Strips spaces so a number works in a tel: link. */
export function telHref(num: string): string {
  return `tel:${num.replace(/[^\d+]/g, '')}`;
}

/** Offices in a category (excludes the standalone 911 banner entry). */
export function officesByCategory(category: HotlineCategory): HotlineOffice[] {
  return botolanHotlines.filter(
    o => o.category === category && o.label !== 'Unified Emergency'
  );
}

/* ---- Backward-compatible flat list ----
 * The top emergency bar and the homepage HelpCta expect { label, number, icon }.
 * We derive it from the priority offices above (their first number), so those
 * components keep working with no changes. */
export interface Hotline {
  label: string;
  number: string;
  icon: LucideIcon;
}

export const emergencyHotlines: Hotline[] = botolanHotlines
  .filter(office => office.priority)
  .map(office => ({
    label: office.label,
    number: office.numbers[0],
    icon: office.icon,
  }));
