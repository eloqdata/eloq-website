import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: '0',
    description:
      'The first free-tier database built for production workloads, not just testing.',
    features: [
      '1 project',
      '10 GB storage',
      'Unlimited compute hours',
      'Up to 10K read QPS',
      'Up to 1K write QPS',
      '10 GB data transfer',
      'Scale to zero',
    ],
    cta: 'Start for free',
    ctaLink: 'https://cloud.eloqdata.com',
  },
  launch: {
    name: 'Business',
    price: '19',
    priceLabel: 'From',
    description:
      'High-performance database services for growing teams and real-time applications.',
    features: [
      '100 projects',
      '50 GB storage',
      '180 compute hours',
      '50 GB data transfer',
      'Up to 4CU',
    ],
    cta: 'Get started',
    ctaLink: '/contact',
  },
  large: {
    name: 'Enterprise',
    price: '999',
    priceLabel: 'From',
    description:
      'Enterprise-grade database with Private Link, advanced security, compliance, and custom SLAs.',
    features: [
      '1000 projects',
      '1 TB storage',
      '4000 compute hours',
      'Unlimited data transfer',
      'Up to 32CU',
    ],
    cta: 'Get started',
    ctaLink: '/contact',
  },
};

export default function Pricing() {
  const [tooltipVisible, setTooltipVisible] = useState({});

  const showTooltip = index => {
    setTooltipVisible({...tooltipVisible, [index]: true});
  };

  const hideTooltip = index => {
    setTooltipVisible({...tooltipVisible, [index]: false});
  };

  return (
    <Layout
      title="EloqCloud for EloqKV Pricing"
      description="Pricing plans that grow with you. From prototype to Enterprise.">
      <main className={styles.pricingPage}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>EloqKV Pricing</h1>
            <p className={styles.heroSubtitle}>
              Pricing plans that grow with you. From prototype to Enterprise.
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
                      return (
                        <li key={index} className={styles.feature}>
                          {feature}
                          {feature.toLowerCase().includes('compute hours') &&
                            feature.toLowerCase() !==
                              'unlimited compute hours' && (
                              <div className={styles.tooltipContainer}>
                                <span
                                  className={styles.infoIcon}
                                  onMouseEnter={() => showTooltip(tooltipId)}
                                  onMouseLeave={() => hideTooltip(tooltipId)}>
                                  i
                                </span>
                                {tooltipVisible[tooltipId] && (
                                  <div className={styles.tooltip}>
                                    Additional at $0.15 per compute hour
                                  </div>
                                )}
                              </div>
                            )}
                          {feature.toLowerCase().includes('50 gb storage') && (
                            <div className={styles.tooltipContainer}>
                              <span
                                className={styles.infoIcon}
                                onMouseEnter={() =>
                                  showTooltip(`storage-${tooltipId}`)
                                }
                                onMouseLeave={() =>
                                  hideTooltip(`storage-${tooltipId}`)
                                }>
                                i
                              </span>
                              {tooltipVisible[`storage-${tooltipId}`] && (
                                <div className={styles.tooltip}>
                                  Additional at $0.5 per GB
                                </div>
                              )}
                            </div>
                          )}
                          {feature.toLowerCase().includes('1 tb storage') && (
                            <div className={styles.tooltipContainer}>
                              <span
                                className={styles.infoIcon}
                                onMouseEnter={() =>
                                  showTooltip(`storage-${tooltipId}`)
                                }
                                onMouseLeave={() =>
                                  hideTooltip(`storage-${tooltipId}`)
                                }>
                                i
                              </span>
                              {tooltipVisible[`storage-${tooltipId}`] && (
                                <div className={styles.tooltip}>
                                  Additional at $0.25 per GB
                                </div>
                              )}
                            </div>
                          )}
                          {feature
                            .toLowerCase()
                            .includes('50 gb data transfer') && (
                            <div className={styles.tooltipContainer}>
                              <span
                                className={styles.infoIcon}
                                onMouseEnter={() =>
                                  showTooltip(`storage-${tooltipId}`)
                                }
                                onMouseLeave={() =>
                                  hideTooltip(`storage-${tooltipId}`)
                                }>
                                i
                              </span>
                              {tooltipVisible[`storage-${tooltipId}`] && (
                                <div className={styles.tooltip}>
                                  Additional usage charged at cloud provider’s
                                  network rates.
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <div className={styles.planFooter}>
                    {plan.name === 'Free' ? (
                      <Link
                        to="https://www.eloqdata.com"
                        className={`button button--lg ${styles.planButton}`}>
                        {plan.cta}
                      </Link>
                    ) : (
                      <div
                        className={`button button--lg ${styles.planButton} ${styles.planButtonDisabled}`}
                        title="Coming soon">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.enterpriseSection}>
              <h2 className={styles.enterpriseTitle}>
                Custom Enterprise Plans
              </h2>
              <p className={styles.enterpriseDescription}>
                Connect with our team for higher resource limits, dedicated
                requirements, annual contracts, and more.
              </p>
              <Link
                to="/contact"
                className={`button button--lg ${styles.enterpriseButton}`}>
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
