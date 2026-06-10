const assert = require('node:assert/strict');
const fs = require('node:fs');

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
  'BlogPosting',
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

console.log('Built structured data checks passed.');
