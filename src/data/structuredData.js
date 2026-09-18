const {SITE_URL, seo} = require('./seo');
const {eloqkvProductFaqItems} = require('./eloqkvFaq');

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const organization = {
  '@id': ORGANIZATION_ID,
  '@type': 'Organization',
  name: 'EloqData',
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo-og.png`,
};

function absoluteUrl(pathname = '/') {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

function normalizePath(pathname = '/') {
  const pathOnly = pathname.split(/[?#]/)[0] || '/';
  if (pathOnly === '/') {
    return '/';
  }
  return pathOnly.replace(/\/+$/, '');
}

function withContext(schema) {
  return {
    '@context': 'https://schema.org',
    ...schema,
  };
}

function breadcrumbList(pathname, items) {
  return withContext({
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(pathname)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

const eloqkvSoftwareApplication = withContext({
  '@type': 'SoftwareApplication',
  '@id': `${absoluteUrl('/product/eloqkv')}#software`,
  name: 'EloqKV',
  description: seo.eloqkvProduct.description,
  url: absoluteUrl('/product/eloqkv'),
  image: absoluteUrl('/img/EloqKV-banner.png'),
  applicationCategory: 'DatabaseApplication',
  operatingSystem: 'Linux',
  dateModified: '2026-06-09',
  publisher: organization,
  creator: organization,
  codeRepository: 'https://github.com/eloqdata/eloqkv',
  softwareHelp: {
    '@type': 'CreativeWork',
    url: absoluteUrl('/eloqkv/introduction'),
  },
  sameAs: ['https://github.com/eloqdata/eloqkv'],
});

const costComparisonFaq = withContext({
  '@type': 'FAQPage',
  '@id': `${absoluteUrl(
    '/post/redis-vs-eloqkv-cost-breakdown-at-scale'
  )}#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why does Redis become expensive at scale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Redis generally requires the dataset to fit in memory. High availability often adds replicas, which can mean paying for additional full in-memory copies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EloqKV cheaper than Amazon ElastiCache or Valkey?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'For large datasets it usually is. ElastiCache bills per cache node and per replica, so a multi-terabyte working set with high availability is dominated by DRAM-priced node hours, and Valkey only narrows that by roughly 20% versus the Redis OSS engine. EloqKV serves the same working set from NVMe at stable latency, using memory only as a cache. The exact savings depend on dataset size, latency target, and whether you use reserved pricing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Redis persistence reduce memory cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'No. Redis persistence helps protect data, but it does not remove the need to provision enough memory for the active dataset and replicas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EloqKV a drop-in Redis replacement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'EloqKV is designed for Redis API compatibility, which can reduce migration effort. Teams should still validate command coverage, latency, data model fit, and operational requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is EloqKV most cost-efficient versus Redis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'EloqKV is strongest when a large working set would be expensive to keep entirely in DRAM. Because NVMe serves hot access at stable, predictable latency — even for random reads — the savings apply whether access is concentrated on a few keys or spread across the whole keyspace. Examples include shopping carts, customer profiles, personalization stores, session data, and flash-sale workloads.',
      },
    },
  ],
});

const eloqkvProductFaq = withContext({
  '@type': 'FAQPage',
  '@id': `${absoluteUrl('/product/eloqkv')}#faq`,
  mainEntity: eloqkvProductFaqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

const benchmarkFaq = withContext({
  '@type': 'FAQPage',
  '@id': `${absoluteUrl('/blog/2026/01/08/eloqkv-on-eloqstore')}#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does EloqKV keep P99.99 latency low on SSD?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          "EloqStore keeps every index's non-leaf nodes in DRAM, so each read is a single, direct NVMe access (one IOP) with no LSM-style level checks. It pairs this with coroutines and io_uring asynchronous I/O, and its append-only design avoids the compaction stalls that spike tail latency on other SSD stores. The result is a P99.99 of a few milliseconds even at 2TB.",
      },
    },
    {
      '@type': 'Question',
      name: 'What exactly were the benchmark conditions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A single GCP Z3-16 node (16 vCore, 128GB RAM, 2 × 2.9TB NVMe), 1–4KB values, datasets from 20GB to 2TB, read/write mixes of 95:5, 50:50, and 5:95, measured with memtier_benchmark and the write-ahead log disabled (cache mode). See the Benchmark conditions section for the full table.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do these results require turning off durability?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'These specific numbers were measured in cache mode (WAL off) to isolate serving latency. EloqKV also supports WAL-backed durable persistence; that mode is benchmarked separately in ACID in EloqKV: Durability.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much can EloqKV save versus Redis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'In this 2TB test, EloqKV replaces a roughly 20-node Redis cluster with a single NVMe node. Real savings depend on your data size, hot working set, replicas, and durability requirements — estimate yours with the cost calculator.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EloqKV a drop-in Redis replacement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'EloqKV is Redis- and Valkey-compatible, which keeps migration effort low, but teams should validate command coverage, cluster behavior, persistence settings, and latency SLOs before cutover. The migration guide walks through this.',
      },
    },
  ],
});

const migrationFaq = withContext({
  '@type': 'FAQPage',
  '@id': `${absoluteUrl('/blog/2026/04/22/redis-migrate-to-eloqkv')}#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is there downtime during the migration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'No. RedisShake mirrors your data into EloqKV with a full sync followed by continuous incremental sync, so reads and writes keep serving from Redis until you choose to divert them. The only brief pause is the final write cutover in Stage 3.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which Redis commands and data types are not supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'EloqKV targets core key-value and common structures, not STREAM, GEO, or HYPERLOGLOG, which the sample shake.toml blocks from sync. Check your command and type usage against the command compatibility reference before migrating.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do my existing Redis clients still work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Most Redis and Valkey clients work without changes because EloqKV is wire-compatible. Confirm your specific driver and cluster-mode behavior against the client compatibility reference.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I validate latency before moving writes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Define a latency SLO such as a P99 GET target, divert read traffic to EloqKV in Stage 2, and monitor P99 and P99.99 under real load before cutover. The benchmark article shows reference tail-latency numbers on NVMe.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I roll back if something goes wrong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Until the Stage 3 write cutover, Redis remains the source of truth, so rolling back is simply leaving reads and writes on Redis. Keep Redis running until EloqKV has served production write traffic and met your SLOs, then decommission it.',
      },
    },
  ],
});

const routeStructuredData = {
  '/': [
    withContext(organization),
    withContext({
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'EloqData',
      url: SITE_URL,
      description: seo.home.description,
      inLanguage: 'en',
      publisher: {'@id': ORGANIZATION_ID},
    }),
  ],
  '/product/eloqkv': [
    eloqkvSoftwareApplication,
    breadcrumbList('/product/eloqkv', [
      {name: 'Home', path: '/'},
      {name: 'EloqKV', path: '/product/eloqkv'},
    ]),
    eloqkvProductFaq,
  ],
  '/product-comparison': [
    breadcrumbList('/product-comparison', [
      {name: 'Home', path: '/'},
      {name: 'Product Comparison', path: '/product-comparison'},
    ]),
  ],
  '/post/redis-vs-eloqkv-cost-breakdown-at-scale': [
    breadcrumbList('/post/redis-vs-eloqkv-cost-breakdown-at-scale', [
      {name: 'Home', path: '/'},
      {name: 'Articles', path: '/post'},
      {
        name: 'Redis vs EloqKV Cost Comparison: NVMe Economics at Scale',
        path: '/post/redis-vs-eloqkv-cost-breakdown-at-scale',
      },
    ]),
    costComparisonFaq,
  ],
  '/blog/2024/08/17/benchmark-single-node': [
    breadcrumbList('/blog/2024/08/17/benchmark-single-node', [
      {name: 'Home', path: '/'},
      {name: 'Blog', path: '/blog'},
      {name: 'EloqKV as Memory Cache', path: '/blog/2024/08/17/benchmark-single-node'},
    ]),
  ],
  '/blog/2024/08/22/benchmark-cluster': [
    breadcrumbList('/blog/2024/08/22/benchmark-cluster', [
      {name: 'Home', path: '/'},
      {name: 'Blog', path: '/blog'},
      {name: 'EloqKV Clustering', path: '/blog/2024/08/22/benchmark-cluster'},
    ]),
  ],
  '/blog/2024/08/25/benchmark-txlog': [
    breadcrumbList('/blog/2024/08/25/benchmark-txlog', [
      {name: 'Home', path: '/'},
      {name: 'Blog', path: '/blog'},
      {name: 'ACID in EloqKV : Durability', path: '/blog/2024/08/25/benchmark-txlog'},
    ]),
  ],
  '/blog/2024/09/01/benchmark-transaction': [
    breadcrumbList('/blog/2024/09/01/benchmark-transaction', [
      {name: 'Home', path: '/'},
      {name: 'Blog', path: '/blog'},
      {
        name: 'ACID in EloqKV : Atomic Operations',
        path: '/blog/2024/09/01/benchmark-transaction',
      },
    ]),
  ],
  '/blog/spring-eloqkv-benchmark': [
    breadcrumbList('/blog/spring-eloqkv-benchmark', [
      {name: 'Home', path: '/'},
      {name: 'Blog', path: '/blog'},
      {name: '10X Cost Reduction with Spring Data on EloqKV', path: '/blog/spring-eloqkv-benchmark'},
    ]),
  ],
  '/blog/2026/04/22/redis-migrate-to-eloqkv': [
    breadcrumbList('/blog/2026/04/22/redis-migrate-to-eloqkv', [
      {name: 'Home', path: '/'},
      {name: 'Blog', path: '/blog'},
      {
        name: 'Breaking the DRAM Barrier: A Guide to Migrating from Redis to EloqKV',
        path: '/blog/2026/04/22/redis-migrate-to-eloqkv',
      },
    ]),
    migrationFaq,
  ],
  '/blog/2026/01/08/eloqkv-on-eloqstore': [
    breadcrumbList('/blog/2026/01/08/eloqkv-on-eloqstore', [
      {name: 'Home', path: '/'},
      {name: 'Blog', path: '/blog'},
      {
        name: 'EloqKV on EloqStore Benchmark',
        path: '/blog/2026/01/08/eloqkv-on-eloqstore',
      },
    ]),
    benchmarkFaq,
  ],
};

function getStructuredDataForPath(pathname) {
  return routeStructuredData[normalizePath(pathname)] || [];
}

function getArticleSection(pathname = '') {
  if (pathname.startsWith('/news/')) {
    return {name: 'News', path: '/news', type: 'NewsArticle'};
  }
  if (pathname.startsWith('/post/')) {
    return {name: 'Articles', path: '/post', type: 'Article'};
  }
  return {name: 'Blog', path: '/blog', type: 'BlogPosting'};
}

// Only explicit editorial dates count as updates. Git checkout or build dates
// must never imply that the article's claims have been reviewed or refreshed.
function editorialDate(value) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function getArticleBreadcrumbs(metadata) {
  const section = getArticleSection(metadata.permalink);
  return breadcrumbList(metadata.permalink, [
    {name: 'Home', path: '/'},
    {name: section.name, path: section.path},
    {name: metadata.title, path: metadata.permalink},
  ]);
}

function getEditorialDetails(frontMatter = {}) {
  return {
    summary: typeof frontMatter.summary === 'string' ? frontMatter.summary : '',
    takeaways: Array.isArray(frontMatter.key_takeaways)
      ? frontMatter.key_takeaways.filter(item => typeof item === 'string' && item.trim())
      : [],
    sources: Array.isArray(frontMatter.sources)
      ? frontMatter.sources.filter(source =>
          source && typeof source.title === 'string' &&
          typeof source.url === 'string' && /^https?:\/\//i.test(source.url))
      : [],
    modified: editorialDate(frontMatter.last_update?.date),
    reviewed: editorialDate(frontMatter.last_reviewed),
    reviewer: typeof frontMatter.reviewed_by === 'string' ? frontMatter.reviewed_by : '',
  };
}

function buildArticleStructuredData(baseSchema, metadata) {
  const {dateModified: _inferredDate, author: _author, ...base} = baseSchema;
  const editorial = getEditorialDetails(metadata.frontMatter);
  const authors = (metadata.authors || []).filter(author => author.name).map(author =>
    author.name === organization.name
      ? organization
      : {
          '@type': 'Person',
          name: author.name,
          ...(author.url ? {url: author.url} : {}),
          ...(author.title ? {description: author.title} : {}),
        });
  return {
    ...base,
    '@type': getArticleSection(metadata.permalink).type,
    inLanguage: 'en',
    publisher: organization,
    ...(authors.length ? {author: authors.length === 1 ? authors[0] : authors} : {}),
    ...(editorial.modified ? {dateModified: editorial.modified} : {}),
    ...(editorial.summary ? {abstract: editorial.summary} : {}),
    ...(editorial.sources.length ? {
      citation: editorial.sources.map(source => ({
        '@type': 'CreativeWork', name: source.title, url: source.url,
      })),
    } : {}),
  };
}

module.exports = {
  absoluteUrl,
  buildArticleStructuredData,
  editorialDate,
  getArticleBreadcrumbs,
  getArticleSection,
  getEditorialDetails,
  getStructuredDataForPath,
  normalizePath,
  routeStructuredData,
};
