import React, { useEffect, useRef, useState } from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

import './FeatureSection.css';
import '../css/logoWall.css';
import styles from './styles.module.css';

const HERO_BADGES = [
    'AI-Agent Ready',
    'NVMe-Native',
    'Standard API',
    'ACID Across Data Models',
];

const FEATURE_DETAILS = [
    {
        title: 'EloqKV',
        body: [
            'EloqKV is a Redis API compatible data store. By keeping hot data on NVMe instead of DRAM, EloqKV provides fully in-memory level throughput and P99.99 tail latency with 10X cost savings.',
            'More than just a cache solution, EloqKV is designed for durability and consistency with a distributed architecture built for the agent era.',
        ],
        metricValue: '10X DRAM Savings',
        metricLabel: 'Cost Reduction · Stable P9999 Latency',
        linkLabel: 'Deep dive →',
        linkHref: '/blog/2026/01/08/eloqkv-on-eloqstore',
        image: 'img/eloqkv-feature-primary.png',
        imageAlt: 'EloqKV NVMe topology diagram',
    },
    {
        title: 'EloqDoc',
        body: [
            'EloqDoc is a MongoDB API compatible JSON document store that replaces EBS with local NVMe for performance and object storage for durability. By eliminating the high cost of IO and data storage of cloud block volumes, EloqDoc provides 10X IOPS and S3 level durability at one-tenth the cost of competitor\'s solutions.',
        ],
        metricValue: '10X Storage Savings',
        metricLabel: 'Cheaper Than EBS · Millions of IOPS',
        image: 'img/decoupled-architecture.png',
        imageAlt: 'Illustration of converged NVMe and object storage layers',
    },
    {
        title: 'ConvergedDB',
        body: [
            'AI applications deal with many different data types:  vector, tabular, cache, document, and graph. Storing data in multiple databases creates complexity and consistency hell. EloqData Converged DB supports multiple data models and executes cross-model ACID transactions, eliminating inconsistency and simplify operations. ',
            'Agents execute against verifiable, consistent state at all times.',
        ],
        metricValue: 'Fewer Databases, More Productivity',
        metricLabel: 'ACID Across All Data Models',
        image: 'img/low-latency-transaction.png',
        imageAlt: 'Cross-model ACID transaction flow',
    },
    {
        title: 'Fast Branching',
        body: [
            'GIT-like behavior on TB scale datasets. Constant time branching, constant time rollbacks.',
            'Agents need production-grade data, not mock replicas. EloqData spins up branches in seconds so agents can explore, simulate, and reason without risking production data.',
        ],
        metricValue: 'Fearless Experiments on Production Data',
        metricLabel: 'TB-Scale Branching · Seconds',
        image: 'img/agentic.png',
        imageAlt: 'Agent workflow branching across datasets',
    },
    {
        title: 'Truly Distributed',
        body: [
            'Today\'s enterprises may need to quickly scale up capacity as demand increases. Traditional database solutions often force users to choose between efficient un-scalable solution or inefficient distributed solution. EloqData breaks this tradeoff by providing a truly scalable architecture that maintains high efficiency at small scale while enabling seamless scaling to thousands of nodes.',
        ],
        metricValue: 'No Compromise Scalability',
        metricLabel: 'Agent-Scale Throughput',
        linkLabel: 'Read the paper →',
        linkHref: '#',
        image: 'img/highperf.png',
        imageAlt: 'High-performance distributed topology diagram',
    },
];

function HeroBadge({ label }) {
    return <span className={styles.heroBadge}>{label}</span>;
}

function Hero() {
    const architectureUrl = useBaseUrl('/docs/architecture');
    const benchmarkUrl = useBaseUrl('/blog/benchmarks/p9999-latency');

    return (
        <section className={styles.primaryHero}>
            <div className={styles.primaryHeroBackground} />
            <div className={styles.primaryHeroGrid} />
            <div className={styles.primaryHeroNoise} />
            <div className={styles.primaryHeroInner}>
                <div className={styles.heroBadgeRow}>
                    {HERO_BADGES.map(badge => (
                        <HeroBadge key={badge} label={badge} />
                    ))}
                </div>
                <h1 className={styles.heroTitle}>DRAM Performance, SSD Cost, 10X Savings</h1>
                <p className={styles.heroSubtitle}>
                    Converged Database Providing DRAM Level Throughput and P99.99 Latency 
                    with NVMe SSD and Low Cost Cloud Object Storage
                </p>
                <div className={styles.ctaGroup}>
                    <Link className={styles.primaryCta} to={architectureUrl}>
                        Read the Architecture
                    </Link>
                    <Link className={styles.secondaryCta} to={benchmarkUrl}>
                        Benchmark P9999 Latency
                    </Link>
                </div>
            </div>
        </section>
    );
}

function FeatureNarrativeRow({ feature, reverse }) {
    const {
        title,
        body,
        metricValue,
        metricLabel,
        linkLabel,
        linkHref,
        image,
        imageAlt,
    } = feature;
    const imageUrl = useBaseUrl(image);

    return (
        <article
            className={`${styles.featureNarrativeRow} ${reverse ? styles.featureNarrativeRowReverse : ''
                }`}>
            <div className={styles.featureNarrativeText}>
                <div className={styles.featureMetricStack}>
                    <span className={styles.featureMetricValue}>{metricValue}</span>
                    <span className={styles.featureMetricLabel}>{metricLabel}</span>
                </div>
                <h3 className={styles.featureNarrativeTitle}>{title}</h3>
                {body.map((paragraph, index) => (
                    <p key={index} className={styles.featureNarrativeDescription}>
                        {paragraph}
                    </p>
                ))}
                {linkLabel && linkHref ? (
                    <Link
                        className={styles.featureNarrativeLink}
                        to={useBaseUrl(linkHref)}
                        aria-label={`${linkLabel} for ${title}`}>
                        {linkLabel}
                    </Link>
                ) : null}
            </div>
            <div className={styles.featureNarrativeMedia}>
                <div className={styles.featureNarrativeFrame}>
                    <img src={imageUrl} alt={imageAlt} loading="lazy" />
                </div>
            </div>
        </article>
    );
}

function FeatureNarratives() {
    const [activeIndex, setActiveIndex] = useState(0);
    const featureRefs = useRef([]);

    useEffect(() => {
        const updateProgress = () => {
            const nodes = featureRefs.current.filter(Boolean);
            if (!nodes.length) return;

            const viewportCenter = window.innerHeight * 0.55;
            let closestIndex = 0;
            let closestDistance = Number.POSITIVE_INFINITY;

            nodes.forEach((node, index) => {
                const rect = node.getBoundingClientRect();
                const distance = Math.abs(rect.top - viewportCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setActiveIndex(closestIndex);
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    return (
        <section className={styles.featureNarratives}>
            <div className={styles.featureNarrativeHeader}>
                <span className={styles.featureNarrativeEyebrow}>Technical Advantages</span>
            </div>
            <div className={styles.featureNarrativeLayout}>
                <div className={styles.featureRail} aria-hidden="true">
                    <div className={styles.featureRailTrack}>
                        {FEATURE_DETAILS.map((feature, index) => (
                            <span
                                key={feature.title}
                                className={`${styles.featureRailDot} ${index === activeIndex ? styles.featureRailDotActive : ''
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.featureNarrativeList}>
                    {FEATURE_DETAILS.map((feature, index) => (
                        <div
                            key={feature.title}
                            ref={el => {
                                featureRefs.current[index] = el;
                            }}>
                            <FeatureNarrativeRow feature={feature} reverse={index % 2 === 1} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LogoWall() {
    const trackRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let position = 0;
        const speedPxPerSec = 60;
        let lastTimestamp;
        let rafId;

        const step = timestamp => {
            if (lastTimestamp == null) lastTimestamp = timestamp;
            const deltaSec = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            position -= speedPxPerSec * deltaSec;
            const loopWidth = track.scrollWidth / 2;
            if (loopWidth > 0 && -position >= loopWidth) {
                position += loopWidth;
            }

            track.style.transform = `translateX(${position}px)`;
            rafId = requestAnimationFrame(step);
        };

        rafId = requestAnimationFrame(step);
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    const logos = Array.from({ length: 7 }, (_, index) => ({
        src: useBaseUrl(`img/logo/placeholder-logo-${index + 1}.svg`),
        alt: `Logo ${index + 1}`,
    }));

    const duplicatedLogos = [...logos, ...logos];

    return (
        <div className="logo-wall-wrapper">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="logo-wall-container">
                    <div className="logo-wall-track" ref={trackRef}>
                        {duplicatedLogos.map((logo, index) => (
                            <img key={index} src={logo.src} alt={logo.alt} className="logo-wall-logo" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductMatrixSection() {
    return (
        <div className="section-container">
            <h2 className="section-title">Product Matrix</h2>
            <p className="section-subtitle">
                One database engine, multiple APIs for all your application needs
            </p>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30px',
                    marginBottom: '30px',
                    width: '100%',
                    minHeight: '600px',
                    position: 'relative',
                }}>
                <div
                    style={{
                        position: 'relative',
                        width: '600px',
                        height: '600px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <svg
                        width="500"
                        height="500"
                        viewBox="0 0 500 500"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}>
                        <defs>
                            <linearGradient id="orbit-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: 'rgba(255, 123, 45, 0.4)' }} />
                                <stop offset="50%" style={{ stopColor: 'rgba(255, 255, 255, 0.3)' }} />
                                <stop offset="100%" style={{ stopColor: 'rgba(255, 123, 45, 0.4)' }} />
                            </linearGradient>
                            <linearGradient id="orbit-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: 'rgba(255, 123, 45, 0.4)' }} />
                                <stop offset="50%" style={{ stopColor: 'rgba(255, 255, 255, 0.3)' }} />
                                <stop offset="100%" style={{ stopColor: 'rgba(255, 123, 45, 0.4)' }} />
                            </linearGradient>
                            <linearGradient id="orbit-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: 'rgba(255, 123, 45, 0.4)' }} />
                                <stop offset="50%" style={{ stopColor: 'rgba(255, 255, 255, 0.3)' }} />
                                <stop offset="100%" style={{ stopColor: 'rgba(255, 123, 45, 0.4)' }} />
                            </linearGradient>
                        </defs>
                        <ellipse
                            cx="250"
                            cy="250"
                            rx="200"
                            ry="90"
                            fill="none"
                            stroke="url(#orbit-gradient-1)"
                            strokeWidth="1.5"
                        />
                        <ellipse
                            cx="250"
                            cy="250"
                            rx="200"
                            ry="90"
                            fill="none"
                            stroke="url(#orbit-gradient-2)"
                            strokeWidth="1.5"
                            transform="rotate(60 250 250)"
                        />
                        <ellipse
                            cx="250"
                            cy="250"
                            rx="200"
                            ry="90"
                            fill="none"
                            stroke="url(#orbit-gradient-3)"
                            strokeWidth="1.5"
                            transform="rotate(-60 250 250)"
                        />
                    </svg>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 5,
                        }}>
                        <Link
                            to="https://cloud.eloqdata.com/signup"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textDecoration: 'none',
                            }}>
                            <div
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    background: 'linear-gradient(145deg, rgba(50,50,80,0.95), rgba(30,30,50,0.95))',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 15px 40px rgba(255, 123, 45, 0.3)',
                                    marginBottom: '10px',
                                }}>
                                <img
                                    src={useBaseUrl('img/homepage/EloqCloud-icon.svg')}
                                    alt="EloqCloud"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'contain',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                        e.currentTarget.parentElement.style.boxShadow =
                                            '0 20px 50px rgba(255, 123, 45, 0.4)';

                                        const existingTooltip = document.getElementById('eloqcloud-tooltip');
                                        if (existingTooltip) existingTooltip.remove();

                                        const tooltip = document.createElement('div');
                                        tooltip.id = 'eloqcloud-tooltip';
                                        tooltip.innerHTML =
                                            'EloqCloud<br/>Cloud-native Serverless Data Service Platform';
                                        tooltip.style.cssText = `
                      position: fixed;
                      background: rgba(0, 0, 0, 0.9);
                      color: white;
                      padding: 12px 16px;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 500;
                      text-align: center;
                      line-height: 1.4;
                      z-index: 1000;
                      pointer-events: none;
                      border: 1px solid rgba(255, 123, 45, 0.5);
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                      white-space: nowrap;
                    `;
                                        document.body.appendChild(tooltip);

                                        const updatePosition = evt => {
                                            if (tooltip && tooltip.parentNode) {
                                                tooltip.style.left = evt.clientX + 10 + 'px';
                                                tooltip.style.top = evt.clientY - 10 + 'px';
                                            }
                                        };

                                        updatePosition(e);
                                        e.currentTarget._tooltipUpdatePosition = updatePosition;
                                        e.currentTarget.addEventListener('mousemove', updatePosition);
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.parentElement.style.boxShadow =
                                            '0 15px 40px rgba(255, 123, 45, 0.3)';

                                        if (e.currentTarget._tooltipUpdatePosition) {
                                            e.currentTarget.removeEventListener(
                                                'mousemove',
                                                e.currentTarget._tooltipUpdatePosition,
                                            );
                                            delete e.currentTarget._tooltipUpdatePosition;
                                        }

                                        const tooltip = document.getElementById('eloqcloud-tooltip');
                                        if (tooltip) tooltip.remove();
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                }}>
                                EloqCloud
                            </span>
                        </Link>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                        }}>
                        <div
                            style={{
                                position: 'absolute',
                                top: '8%',
                                left: '15%',
                                transform: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Link
                                to="/product/eloqkv"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                }}>
                                <div
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        background: 'linear-gradient(145deg, rgba(50,50,80,0.9), rgba(30,30,50,0.9))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                                        marginBottom: '10px',
                                    }}>
                                    <img
                                        src={useBaseUrl('img/homepage/EloqKV-icon.svg')}
                                        alt="EloqKV"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.2)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 15px 40px rgba(0, 0, 0, 0.6)';

                                            const existingTooltip = document.getElementById('eloqkv-tooltip');
                                            if (existingTooltip) existingTooltip.remove();

                                            const tooltip = document.createElement('div');
                                            tooltip.id = 'eloqkv-tooltip';
                                            tooltip.innerHTML = 'EloqKV<br/>Redis-compatible Key-Value Database';
                                            tooltip.style.cssText = `
                        position: fixed;
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 12px 16px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: center;
                        line-height: 1.4;
                        z-index: 1000;
                        pointer-events: none;
                        border: 1px solid rgba(255, 123, 45, 0.5);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        white-space: nowrap;
                      `;
                                            document.body.appendChild(tooltip);

                                            const updatePosition = evt => {
                                                if (tooltip && tooltip.parentNode) {
                                                    tooltip.style.left = evt.clientX + 10 + 'px';
                                                    tooltip.style.top = evt.clientY - 10 + 'px';
                                                }
                                            };

                                            updatePosition(e);
                                            e.currentTarget._tooltipUpdatePosition = updatePosition;
                                            e.currentTarget.addEventListener('mousemove', updatePosition);
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 10px 30px rgba(0, 0, 0, 0.4)';

                                            if (e.currentTarget._tooltipUpdatePosition) {
                                                e.currentTarget.removeEventListener(
                                                    'mousemove',
                                                    e.currentTarget._tooltipUpdatePosition,
                                                );
                                                delete e.currentTarget._tooltipUpdatePosition;
                                            }

                                            const tooltip = document.getElementById('eloqkv-tooltip');
                                            if (tooltip) tooltip.remove();
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                    }}>
                                    EloqKV
                                </span>
                            </Link>
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                left: '15%',
                                bottom: '8%',
                                transform: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Link
                                to="/product/eloqdoc"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                }}>
                                <div
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        background: 'linear-gradient(145deg, rgba(50,50,80,0.9), rgba(30,30,50,0.9))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                                        marginBottom: '10px',
                                    }}>
                                    <img
                                        src={useBaseUrl('img/homepage/EloqDoc-icon.svg')}
                                        alt="EloqDoc"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.2)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 15px 40px rgba(0, 0, 0, 0.6)';

                                            const existingTooltip = document.getElementById('eloqdoc-tooltip');
                                            if (existingTooltip) existingTooltip.remove();

                                            const tooltip = document.createElement('div');
                                            tooltip.id = 'eloqdoc-tooltip';
                                            tooltip.innerHTML =
                                                'EloqDoc<br/>MongoDB-compatible Distributed Document Database';
                                            tooltip.style.cssText = `
                        position: fixed;
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 12px 16px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: center;
                        line-height: 1.4;
                        z-index: 1000;
                        pointer-events: none;
                        border: 1px solid rgba(255, 123, 45, 0.5);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        white-space: nowrap;
                      `;
                                            document.body.appendChild(tooltip);

                                            const updatePosition = evt => {
                                                if (tooltip && tooltip.parentNode) {
                                                    tooltip.style.left = evt.clientX + 10 + 'px';
                                                    tooltip.style.top = evt.clientY - 10 + 'px';
                                                }
                                            };

                                            updatePosition(e);
                                            e.currentTarget._tooltipUpdatePosition = updatePosition;
                                            e.currentTarget.addEventListener('mousemove', updatePosition);
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 10px 30px rgba(0, 0, 0, 0.4)';

                                            if (e.currentTarget._tooltipUpdatePosition) {
                                                e.currentTarget.removeEventListener(
                                                    'mousemove',
                                                    e.currentTarget._tooltipUpdatePosition,
                                                );
                                                delete e.currentTarget._tooltipUpdatePosition;
                                            }

                                            const tooltip = document.getElementById('eloqdoc-tooltip');
                                            if (tooltip) tooltip.remove();
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                    }}>
                                    EloqDoc
                                </span>
                            </Link>
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                top: '8%',
                                right: '15%',
                                transform: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Link
                                to="/product/eloqsql"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                }}>
                                <div
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        background: 'linear-gradient(145deg, rgba(50,50,80,0.9), rgba(30,30,50,0.9))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                                        marginBottom: '10px',
                                    }}>
                                    <img
                                        src={useBaseUrl('img/homepage/EloqSQL-icon.svg')}
                                        alt="EloqSQL"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.2)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 15px 40px rgba(0, 0, 0, 0.6)';

                                            const existingTooltip = document.getElementById('eloqsql-tooltip');
                                            if (existingTooltip) existingTooltip.remove();

                                            const tooltip = document.createElement('div');
                                            tooltip.id = 'eloqsql-tooltip';
                                            tooltip.innerHTML = 'EloqSQL<br/>MySQL-compatible Distributed Relational Database';
                                            tooltip.style.cssText = `
                        position: fixed;
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 12px 16px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: center;
                        line-height: 1.4;
                        z-index: 1000;
                        pointer-events: none;
                        border: 1px solid rgba(255, 123, 45, 0.5);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        white-space: nowrap;
                      `;
                                            document.body.appendChild(tooltip);

                                            const updatePosition = evt => {
                                                if (tooltip && tooltip.parentNode) {
                                                    tooltip.style.left = evt.clientX + 10 + 'px';
                                                    tooltip.style.top = evt.clientY - 10 + 'px';
                                                }
                                            };

                                            updatePosition(e);
                                            e.currentTarget._tooltipUpdatePosition = updatePosition;
                                            e.currentTarget.addEventListener('mousemove', updatePosition);
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 10px 30px rgba(0, 0, 0, 0.4)';

                                            if (e.currentTarget._tooltipUpdatePosition) {
                                                e.currentTarget.removeEventListener(
                                                    'mousemove',
                                                    e.currentTarget._tooltipUpdatePosition,
                                                );
                                                delete e.currentTarget._tooltipUpdatePosition;
                                            }

                                            const tooltip = document.getElementById('eloqsql-tooltip');
                                            if (tooltip) tooltip.remove();
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                    }}>
                                    EloqSQL
                                </span>
                            </Link>
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                right: '15%',
                                bottom: '8%',
                                transform: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Link
                                to="/product/eloqconvergeddb"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                }}>
                                <div
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        background: 'linear-gradient(145deg, rgba(50,50,80,0.9), rgba(30,30,50,0.9))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                                        marginBottom: '10px',
                                    }}>
                                    <img
                                        src={useBaseUrl('img/homepage/EloqConvergedDB-icon.svg')}
                                        alt="EloqConvergedDB"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.2)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 15px 40px rgba(0, 0, 0, 0.6)';

                                            const existingTooltip = document.getElementById('eloqconverged-tooltip');
                                            if (existingTooltip) existingTooltip.remove();

                                            const tooltip = document.createElement('div');
                                            tooltip.id = 'eloqconverged-tooltip';
                                            tooltip.innerHTML =
                                                'EloqConvergedDB<br/>AI-Native Converged Database<br/>Supporting SQL, Redis, Mongo, Vector, Graph,<br/>and Other Data Modalities and APIs';
                                            tooltip.style.cssText = `
                        position: fixed;
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 12px 16px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: center;
                        line-height: 1.4;
                        z-index: 1000;
                        pointer-events: none;
                        border: 1px solid rgba(255, 123, 45, 0.5);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                      `;
                                            document.body.appendChild(tooltip);

                                            const updatePosition = evt => {
                                                if (tooltip && tooltip.parentNode) {
                                                    tooltip.style.left = evt.clientX + 10 + 'px';
                                                    tooltip.style.top = evt.clientY - 10 + 'px';
                                                }
                                            };

                                            updatePosition(e);
                                            e.currentTarget._tooltipUpdatePosition = updatePosition;
                                            e.currentTarget.addEventListener('mousemove', updatePosition);
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.parentElement.style.boxShadow =
                                                '0 10px 30px rgba(0, 0, 0, 0.4)';

                                            if (e.currentTarget._tooltipUpdatePosition) {
                                                e.currentTarget.removeEventListener(
                                                    'mousemove',
                                                    e.currentTarget._tooltipUpdatePosition,
                                                );
                                                delete e.currentTarget._tooltipUpdatePosition;
                                            }

                                            const tooltip = document.getElementById('eloqconverged-tooltip');
                                            if (tooltip) tooltip.remove();
                                        }}
                                    />
                                </div>
                                <span
                                    style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                    }}>
                                    EloqConvergedDB
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CommunitySection() {
    return (
        <div className="section-container">
            <h2 className="section-title">Community</h2>
            <p className="section-subtitle">
                Let&apos;s build the next generation of databases for the AI age together
            </p>
            <div className="community-grid">
                <Link to="/blog" className="community-card">
                    <div className="community-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M19 5v14H5V5h14zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                                fill="currentColor"
                            />
                            <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor" />
                        </svg>
                    </div>
                    <h3>Blog</h3>
                    <p>Explore technical insights on database innovations in the AI era.</p>
                </Link>
                <Link to="https://github.com/eloqdata/eloqkv" className="community-card">
                    <div className="community-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h3>GitHub</h3>
                    <p>Star our repository, report issues, and contribute to the development.</p>
                </Link>
                <Link to="https://discord.gg/nmYjBkfak6" className="community-card">
                    <div className="community-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h3>Discord</h3>
                    <p>Join our community to discuss ideas, ask questions, and get help.</p>
                </Link>
            </div>
        </div>
    );
}

function SecurityComplianceSection() {
    return (
        <div className={styles.soc2Section}>
            <div className={styles.soc2Inner}>
                <div className={styles.soc2Text}>
                    <span className={styles.soc2Tag}>Security & Compliance</span>
                    <h2 className={styles.soc2Title}>Trust EloqCloud with Your Most Critical Data</h2>
                    <p className={styles.soc2Subtitle}>
                        EloqCloud is audited against SOC 2 controls, so you can deliver modern data experiences
                        with confidence that your customers&apos; information stays protected.
                    </p>
                    <div className={styles.soc2Actions}>
                        <a
                            className={styles.soc2Button}
                            href="https://cloud.eloqdata.com"
                            target="_blank"
                            rel="noopener noreferrer">
                            Try EloqCloud
                        </a>
                    </div>
                </div>
                <div className={styles.soc2Image}>
                    <img
                        src={useBaseUrl('img/homepage/soc2_badge.jpg')}
                        alt="EloqCloud SOC 2 Type II compliance badge"
                    />
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    useEffect(() => {
        const cleanupAllTooltips = () => {
            const tooltipIds = [
                'eloqcloud-tooltip',
                'eloqkv-tooltip',
                'eloqdoc-tooltip',
                'eloqsql-tooltip',
                'eloqconverged-tooltip',
            ];
            tooltipIds.forEach(id => {
                const tooltip = document.getElementById(id);
                if (tooltip) tooltip.remove();
            });
        };

        const handleVisibilityChange = () => {
            if (document.hidden) cleanupAllTooltips();
        };

        const handleBeforeUnload = () => {
            cleanupAllTooltips();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            cleanupAllTooltips();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <Layout>
            <Head>
                <title>EloqData | Converged Database Breaking the Memory Barrier</title>
                <meta
                    name="description"
                    content="EloqData delivers converged NVMe and object storage with ACID guarantees and predictable tail latency for AI-native workloads."
                />
            </Head>
            <main className={styles.page}>
                <Hero />
                <LogoWall />
                <FeatureNarratives />
                <ProductMatrixSection />
                <SecurityComplianceSection />
                <CommunitySection />
            </main>
        </Layout>
    );
}

