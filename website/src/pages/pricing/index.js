import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started and experimenting.',
    features: ['1 GB storage', '200 compute hours', 'SKU up to 2CU'],
    cta: 'Start for free',
    ctaLink: '/signup',
  },
  launch: {
    name: 'Launch',
    price: '9.9',
    priceLabel: 'From',
    description: 'For small applications and development teams.',
    features: ['10 GB storage', '400 compute hours', 'SKU up to 4CU'],
    cta: 'Get started',
    ctaLink: '/contact',
  },
  medium: {
    name: 'Medium',
    price: '39.9',
    priceLabel: 'From',
    description: 'For growing applications with moderate workloads.',
    features: ['100 GB storage', '1000 compute hours', 'SKU up to 8CU'],
    cta: 'Get started',
    ctaLink: '/contact',
  },
  large: {
    name: 'Large',
    price: '899',
    priceLabel: 'From',
    description: 'For large-scale production applications.',
    features: ['1 TB storage', '10000 compute hours', 'SKU up to 32CU'],
    cta: 'Get started',
    ctaLink: '/contact',
  },
};

export default function Pricing() {
  return (
    <Layout
      title="EloqKV Pricing"
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
                    {plan.features.map((feature, index) => (
                      <li key={index} className={styles.feature}>
                        {feature}
                      </li>
                    ))}
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
