/**
 * Tourism attractions and things to know in Botolan.
 * Drawn from public sources (Wikipedia and news reporting).
 */
export interface Attraction {
  name: string;
  blurb: string;
  tag: string;
  icon: 'mountain' | 'church' | 'waves' | 'leaf';
  source?: { label: string; url: string };
}

export const attractions: Attraction[] = [
  {
    name: 'Mount Pinatubo Crater Lake',
    tag: 'Nature · Trekking',
    icon: 'mountain',
    blurb:
      "Mount Pinatubo's summit crater lake lies within Botolan's territory, near where Zambales, Pampanga and Tarlac meet. Once feared for its 1991 eruption, the turquoise crater lake is now one of Luzon's most striking trek destinations.",
    source: {
      label: 'Wikipedia: Zambales',
      url: 'https://en.wikipedia.org/wiki/Zambales',
    },
  },
  {
    name: 'Ina Poon Bato Shrine',
    tag: 'Faith · Heritage',
    icon: 'church',
    blurb:
      'The shrine of Ina Poon Bato (“Mother on the Rock”), one of the oldest Marian devotions in the country, draws pilgrims from across Luzon. After the 1991 eruption the devotion was moved to the Loob-Bunga resettlement.',
    source: {
      label: 'Wikipedia: Botolan',
      url: 'https://en.wikipedia.org/wiki/Botolan',
    },
  },
  {
    name: 'Botolan Coastline & Beaches',
    tag: 'Nature · Coast',
    icon: 'waves',
    blurb:
      'Botolan has a long West Zambales coastline of grey volcanic-sand beaches. Olive ridley, green and hawksbill sea turtles nest here between September and January.',
    source: {
      label: 'Wikipedia: Botolan',
      url: 'https://en.wikipedia.org/wiki/Botolan',
    },
  },
  {
    name: 'Baytan Ancestral Lands',
    tag: 'Culture · Aeta',
    icon: 'leaf',
    blurb:
      "The upland villages known as Baytan are the ancestral home of Botolan's Aeta communities. Since the late 1990s many families have returned to farm these lands at the foot of Pinatubo.",
    source: {
      label: 'Inquirer: Pinatubo Aetas',
      url: 'https://newsinfo.inquirer.net/1445387/pinatubo-aetas-still-far-from-home',
    },
  },
];
