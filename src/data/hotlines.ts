import {
  Ambulance,
  Flame,
  Hospital,
  Phone,
  Shield,
  Siren,
  type LucideIcon,
} from 'lucide-react';

/**
 * Botolan emergency hotlines.
 * Source: official "Botolan Emergency Hotlines" advisory
 * (Municipal Government of Botolan). Verified 22 Nov 2026.
 * Re-check periodically and update the numbers here.
 */

/** Full office entry, used by the Hotlines page. */
export interface HotlineOffice {
  label: string;
  numbers: string[];
  icon: LucideIcon;
  note?: string;
  /** Shown in the top emergency bar. */
  priority?: boolean;
}

export const botolanHotlines: HotlineOffice[] = [
  {
    label: 'Unified Emergency',
    numbers: ['911'],
    icon: Phone,
    note: 'One number for police, fire and medical emergencies.',
    priority: true,
  },
  {
    label: 'MDRRMO',
    numbers: ['0998 364 3703', '0950 626 5867', '0962 487 5156'],
    icon: Siren,
    note: 'Disaster Risk Reduction and Management Office — operates 24/7.',
    priority: true,
  },
  {
    label: 'Municipal Police Station',
    numbers: ['0947 923 4917', '0998 598 5512'],
    icon: Shield,
    priority: true,
  },
  {
    label: 'Bureau of Fire Protection',
    numbers: ['0908 941 2913'],
    icon: Flame,
    priority: true,
  },
  {
    label: 'Municipal Health Office',
    numbers: ['0919 077 2891', '0908 704 0229'],
    icon: Ambulance,
  },
  {
    label: 'Dr. Florentino C. Doble Memorial Hospital',
    numbers: ['0950 071 9523'],
    icon: Hospital,
    note: 'DFCDMH, Botolan.',
  },
];

/** Strips spaces so a number works in a tel: link. */
export function telHref(num: string): string {
  return `tel:${num.replace(/[^\d+]/g, '')}`;
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
