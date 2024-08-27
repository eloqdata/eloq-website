---
title: Announcing EloqKV
authors: eloq
date: 2024-08-16
tags: [Company]
---

We are excited to introduce **EloqKV**, a Redis API-compatible, transactional, distributed key-value database. For those familiar with the database landscape, the response might be “Seriously? Yet another key-value DB?”. In this blog post, we discuss what unique values EloqKV offers.

<!--truncate-->

EloqKV is the first product built on our groundbreaking **Data Substrate** technology. This innovative architecture is designed to create high-performance, modular, scalable, and transactional databases tailored for the cloud era. We've discussed Data Substrate in our [last blog post](/blog/2024/08/11/data-substrate).

EloqKV, like many existing key-value stores, delivers exceptional performance, supporting millions of operations per second on a single server node with sub-millisecond latencies. However, with a ground breaking new database architecture, EloqKV offers some unique features that set it apart from other key-value databases.

## Full ACID Transactions when You Need Them

Many key-value stores maintain all data in memory to achieve low latency. However, this approach significantly increases operational costs, as even infrequently accessed (cold) data occupies valuable memory space. Additionally, durability is often compromised in favor of performance, though optimized [Write Ahead Logs (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) on fast SSDs can often mitigate the write cost. Finally, due to the high cost of distributed transactions, most distributed key-value stores either abandon transaction support altogether or offer only limited, partial transactions.

EloqKV, on the other hand, embraces the philosophy that [ACID](https://en.wikipedia.org/wiki/ACID) (Atomicity, Consistency, Isolation, Durability) is an important feature that shouldn't be overlooked—but it also shouldn't incur extra cost when not needed. EloqKV allows you to enable ACID on a per-database basis. When ACID is disabled, EloqKV incurs no additional operations in read and write paths and thus provides comparable performance to today's non-transactional key-value databases.

Even as a fully ACID-compliant database, EloqKV incorporates several innovative technologies to minimize overhead. For instance, the latency of WAL logging is dominated by synchronous writes to stable storage. In EloqKV, logging can scale horizontally and independently, reducing logging latency when additional storage devices are provided (within the limits of physical constraints, of course). Additionally, EloqKV avoids the costly [two-phase commit](https://en.wikipedia.org/wiki/Two_phase_commit) protocol for distributed transactions. The specifics of this technology will be detailed in future blog posts or academic papers.

<!-- Transactions not only provide an elegant abstraction for application to use but arise naturally in managing distributed systems. Each time you add a node, migrate a data shard or change metadata, you want the operation to be consistent, atomic and fault tolerant across all nodes, which falls into the scope of transaction processing. Without built-in support of transactions, databases often rely on separate services, such as [etcd](https://etcd.io/) or [Zookeeper](https://zookeeper.apache.org/), to do the job, greatly increasing system management complexity. -->

## Scale as You See Fit

EloqKV is designed with scalability in mind from the ground up. Each resource type—memory, CPU cores, logging SSDs, and persistent storage—can be scaled independently. This level of full scalability is particularly crucial in the cloud era, where resources can be easily acquired from public cloud providers.

If your workload is latency-sensitive and requires all data to be stored in memory, you can reserve virtual machines with large memory capacities. Need to handle a high volume of updates that must be persisted? Simply add a few extra EBS volumes as logging devices. If your data is enormous, you can use cloud storage options like DynamoDB or S3 for EloqDB to transparently store your infrequently accessed data cheaply.

We are also developing transparent, dynamic scaling, which will allow you to add and remove resources as your workload changes. This feature will be available in a public preview very soon, so stay tuned.

## You Want Ease of Use? You Get Ease of Use

EloqKV is fully compatible with the [Redis API](/eloqkv/kvstore_compatibility) and supports most of the essential data structures in Redis. This means that existing applications can leverage EloqKV's advanced features with virtually no additional effort.

But EloqKV’s ease of use goes far beyond API compatibility. The real reason EloqKV is user-friendly lies in the fundamental architecture design choices we've made.

EloqKV can be deployed as a single-node key-value store, much like other existing KV stores such as [Redis](https://redis.io/) and [DragonflyDB](https://www.dragonflydb.io/). However, EloqKV is inherently designed as a distributed system. It can be deployed in a cluster with ease, instantly benefiting from the high availability and scalability that a true distributed system offers—no need for [sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) or special [cluster mode](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/).

Thanks to its built-in cluster awareness and ACID support, a cluster of EloqKV nodes behave almost identically to a single-node EloqKV server. When connected to one of the nodes, a Redis-compatible client can access and modify data across all nodes in the cluster, potentially with an extra network hop (physics applies), even when the client is not cluster-aware. Furthermore, MULTI commands (i.e., Redis transactions) and Lua scripts can run in the cluster just as they would on a single-node database, eliminating issues like SLOTS and "CROSSSLOT Keys" errors.

## Performance and Cost

Performance and cost are always critical metrics when evaluating database systems. [Numerous](https://www.scylladb.com/compare/) [database](https://aerospike.com/resources/benchmarks/) [vendors](https://www.dragonflydb.io/blog/scaling-performance-redis-vs-dragonfly) publish articles, trying to claim performance superiority. It is sufficient to say that we've put a great deal of thought into these areas, and we encourage you to try out EloqKV and assess it with your own workloads. We will share some performance benchmarks for EloqKV in a separate post.

One thing we'd like to highlight is that some of EloqKV's advanced features—such as enabling log for durability, performing atomic MULTI operations across multiple nodes, and using SSDs to store less frequently accessed (cold) data to reduce memory consumption—may be more cost-effective than you might expect. We invite you to test it with your own workloads. If you have any comments, suggestions, or questions, feel free to [contact us](/contact).

## Introducing EloqKV for Public Preview

Today, we are releasing EloqKV for preview by the general public. This EloqKV release supports two persistent stores: Apache Cassandra and RocksDB. Cassandra is a disaggregated store and may run in a different set of nodes from the EloqKV servers for high availability, while RocksDB is an embedded store. Deployment of the persistent store is automatic when EloqKV is started.

<!--truncate-->
<p align="center">
<div style={{ width: '600px', textAlign: 'center'}}>
![](img/eloq_arch_new2.png)
</div>
</p>

EloqKV can be deployed as

- A _cache_ when log and the persistent store are turned off

  An in-memory cache is a software system storing data in main memory to serve fast reads and writes. When used as a cache, delivers excellent performance comparable to mainstream cache solutions.

- An _in-memory database_ by enabling the log and the persistent store

  An in-memory database puts all data in memory, so it provides the same read performance as cache. Different from cache, the in-memory database provides durability by first flushing writes to the log and then applying them to memory-resident data. The in-memory database also maintains snapshots in stable storage, so that upon failures or restarts it recovers full, consistent data in memory.

- Or a _larger-than-memory database_ when allocated memory is insufficient to host all data

  A larger-than-memory database assumes the entire data set may not fit into memory, so it evicts data items to stable storage when memory is full and brings them back into memory when they are later accessed. Configured as a larger-than-memory database, EloqKV can serve as a good alternative to many of the NoSQL databases.

The transition between the last two is driven by scaling memory. EloqKV can scale out the log separately for high write throughput and low write latency. Scaling the persistent store is driven by data volume. The scaling capability of the log makes EloqKV especially unique in delivering extremely high write performance as an ACID database.

In next blog post, we will share some results of performance benchmarks of EloqKV.
