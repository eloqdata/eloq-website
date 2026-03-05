# Table of Contents

- **EloqKV**
  - Introduction
  - Architecture
  - Core Features
  - Benchmark Report
  - Use Case
- **Appendix**
  - Assemble your database using Data Substrate

<p align="center">
<br/><br/>
<br/><br/>
<img src="./media/background.png" alt="drawing" width="720"/>
</p>

<div style="page-break-after: always;"></div>

# EloqKV: Redis-Compatible Key-Value Store with Memory-Like Performance and SSD Economics

## **Introduction**

EloqKV is a next-generation, Redis-compatible key–value database that delivers memory-class performance at SSD cost. Unlike traditional in-memory caches, EloqKV is designed and operated as a **primary, durable data store** rather than a best-effort cache. It guarantees data persistence, provides strong consistency across a distributed cluster, and integrates seamlessly with existing Redis clients and tooling—typically requiring **no application code changes**.

By replacing expensive DRAM with NVMe SSDs for the majority of the data footprint, EloqKV removes the hard capacity ceiling of DRAM-based systems while delivering up to **10x lower total cost of ownership (TCO)** for large-scale workloads.

---

## **Achitecture**

EloqKV is a Redis-compatible distributed key value store powered by Data Substrate. Its architecture includes a frontend compute engine compatible with the Redis protocol. Within Data Substrate, the TxService is responsible for caching hot data and managing transaction processing, while the LogService handles data persistence. LogService replicas are distributed across different availability zones (AZs) to ensure tolerance to AZ-level failures. The underlying storage layer supports pluggable key-value (KV) storages, such as EloqStore, AWS DynamoDB, Google Bigtable, and Cassandra. These storage services store cold data for cache misses and provide high availability for baseline data.

<p align="center">
<img src="./media/eloqkvarch.png" alt="drawing" width="400"/>
</p>

---

## **Core Features**

### **10x Cost Efficiency at Scale**

EloqKV is optimized for standard Redis data structures and access patterns, but is architected around SSD-native data management. For memory-bound workloads in the **100 GB–100‑TB** range per cluster, EloqKV:

- **Offloads cold and warm data to NVMe SSDs** while keeping hot working sets in DRAM.
- **Preserves Redis-like latency characteristics**, even when the total dataset is far larger than memory.
- **Reduces infrastructure footprint by up to 10x**, often replacing large Redis clusters with a small number of NVMe‑optimized nodes.

This allows teams to scale capacity based on SSD pricing, not DRAM constraints.

### **Primary-Database Durability and Consistency**

EloqKV is engineered as a database-grade system, not just a cache:

- **Write-Ahead Logging (WAL)** ensures durable, crash-safe persistence for every write.
- **No cache-invalidation complexity**: applications read and write to a single source of truth rather than a cache layered on top of another database.
- **Native distributed execution** supports multi-key transactions (`MULTI/EXEC`) and Lua scripts across shards—capabilities that are difficult or unsafe to achieve with standard Redis deployments.
- **Cluster-wide transactional semantics** maintain consistent state for cross-node transactions, enabling EloqKV to back mission-critical online systems.

### **Latency-Optimized and Stable Under Pressure**

Conventional Redis clusters often experience latency spikes during background operations (fork-based snapshots, large RDB generation, or replica resync) and hit practical limits when per-node memory grows large. EloqKV avoids these pitfalls:

- **Zero-fork checkpointing** incrementally flushes only dirty entries, eliminating costly memory fork operations.
- **Predictable long-tail latency**: checkpointing and compaction are carefully scheduled to avoid impacting the P99–P9999 latency profile.
- **No practical per-node memory ceiling**: EloqKV comfortably supports nodes with **50 GB+** of DRAM while safely managing multi‑TB datasets on SSDs.
- **Robust replica join and recovery**: standby nodes join without overwhelming primaries, avoiding the “rejoin storm” patterns of large Redis clusters (write-buffer OOM → rejoin → fail).

### **Simplified Disaster Recovery and Instant Branching**

EloqKV is built for cloud-native resilience and rapid iteration:

- **Disaster Recovery (DR) via object storage**: periodic snapshots are streamed directly to cloud object storage with cross-region replication. This avoids the need for auxiliary systems like Redis Streams or Kafka for log shipping, and keeps standby regions nearly cost-free until failover.
- **Branching in seconds**: teams can create isolated, fully functional database branches from object storage snapshots using **zero-copy cloning**. This enables realistic staging, load testing, and experimentation even on **100 TB+** datasets without duplicating physical storage.

---

## **Performance Benchmarks**

EloqKV has been extensively benchmarked on NVMe SSD infrastructure to validate latency and throughput under realistic load.

- **Hardware profile**: Tests were run on Google Cloud `z3-highmem-16` instances with **16 vCPUs, 128 GB RAM**, and **2.9 TB NVMe SSD × 2**.
- **High throughput at DRAM and SSD scale**: Across dataset sizes from **20 GB (DRAM-sized)** to **200 GB–2 TB (SSD-sized)**, EloqKV sustained **~600K QPS** for DRAM-resident access and **~300K QPS** when serving purely from disk.
- **Consistently low long-tail latency**: On a **2 TB** dataset (~800 million keys, 2.5 KB average value size) with only **100 GB of DRAM** and **100K QPS**, EloqKV maintained **P99.99 latency between 1.5 ms and 3.1 ms**, depending on the read/write mix.
- **Linear horizontal scale-out**: Throughput scales roughly linearly with node count (e.g., 10× nodes ≈ 10× throughput). EloqKV remains **compatible with Redis smart clients** and supports client-side routing across shards.

### **Hardware and Software Setup**

The benchmark configuration is summarized below:

| Service type | Node type     | Node count | Disk configuration |
| ------------ | ------------- | ---------- | ------------------ |
| EloqKV       | z3-highmem-16 | 1          | 2.9 TB × 1 NVMe    |
| Redis        | z3-highmem-16 | 1          | 2.9 TB × 1 NVMe    |
| KvRocks      | z3-highmem-16 | 1          | 2.9 TB × 1 NVMe    |

### **Benchmark Methodology**

All benchmarks used `memtier_benchmark` with the following representative commands:

```bash
# load data
memtier_benchmark -t 10 -c 5 -s $SERVER_PRIVATE_IP -p 6379 -n allkeys --distinct-client-seed --ratio=1:0 --key-prefix="kvkeyprefix_" --key-minimum=1 --key-maximum=2000000000 --random-data --data-size=1000 --hide-histogram --key-pattern=P:P
# query data
memtier_benchmark -t 10 -c 5 -s $SERVER_PRIVATE_IP -p 6379 --distinct-client-seed --ratio=5:95 --key-prefix="kvkeyprefix_" --key-minimum=1 --key-maximum=2000000000 --random-data --data-size=1000 --hide-histogram --print-percentiles=50,99,99.9,99.99 --test-time=360 --randomize --rate-limit=2000
```

We ran multiple workloads to compare EloqKV against Redis and other SSD-capable systems.

### **Results**

**Benchmark 1 – EloqKV vs. Redis across dataset sizes (throughput and P99.99 latency):**

<p align="center">
<img src="./benchmark/eloqkv_redis_read.png" alt="EloqKV vs Redis benchmark" width="400"/>
</p>

Traditional DRAM-centric systems such as Redis are fundamentally limited by memory capacity. As dataset size approaches node memory, operators are forced to either overprovision DRAM or shard aggressively. In our tests, Redis delivered good performance at small sizes but could not scale beyond memory capacity, while EloqKV continued to operate smoothly by leveraging NVMe.

At **20 GB** and **100 GB**, EloqKV delivered **higher throughput than Redis** with a nearly identical P99.99 latency profile. Once the dataset exceeded memory capacity, Redis failed to handle the workload, whereas EloqKV scaled out to **2 TB** while keeping P99.99 latency stable at a few milliseconds—performance previously achievable only with DRAM-only architectures.

**Benchmark 2 – EloqKV vs. Apache KvRocks (long-tail latency across workloads):**

<p align="center">
<img src="./benchmark/eloqkv_kvrocks_2tb.png" alt="EloqKV vs KvRocks benchmark" width="400"/>
</p>

We also compared EloqKV to Apache KvRocks, another SSD-serving key–value store. Under IO‑intensive workloads, KvRocks exhibited rapidly increasing P99.99 latency as background operations interfered with foreground reads (note the log scale on the chart). EloqKV, by contrast, kept P99.99 latency bounded and predictable.

To host a **2 TB** dataset with Redis, organizations typically deploy **~20 nodes** to get enough aggregate DRAM. EloqKV achieves comparable or better long-tail latency on a **single NVMe-optimized node**, reducing infrastructure cost by up to **20x** while simplifying operations substantially.

---

## **Key Technical Use Cases**

### **1. AI Chat History for a Leading Smartphone Manufacturer**

- **Scenario:** A top global smartphone manufacturer powers AI chat assistants across hundreds of millions of devices. Unlike traditional human-to-human chat, AI conversations generate much larger messages that bundle prompts, system context, and model outputs. Over time, this dramatically increases the volume of chat history that must be stored and retrieved in real time.
- **Challenge with previous solution:** The customer previously ran this workload on **AWS ElastiCache for Redis**. Because Redis keeps the full dataset in DRAM, the growing prompt and message history drove cluster memory requirements—and therefore cost—up sharply.
- **EloqKV deployment:** By migrating to EloqKV, the customer kept hot conversation state in memory while safely tiering the rest of the history to NVMe SSDs, all behind a Redis-compatible interface.
- **Outcome:** The customer achieved approximately **10x cost reduction** compared to their previous ElastiCache deployment, while maintaining the low-latency experience required for interactive AI chat.

<p align="center">
<img src="./benchmark/eloqkvaichat.png" alt="EloqKV vs KvRocks benchmark" width="400"/>
</p>

### **2. Feature Store for Large-Scale E‑Commerce Recommendations**

- **Scenario:** A major e‑commerce platform maintains a feature store containing **billions of product SKUs** and associated features (pricing, inventory, embeddings, and user–item interaction signals). Each recommendation request needs to fetch feature vectors for **up to 1,000 SKUs in a single call**, with a strict **P99 latency SLA of < 20 ms**.
- **Challenge with previous solution:** The feature store was previously implemented on Redis. To meet latency targets, the team stored the entire feature set in DRAM across a large Redis cluster. This resulted in very high memory costs and operational complexity as product and feature counts grew.
- **EloqKV deployment:** The company migrated the feature store to EloqKV, using Redis-compatible data structures for fast scatter–gather access patterns. Hot features remain in DRAM, while the much larger tail of SKUs is served directly from NVMe SSDs without violating latency SLAs.
- **Outcome:** EloqKV **reduced DRAM usage and cluster size by roughly 10x** while continuing to meet the **P99 < 20 ms** requirement for 1,000‑SKU fetches. This enabled the team to scale the recommendation system economically as catalog size and model complexity increased.

### **3. Social Graph Storage for a Large Social Media Platform**

- **Scenario:** A social media company stores user friendship and follow relationships for hundreds of millions of users. The social graph currently occupies around **500 GB** and is projected to grow to **1 TB+**. Friendship data is accessed extremely frequently whenever a user is online—for feed generation, mutual-friend suggestions, and safety checks.
- **Challenges with previous solutions:**
  - With **Redis**, all online and offline friendship edges had to be kept fully in memory. This was expensive and still required a separate MySQL cluster for persistence and recovery.
  - The company later migrated to **Amazon DynamoDB**, which provided durable storage at lower day‑one cost. However, as user engagement and QPS grew beyond **~30K requests per second**, the combination of read/write throughput charges and autoscaling behavior caused costs to climb steeply—eventually exceeding the projected Redis TCO at higher traffic levels.
- **EloqKV deployment:** By adopting EloqKV as the primary store for the friendship graph, the company consolidated caching and persistence into a single Redis-compatible system. Hot graph neighborhoods are served from DRAM, while the rest of the graph is efficiently stored on NVMe SSDs with database-grade durability.
- **Outcome:** The platform achieved **around 10x cost savings** compared to the projected cost of scaling either Redis or DynamoDB for this workload, while still delivering the low-latency graph lookups required for real-time social experiences at peak traffic.

<div style="page-break-after: always;"></div>

# Appendix: Assemble your database using Data Substrate

In today's data-driven world, organizations face mounting challenges managing and utilizing information effectively. Traditional database systems often struggle to adapt to rapidly evolving business needs, leading to complex setups, rigid scalability, and operational headaches. Introducing Data Substrate, a revolutionary abstraction layer that empowers you to build customized, dynamic databases tailored to your specific requirements.

## What is Data Substrate?

Think of Data Substrate as the invisible backbone of your data management solution. It acts as a unified platform, encapsulating critical functionalities commonly needed across diverse data scenarios. From ensuring consistency and data durability to handling concurrency and fault tolerance, Data Substrate takes care of the essential groundwork, freeing you to focus on building the bespoke database your business needs.

Moreover, Data Substrate's modular design and vertical scalability let you tailor it to your specific requirements. This means you can independently scale each layer – compute engines, Data Substrate itself, and cloud storage – to perfectly match your workload demands. Additionally, its cloud-powered cost-efficiency utilizes low-cost storage options for cold data, keeping your resources optimized. With a range of flexible engines at your disposal, you can craft a database perfectly suited to your application, whether it's a high-performance SQL engine for online transaction processing or a kv-based engine for flexible content management, and even wasm based engine for any user defined function.

<!-- ![](./media/datasubstrate.png) -->
<p align="center">
<img src="./media/datasubstrate_wp.png" alt="drawing" width="350"/>
</p>
<!-- <img src="./media/datasubstrate.png" alt="drawing" style="width:200px;"/> -->

### Key Components:

- Compute Engines: The architecture's top layer consists of a variety of adaptable compute engines, including SQL, KV, document, and graph engines. These engines seamlessly integrate with Data Substrate, offering flexibility in data processing and analysis.
- Data Substrate: This core layer acts as the backbone of the architecture, providing essential functionalities:
  - Caching: Optimizes performance by storing frequently accessed data in memory for rapid retrieval.
  - Concurrency Control: Ensures transaction ACID and supports multi-write architecture.
  - Data Persistence: Guarantees data durability by storing it persistently, even in case of system failures.
  - Consistency: Maintains data coherence across multiple components and operations.
  - Fault Tolerance: Enhances resilience by handling errors and fast recovery without data loss.
- Cloud Storage: Data Substrate integrates with diverse cloud storage solutions like AWS DynamoDB and Google Bigtable, serving two crucial purposes:
  - Cold Data Storage: Cost-effectively stores less frequently accessed data, reducing compute resource requirements.
  - Cache Miss Handling: Fetches data from cloud storage when it's not found in the cache, ensuring comprehensive data accessibility.
  - Break free from vendor lock-in and embrace true cloud independence with Data Substrate's seamless hybrid cloud storage architecture.

## Why Choose Data Substrate?

Modern enterprises require nimble data systems that can seamlessly adapt to their unique workload demands. Data Substrate empowers you to break free from the limitations of traditional database approaches, addressing common pain points such as:

- Long, cumbersome data pipelines: Data Substrate streamlines data flow, eliminating redundant processing and simplifying your data infrastructure.
- Repetitive hand-coding of core functionalities: No more reinventing the wheel! Data Substrate provides a robust foundation, letting you focus on your specific data logic.
- Low resource utilization: Data Substrate ensures efficient resource allocation, scaling the right components to match your workload demands and preventing wasted capacity.
- Inconsistent data synchronization: Eliminate data siloes and ensure seamless data consistency across your entire system with Data Substrate's transactional cache mechanism.
- Choose your cloud, your way: Data Substrate empowers you to orchestrate your data seamlessly across multiple clouds, creating a hybrid environment that aligns perfectly with your business needs and empowers strategic decision-making.

## Key Features of Data Substrate:

Data Substrate shines through its unparalleled elasticity and adaptability. It automatically adjusts to your needs, ensuring optimal performance regardless of workload variations. Here are some key highlights:

- Elastic Scaling: Adapt to diverse workloads effortlessly. For read-intensive scenarios, Data Substrate scales out its memory, enabling distributed caching and lightning-fast data retrieval.
- Parallel Write Optimization: No more bottlenecks! Data Substrate's patented one-phase commit protocol and parallel logging capabilities handle write-heavy workloads with ease, guaranteeing data durability and high availability even under extreme pressure.
- Cost-Effective Scalability: Large datasets are no match for Data Substrate. Seamlessly scale out your cloud storage without overloading compute resources, minimizing costs for infrequently accessed data.
