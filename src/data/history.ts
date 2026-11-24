/**
 * The history of Botolan, Zambales.
 * Sources: Wikipedia (Botolan), and Inquirer coverage of the Ina Poon Bato feast.
 * https://en.wikipedia.org/wiki/Botolan
 *
 * Facts are kept to what these sources state. Where a date is approximate,
 * the entry says so.
 */

export interface HistoryEvent {
  year: string;
  title: string;
  body: string;
  /** A lucide icon name, resolved in the component. */
  icon:
    'mountain' | 'church' | 'flag' | 'landmark' | 'sprout' | 'waves' | 'users';
}

export const HISTORY_SOURCE = 'https://en.wikipedia.org/wiki/Botolan';

export const historyEvents: HistoryEvent[] = [
  {
    year: 'Pre-1572',
    title: 'The Aeta and the Sambal',
    body: 'Long before the Spanish arrived, the Aeta and the Sambal peoples lived across what is now Botolan. The Sambal language is still spoken here today. By tradition, the Aeta found a carved wooden image on a large rock and began to venerate it.',
    icon: 'users',
  },
  {
    year: '1572',
    title: 'A town is founded',
    body: 'Botolan was established in 1572, among the earliest towns in Zambales, during the Spanish expedition led by Juan de Salcedo. The name comes from "boto-an," a Sambal word for a place rich in a native seeded banana.',
    icon: 'landmark',
  },
  {
    year: '1607',
    title: 'The Recollects and Ina Poon Bato',
    body: 'Recollect missionaries arrived in 1607. The Aeta associated their wooden image with the Virgin Mary, and it became venerated as Ina Poon Bato — "Mother on the Rock" — one of the oldest Marian devotions in the country.',
    icon: 'church',
  },
  {
    year: '1890s',
    title: 'Revolution and the image',
    body: 'During the Philippine Revolution, Filipino revolutionaries took the sacred image from the Recollects and enshrined it in an Aglipayan (Philippine Independent) church, where a version of the devotion continues.',
    icon: 'flag',
  },
  {
    year: '1985',
    title: 'Blessed in the Vatican',
    body: 'The Catholic image of Ina Poon Bato was canonically blessed by Pope John Paul II in Vatican City in 1985, recognising a devotion that draws pilgrims from across Luzon.',
    icon: 'church',
  },
  {
    year: '1991',
    title: 'Mount Pinatubo erupts',
    body: 'The summit of Mount Pinatubo lies within Botolan. Its violent eruption in June 1991 buried the original village of Poonbato in lahar. The sacred image, found chest-deep but intact, was moved to the resettlement area of Loob-Bunga, where whole communities began again.',
    icon: 'mountain',
  },
  {
    year: 'Today',
    title: 'A town that rebuilt',
    body: 'Resettlement barangays such as Loob-Bunga and New Taugtog grew from the eruption. Botolan is now a 1st-class municipality of 31 barangays, known for its lahar landscapes, its coastline where sea turtles nest, and the yearly Fiesta Poon Bato each January.',
    icon: 'sprout',
  },
];

export interface Festival {
  name: string;
  when: string;
  about: string;
}

export const festivals: Festival[] = [
  {
    name: 'Feast of Ina Poon Bato',
    when: 'January 24',
    about:
      'The feast of Ina Poon Bato — “Apo Apang,” patroness of Botolan — celebrated every January 24 in Brgy. Poonbato. Devotees from across the country honour the miraculous image, housed atop a hill with a panoramic view.',
  },
  {
    name: 'Mt. Pinatubo Festival',
    when: 'May 4',
    about:
      "Botolan's town festival celebrating the resilient, evolving way of life of the Botoleños after Mt. Pinatubo's eruption. It showcases the cultural heritage of the Aytas and their bond with Apo Namalyari, with street dancing and local traditions.",
  },
  {
    name: 'Pasko ha Banowa',
    when: 'December',
    about:
      'Botolan’s Christmas celebration (Pasko sa Bayan), honouring the town’s traditions, vibrant community spirit, and joyful holiday heritage with lights and festivities.',
  },
  {
    name: 'Dinamulag (Mango) Festival',
    when: 'April · province-wide',
    about:
      'A Province of Zambales festival celebrating the bountiful harvest of the sweet carabao (dinamulag) mango, with Botolan joining the provincial festivities and showcasing local produce and culture.',
  },
];
