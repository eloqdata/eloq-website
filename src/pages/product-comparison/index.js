import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const PRODUCT_COMPARISON = [
  {
    feature: 'Supported Cloud Platform',
    openSource: 'ALL',
    enterprise: 'ALL',
    cloudSaas: 'AWS',
  },
  {feature: 'On Premise Deployment', 
    openSource: true, 
    enterprise: true, 
    cloudSaas: false
  },
  {feature: 'Persistence', 
    openSource: true, 
    enterprise: true, 
    cloudSaas: true
  },
  {
    feature: 'Object Storage',
    openSource: false,
    enterprise: true,
    cloudSaas: true,
  },
  {
    feature: 'Multiple Writer',
    openSource: true,
    enterprise: true,
    cloudSaas: true,
  },
  {
    feature: 'Distributed Transaction',
    openSource: true,
    enterprise: true,
    cloudSaas: true,
  },
  {
    feature: 'WAL Multiple Replicas',
    openSource: false,
    enterprise: true,
    cloudSaas: true,
  },
  {
    feature: 'Auto Failover',
    openSource: false,
    enterprise: true,
    cloudSaas: true,
  },
  {feature: 'Hot Backup', 
    openSource: true, 
    enterprise: true, 
    cloudSaas: true,
  },
  {
    feature: 'TLS Encryption',
    openSource: true,
    enterprise: true,
    cloudSaas: true,
  },
  {feature: 'Scale-Up', 
    openSource: true, 
    enterprise: true, 
    cloudSaas: true
  },
  {feature: 'Scale-Out', 
    openSource: false, 
    enterprise: true, 
    cloudSaas: true
  },
  {
    feature: 'Community Support',
    openSource: true,
    enterprise: true,
    cloudSaas: true,
  },
  {
    feature: 'Enterprise Support',
    openSource: false,
    enterprise: true,
    cloudSaas: true,
  },
];

export default function ProductComparison() {
  return (
    <Layout
      title="Product Comparison - EloqDB Editions"
      description="Compare features across EloqDB Community, Enterprise, and Cloud editions">
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Product Comparison</h1>
            <p className={styles.heroSubtitle}>
              Compare features across EloqDB Community, Enterprise, and Cloud
              editions to find the perfect fit for your needs
            </p>
          </div>
        </div>

        {/* Product Comparison Section */}
        <div className={styles.comparisonSection}>
          <div className={styles.comparisonInner}>
            <div className={styles.comparisonTable}>
              <div className={styles.comparisonHeader}>
                <div className={styles.featureColumn}>
                  <h3>Features</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>Community Edition</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>Enterprise Edition</h3>
                </div>
                <div className={styles.comparisonColumn}>
                  <h3>Cloud Edition</h3>
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
                    {typeof item.openSource === 'boolean' ? (
                      item.openSource ? (
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
                      <span>{item.openSource}</span>
                    )}
                  </div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.enterprise === 'boolean' ? (
                      item.enterprise ? (
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
                      <span>{item.enterprise}</span>
                    )}
                  </div>
                  <div className={styles.comparisonColumn}>
                    {typeof item.cloudSaas === 'boolean' ? (
                      item.cloudSaas ? (
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
                        <div className={styles.naText}>N/A</div>
                      )
                    ) : (
                      <span>{item.cloudSaas}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className={styles.infoSection}>
          <div className={styles.infoInner}>
            <h2 className={styles.infoTitle}>Choose Your Edition</h2>
            <div className={styles.editionCards}>
              <div className={styles.editionCard}>
                <h3>Community Edition</h3>
                <p className={styles.editionDescription}>
                  Perfect for developers and small teams getting started with
                  EloqDB. Includes core features and community support.
                </p>
                <ul className={styles.editionFeatures}>
                  <li>✓ Single node deployment</li>
                  <li>✓ Basic persistence</li>
                  <li>✓ Community support</li>
                  <li>✗ Enterprise features</li>
                </ul>
                <Link
                  className={`button button--secondary ${styles.editionButton}`}
                  to="/download">
                  Get Started Free
                </Link>
              </div>

              <div className={styles.editionCard}>
                <h3>Enterprise Edition</h3>
                <p className={styles.editionDescription}>
                  Advanced features for production environments requiring high
                  availability, security, and enterprise support.
                </p>
                <ul className={styles.editionFeatures}>
                  <li>✓ All Community features</li>
                  <li>✓ High availability</li>
                  <li>✓ Auto failover</li>
                  <li>✓ Enterprise support</li>
                </ul>
                <Link
                  className={`button button--primary ${styles.editionButton}`}
                  to="/contact">
                  Contact Sales
                </Link>
              </div>

              <div className={styles.editionCard}>
                <h3>Cloud Edition</h3>
                <p className={styles.editionDescription}>
                  Fully managed cloud service with automatic scale to zero,
                  monitoring, and maintenance handled for you.
                </p>
                <ul className={styles.editionFeatures}>
                  <li>✓ All Enterprise features</li>
                  <li>✓ Fully managed</li>
                  <li>✓ Auto scaling</li>
                  <li>✓ 24/7 monitoring</li>
                </ul>
                <Link
                  className={`button button--primary ${styles.editionButton}`}
                  href="https://cloud.eloqdata.com">
                  Try Cloud Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
