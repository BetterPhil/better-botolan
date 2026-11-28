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
export interface CharterRequirement {
  text: string;
  /** Where the applicant obtains it, e.g. "From the Owner". */
  source?: string;
}

export interface CharterStep {
  /** What the client does at this stage (optional; may group several actions). */
  clientStep?: string;
  /** What the office does. */
  agencyAction: string;
  /** Fee for this step ("None" or "₱100.00 …"). */
  fee: string;
  /** Processing time for this step. */
  time: string;
  /** Who is responsible. */
  responsible: string[];
}

export interface CharterService {
  service: string;
  office: string;
  /** e.g. "With PASSO Approval". */
  note?: string;
  requirements: Array<string | CharterRequirement>;
  /** Official fee — confirm with the office when not official. */
  fee: string;
  /** Official processing time — confirm with the office when not official. */
  processingTime: string;
  legalBasis?: string;
  guideHref?: string;
  /** Full step-by-step process, when transcribed from the official charter. */
  steps?: CharterStep[];
  totalFee?: string;
  totalTime?: string;
  /** true when taken from the office's official, published Citizen's Charter. */
  official?: boolean;
}

export interface CharterOffice {
  name: string;
  head?: string;
  email?: string;
  phone?: string;
  /** Feedback & redress mechanisms published in the charter. */
  feedback?: string[];
  /** Provenance note for this office's data. */
  source?: string;
}

export const TBC_FEE = 'To be confirmed';
export const TBC_TIME = 'Within RA 11032 limits — confirm with office';

/** Office-level metadata (head, contact, feedback), looked up by office name. */
export const charterOffices: CharterOffice[] = [
  {
    name: "Municipal Assessor's Office",
    head: 'Engr. Eduardo D. Doble Jr.',
    email: 'botolan.assessor@gmail.com',
    phone: '0928-372-9739',
    source:
      "Municipal Assessor's Office Citizen's Charter, Municipality of Botolan",
    feedback: [
      'Accomplish our Customer Feedback Form in the office and drop it in the Drop Box at the Public Assistance and Complaints Desk.',
      'Talk to the Public Assistance and Complaints Desk Officer-of-the-Day, or the head of office, Engr. Eduardo D. Doble Jr., Municipal Assessor.',
      'If you are not satisfied, written or verbal complaints are attended to immediately by the Officer-of-the-Day at the Public Assistance and Complaints Desk.',
      'Contact us at botolan.assessor@gmail.com or 0928-372-9739.',
    ],
  },
];

const ASSESSOR = "Municipal Assessor's Office";

/** The 8 official services of the Municipal Assessor's Office (verbatim). */
export const assessorServices: CharterService[] = [
  {
    service: 'Cancellation, Revision, or Correction of Assessments',
    office: ASSESSOR,
    note: 'With PASSO Approval',
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      {
        text: 'Letter of Request for Cancellation, Revision, or Correction of Assessment',
        source: 'From the Owner',
      },
      {
        text: 'Certificate of Real Property Tax Payment (1 copy)',
        source: 'Office of the Municipal Treasurer',
      },
      {
        text: 'Barangay Certification that the property no longer exists (1 copy)',
        source: 'From the Punong Barangay',
      },
    ],
    steps: [
      {
        clientStep: 'Inform any of the staff regarding the request.',
        agencyAction:
          'The Municipal Assessor, with the client, conducts an ocular inspection to check whether there is basis for cancellation, revision, or correction. A Field Appraisal and Assessment Sheet (FAAS) is prepared.',
        fee: 'None',
        time: '2 hours',
        responsible: [
          'Assessment Clerk',
          'Property Appraiser',
          'Municipal Assessor',
        ],
      },
      {
        clientStep:
          'Submit the required documents and wait for the request to be evaluated.',
        agencyAction:
          'The Municipal Assessor prepares an inspection report (if a site inspection was conducted), then prepares a Notice of Cancellation, Revision, or Correction.',
        fee: 'None',
        time: '1 hour',
        responsible: [
          'Assessment Clerk',
          'Property Appraiser',
          'Municipal Assessor',
        ],
      },
      {
        agencyAction:
          "Recording, processing, and approval of the Notice of Cancellation at the Provincial Assessor's Office (PASSO), and receiving of the approved notice.",
        fee: 'None',
        time: '5 working days',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction:
          'Recording of the Notice of Cancellation, Revision, or Correction.',
        fee: 'None',
        time: '10 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction:
          "Issuance of the owner's copy of the Cancellation or Correction from the Municipal Assessor's Office.",
        fee: 'None',
        time: '5 minutes',
        responsible: ['Assessment Clerk'],
      },
    ],
    totalFee: 'None',
    totalTime: '5 working days, 3 hours, and 15 minutes',
    fee: 'None',
    processingTime: '5 working days, 3 hrs, 15 mins',
  },
  {
    service: 'Certified Photocopy, Machine Copy & Certifications',
    office: ASSESSOR,
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      { text: 'Verbal Request', source: 'From the Owner' },
      { text: 'Official Receipt of Payment', source: 'From the Owner' },
    ],
    steps: [
      {
        clientStep: 'Inform any of the staff regarding the request.',
        agencyAction: 'Evaluation of the request.',
        fee: '₱100.00 (certifications); ₱50.00 (machine copies)',
        time: '5 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction: 'Preparation of the Tax Declaration or Certification.',
        fee: 'None',
        time: '5 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction:
          'The Municipal Assessor approves and signs the true copy or certification.',
        fee: 'None',
        time: '5 minutes',
        responsible: ['Municipal Assessor'],
      },
    ],
    totalFee: '₱150.00',
    totalTime: '15 minutes',
    fee: '₱150.00',
    processingTime: '15 minutes',
  },
  {
    service: 'Assessment of a New Building or Machinery',
    office: ASSESSOR,
    note: 'With PASSO Approval',
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      {
        text: 'Sworn Statement of the Cost of the Building or Machinery',
        source: 'From the Owner',
      },
      {
        text: 'Building Permit and Blueprint of the approved Building Plan (1 copy)',
        source: 'Municipal Building Officials',
      },
    ],
    steps: [
      {
        clientStep: 'Inform any of the staff regarding the request.',
        agencyAction: 'Interview and review of the presented documents.',
        fee: 'None',
        time: '10 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        clientStep:
          'Submit the required documents and wait for the request to be evaluated.',
        agencyAction:
          'The Municipal Assessor and his staff, with the client, conduct an ocular inspection to assess the value of the property. A Field Appraisal and Assessment Sheet (FAAS) is prepared.',
        fee: '₱500.00',
        time: '2 hours',
        responsible: ['Tax Mapper', 'Property Appraiser', 'Municipal Assessor'],
      },
      {
        agencyAction: 'Preparation of the Updated Tax Declaration.',
        fee: 'None',
        time: '15 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction:
          'Recording, processing, and approval at the PASSO, and receiving of the Approved Tax Declaration.',
        fee: 'None',
        time: '5 working days',
        responsible: ['Municipal Assessor'],
      },
      {
        agencyAction:
          "Recording of the Tax Declaration; issuance of the owner's copy from the Municipal Assessor's Office.",
        fee: 'None',
        time: '15 minutes',
        responsible: ['Assessment Clerk'],
      },
    ],
    totalFee: '₱500.00',
    totalTime: '5 working days, 2 hours, and 40 minutes',
    fee: '₱500.00',
    processingTime: '5 working days, 2 hrs, 40 mins',
  },
  {
    service: "Owner's Copy of Updated Tax Declaration",
    office: ASSESSOR,
    note: 'With PASSO Approval',
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      {
        text: 'Deed of Conveyance (Sale, Inheritance, or Donation) (1 photocopy)',
        source: 'From the Owner',
      },
      {
        text: 'Certificate of Real Property Tax Payment (1 photocopy)',
        source: 'Office of the Municipal Treasurer',
      },
      {
        text: 'Transfer Tax Receipt / Certification (1 photocopy)',
        source: 'Office of the Provincial Treasurer',
      },
      {
        text: 'Certificate Authorizing Registration (CAR) (1 photocopy)',
        source: 'Bureau of Internal Revenue',
      },
      {
        text: 'Certified True Copy of Title (1 copy)',
        source: 'Registry of Deeds',
      },
      {
        text: 'PARO Clearance if Agricultural Land (1 photocopy)',
        source: 'Department of Agrarian Reform – PARO',
      },
      {
        text: 'Copy of Approved Subdivision Plan if segregated or consolidated (2 blueprint copies)',
        source: 'From the Owner',
      },
    ],
    steps: [
      {
        clientStep: 'Inform any of the staff regarding the request.',
        agencyAction: 'Interview and review of the presented documents.',
        fee: 'None',
        time: '10 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        clientStep:
          'Submit the required documents and wait for the request to be evaluated.',
        agencyAction:
          'The Municipal Assessor and his staff, with the client, conduct an ocular inspection to assess the value of the property.',
        fee: 'None',
        time: '2 hours',
        responsible: ['Tax Mapper', 'Property Appraiser', 'Municipal Assessor'],
      },
      {
        agencyAction: 'Preparation of the Updated Tax Declaration.',
        fee: 'None',
        time: '15 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction:
          'Recording, processing, and approval at the PASSO, and receiving of the Approved Tax Declaration.',
        fee: 'None',
        time: '5 working days',
        responsible: ['Municipal Assessor'],
      },
      {
        agencyAction:
          "Recording of the Tax Declaration; issuance of the owner's copy from the Municipal Assessor's Office.",
        fee: 'None',
        time: '15 minutes',
        responsible: ['Assessment Clerk'],
      },
    ],
    totalFee: 'None',
    totalTime: '5 working days, 2 hours, and 40 minutes',
    fee: 'None',
    processingTime: '5 working days, 2 hrs, 40 mins',
  },
  {
    service:
      "Owner's Copy of Tax Declaration — Newly Declared Property or Accretion",
    office: ASSESSOR,
    note: 'Residential/Agricultural Land or Accretion (outside cadastral lot) · With PASSO Approval',
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      {
        text: 'Certified True Copy of Original Certificate of Title (OCT) (1 copy)',
        source: 'From the Owner',
      },
      {
        text: '(For accretion) Affidavit of Ownership (1 copy)',
        source: 'From the Owner',
      },
      {
        text: '(For accretion) Affidavit of Two (2) Disinterested Persons Adjacent to the Lot (1 copy)',
        source: 'From the Owner',
      },
      {
        text: '(For accretion) Certificate of Alienable and Disposable Land and Approved Sketch Plan (1 copy)',
        source: 'DENR – CENRO',
      },
      {
        text: '(For accretion) Certificate of Actual Occupancy for more than ten (10) years (1 copy)',
        source: 'From the Punong Barangay',
      },
      {
        text: '(For accretion) Certification of Lot Status',
        source: 'DENR-CENRO, DAR-PARO, RTC, or LRA',
      },
    ],
    steps: [
      {
        clientStep: 'Inform any of the staff regarding the request.',
        agencyAction:
          'The Municipal Assessor, with the client, conducts an ocular inspection of the property. A Field Appraisal and Assessment Sheet (FAAS) is prepared.',
        fee: 'None',
        time: '2 hours',
        responsible: ['Assessment Clerk'],
      },
      {
        clientStep:
          'Submit the required documents and wait for the request to be evaluated.',
        agencyAction: 'Preparation of the New Tax Declaration.',
        fee: 'None',
        time: '1 hour',
        responsible: [
          'Assessment Clerk',
          'Tax Mapper',
          'Property Appraiser',
          'Municipal Assessor',
        ],
      },
      {
        agencyAction:
          'Recording, processing, and approval at the PASSO, and receiving of the Approved Tax Declaration.',
        fee: 'None',
        time: '5 working days',
        responsible: ['Municipal Assessor'],
      },
      {
        agencyAction:
          "Recording of the Tax Declaration; issuance of the owner's copy from the Municipal Assessor's Office.",
        fee: 'None',
        time: '15 minutes',
        responsible: ['Assessment Clerk'],
      },
    ],
    totalFee: 'None',
    totalTime: '5 working days, 3 hours, and 15 minutes',
    fee: 'None',
    processingTime: '5 working days, 3 hrs, 15 mins',
  },
  {
    service: 'Real Property Assessment & Tax Clearance',
    office: ASSESSOR,
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      { text: 'Fully Accomplished Application Form', source: 'From the BPLO' },
      { text: 'DTI Certificate', source: 'From the BPLO' },
      {
        text: 'Real Property Tax Receipt (latest year)',
        source: 'Municipal Treasurer',
      },
      { text: 'Tax Declaration (1 photocopy)', source: 'Municipal Treasurer' },
      { text: 'Barangay Clearance', source: 'From the Punong Barangay' },
      { text: 'Barangay Zoning Clearance', source: 'From the Punong Barangay' },
    ],
    steps: [
      {
        clientStep:
          'Submit the required documents and wait for the request to be evaluated.',
        agencyAction: 'Interview and review of the presented documents.',
        fee: 'None',
        time: '5 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction:
          'The Tax Mapper checks the location of the property on the tax map.',
        fee: 'None',
        time: '5 minutes',
        responsible: ['Tax Mapper'],
      },
      {
        agencyAction: 'The Clerk processes and records the transaction.',
        fee: 'None',
        time: '10 minutes',
        responsible: ['Assessment Clerk'],
      },
      {
        agencyAction:
          'The Municipal Assessor approves and signs the Real Property Clearance Certificate for Business.',
        fee: 'None',
        time: '10 minutes',
        responsible: ['Municipal Assessor'],
      },
    ],
    totalFee: 'None',
    totalTime: '30 minutes',
    fee: 'None',
    processingTime: '30 minutes',
  },
  {
    service:
      'Verification of History of Real Property Tax Assessments or Tax Declaration',
    office: ASSESSOR,
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      {
        text: 'Certified True Copy of Title (1 copy)',
        source: 'From the Owner',
      },
      { text: 'Related Reference Documents', source: 'From the Owner' },
    ],
    steps: [
      {
        clientStep: 'Inform any of the staff regarding the request.',
        agencyAction:
          'The Assessment Clerk verifies and researches the history of the real property.',
        fee: 'None',
        time: '40 minutes',
        responsible: ['Assessment Clerk', 'Tax Mapper'],
      },
      {
        agencyAction:
          'The Assessment Clerk presents the history of the real property to the client.',
        fee: 'None',
        time: '5 minutes',
        responsible: ['Assessment Clerk', 'Tax Mapper'],
      },
      {
        agencyAction:
          "Recording of the Tax Declaration; issuance of a machine copy from the Municipal Assessor's Office.",
        fee: '₱50.00 (photocopied documents)',
        time: '15 minutes',
        responsible: ['Assessment Clerk'],
      },
    ],
    totalFee: '₱50.00',
    totalTime: '1 hour',
    fee: '₱50.00',
    processingTime: '1 hour',
  },
  {
    service: 'Verification of Property Location and Vicinity',
    office: ASSESSOR,
    official: true,
    legalBasis: 'RA 7160; RA 11032',
    requirements: [
      {
        text: 'One (1) photocopy of any of: Tax Declaration, Sketch Plan, or Land Title',
        source: 'From the Owner',
      },
    ],
    steps: [
      {
        clientStep: 'Inform any of the staff regarding the request.',
        agencyAction:
          'The Tax Mapper verifies and researches the location of the property on the tax map.',
        fee: 'None',
        time: '10 minutes',
        responsible: ['Tax Mapper', 'Draftsman'],
      },
      {
        agencyAction:
          'The Tax Mapper presents the vicinity of the property to the client.',
        fee: 'None',
        time: '5 minutes',
        responsible: ['Tax Mapper'],
      },
      {
        agencyAction:
          "Issuance of a copy of the Property Location from the Municipal Assessor's Office.",
        fee: '₱200.00',
        time: '15 minutes',
        responsible: ['Assessment Clerk', 'Tax Mapper'],
      },
    ],
    totalFee: '₱200.00',
    totalTime: '30 minutes',
    fee: '₱200.00',
    processingTime: '30 minutes',
  },
];

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
