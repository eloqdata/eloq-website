/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect} from 'react';
import GitHubButton from 'react-github-btn';

import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Layout from '@theme/Layout';

const textContent = {
  intro: `
  EloqSQL maintains compatibility with the MySQL protocol by leveraging the existing MySQL Parser and Executor as its compute engine. However, it replaces the Innodb storage engine with the enhanced Data Substrate. This advanced engine provides support for various transaction isolation levels, concurrency control protocols, distributed buffer pools, data persistence, and high availability, offering a more robust and scalable solution.
  `,
  nativeCode: `
React primitives render to native platform UI, meaning your app uses the
same native platform APIs other apps do.
<br/><br/>
<strong>Many platforms</strong>, one React. Create platform-specific versions of components
so a single codebase can share code across platforms. With React Native,
one team can maintain multiple platforms and share a common technology—React.
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
      your app’s code.
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
that map directly to the platform’s native UI building blocks.
  `,
  crossPlatform: `
React components wrap existing native code and interact with native APIs via
React’s declarative UI paradigm and JavaScript. This enables native app development
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
  elasticlog: `
  Write-intensive workloads demand highly scalable logging services. Traditional databases write and fsync redo logs to a single disk in the order of their sequence number, creating a bottleneck for the entire system. EloqSQL's patented one-phase commit technique allows concurrent transactions to write and synchronize redo logs to multiple disks in parallel. Benchmarks demonstrate a 4x improvement in transactions per second compared to MySQL.
  `,
  elasticmem: `
  Read-intensive workloads demand highly scalable memory resources. To minimize read latency, keeping all hot data in memory is crucial. EloqSQL supports both hash and range partitioning, enabling it to store vast amounts of hot data across multiple hosts. As the hot data volume increases, EloqSQL can automatically scale out the cluster and rebalance the data range. Additionally, cold data is periodically checkpointed to key-value stores, which can serve cache miss read.
  `,
  decouplestore: `
  Large datasets necessitate a decoupled storage layer that can be scaled independently of read and write traffic. Allocating additional compute and memory resources for cold data is wasteful. Traditional shared-nothing architectures require adding more compute nodes as data volume increases, even if read and write traffic remain constant. EloqSQL's decoupled cloud storage allows you to pay only for the disk space and IOPS costs associated with cold data, leading to cost savings and efficient resource utilization.
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

function HomeCallToAction() {
  return (
    <>
      <ActionButton
        type="primary"
        href={useBaseUrl('eloqdb/cluster-deployment.html')}
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
  return <img alt="" src={useBaseUrl('img/nologo.png')} />;
}

function HeaderHero() {
  return (
    <Section background="dark" className="HeaderHero">
      {/*<div className="socialLinks">
        <TwitterButton accountName="reactnative" />
        <GitHubStarButton />
  </div>*/}
      <TwoColumns
        reverse
        columnOne={<LogoAnimation />}
        columnTwo={
          <>
            <h1 className="title">EloqSQL</h1>
            <p className="tagline">
              A distributed SQL database powered by Data&nbsp;Substrate. Elastic
              at any scale for any workload.
            </p>
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
        reverse
        columnOne={
          <TextColumn title="MySQL Compatible" text={textContent.intro} />
        }
        columnTwo={
          <img alt="" src={useBaseUrl('img/homepage/mysqlcompatible.png')} />
        }
      />
    </Section>
  );
}

function ElasticLogging() {
  return (
    <Section className="NativeApps" background="tint">
      <TwoColumns
        columnOne={
          <TextColumn
            title="Elastic Parallel Logging"
            text={textContent.elasticlog}
          />
        }
        columnTwo={
          <img alt="" src={useBaseUrl('img/homepage/elasticlogging2.png')} />
        }
      />
    </Section>
  );
}
function ElasticMemory() {
  return (
    <Section className="NativeApps" background="light">
      <TwoColumns
        reverse
        columnOne={
          <TextColumn
            title="Elastic Memory Cache"
            text={textContent.elasticmem}
          />
        }
        columnTwo={
          <img alt="" src={useBaseUrl('img/homepage/elasticcache.png')} />
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
          <TextColumn
            title="Decoupled Cloud Storage"
            text={textContent.decouplestore}
          />
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
    <Section className="GetStarted" background="dark">
      <div className="content">
        <Heading text="Give it a try" />
        <ol className="steps">
          <li>
            <p>Run this</p>
            <div className="terminal">
              <code>npx react-native init MyTestApp</code>
            </div>
          </li>
          <li>
            <p>Read these</p>
            <HomeCallToAction />
          </li>
        </ol>
      </div>
    </Section>
  );
}

const useHomePageAnimations = () => {
  useEffect(() => setupHeaderAnimations(), []);
  useEffect(() => setupDissectionAnimation(), []);
};

const Index3 = () => {
  return (
    <Layout
      description="A framework for building native apps using React"
      wrapperClassName="homepage">
      <Head>
        <title>MonoStrate · Modular Database</title>
        <meta property="og:title" content="MonoStrate · Modular Database" />
        <meta
          property="twitter:title"
          content="MonoStrate · Modular Database"
        />
      </Head>
      <HeaderHero />
      <NativeApps />
      <ElasticLogging />
      <ElasticMemory />
      <DecoupleStore />
    </Layout>
  );
};

export default Index3;
