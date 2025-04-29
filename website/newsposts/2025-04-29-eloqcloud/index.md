---
title: 'EloqCloud for Redis: Public Access Now Open'
authors: eloq
date: 2025-04-29
tags: [Product]
news: true
image: /img/blog/eloqcloud_announce.png
description: Announcing our first cloud native offering EloqCloud for Redis - a cloud-native transactional key-value database with full Redis API compatibility.
newsFeatured: true
---

We’re excited to announce the **Public Access** of **EloqCloud for Redis**, the first product in the EloqCloud family!

<!--truncate-->

**EloqCloud** is the SaaS platform for **EloqDB**, designed to deliver an **economical, scalable, and predictable** cloud experience for developers — using the APIs they already love.

EloqCloud is a **product matrix**, supporting a variety of compute APIs, from **SQL**, **Redis**, **MongoDB**, **Vector**, **Graph**, and even an all-in-one solution, [ConvergedDB](/blog/2025/03/19/agentic).  
These will roll out over time — and today, we're thrilled to introduce **EloqCloud for Redis**.

## What is EloqCloud for Redis?

In short, **EloqCloud for Redis** is a **cloud-native transactional key-value database** with full **Redis API compatibility**.

Note that it's more than just a cache — it's a real database, built for **durability**, **availability**, and **performance**. Every write is **replicated before acknowledging** to the client. It supports **cross-AZ persistence** to withstand **Availability Zone failures**.

Here’s a closer look at its key features:

---

## 🔥 Key Features

**1. Scale to Zero**  
Automatically free up all compute resources when idle — and save costs. No usage? No bill.

**2. Dedicated Resources**  
Choose the SKU that fits your workload. Resources are **dedicated**, ensuring **predictable performance** without noisy neighbors.

**3. Economic High Availability**  
Why pay for [2x or 3x replicas](https://www.mongodb.com/docs/manual/replication) just to achieve high availability?  
With **EloqCloud for Redis**, **one compute replica** is enough.  
Our [Data Substrate](/blog/2024/08/11/data-substrate) architecture decouples compute, memory, log and storage, enabling:

- **Automatic failover within 10 seconds**
- **Zero data loss**
- **Up to 70% lower costs compared to traditional HA setups**

Save big — without sacrificing reliability.

**4. Hybrid Storage Architecture**  
Say goodbye to overpaying for [cloud EBS](https://aws.amazon.com/ebs/) or risking instance [local NVMe](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html) data loss.

- Recent WAL is stored on EBS with multiple replica for fast recovery.
- Historical WAL and user data are stored in **cheap, durable object storage** and cached on local nvme for ultra-fast reads.

**5. High Performance**

- Over **1 million ops/sec** on a single node.
- **Sub-millisecond read latencies**, matching cache services.
- **Single-digit millisecond** write latencies — **with durability guarantees**.

**6. Full ACID Transactions**  
Unlike typical Redis-like services, EloqCloud for Redis supports real **ACID transactions**, with familiar **Begin / Commit / Rollback** semantics — enabling SQL-style transactional patterns over Redis API.

**7. Seamless Scalability**  
Select the SKU that best matches your workload.  
Auto-scaling is on our roadmap to make dynamic scaling effortless.

---

## Get Started

Ready to experience the future of cloud databases?  
[Join the EloqCloud Waitlist](https://cloud.eloqdata.com/join-waitlist) today — and receive an exclusive invitation to try EloqCloud for Redis for free.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/joinwaitlist.png').default} alt="Building a Data Foundation for Agentic AI Applications" />

</div></p>

📺 **Watch our quick demo video below to see EloqCloud for Redis in action!**

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
  <video controls src="/video/eloqcloud.mp4" width="800" />

</div></p>
