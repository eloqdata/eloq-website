---
title: 'EloqKV Core Scaling Analysis'
authors: eloq
date: 2024-08-17
tags: [Benchmark, Performance, Scaling]
image: /img/blog/scaling.jpg
description: Comprehensive analysis of EloqKV's performance scaling with different core counts and event dispatcher configurations in single-node cache mode.
blog: true
---

In this blog, we analyze **EloqKV**'s performance scaling characteristics by evaluating how different core counts and event dispatcher configurations affect throughput and latency. This study provides insights into optimal hardware utilization and helps users understand how to configure **EloqKV** for maximum performance in their specific environments.

<!--truncate-->

All benchmarks were conducted on a high-performance Intel server with Ubuntu 22.04. The [memtier-benchmark](https://github.com/RedisLabs/memtier_benchmark) tool was used to generate workloads with a write-only pattern (ratio=1:0).

## Performance Scaling Analysis

We evaluated **EloqKV** across seven different core and event dispatcher configurations to understand how the system scales with increased parallelism. The configurations tested were: (1,1), (2,1), (4,1), (8,2), (16,4), (32,6), and (48,8), where the first number represents core count and the second represents event dispatcher count.

### Hardware and Software Configurations

Server Machine:

| Service          | Hardware Configuration   | Node count |
| ---------------- | ------------------------ | ---------- |
| EloqKV 0.8.18    | Intel Xeon Platinum 8580 | 1          |
| Client - Memtier | Intel Xeon Platinum 8580 | 1          |

**Detailed Hardware Specifications:**

**CPU:** Intel Xeon Platinum 8580

- **Architecture:** x86_64
- **Total CPUs:** 240 (2 sockets × 60 cores × 2 threads)
- **Sockets:** 2
- **Cores per socket:** 60
- **Threads per core:** 2
- **Base frequency:** 800 MHz
- **Max frequency:** 4000 MHz
- **CPU family:** 6, Model: 207

**Memory & Cache:**

- **L1d Cache:** 5.6 MiB (120 instances)
- **L1i Cache:** 3.8 MiB (120 instances)
- **L2 Cache:** 240 MiB (120 instances)
- **L3 Cache:** 600 MiB (2 instances)

**NUMA Configuration:**

- **NUMA nodes:** 4
- **Node 0:** CPUs 0-29, 120-149
- **Node 1:** CPUs 30-59, 150-179
- **Node 2:** CPUs 60-89, 180-209
- **Node 3:** CPUs 90-119, 210-239

**Key Features:** AVX-512, AMX (Advanced Matrix Extensions), Intel Turbo Boost, Hyper-Threading

**NUMA Isolation Setup:**

To ensure fair and realistic benchmarking, we used NUMA (Non-Uniform Memory Access) binding to isolate the server and client processes:

- **EloqKV Server:** Bound to NUMA node 0 (CPUs 0-29, 120-149)
- **memtier Client:** Bound to NUMA node 3 (CPUs 90-119, 210-239)

This configuration provides several benefits:

- **Process Isolation:** Server and client don't compete for the same CPU cores
- **Memory Locality:** Each process uses memory local to its NUMA node
- **Realistic Testing:** Simulates client-server separation found in production
- **Cache Isolation:** Prevents client operations from polluting server CPU caches

The NUMA binding was achieved using:

```bash
# EloqKV server
numactl --cpunodebind=0 --membind=0 ./eloqkv --config config.ini

# memtier client
numactl --cpunodebind=3 --membind=3 memtier_benchmark [options]
```

We configured **EloqKV** with persistent storage and WAL disabled to focus purely on in-memory performance:

```
# set it to off to turn off persistent storage
enable_data_store=off
# set it to off to turn off WAL
enable_wal=off
```

For each core/dispatcher configuration, we varied the concurrency levels by testing different thread and client combinations: (32,4), (32,8), (32,16), and (32,32), resulting in total concurrency levels of 128, 256, 512, and 1024 respectively.

### Write-Only Workload

We evaluated **EloqKV**'s write performance using `memtier_benchmark` with a 1:0 ratio (write-only) configuration:

```
memtier_benchmark -t 32 -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:0 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=60
```

#### Results

Below are the key findings from our scaling analysis:

**Throughput Scaling by Core Count:**

| Cores | Dispatchers | Peak Average Ops/sec | Peak Concurrency |
| ----- | ----------- | -------------------- | ---------------- |
| 1     | 1           | 96,664               | 128              |
| 2     | 1           | 168,984              | 128              |
| 4     | 1           | 313,996              | 256              |
| 8     | 2           | 575,973              | 512              |
| 16    | 4           | 1,112,729            | 512              |
| 32    | 6           | 1,963,683            | 1024             |
| 48    | 8           | 2,529,706            | 1024             |

**Metric Definitions:**

- **Peak Average Ops/sec:** The highest average operations per second achieved for each core/dispatcher configuration. This represents the best sustained throughput measured over a 60-second test window across tested concurrency levels (128, 256, 512, and 1024 total connections).

- **Peak Concurrency:** The total number of concurrent connections (calculated as threads × clients per thread) at which the peak average ops/sec was achieved. This indicates the optimal client load for each server configuration.

**Latency Performance:**

The latency profile at peak performance shows excellent characteristics across all configurations:

| Cores | Dispatchers | P50 (ms) | P99 (ms) | P99.9 (ms) | At Peak Ops/sec |
| ----- | ----------- | -------- | -------- | ---------- | --------------- |
| 1     | 1           | 1.32     | 1.55     | 2.64       | 96,664          |
| 2     | 1           | 0.75     | 1.20     | 1.52       | 168,984         |
| 4     | 1           | 0.77     | 1.49     | 1.86       | 313,996         |
| 8     | 2           | 0.80     | 2.38     | 2.99       | 575,973         |
| 16    | 4           | 0.45     | 0.99     | 1.38       | 1,112,729       |
| 32    | 6           | 0.46     | 1.54     | 2.24       | 1,963,683       |
| 48    | 8           | 0.39     | 0.82     | 1.52       | 2,529,706       |

### Concurrency Impact Analysis

For each core configuration, we analyzed how increasing concurrency affects performance:

**Low Core Count (1-4 cores):**

- Performance peaks at lower concurrency levels (128-256 total connections)
- Higher concurrency shows diminishing returns due to contention
- P99.9 latency at peak performance ranges from 1.52-2.64ms

**Medium Core Count (8-16 cores):**

- Optimal performance at moderate concurrency (512 total connections)
- Excellent latency characteristics with P99.9 latency of 1.38-2.99ms at peak performance
- Good scalability with concurrent load

**High Core Count (32-48 cores):**

- Can handle high concurrency (1024 total connections) effectively
- P99.9 latency of 1.52-2.24ms at peak throughput
- Exceptional throughput scaling, reaching 2.5M+ ops/sec

### Analysis and Insights

#### Near-Linear Core Scaling

**EloqKV** demonstrates impressive scaling characteristics, achieving near-linear performance improvements with increased core count up to 16 cores. From 1 to 16 cores, we observe an 11.5x improvement in throughput, indicating efficient utilization of additional CPU resources.

#### Latency Consistency

**EloqKV** maintains excellent latency characteristics across all configurations. P99.9 latency at peak performance ranges from 1.38ms to 2.99ms across all core counts, with the system consistently delivering sub-3ms P99.9 latency even at maximum throughput levels, demonstrating the effectiveness of the multi-threaded architecture.

#### Diminishing Returns at High Core Counts

While **EloqKV** continues to scale beyond 32 cores, the improvement rate decreases. The jump from 32 to 48 cores shows only a 29% improvement (from 1.96M to 2.53M ops/sec), suggesting that other factors like memory bandwidth or networking become limiting factors.

### Conclusion

**EloqKV**'s multi-threaded architecture demonstrates exceptional scaling characteristics, effectively utilizing modern multi-core hardware. The system maintains low latency while achieving impressive throughput improvements, making it suitable for high-performance caching scenarios.

The benchmark results show that **EloqKV** can scale from modest single-core deployments to high-performance multi-core configurations, with the flexibility to optimize for different hardware environments. The consistent low-latency performance (1.38-2.99ms P99.9 at peak throughput) makes **EloqKV** an excellent choice for applications requiring high concurrency.

This scaling analysis validates **EloqKV**'s design principles and demonstrates its capability to efficiently utilize modern server hardware, providing a strong foundation for building high-performance data infrastructure.
