---
title: 'Benchmarking EloqKV: Exploring Memory Cache Mode'
authors: eloq
date: 2024-08-13
tags: [Company]
---

**EloqKV** is a Redis API-compatible, transactional, distributed key-value database designed for scalability, high througput and low latency.

In this blog, we will benchmark **EloqKV** in its memory cache mode, focusing first on single-node performance and later discussing its scalability in cluster mode. The benchmarks are conducted using the memtier-benchmark tool, evaluating write-only, read-only, and mixed write-read workloads.

## Single Node Performance

In the first scenario, we compare the performance of EloqKV with DragonflyDB. The goal of this comparison is to evaluate the performance of EloqKV in pure memory mode, without enabling persistent storage and transactional features.

### Hardware and Software Specification

The benchmark was conducted on AWS EC2 instances with the following deployment details:

Server Machine:

| Service type | Node type   | Node count |
| ------------ | ----------- | ---------- |
| DragonflyDB  | c7g.8xlarge | 1          |

| Service type | Node type   | Node count |
| ------------ | ----------- | ---------- |
| EloqKV       | c7g.8xlarge | 1          |

Client Machine:

| Service type | Node type    | Node count |
| ------------ | ------------ | ---------- |
| Memtier      | c6gn.8xlarge | 1          |

**Software version:**

- OS version: Ubuntu 22.04
- Memtier client version: placeholder
- EloqKV version: 0.6.5
- DragonflyDB version: placeholder

### Software Deployment and Configuration

Follow link [Get Started](/eloqkv/install-from-binary) to setup EloqKV.

Follow link [Install from Binary](https://www.dragonflydb.io/docs/getting-started/binary) to setup Dragonflydb.

### Experiment I: Write-Only Workload

To assess EloqKV’s write performance, we run memtier_benchmark with ratio of 1:0 (write-only) with the following configuration:

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:0 --key-prefix="kv_" --key-minimum=1 --key-maximum=50000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- Thread Number (-t): Number of threads for parallel execution.
- Client Number (-c): Number of clients per thread. Total concurrency is thread_num \* client_num.
- Ratio (--ratio): 1:0 for write-only workload.

#### Results

Below are the results of the write-only workload, presented in a graph that illustrates the EloqKV & Dragonflydb's throughput and latency across varying thread numbers, simulating different levels of concurrent database access.

X-axis: Represents the varying thread numbers employed during the benchmark, simulating different levels of concurrent database access.

Left Y-axis: Measures the QPS (Queries Per Second).

Right Y-axis: Measures the Latency (P99).

<p align="center">
<div style={{ width: '600px', textAlign: 'center'}}>
![](img/eloqkv_kvrocks_ycsba.png)
</div>
</p>

**EloqKV** delivers high throughput and low latency, comparable to DragonflyDB, under different concurrency levels (100, 200, 500), making it a robust cache solution for write-heavy scenarios.

### Experiment II: Read-Only Workload

For the read-only workload, we adjusted the ratio to 0:1 (read-only):

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=0:1 --key-prefix="kv_" --key-minimum=1 --key-maximum=50000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- Ratio (--ratio): Set to 0:1 for read-only operations.

**EloqKV** performs equally well as DragonflyDB under heavy read loads, with high throughput and minimal latency, confirming its efficiency in read-dominant environments.

### Experiment III: Mixed Write-Read Workload

Finally, the mixed workload with a 1:1 ratio:

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:1 --key-prefix="kv_" --key-minimum=1 --key-maximum=50000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- Ratio (--ratio): Set to 1:1 for balanced write-read operations.

Even in this balanced scenario, EloqKV demonstrates throughput and latency on par with DragonflyDB, proving its capability to handle mixed workloads efficiently.

## Scaling to Cluster Mode

While this blog focuses on single-node performance, the next post will delve into the scalability of EloqKV when deployed in cluster mode. We will explore how it handles distributed workloads, providing insights into its capability to maintain performance as it scales horizontally.

Stay tuned for our upcoming benchmarks on EloqKV's cluster mode performance!
