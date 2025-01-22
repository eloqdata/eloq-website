---
title: EloqKV High Availability
---

# EloqKV High Availability

## Local Storage

EloqKV achieve high avaiabllity by using hot standy nodes when deployed with local storage like RocksDB. Any new changes at primary node will be shipped to standy node continuously. When Primary node fails, hot standy nodes can be elected as new primary node automatically. Next we will dive into how standby node works and how failover works.

How standby node joins the replication group:

1. Hot standby node started and send `Join` message to primary node.
2. Primary node begin the track all the new changes in local command cache.
3. Primary node execute checkpoint and ensure all the old data are flushed to RocksDB.
4. Primary node take snaphot for RocksDB and sent it to stanby node.
5. Once standby node finished the load of remote RocksDB snapshot, Primary node begin to send the new commands in command cache to standby node continuously by a separate sync worker.
6. Standy receives and execute the commands from primary. If command seqnumber is not continuous, standby will fetch the missing command with seqnumber from primary. If the missing command is also cleared in command cache of primary node, the standby node need to rejoin the replication group.

When primary node fails, failover will be triggered and one of the standby will be elected as the new primary node to server the write request. EloqKV uses Raft consensus group to implement auto failover. In EloqKV, there are three roles in Raft group: Leader, Follower and Voter. Leader is the

Below are the cluster topology when deploy 3-shard cluster with one standy for each primary. Different colors indicated different replication groups. Each replication group contain one primary node, one standby node and one voter, Since voter only paticapate consensus election process and comsume little resource, we deploy the voter and primary node one the same machine, but for a specific replication group, the voter primary and standy will be deployed separately to ensure EloqKV can tolerate node failure.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./media/redis_standby_voter.png').default} alt="EloqKV Architecture" />

</div></p>

## Shared Storage

EloqKV is a decoupled, distributed database built on Data Substrate, the innovative new database foundation developed by EloqData for the cloud era.

Each EloqKV instance includes a frontend, compatible with the Redis protocol, deployed together with the core TxService to handle data operations. A logically independent LogService handles Write Ahead Logging (WAL) to ensure persistence, while a Persistent Storage Service manages memory state checkpoints and cold data storage.

In EloqKV, the TxService is responsible for concurrency control, ensuring that transactional operations are consistent. The Log Service can replicate logs and distributes them across different availability zones (AZs) to provide resilience against AZ-level failures. The storage service supports various persistent storage engines, including local options like RocksDB, remote clusters like Cassandra, and cloud storage solutions such as AWS DynamoDB. This persistent storage store cold data for cache misses and provide high availability, even during node failures.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./media/eloq_arch_new2.png').default} alt="EloqKV Architecture" />

</div></p>

<!--
<p align="center">
<div style={{ width: '600px', textAlign: 'center', display: 'block' }}>
![](./media/eloq_arch_new2.png)
</div>
</p> -->

## Beyond Caching, Embracing Transactions

Unlike many distributed KV stores, EloqKV is full ACID (Atomicity, Consistency, Isolation, Durability) capable. It supports distributed transactions. This unlocks unprecedented functionality, empowering you to:

- Ditch the Duo: Say goodbye to the cumbersome MySQL + Redis combo. EloqKV eliminates cache coherence issues entirely, simplifying your architecture and boosting efficiency.
- Transactional Confidence: Ensure data integrity across reads and writes, even in complex distributed environments.
- Unlock New Application Scenarios: Tackle use cases beyond traditional caching, venturing into the realm of transactional microservices and stateful data management.

## Cost-Conscious Performance Made Simple

EloqKV leverages Data Substrate's innovative architecture to deliver performance and cost-effectiveness in perfect harmony:

- Memory for Speed: Frequently accessed data are cached in-memory, guaranteeing lightning-fast reads and blazing-fast write performance through parallel logging.
- Cloud for Cold Data: As data cools, it gracefully migrates to cost-effective cloud key-value stores, freeing up precious DRAM resources.
- Asynchronous Checkpoints: Minimize IOPS requirements and optimize performance while keeping transactional reads readily available.
- Operational Efficiency: Slash operational costs with cloud storage and enjoy streamlined maintenance thanks to Data Substrate's modular design.

## Scale on Demand, Optimize on the Fly

EloqKV adapts to your dynamic needs, scaling seamlessly to match your workload:

- Memory Scaling: When hot data demands grow, memory capacity can be increased for better performance.
- Log Service Optimization: Handle surges in write traffic by scaling the log service.
- Cloud Storage Growth: As historical data accumulates, seamlessly expand the cloud storage layer to accommodate your evolving needs.
- On Demand Dynamic Scaling: achieve scaling without service interruptions (current in Beta).

## Read the Blogs

**EloqKV** is a reimagining of the modern Key-Value Store. To learn more about EloqKV and what it can do, you can read our blogs about its [unique features](/blog/2024/08/16/eloqkv) and [underlying technology](/blog/2024/08/11/data-substrate). You can also read benchmark results on its performance in [single-node](/blog/2024/08/17/benchmark-single-node) configurations and [clustering](/blog/2024/08/22/benchmark-cluster) configurations. You can also read about its unique capability to achieve [durability](/blog/2024/08/25/benchmark-txlog) and perform [distributed atomic operations](/blog/2024/09/01/benchmark-transaction). More technical content will be posted on the [blog](/blog) frequently, and we welcome your [feedback](/contact).
