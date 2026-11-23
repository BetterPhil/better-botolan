/**
 * Standard municipal offices of Botolan. The office LIST is the standard set
 * of LGU departments; the HEAD of each is "To be confirmed" until supplied by
 * the Municipal Hall. Fill in `head` (and optional `contact`) as you verify.
 */
export interface Department {
  name: string;
  abbr: string;
  head?: string;
  contact?: string;
}

export const departments: Department[] = [
  {
    name: 'Office of the Mayor',
    abbr: 'Mayor',
    head: 'Hon. Jun Omar C. Ebdane',
  },
  {
    name: 'Office of the Vice Mayor / Sangguniang Bayan',
    abbr: 'SB',
    head: 'Hon. Atty. Edmund Dante D. Perez',
  },
  { name: 'Municipal Administrator', abbr: 'Admin' },
  { name: "Municipal Treasurer's Office", abbr: 'MTO' },
  { name: "Municipal Assessor's Office", abbr: 'Assessor' },
  { name: "Municipal Accountant's Office", abbr: 'Accountant' },
  { name: 'Municipal Budget Office', abbr: 'Budget' },
  { name: 'Municipal Planning and Development Office', abbr: 'MPDO' },
  { name: 'Municipal Engineering Office', abbr: 'MEO' },
  { name: 'Business Permits and Licensing Office', abbr: 'BPLO' },
  { name: 'Municipal Health Office / Rural Health Unit', abbr: 'MHO' },
  { name: 'Municipal Social Welfare and Development Office', abbr: 'MSWDO' },
  { name: 'Municipal Agriculture Office', abbr: 'MAO' },
  { name: 'Municipal Environment and Natural Resources Office', abbr: 'MENRO' },
  {
    name: 'Municipal Disaster Risk Reduction and Management Office',
    abbr: 'MDRRMO',
  },
  { name: 'Office of the Municipal Civil Registrar', abbr: 'MCR' },
  { name: 'Public Employment Service Office', abbr: 'PESO' },
  { name: 'Office of Senior Citizens Affairs', abbr: 'OSCA' },
  { name: 'Persons with Disability Affairs Office', abbr: 'PDAO' },
];
