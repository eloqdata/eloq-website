import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {CheckIcon, XIcon, InfoIcon} from '@heroicons/react/solid';

const PRODUCT_COMPARISON = [
  {
    feature: 'Supported Cloud Platform',
    openSource: 'ALL',
    enterprise: 'ALL',
    cloudSaas: 'AWS',
  },
  {feature: 'On Premise', openSource: true, enterprise: true, cloudSaas: false},
  {feature: 'Persistence', openSource: true, enterprise: true, cloudSaas: true},
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
  {feature: 'Hot Backup', openSource: true, enterprise: true, cloudSaas: true},
  {
    feature: 'TLS Encryption',
    openSource: true,
    enterprise: true,
    cloudSaas: true,
  },
  {feature: 'Monitor', openSource: true, enterprise: true, cloudSaas: true},
  {feature: 'Scale-Up', openSource: true, enterprise: true, cloudSaas: true},
  {feature: 'Scale-Out', openSource: true, enterprise: true, cloudSaas: true},
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

export default function EloqConvergedDB() {
  return (
    <Layout
      title="EloqConvergedDB - Multi Model AI Native Database"
      description="The multi model database - Elastic at Any Scale, High Performance, Full ACID Transaction">
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Eloq ConvergedDB</h1>
            <h1 className={styles.heroTitleSecondary}>
              The All-in-One Database for AI Era
            </h1>
            <p className={styles.heroSubtitle}>
              The Multi Model AI Native Database - Using Your Favorite API,
              Cross Model Transaction, Single Database for All Your Data
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={`button button--primary button--lg ${styles.heroButton}`}
                to="/product/eloqconvergeddb"
                style={{
                  background: 'linear-gradient(120deg, #ff7b2d, #ff9f4a)',
                  border: 'none',
                }}>
                Coming Soon
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.features}>
          <div className={styles.featuresInner}>
            <h2 className={styles.featuresTitle}>Features</h2>
            <p className={styles.featuresSubtitle}>
              Discover the Power of EloqConvergedDB: Multi Model, Cross Model
              Transaction, and Simplified Management
            </p>
            <div className={styles.featureCards}>
              <div className={styles.feature}>
                <h3>Cross Model Transaction</h3>
                <p>
                  Seamlessly perform cross-model transactions - say goodbye to
                  inconsistent data across databases
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Easy to Use</h3>
                <p>Simple to deploy, simple to manage, simple to scale</p>
              </div>
              <div className={styles.feature}>
                <h3>All-in-One</h3>
                <p>
                  ConvergedDB is a single database for all your data, built for
                  the AI era
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Fully Elastic</h3>
                <p>
                  Scale compute memory, log and storage independently to match
                  workload demands
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Tiered Storage</h3>
                <p>
                  Achieve the perfect balance of speed and cost with tiered
                  storage across memory, disk, and object storage
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Familiar API</h3>
                <p>
                  Choose the API you love, from Redis, MongoDB, SQL to Vector
                </p>
              </div>
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
                href="https://github.com/eloqdata/eloqsql"
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
