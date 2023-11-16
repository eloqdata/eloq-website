import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { translate } from '@docusaurus/Translate';

const ModularArchitecture = translate({message: 'Modular Architecture',})
const FeatureList = [
  {
    title: translate({message: 'Modular Architecture',}),
    Svg: require('@site/static/img/module.svg').default,
    description: (
      translate({message: 'MonoStrate supports multi-model data analysis and supplies a unified data platform by embedding diffenrent data engines in a pluggable way.'})
    ),
  },
  {
    title: translate({message: 'High Performance',}),
    Svg: require('@site/static/img/highperf.svg').default,
    description: (
	translate({message: 'MonoStrate enables high query performance and data injestion speed with scalable memory and logging layer.'})
    ),
  },
  {
    title: translate({message: 'Low Cost',}),
    Svg: require('@site/static/img/costsave.svg').default,
    description: (
        translate({message: 'Serverless architecture enables a cost effective pay mode. Hot data only access Data Substrate which reduces the IOPS of the storage layer.'})
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
