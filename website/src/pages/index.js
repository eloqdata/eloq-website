/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect} from 'react';
import GitHubButton from 'react-github-btn';
import Typed from '@theme/Typed';

import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Layout from '@theme/Layout';
import './index.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faDollarSign,
  faExpandArrowsAlt,
  faCheckCircle,
  faExchangeAlt,
  faRedoAlt,
} from '@fortawesome/free-solid-svg-icons';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const features = [
  {
    icon: faBolt,
    title: 'High Performance',
    details: [
      'Match or exceed the best-in-class solutions',
      'Blazing-fast distributed transactions powered by the 1PC protocol',
    ],
    link: 'blog/2024/08/17/benchmark-single-node',
  },
  {
    icon: faDollarSign,
    title: 'Low Cost',
    details: [
      'Achieve the perfect balance of speed and cost with tiered storage across memory, local disk, and object storage',
    ],
    link: 'blog/2024/08/16/eloqkv#performance-and-cost',
  },
  {
    icon: faExpandArrowsAlt,
    title: 'Scalable and Elastic',
    details: [
      'Scale-up with multicore, and scale-out to multiple nodes in a cluster',
      'Support dynamic scaling as workload changes, without service disruption',
    ],
    link: 'blog/2024/08/16/eloqkv#scale-as-you-need-on-what-you-need',
  },
  {
    icon: faExchangeAlt,
    title: 'Fully ACID',
    details: [
      'Fuly ACID Transaction with configurable isolation level',
      'Support cross-model transactions from multiple APIs',
    ],
    link: 'blog/2024/08/16/eloqkv#full-acid-transactions-when-you-need-them',
  },
  {
    icon: faCheckCircle,
    title: 'Highly Available',
    details: [
      'Replicate data to multiple servers to provide fault-tolerance',
      'Support hot standbys so that failure can be recovered in sub-seconds',
    ],
    link: 'eloqkv/quick-start-ha',
  },
  {
    icon: faRedoAlt,
    title: 'Standard API',
    details: [
      'EloqDB supports standard APIs, including Redis, SQL, and Mongo',
      'Enable seamless migration of existing applications with minimal effort',
    ],
    link: 'eloqkv/kvstore_compatibility',
  },
];

function HomePage() {
  return (
    <Layout
      description="Build the Next Generation of Databases the Right Way"
      wrapperClassName="homepage">
      <main>
        <div className="container1">
          <div className="product-columns">
            <div className="product-left-column">
              <h1 className="title">
                Revolutionary Databases Powering the AI Age
              </h1>
              <p className="tagline">
                Databases for all your AI app needs—multimodal, transactional,
                elastic and standard API-compatible{' '}
              </p>

              {/* Add product shortcuts */}
              <div className="product-shortcuts-container">
                <div className="product-shortcuts">
                  {/* EloqKV */}
                  <div className="product-shortcut-wrapper">
                    <Link to="/product/eloqkv" className="product-shortcut">
                      <div className="shortcut-icon redis">
                        <img
                          src={useBaseUrl('img/EloqKV-icon.svg')}
                          alt="EloqKV"
                          width="32"
                          height="32"
                        />
                      </div>
                      <span className="product-name">
                        EloqKV
                        <a
                          href="https://github.com/eloqdata/eloqkv"
                          className="github-superscript"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="EloqKV GitHub Repository"
                          onClick={e => e.stopPropagation()}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path
                              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                              fill="white"
                            />
                          </svg>
                        </a>
                      </span>
                    </Link>
                  </div>

                  {/* EloqSQL */}
                  <div className="product-shortcut-wrapper">
                    <Link to="/product/eloqsql" className="product-shortcut">
                      <div className="shortcut-icon vector">
                        <img
                          src={useBaseUrl('img/EloqSQL-icon.svg')}
                          alt="EloqSQL"
                          width="32"
                          height="32"
                        />
                      </div>
                      <span>EloqSQL</span>
                    </Link>
                    <a
                      href="https://github.com/eloqdata/eloqsql"
                      className="github-icon"
                      target="_blank"
                      rel="noopener noreferrer">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path
                          d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                          fill="rgba(255, 120, 20, 1)"
                        />
                      </svg>
                    </a>
                  </div>

                  {/* EloqDoc */}
                  <div className="product-shortcut-wrapper">
                    <Link to="/product/eloqdoc" className="product-shortcut">
                      <div className="shortcut-icon mongo">
                        <img
                          src={useBaseUrl('img/EloqCloud-icon.svg')}
                          alt="EloqDoc"
                          width="32"
                          height="32"
                        />
                      </div>
                      <span>EloqDoc</span>
                    </Link>
                    <a
                      href="https://github.com/eloqdata/eloqdoc"
                      className="github-icon"
                      target="_blank"
                      rel="noopener noreferrer">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path
                          d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                          fill="rgba(255, 120, 20, 1)"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="product-right-column">
              <div className="animation-container1">
                {/* Static base image */}
                <img
                  className="static-image1"
                  alt="Static base"
                  src={useBaseUrl('img/eloqhomepage1.svg')}
                />

                {/* Dynamic floating image */}
                <img
                  className="floating-image1"
                  alt="Dynamic element"
                  src={useBaseUrl('img/eloqhomepage2.svg')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="section-container">
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">
            All the database features you need for your next blockbuster AI
            application
          </p>
          <div className="feature-section">
            {features.map((feature, index) => (
              <a
                href={useBaseUrl(feature.link)}
                key={index}
                className="feature-card">
                <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
                <h3>{feature.title}</h3>
                {feature.details.map((detail, i) => (
                  <p key={i}>{detail}</p>
                ))}
              </a>
            ))}
          </div>
        </div>

        {/* Full ACID Transaction Section */}
        <div className={styles.acidSection}>
          <div className={styles.acidInner}>
            <div className={styles.acidContent}>
              <div className={styles.acidInfo}>
                <h2 className={styles.acidTitle}>ACID Transaction Support</h2>
                <p className={styles.acidDescription}>
                  EloqKV is more than just an in-memory cache—it's a fully
                  featured, distributed ACID-compliant transactional database.
                  Eliminate the need for a separate SQL + Redis setup and say
                  goodbye to cache coherence challenges.
                </p>
              </div>
              <div className={styles.acidImageContainer}>
                <img
                  src="/img/acid-transaction.jpg"
                  alt="ACID Transaction Diagram"
                  className={styles.acidImage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tiered Storage Section */}
        <div className={styles.tieredSection}>
          <div className={styles.tieredInner}>
            <div className={styles.tieredContent}>
              <div className={styles.tieredImageContainer}>
                <img
                  src="/img/tiered-storage.jpg"
                  alt="Tiered Storage Architecture"
                  className={styles.tieredImage}
                />
              </div>
              <div className={styles.tieredInfo}>
                <h2 className={styles.tieredTitle}>Tiered Storage</h2>
                <p className={styles.tieredDescription}>
                  EloqKV intelligently manages your data across multiple storage
                  tiers, optimizing both performance and cost. Hot data stays in
                  memory for lightning-fast access, warm data moves to SSD for
                  balanced performance, and cold data is persisted to object
                  storage—all while maintaining seamless access. This
                  multi-tiered approach dramatically reduces TCO (Total Cost of
                  Ownership).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="section-container">
          <h2 className="section-title">Products</h2>
          <p className="section-subtitle">
            Flexibility at its best—choose your standard API
          </p>
          <div className="product-cards">
            <Link to="/product/eloqkv" className="product-card">
              <h3>EloqKV</h3>
              <p>Redis Compatible Database</p>
            </Link>
            <Link to="/product/eloqsql" className="product-card">
              <h3>EloqSQL</h3>
              <p>MySQL Compatible Database</p>
            </Link>
            <Link to="/product/eloqdoc" className="product-card">
              <h3>EloqDoc</h3>
              <p>Mongo Compatible Database</p>
            </Link>
          </div>
        </div>

        {/* Community Section */}
        <div className="section-container">
          <h2 className="section-title">Community</h2>
          <p className="section-subtitle">
            Let's build the next generation of AI native databases together
          </p>
          <div className="community-grid">
            <Link to="/blog" className="community-card">
              <div className="community-icon">
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
              to="https://github.com/eloqdata/eloqkv"
              className="community-card">
              <div className="community-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>GitHub</h3>
              <p>
                Star our repository, report issues, and contribute to the
                development
              </p>
            </Link>

            <Link
              href="https://discord.gg/nmYjBkfak6"
              className="community-card">
              <div className="community-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>Discord</h3>
              <p>
                Join our community to discuss ideas, ask questions, and get
                help.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default HomePage;
