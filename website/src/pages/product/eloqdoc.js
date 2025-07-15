import React, {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {CheckIcon, XIcon, InfoIcon} from '@heroicons/react/solid';

const PRODUCT_COMPARISON = [
  {
    feature: 'Multi-Writer Support',
    eloqdoc: 'Native Multi Master',
    mongodb: 'Mongos Router Based',
    documentdb: 'Sharding Based',
  },
  {
    feature: 'Distributed Transaction',
    eloqdoc: 'Strong',
    mongodb: 'Weak',
    documentdb: 'Weak',
  },
  {
    feature: 'Compute-Storage Decouple',
    eloqdoc: true,
    mongodb: false,
    documentdb: true,
  },
  {
    feature: 'Main Storage',
    eloqdoc: 'Object Storage',
    mongodb: 'EBS',
    documentdb: 'EBS',
  },
  {
    feature: 'NVMe Acceleration',
    eloqdoc: true,
    mongodb: false,
    documentdb: false,
  },
  {
    feature: 'Scale-Out Speed',
    eloqdoc: 'Fast',
    mongodb: 'Slow',
    documentdb: 'Slow',
  },
  {
    feature: 'Open Source',
    eloqdoc: true,
    mongodb: 'SSPL',
    documentdb: false,
  },
];

export default function EloqDoc() {
  return (
    <Layout
      title="EloqDoc - Distributed Document Database"
      description="Fully elastic, Mongo-compatible distributed database with compute-storage separation and robust ACID transactions">
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              Next-Gen Distributed JSON Document Database
            </h1>
            <p className={styles.heroSubtitle}>
              Fully elastic, Mongo-compatible distributed database with
              compute-storage separation and robust ACID transactions
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={`button button--primary button--lg ${styles.heroButton}`}
                to="/eloqdoc/install-from-binary"
                style={{
                  background: 'linear-gradient(120deg, #ff7b2d, #ff9f4a)',
                  border: 'none',
                }}>
                Get Started
              </Link>
              <Link
                className={`button button--secondary button--lg ${styles.heroButton}`}
                href="https://github.com/eloqdata/eloqdoc"
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

        {/* Features Section */}
        <div className="section-container">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">
            Revolutionary document database features designed for the AI era
          </p>

          {/* Cost Effective Section */}
          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>Cost Effective</h2>
                  <p className={styles.acidDescription}>
                    Our intelligent tiered storage architecture automatically
                    optimizes data placement across memory, SSD, and object
                    storage based on access patterns and document age. Hot
                    documents remain in memory for instant access, warm data
                    transitions to high-performance Local SSDs, and cold data
                    moves to cost-effective object storage. This approach
                    reduces storage costs by up to 90% even with better query
                    performance.
                  </p>
                </div>
                <div className={styles.acidImageContainer}>
                  <img
                    src="/img/tiered-storage.jpg"
                    alt="Tiered Storage Architecture"
                    className={styles.acidImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fully Decoupled Section */}
          <div className={styles.tieredSection}>
            <div className={styles.tieredInner}>
              <div className={styles.tieredContent}>
                <div className={styles.tieredImageContainer}>
                  <img
                    src="/img/decoupled-architecture.png"
                    alt="Fully Decoupled Architecture"
                    className={styles.tieredImage}
                  />
                </div>
                <div className={styles.tieredInfo}>
                  <h2 className={styles.tieredTitle}>
                    Fully Decoupled Architecture
                  </h2>
                  <p className={styles.tieredDescription}>
                    EloqDoc's revolutionary architecture completely separates
                    CPU, memory, logging, and storage components, enabling
                    unprecedented flexibility and cost optimization. This
                    disaggregated design allows you to optimize each resource
                    tier for specific workload requirements, dramatically
                    reducing over-provisioning and operational costs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Manaagement         */}

          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>Simple Management</h2>
                  <p className={styles.acidDescription}>
                    EloqDoc offers high compatibility with MongoDB. But unlike
                    MongoDB's complex sharding that requires data movement and
                    rebalancing, EloqDoc achieves true elasticity without data
                    migration. Moreover, as a truely distributed database,
                    EloqDoc do not need routers such as mongos to distribute
                    requests, which means no more single point of failure.
                  </p>
                </div>
                <div className={styles.acidImageContainer}>
                  <img
                    src="/img/mongodb-comparison.png"
                    alt="MongoDB vs EloqDoc Comparison"
                    className={styles.acidImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Low Latency Distributed Transaction Section */}
          <div className={styles.tieredSection}>
            <div className={styles.tieredInner}>
              <div className={styles.tieredContent}>
                <div className={styles.tieredImageContainer}>
                  <img
                    src="/img/low-latency-transaction.png"
                    alt="Low Latency Distributed Transaction"
                    className={styles.tieredImage}
                  />
                </div>

                <div className={styles.tieredInfo}>
                  <h2 className={styles.tieredTitle}>
                    Low Latency Distributed Transaction
                  </h2>
                  <p className={styles.tieredDescription}>
                    Experience lightning-fast distributed transactions with our
                    patented 1PC protocol. Our innovative approach reduces
                    network round-trips and eliminates coordinator bottlenecks,
                    enabling complex multi-document operations across shards
                    with minimal performance impact.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
        {/* Product Comparison Section */}
        <div className={styles.comparisonSection}>
          <div className={styles.comparisonInner}>
            <h2 className={styles.comparisonTitle}>Database Comparison</h2>
            <p className={styles.comparisonSubtitle}>
              See how EloqDoc compares to MongoDB and Amazon DocumentDB
            </p>

            <div className={styles.comparisonTable}>
              <div className={styles.comparisonHeader}>
                <div className={styles.featureColumn}>
                  <h3>Features</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>EloqDoc</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>MongoDB</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>Amazon DocumentDB</h3>
                </div>
              </div>

              {PRODUCT_COMPARISON.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.comparisonRow} ${
                    index % 2 === 0 ? styles.rowEven : styles.rowOdd
                  }`}>
                  <div className={styles.featureColumn}>{item.feature}</div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.eloqdoc === 'boolean' ? (
                      item.eloqdoc ? (
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
                      <span>{item.eloqdoc}</span>
                    )}
                  </div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.mongodb === 'boolean' ? (
                      item.mongodb ? (
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
                      <span>{item.mongodb}</span>
                    )}
                  </div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.documentdb === 'boolean' ? (
                      item.documentdb ? (
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
                      <span>{item.documentdb}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.comparisonCTA}>
              <Link
                className={`button button--primary ${styles.ctaButton}`}
                to="/eloqdoc/install-from-binary">
                Learn More
              </Link>
              <Link
                className={`button button--secondary ${styles.ctaButton}`}
                href="https://github.com/eloqdata/eloqdoc">
                View on GitHub
              </Link>
            </div>
          </div>
        </div>

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
                href="https://github.com/eloqdata/eloqdoc"
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
