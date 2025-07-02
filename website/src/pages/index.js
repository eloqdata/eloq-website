/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState, useRef} from 'react';
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

// Add new styles for our buttons
const buttonStyles = {
  buttonContainer: {
    display: 'flex',
    gap: '26px',
    marginTop: '6px',
    marginBottom: '20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '16px',
      width: '100%',
    },
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '16px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '@media (max-width: 768px)': {
      width: '100%',
      textAlign: 'center',
    },
  },
  primary: {
    backgroundColor: '#ff7b2d',
    color: 'white',
    border: '2px solid #ff7b2d',
    '&:hover': {
      backgroundColor: '#e86a1e',
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#ff7b2d',
    border: '2px solid #ff7b2d',
    '&:hover': {
      backgroundColor: 'rgba(255, 123, 45, 0.1)',
    },
  },
};

// Add CSS for the rotating content
const rotatingContentStyles = {
  container: {
    position: 'relative',
    minHeight: '400px',
    '@media (max-width: 768px)': {
      minHeight: '600px',
    },
  },
  content: {
    position: 'absolute',
    width: '100%',
    transition: 'opacity 0.8s ease-in-out',
    '@media (max-width: 768px)': {
      position: 'relative',
    },
  },
  visible: {
    opacity: 1,
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
    zIndex: 0,
  },
};

// Add CSS for the content indicators
const indicatorStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  active: {
    backgroundColor: '#ff7b2d',
    transform: 'scale(1.2)',
  },
  inactive: {
    backgroundColor: 'rgba(255, 123, 45, 0.3)',
    '&:hover': {
      backgroundColor: 'rgba(255, 123, 45, 0.5)',
    },
  },
};

// Styling for the reversed layout
const reversedStyles = {
  // In reversed mode, handle the layout changes
  reversed: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start', // Align items to the top
    marginTop: '30px', // Add some top margin to the entire layout
  },
  textContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end', // Align content to the bottom
    alignItems: 'flex-start',
    paddingLeft: '40px',
    marginTop: '40px', // Reduced margin to move content higher
  },
  animationContainer: {
    marginTop: '-50px', // Move animation container further up
  },
  title: {
    fontSize: '42px', // Make the title larger
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'white',
  },
  icon: {
    width: '48px',
    height: '48px',
    marginRight: '8px',
  },
  tagline: {
    fontSize: '20px', // Make the tagline slightly larger
    marginBottom: '24px',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '300',
    letterSpacing: '0.8px',
    lineHeight: '1.4',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    color: 'rgba(255, 255, 255, 0.7)', // Match the light grey color
  },
  highlightedText: {
    color: '#ff7b2d',
    fontWeight: '600',
    position: 'relative',
    padding: '0 2px',
    animation: 'pulse 3s infinite ease-in-out',
    textDecoration: 'none',
    borderBottom: '2px solid #ff7b2d',
  },
  convergedImage: {
    maxWidth: '100%',
    height: 'auto',
    transition: 'transform 2s ease-in-out',
    animation: 'float 3s ease-in-out infinite alternate',
  },
};

// Update styles for the navigation arrows to position them at dot level
const navigationArrowStyles = {
  container: {
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '32px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
    margin: '0 25px',
  },
  hover: {
    backgroundColor: 'rgba(255, 123, 45, 0.2)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
  },
};

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
  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      console.log('Image uploaded:', file.name);
    }
  };

  return (
    <Layout
      description="Build the Next Generation of Databases the Right Way"
      wrapperClassName="homepage">
      <main style={{marginTop: '-0px'}}>
        {/* News Banner */}
        <div
          className="container1"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            position: 'relative',
            zIndex: 100,
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '2px 2px',
              width: '100%',
              marginTop: 0,
              position: 'relative',
              zIndex: 101,
            }}>
            <span
              style={{
                color: '#ff7b2d',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '18px',
                position: 'relative',
                zIndex: 102,
              }}>
              <Link
                to="/news/2025/04/29/eloqcloud"
                style={{
                  color: '#ff7b2d',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                target="_blank"
                rel="noopener noreferrer">
                🎉 News!
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{color: '#ff7b2d'}}>
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </span>
            <span
              style={{
                color: '#ffffff',
                fontSize: '18px',
                position: 'relative',
                zIndex: 102,
              }}>
              EloqCloud Public Access Open:{' '}
              <Link
                to="https://cloud.eloqdata.com/join-waitlist"
                style={{
                  color: '#ff7b2d',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'inline-block',
                  position: 'relative',
                  zIndex: 103,
                  padding: '0 4px',
                }}
                target="_blank"
                rel="noopener noreferrer">
                Apply Now
              </Link>
            </span>
          </div>
        </div>

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

              {/* Add buttons for signup and trial */}
              <div style={buttonStyles.buttonContainer}>
                <Link
                  to="https://cloud.eloqdata.com/join-waitlist"
                  style={{
                    ...buttonStyles.actionButton,
                    ...buttonStyles.primary,
                  }}>
                  Apply For Access
                </Link>
                <Link
                  to="/product/eloqkv"
                  style={{
                    ...buttonStyles.actionButton,
                    ...buttonStyles.secondary,
                  }}>
                  Explore More Products
                </Link>
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

        {/* Product Matrix Section */}
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
              width: '100%',
            }}>
            <div
              style={{
                maxWidth: '900px',
                width: '100%',
                border: 'none',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'rgba(25, 25, 40, 0.9)',
                color: 'white',
                boxShadow: '0 0px 0px rgba(103, 25, 90, 0.2)',
              }}>
              {/* Product Matrix as a grid layout */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridGap: '0px',
                  gridRowGap: '0px',
                  padding: '0px',
                }}>
                {/* EloqKV */}
                <div
                  style={{
                    background: 'rgba(30, 30, 50, 0.7)',
                    borderRadius: '0px',
                    padding: '0',
                    overflow: 'hidden',
                  }}>
                  <Link
                    to="/product/eloqkv"
                    style={{display: 'block', height: '100%'}}>
                    <img
                      src={useBaseUrl('img/homepage/EloqKV-dark.svg')}
                      alt="EloqKV"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '20px 20px 5px 20px',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </Link>
                </div>

                {/* EloqDoc */}
                <div
                  style={{
                    background: 'rgba(30, 30, 50, 0.7)',
                    borderRadius: '0px',
                    padding: '0',
                    overflow: 'hidden',
                  }}>
                  <Link
                    to="/product/eloqdoc"
                    style={{display: 'block', height: '100%'}}>
                    <img
                      src={useBaseUrl('img/homepage/EloqDoc-dark.svg')}
                      alt="EloqDoc"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '20px 20px 5px 20px',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </Link>
                </div>

                {/* EloqSQL */}
                <div
                  style={{
                    background: 'rgba(30, 30, 50, 0.7)',
                    borderRadius: '0px',
                    padding: '0',
                    overflow: 'hidden',
                    marginTop: '-10px',
                  }}>
                  <Link
                    to="/product/eloqsql"
                    style={{display: 'block', height: '100%'}}>
                    <img
                      src={useBaseUrl('img/homepage/EloqSQL-dark.svg')}
                      alt="EloqSQL"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '20px 20px 5px 20px',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </Link>
                </div>

                {/* EloqCloud */}
                <div
                  style={{
                    background: 'rgba(30, 30, 50, 0.7)',
                    borderRadius: '0px',
                    padding: '0',
                    overflow: 'hidden',
                    marginTop: '-10px',
                  }}>
                  <Link
                    to="https://cloud.eloqdata.com/join-waitlist"
                    style={{display: 'block', height: '100%'}}>
                    <img
                      src={useBaseUrl('img/homepage/EloqCloud-dark.svg')}
                      alt="EloqCloud"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '20px 20px 5px 20px',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </Link>
                </div>

                {/* EloqConvergedDB - spans full width */}
                <div
                  style={{
                    gridColumn: '1 / span 2',
                    background: 'rgba(30, 30, 50, 0.7)',
                    borderRadius: '0px',
                    padding: '0',
                    overflow: 'hidden',
                    marginTop: '-10px',
                  }}>
                  <Link
                    to="/product/eloqconvergeddb"
                    style={{display: 'block', height: '100%'}}>
                    <img
                      src={useBaseUrl('img/homepage/EloqConvergedDB-dark.svg')}
                      alt="EloqConvergedDB"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '20px 20px 5px 20px',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </Link>
                </div>
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
                  <h2 className={styles.tieredTitle}>Cosst Effective</h2>
                  <p className={styles.tieredDescription}>
                    EloqKV intelligently manages your data across multiple
                    storage tiers, optimizing both performance and cost. Hot
                    data stays in memory for lightning-fast access, warm data
                    moves to SSD for balanced performance, and cold data is
                    persisted to object storage—all while maintaining seamless
                    access. This multi-tiered approach dramatically reduces TCO.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full ACID Transaction Section */}
          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>ACID Transaction</h2>
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

          {/* High Performance Section */}
          <div className={styles.tieredSection}>
            <div className={styles.tieredInner}>
              <div className={styles.tieredContent}>
                <div className={styles.tieredImageContainer}>
                  <img
                    src="/img/highperf.png"
                    alt="High Performance"
                    className={styles.tieredImage}
                  />
                </div>
                <div className={styles.tieredInfo}>
                  <h2 className={styles.tieredTitle}>High Performance</h2>
                  <p className={styles.tieredDescription}>
                    EloqKV is engineered for high-performance, low-latency
                    applications that demand speed at scale. It delivers
                    blazing-fast distributed transactions, powered by the 1PC
                    protocol. It enables EloqKV to match—and often exceed—the
                    throughput of best-in-class solutions, making it ideal for
                    real-time workloads.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Elastic Section */}
          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>Scalable & Elastic</h2>
                  <p className={styles.acidDescription}>
                    EloqKV is architected for true scalability and elasticity,
                    adapting seamlessly to workload demands. It scales up
                    efficiently across multicore CPUs to maximize single-node
                    performance, and scales out across distributed nodes for
                    high availability and throughput. Clusters can expand
                    dynamically to adapt to unpredictable traffic surges.
                  </p>
                </div>
                <div className={styles.acidImageContainer}>
                  <img
                    src="/img/elastic.png"
                    alt="Scalable & Elastic"
                    className={styles.acidImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Standard API Section */}
          <div className={styles.tieredSection}>
            <div className={styles.tieredInner}>
              <div className={styles.tieredContent}>
                <div className={styles.tieredImageContainer}>
                  <img
                    src="/img/standardapi.png"
                    alt="Standard API"
                    className={styles.tieredImage}
                  />
                </div>
                <div className={styles.tieredInfo}>
                  <h2 className={styles.tieredTitle}>Standard API</h2>
                  <p className={styles.tieredDescription}>
                    EloqKV offers broad compatibility through support for
                    standard APIs, including Redis, SQL, and MongoDB. This
                    multi-model interface empowers developers to integrate
                    EloqKV into existing ecosystems effortlessly—enabling
                    seamless migration with minimal code changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* High Availability Section */}
          <div className={styles.acidSection}>
            <div className={styles.acidInner}>
              <div className={styles.acidContent}>
                <div className={styles.acidInfo}>
                  <h2 className={styles.acidTitle}>High Availability</h2>
                  <p className={styles.acidDescription}>
                    EloqKV is built for high availability and fault tolerance at
                    its core. Data is replicated seamlessly across multiple
                    servers or disks to ensure durability and resilience, even
                    under failure conditions. With built-in support for hot
                    standbys and fast failover, EloqKV can recover from node
                    outages in sub-second.
                  </p>
                </div>
                <div className={styles.acidImageContainer}>
                  <img
                    src="/img/highavail.png"
                    alt="High Availability"
                    className={styles.acidImage}
                  />
                </div>
              </div>
            </div>
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
