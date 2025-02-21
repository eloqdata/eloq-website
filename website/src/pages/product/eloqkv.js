import React, {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

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

export default function EloqKV() {
  const [workload, setWorkload] = useState('small');
  const [isAutoSwitching, setIsAutoSwitching] = useState(true);

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

  const handleTabClick = size => {
    setIsAutoSwitching(false);
    setWorkload(size);
  };

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

        {/* Cost Comparison Section */}
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
      </main>
    </Layout>
  );
}
