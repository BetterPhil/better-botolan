/**
 * The standard documents Local Government Units post under the DILG
 * Full Disclosure Policy (FDP). This is the standardized DILG document set
 * (not Botolan-specific text) — the actual files for Botolan are published on
 * the official FDP Portal, which we link to.
 *
 * Sources: DILG Full Disclosure Policy Portal (https://fdpp.dilg.gov.ph).
 */
export interface DisclosureDoc {
  name: string;
  description: string;
  group: 'Budget & Finance' | 'Procurement' | 'Special Funds';
}

export const FDP_PORTAL = 'https://fdpp.dilg.gov.ph';
export const FDP_ABOUT = 'https://fdpp.dilg.gov.ph/fdpp/about';

export const disclosureDocs: DisclosureDoc[] = [
  {
    name: 'Annual Budget',
    description: "The municipality's approved yearly budget.",
    group: 'Budget & Finance',
  },
  {
    name: 'Statement of Receipts and Expenditures (SRE)',
    description: 'Actual income received and money spent.',
    group: 'Budget & Finance',
  },
  {
    name: 'Quarterly Statement of Cash Flows',
    description: 'Cash coming in and going out, each quarter.',
    group: 'Budget & Finance',
  },
  {
    name: 'Statement of Debt Service',
    description: 'Loan payments made by the municipality.',
    group: 'Budget & Finance',
  },
  {
    name: 'Annual Procurement Plan / Procurement List',
    description: 'Goods, services and works the LGU plans to buy.',
    group: 'Procurement',
  },
  {
    name: 'Items to Bid & Bid Results',
    description: 'Projects put up for bidding and who won.',
    group: 'Procurement',
  },
  {
    name: 'Abstract of Bids as Calculated',
    description: 'Comparison of the bids received for a project.',
    group: 'Procurement',
  },
  {
    name: '20% Component of the NTA (Local Development Fund)',
    description: 'How the development fund was used.',
    group: 'Special Funds',
  },
  {
    name: 'Local Disaster Risk Reduction & Management Fund (LDRRMF)',
    description: 'Utilization of the disaster/calamity fund.',
    group: 'Special Funds',
  },
  {
    name: 'Special Education Fund (SEF)',
    description: 'How the education fund (from real property tax) was used.',
    group: 'Special Funds',
  },
];
