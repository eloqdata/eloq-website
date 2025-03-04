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
import './FeatureSection.css';
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

export function Section({
  element = 'section',
  children,
  className,
  background = 'light',
}) {
  const El = element;
  return (
    <El
      className={
        className
          ? `Section ${className} ${background}`
          : `Section ${background}`
      }>
      {children}
    </El>
  );
}

const useHomePageAnimations = () => {
  useEffect(() => setupHeaderAnimations(), []);
  useEffect(() => setupDissectionAnimation(), []);
};

const features = [
  {
    icon: faBolt,
    title: '高性能',
    details: [
      '匹配或超越同类最佳解决方案',
      '由1PC协议支持的闪电般快速的分布式事务',
    ],
    link: 'blog/2024/08/17/benchmark-single-node',
  },
  {
    icon: faDollarSign,
    title: '低成本',
    details: [
      '通过内存、本地磁盘和对象存储的分层存储，实现速度和成本的完美平衡',
    ],
    link: 'blog/2024/08/16/eloqkv#performance-and-cost',
  },
  {
    icon: faExpandArrowsAlt,
    title: '可扩展且弹性',
    details: [
      '通过多核心实现纵向扩展，并扩展到集群中的多个节点',
      '支持工作负载变化时的动态扩展，无服务中断',
    ],
    link: 'blog/2024/08/16/eloqkv#scale-as-you-need-on-what-you-need',
  },
  {
    icon: faExchangeAlt,
    title: '完全ACID',
    details: [
      '具有可配置隔离级别的完全ACID事务',
      '支持来自多个API的跨模型事务',
    ],
    link: 'blog/2024/08/16/eloqkv#full-acid-transactions-when-you-need-them',
  },
  {
    icon: faCheckCircle,
    title: '高可用性',
    details: [
      '将数据复制到多个服务器以提供容错能力',
      '支持热备用，故障恢复可在亚秒级完成',
    ],
    link: 'eloqkv/quick-start-ha',
  },
  {
    icon: faRedoAlt,
    title: '标准API',
    details: [
      'EloqDB支持标准API，包括Redis、SQL和Mongo',
      '实现现有应用程序的无缝迁移，只需最少的努力',
    ],
    link: 'eloqkv/kvstore_compatibility',
  },
];

function HomePage() {
  return (
    <Layout
      description="以正确的方式构建下一代数据库"
      wrapperClassName="homepage">
      <main>
        <div className="container1">
          <div className="product-columns">
            <div className="product-left-column">
              <h1 className="title">专为AI时代设计的新一代数据库</h1>
              <p className="tagline">
                满足所有AI应用需求的数据库——多模型、事务性、 弹性且标准API兼容{' '}
              </p>

              {/* Add product shortcuts */}
              <div className="product-shortcuts">
                <Link to="/product/eloqkv" className="product-shortcut">
                  <div className="shortcut-icon redis">
                    <svg viewBox="0 0 32 32" fill="none">
                      <rect width="32" height="32" rx="6" fill="#DC382D" />
                      <path d="M7 8h18v16H7z" fill="#DC382D" />
                      <path
                        d="M24 16.5l-8 4.5-8-4.5L16 12l8 4.5z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <span>EloqKV</span>
                </Link>

                <Link to="/product/eloqsql" className="product-shortcut">
                  <div className="shortcut-icon vector">
                    <svg viewBox="0 0 32 32" fill="none">
                      <rect width="32" height="32" rx="6" fill="#007ACC" />
                      <ellipse cx="16" cy="10" rx="8" ry="3" fill="white" />
                      <path
                        d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                      <text
                        x="10"
                        y="18"
                        fontSize="6"
                        fill="white"
                        fontWeight="bold">
                        SQL
                      </text>
                    </svg>
                  </div>
                  <span>EloqSQL</span>
                </Link>

                <Link to="/product/eloqdoc" className="product-shortcut">
                  <div className="shortcut-icon qstash">
                    <svg viewBox="0 0 32 32" fill="none">
                      <rect width="32" height="32" rx="6" fill="#4CAF50" />
                      <path
                        d="M10 8h8l4 4v12H10V8z"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M18 8v4h4"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M12 14h8M12 18h8M12 22h5"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span>EloqDoc</span>
                </Link>
              </div>
            </div>
            <div className="product-right-column">
              <img alt="" src={useBaseUrl('img/architecture.svg')} />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="section-container">
          <h2 className="section-title">特性</h2>
          <p className="section-subtitle">
            为您的下一个爆款AI应用提供所需的所有数据库功能
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
                <h2 className={styles.acidTitle}>ACID事务支持</h2>
                <p className={styles.acidDescription}>
                  EloqKV不仅仅是内存缓存——它是一个功能齐全的分布式ACID兼容事务数据库。
                  消除对单独的SQL + Redis设置的需求，告别缓存一致性挑战。
                </p>
              </div>
              <div className={styles.acidImageContainer}>
                <img
                  src="/img/acid-transaction.jpg"
                  alt="ACID事务图"
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
                  alt="分层存储架构"
                  className={styles.tieredImage}
                />
              </div>
              <div className={styles.tieredInfo}>
                <h2 className={styles.tieredTitle}>分层存储</h2>
                <p className={styles.tieredDescription}>
                  EloqKV智能地管理跨多个存储层的数据，优化性能和成本。热数据保留在内存中以实现闪电般的访问速度，
                  温数据移至SSD以获得平衡的性能，冷数据持久化到对象存储——同时保持无缝访问。
                  这种多层方法显著降低了TCO（总拥有成本）。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="section-container">
          <h2 className="section-title">产品</h2>
          <p className="section-subtitle">灵活至上——选择您的标准API</p>
          <div className="product-cards">
            <Link to="/product/eloqkv" className="product-card">
              <h3>EloqKV</h3>
              <p>Redis兼容数据库</p>
            </Link>
            <Link to="/product/eloqsql" className="product-card">
              <h3>EloqSQL</h3>
              <p>MySQL兼容数据库</p>
            </Link>
            <Link to="/product/eloqdoc" className="product-card">
              <h3>EloqDoc</h3>
              <p>Mongo兼容数据库</p>
            </Link>
          </div>
        </div>
        {/* Community Section */}
        <div className="section-container">
          <h2 className="section-title">社区</h2>
          <p className="section-subtitle">让我们一起构建下一代AI原生数据库</p>
          <div className="community-grid">
            <a
              href="https://github.com/eloqdata/eloqkv"
              className="community-card">
              <div className="community-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>GitHub</h3>
              <p>在我们的GitHub仓库中探索我们的开源项目。</p>
            </a>

            <a href="/wechat" className="community-card">
              <div className="community-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098c.93.265 1.93.411 2.977.411 4.8 0 8.691-3.288 8.691-7.342 0-4.053-3.89-7.343-8.691-7.343zm12.31 11.312c1.833-1.347 3-3.338 3-5.55 0-4.054-3.89-7.343-8.691-7.343-4.8 0-8.691 3.289-8.691 7.343 0 4.054 3.89 7.342 8.691 7.342 1.047 0 2.047-.146 2.977-.411a.864.864 0 01.717.098l1.903 1.114a.326.326 0 00.167.054c.16 0 .29-.132.29-.295 0-.072-.029-.143-.048-.213l-.39-1.48a.59.59 0 01.213-.665" />
                </svg>
              </div>
              <h3>微信</h3>
              <p>关注我们的微信公众号获取最新更新和资讯。</p>
            </a>

            <a href="https://discord.gg/nmYjBkfak6" className="community-card">
              <div className="community-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>Discord</h3>
              <p>加入我们的Discord社区，与开发者讨论想法。</p>
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default HomePage;
