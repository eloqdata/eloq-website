---
title: Introduction to EloqKV
---

# EloqKV: A Distributed Transactional KV store

## Achitecture

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
