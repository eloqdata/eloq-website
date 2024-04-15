---
title: Introduction to EloqKV
---

# EloqKV: A Distributed Transactional KV store

## Introduction

In today's fast-paced digital landscape, speed and reliability are paramount. Latency is the enemy, and data integrity is a non-negotiable. Traditional caching solutions like Redis offer fast reads, but lack the robust transaction support needed for mission-critical applications. Introducing EloqKV, a revolutionary distributed transactional kv store, that shatters performance barriers while ensuring rock-solid data consistency.

## Achitecture

EloqKV is a decoupled distributed database powered by Data Substrate. Its architecture includes a frontend compute engine compatible with the Redis protocol. Within Data Substrate, the TxService is responsible for caching hot data and managing transaction processing, while the LogService handles data persistence. LogService replicas are distributed across different availability zones (AZs) to ensure tolerance to AZ-level failures. The underlying storage layer supports pluggable key-value (KV) storages, such as AWS DynamoDB, Cassandra and Rocksdb. These cloud storage services store cold data for cache misses and provide high availability for baseline data.

![](./media/monocachedb_wp.png)

## Beyond Caching, Embracing Transactions

Unlike its peers, EloqKV transcends the limitations of simple key-value stores. It seamlessly integrates full ACID (Atomicity, Consistency, Isolation, Durability) properties across distributed transactions and clusters. This unlocks unprecedented functionality, empowering you to:

- Ditch the Duo: Say goodbye to the cumbersome MySQL + Redis combo. EloqKV eliminates cache coherence issues entirely, simplifying your architecture and boosting efficiency.
- Transactional Confidence: Ensure data integrity across reads and writes, even in complex distributed environments.
- Unlock New Application Scenarios: Tackle use cases beyond traditional caching, venturing into the realm of transactional microservices and stateful data management.

## Cost-Conscious Performance Made Simple

EloqKV leverages Data Substrate's innovative architecture to deliver performance and cost-effectiveness in perfect harmony:

- Memory for Speed: Frequently accessed data dances in-memory, guaranteeing lightning-fast reads and blazing-fast write performance through parallel logging.
- Cloud for Cold Data: As data cools, it gracefully migrates to cost-effective cloud key-value stores, freeing up precious DRAM resources.
- Asynchronous Checkpoints: Minimize IOPS requirements and optimize performance while keeping transactional reads readily available for cache misses.
- Operational Efficiency: Slash operational costs with cloud storage and enjoy streamlined maintenance thanks to Data Substrate's modular design.

## Leverage Parallel Processing Power:

EloqKV doesn't settle for single-threaded limitations. It flexes its multi-threaded architecture to:

- Maximize Hardware Potential: Uncork the full power of modern CPUs, maximizing resource utilization and delivering exceptional performance.
- Crush Bottlenecks with Concurrent Execution: Say goodbye to single-threaded limitations. EloqKV's multi-threaded architecture handles tasks simultaneously, significantly boosting performance and efficiency.

## Scale on Demand, Optimize on the Fly

EloqKV adapts to your dynamic needs, scaling seamlessly to match your workload:

- Memory Scaling: When hot data demands grow, instantly expand in-memory capacity for uninterrupted performance.
- Log Service Optimization: Handle surges in write traffic by effortlessly scaling the log service.
- Cloud Storage Growth: As historical data accumulates, seamlessly expand the cloud storage layer to accommodate your evolving needs.

## Use Cases

- **GenAI-Ready File System**: Empower the era of general artificial intelligence with a metadata engine capable of handling billions of files seamlessly.

- **Gaming**: Leaderboards and Player Profiles: Manage global leaderboards and player data with high concurrency and low latency, ensuring a smooth and responsive experience for millions of gamers.

- **Ad-tech:**: Real-time Bidding and Ad Serving: Handle high-volume ad requests and deliver relevant ads with millisecond latency, maximizing ad performance and revenue.

- **E-commerce**: Inventory Management and Product Catalog: Ensure real-time inventory updates and fast product searches for millions of items, optimizing customer experience and preventing stockouts.

## EloqKV: The Future of Caching is Here

Forget about performance compromises and sacrificing data integrity. EloqKV delivers the best of both worlds: blazing speed, unwavering reliability, and cost-effective scalability. So, ditch the clunky workarounds and embrace the future of caching with EloqKV.
