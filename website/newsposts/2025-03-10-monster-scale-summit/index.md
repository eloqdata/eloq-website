---
title: EloqData on Monster Scale Summit 2025
authors: eloq
date: 2025-03-10
tags: [Product]
image: /img/blog/monster.png
description: The CTO of EloqData delivered a talk at the Monster Scale Summit 2025, titled "Overcoming Redis Scaling Bottlenecks with EloqKV on ScyllaDB."
---

Redis is widely used for caching and real-time data processing, but its scalability limitations create significant challenges for modern applications. At Monster Scale Summit 2025, we introduced EloqKV, a high-performance, distributed transactional database that overcomes Redis' scaling bottlenecks by leveraging ScyllaDB. This blog post explores how EloqKV enhances scalability, performance, and transaction capabilities while maintaining Redis API compatibility.

<!--truncate-->

# Overcoming Redis Scaling Bottlenecks with EloqKV on ScyllaDB

## Introduction

At **Monster Scale Summit 2025**, Eloqdata is honored to be the featured speaker, presenting how [**EloqKV**](https://www.eloqdata.com/product/eloqkv) on ScyllaDB, our high-performance, distributed transactional database, tackles Redis scaling bottlenecks. Hosted by [ScyllaDB](https://www.scylladb.com/), a distributed low-latency NoSQL database, the summit showcases cutting-edge solutions for extreme-scale engineering.

Watch the [video](https://www.youtube.com/watch?v=XSuwjiNt0N4)

Visit the official Monster Scale Summit [website](https://www.scylladb.com/monster-scale-summit)

## The Redis Scaling Challenge

Redis is a popular in-memory database, but scaling it presents significant issues:

- **Scale-Out Complexity**: Redis clustering is full of pitfalls, including its lack of support for cross-node operations and the increasing overhead of its gossip protocol as the cluster size grows.
- **Data Volume Limitations**: Redis is purely in-memory, making it expensive and impractical for large datasets.
- **Single-Threaded Execution**: Redis handles requests in a single thread, limiting its ability to scale up efficiently.
- **Transaction Limitations**: Redis does not provide true ACID transactions, making complex workflows difficult.
- **Cache Coherence Issues**: Redis and its underlying store often suffer from consistency problems, often necessitating extra application-level logic to ensure data integrity and accuracy.

These issues force teams to make trade-offs between cost, performance, and ease of use. EloqKV on ScyllaDB is designed to remove those trade-offs by combining Redis' API with scalability and transaction.

## How EloqKV on ScyllaDB Solves Redis Bottlenecks

EloqKV is **a full-featured, distributed ACID transactional database** that is compatible with the Redis API. By integrating with ScyllaDB, it delivers:

### **1. Multi-Tier Storage for Cost Efficiency**

- **Hot Data**: Cached in EloqKV’s buffer pool for fast access (\~100us).
- **Cold Data (Option I)**: Stored in Key-Value engines like **ScyllaDB**, ensuring high-performance cache miss reads.
- **Cold Data (Option II)**: Offloaded to **object storage**, reducing total cost of owership.

### **2. High Throughput with Thread-Per-Core Execution**

EloqKV follows a **multi-threaded, thread-per-core** model akin to ScyllaDB, though it is implemented independently without relying on Seastar, ensuring:

- Full CPU utilization for maximum performance.
- 10x faster than Redis, and delivers performance comparable to DragonflyDB, while providing transactional capabilities and native scale out features.

### **3. True Distributed Transactions**

Unlike Redis, EloqKV supports:

- Durable Cross-AZ Write-Ahead Logging (WAL).
- Popular Isolation Levels/Concurrency Control Protocols.
- Cross-node Multi/Exec & Lua Scripts.
- Explicit Begin/Commit/Rollback transactions (Unique).

### **4. Seamless Elastic Scalability**

- Elastic scaling across all resource types: CPU, memory, storage, and logs.
- Optimized component scaling tailored to your workload for reduced Total Cost of Ownership (TCO).
- Easy integration with cloud-native infrastructures.

## Beyond Redis: The Future of EloqData

EloqKV is more than just a key-value store. At [EloqData](https://www.eloqdata.com), we invent a new **modular database approach**, enabling different compute models to share the same [data substrate](https://www.eloqdata.com/blog/2024/08/11/data-substrate). This vision extends beyond a single API, with:

- **EloqSQL**: MySQL-compatible distributed RDBMS.
- **EloqDoc**: MongoDB-compatible document store.
- **EloqKV**: Redis-compatible key-value store with transactional support.

By leveraging open-source execution engines, we ensure compatibility with existing ecosystems while avoiding redundant reinvention of wheels.

## Conclusion

Redis has been a go-to for in-memory caching, but its scaling challenges limit its long-term viability for demanding workloads. **EloqKV on ScyllaDB** offers an alternative that provides **high performance, ACID transactions, and cost-effective scalability**—without the trade-offs.

If you’re looking to **break free from Redis scaling constraints**, EloqKV is the future. Let’s build the next-generation database together and stay connected:
🔗 [GitHub](https://github.com/eloqdata/eloqkv)
