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
        href={useBaseUrl('/blog/2024/08/16/eloqkv')}
        target="_self">
        了解更多
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
        快速开始
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
      关注 @{accountName}
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
        星标
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
        <h2 className="Heading">体验我们的尖端产品</h2>
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
    title: '高性能',
    details: [
      '当数据适合内存且关闭持久性时，性能可媲美最佳内存数据存储',
      '开启持久性时，性能显著优于其他持久化键值存储',
    ],
    link: 'blog/2024/08/17/benchmark-single-node',
  },
  {
    icon: faDollarSign,
    title: '低成本',
    details: [
      '利用快速 SSD 存储超出内存容量的数据',
      '在云中利用分层存储进一步降低成本，同时保持冷数据的亚秒级访问延迟',
    ],
    link: 'blog/2024/08/16/eloqkv#performance-and-cost',
  },
  {
    icon: faExpandArrowsAlt,
    title: '可扩展且弹性',
    details: [
      '利用多核处理实现纵向扩展，并通过集群中多个节点实现横向扩展',
      '根据工作负载变化支持动态扩展，而不会中断服务（目前处于 Beta 测试阶段）',
    ],
    link: 'blog/2024/08/16/eloqkv#scale-as-you-need-on-what-you-need',
  },
  {
    icon: faExchangeAlt,
    title: '完整 ACID',
    details: [
      '具备完整 ACID 特性的分布式事务键值存储',
      'Redis 事务命令在单节点和集群模式下均支持相同的语义',
    ],
    link: 'blog/2024/08/16/eloqkv#full-acid-transactions-when-you-need-them',
  },
  {
    icon: faCheckCircle,
    title: '高可用性',
    details: [
      '将数据复制到多个服务器以提供容错能力',
      '支持热备份，以便在几秒内恢复故障（目前处于 Beta 测试阶段）',
    ],
    link: 'eloqkv/quick-start-ha',
  },
  {
    icon: faRedoAlt,
    title: 'Redis Compatible API',
    details: [
      '实现 Redis API，支持大多数流行的数据结构',
      '无需修改代码，应用程序即可享受 EloqKV 丰富的功能和降低成本的优势',
    ],
    link: 'eloqkv/kvstore_compatibility',
  },
];

const Index = () => {
  return (
    <Layout
      description="Build the Next Generation of Databases the Right Way"
      wrapperClassName="homepage">
      <Head>
        <title>EloqData: Next Generation of Databases</title>
        <meta
          property="og:title"
          content="EloqData: Next Generation of Databases"
        />
        <meta
          property="twitter:title"
          content="EloqData: Next Generation of Databases"
        />
      </Head>

      <div class="container1">
        <div class="product-columns">
          <div class="product-left-column">
            <h1 className="title">EloqKV</h1>
            <p className="tagline">革命性的分布式键值数据库</p>
            <p className="taglinecolor">
              <Typed strings={['- 高性能']} typeSpeed={5} />
            </p>
            <p className="taglinecolor">
              <Typed strings={['- 完整 ACID 支持']} typeSpeed={10} />
            </p>
            <p className="taglinecolor">
              <Typed strings={['- 可扩展且弹性']} typeSpeed={8} />
            </p>
            <p className="taglinecolor">
              <Typed strings={['- 云原生']} typeSpeed={3} />
            </p>
            <div className="buttons">
              <HomeLearnMore />
              <span style={{width: '40px', display: 'inline-block'}}></span>
              <HomeCallToAction />
            </div>
          </div>
          <div class="product-right-column">
            <img
              alt=""
              src={useBaseUrl('img/monograph_website_hero.svg')}
              type="image/svg+xml"
              width="800"
              heigh="auto"
            />
          </div>
        </div>
      </div>

      <div className="feature-section">
        {features.map((feature, index) => (
          <a href={useBaseUrl(feature.link)} key={index}>
            <div className="feature-card" key={index}>
              <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
              <h3>{feature.title}</h3>
              <ul>
                {feature.details.map((detail, i) => (
                  <p>{detail}</p>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>
    </Layout>
  );
};

export default Index;
