---
title: Announcing EloqKV
authors: eloq
date: 2024-08-16
tags: [Product]
news: true
image: /img/blog/eloqkv_launch.jpg
description: EloqKV is a cutting-edge key-value database offering high performance, scalability, and full ACID compliance. Learn how it revolutionizes data management with its innovative architecture and advanced features.
newsFeatured: true
---

We're thrilled to introduce **EloqKV**, a _high performance Redis API-compatible, ACID transactional, scalable, distributed_ key-value database. You might be thinking, "Really? Another key-value database?" In this post, we'll explain what makes **EloqKV** stand out and the unique values **EloqKV** offers.

<!--truncate-->

**EloqKV** is the first product built on our groundbreaking Data Substrate technology, an innovative architecture designed to create high-performance, modular, scalable, and transactional databases for the cloud era. We introduced Data Substrate in a [previous blog post](/blog/2024/08/11/data-substrate).

Like many key-value stores, **EloqKV** delivers exceptional performance, handling [millions of operations per second](/blog/2024/08/17/benchmark-single-node) on a _single server_ with sub-millisecond latencies. But with its revolutionary architecture, **EloqKV** offers unique features that distinguishes it from other key-value databases.

## Full ACID Transactions when You Need Them

Many key-value stores keep all data in memory to achieve low latency. However, this approach significantly increases costs, as even infrequently accessed (cold) data takes up valuable memory. Additionally, durability is often sacrificed for performance, though on modern SSDs optimized [Write-Ahead Logs (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) can often help reduce the impact to acceptable levels. Moreover, due to the high cost of distributed transactions, most distributed key-value stores either forgo transaction support or offer only limited, partial transactions.

**EloqKV** takes a different approach, embracing the philosophy that [ACID](https://en.wikipedia.org/wiki/ACID) (Atomicity, Consistency, Isolation, Durability) transactions are important but should not add extra costs when they’re not needed. **EloqKV** allows you to enable ACID as a configuration flag. When ACID is disabled, **EloqKV** incurs no additional overhead, offering performance comparable to that of non-transactional key-value databases. Currently in Beta and available in a future release, **EloqKV** will allow ACID support to be turned on and off on a per-database basis, further avoiding unnecessary overhead and simplifying management.

Even with full ACID, **EloqKV** incorporates several innovations to minimize overhead. For example, the latency of WAL logging is typically dominated by synchronous writes to stable storage. In **EloqKV**, logging can scale horizontally and independently, reducing logging latency when more storage devices are added. Moreover, in **EloqKV**, single-key read transactions do not incur extra overheads. This makes **EloqKV** blazingly fast for many common workloads. We’ll dive deeper into these technologies in future blog posts or academic papers.

## Scale as You Need, on What You Need

**EloqKV** is designed for scalability from the ground up. Each resource type — memory, CPU cores, logging SSDs, and persistent storage — can be scaled independently. This level of flexibility is super valuable in the cloud era, where resources can be easily provisioned from cloud providers.

If your workload is latency-sensitive and requires all data to be stored in memory, you can reserve virtual machines with large memory capacities. Need to handle a high volume of updates that must be persisted? Simply add a few extra EBS volumes as logging devices. If your data is large, you can use cloud storage options like DynamoDB or S3 to cost-effectively store infrequently accessed data.

We're also developing transparent, dynamic scaling, which will allow you to add and remove resources dynamically as your workload changes. This feature will be available in a public preview soon, so stay tuned.

## You Want Ease of Use? You Get Ease of Use

**EloqKV** is compatible with the [Redis API](/eloqkv/kvstore_compatibility) and supports most of Redis's essential data structures. This means that most existing applications can easily take advantage of **EloqKV**'s advanced features with minimal effort.

But **EloqKV**'s ease of use goes beyond API compatibility. The true user-friendliness of **EloqKV** lies in the fundamental architectural design choices we've made.

**EloqKV** can be deployed as a single-node key-value store, similar to [Redis](https://redis.io/) and [Memcached](https://memcached.org/). However, **EloqKV** is inherently designed as a distributed system. It can be deployed in a cluster with ease, instantly benefiting from the high availability and scalability of a true distributed system — no need for a [sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) or special [cluster mode](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/).

Thanks to its built-in cluster awareness and ACID support, an **EloqKV** cluster behaves almost identically to a single-node server. When connected to one of the nodes, a Redis-compatible client can access and modify data across all nodes in the cluster, potentially with an extra network hop (because physics applies), even if the client is not cluster-aware, and even when the cluster is recovering from failures or changing configuration to add/remove capacity. Additionally, _WATCH/MULTI/EXEC_ commands (i.e., Redis transactions) and _Lua scripts_ can run in the cluster just as they would on a single-node database, eliminating issues like SLOTS and "CROSSSLOT Keys" errors.

## Performance and Cost

Performance and cost are always critical factors when evaluating database systems. [Numerous](https://www.scylladb.com/compare/) [database](https://aerospike.com/resources/benchmarks/) [vendors](https://www.dragonflydb.io/blog/scaling-performance-redis-vs-dragonfly) publish articles or white papers claiming performance superiority. It is sufficient to say that we've put a great deal of thought into performance optimizations. We strive to make **EloqKV** achieve _best-in-class performance_ when features are _fairly matched_, and we are glad to report that we largely achieved the goal. We encourage you to read our follow up blogs, or [try out](/eloqkv/install-from-binary) **EloqKV** and assess it with your own workloads.

One key point to note is that some of **EloqKV**'s advanced features — such as enabling logging for durability, performing atomic `MULTI` operations across multiple nodes, and using SSDs to store cold data to reduce memory usage — might be more cost-effective than you expect. Again, we encourage you to test it with your workloads.

## Introducing **EloqKV** for Public Preview

Today, we are releasing **EloqKV** for public preview. This release supports two persistent stores: Apache Cassandra and RocksDB. Cassandra is a disaggregated store that can run on a different set of nodes from **EloqKV** servers for high availability, while RocksDB is an embedded store. You can learn about how to set up a [single node](/eloqkv/quick-start) test server or a [cluster](/eloqkv/quick-start-ha) following our documents.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloq_arch_new2.png').default} alt="EloqKV Architecture" />

</div></p>

**EloqKV** can be deployed in various configurations:

- **As a cache**: When logging and the persistent store are turned off, **EloqKV** functions as a high-performance in-memory cache, similar to mainstream cache solutions with performance matching the state-of-the-art in-memory cache servers.

- **As an in-memory database**: By enabling logging and the persistent store, **EloqKV** provides durability while maintaining the same fast read performance as a cache. It flushes writes to the log and applies them to memory-resident data. It also maintains snapshots in stable storage, ensuring full, consistent data recovery after failures or restarts.

- **As a larger-than-memory database**: When the allocated memory is insufficient to store all data, **EloqKV** evicts data to stable storage and retrieves it as needed. In this mode, **EloqKV** serves as a strong alternative to many NoSQL databases.

- **As a full blown transactional distributed database**: When deployed in the cloud, **EloqKV** can be configured as a fully scalable, highly available, and ACID-capable database that can be used as the main store to host primary data. Traditionally this is a postition often taken by expensive RMDBS.

We foresee many scenarios where **EloqKV** can be valuable due to its unique features and capabilities, and we love to hear from you on your use cases and pain points that **EloqKV** may be able to address. We are working hard to improve the product and add more capabilities. If you have any questions or suggestions, or want to have an in-person demonstration, please [contact us](/contact).

In the next few blog posts, we will share some performance benchmarks of **EloqKV** in different scenarios.
