#!/usr/bin/env node
// Audit the rendered site: source metadata alone does not prove crawlability.
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const {SITE_URL} = require('../src/data/seo');

const buildDir = path.resolve(process.argv.slice(2).find(arg => !arg.startsWith('--')) || 'build');
const preview = process.argv.includes('--preview');
const errors = [];
const warnings = [];
const pages = [];
const priorityPaths = new Set([
  '/', '/blog', '/news', '/post', '/product/eloqkv', '/product/eloqdoc',
  '/product/eloqsql', '/product/eloqconvergeddb', '/product-comparison',
  '/costsaving', '/aboutus', '/contact', '/download', '/downloadwhitepaper',
  '/request-paper', '/pricing',
]);
const privatePaths = ['/contact/submitted', '/request-paper/submitted', '/cloud-stay-tuned', '/status'];

function filesIn(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
  console.error('Build the website first: npm run build');
  process.exit(1);
}

const sitemapFile = path.join(buildDir, 'sitemap.xml');
const sitemap = fs.existsSync(sitemapFile)
  ? cheerio.load(fs.readFileSync(sitemapFile, 'utf8'), {xmlMode: true}) : null;
const sitemapUrls = new Set(sitemap ? sitemap('loc').map((_, el) => sitemap(el).text()).get() : []);
if (!preview && !sitemapUrls.size) errors.push('Production sitemap is missing or empty.');

for (const file of filesIn(buildDir).filter(file => file.endsWith('.html'))) {
  const relative = path.relative(buildDir, file).split(path.sep).join('/');
  const route = '/' + relative.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const noindex = $('meta[name="robots"]').toArray().some(el => /noindex/i.test($(el).attr('content') || ''));
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const isPriority = priorityPaths.has(route);
  const fail = message => errors.push(`${route}: ${message}`);
  const warn = message => warnings.push(`${route}: ${message}`);
  if (preview && !noindex) fail('Preview page must be noindex.');
  if (privatePaths.includes(route) && !noindex) fail('Utility page must be noindex.');
  if (noindex && sitemapUrls.has(canonical)) fail('Noindexed page appears in sitemap.');
  if (!preview && isPriority && noindex) fail('Public marketing page is noindexed.');
  if (!noindex && route !== '/404') {
    if (!title) fail('Missing title.');
    if (!description.trim()) (isPriority ? fail : warn)('Missing meta description.');
    if (!canonical.startsWith(SITE_URL + '/') && canonical !== SITE_URL) fail('Missing or non-production canonical URL.');
    if ($('link[rel="canonical"]').length !== 1) fail('Expected exactly one canonical URL.');
    if ($('meta[name="description"]').length > 1) fail('Duplicate descriptions.');
    if (isPriority && !sitemapUrls.has(canonical)) fail('Public marketing page is missing from sitemap.');
    if (['/blog', '/news', '/post'].includes(route) && $('h1').length !== 1) fail('Content index must have one descriptive H1.');
  }
  for (const el of $('script[type="application/ld+json"]').toArray()) {
    try { JSON.parse($(el).text()); } catch { fail('Invalid JSON-LD.'); }
  }
  pages.push({route, title, description, canonical, noindex});
}

if (!preview) {
  for (const route of priorityPaths) if (!pages.some(page => page.route === route)) errors.push(`Missing priority page: ${route}`);
  for (const url of sitemapUrls) {
    if (!url.startsWith(SITE_URL + '/') && url !== SITE_URL) errors.push(`Unexpected sitemap origin: ${url}`);
  }
  const robotsFile = path.join(buildDir, 'robots.txt');
  const robots = fs.existsSync(robotsFile) ? fs.readFileSync(robotsFile, 'utf8') : '';
  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) errors.push('robots.txt must reference the production sitemap.');
  if (/^Disallow:\s*\/$/m.test(robots)) errors.push('robots.txt blocks the entire production site.');
  for (const resource of ['llms.txt', 'content-index.json']) {
    if (!fs.existsSync(path.join(buildDir, resource))) errors.push(`Missing discovery resource: ${resource}`);
  }
}

const report = {mode: preview ? 'preview' : 'production', pageCount: pages.length, errors, warnings, pages};
fs.writeFileSync(path.join(buildDir, 'seo-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`SEO audit: ${pages.length} pages, ${errors.length} errors, ${warnings.length} warnings.`);
for (const error of errors) console.error(`ERROR ${error}`);
for (const warning of warnings.slice(0, 12)) console.warn(`WARN ${warning}`);
if (warnings.length > 12) console.warn(`See ${path.join(buildDir, 'seo-audit.json')} for all warnings.`);
if (errors.length) process.exitCode = 1;
