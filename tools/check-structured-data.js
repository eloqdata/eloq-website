const assert = require('node:assert/strict');

const {SITE_URL, seo} = require('../src/data/seo');
const {getStructuredDataForPath} = require('../src/data/structuredData');

function schemaTypesFor(pathname) {
  return getStructuredDataForPath(pathname).map(schema => schema['@type']);
}

function schemaFor(pathname, type) {
  return getStructuredDataForPath(pathname).find(
    schema => schema['@type'] === type
  );
}

function assertNoUnsupportedProductClaims(schema) {
  for (const unsupportedKey of ['aggregateRating', 'offers', 'review']) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(schema, unsupportedKey),
      false,
      `SoftwareApplication should not include unsupported ${unsupportedKey}`
    );
  }
}

for (const pathname of [
  '/product/eloqkv',
  '/product-comparison',
  '/post/redis-vs-eloqkv-cost-breakdown-at-scale',
  '/blog/2024/08/17/benchmark-single-node',
  '/blog/2024/08/22/benchmark-cluster',
  '/blog/2024/08/25/benchmark-txlog',
  '/blog/2024/09/01/benchmark-transaction',
  '/blog/spring-eloqkv-benchmark',
  '/blog/2026/04/22/redis-migrate-to-eloqkv',
  '/blog/2026/01/08/eloqkv-on-eloqstore',
]) {
  const schemas = getStructuredDataForPath(pathname);
  assert.ok(schemas.length > 0, `${pathname} should have route schemas`);
  for (const schema of schemas) {
    assert.equal(schema['@context'], 'https://schema.org');
    assert.doesNotThrow(() => JSON.parse(JSON.stringify(schema)));
    assert.equal(
      JSON.stringify(schema).includes('https://example.com'),
      false,
      `${pathname} schema should use production URLs`
    );
  }
}

assert.deepEqual(schemaTypesFor('/product/eloqkv'), [
  'SoftwareApplication',
  'BreadcrumbList',
  'FAQPage',
]);
assert.deepEqual(schemaTypesFor('/product/eloqkv/'), [
  'SoftwareApplication',
  'BreadcrumbList',
  'FAQPage',
]);
const productSchema = schemaFor('/product/eloqkv', 'SoftwareApplication');
assert.equal(productSchema.name, 'EloqKV');
assert.equal(productSchema.description, seo.eloqkvProduct.description);
assert.equal(productSchema.url, `${SITE_URL}/product/eloqkv`);
assert.equal(productSchema.applicationCategory, 'DatabaseApplication');
assertNoUnsupportedProductClaims(productSchema);
const productFaqSchema = schemaFor('/product/eloqkv', 'FAQPage');
assert.equal(productFaqSchema.mainEntity.length, 6);
assert.equal(
  productFaqSchema.mainEntity[0].name,
  'What is EloqKV?'
);
assert.match(
  productFaqSchema.mainEntity[0].acceptedAnswer.text,
  /Redis-compatible key-value database/
);

const comparisonBreadcrumb = schemaFor('/product-comparison', 'BreadcrumbList');
assert.equal(
  comparisonBreadcrumb.itemListElement.at(-1).item,
  `${SITE_URL}/product-comparison`
);

const costArticleTypes = schemaTypesFor(
  '/post/redis-vs-eloqkv-cost-breakdown-at-scale'
);
assert.deepEqual(costArticleTypes, ['BreadcrumbList', 'FAQPage']);
const faqSchema = schemaFor(
  '/post/redis-vs-eloqkv-cost-breakdown-at-scale',
  'FAQPage'
);
assert.equal(faqSchema.mainEntity.length, 5);
assert.equal(
  faqSchema.mainEntity[0].name,
  'Why does Redis become expensive at scale?'
);
assert.match(
  faqSchema.mainEntity[0].acceptedAnswer.text,
  /dataset to fit in memory/
);

assert.deepEqual(schemaTypesFor('/blog/2024/08/17/benchmark-single-node'), [
  'BreadcrumbList',
]);

assert.deepEqual(schemaTypesFor('/blog/2026/04/22/redis-migrate-to-eloqkv'), [
  'BreadcrumbList',
  'FAQPage',
]);
const migrationFaqSchema = schemaFor(
  '/blog/2026/04/22/redis-migrate-to-eloqkv',
  'FAQPage'
);
assert.equal(migrationFaqSchema.mainEntity.length, 5);
assert.match(migrationFaqSchema.mainEntity[0].name, /downtime/);

assert.deepEqual(schemaTypesFor('/blog/2026/01/08/eloqkv-on-eloqstore'), [
  'BreadcrumbList',
  'FAQPage',
]);
const benchmarkFaqSchema = schemaFor(
  '/blog/2026/01/08/eloqkv-on-eloqstore',
  'FAQPage'
);
assert.equal(benchmarkFaqSchema.mainEntity.length, 5);
assert.match(
  benchmarkFaqSchema.mainEntity[0].acceptedAnswer.text,
  /single direct NVMe access/
);

assert.deepEqual(getStructuredDataForPath('/contact/submitted'), []);
assert.deepEqual(getStructuredDataForPath('/unknown-route'), []);

console.log('Structured data route checks passed.');
