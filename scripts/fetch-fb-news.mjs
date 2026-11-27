#!/usr/bin/env node
/**
 * Fetch recent posts from the LGU Facebook Page via the Graph API and write them
 * to public/news.json, which the News page loads. Run this before `npm run build`
 * (or whenever you want to refresh the feed):
 *
 *   npm run news:fetch
 *
 * REQUIRED config (kept ONLY in your local .env.local — never committed, never
 * shipped to the browser):
 *
 *   FB_PAGE_ID=1234567890            # the Page's numeric ID (or its username)
 *   FB_PAGE_ACCESS_TOKEN=EAAB...     # a Page access token
 *
 * Optional:
 *   FB_NEWS_LIMIT=12                 # how many posts (default 12)
 *   FB_GRAPH_VERSION=v21.0           # Graph API version
 *
 * HOW TO GET A PAGE ACCESS TOKEN (you must be an admin of the Page):
 *   1. Create an app at https://developers.facebook.com/apps (type: Business).
 *   2. Open Graph API Explorer, select your app and your Page, and add the
 *      permissions: pages_read_engagement, pages_read_user_content.
 *   3. Generate a Page Access Token, then exchange it for a long-lived token
 *      (lasts ~60 days). Put it in .env.local as FB_PAGE_ACCESS_TOKEN.
 *   Re-run this script to refresh; long-lived tokens must be renewed ~every 60 days.
 *
 * If this script fails or you haven't set it up, the News page still works — it
 * just shows the seed announcements from src/data/announcements.ts.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load FB_* keys from .env.local if not already in the environment.
function loadEnvLocal() {
  const p = join(root, '.env.local');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (!(key in process.env)) {
      process.env[key] = rawVal.replace(/^["']|["']$/g, '');
    }
  }
}

loadEnvLocal();

const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const LIMIT = Number(process.env.FB_NEWS_LIMIT || 12);
const VERSION = process.env.FB_GRAPH_VERSION || 'v21.0';
const OUT = join(root, 'public', 'news.json');

if (!PAGE_ID || !TOKEN) {
  console.error(
    '\n[news:fetch] Missing config. Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN in .env.local.\n' +
      '            (See the header of scripts/fetch-fb-news.mjs for how to get a token.)\n'
  );
  process.exit(1);
}

function firstLine(text) {
  const line = (text || '').split('\n').find(l => l.trim()) || '';
  return line.length > 90 ? line.slice(0, 87).trimEnd() + '…' : line;
}

function truncate(text, n) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
}

const fields = 'id,message,created_time,permalink_url,full_picture';
const url =
  `https://graph.facebook.com/${VERSION}/${encodeURIComponent(PAGE_ID)}/posts` +
  `?fields=${fields}&limit=${LIMIT}&access_token=${encodeURIComponent(TOKEN)}`;

try {
  const res = await fetch(url);
  const json = await res.json();

  if (json.error) {
    console.error('\n[news:fetch] Graph API error:', json.error.message, '\n');
    process.exit(1);
  }

  const items = (json.data || [])
    .filter(p => p.message && p.message.trim())
    .map(p => ({
      id: p.id,
      title: firstLine(p.message),
      summary: truncate(p.message, 220),
      body: p.message,
      date: p.created_time,
      category: 'Facebook',
      image: p.full_picture || undefined,
      link: p.permalink_url,
      source: 'facebook',
    }));

  writeFileSync(OUT, JSON.stringify(items, null, 2) + '\n', 'utf8');
  console.log(`\n[news:fetch] Wrote ${items.length} post(s) to public/news.json\n`);
} catch (err) {
  console.error('\n[news:fetch] Failed:', err?.message || err, '\n');
  process.exit(1);
}
