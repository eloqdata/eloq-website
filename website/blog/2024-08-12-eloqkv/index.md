---
title: Announcing EloqKV
authors: eloq
date: 2024-08-12
tags: [Company]
---

We are excited to officially introduce **EloqKV**, the first product built on our groundbreaking **Data Substrate** technology. This innovative architecture is designed to create high-performance, modular, scalable, and transactional databases tailored for the cloud era. We've discussed Data Substrate in several previous blog posts:

- [Why We Need a Common Underpinning for Modern Databases](../../../2024/08/08/underpinning)
- [How We End Up With So Many Databases Today](../../../2024/08/09/landscape)
- [What is Data Substrate, and How Can It Help](../../../2024/08/11/data-substrate)

EloqKV, like many existing key-value stores, delivers exceptional performance, supporting millions of operations per second on a single server node with sub-millisecond latencies. However, with a ground breaking architecture, EloqKV offers some unique advantages that set it apart from other key-value databases.

## Fully ACID Transactions when You Need Them.

Many key-value stores maintain all data in memory to achieve consistent latency. However, this approach significantly increases operational costs, as even infrequently accessed (cold) data occupies valuable memory space. Additionally, durability is often compromised in favor of performance, though optimized [Write Ahead Logs (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) on fast SSDs can usually manage acceptable overhead. Moreover, due to the high cost of distributed transactions, most distributed key-value stores either abandon transaction support altogether or offer only limited, partial transactions.

EloqKV, on the other hand, embraces the philosophy that [ACID](https://en.wikipedia.org/wiki/ACID) (Atomicity, Consistency, Isolation, Durability) is an important feature that shouldn't be overlooked—but it also shouldn't incur extra costs when not needed. EloqKV allows you to enable ACID features on a per-database basis. Moreover, EloqKV can ensure that single-key reads never incur additional costs, even when a database is set to be transactional.

Even in a fully ACID-transaction-enabled database, EloqKV incorporates several innovative technologies to minimize overhead. For instance, the latency of WAL logging is heavily influenced by data throughput. In EloqKV, logging can scale independently of the writers, reducing logging latency when additional hardware is provided (within the limits of physical constraints, of course). Additionally, EloqKV avoids the costly [two-phase commit](https://en.wikipedia.org/wiki/Two_phase_commit) protocol for distributed transactions. The specifics of this technology will be detailed in a future blog post or academic paper.

## Scale as You See Fit

EloqKV is designed with scalability in mind from the ground up. Each resource type—memory, CPU cores, logging SSDs, and persistent storage—can be scaled independently. This level of full scalability is particularly crucial in the cloud era, where resources can be easily acquired from public cloud providers.

If your workload is latency-sensitive and requires all data to be stored in memory, you can reserve virtual machines with large memory capacities. Need to handle a high volume of updates that must be persisted? Simply add a few extra EBS volumes as logging devices. If your data is enormous, you can use cloud storage options like DynamoDB or S3 for EloqDB to transparently store your infrequently accessed data cheaply.

We are also developing dynamic scaling, which will allow you to add resources as your workload changes. This feature will be available in a public preview very soon, so stay tuned.

## You Want Ease of Use? You Get Ease of Use

EloqKV is fully compatible with the [Redis API](/eloqkv/kvstore_compatibility) and supports most of the essential data structures found in Redis. This means that existing applications can leverage EloqKV's advanced features with virtually no additional effort.

However, EloqKV’s ease of use goes far beyond just API compatibility. The real reason EloqKV is so user-friendly lies in the fundamental architecture design choices we've made.

EloqKV can be deployed as a single-node key-value store, much like other existing KV stores such as [Redis](https://redis.io/), [ValKey](https://valkey.io/), [Garnet](https://microsoft.github.io/garnet/)or [DragonflyDB](https://www.dragonflydb.io/). In this setup, it competes directly with them in terms of performance and features. However, EloqKV is inherently designed as a distributed system. It can be deployed in a cluster with ease, instantly benefiting from the high availability and scalability that a true distributed system offers—no need for [sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) or special [cluster mode](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/).

Additionally, thanks to its built-in cluster awareness and ACID support, a cluster of EloqKV nodes behaves almost identically to a single-node EloqKV server. When connected to one of the nodes, a Redis-compatible client can access and modify data across all nodes in the cluster, potentially with an extra network hop (again, physics applies), even when the client is not cluster-aware. Furthermore, MULTI commands (i.e., Redis transactions) and Lua scripts can run in the cluster just as they would on a single node, eliminating issues like SLOTS and "CROSSSLOT Keys" errors.

## Performance and Cost

Performance and cost are always key metrics for evaluating any database system. It is sufficient to say that we've put a great deal of thought into these areas, and we encourage you to try out EloqKV and assess it with your own workloads. While we won't elaborate on these topics in this blog, a separate post will share some performance benchmarks for EloqKV.

One thing we'd like to highlight is that some of EloqKV's advanced features—such as enabling WAL for durability, performing atomic MULTI operations across multiple nodes, and using SSDs to store less frequently accessed (cold) data to reduce memory consumption—may be more cost-effective than you might expect. Again, we invite you to test it with your own workloads, and if you have any comments, suggestions, or questions, feel free to [contact us](/contact).

## Introduction to the Preview Release of EloqKV

[//]: <> (Transactions in the data substrate embrace optionality. For non-Multi, non-Lua commands, a transaction accesses a single key. This means that the transaction obtains no read lock and thus no unlocking if the command is read-only. If the command modifies the data structure, the transaction 1 obtains the write lock, 2 writes the log and 3 finally releases the lock and applies the command to the data structure. If the log is disabled, the lock-log-unlock path is collapsed into a single phase of applying the command. Hence, when the log is disabled, the execution path of a single Redis command is same as a native cache system. Only if the log is enabled do Redis commands become ACID-compliant and pay the cost of transactions. For Multi commands or Lua scripts, the transaction employs a variant of two-phase locking protocol to ensure global atomicity. Between the locking and unlock phases lies logging the transaction’s commands if the log is enabled.)

[//]: <> (EloqKV can be deployed as a cache by disabling the log and the persistent store, an in-memory database enabling the log and the persistent store and a larger-than-memory database when allocated memory is insufficient to host all data. The transition between the last two is driven by scaling memory cache. EloqKV can scale out the log separately for high write throughput and low latency. Scaling the persistent store is driven by data volume and is outside the scope of the data substrate.)

[//]: <> (EloqKV is a key-value database assembled using the data substrate. In front of the data substrate are RPC servers that receive network messages from Redis clients, parse Redis commands and execute them. The executor initializes a transaction via which requests are sent to the CC map to read and write keys and associated data structures. Upon commit, the transaction flushes write commands to the log and updates the in-memory data structure. Changed data structure are periodically flushed to a persistent store, which is either an on-premises system or a cloud service. A flushed key can be evicted from the CC map if there is no sufficient memory capacity. A later read on it will load it back into memory from the persistent store.)

In our current preview release, EloqKV supports two persistent stores: Apache Cassandra and RocksDB. Cassandra is a disaggregated store and may run in a different set of nodes from the data substrate. RocksDB is an embedded store and deployed with nodes hosting the DataSubstrate. Deployment of the persistent store is automatic when EloqKV is started.

In the ext blog post, we will share some results of performance benchmarks of EloqKV. We will show that EloqKV, when used as a cache, delivers excellent performance as mainstream cache solutions. The scaling capability of the log makes EloqKV especially unique in delivering extremely high write performance as an ACID database.

<!--truncate-->

<div style={{ width: '600px', textAlign: 'center' }}>
![](img/blog_ds_5.png)
</div>

Transactions in the data substrate embrace optionality. For non-Multi, non-Lua commands, a transaction accesses a single key. This means that the transaction obtains no read lock (and thus no unlocking) if the command is read-only. If the command modifies the data structure, the transaction (1) obtains the write lock, (2) writes the log and (3) finally releases the lock and applies the command to the data structure. If the log is disabled, the lock-log-unlock path is collapsed into a single phase of applying the command. Hence, when the log is disabled, the execution path of a single Redis command is same as a native cache system. Only if the log is enabled do Redis commands become ACID-compliant and pay the cost of transactions. For Multi commands or Lua scripts, the transaction employs a variant of two-phase locking protocol to ensure global atomicity. Between the locking and unlock phases lies logging the transaction’s commands if the log is enabled.

EloqKV can be deployed as a cache (disabling the log and the persistent store), an in-memory database (enabling the log and the persistent store) and a larger-than-memory database (when allocated memory is insufficient to host all data). The transition between the last two is driven by scaling memory (cache). EloqKV can scale out the log separately for high write throughput and low latency. Scaling the persistent store is driven by data volume and is outside the scope of the data substrate.
