/**
 * Dynamic sitemap generator.
 * Fetches entity IDs from Supabase and generates sitemap.xml
 * with both static routes and dynamic detail page URLs.
 *
 * Usage: node scripts/generate-sitemap.js
 */

const SITE_URL = 'https://stevsant.vercel.app';
const SUPABASE_URL = 'https://veelrxhltxgdbhytjpcu.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZWxyeGhsdHhnZGJoeXRqcGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzY1ODMsImV4cCI6MjA4NTc1MjU4M30.Z5ropjAauf4R0yyLkzPaSisz1r-KY9cvlO0eGfZxGxY';

const fs = require('fs');
const path = require('path');

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/projects', changefreq: 'weekly', priority: '0.9' },
  { path: '/experience', changefreq: 'monthly', priority: '0.8' },
  { path: '/skills', changefreq: 'monthly', priority: '0.8' },
  { path: '/education', changefreq: 'monthly', priority: '0.7' },
  { path: '/competitions', changefreq: 'monthly', priority: '0.7' },
  { path: '/events', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'yearly', priority: '0.6' },
];

const DYNAMIC_TABLES = [
  { table: 'project', routePrefix: '/projects', changefreq: 'monthly', priority: '0.7' },
  { table: 'experience', routePrefix: '/experience', changefreq: 'monthly', priority: '0.7' },
  { table: 'competition', routePrefix: '/competitions', changefreq: 'monthly', priority: '0.6' },
  { table: 'event', routePrefix: '/events', changefreq: 'monthly', priority: '0.6' },
];

async function fetchIds(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    console.warn(`  Warning: Failed to fetch ${table} (${res.status})`);
    return [];
  }
  return res.json();
}

function buildUrl(loc, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  console.log('Generating sitemap...');
  const urls = [];

  // Static routes
  for (const route of STATIC_ROUTES) {
    urls.push(buildUrl(route.path, route.changefreq, route.priority));
  }

  // Dynamic routes
  for (const { table, routePrefix, changefreq, priority } of DYNAMIC_TABLES) {
    try {
      const items = await fetchIds(table);
      console.log(`  ${table}: ${items.length} entries`);
      for (const item of items) {
        urls.push(buildUrl(`${routePrefix}/${item.id}`, changefreq, priority));
      }
    } catch (err) {
      console.warn(`  Warning: Could not fetch ${table}: ${err.message}`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, sitemap, 'utf-8');
  console.log(`Sitemap generated: ${urls.length} URLs → ${outPath}`);
}

main().catch((err) => {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
});
