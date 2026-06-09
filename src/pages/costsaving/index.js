import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import seoData from '@site/src/data/seo';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import styles from './styles.module.css';

const {seo} = seoData;

const DEFAULT_INPUTS = {
  dataSizeGb: 1000,
  readQps: 80000,
  writeQps: 20000,
  latencyMs: 2,
  bigKeyPercentage: 5,
  readReplicas: 1,
  crossRegionDr: false,
  redisPricePerVcpu: 103.5,
  eloqkvPricePerVcpu: 103.5,
};

const PRESETS = {
  Fintech: {
    dataSizeGb: 1200,
    readQps: 300000,
    writeQps: 120000,
    latencyMs: 2,
    bigKeyPercentage: 2,
    readReplicas: 2,
    crossRegionDr: true,
  },
  Gaming: {
    dataSizeGb: 800,
    readQps: 450000,
    writeQps: 70000,
    latencyMs: 8,
    bigKeyPercentage: 10,
    readReplicas: 1,
    crossRegionDr: false,
  },
  AdTech: {
    dataSizeGb: 2000,
    readQps: 600000,
    writeQps: 180000,
    latencyMs: 3,
    bigKeyPercentage: 5,
    readReplicas: 2,
    crossRegionDr: true,
  },
  'AI Agent Memory': {
    dataSizeGb: 4000,
    readQps: 220000,
    writeQps: 150000,
    latencyMs: 20,
    bigKeyPercentage: 10,
    readReplicas: 1,
    crossRegionDr: true,
  },
};

function numberValue(value, min = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, min) : min;
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CostSavingCalculatorPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const results = useMemo(() => {
    const dataSize = numberValue(inputs.dataSizeGb, 10);
    const readQps = numberValue(inputs.readQps, 0);
    const writeQps = numberValue(inputs.writeQps, 0);
    const latencyMs = numberValue(inputs.latencyMs, 1);
    const bigKeyRatio = numberValue(inputs.bigKeyPercentage) / 100;
    const readReplicas = numberValue(inputs.readReplicas, 0);
    const copyFactor = readReplicas + 1;
    const redisPrice = numberValue(inputs.redisPricePerVcpu);
    const eloqkvPrice = numberValue(inputs.eloqkvPricePerVcpu);

    const redisVcpuMemory = dataSize / 8;
    const redisVcpuQps = (readQps + writeQps) / 50000;
    const redisBaseVcpu = Math.max(redisVcpuMemory, redisVcpuQps);
    const drFactor = inputs.crossRegionDr ? 2 : 1;
    const redisVcpu = redisBaseVcpu * copyFactor * drFactor;
    const redisCost = redisVcpu * redisPrice;

    const eloqBigKeyStorageVcpu = (dataSize * bigKeyRatio) / 8;
    // 360GB NVMe SSD, but copy on write has additional footprint, so we use 120GB as the small key storage.
    const eloqSmallKeyStorageVcpu = (dataSize * (1 - bigKeyRatio)) / 120;
    const eloqStorageVcpu = eloqBigKeyStorageVcpu + eloqSmallKeyStorageVcpu;
    const clampedLatency = Math.min(Math.max(latencyMs, 1), 10);
    const eloqQpsDivisor = 10000 + ((clampedLatency - 1) / 9) * 15000;
    const eloqQpsVcpu = (readQps + writeQps) / eloqQpsDivisor;
    const eloqVcpu = Math.max(eloqStorageVcpu, eloqQpsVcpu) * copyFactor;
    const eloqCost = eloqVcpu * eloqkvPrice;

    const monthlySavings = Math.max(redisCost - eloqCost, 0);
    const savingsPct = redisCost > 0 ? (monthlySavings / redisCost) * 100 : 0;

    return {
      redisVcpu,
      redisCost,
      redisMemoryFootprintGb: redisVcpu * 8,
      eloqVcpu,
      eloqCost,
      eloqDramUsageGb: eloqVcpu * 8,
      monthlySavings,
      savingsPct,
    };
  }, [inputs]);

  const chartData = [
    { name: 'Redis', monthlyCost: results.redisCost, color: '#ff7b2d' },
    { name: 'EloqKV', monthlyCost: results.eloqCost, color: '#17c964' },
  ];

  const onNumberChange = (key, min = 0) => event => {
    setInputs(prev => ({ ...prev, [key]: numberValue(event.target.value, min) }));
  };

  const applyPreset = presetName => {
    const preset = PRESETS[presetName];
    setSelectedPreset(presetName);
    setInputs(prev => ({ ...prev, ...preset }));
  };

  return (
    <Layout
      title={seo.costSaving.title}
      description={seo.costSaving.description}>
      <main className={styles.page}>
        <section className={styles.header}>
          <h1>EloqKV Cost Saving Calculator</h1>
          <p>
            Estimate how much infrastructure cost you can save by replacing
            Redis with EloqKV.
          </p>
        </section>

        <section className={styles.contentGrid}>
          <aside className={styles.panel}>
            <h2>Workload Inputs</h2>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>Data Size (GB)</span>
                <input
                  type="number"
                  min="10"
                  value={inputs.dataSizeGb}
                  onChange={onNumberChange('dataSizeGb', 10)}
                />
              </label>

              <label className={styles.field}>
                <span>Read QPS</span>
                <input
                  type="number"
                  min="0"
                  value={inputs.readQps}
                  onChange={onNumberChange('readQps', 0)}
                />
              </label>

              <label className={styles.field}>
                <span>Write QPS</span>
                <input
                  type="number"
                  min="0"
                  value={inputs.writeQps}
                  onChange={onNumberChange('writeQps', 0)}
                />
              </label>

              <label className={styles.field}>
                <span>P99 Latency Requirement (ms)</span>
                <input
                  type="number"
                  min="1"
                  value={inputs.latencyMs}
                  onChange={onNumberChange('latencyMs', 1)}
                />
              </label>

              <label className={styles.field}>
                <span>Number of Read Replicas</span>
                <input
                  type="number"
                  min="0"
                  value={inputs.readReplicas}
                  onChange={onNumberChange('readReplicas', 0)}
                />
              </label>
            </div>

            <div className={styles.sliderBlock}>
              <div className={styles.sliderLabel}>
                <span>Big Key Percentage (&gt;1MB)</span>
                <strong>{inputs.bigKeyPercentage}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.bigKeyPercentage}
                onChange={onNumberChange('bigKeyPercentage')}
              />
            </div>

            <label className={styles.toggleRow}>
              <span>Cross Region Disaster Recovery Required</span>
              <button
                type="button"
                className={`${styles.toggle} ${inputs.crossRegionDr ? styles.toggleOn : ''
                  }`}
                onClick={() =>
                  setInputs(prev => ({
                    ...prev,
                    crossRegionDr: !prev.crossRegionDr,
                  }))
                }>
                <span />
              </button>
            </label>

            <div className={styles.presets}>
              <span>Example presets</span>
              <div className={styles.presetButtons}>
                {Object.keys(PRESETS).map(presetName => (
                  <button
                    key={presetName}
                    type="button"
                    className={
                      selectedPreset === presetName ? styles.presetActive : ''
                    }
                    onClick={() => applyPreset(presetName)}>
                    {presetName}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={styles.advancedToggle}
              onClick={() => setShowAdvanced(v => !v)}>
              {showAdvanced ? 'Hide' : 'Show'} Advanced Pricing Inputs
            </button>

            {showAdvanced && (
              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Redis price per vCPU ($/month), default instance: z3-highmem</span>
                  <input
                    type="number"
                    min="0"
                    value={inputs.redisPricePerVcpu}
                    onChange={onNumberChange('redisPricePerVcpu', 0)}
                  />
                </label>

                <label className={styles.field}>
                  <span>EloqKV price per vCPU ($/month), default instance: z3-highmem</span>
                  <input
                    type="number"
                    min="0"
                    value={inputs.eloqkvPricePerVcpu}
                    onChange={onNumberChange('eloqkvPricePerVcpu', 0)}
                  />
                </label>
              </div>
            )}
          </aside>

          <section className={styles.panel}>
            <h2>Cost Comparison</h2>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis
                    stroke="#a1a1aa"
                    tickFormatter={value =>
                      new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        compactDisplay: 'short',
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={value => formatMoney(Number(value))}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar
                    dataKey="monthlyCost"
                    radius={[8, 8, 0, 0]}
                    barSize={42}
                    isAnimationActive>
                    {chartData.map(item => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.savings}>
              <h3>You save {formatMoney(results.monthlySavings)} per month</h3>
              <p>{formatCompact(results.savingsPct)}% cost reduction</p>
            </div>

            <div className={styles.breakdownGrid}>
              <article className={styles.breakdownCard}>
                <h4>Redis</h4>
                <ul>
                  <li>Required vCPU: {formatCompact(results.redisVcpu)}</li>
                  <li>
                    Memory footprint: {formatCompact(results.redisMemoryFootprintGb)} GB
                  </li>
                  <li>Total monthly cost: {formatMoney(results.redisCost)}</li>
                </ul>
              </article>

              <article className={styles.breakdownCard}>
                <h4>EloqKV</h4>
                <ul>
                  <li>Required vCPU: {formatCompact(results.eloqVcpu)}</li>
                  <li>Memory footprint: {formatCompact(results.eloqDramUsageGb)} GB</li>
                  <li>Total monthly cost: {formatMoney(results.eloqCost)}</li>
                </ul>
              </article>
            </div>

            <div className={styles.ctaRow}>
              <Link className={styles.ctaSecondary} to="/eloqkv/install-from-binary">
                Install EloqKV →
              </Link>
              <Link className={styles.cta} to="https://cloud.eloqdata.com">
                Try EloqCloud →
              </Link>
            </div>

          </section>
        </section>
      </main>
    </Layout>
  );
}
