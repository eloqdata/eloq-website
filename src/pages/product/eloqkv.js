import React, {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import seoData from '@site/src/data/seo';
import StructuredData from '@site/src/components/StructuredData';
import structuredData from '@site/src/data/structuredData';
import styles from './styles.module.css';
import {CheckIcon, XIcon, InfoIcon} from '@heroicons/react/solid';

const {seo} = seoData;
const {getStructuredDataForPath} = structuredData;

const WORKLOAD_PRICES = {
  small: {
    eloqkv: 10.5,
    redis: 220,
    elasticache: 120,
    description: 'Based on workload of 10GB with 1M OPs per day, 90% idle time',
  },
  medium: {
    eloqkv: 42.5,
    redis: 1700,
    elasticache: 1200,
    description: 'Based on workload of 100GB with 100K peak QPS, 50% idle time',
  },
  large: {
    eloqkv: 1025,
    redis: 17000,
    elasticache: 3630,
    description: 'Based on workload of 1TB (100GB hot) with 1M peak QPS',
  },
};

const SHOW_TESTIMONIALS = false; // Set to true to show the testimonials section

const testimonials = [
  {
    quote:
      'EloqKV enables us to develop faster than ever before, while its tiered storage significantly reduces costs',
    name: 'Rocky Shi',
    title: 'Director of Engineering',
    company: 'Transsion',
  },
  {
    quote:
      'EloqKV provides us with a unified caching solution for hybrid cloud environments, making it a perfect fit for our business',
    name: 'Jack Wang',
    title: 'DBA Manager',
    company: 'Inke',
  },
  {
    quote:
      'We are a startup in need of a database that is both easy to use and scalable. EloqKV seamlessly integrates caching and database capabilities into a single solution',
    name: 'Liang Liang',
    title: 'Developer',
    company: 'SeeCube',
  },
];

const PRODUCT_COMPARISON = [
  {
    feature: 'In-Memory Cache with Redis API',
    eloqkv: true,
    redis: true,
    dragonfly: true,
    upstash: true,
  },
  {
    feature: 'Work as Durable Primary Storage',
    eloqkv: true,
    redis: false,
    dragonfly: false,
    upstash: true,
  },
  {
    feature: 'Distributed Transaction',
    eloqkv: true,
    redis: false,
    dragonfly: false,
    upstash: false,
  },
  {
    feature: 'Tiered Storage',
    eloqkv: true,
    redis: false,
    dragonfly: true,
    upstash: true,
  },
  {
    feature: 'Scale Out',
    eloqkv: 'Native Multi Master',
    redis: 'Sharding Based',
    dragonfly: 'Sharding Based',
    upstash: 'Can Only Scale Out Read',
  },
  {
    feature: 'Scale Up',
    eloqkv: true,
    redis: 'Single Worker Thread',
    dragonfly: true,
    upstash: 'Single Worker Thread',
  },
  {
    feature: 'Distributed Lua',
    eloqkv: true,
    redis: false,
    dragonfly: false,
    upstash: false,
  },
  {
    feature: 'Session Style Transaction',
    eloqkv: true,
    redis: false,
    dragonfly: false,
    upstash: false,
  },
  {
    feature: 'Open Source',
    eloqkv: true,
    redis: 'Complicated',
    dragonfly: 'Source Available: BSL',
    upstash: false,
  },
];

export default function EloqKV() {
  const [workload, setWorkload] = useState('small');
  const [isAutoSwitching, setIsAutoSwitching] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (!isAutoSwitching) return;

    const workloadTypes = Object.keys(WORKLOAD_PRICES);
    const interval = setInterval(() => {
      setWorkload(current => {
        const currentIndex = workloadTypes.indexOf(current);
        const nextIndex = (currentIndex + 1) % workloadTypes.length;
        return workloadTypes[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoSwitching]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when testimonial is in center
      threshold: 0,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setActiveTestimonial(index);
        }
      });
    }, options);

    // Observe all testimonial items
    document
      .querySelectorAll(`.${styles.testimonialItem}`)
      .forEach((el, index) => {
        el.dataset.index = index;
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = size => {
    setIsAutoSwitching(false);
    setWorkload(size);
  };

  return (
    <Layout
      title={seo.eloqkvProduct.title}
      description={seo.eloqkvProduct.description}>
      <StructuredData schemas={getStructuredDataForPath('/product/eloqkv')} />
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>EloqKV</h1>
            <h1 className={styles.heroTitleSecondary}>
              Redis API, Database Power
            </h1>
            <p className={styles.heroSubtitle}>
              The Redis-API Compatible Distributed Database for Production, High
              Performance, Cost Effective and Full ACID Transactions
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={`button button--primary button--lg ${styles.heroButton}`}
                href="https://cloud.eloqdata.com/signup"
                style={{
                  background: 'linear-gradient(120deg, #ff7b2d, #ff9f4a)',
                  border: 'none',
                }}>
                Get Started
              </Link>
              <Link
                className={`button button--secondary button--lg ${styles.heroButton}`}
                href="https://github.com/eloqdata/eloqkv"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                }}>
                Star on GitHub ⭐
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section for EloqKV */}
        <div className="section-container">
          <h2 className="section-title">EloqKV Features</h2>
          <p className="section-subtitle">
            Redis-compatible database built for durability, scalability, and
            performance
          </p>

          {/* Primary Database Section */}
          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>
                    Primary Database with Redis API
                  </h2>
                  <p className={styles.acidDescription}>
                    EloqKV is not just a cache—it's a full-fledged transactional
                    key-value database. It eliminates the need for a
                    Redis+database combo and resolves cache consistency issues.
                    By combining persistence, high availability, and full Redis
                    API compatibility, EloqKV enables developers to use Redis
                    commands in real database workloads.
                  </p>
                </div>
                <div className={styles.acidImageContainer}>
                  <img
                    src="/img/eloqkv-feature-primary.png"
                    alt="Primary Database with Redis API"
                    className={styles.acidImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tiered Storage Section */}
          <div className={styles.tieredSection}>
            <div className={styles.tieredInner}>
              <div className={styles.tieredContent}>
                <div className={styles.tieredImageContainer}>
                  <img
                    src="/img/tiered-storage.jpg"
                    alt="Tiered Storage"
                    className={styles.tieredImage}
                  />
                </div>
                <div className={styles.tieredInfo}>
                  <h2 className={styles.tieredTitle}>Tiered Storage</h2>
                  <p className={styles.tieredDescription}>
                    EloqKV automatically optimizes hot, warm, and cold data
                    across memory, SSD, and object storage. Hot data stays in
                    memory, warm data transitions to SSDs, and rarely accessed
                    data moves to object storage—cutting storage costs without
                    hurting performance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Threaded Section */}
          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>Multi-Threaded Execution</h2>
                  <p className={styles.acidDescription}>
                    EloqKV breaks Redis’s single-thread limitation and leverages
                    modern multi-core hardware. With a multi-threaded engine, it
                    can process millions of QPS on a single machine—unlocking
                    unprecedented vertical scaling.
                  </p>
                </div>
                <div className={styles.acidImageContainer}>
                  <img
                    src="/img/eloqkv-feature-multithread.png"
                    alt="Multi Threaded Execution"
                    className={styles.acidImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Truly Distributed Section */}
          <div className={styles.tieredSection}>
            <div className={styles.tieredInner}>
              <div className={styles.tieredContent}>
                <div className={styles.tieredImageContainer}>
                  <img
                    src="/img/eloqkv-feature-distributed.png"
                    alt="Truly Distributed Architecture"
                    className={styles.tieredImage}
                  />
                </div>
                <div className={styles.tieredInfo}>
                  <h2 className={styles.tieredTitle}>
                    Truly Distributed Architecture
                  </h2>
                  <p className={styles.tieredDescription}>
                    Unlike Redis Cluster which relies on smart clients and lacks
                    cross-shard capabilities, EloqKV nodes collaborate
                    internally to fetch and operate on remote keys. Cross-shard
                    transactions and Lua scripts work seamlessly—true
                    distribution, no client burden.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Transparency Section */}
          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>Client Transparency</h2>
                  <p className={styles.acidDescription}>
                    Redis Cluster requires a special client that handles
                    cluster-specific logic. EloqKV hides this complexity—your
                    application can use the same Redis client to connect to both
                    single-node and distributed deployments, with zero code
                    changes.
                  </p>
                </div>
                <div className={styles.acidImageContainer}>
                  <img
                    src="/img/eloqkv-feature-client.png"
                    alt="Client Transparency"
                    className={styles.acidImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SQL-Style Transaction Section */}
          <div className={styles.tieredSection}>
            <div className={styles.tieredInner}>
              <div className={styles.tieredContent}>
                <div className={styles.tieredImageContainer}>
                  <img
                    src="/img/eloqkv-feature-transaction.png"
                    alt="SQL Style Transaction"
                    className={styles.tieredImage}
                  />
                </div>
                <div className={styles.tieredInfo}>
                  <h2 className={styles.tieredTitle}>SQL-Style Transactions</h2>
                  <p className={styles.tieredDescription}>
                    Go beyond Redis's MULTI/EXEC limitations. EloqKV introduces
                    SQL-style transaction control, with `BEGIN`, `COMMIT`, and
                    `ROLLBACK`—making it easier to write robust,
                    rollback-capable application logic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Comparison Section */}
        <div className={styles.codeComparison}>
          <div className={styles.codeComparisonInner}>
            <div className={styles.codeBlock}>
              <h3>Redis</h3>
              <pre className={styles.codeContent}>
                <code>
                  {`MULTI
SET user:1000:balance 500
SET user:2000:balance 1500
EXEC`}
                </code>
              </pre>
            </div>
            <div className={styles.codeBlock}>
              <h3>EloqKV</h3>
              <pre className={styles.codeContent}>
                <code>
                  {`BEGIN
SET user:1000:balance 500
-- Perform Other Operations In-Between
SET user:2000:balance 1500
COMMIT`}
                </code>
              </pre>
            </div>
            <p style={{color: 'grey', fontSize: 'smaller'}}>
              *EloqKV also support MULTI/EXEC style Redis atomic transactions,
              even in distributed setting.
            </p>
          </div>
        </div>

        {/* Product Comparison Section */}
        <div className={styles.comparisonSection}>
          <div className={styles.comparisonInner}>
            <h2 className={styles.comparisonTitle}>Database Comparison</h2>
            <p className={styles.comparisonSubtitle}>
              See how EloqKV compares to Redis, DragonflyDB and Upstash
            </p>

            <div className={styles.comparisonTable}>
              <div
                className={`${styles.comparisonHeader} ${styles.comparisonHeader5}`}>
                <div className={styles.featureColumn}>
                  <h3>Features</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>EloqKV</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>Redis</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>DragonflyDB</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>Upstash</h3>
                </div>
              </div>

              {PRODUCT_COMPARISON.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.comparisonRow} ${
                    styles.comparisonRow5
                  } ${index % 2 === 0 ? styles.rowEven : styles.rowOdd}`}>
                  <div className={styles.featureColumn}>{item.feature}</div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.eloqkv === 'boolean' ? (
                      item.eloqkv ? (
                        <div className={styles.checkIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className={styles.xIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )
                    ) : (
                      <span>{item.eloqkv}</span>
                    )}
                  </div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.redis === 'boolean' ? (
                      item.redis ? (
                        <div className={styles.checkIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className={styles.xIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )
                    ) : (
                      <span>{item.redis}</span>
                    )}
                  </div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.dragonfly === 'boolean' ? (
                      item.dragonfly ? (
                        <div className={styles.checkIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className={styles.xIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )
                    ) : (
                      <span>{item.dragonfly}</span>
                    )}
                  </div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.upstash === 'boolean' ? (
                      item.upstash ? (
                        <div className={styles.checkIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className={styles.xIcon}>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={styles.icon}>
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )
                    ) : (
                      <span>{item.upstash}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.comparisonCTA}>
              <Link
                className={`button button--primary ${styles.ctaButton}`}
                to="/eloqkv/introduction">
                Learn More
              </Link>
              <Link
                className={`button button--secondary ${styles.ctaButton}`}
                href="https://github.com/eloqdata/eloqkv">
                View on GitHub
              </Link>
            </div>
          </div>
        </div>

        {/* Cost Comparison Section */}
        {SHOW_TESTIMONIALS && (
          <div className={styles.costSection}>
            <div className={styles.costInner}>
              <div className={styles.costContent}>
                <div className={styles.costCards}>
                  <div className={styles.workloadTabs}>
                    {Object.keys(WORKLOAD_PRICES).map(size => (
                      <button
                        key={size}
                        className={`${styles.workloadTab} ${
                          workload === size ? styles.workloadTabActive : ''
                        }`}
                        onClick={() => handleTabClick(size)}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className={styles.costCard}>
                    <div className={styles.costAmount}>
                      ${WORKLOAD_PRICES[workload].eloqkv}
                    </div>
                    <div className={styles.costPeriod}>/month</div>
                    <div className={styles.costProvider} data-provider="eloqkv">
                      EloqKV
                    </div>
                  </div>
                  <div className={styles.costCard}>
                    <div className={styles.costAmount}>
                      ${WORKLOAD_PRICES[workload].redis}
                    </div>
                    <div className={styles.costPeriod}>/month</div>
                    <div className={styles.costProvider}>Redis Enterprise</div>
                  </div>
                  <div className={styles.costCard}>
                    <div className={styles.costAmount}>
                      ${WORKLOAD_PRICES[workload].elasticache}
                    </div>
                    <div className={styles.costPeriod}>/month</div>
                    <div className={styles.costProvider}>ElastiCache</div>
                  </div>
                  <div className={styles.workloadDescription}>
                    {WORKLOAD_PRICES[workload].description}
                  </div>
                </div>
                <div className={styles.costInfo}>
                  <h2 className={styles.costTitle}>Cost Effective</h2>
                  <p className={styles.costDescription}>
                    EloqKV is built for efficiency, leveraging a thread-per-core
                    model for maximum performance at the best cost. With
                    Scale-to-Zero support, it eliminates idle-time expenses,
                    making it a cost-effective choice. Optimize your Redis-like
                    workloads and reduce TCO with EloqKV.
                  </p>
                  <div className={styles.costButtons}>
                    <Link
                      className={`button button--primary ${styles.costButton}`}
                      to="/contact"
                      style={{
                        background: 'linear-gradient(120deg, #ff7b2d, #ff9f4a)',
                        border: 'none',
                      }}>
                      Try Cloud Free
                    </Link>
                    <Link
                      className={`button button--secondary ${styles.costButton}`}
                      to="/pricing"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                      }}>
                      Pricing
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Industry Leaders Section */}
        {SHOW_TESTIMONIALS && (
          <div className={styles.leadersSection}>
            <div className={styles.leadersInner}>
              <h2 className={styles.leadersTitle}>
                EloqKV is loved by developers
              </h2>
              <Link to="/customers" className={styles.leadersCTA}>
                Dive into success stories →
              </Link>
              <div className={styles.leadersContent}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className={styles.testimonialGroup}>
                    <div
                      className={`${styles.logo} ${
                        activeTestimonial === index ? styles.logoActive : ''
                      }`}>
                      <span>{testimonial.company}</span>
                    </div>
                    <div
                      className={`${styles.testimonialItem} ${
                        activeTestimonial === index ? styles.active : ''
                      }`}>
                      <p className={styles.quote}>{testimonial.quote}</p>
                      <div className={styles.testimonialAuthor}>
                        <div>
                          <div className={styles.authorName}>
                            {testimonial.name}
                          </div>
                          <div className={styles.authorTitle}>
                            {testimonial.title} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community Section */}
        <div className={styles.communitySection}>
          <div className={styles.communityInner}>
            <h2 className={styles.communityTitle}>Community</h2>
            <p className={styles.communitySubtitle}>
              Let's build the next generation of AI native databases together
            </p>
            <div className={styles.communityGrid}>
              <Link to="/blog" className={styles.communityCard}>
                <div className={styles.communityIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 5v14H5V5h14zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                      fill="currentColor"
                    />
                    <path
                      d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>Blog</h3>
                <p>
                  Explore technical insights on database innovations in the AI
                  era.
                </p>
              </Link>

              <Link
                href="https://discord.gg/nmYjBkfak6"
                className={styles.communityCard}>
                <div className={styles.communityIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>Discord</h3>
                <p>
                  Join our Discord community to discuss ideas with developers.
                </p>
              </Link>

              <Link
                href="https://github.com/eloqdata/eloqkv"
                className={styles.communityCard}>
                <div className={styles.communityIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>Github</h3>
                <p>
                  Explore our open source projects on our GitHub repository.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
