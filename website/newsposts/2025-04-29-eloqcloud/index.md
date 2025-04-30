---
title: 'EloqCloud KVDB: Public Access Now Open'
authors: eloq
date: 2025-04-29
tags: [Product]
news: true
image: /img/blog/eloqcloud_announce.png
description: Announcing EloqCloud KVDB - our cloud native transactional key-value database with full Redis API compatibility.
newsFeatured: true
---

We’re excited to announce the **Public Access** of **EloqCloud KVDB**, the first product in our **EloqCloud** SaaS cloud native database family!

<!--truncate-->

**EloqCloud** is the SaaS platform for **EloqDB**, designed to deliver an **economical, scalable, and predictable** cloud experience for developers — using the APIs they already love.

EloqCloud is a **product matrix**, supporting a variety of data models and compute APIs, including **SQL**, **Redis**, **MongoDB**, **Vector**, **Graph**, as well as an all-in-one solution, [ConvergedDB](/blog/2025/03/19/agentic), that support operation cross data models. These product features will be rolled out over time — and today, we're thrilled to introduce **EloqCloud KVDB**.

## What is EloqCloud KVDB?

In short, **EloqCloud KVDB** is a **cloud-native transactional key-value database** with full **Redis API compatibility**.

**EloqCloud KVDB** is more than just an in-memory cache — it is a real ACID compliant database, built for **durability**, **availability**, and **performance**. Writes are **replicated before acknowledging** to the client with **cross-AZ persistence** to withstand **Availability Zone failures**, while the performance of In **EloqCloud KVDB** matches existing in-memory cache solutions.

Here’s a closer look at the key features of In **EloqCloud KVDB**: 

---

## 🔥 Key Features

**1. Scale to Zero**  
**EloqCloud KVDB** supports scale to zero. When idle for a short period of time, it can automatically free up all compute resources — and save costs. No usage? No bill.

**2. Dedicated Resources**  
Choose the SKU that fits your workload. Resources are **dedicated**, ensuring **predictable performance** without noisy neighbors.

**3. Economic High Availability**  
Why pay for [2x or 3x replicas](https://www.mongodb.com/docs/manual/replication) just to achieve high availability?  
With **EloqCloud KVDB**, one compute replica is enough. Our [Data Substrate](/blog/2024/08/11/data-substrate) architecture decouples compute, memory, log and storage, enabling:

- **Automatic failover within seconds**
- **Zero data loss**
- **Up to 70% lower costs compared to traditional HA setups**
- **Supports hot-backup mode to reduce failover time even further**

Save big — without sacrificing reliability.

**4. Hybrid Storage Architecture**  
Say goodbye to overpaying for [cloud Elastic Block Storage (EBS)](https://aws.amazon.com/ebs/) or risking instance [local SSD](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html) data loss.

- Recent updates are stored on EBS in a Write Ahead Log (WAL) with multiple replica for fast recovery.
- Historical WAL and user data are stored in **cheap, durable object storage** and cached on local SSD for ultra-fast reads.

**5. High Performance**

- Over **1 million ops/sec** on a single node.
- **Sub-millisecond read latencies** that match or out-perform existing in-memory cache solutions.
- **Single-digit millisecond** write latencies — **with durability guarantees**.

**6. Full ACID Transactions**  
Unlike typical Redis-like services, EloqCloud KVDB supports real **ACID transactions**, with familiar **Begin / Commit / Rollback** semantics — enabling SQL-style transactional patterns over Redis API.

**7. Seamless Scalability**  
Select the SKU that best matches your workload.
Auto-scaling is on our roadmap to make dynamic scaling effortless.

---

## Get Started

Ready to experience the future of cloud databases?  
[Join the EloqCloud Waitlist](https://cloud.eloqdata.com/join-waitlist) today — and receive an exclusive invitation to try EloqCloud KVDB for free.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/joinwaitlist.png').default} alt="Building a Data Foundation for Agentic AI Applications" />

</div></p>

📺 **Watch our quick demo video below to see EloqCloud KVDB in action!**

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
  <video controls src="/video/eloqcloud.mp4" width="800" />

</div></p>

We'll be sharing detailed benchmark results and comparisons with other key-value stores in upcoming posts — stay tuned!
