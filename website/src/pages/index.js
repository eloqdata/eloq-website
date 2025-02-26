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

const textContent = {
  intro: `
  Data Substrate is a layer of abstraction that provides core functionalities commonly needed for managing data across various scenarios.<br/><br/>
  Data Substrate is responsible for managing <strong>Caching</strong>, <strong>Concurrency control</strong>, <strong>Durability</strong>
  <strong>Consistency</strong> and <strong>Fault tolerance</strong>.<br/><br/>
  Customized databases can be assembled by compute engine, data substrate and cloud kv store.
  `,
  nativeCode: `
React primitives render to native platform UI, meaning your app uses the
same native platform APIs other apps do.
<br/><br/>
<strong>Many platforms</strong>, one React. Create platform-specific versions of components
so a single codebase can share code across platforms. With React Native,
one team can maintain multiple platforms and share a common technology—React.
  `,
  whydatasubstrate: `
  Modern enterprises need versatile data management systems to support complex business needs, but traditional approaches often lead to headaches for system administrators. <br/><br/> These headaches can include long data pipelines, repetitive functionality, complex system management, low resource utilization, and inconsistent synchronizations.
  `,
  hybridscaling: `
  For read-intensive workloads, scale out the data substrate's memory for distributed caching, ensuring fast data retrieval.<br/><br/>

  For write-heavy workloads, scale out the data substrate's log to enable parallel logging alongside our patented one-phase commit protocol, guaranteeing data duration and high availability.<br/><br/>

  For large datasets, scale out the data store to increase storage capacity while minimizing compute costs for less frequently accessed data.
  `,
  elasticlog: `
  Write intensive workload requires the scalability of log service.
				Traditional databases write and fsync redo logs in the order of log sequence number into
				a single disk, which becomes the bottleneck of the whole system. EloqSQL's patented
				1-PC technique enables concurrent transactions to write and fsync redo logs into multiple
				disks in parallel. Benchmark shows 4X TPS improvement compared with AWS Aurora.
  `,
  elasticmem: `
  Read intensive workload requires the scalability of memory resource.
				To achieve low read latency, it is important to hold all the hot data into memory.
				EloqSQL supports hash and range partition, which can store a large amount of hot data
				across multiple hosts. As the hot data grows, EloqSQL can scale-out the cluster and rebalance
				the data range automatically. Cold data will be checkpointed into KV stores which can serve cache
				miss read.
  `,
  decouplestore: `
  Large dataset requires a decouple storage layer which can be individually scaled regardless of
				read and write traffic. To reserve additional compute and memory for cold data is a waste of
				resource. Traditional shared-nothing architecture requires to add more compute nodes as the data
				volumn scales even if the read and write traffic is unchanged. EloqSQL's decoupled cloud
				storage enable you to only pay for the disk plus the IOPS cost of cold data.
  `,
  codeExample: `
import React from 'react';
import {Text, View} from 'react-native';
import {Header} from './Header';
import {heading} from './Typography';

const WelcomeScreen = () => (
  <View>
    <Header title="Welcome to React Native"/>
    <Text style={heading}>Step One</Text>
    <Text>
      Edit App.js to change this screen and turn it
      into your app.
    </Text>
    <Text style={heading}>See Your Changes</Text>
    <Text>
      Press Cmd + R inside the simulator to reload
      your app's code.
    </Text>
    <Text style={heading}>Debug</Text>
    <Text>
      Press Cmd + M or Shake your device to open the
      React Native Debug Menu.
    </Text>
    <Text style={heading}>Learn</Text>
    <Text>
      Read the docs to discover what to do next:
    </Text>
   </View>
);
  `,
  forEveryone: `
React Native lets you create truly native apps and doesn't compromise your users' experiences.
It provides a core set of platform agnostic native components like <code>View</code>, <code>Text</code>, and <code>Image</code>
that map directly to the platform's native UI building blocks.
  `,
  crossPlatform: `
React components wrap existing native code and interact with native APIs via
React's declarative UI paradigm and JavaScript. This enables native app development
for whole new teams of developers, and can let existing native teams work much faster.
  `,
  fastRefresh: `
<strong>See your changes as soon as you save.</strong> With the power of JavaScript,
React Native lets you iterate at lightning speed. No more waiting for native builds to finish.
Save, see, repeat.
  `,
  talks: `
Members of the React Native team frequently speak at various conferences.
<br/><br/>
You can follow the latest news from the React Native team on Twitter
  `,
};

function Heading({text}) {
  return <h2 className="Heading">{text}</h2>;
}

function ActionButton({href, type = 'primary', target, children}) {
  return (
    <a className={`ActionButton ${type}`} href={href} target={target}>
      {children}
    </a>
  );
}

function TextColumn({title, text, moreContent}) {
  return (
    <>
      <Heading text={title} />
      <div dangerouslySetInnerHTML={{__html: text}} />
      {moreContent}
    </>
  );
}

function ButtonEloqSQL() {
  return (
    <>
      <ActionButton
        type="primary"
        href={useBaseUrl('product_eloqdb.html')}
        target="_self">
        View Detail
      </ActionButton>
    </>
  );
}
function HomeLearnMore() {
  return (
    <>
      <ActionButton
        type="primary"
        href={useBaseUrl('/blog/2024/08/11/data-substrate')}
        target="_self">
        Learn more
      </ActionButton>
    </>
  );
}

function HomeCallToAction() {
  return (
    <>
      <ActionButton
        type="primary"
        href={useBaseUrl('eloqkv/quick-start.html')}
        target="_self">
        Get started
      </ActionButton>
    </>
  );
}

function TwitterButton({accountName}) {
  return (
    <a
      href={`https://twitter.com/intent/follow?screen_name=${accountName}&region=follow_link`}
      className="twitter-follow-button">
      <div className="icon" />
      Follow @{accountName}
    </a>
  );
}

function GitHubStarButton() {
  return (
    <div className="github-button">
      <GitHubButton
        href="https://github.com/facebook/react-native"
        data-icon="octicon-star"
        data-size="large"
        aria-label="Star facebook/react-native on GitHub">
        Star
      </GitHubButton>
    </div>
  );
}

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

function TwoColumns({columnOne, columnTwo, reverse}) {
  return (
    <div className={`TwoColumns ${reverse ? 'reverse' : ''}`}>
      <div className={`column first ${reverse ? 'right' : 'left'}`}>
        {columnOne}
      </div>
      <div className={`column last ${reverse ? 'left' : 'right'}`}>
        {columnTwo}
      </div>
    </div>
  );
}

function ScreenRect({className, fill, stroke}) {
  return (
    <rect
      className={`screen ${className || ''}`}
      rx="3%"
      width="180"
      height="300"
      x="-90"
      y="-150"
      fill={fill}
      stroke={stroke}
    />
  );
}

function LogoAnimation() {
  return (
    <img
      alt=""
      width="500"
      height="800"
      src={useBaseUrl('img/mono_caotu.png')}
    />
  );
}

function SQLLOGO() {
  return (
    <img
      width="1250"
      height="50"
      alt=""
      src={useBaseUrl('img/eloqdb_wp.png')}
    />
  );
}

function EloqSQL() {
  return (
    <Section background="dark" className="HeaderHero2">
      {/*
      <div className="socialLinks">
        <TwitterButton accountName="reactnative" />
        <GitHubStarButton />
      </div>*/}
      <TwoColumns
        reverse
        columnOne={<SQLLOGO />}
        columnTwo={
          <>
            <p className="taglineproduct">
              <a href="https://www.eloquentdb.com">EloqSQL</a>
            </p>
            <p className="taglineproductdetail">
              A distributed SQL database powered by Data Substrate. Elastic at
              any scale for any workload.
            </p>
          </>
        }
      />
    </Section>
  );
}
function EloqKV() {
  return (
    <Section background="dark" className="HeaderHero2">
      {/*
      <div className="socialLinks">
        <TwitterButton accountName="reactnative" />
        <GitHubStarButton />
      </div>*/}
      <TwoColumns
        reverse
        columnOne={<LogoAnimation />}
        columnTwo={
          <>
            <p className="taglineproduct">
              <a href="https://www.eloquentdb.com">EloqKV</a>
            </p>
            <p className="taglineproductdetail">
              A distributed transactional cache database powered by Data
              Substrate. Store data in cache with lower cost and higher
              availability.
            </p>
          </>
        }
      />
    </Section>
  );
}
function EloqSQLWrapper() {
  return (
    <Section background="dark" className="HeaderHero2">
      {/*
      <div className="socialLinks">
        <TwitterButton accountName="reactnative" />
        <GitHubStarButton />
      </div>*/}
      <TwoColumns
        reverse
        columnOne={<LogoAnimation />}
        columnTwo={
          <>
            <p className="taglineproduct">
              <a href="https://www.eloquentdb.com">EloqSQLWrapper</a>
            </p>
            <p className="taglineproductdetail">
              A stateless SQL wrapper for Amazon DynamoDB. Customer is enable to
              migrate from RDS to DynamoDB without modifying their application
              code.
            </p>
          </>
        }
      />
    </Section>
  );
}
function HeaderHero() {
  return (
    <Section background="dark" className="HeaderHero">
      {/*
      <div className="socialLinks">
        <TwitterButton accountName="reactnative" />
        <GitHubStarButton />
      </div>*/}
      <TwoColumns
        reverse
        columnOne={<LogoAnimation />}
        columnTwo={
          <>
            <h1 className="title">EloqDB</h1>
            <p className="tagline">
              Assemble your database according to customized requirement powered
              by Data&nbsp;Substrate.
            </p>
            <p className="taglinecolor">
              <Typed strings={['- Pluggable Compute Engine']} typeSpeed={75} />
            </p>
            <p className="taglinecolor">
              <Typed strings={['- Hybrid Cloud KV Storage']} typeSpeed={75} />
            </p>
            <br />
            <br />
            <div className="buttons">
              <HomeCallToAction />
            </div>
          </>
        }
      />
    </Section>
  );
}

function NativeApps() {
  return (
    <Section className="NativeApps" background="light">
      <TwoColumns
        columnOne={
          <TextColumn title="What is Data Substrate" text={textContent.intro} />
        }
        columnTwo={
          <img alt="" src={useBaseUrl('img/homepage/datasubstrate.png')} />
        }
      />
    </Section>
  );
}

function ElasticLogging() {
  return (
    <Section className="NativeApps" background="tint">
      <TwoColumns
        reverse
        columnOne={
          <TextColumn
            title="Why Data Substrate"
            text={textContent.whydatasubstrate}
          />
        }
        columnTwo={
          <img alt="" src={useBaseUrl('img/homepage/datasubstratewhy.png')} />
        }
      />
    </Section>
  );
}
function ElasticMemory() {
  return (
    <Section className="NativeApps" background="light">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Elastic at any scale for any workloads"
            text={textContent.hybridscaling}
          />
        }
        columnTwo={
          <img
            alt=""
            src={useBaseUrl('img/homepage/datasubstratehybridscale.png')}
          />
        }
      />
    </Section>
  );
}
function DecoupleStore() {
  return (
    <Section className="NativeApps" background="tint">
      <TwoColumns
        columnOne={
          <a href="https://www.eloquentdb.com/product_eloqsql">EloqSQL</a>
        }
        columnTwo={
          <img alt="" src={useBaseUrl('img/homepage/decoupledstorage2.png')} />
        }
      />
    </Section>
  );
}

/* Community */

function AppList() {
  const {siteConfig} = useDocusaurusContext();
  const apps = Object.values(siteConfig.customFields.users)
    .flat()
    .filter(app => app.pinned);

  return (
    <ul className="AppList">
      {apps.map((app, i) => {
        const imgSource = !app.icon.startsWith('http')
          ? useBaseUrl('img/showcase/' + app.icon)
          : app.icon;
        return (
          <li key={i} className="item">
            {app.infoLink ? (
              <a href={app.infoLink}>
                <img src={imgSource} alt={app.name} />
              </a>
            ) : (
              <img src={imgSource} alt={app.name} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Community() {
  return (
    <Section className="Community" background="light">
      <div className="content">
        <Heading text="Facebook Supported, Community Driven" />
        <TwoColumns
          columnOne={
            <>
              <p className="firstP">
                <img src={useBaseUrl(`img/homepage/fb-logo.svg`)} alt="" />
                <span>
                  Facebook released React Native in 2015 and has been
                  maintaining it ever since.
                </span>
              </p>
              <p>
                In 2018, React Native had the{' '}
                <a href="https://octoverse.github.com/2018/projects#repositories">
                  2nd highest
                </a>{' '}
                number of contributors for any repository in GitHub. Today,
                React Native is supported by contributions from individuals and
                companies around the world including{' '}
                <span>
                  <a href="https://callstack.com/">Callstack</a>
                </span>
                ,{' '}
                <span>
                  <a href="https://expo.io/">Expo</a>
                </span>
                , <a href="https://infinite.red/">Infinite Red</a>,{' '}
                <a href="https://www.microsoft.com/">Microsoft</a> and{' '}
                <a href="https://swmansion.com/">Software Mansion</a>.
              </p>
              <p>
                Our community is always shipping exciting new projects and
                exploring platforms beyond Android and iOS with repos like{' '}
                <span>
                  <a href="https://github.com/microsoft/react-native-windows#readme">
                    React Native Windows
                  </a>
                </span>
                ,{' '}
                <a href="https://github.com/microsoft/react-native-macos#readme">
                  React Native macOS
                </a>{' '}
                and{' '}
                <a href="https://github.com/necolas/react-native-web#readme">
                  React Native Web
                </a>
                .
              </p>
            </>
          }
          columnTwo={
            <>
              <p>
                React Native is being used in thousands of apps, but it's likely
                you've already used it in one of these apps:
              </p>
              <AppList />
              <p>
                and <a href={useBaseUrl(`showcase`)}>many more</a>.
              </p>
            </>
          }
        />
      </div>
    </Section>
  );
}

function GetStarted() {
  return (
    <Section className="GetStarted" background="black">
      <div className="content">
        {/*<h2 className="Heading">Coming Soon</h2>*/}
        <h2 className="Heading">Try Our Cutting-Edge Products</h2>
      </div>
    </Section>
  );
}

const useHomePageAnimations = () => {
  useEffect(() => setupHeaderAnimations(), []);
  useEffect(() => setupDissectionAnimation(), []);
};

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
                Revolutionary Databases Powered by Data Substrate
              </h1>
              <p className="tagline">
                One database for all AI needs—multi-model, transactional,
                elastic and API-compatible{' '}
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
          <h2 className="section-title">Features</h2>
          <p className="section-subtitle">
            Everything your AI application needs, all in one database
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

            <Link to="/docs/introduction" className="community-card">
              <div className="community-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>Documentation</h3>
              <p>
                Learn how to use EloqDB with our comprehensive guides and API
                references.
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
