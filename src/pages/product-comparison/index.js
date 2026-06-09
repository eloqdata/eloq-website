import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import seoData from '@site/src/data/seo';
import StructuredData from '@site/src/components/StructuredData';
import structuredData from '@site/src/data/structuredData';
import styles from './styles.module.css';

const {seo} = seoData;
const {getStructuredDataForPath} = structuredData;

const PRODUCT_COMPARISON = [
  {
    feature: 'Supported Cloud Platform',
    openSource: 'ALL',
    enterprise: 'ALL',
    cloudSaas: 'AWS',
  },
  {
    feature: 'On Premise Deployment',
    openSource: true,
    enterprise: true,
    cloudSaas: false
  },
  {
    feature: 'Persistence',
    openSource: true,
    enterprise: true,
    cloudSaas: true
  },
  {
    feature: 'Object Storage',
    openSource: true,
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
  {
    feature: 'Hot Backup',
    openSource: false,
    enterprise: true,
    cloudSaas: true,
  },
  {
    feature: 'TLS Encryption',
    openSource: false,
    enterprise: true,
    cloudSaas: true,
  },
  {
    feature: 'Scale-Up',
    openSource: true,
    enterprise: true,
    cloudSaas: true
  },
  {
    feature: 'Scale-Out',
    openSource: true,
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
      title={seo.productComparison.title}
      description={seo.productComparison.description}>
      <StructuredData schemas={getStructuredDataForPath('/product-comparison')} />
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Product Comparison</h1>
            <p className={styles.heroSubtitle}>
              Compare features across EloqDB Open Source, Enterprise, and Cloud
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
                  <h3>Open Source Edition</h3>
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
                  className={`${styles.comparisonRow} ${index % 2 === 0 ? styles.rowEven : styles.rowOdd
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
      </main>
    </Layout>
  );
}
