/**
 * News & announcements.
 *
 * Two sources are merged at runtime by the News page:
 *  1. The seed list below (edit by hand — good for LGU notices you type in).
 *  2. public/news.json — generated from the LGU Facebook page by
 *     `npm run news:fetch` (see scripts/fetch-fb-news.mjs). That script uses a
 *     Page access token kept ONLY in your local .env.local, so the token never
 *     ships to the browser. Posts refresh whenever you re-run the fetch + rebuild.
 *
 * If news.json is absent (you haven't run the fetch yet), only the seed list
 * shows — so the page always works.
 */

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  body?: string;
  /** ISO date string. */
  date: string;
  /** Short label, e.g. "Advisory", "Public Notice", "Facebook". */
  category?: string;
  /** Optional image URL. */
  image?: string;
  /** Link to the original post / source. */
  link?: string;
  source?: 'facebook' | 'lgu';
}

/**
 * Seed announcements — EDIT these to your real notices (or rely on Facebook).
 * Optional image: drop a file in public/images/news/ and point `image` to it.
 * Optional link: a Facebook post or document URL ("View original post").
 */
export const seedAnnouncements: Announcement[] = [
  {
    id: 'road-rerouting',
    title: '𝐓𝐑𝐀𝐅𝐅𝐈𝐂 𝐀𝐃𝐕𝐈𝐒𝐎𝐑𝐘 | 𝐁𝐎𝐓𝐎𝐋𝐀𝐍 𝐂𝐇𝐑𝐈𝐒𝐓𝐌𝐀𝐒 𝐋𝐈𝐆𝐇𝐓𝐈𝐍𝐆 𝐂𝐄𝐑𝐄𝐌𝐎𝐍𝐘',
    summary:
      'Bilang paghahanda sa maayos at ligtas na daloy ng trapiko sa Christmas Lighting Ceremony sa Botolan Municipal Building at pagbubukas ng PASKO HA BANOWA NIN BOTOLAN 2026, ipatutupad ang gabay sa trapiko sa Nobyembre 27, 2026 (Biyernes), mula 2:30 ng hapon hanggang 11:00 ng gabi.',
    body: 'Bilang paghahanda sa maayos at ligtas na daloy ng trapiko sa gaganaping 𝐂𝐡𝐫𝐢𝐬𝐭𝐦𝐚𝐬 𝐋𝐢𝐠𝐡𝐭𝐢𝐧𝐠 𝐂𝐞𝐫𝐞𝐦𝐨𝐧𝐲 sa ating Botolan Municipal Building at pagbubukas ng 𝐏𝐀𝐒𝐊𝐎 𝐇𝐀 𝐁𝐀𝐍𝐎𝐖𝐀 𝐍𝐈𝐍 𝐁𝐎𝐓𝐎𝐋𝐀𝐍 𝟐𝟎𝟐𝟔, ipatutupad ang sumusunod na gabay sa trapiko sa 𝗡𝗼𝗯𝘆𝗲𝗺𝗯𝗿𝗲 𝟮𝟳, 𝟮𝟬𝟮𝟲 (𝗕𝗶𝘆𝗲𝗿𝗻𝗲𝘀), 𝗺𝘂𝗹𝗮 𝟮:𝟯𝟬 𝗻𝗴 𝗵𝗮𝗽𝗼𝗻 𝗵𝗮𝗻𝗴𝗴𝗮𝗻𝗴 𝟭𝟭:𝟬𝟬 𝗻𝗴 𝗴𝗮𝗯𝗶.\n\nAng mga pribadong sasakyan, malalaking sasakyan (bus at truck), at mga ambulansyang bumibiyahe papunta at pabalik ng Olongapo at Iba ay pinapayuhang dumaan sa Tarlac Road bilang alternatibong ruta.\n\nHinihiling ang pakikiisa at pang-unawa ng lahat upang matiyak ang maayos na daloy ng trapiko at kaligtasan ng bawat isa sa pagdiriwang na ito.\n\nMaraming salamat po sa inyong kooperasyon!\n\n𝙆𝙚𝙚𝙥 𝙨𝙖𝙛𝙚, 𝙀𝙫𝙚𝙧𝙮𝙤𝙣𝙚!',
    date: '2026-11-26',
    category: 'Advisory',
    source: 'lgu',
    image: '/images/news/reroute.jpg',
    link: 'https://www.facebook.com/photo?fbid=1165125319601086&set=a.196802303100064',
  },
  {
    id: 'health-vaccination-sample',
    title: 'Free Anti-Rabies Vaccination for Pets',
    summary:
      'The Municipal Agriculture Office will conduct free anti-rabies vaccination for dogs and cats across all barangays this month.',
    body: 'The Municipal Agriculture Office, in coordination with the barangays, will conduct a FREE anti-rabies vaccination drive for dogs and cats.\n\nSchedule per barangay will be posted at your Barangay Hall. Please bring your pets on a leash or in a secure carrier. For questions, contact the Municipal Agriculture Office.',
    date: '2026-11-18',
    category: 'Public Notice',
    source: 'lgu',
    image: '/images/news/anti-rabies.jpg',
  },
  {
    id: 'event-fiesta-sample',
    title: 'Mt. Pinatubo Festival 2027 — Save the Date',
    summary:
      'Botolan celebrates the Mt. Pinatubo Festival this May. Watch for the schedule of activities, street dancing, and cultural programs.',
    body: 'Mark your calendars! The Mt. Pinatubo Festival returns this May in celebration of the resilient spirit of the Botoleños and the rich heritage of our Ayta communities.\n\nExpect street dancing, cultural presentations, trade fairs, and more. The full schedule of activities will be released soon — follow our official Facebook page for updates.',
    date: '2026-11-15',
    category: 'Event',
    source: 'lgu',
    image: '/images/news/pinatubo-festival.jpg',
    link: 'https://www.facebook.com/<lgu-page>',
  },
  {
    id: 'notice-bidding-sample',
    title: 'Invitation to Bid: Barangay Road Concreting',
    summary:
      'The Bids and Awards Committee invites interested, eligible contractors to bid for an infrastructure project. See the full notice for details.',
    body: 'The Bids and Awards Committee (BAC) of the Municipality of Botolan invites eligible contractors to participate in the public bidding for [PROJECT NAME].\n\nApproved Budget for the Contract (ABC): [AMOUNT]. Interested bidders may obtain bidding documents from the BAC Secretariat at the Municipal Hall during office hours. Schedule of activities is stated in the official notice.',
    date: '2026-11-10',
    category: 'Public Notice',
    source: 'lgu',
  },
];
