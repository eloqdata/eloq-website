const SITE_URL = 'https://www.eloqdata.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/img/logo-og.png`;

const seo = {
  home: {
    title: 'EloqData | Redis-Compatible Databases for NVMe Scale',
    description:
      'EloqData builds Redis-compatible and multi-model databases that move large stateful workloads from expensive DRAM to NVMe and object storage.',
  },
  eloqkvProduct: {
    title: 'EloqKV - Redis-Compatible Database for Large Stateful Workloads',
    description:
      'EloqKV is a Redis-compatible key-value database for workloads that outgrow in-memory Redis, using NVMe and object storage for lower-cost scale.',
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
