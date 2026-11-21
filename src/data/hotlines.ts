import {
  Ambulance,
  Flame,
  HeartPulse,
  Phone,
  Shield,
  Siren,
  type LucideIcon,
} from 'lucide-react';

export interface Hotline {
  label: string;
  /** Leave empty until verified: entries without a number are hidden. */
  number: string;
  icon: LucideIcon;
}

/**
 * Emergency hotlines for the top bar.
 * TODO: fill in Botolan's verified numbers (MDRRMO, police, fire, RHU).
 */
export const emergencyHotlines: Hotline[] = [
  { label: '911 National', number: '911', icon: Phone },
  { label: 'Philippine Red Cross', number: '143', icon: HeartPulse },
  { label: 'Botolan MDRRMO', number: '', icon: Siren },
  { label: 'Botolan Police', number: '', icon: Shield },
  { label: 'Botolan Fire', number: '', icon: Flame },
  { label: 'Rural Health Unit', number: '', icon: Ambulance },
];
