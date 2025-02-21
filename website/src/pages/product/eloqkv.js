import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function EloqKV() {
  return (
    <Layout
      title="EloqKV - Redis Compatible Database"
      description="The Redis Compatible Database for Production - ACID Transaction, Scalable Storage & SQL Style Syntax">
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Redis's API, Database's Power</h1>
            <p className={styles.heroSubtitle}>
              The Redis Compatible Database for Production - ACID Transaction,
              Scalable Storage & SQL Style Syntax
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={`button button--primary button--lg ${styles.heroButton}`}
                to="/eloqkv/introduction"
                style={{
                  background: 'linear-gradient(120deg, #a7b5ff, #a263ff)',
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
SET user:2000:balance 1500
COMMIT`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.features}>
          <div className={styles.featuresInner}>
            <div className={styles.feature}>
              <h3>ACID Transactions</h3>
              <p>Full ACID compliance with distributed transactions support</p>
            </div>
            <div className={styles.feature}>
              <h3>Redis Compatible</h3>
              <p>Drop-in replacement for Redis with enhanced capabilities</p>
            </div>
            <div className={styles.feature}>
              <h3>Scalable Storage</h3>
              <p>Horizontal & vertical scaling with auto-tiering</p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
