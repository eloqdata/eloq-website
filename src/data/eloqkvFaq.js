const eloqkvProductFaqItems = [
  {
    question: 'What is EloqKV?',
    answer:
      'EloqKV is a Redis-compatible key-value database for large datasets that are too costly to keep entirely in DRAM. It uses NVMe-backed storage with optional persistence.',
    linkLabel: 'Read the EloqKV docs',
    linkPath: '/eloqkv/introduction',
  },
  {
    question: 'How does EloqKV reduce Redis infrastructure cost?',
    answer:
      'Redis cost scales with memory and replicas. EloqKV serves large datasets from NVMe and object storage, so capacity planning starts from total dataset size and HA needs.',
    linkLabel: 'See the cost breakdown',
    linkPath: '/post/redis-vs-eloqkv-cost-breakdown-at-scale',
  },
  {
    question: 'How does EloqKV use NVMe without high tail latency?',
    answer:
      'EloqKV combines NVMe-aware storage with asynchronous execution to keep P99.99 latency below 5 milliseconds, measured on a 2TB dataset at 100K QPS. Results depend on hardware, key size, access pattern, peak QPS, and durability settings.',
    linkLabel: 'Review the latency benchmark',
    linkPath: '/blog/2026/01/08/eloqkv-on-eloqstore',
  },
  {
    question: 'Does EloqKV require durable persistence for every workload?',
    answer:
      'No. Run cache-style, or enable WAL-backed persistence when recovery is required.',
    linkLabel: 'Learn about durability',
    linkPath: '/blog/2024/08/25/benchmark-txlog',
  },
  {
    question: 'Is EloqKV a drop-in Redis or Valkey replacement?',
    answer:
      'EloqKV is Redis and Valkey compatible, but teams should validate commands, cluster behavior, latency, and operations before migration.',
    linkLabel: 'Check command compatibility',
    linkPath: '/eloqkv/kvstore_compatibility',
  },
  {
    question: 'How do teams migrate from Redis to EloqKV?',
    answer:
      'Mirror data, validate reads and commands, then move writes after the target deployment is caught up and monitored.',
    linkLabel: 'Read the migration guide',
    linkPath: '/blog/2026/04/22/redis-migrate-to-eloqkv',
  },
];

module.exports = {
  eloqkvProductFaqItems,
};
