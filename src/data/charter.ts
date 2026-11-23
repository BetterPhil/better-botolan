/**
 * Citizen's Charter for Botolan.
 *
 * Services, offices, requirements and legal basis are derived from this
 * portal's service guides (accurate). EXACT FEES and PROCESSING TIMES come
 * from the LGU's official Citizen's Charter and are marked "To be confirmed"
 * until supplied by the Municipal Hall.
 *
 * Under RA 11032 (Ease of Doing Business Act), government transactions must be
 * acted on within 3 working days (simple), 7 (complex) or 20 (highly technical).
 */
export interface CharterService {
  service: string;
  office: string;
  requirements: string[];
  /** Official fee — confirm with the office. */
  fee: string;
  /** Official processing time — confirm with the office. */
  processingTime: string;
  legalBasis?: string;
  guideHref?: string;
}

export const TBC_FEE = 'To be confirmed';
export const TBC_TIME = 'Within RA 11032 limits — confirm with office';

export const charterServices: CharterService[] = [
  {
    service: "Mayor's (Business) Permit — New",
    office: 'Business Permits and Licensing Office (BPLO)',
    requirements: [
      'DTI / SEC / CDA registration',
      'Barangay Clearance',
      'Zoning / locational clearance',
      'Sanitary Permit and Fire Safety Inspection Certificate (as required)',
      'Valid ID of owner',
    ],
    fee: TBC_FEE,
    processingTime: TBC_TIME,
    legalBasis: 'RA 7160; RA 11032',
    guideHref:
      '/services/business/apply-for-barangay-clearance-and-mayors-business-permits',
  },
  {
    service: "Mayor's (Business) Permit — Renewal",
    office: 'Business Permits and Licensing Office (BPLO)',
    requirements: [
      "Previous year's Mayor's Permit and official receipts",
      'Sworn statement of gross sales / audited FS',
      'Current Barangay Clearance',
      'Sanitary Permit and FSIC (as required)',
    ],
    fee: TBC_FEE,
    processingTime: TBC_TIME,
    legalBasis: 'RA 7160; RA 11032',
    guideHref: '/services/business/renew-permits-and-pay-local-business-taxes',
  },
  {
    service: 'Building Permit',
    office: 'Office of the Municipal Building Official',
    requirements: [
      'Land title or tax declaration',
      'Zoning / locational clearance',
      'Building plans signed by a licensed architect or engineer',
      'Barangay clearance',
      'Valid ID',
    ],
    fee: TBC_FEE,
    processingTime: TBC_TIME,
    legalBasis: 'PD 1096 (National Building Code)',
    guideHref:
      '/services/housing-land-use/request-zoning-land-use-or-building-permits',
  },
  {
    service: 'Real Property Tax Payment',
    office: "Municipal Treasurer's Office (MTO)",
    requirements: [
      'Previous official receipt or Tax Declaration number',
      'Valid ID',
    ],
    fee: TBC_FEE,
    processingTime: TBC_TIME,
    legalBasis: 'RA 7160',
  },
  {
    service: 'Community Tax Certificate (Cedula)',
    office: "Municipal Treasurer's Office (MTO)",
    requirements: ['Valid ID', 'Basic personal / income information'],
    fee: TBC_FEE,
    processingTime: TBC_TIME,
    legalBasis: 'RA 7160',
  },
  {
    service: 'Senior Citizen ID',
    office: 'Office of Senior Citizens Affairs (OSCA)',
    requirements: [
      'Proof of age (birth certificate / valid ID)',
      'Barangay certificate of residency',
      '1x1 or 2x2 photos',
    ],
    fee: 'Free (by law)',
    processingTime: TBC_TIME,
    legalBasis: 'RA 9994',
    guideHref:
      '/services/social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance',
  },
  {
    service: 'PWD ID',
    office: 'Persons with Disability Affairs Office (PDAO) / MSWDO',
    requirements: [
      'Medical certificate stating the disability',
      'Barangay certificate of residency',
      '1x1 or 2x2 photos',
    ],
    fee: 'Free (by law)',
    processingTime: TBC_TIME,
    legalBasis: 'RA 7277, as amended by RA 11228',
    guideHref:
      '/services/social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance',
  },
  {
    service: 'Solo Parent ID',
    office: 'Municipal Social Welfare and Development Office (MSWDO)',
    requirements: [
      'Documents proving solo-parent status',
      'Barangay certificate of residency',
      'Valid ID and photos',
    ],
    fee: 'Free (by law)',
    processingTime: TBC_TIME,
    legalBasis: 'RA 11861 (Expanded Solo Parents Welfare Act)',
    guideHref:
      '/services/social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance',
  },
  {
    service: 'Civil Registry Document (Birth / Marriage / Death Certificate)',
    office: 'Office of the Municipal Civil Registrar (MCR)',
    requirements: [
      'Request form with the details of the record',
      'Valid ID of the requesting party',
      'Authorization letter (if filing for someone else)',
    ],
    fee: TBC_FEE,
    processingTime: TBC_TIME,
    legalBasis: 'Act 3753 (Civil Registry Law)',
  },
  {
    service: 'RSBSA Farmer / Fisherfolk Registration',
    office: 'Municipal Agriculture Office (MAO)',
    requirements: [
      'Valid ID',
      'Barangay certificate',
      'Farm / fishing details',
    ],
    fee: 'Free',
    processingTime: TBC_TIME,
    legalBasis: 'RA 7160',
    guideHref:
      '/services/agriculture-fisheries/ask-for-free-seeds-seedlings-fertilizers-or-fingerlings',
  },
  {
    service: 'Assistance to Individuals in Crisis Situation (AICS)',
    office: 'Municipal Social Welfare and Development Office (MSWDO)',
    requirements: [
      'Valid ID',
      'Barangay certificate of residency / indigency',
      'Supporting documents for the specific assistance (medical, burial, etc.)',
    ],
    fee: 'Free',
    processingTime: TBC_TIME,
    legalBasis: 'DSWD AICS guidelines',
  },
  {
    service: 'Job Matching / PESO Registration',
    office: 'Public Employment Service Office (PESO)',
    requirements: ['Valid ID', 'Resume', 'Barangay certificate (if required)'],
    fee: 'Free',
    processingTime: TBC_TIME,
    legalBasis: 'RA 8759 (PESO Act)',
    guideHref:
      '/services/social-welfare/join-livelihood-or-skills-training-programs',
  },
];
