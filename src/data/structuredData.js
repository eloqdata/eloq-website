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
      name: 'How does EloqKV reduce infrastructure cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'EloqKV keeps hot data in memory while using SSD and S3-compatible object storage for warmer or colder data. This reduces the amount of expensive DRAM required.',
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
          'EloqKV is strongest when total data size is much larger than the hot working set. Examples include shopping carts, customer profiles, personalization stores, session data, and flash-sale workloads.',
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

const routeStructuredData = {
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
        name: 'Redis vs EloqKV Cost Breakdown at Scale',
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
  ],
};

function getStructuredDataForPath(pathname) {
  return routeStructuredData[normalizePath(pathname)] || [];
}

module.exports = {
  absoluteUrl,
  getStructuredDataForPath,
  normalizePath,
  routeStructuredData,
};
