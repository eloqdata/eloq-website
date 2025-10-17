import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import pcStyles from '../product-comparison/styles.module.css';

const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: '0',
    description:
      'The first free-tier database built for production workloads, not just testing with unlimited compute hours.',
    features: [
      '3 clusters',
      '25 GB storage',
      'Unlimited compute hours',
      'Up to 10K read QPS',
      'Up to 1K write QPS',
      '10 GB data transfer',
      'Scale to zero',
      'Redis/MongoDB compatible',
    ],
    cta: 'Start for free',
    ctaLink: 'https://cloud.eloqdata.com/login',
  },
  launch: {
    name: 'Business',
    price: '19',
    priceLabel: 'From',
    description:
      'High-performance database services for growing teams and real-time applications.',
    features: [
      '100 clusters',
      '50 GB storage',
      '180 compute hours',
      '50 GB data transfer',
      'Up to 8CU',
      'Scale to zero',
      'Redis/MongoDB compatible',
    ],
    cta: 'Get started',
    ctaLink: 'https://cloud.eloqdata.com/login',
  },
  large: {
    name: 'Enterprise',
    price: '999',
    priceLabel: 'From',
    description:
      'Enterprise-grade database with Private Link, advanced security, compliance, and custom SLAs.',
    features: [
      '1000 clusters',
      '1 TB storage',
      '4000 compute hours',
      'Unlimited data transfer',
      'Up to 64CU',
      'Priority support & SLAs',
      'Private network',
      'Soc2 compliance',
    ],
    cta: 'Get started',
    ctaLink: '/contact',
  },
};

// Lightweight copy of Product Comparison data
const PRODUCT_COMPARISON = [
  { feature: 'Supported Cloud Platform', openSource: 'ALL', enterprise: 'ALL', cloudSaas: 'AWS' },
  { feature: 'On Premise Deployment', openSource: true, enterprise: true, cloudSaas: false },
  { feature: 'Scale-Out', openSource: true, enterprise: true, cloudSaas: true },
  { feature: 'Scale to Zero', openSource: false, enterprise: false, cloudSaas: true },
  { feature: 'Multiple Writer', openSource: true, enterprise: true, cloudSaas: true },
  { feature: 'WAL Multiple Replicas', openSource: false, enterprise: true, cloudSaas: true },
  { feature: 'Auto Failover', openSource: false, enterprise: true, cloudSaas: true },
  { feature: 'Tiered Storage', openSource: true, enterprise: true, cloudSaas: true },
  { feature: 'Distributed Transaction', openSource: true, enterprise: true, cloudSaas: true },
  { feature: 'Hot Backup', openSource: false, enterprise: true, cloudSaas: true },
  { feature: 'TLS Encryption', openSource: true, enterprise: true, cloudSaas: true },
  { feature: 'Community Support', openSource: true, enterprise: true, cloudSaas: true },
  { feature: 'Enterprise Support', openSource: false, enterprise: true, cloudSaas: true },
];

export default function Pricing() {
  const [tooltipVisible, setTooltipVisible] = useState({});

  const showTooltip = id => {
    setTooltipVisible({ ...tooltipVisible, [id]: true });
  };

  const hideTooltip = id => {
    setTooltipVisible({ ...tooltipVisible, [id]: false });
  };

  return (
    <Layout
      title="EloqCloud Pricing"
      description="The most cost effective DBaaS, from prototype to Enterprise.">
      <main className={styles.pricingPage}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>EloqCloud Pricing</h1>
            <p className={styles.heroSubtitle}>
              The most cost effective DBaaS, from prototype to Enterprise.
            </p>
          </div>
        </div>

        <div className={styles.pricingSection}>
          <div className={styles.pricingInner}>
            <div className={styles.pricingGrid}>
              {Object.entries(PRICING_PLANS).map(([key, plan]) => (
                <div key={key} className={styles.pricingCard}>
                  <div className={styles.pricingHeader}>
                    <h3 className={styles.planName}>{plan.name}</h3>
                    <div className={styles.planPrice}>
                      {plan.priceLabel && (
                        <span className={styles.priceLabel}>
                          {plan.priceLabel}
                        </span>
                      )}
                      <span className={styles.price}>${plan.price}</span>
                      <span className={styles.period}>/month</span>
                    </div>
                    <p className={styles.planDescription}>{plan.description}</p>
                  </div>
                  <ul className={styles.featureList}>
                    {plan.features.map((feature, index) => {
                      const tooltipId = `${key}-${index}`;

                      // Determine additional pricing info and tooltip text
                      let additionalInfo = null;
                      let tooltipText = null;
                      const featureText = feature.toLowerCase();

                      if (
                        featureText.includes('compute hours') &&
                        featureText !== 'unlimited compute hours'
                      ) {
                        additionalInfo = 'then $0.14 per compute hour';
                        tooltipText = '1 compute unit = 1 vCPU, 8 GB RAM';
                      } else if (featureText.includes('50 gb storage')) {
                        additionalInfo = 'then $0.1 per GB';
                        tooltipText = 'limited-time 50% off';
                      } else if (featureText.includes('1 tb storage')) {
                        additionalInfo = 'then $0.1 per GB';
                        tooltipText = 'limited-time 50% off';
                      } else if (featureText.includes('50 gb data transfer')) {
                        additionalInfo = 'then at cloud provider rates';
                      }

                      return (
                        <li key={index} className={styles.feature}>
                          <div className={styles.featureContent}>
                            <div className={styles.featureMainLine}>
                              <span className={styles.featureText}>
                                {feature}
                              </span>
                              {tooltipText && (
                                <div className={styles.tooltipContainer}>
                                  <span
                                    className={styles.infoIcon}
                                    onMouseEnter={() => showTooltip(tooltipId)}
                                    onMouseLeave={() => hideTooltip(tooltipId)}>
                                    i
                                  </span>
                                  {tooltipVisible[tooltipId] && (
                                    <div className={styles.tooltip}>
                                      {tooltipText}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {additionalInfo && (
                              <div className={styles.additionalPricing}>
                                {additionalInfo}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className={styles.planFooter}>
                    {plan.name === 'Free' ? (
                      <Link
                        to="https://cloud.eloqdata.com/login"
                        className={`button button--lg ${styles.planButton}`}>
                        {plan.cta}
                      </Link>
                    ) : plan.name === 'Business' ? (
                      <Link
                        to={plan.ctaLink}
                        className={`button button--lg ${styles.planButton} ${styles.businessButton}`}>
                        {plan.cta}
                      </Link>
                    ) : (
                      <Link
                        to={plan.ctaLink || '/contact'}
                        className={`button button--lg ${styles.planButton} ${styles.businessButton}`}
                        title="Talk to Sales">
                        Talk to Sales
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Product Comparison (copied, with original styles) */}
            <div className={pcStyles.comparisonSection} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
              <div className={pcStyles.comparisonInner}>
                <h2 className={pcStyles.comparisonTitle}>Product Comparison</h2>
                <p className={pcStyles.comparisonSubtitle}>
                  Compare features across Open Source, Enterprise, and Cloud editions.
                </p>
                <div className={pcStyles.comparisonTable}>
                  <div className={pcStyles.comparisonHeader}>
                    <div className={pcStyles.featureColumn}>
                      <h3>Features</h3>
                    </div>
                    <div className={pcStyles.comparisonColumn}>
                      <h3>Open Source Edition</h3>
                    </div>
                    <div className={pcStyles.comparisonColumn}>
                      <h3>Enterprise Edition</h3>
                    </div>
                    <div className={pcStyles.comparisonColumn}>
                      <h3>Cloud Edition</h3>
                    </div>
                  </div>

                  {PRODUCT_COMPARISON.map((item, index) => (
                    <div
                      key={index}
                      className={`${pcStyles.comparisonRow} ${index % 2 === 0 ? pcStyles.rowEven : pcStyles.rowOdd}`}>
                      <div className={pcStyles.featureColumn}>{item.feature}</div>
                      <div className={pcStyles.comparisonColumn}>
                        {typeof item.openSource === 'boolean' ? (
                          item.openSource ? (
                            <div className={pcStyles.checkIcon}>
                              <svg viewBox="0 0 20 20" fill="currentColor" className={pcStyles.icon}>
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className={pcStyles.xIcon}>
                              <svg viewBox="0 0 20 20" fill="currentColor" className={pcStyles.icon}>
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )
                        ) : (
                          <span>{item.openSource}</span>
                        )}
                      </div>
                      <div className={pcStyles.comparisonColumn}>
                        {typeof item.enterprise === 'boolean' ? (
                          item.enterprise ? (
                            <div className={pcStyles.checkIcon}>
                              <svg viewBox="0 0 20 20" fill="currentColor" className={pcStyles.icon}>
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className={pcStyles.xIcon}>
                              <svg viewBox="0 0 20 20" fill="currentColor" className={pcStyles.icon}>
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )
                        ) : (
                          <span>{item.enterprise}</span>
                        )}
                      </div>
                      <div className={pcStyles.comparisonColumn}>
                        {typeof item.cloudSaas === 'boolean' ? (
                          item.cloudSaas ? (
                            <div className={pcStyles.checkIcon}>
                              <svg viewBox="0 0 20 20" fill="currentColor" className={pcStyles.icon}>
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className={pcStyles.naText}>N/A</div>
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
          </div>
        </div>
      </main>
    </Layout>
  );
}
