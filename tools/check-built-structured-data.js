const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');

function schemasFromHtmlContent(html) {
  return [
    ...html.matchAll(
      /<script[^>]+type=(?:"application\/ld\+json"|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g
    ),
  ].map(match => JSON.parse(match[1]));
}

function schemasFromHtml(pathname) {
  return schemasFromHtmlContent(fs.readFileSync(pathname, 'utf8'));
}

function schemaTypes(pathname) {
  return schemasFromHtml(pathname).map(schema => schema['@type']);
}

function assertHasTypes(pathname, expectedTypes) {
  const actualTypes = schemaTypes(pathname);
  for (const expectedType of expectedTypes) {
    assert.ok(
      actualTypes.includes(expectedType),
      `${pathname} should include ${expectedType}; actual: ${actualTypes.join(', ')}`
    );
  }
}

function assertLacksTypes(pathname, blockedTypes) {
  const actualTypes = schemaTypes(pathname);
  for (const blockedType of blockedTypes) {
    assert.equal(
      actualTypes.includes(blockedType),
      false,
      `${pathname} should not include ${blockedType}`
    );
  }
}

assert.deepEqual(schemaTypes('build/product/eloqkv.html'), [
  'SoftwareApplication',
  'BreadcrumbList',
  'FAQPage',
]);
assert.deepEqual(schemaTypes('build/product-comparison.html'), [
  'BreadcrumbList',
]);

assertHasTypes('build/post/redis-vs-eloqkv-cost-breakdown-at-scale.html', [
  'Article',
  'BreadcrumbList',
  'FAQPage',
]);

for (const page of [
  'build/blog/2024/08/17/benchmark-single-node.html',
  'build/blog/2024/08/22/benchmark-cluster.html',
  'build/blog/2024/08/25/benchmark-txlog.html',
  'build/blog/2024/09/01/benchmark-transaction.html',
  'build/blog/spring-eloqkv-benchmark.html',
]) {
  assertHasTypes(page, ['BlogPosting', 'BreadcrumbList']);
  assertLacksTypes(page, ['FAQPage', 'SoftwareApplication']);
}

for (const page of [
  'build/blog/2026/04/22/redis-migrate-to-eloqkv.html',
  'build/blog/2026/01/08/eloqkv-on-eloqstore.html',
]) {
  assertHasTypes(page, ['BlogPosting', 'BreadcrumbList', 'FAQPage']);
  assertLacksTypes(page, ['SoftwareApplication']);
}

assert.deepEqual(
  schemasFromHtmlContent(`<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Thing"}
</script>`).map(schema => schema['@type']),
  ['Thing']
);

assertHasTypes('build/index.html', ['Organization', 'WebSite']);

// Check every public article, not just the routes with hand-authored FAQs.
const contentIndex = JSON.parse(fs.readFileSync('build/content-index.json', 'utf8'));
const llmsText = fs.readFileSync('build/llms.txt', 'utf8');
const sitemap = fs.readFileSync('build/sitemap.xml', 'utf8');
const articleTypes = ['Article', 'BlogPosting', 'NewsArticle'];
assert.ok(contentIndex.articles.length > 0, 'Production discovery index must contain articles');
assert.equal(new Set(contentIndex.articles.map(article => article.url)).size, contentIndex.articles.length);

function builtPath(url) {
  const pathname = decodeURIComponent(new URL(url).pathname).replace(/\/$/, '');
  if (!pathname) return 'build/index.html';
  const file = path.join('build', `${pathname}.html`);
  return fs.existsSync(file) ? file : path.join('build', pathname, 'index.html');
}

for (const article of contentIndex.articles) {
  const file = builtPath(article.url);
  const html = fs.readFileSync(file, 'utf8');
  const schemas = schemasFromHtmlContent(html);
  const $ = cheerio.load(html);
  $('script, style').remove();
  const visibleText = $('body').text().replace(/\s+/g, ' ');
  for (const faq of schemas.filter(item => item['@type'] === 'FAQPage')) {
    for (const question of faq.mainEntity) {
      assert.ok(visibleText.includes(question.name), `${article.url} FAQ question must be visible: ${question.name}`);
      assert.ok(visibleText.includes(question.acceptedAnswer.text.replace(/\s+/g, ' ')), `${article.url} FAQ answer must match visible content: ${question.name}`);
    }
  }
  const articleSchemas = schemas.filter(schema => articleTypes.includes(schema['@type']));
  assert.equal(articleSchemas.length, 1, `${article.url} needs exactly one article schema`);
  const schema = articleSchemas[0];
  assert.equal(schema['@type'], article.type);
  assert.equal(schema.url, article.url);
  assert.equal(schema.headline, article.title);
  assert.equal(new Date(schema.datePublished).toISOString(), article.datePublished);
  assert.equal(schema.dateModified, article.dateModified, 'Only explicit editorial updates set modified dates');
  assert.equal(schema.publisher.name, 'EloqData');
  const authors = Array.isArray(schema.author) ? schema.author : [schema.author];
  assert.ok(authors.length && authors.every(author => author?.name), `${article.url} needs an attributed author`);
  const image = typeof schema.image === 'string' ? schema.image : schema.image?.url;
  assert.match(image || '', /^https:\/\//, `${article.url} needs an absolute article image`);
  const breadcrumbs = schemas.filter(item => item['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumbs.length, 1, `${article.url} needs exactly one breadcrumb schema`);
  assert.equal(breadcrumbs[0].itemListElement.at(-1).item, article.url);
  assert.ok(html.includes('rel="canonical"') || html.includes('rel=canonical'), `${article.url} needs a canonical tag`);
  assert.ok(llmsText.includes(`](${article.url})`), `${article.url} must be discoverable in llms.txt`);
  assert.ok(sitemap.includes(`<loc>${article.url}</loc>`), `${article.url} must be in sitemap`);
}

for (const match of llmsText.matchAll(/\]\((https:\/\/www\.eloqdata\.com[^)]+)\)/g)) {
  const pathname = new URL(match[1]).pathname;
  const file = /\.(json|xml)$/.test(pathname) ? path.join('build', pathname) : builtPath(match[1]);
  assert.ok(fs.existsSync(file), `llms.txt links must resolve in the build: ${match[1]}`);
}

console.log('Built structured data checks passed.');
