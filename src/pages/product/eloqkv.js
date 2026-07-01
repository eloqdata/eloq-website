import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import seoData from '@site/src/data/seo';
import {eloqkvProductFaqItems} from '@site/src/data/eloqkvFaq';
import StructuredData from '@site/src/components/StructuredData';
import structuredData from '@site/src/data/structuredData';
import {ELOQCLOUD_STAY_TUNED_PATH} from '@site/src/constants/eloqcloud';
import styles from './styles.module.css';

const {seo, SITE_URL, DEFAULT_OG_IMAGE} = seoData;
const {getStructuredDataForPath} = structuredData;

const PAGE_PATH = '/product/eloqkv';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const GITHUB_URL = 'https://github.com/eloqdata/eloqkv';
const CLOUD_SIGNUP_URL = ELOQCLOUD_STAY_TUNED_PATH;
const OG_IMAGE_ALT =
  'EloqKV — Redis-compatible key-value database on NVMe-backed storage';
const GETSTARTED_URL = '/eloqkv/docker-deploy';
const BENCHMARK_URL = '/blog/2026/01/08/eloqkv-on-eloqstore';
const COMMANDS_URL = '/eloqkv/kvstore_compatibility';
const TRANSACTIONS_URL = '/eloqkv/transaction/MULTI';
const MIGRATION_URL = '/blog/2026/04/22/redis-migrate-to-eloqkv';
const LATENCY_CHART = '/img/eloqkv-vs-kvrocks-p9999.png';
const LAST_UPDATED = 'June 2026';
const GITHUB_REPO = 'eloqdata/eloqkv';
// Baseline shown before the live count loads (and to crawlers / on API failure).
const GITHUB_STARS_FALLBACK = 1490; // checked June 2026

const CUSTOMER_LOGOS = [
  {src: '/img/logo/placeholder-logo-1.svg', alt: 'Bitrue'},
  {src: '/img/logo/placeholder-logo-2.svg', alt: 'Shopee'},
  {src: '/img/logo/placeholder-logo-3.svg', alt: 'Transsion'},
  {src: '/img/logo/placeholder-logo-4.svg', alt: 'Memobase'},
  {src: '/img/logo/placeholder-logo-5.svg', alt: 'IGG'},
  {src: '/img/logo/placeholder-logo-6.svg', alt: 'Pine'},
  {src: '/img/logo/placeholder-logo-7.svg', alt: 'INKE'},
  {src: '/img/logo/placeholder-logo-8.svg', alt: 'FlickBloom'},
];

const VALUE_POINTS = [
  'Datasets beyond RAM',
  'Redis/Valkey compatible',
  'Stable P99.99 latency',
];

// Deterministic bar field for the hero "data stream" visual (SSR-safe).
const STREAM_BARS = [
  {tone: 'Dim', h: 30, dur: 4.4, delay: 0.2},
  {tone: 'Soft', h: 52, dur: 3.6, delay: 1.1},
  {tone: 'Dim', h: 22, dur: 5.2, delay: 0.6},
  {tone: 'Orange', h: 64, dur: 3.2, delay: 0},
  {tone: 'Dim', h: 40, dur: 4.8, delay: 1.7},
  {tone: 'Teal', h: 48, dur: 3.9, delay: 0.9},
  {tone: 'Dim', h: 26, dur: 4.2, delay: 2.2},
  {tone: 'Soft', h: 70, dur: 3.4, delay: 0.4},
  {tone: 'Dim', h: 34, dur: 5.6, delay: 1.3},
  {tone: 'Orange', h: 82, dur: 2.9, delay: 0.7},
  {tone: 'Dim', h: 46, dur: 4.6, delay: 0.1},
  {tone: 'Soft', h: 58, dur: 3.8, delay: 1.9},
  {tone: 'Dim', h: 24, dur: 5.0, delay: 0.8},
  {tone: 'Teal', h: 38, dur: 4.1, delay: 1.5},
  {tone: 'Dim', h: 62, dur: 3.5, delay: 0.3},
  {tone: 'Orange', h: 50, dur: 3.1, delay: 1.0},
  {tone: 'Dim', h: 30, dur: 4.9, delay: 2.0},
  {tone: 'Soft', h: 74, dur: 3.3, delay: 0.5},
  {tone: 'Dim', h: 42, dur: 5.4, delay: 1.2},
  {tone: 'Dim', h: 20, dur: 4.3, delay: 0},
  {tone: 'Orange', h: 68, dur: 2.8, delay: 1.6},
  {tone: 'Soft', h: 36, dur: 3.7, delay: 0.9},
  {tone: 'Dim', h: 56, dur: 4.7, delay: 2.3},
  {tone: 'Teal', h: 28, dur: 4.0, delay: 0.2},
  {tone: 'Dim', h: 48, dur: 5.1, delay: 1.4},
  {tone: 'Soft', h: 60, dur: 3.6, delay: 0.6},
];

function HeroStream() {
  return (
    <div className={styles.eloqkvHeroStream}>
      {STREAM_BARS.map((bar, index) => (
        <span
          key={index}
          className={`${styles.eloqkvStreamBar} ${
            styles[`eloqkvStreamBar${bar.tone}`]
          }`}
          style={{
            '--bar-h': `${bar.h}%`,
            '--bar-dur': `${bar.dur}s`,
            '--bar-delay': `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Renders the final value on the server so SEO/no-JS readers see real numbers,
// then counts up from zero once mounted.
function CountUp({to, suffix = '', format, duration = 1400}) {
  const formatValue = React.useCallback(
    value => (format ? format(value) : String(value)),
    [format]
  );
  const [display, setDisplay] = React.useState(() => formatValue(to));

  React.useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(formatValue(Math.round(to * eased)));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, formatValue]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

function formatStarCount(count) {
  return count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
    : String(count);
}

function useGitHubStars(repo, fallback) {
  const [stars, setStars] = React.useState(fallback);
  React.useEffect(() => {
    const cacheKey = `gh-stars:${repo}`;
    try {
      const cached = JSON.parse(window.localStorage.getItem(cacheKey));
      if (cached && Date.now() - cached.at < 24 * 60 * 60 * 1000) {
        setStars(cached.count);
        return;
      }
    } catch (err) {
      // ignore unreadable cache
    }
    fetch(`https://api.github.com/repos/${repo}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
          try {
            window.localStorage.setItem(
              cacheKey,
              JSON.stringify({count: data.stargazers_count, at: Date.now()})
            );
          } catch (err) {
            // ignore quota/storage errors
          }
        }
      })
      .catch(() => {});
  }, [repo]);
  return stars;
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8z" />
    </svg>
  );
}

// Scroll-triggered reveals for [data-reveal] elements. Elements stay visible
// without JS; we only hide-and-reveal once we know we can animate them.
function useScrollReveal(rootRef) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }
    const targets = Array.from(root.querySelectorAll('[data-reveal]')).filter(
      el => el.getBoundingClientRect().top > window.innerHeight * 0.85
    );
    // Stagger siblings revealed from the same container.
    const groups = new Map();
    targets.forEach(el => {
      const siblings = groups.get(el.parentElement) || [];
      siblings.push(el);
      groups.set(el.parentElement, siblings);
    });
    groups.forEach(siblings => {
      siblings.forEach((el, index) => {
        el.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
      });
    });
    targets.forEach(el => el.classList.add(styles.eloqkvRevealPrep));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.eloqkvRevealOn);
            entry.target.classList.remove(styles.eloqkvRevealPrep);
            observer.unobserve(entry.target);
          }
        });
      },
      {rootMargin: '0px 0px -10% 0px', threshold: 0}
    );
    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef]);
}

const HERO_METRICS = [
  {
    value: '50x+',
    countTo: 50,
    countSuffix: 'x+',
    label: 'lower infra cost (1TB example)',
  },
  {
    value: '<5ms',
    label: 'P99.99 latency on NVMe',
  },
  {
    value: 'Redis/Valkey',
    label: 'compatible API',
  },
];

const FIT_ITEMS = [
  {
    title: 'Best fit',
    body:
      'Large Redis-style datasets where DRAM, replicas, and shards dominate cost.',
  },
  {
    title: 'Common uses',
    body:
      'Session stores, user profiles, shopping carts, feature stores, and leaderboards — where the dataset dwarfs the hot working set.',
  },
];

const HOURS_PER_MONTH = 730;
const ELOQKV_I4I_2XLARGE_RESERVED_HOURLY = 0.445;
const ELOQKV_NODE_COUNT = 2;
const ELOQKV_MONTHLY_ESTIMATE =
  ELOQKV_NODE_COUNT *
  ELOQKV_I4I_2XLARGE_RESERVED_HOURLY *
  HOURS_PER_MONTH;
const ELASTICACHE_R7G_4XLARGE_HOURLY = 1.745;
const ELASTICACHE_R7G_4XLARGE_MEMORY_GIB = 105.81;
const ELASTICACHE_USABLE_MEMORY_RATIO = 0.75;
const ELASTICACHE_DATASET_GIB = 1024;
const ELASTICACHE_REPLICA_FACTOR = 2;
const ELASTICACHE_USABLE_MEMORY_GIB =
  ELASTICACHE_R7G_4XLARGE_MEMORY_GIB * ELASTICACHE_USABLE_MEMORY_RATIO;
const ELASTICACHE_SHARD_COUNT = Math.ceil(
  ELASTICACHE_DATASET_GIB / ELASTICACHE_USABLE_MEMORY_GIB
);
const ELASTICACHE_NODE_COUNT =
  ELASTICACHE_SHARD_COUNT * ELASTICACHE_REPLICA_FACTOR;
const ELASTICACHE_MONTHLY_COST =
  ELASTICACHE_NODE_COUNT *
  ELASTICACHE_R7G_4XLARGE_HOURLY *
  HOURS_PER_MONTH;
const REDIS_CLOUD_PRO_SHARD_COUNT = 82;
const REDIS_CLOUD_PRO_SHARD_HOURLY = 0.585;
const REDIS_CLOUD_PRO_HOURLY =
  REDIS_CLOUD_PRO_SHARD_COUNT * REDIS_CLOUD_PRO_SHARD_HOURLY;
const REDIS_CLOUD_PRO_MONTHLY_COST =
  REDIS_CLOUD_PRO_HOURLY * HOURS_PER_MONTH;
const MAX_COMPARISON_MONTHLY_COST = Math.max(
  ELASTICACHE_MONTHLY_COST,
  REDIS_CLOUD_PRO_MONTHLY_COST
);

function formatMonthlyCost(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

const COST_COMPARISON_ROWS = [
  {
    provider: 'EloqKV',
    monthlyCost: `${formatMonthlyCost(ELOQKV_MONTHLY_ESTIMATE)}/mo`,
    relativeCost: '1x baseline',
    dataPlacement: '2 x i4i.2xlarge, each with 8 vCPU and 1 x 1875 NVMe SSD',
    barSize: `${Math.round(
      (ELOQKV_MONTHLY_ESTIMATE / MAX_COMPARISON_MONTHLY_COST) * 100
    )}%`,
    featured: true,
  },
  {
    provider: 'ElastiCache for Redis OSS',
    monthlyCost: `${formatMonthlyCost(ELASTICACHE_MONTHLY_COST)}/mo`,
    relativeCost: `${(ELASTICACHE_MONTHLY_COST / ELOQKV_MONTHLY_ESTIMATE).toFixed(
      1
    )}x vs EloqKV`,
    dataPlacement: `${ELASTICACHE_NODE_COUNT} x cache.r7g.4xlarge (${ELASTICACHE_SHARD_COUNT} shards x primary+replica)`,
    barSize: `${Math.round(
      (ELASTICACHE_MONTHLY_COST / MAX_COMPARISON_MONTHLY_COST) * 100
    )}%`,
  },
  {
    provider: 'Redis Cloud Pro',
    monthlyCost: `${formatMonthlyCost(REDIS_CLOUD_PRO_MONTHLY_COST)}/mo`,
    relativeCost: `${(
      REDIS_CLOUD_PRO_MONTHLY_COST / ELOQKV_MONTHLY_ESTIMATE
    ).toFixed(1)}x vs EloqKV`,
    dataPlacement:
      'Official Redis calculator estimate: 82 x Large shards for 2TB effective HA memory',
    barSize: '100%',
  },
];

const LATENCY_STATS = [
  {value: '<5ms', label: 'P99.99 at 2TB on NVMe'},
  {value: '1 IOP', label: 'per read — no LSM levels'},
  {value: '2TB', label: 'stable on a single node'},
];

const TX_CARDS = [
  {
    title: 'Distributed ACID',
    body:
      'Cross-shard MULTI/EXEC with consistent reads and writes — not just single-key atomics.',
  },
  {
    title: 'Ditch the Duo',
    body:
      'Retire the MySQL + Redis combo and its cache-invalidation logic. One system is the source of truth and serves it at cache speed.',
  },
  {
    title: 'Durability optional',
    body:
      'Run cache-style for raw speed, or enable WAL-backed recovery when the workload needs durable state.',
  },
];

const COMPARE_COLUMNS = [
  {name: 'EloqKV', caption: 'Redis API on NVMe', featured: true},
  {name: 'In-memory cache', caption: 'Redis · Valkey · ElastiCache'},
  {name: 'SSD / tiered KV', caption: 'e.g. KVRocks'},
];

const COMPARE_ROWS = [
  {
    label: 'Serves datasets beyond RAM',
    cells: [{mark: 'yes'}, {mark: 'no', note: 'capped by DRAM'}, {mark: 'yes'}],
  },
  {
    label: 'P99.99 below 5ms under load',
    cells: [
      {mark: 'yes', note: 'non-LSM engine'},
      {mark: 'yes', note: 'all-DRAM'},
      {mark: 'no', note: 'LSM compaction jitter'},
    ],
  },
  {
    label: 'Distributed ACID transactions',
    cells: [
      {mark: 'yes', note: 'cross-shard MULTI/EXEC'},
      {mark: 'no', note: 'single-shard only'},
      {mark: 'no', note: 'limited'},
    ],
  },
  {
    label: 'Infra cost, 1TB + HA',
    cells: [
      {text: `1× · ${formatMonthlyCost(ELOQKV_MONTHLY_ESTIMATE)}/mo`},
      {
        text: `~${Math.round(
          ELASTICACHE_MONTHLY_COST / ELOQKV_MONTHLY_ESTIMATE
        )}×`,
      },
      {text: 'Lower DRAM', note: 'but unstable tail'},
    ],
  },
  {
    label: 'Redis / Valkey wire API',
    cells: [{mark: 'yes'}, {mark: 'yes'}, {mark: 'yes'}],
  },
];

function PageMetadata() {
  return (
    <Head>
      <link rel="canonical" href={PAGE_URL} />
      <meta property="og:title" content={seo.eloqkvProduct.ogTitle} />
      <meta property="og:description" content={seo.eloqkvProduct.ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:title" content={seo.eloqkvProduct.ogTitle} />
      <meta name="twitter:description" content={seo.eloqkvProduct.ogDescription} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
    </Head>
  );
}

function Hero() {
  const stars = useGitHubStars(GITHUB_REPO, GITHUB_STARS_FALLBACK);
  return (
    <section className={styles.eloqkvHero}>
      <div className={styles.eloqkvHeroBackdrop} aria-hidden="true">
        <HeroStream />
      </div>
      <div className={styles.eloqkvHeroInner}>
        <div className={styles.eloqkvHeroCopy}>
          <p className={styles.eloqkvEyebrow}>EloqKV</p>
          <h1 className={styles.eloqkvHeroTitle}>
            Scale Redis-Compatible Data Without Scaling DRAM
          </h1>
          <p className={styles.eloqkvHeroSubtitle}>
            EloqKV uses NVMe-backed storage to keep large datasets fast at much
            lower cost.
          </p>
          <div className={styles.eloqkvHeroButtons}>
            <Link className={styles.eloqkvPrimaryButton} to="/costsaving">
              Calculate Redis Savings
            </Link>
            <Link className={styles.eloqkvSecondaryButton} href={GITHUB_URL}>
              View GitHub
              <span className={styles.eloqkvStarBadge}>
                <StarIcon />
                {formatStarCount(stars)}
              </span>
            </Link>
            <Link className={styles.eloqkvTertiaryButton} to="/contact">
              Talk to Us
            </Link>
          </div>
          <div
            className={styles.eloqkvHeroMetricRail}
            aria-label="EloqKV headline proof points">
            {HERO_METRICS.map(metric => (
              <div key={metric.value} className={styles.eloqkvHeroMetric}>
                <span>
                  {metric.countTo ? (
                    <CountUp to={metric.countTo} suffix={metric.countSuffix} />
                  ) : (
                    metric.value
                  )}
                </span>
                <p>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
        <HeroCostLedger />
      </div>
    </section>
  );
}

function HeroCostLedger() {
  return (
    <aside className={styles.eloqkvHeroLedger} aria-label="Cost example">
      <div className={styles.eloqkvHeroLedgerHeader}>
        <p>1TB / 100K QPS / HA</p>
        <strong>
          <CountUp
            to={ELOQKV_MONTHLY_ESTIMATE}
            format={formatMonthlyCost}
            suffix="/mo"
          />
        </strong>
        <span>P99.99 under 5ms</span>
      </div>
      <div className={styles.eloqkvHeroLedgerRows}>
        {COST_COMPARISON_ROWS.slice(0, 2).map(row => (
          <div
            key={row.provider}
            className={
              row.featured
                ? styles.eloqkvHeroLedgerRowFeatured
                : styles.eloqkvHeroLedgerRow
            }>
            <span>{row.provider}</span>
            <strong>{row.monthlyCost}</strong>
            <em>{row.relativeCost}</em>
          </div>
        ))}
      </div>
      <p className={styles.eloqkvHeroLedgerNote}>
        EloqKV uses EC2 Reserved pricing. Full breakdown below.
      </p>
    </aside>
  );
}

function LogoStrip() {
  return (
    <section
      className={styles.eloqkvLogoStrip}
      aria-label="Companies using EloqData">
      <div className={styles.eloqkvLogoStripInner} data-reveal>
        <p>Trusted by teams running data at scale</p>
        <div className={styles.eloqkvLogoRow}>
          {CUSTOMER_LOGOS.map(logo => (
            <img key={logo.alt} src={logo.src} alt={logo.alt} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}

function DefinitionAndFit() {
  return (
    <section className={styles.eloqkvDefinitionSection}>
      <div className={styles.eloqkvDefinitionInner}>
        <div className={styles.eloqkvDefinitionLead} data-reveal>
          <p className={styles.eloqkvEyebrow}>What is EloqKV?</p>
          <h2 className={styles.eloqkvSectionTitle}>
            A Redis-compatible database for large stateful workloads
          </h2>
        </div>
        <div className={styles.eloqkvDefinitionBody} data-reveal>
          <p className={styles.eloqkvDefinitionText}>
            EloqKV is a Redis- and Valkey-compatible database that serves
            datasets far larger than RAM — at cache speed, with full ACID
            transactions.
          </p>
          <div className={styles.eloqkvValueStripInline}>
            {VALUE_POINTS.map(point => (
              <span key={point}>{point}</span>
            ))}
          </div>
          <div className={styles.eloqkvFitGrid}>
            {FIT_ITEMS.map(item => (
              <article key={item.title} className={styles.eloqkvFitItem}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CostComparisonTable() {
  return (
    <div className={styles.eloqkvCostComparisonCard} data-reveal>
      <div className={styles.eloqkvCostComparisonHeader}>
        <div>
          <h3>1TB Redis-style workload at 100K QPS</h3>
        </div>
      </div>
      <div className={styles.eloqkvCostTableWrap}>
        <table className={styles.eloqkvCostTable}>
          <thead>
            <tr>
              <th scope="col">Option</th>
              <th scope="col">Monthly infrastructure</th>
              <th scope="col">Relative cost</th>
              <th scope="col">Data placement</th>
            </tr>
          </thead>
          <tbody>
            {COST_COMPARISON_ROWS.map(row => (
              <tr
                key={row.provider}
                className={row.featured ? styles.eloqkvCostTableFeatured : ''}>
                <th scope="row">{row.provider}</th>
                <td>
                  <strong>{row.monthlyCost}</strong>
                  {row.barSize && (
                    <span className={styles.eloqkvCostTableBar}>
                      <span
                        className={styles.eloqkvCostTableBarValue}
                        style={{'--bar-size': row.barSize}}
                      />
                    </span>
                  )}
                </td>
                <td>{row.relativeCost}</td>
                <td>{row.dataPlacement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.eloqkvCostTableNote}>
        Assumptions: 1TB logical dataset, 100K QPS, P99.99-under-5ms latency
        target, HA included, us-east-1, and 730 hours/month. EloqKV uses EC2
        1-year Standard Reserved, No Upfront pricing. Excludes transfer,
        snapshots, support, and discounts. Pricing reviewed {LAST_UPDATED}.{' '}
        <Link to="/costsaving">Calculate savings for your workload.</Link>
      </p>
    </div>
  );
}

function CostFocus() {
  return (
    <section className={styles.eloqkvCostFocusSection}>
      <div className={styles.eloqkvCostFocusInner}>
        <div className={styles.eloqkvCostFocusCopy} data-reveal>
          <p className={styles.eloqkvEyebrow}>DRAM to NVMe economics</p>
          <h2 className={styles.eloqkvSectionTitle}>
            The cost changes when capacity leaves DRAM
          </h2>
          <p className={styles.eloqkvCostTakeaway}>
            In the 1TB / 100K QPS / HA example below, EloqKV runs at about{' '}
            {formatMonthlyCost(ELOQKV_MONTHLY_ESTIMATE)}/mo versus about{' '}
            {formatMonthlyCost(ELASTICACHE_MONTHLY_COST)}/mo on ElastiCache —
            more than 50× lower infrastructure cost.
          </p>
          <div className={styles.eloqkvInlineLinks}>
            <Link to="/post/redis-vs-eloqkv-cost-breakdown-at-scale">
              Read cost breakdown
            </Link>
          </div>
        </div>
        <CostComparisonTable />
      </div>
    </section>
  );
}

function TailLatency() {
  return (
    <section className={styles.eloqkvLatencySection}>
      <div className={styles.eloqkvLatencyInner}>
        <div className={styles.eloqkvLatencyCopy} data-reveal>
          <p className={styles.eloqkvEyebrow}>Predictable tail latency</p>
          <h2 className={styles.eloqkvSectionTitle}>
            P99.99 under 5ms on NVMe
          </h2>
          <p className={styles.eloqkvLatencyText}>
            The tail-latency spikes that break other SSD-backed caches come from
            LSM compaction stalls and write amplification. EloqKV&apos;s storage
            engine drops the LSM design entirely — one disk access per read, no
            background
            compaction — so P99.99 stays flat. A 2TB dataset holds P99.99
            under 5ms on a single NVMe node, work that would otherwise need a
            ~20-node all-RAM Redis cluster.
          </p>
          <div className={styles.eloqkvLatencyStats}>
            {LATENCY_STATS.map(stat => (
              <div key={stat.value} className={styles.eloqkvLatencyStat}>
                <span>{stat.value}</span>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
          <div className={styles.eloqkvInlineLinks}>
            <Link to={BENCHMARK_URL}>Review the latency benchmark</Link>
          </div>
        </div>
        <figure className={styles.eloqkvLatencyFigure} data-reveal>
          <img
            className={styles.eloqkvLatencyChart}
            src={LATENCY_CHART}
            width="2540"
            height="1680"
            loading="lazy"
            alt="EloqKV vs KVRocks P99.99 latency on a 2TB on-disk dataset at 100K QPS: EloqKV stays under about 3ms across read/write ratios while KVRocks spikes to tens of milliseconds."
          />
          <figcaption>
            P99.99 latency, 2TB on disk, 100K QPS. EloqKV stays flat; the
            LSM-based store spikes more than 20×.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Transactions() {
  return (
    <section className={styles.eloqkvTxSection}>
      <div className={styles.eloqkvTxInner}>
        <div className={styles.eloqkvTxLead} data-reveal>
          <p className={styles.eloqkvEyebrow}>Beyond cache</p>
          <h2 className={styles.eloqkvSectionTitle}>
            A transactional database behind a Redis API
          </h2>
          <p className={styles.eloqkvTxText}>
            EloqKV is full ACID with distributed transactions, so it covers
            workloads a cache cannot — without giving up the Redis interface.
          </p>
        </div>
        <div className={styles.eloqkvTxGrid}>
          {TX_CARDS.map(card => (
            <article key={card.title} className={styles.eloqkvTxCard} data-reveal>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <div className={styles.eloqkvCompatLine} data-reveal>
          <p>
            <strong>Redis &amp; Valkey wire-compatible.</strong> Point your
            existing clients, libraries, and tooling at EloqKV unchanged.
          </p>
          <div className={styles.eloqkvInlineLinks}>
            <Link to={COMMANDS_URL}>Supported commands</Link>
            <Link to={TRANSACTIONS_URL}>Explore transactions</Link>
            <Link to={MIGRATION_URL}>Migration guide</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section className={styles.eloqkvCompareSection}>
      <div className={styles.eloqkvCompareInner}>
        <div className={styles.eloqkvSectionHeader} data-reveal>
          <p className={styles.eloqkvEyebrow}>How it compares</p>
          <h2 className={styles.eloqkvSectionTitle}>
            Every Redis alternative trades something away
          </h2>
          <p className={styles.eloqkvCompareSubtitle}>
            EloqKV&apos;s goal is to trade nothing — capacity, tail latency, and
            transactions at once.
          </p>
        </div>
        <div className={styles.eloqkvCompareWrap} data-reveal>
          <table className={styles.eloqkvCompareTable}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={styles.eloqkvCompareSrOnly}>Capability</span>
                </th>
                {COMPARE_COLUMNS.map(col => (
                  <th
                    key={col.name}
                    scope="col"
                    className={
                      col.featured ? styles.eloqkvCompareColFeatured : undefined
                    }>
                    <strong>{col.name}</strong>
                    <span>{col.caption}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(row => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.cells.map((cell, index) => (
                    <td
                      key={COMPARE_COLUMNS[index].name}
                      className={
                        COMPARE_COLUMNS[index].featured
                          ? styles.eloqkvCompareCellFeatured
                          : undefined
                      }>
                      {cell.mark ? (
                        <span
                          className={
                            cell.mark === 'yes'
                              ? styles.eloqkvCompareYes
                              : styles.eloqkvCompareNo
                          }
                          role="img"
                          aria-label={cell.mark === 'yes' ? 'Yes' : 'No'}>
                          {cell.mark === 'yes' ? '✓' : '✗'}
                        </span>
                      ) : (
                        <span className={styles.eloqkvCompareValue}>
                          {cell.text}
                        </span>
                      )}
                      {cell.note && <em>{cell.note}</em>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.eloqkvCompareFootnote}>
          P99.99 vs KVRocks measured on a 2TB on-disk dataset at 100K QPS.{' '}
          <Link to={BENCHMARK_URL}>See the benchmark.</Link>
        </p>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className={styles.eloqkvFaqSection}>
      <div className={styles.eloqkvSectionHeader} data-reveal>
        <p className={styles.eloqkvEyebrow}>FAQ</p>
        <h2 className={styles.eloqkvSectionTitle}>
          Common Redis migration questions
        </h2>
      </div>
      <div className={styles.eloqkvFaqGrid}>
        {eloqkvProductFaqItems.map((item, index) => (
          <article
            key={item.question}
            data-reveal
            className={`${styles.eloqkvFaqItem} ${
              index === 0 ? styles.eloqkvFaqItemFeatured : ''
            }`}>
            <h3>{item.question}</h3>
            <p>
              {item.answer}{' '}
              <Link to={item.linkPath}>{item.linkLabel}</Link>.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={styles.eloqkvFinalCta}>
      <div className={styles.eloqkvFinalCtaInner} data-reveal>
        <div>
          <p className={styles.eloqkvEyebrow}>Evaluate EloqKV</p>
          <h2 className={styles.eloqkvSectionTitle}>
            Evaluate EloqKV for memory-bound Redis workloads
          </h2>
        </div>
        <div className={styles.eloqkvHeroButtons}>
          <Link className={styles.eloqkvPrimaryButton} to="/costsaving">
            Calculate Redis Savings
          </Link>
          <Link className={styles.eloqkvSecondaryButton} to={GETSTARTED_URL}>
            Get Started
          </Link>
          <Link className={styles.eloqkvTertiaryButton} to={CLOUD_SIGNUP_URL}>
            Try EloqCloud
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function EloqKV() {
  const mainRef = React.useRef(null);
  useScrollReveal(mainRef);
  return (
    <Layout
      title={seo.eloqkvProduct.title}
      description={seo.eloqkvProduct.description}>
      <PageMetadata />
      <StructuredData schemas={getStructuredDataForPath(PAGE_PATH)} />
      <main ref={mainRef} className={styles.eloqkvPage}>
        <Hero />
        <LogoStrip />
        <DefinitionAndFit />
        <CostFocus />
        <TailLatency />
        <Transactions />
        <Comparison />
        <FaqSection />
        <FinalCta />
      </main>
    </Layout>
  );
}
