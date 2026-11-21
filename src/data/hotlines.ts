import {
  Ambulance,
  Flame,
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

export const emergencyHotlines: Hotline[] = [
  { label: '911 National', number: '911', icon: Phone },
  { label: 'Botolan MDRRMO', number: '', icon: Siren },
  { label: 'Botolan Police', number: '', icon: Shield },
  { label: 'Botolan Fire', number: '', icon: Flame },
  { label: 'Rural Health Unit', number: '', icon: Ambulance },
];
