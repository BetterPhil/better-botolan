/**
 * Recent Sangguniang Bayan resolutions, from the official SB site.
 * Source: https://www.vm-sbbotolan.com/ordinances-resolutions
 *
 * This is a small, hand-verified sample of the Series of 2026 (the site lists
 * 142 records across many years). Titles are summarized; the "source" link
 * goes to the official register, which has the full text of each.
 *
 * Last updated: 21 Nov 2026.
 */

export interface Resolution {
  number: string;
  date: string; // ISO date
  summary: string;
  vote?: string;
}

export const RESOLUTIONS_SOURCE =
  'https://www.vm-sbbotolan.com/ordinances-resolutions';

/** Official register says: 142 records across Series 2001-2026. */
export const RESOLUTIONS_TOTAL = 142;

export const recentResolutions: Resolution[] = [
  {
    number: 'Res. 116-2026',
    date: '2026-09-28',
    summary:
      'Authorizes the mayor to sign an agreement with GreenTech Total Environmental Solutions, Inc. for hauling municipal solid waste to its sanitary landfill.',
    vote: 'Approved, unanimous',
  },
  {
    number: 'Res. 115-2026',
    date: '2026-09-21',
    summary:
      'Endorses a gratuitous special use permit application to DENR for military facilities and a logistics hub in Sitio Alao, Brgy. San Juan.',
    vote: 'Approved, unanimous',
  },
  {
    number: 'Res. 111-2026',
    date: '2026-08-24',
    summary:
      'Enacts Ordinance No. 02-2026 (Supplemental Budget No. 02), appropriating PHP 8,897,749.00 from reversion of appropriations.',
    vote: 'Approved, unanimous',
  },
  {
    number: 'Res. 110-2026',
    date: '2026-08-17',
    summary:
      'Authorizes the mayor to process documents with ZAMECO I for power connections to new LGU infrastructure projects.',
    vote: 'Approved, unanimous',
  },
  {
    number: 'Res. 109-2026',
    date: '2026-08-12',
    summary:
      'Declares a state of calamity due to Severe Tropical Storm Maymay (Kujira), authorizes the Quick Response Fund, and imposes a price freeze on basic commodities and fuel.',
    vote: 'Approved, unanimous',
  },
  {
    number: 'Res. 108-2026',
    date: '2026-08-03',
    summary:
      'Authorizes opening a special account in the General Fund for eco-tourism fees at Landbank, Iba Branch, and names authorized signatories.',
    vote: 'Approved, unanimous',
  },
  {
    number: 'Res. 103-2026',
    date: '2026-07-27',
    summary:
      'Authorizes the mayor to enter an agreement with MDG Dialysis and Kidney Care Solutions, Inc. for emergency ambulance and patient transfer services for the hemodialysis facility in Brgy. Batonlapoc.',
    vote: 'Approved, unanimous',
  },
  {
    number: 'Res. 63-2026',
    date: '2026-08-15',
    summary:
      'Enacts Ordinance No. 01-2026 (Supplemental Budget No. 01), appropriating PHP 5,550,400.00 from reversion of savings and appropriations.',
    vote: 'Approved, unanimous',
  },
];
