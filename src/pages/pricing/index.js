import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

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
