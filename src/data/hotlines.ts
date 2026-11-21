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
 * Emergency hotlines shown in the top bar.
 *
 * TODO: Fill in Botolan's numbers from official sources (the MDRRMO,
 * the municipal police station, the fire station, and the Rural Health
 * Unit). Do not publish a number you have not confirmed.
 */
export const emergencyHotlines: Hotline[] = [
  { label: '911 National', number: '911', icon: Phone },
  { label: 'Philippine Red Cross', number: '143', icon: HeartPulse },
  { label: 'Botolan MDRRMO', number: '', icon: Siren },
  { label: 'Botolan Police', number: '', icon: Shield },
  { label: 'Botolan Fire', number: '', icon: Flame },
  { label: 'Rural Health Unit', number: '', icon: Ambulance },
];
