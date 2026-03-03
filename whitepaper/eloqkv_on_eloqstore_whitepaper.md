# EloqKV: Memory Performance, SSD Cost, 10X Savings, Redis-Compatible Key-Value Store

## **Introduction**

EloqKV is a next-generation key-value store that combines the performance of memory with the cost-efficiency of SSDs. Designed as a primary database rather than just a temporary cache, EloqKV guarantees uncompromised durability and prevents data loss. It is fully compatible with existing Redis clients and tools, enabling organizations to migrate seamlessly with zero application refactoring or code changes. By replacing expensive DRAM with NVMe SSDs, EloqKV solves the scalability limits of standard Redis while delivering massive cost reductions.

---

## **Core Feature Highlights**

### **The "Killing Feature": 10x Cost Savings**

EloqKV allows enterprises to achieve 10x cost savings without compromising on speed. It is optimized for all Redis data structures, providing the performance of RAM at the cost of SSDs. These cost savings are realized in memory-bound workloads, specifically for data volumes of 100GB+ operating under 20K to 100K QPS.

### **Uncompromised Durability & Consistency**

Unlike standard in-memory caches, EloqKV is a primary database grade solution.

* It ensures full data persistence guarantees using Write-Ahead Logging (WAL).


* It eliminates cache coherence issues.


* It provides native distributed capabilities, supporting multi-exec and Lua scripts across nodes—a feature standard Redis cannot handle.


* It offers full distributed transaction support, ensuring consistent states across the cluster for cross-node transactions.



### **Latency Optimized & Stable at Scale**

Standard Redis environments often suffer from performance degradation during snapshots and memory scaling limits. EloqKV solves this:

* **Zero-Forking:** It uses incremental checkpointing to only flush dirty entries, completely eliminating memory forking.


* **Predictable Performance:** This approach ensures smooth performance even during snapshots and results in zero impact on P9999 latency.


* **No Memory Cap:** EloqKV effortlessly supports nodes larger than 50GB, a threshold where standard Redis fails psync with RDB generation.


* **Robust Standby:** Standby nodes join seamlessly without overwhelming primary node resources, preventing the vicious cycle of "Write Buffer OOM -> Rejoin -> Fail" (rejoin storms) common in large memory settings.



### **Simplified Disaster Recovery & Fast Branching**

* **Disaster Recovery (DR):** EloqKV simplifies DR by utilizing object storage support with cross-region replication. It requires no Redis Stream or Kafka as an intermediate layer, features no wasted CPU for standby regions, and provides low-cost protection against region failures.


* **Branch in Seconds:** Teams can leverage object storage to create database branches instantly, making it ideal for testing and development. It supports 100TB+ datasets and utilizes zero-copy cloning technology.



---

## **Performance Benchmarks**

EloqKV is rigorously tested to ensure it meets enterprise latency and throughput demands on SSD infrastructure.

* **Hardware Profile:** Benchmarks were run on GCP Z3 16vcore, 128GB RAM, and 2.9TB SSD * 2.


* **High Throughput:** When scaling from DRAM-level (20GB) to SSD-level (200GB-2TB) datasets, EloqKV sustained 600K QPS for DRAM access and 300K QPS for pure disk access.


* **Extreme Low Latency:** On a 2TB dataset (800 million keys, 2.5KB avg size) using only 100GB of DRAM under a 100K QPS workload, EloqKV kept P9999 latency extremely low (between 1.5ms and 3.1ms depending on the read/write ratio).


* **Linear Scale Out:** It supports linear scaling (10x nodes = 10x throughput), is fully compatible with Redis smart clients, and supports routing at the client side.


### Hardware and Software

The deployment details is as follows:

| Service type | Node type     | Node count | Disk count |
| ------------ | ------------- | ---------- | ---------- |
| Redis        | z3-highmem-16 | 1          | 2.9TB\*1   |

| Service type | Node type     | Node count | Disk count |
| ------------ | ------------- | ---------- | ---------- |
| EloqKV       | z3-highmem-16 | 1          | 2.9TB\*1   |

### **Benchmark Method**

Tool: `memtier_benchmark`.

Commands:

```
memtier_benchmark -s $SERVER_PRIVATE_IP --distinct-client-seed --hide-histogram --ratio 1:0 -t 10 -c 10 --test-time=300
memtier_benchmark -s $SERVER_PRIVATE_IP --distinct-client-seed --hide-histogram --ratio 0:1 -t 10 -c 10 --test-time=300
```

### **Results**

We conducted two benchmarks.

**Benchmark 1: EloqKV vs Redis across data volume (throughput and P99.99 latency).**

<p align="center">
<img src="./benchmark/eloqkv_redis_read.png" alt="drawing" width="400"/>
</p>

Traditional DRAM-based systems like Redis are strictly limited by physical memory capacity. As shown above, while Redis is restricted to smaller datasets, EloqKV breaks this barrier by leveraging NVMe without the tail-latency penalty typically associated with disks. At 20GB and 100GB, EloqKV provides higher throughput than Redis while maintaining a near-identical P99.99 latency profile. When data size exceeds main memory size, Redis fails while EloqKV continues to scale. Even with a 2TB dataset, EloqKV maintains a stable P99.99 latency of a few milliseconds, a performance previously thought possible only in pure DRAM environments.

**Benchmark 2: EloqKV vs Apache KvRocks long-tail latency across workloads.**

<p align="center">
<img src="./benchmark/eloqkv_kvrocks_2tb.png" alt="drawing" width="400"/>
</p>

For comparison, we also tested KvRocks, a solution that supports SSD serving. The P99.99 latency grows out of control as IO-intensive operations interfere with read latencies (note the log scale). By solving the P99.99 latency problem on SSDs, EloqKV allows businesses to scale their data footprint by orders of magnitude without sacrificing the sub-millisecond responsiveness their users demand. To manage a 2TB dataset with Redis, an organization would typically need a cluster of 20 nodes to provide enough RAM. EloqKV delivers the same long-tail latency reliably on a single NVMe-optimized node, slashing infrastructure costs by 20x.



---

## **Key Technical Use Cases**

### **1. Session Manager**

* **The Need:** High-speed access for user session data.


* **The Scale:** Managing 100 million sessions at 2KB each requires 200GB of capacity.


* **The EloqKV Advantage:** Session management is heavily dependent on reading the entire key; EloqKV maintains extremely low long-tail latency for 2KB random reads while delivering a 10x TCO reduction by using NVMe SSDs instead of DRAM.



### **2. Shopping Cart**

* **The Need:** Reliable persistence for e-commerce carts.


* **The Scale:** Managing 100 million active carts averaging 10 items (500 Bytes each) requires 500GB of capacity.


* **The EloqKV Advantage:** By mapping naturally to the Redis Hash data structure, it allows granular modifications (like altering individual SKU quantities via atomic HINCRBY) without reading or writing the entire cart object. It easily handles read-heavy operations like global navigation bar rendering.



### 3. **Feature Store**

* **The Need:** Low latency serving for ML models.


* **The EloqKV Advantage:** Ideal for scatter-gather inference patterns, enabling rapid MGET enrichment from Redis before passing data to ranking models via TensorFlow.
