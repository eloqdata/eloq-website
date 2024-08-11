---
title: Introduction to EloqKV
authors: eloq
date: 2024-08-12
tags: [Company]
---

EloqKV is a key-value database assembled using the data substrate. In front of the data substrate are RPC servers that receive network messages from Redis clients, parse Redis commands and execute them. The executor initializes a transaction via which requests are sent to the CC map to read and write keys and associated data structures. Upon commit, the transaction flushes write commands to the log and updates the in-memory data structure. Changed data structure are periodically flushed to a persistent store, which is either an on-premises system or a cloud service. A flushed key can be evicted from the CC map if there is no sufficient memory capacity. A later read on it will load it back into memory from the persistent store.

<!--truncate-->

<div style={{ width: '600px', textAlign: 'center' }}>
![](img/blog_ds_5.png)
</div>

Transactions in the data substrate embrace optionality. For non-Multi, non-Lua commands, a transaction accesses a single key. This means that the transaction obtains no read lock (and thus no unlocking) if the command is read-only. If the command modifies the data structure, the transaction (1) obtains the write lock, (2) writes the log and (3) finally releases the lock and applies the command to the data structure. If the log is disabled, the lock-log-unlock path is collapsed into a single phase of applying the command. Hence, when the log is disabled, the execution path of a single Redis command is same as a native cache system. Only if the log is enabled do Redis commands become ACID-compliant and pay the cost of transactions. For Multi commands or Lua scripts, the transaction employs a variant of two-phase locking protocol to ensure global atomicity. Between the locking and unlock phases lies logging the transaction’s commands if the log is enabled.

EloqKV can be deployed as a cache (disabling the log and the persistent store), an in-memory database (enabling the log and the persistent store) and a larger-than-memory database (when allocated memory is insufficient to host all data). The transition between the last two is driven by scaling memory (cache). EloqKV can scale out the log separately for high write throughput and low latency. Scaling the persistent store is driven by data volume and is outside the scope of the data substrate.

In current release, EloqKV supports two persistent stores: Apache Cassandra and RocksDB. Cassandra is a disaggregated store and may run in a different set of nodes from the data substrate. RocksDB is an embedded store and deployed with nodes hosting the CC map. Deployment of the persistent store is automatic when EloqKV is started.

In next blog post, we will share some results of performance benchmarks of EloqKV. We will show that EloqKV, when used as a cache, delivers excellent performance as mainstream cache solutions. The scaling capability of the log makes EloqKV especially unique in delivering extremely high write performance as CRUD databases.
