const SITE_URL = 'https://www.eloqdata.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/img/logo-og.png`;

const seo = {
  home: {
    title: 'EloqData | Redis-Compatible Databases for NVMe Scale',
    description:
      'EloqData builds Redis-compatible and multi-model databases that move large stateful workloads from expensive DRAM to NVMe and object storage.',
  },
  eloqkvProduct: {
    title: 'EloqKV - Redis-Compatible KV for Workloads Outgrowing Redis',
    description:
      'EloqKV is a Redis-compatible key-value database that uses NVMe-backed storage to lower the cost of large memory-bound workloads.',
    ogTitle:
      'EloqKV: Redis-Compatible KV for Workloads That Outgrow Redis',
    ogDescription:
      'Scale large Redis-style datasets beyond expensive DRAM with NVMe-backed storage and optional durable persistence.',
  },
  costSaving: {
    title: 'EloqKV Cost Saving Calculator',
    description:
      'Estimate Redis infrastructure savings with EloqKV by comparing DRAM-heavy cache costs against NVMe-backed key-value storage.',
  },
  productComparison: {
    title: 'EloqData Product Edition Comparison',
    description:
      'Compare EloqData open source, enterprise, and cloud editions across persistence, object storage, scale-out, high availability, and support.',
  },
  articleIndex: {
    title: 'EloqData Articles',
    description:
      'In-depth EloqData articles on EloqKV, Redis cost comparison, NVMe storage, object storage, and distributed database architecture.',
  },
};

module.exports = {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  seo,
};
