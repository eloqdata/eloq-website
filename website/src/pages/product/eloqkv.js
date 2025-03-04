import React, {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// WeChat Icon Component
const WechatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098c.93.265 1.93.411 2.977.411 4.8 0 8.691-3.288 8.691-7.342 0-4.053-3.89-7.343-8.691-7.343zm12.31 11.312c1.833-1.347 3-3.338 3-5.55 0-4.054-3.89-7.343-8.691-7.343-4.8 0-8.691 3.289-8.691 7.343 0 4.054 3.89 7.342 8.691 7.342 1.047 0 2.047-.146 2.977-.411a.864.864 0 01.717.098l1.903 1.114a.326.326 0 00.167.054c.16 0 .29-.132.29-.295 0-.072-.029-.143-.048-.213l-.39-1.48a.59.59 0 01.213-.665" />
  </svg>
);

const WORKLOAD_PRICES = {
  small: {
    eloqkv: 29,
    redis: 80,
    elasticache: 65,
    description: '2GB内存，每秒5,000次操作',
  },
  medium: {
    eloqkv: 99,
    redis: 250,
    elasticache: 180,
    description: '8GB内存，每秒25,000次操作',
  },
  large: {
    eloqkv: 299,
    redis: 750,
    elasticache: 550,
    description: '32GB内存，每秒100,000次操作',
  },
};

const SHOW_TESTIMONIALS = false; // Set to true to show the testimonials section

const testimonials = [
  {
    quote:
      'EloqKV enables us to develop faster than ever before, while its tiered storage significantly reduces costs',
    name: 'Rocky Shi',
    title: 'Director of Engineering',
    company: 'Transsion',
  },
  {
    quote:
      'EloqKV provides us with a unified caching solution for hybrid cloud environments, making it a perfect fit for our business',
    name: 'Jack Wang',
    title: 'DBA Manager',
    company: 'Inke',
  },
  {
    quote:
      'We are a startup in need of a database that is both easy to use and scalable. EloqKV seamlessly integrates caching and database capabilities into a single solution',
    name: 'Liang Liang',
    title: 'Developer',
    company: 'SeeCube',
  },
];

export default function EloqKV() {
  const [workload, setWorkload] = useState('medium');
  const [isAutoSwitching, setIsAutoSwitching] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when testimonial is in center
      threshold: 0,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setActiveTestimonial(index);
        }
      });
    }, options);

    // Observe all testimonial items
    document
      .querySelectorAll(`.${styles.testimonialItem}`)
      .forEach((el, index) => {
        el.dataset.index = index;
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, []);

  const handleTabClick = size => {
    setIsAutoSwitching(false);
    setWorkload(size);
  };

  return (
    <Layout
      title="EloqKV - 分布式键值数据库"
      description="完全弹性、Redis兼容的分布式数据库，具有计算存储分离和强大的ACID事务">
      <main>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              下一代分布式键值数据库：弹性且事务性
            </h1>
            <p className={styles.heroSubtitle}>
              完全弹性、Redis兼容的分布式数据库，具有计算存储分离和强大的ACID事务
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={`button button--primary button--lg ${styles.heroButton}`}
                to="/eloqkv/introduction"
                style={{
                  background: 'linear-gradient(120deg, #ff7b2d, #ff9f4a)',
                  border: 'none',
                }}>
                开始使用
              </Link>
              <Link
                className={`button button--secondary button--lg ${styles.heroButton}`}
                href="https://github.com/eloqdata/eloqkv"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                }}>
                在GitHub上加星 ⭐
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.features}>
          <div className={styles.featuresInner}>
            <h2 className={styles.featuresTitle}>特性</h2>
            <p className={styles.featuresSubtitle}>
              探索EloqKV的强大功能：可扩展、弹性且完全符合ACID标准
            </p>
            <div className={styles.featureCards}>
              <div className={styles.feature}>
                <h3>Redis兼容</h3>
                <p>Redis的直接替代品，具有增强功能</p>
              </div>
              <div className={styles.feature}>
                <h3>分层存储</h3>
                <p>
                  通过内存、磁盘和对象存储的分层存储，实现速度和成本的完美平衡
                </p>
              </div>
              <div className={styles.feature}>
                <h3>完全弹性</h3>
                <p>独立扩展计算、内存、日志和存储，以匹配工作负载需求</p>
              </div>
              <div className={styles.feature}>
                <h3>简单操作</h3>
                <p>跨节点操作变得简单——无需手动分片</p>
              </div>
              <div className={styles.feature}>
                <h3>极致压缩</h3>
                <p>列式存储通过高压缩效率优化空间</p>
              </div>
              <div className={styles.feature}>
                <h3>分布式事务</h3>
                <p>由1PC协议支持的闪电般快速的分布式事务</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Comparison Section */}
        {SHOW_TESTIMONIALS && (
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
                        {size === 'small'
                          ? '小型'
                          : size === 'medium'
                          ? '中型'
                          : '大型'}
                      </button>
                    ))}
                  </div>
                  <div className={styles.costCard}>
                    <div className={styles.costAmount}>
                      ${WORKLOAD_PRICES[workload].eloqkv}
                    </div>
                    <div className={styles.costPeriod}>/月</div>
                    <div className={styles.costProvider} data-provider="eloqkv">
                      EloqKV
                    </div>
                  </div>
                  <div className={styles.costCard}>
                    <div className={styles.costAmount}>
                      ${WORKLOAD_PRICES[workload].redis}
                    </div>
                    <div className={styles.costPeriod}>/月</div>
                    <div className={styles.costProvider}>Redis企业版</div>
                  </div>
                  <div className={styles.costCard}>
                    <div className={styles.costAmount}>
                      ${WORKLOAD_PRICES[workload].elasticache}
                    </div>
                    <div className={styles.costPeriod}>/月</div>
                    <div className={styles.costProvider}>ElastiCache</div>
                  </div>
                  <div className={styles.workloadDescription}>
                    {WORKLOAD_PRICES[workload].description}
                  </div>
                </div>
                <div className={styles.costInfo}>
                  <h2 className={styles.costTitle}>成本效益高</h2>
                  <p className={styles.costDescription}>
                    EloqKV专为效率而设计，采用每核一线程模型，以最佳成本提供最大性能。
                    通过支持缩放到零，它消除了空闲时间的费用，使其成为一个具有成本效益的选择。
                    使用EloqKV优化您的Redis类工作负载并降低总拥有成本。
                  </p>
                  <div className={styles.costButtons}>
                    <Link
                      className={`button button--primary ${styles.costButton}`}
                      to="/contact"
                      style={{
                        background: 'linear-gradient(120deg, #ff7b2d, #ff9f4a)',
                        border: 'none',
                      }}>
                      免费试用云服务
                    </Link>
                    <Link
                      className={`button button--secondary ${styles.costButton}`}
                      to="/pricing"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                      }}>
                      定价
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Industry Leaders Section */}
        {SHOW_TESTIMONIALS && (
          <div className={styles.leadersSection}>
            <div className={styles.leadersInner}>
              <h2 className={styles.leadersTitle}>开发者喜爱EloqKV</h2>
              <Link to="/customers" className={styles.leadersCTA}>
                深入了解成功案例 →
              </Link>
              <div className={styles.testimonials}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className={styles.testimonialGroup}>
                    <div
                      className={`${styles.logo} ${
                        activeTestimonial === index ? styles.logoActive : ''
                      }`}>
                      <span>{testimonial.company}</span>
                    </div>
                    <div
                      className={`${styles.testimonialItem} ${
                        activeTestimonial === index ? styles.active : ''
                      }`}>
                      <p className={styles.quote}>{testimonial.quote}</p>
                      <div className={styles.testimonialAuthor}>
                        <div>
                          <div className={styles.authorName}>
                            {testimonial.name}
                          </div>
                          <div className={styles.authorTitle}>
                            {testimonial.title} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Community Section */}
        <div className={styles.communitySection}>
          <div className={styles.communityInner}>
            <h2 className={styles.communityTitle}>社区</h2>
            <p className={styles.communitySubtitle}>
              让我们一起构建下一代AI原生数据库
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
                <h3>博客</h3>
                <p>探索AI时代数据库创新的技术见解。</p>
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
                <p>加入我们的Discord社区，与开发者讨论想法。</p>
              </Link>

              <Link href="/wechat" className={styles.communityCard}>
                <div className={styles.communityIcon}>
                  <WechatIcon />
                </div>
                <h3>微信用户群</h3>
                <p>
                  如果你对产品使用有任何问题，或者是想和其他使用者交流，请加入我们的微信用户群。
                </p>
              </Link>

              <Link
                href="https://github.com/eloqdata"
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
                <p>在我们的GitHub仓库中探索我们的开源项目。</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
