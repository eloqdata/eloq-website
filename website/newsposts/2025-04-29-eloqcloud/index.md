---
title: 'EloqCloud: Public Access Now Open'
authors: eloq
date: 2025-04-29
tags: [Product]
news: true
image: /img/blog/eloqcloud_announce.png
description: Announcing the first key-value product on the EloqCloud platform — a cloud-native, transactional database fully compatible with the Redis API.
newsFeatured: true
---

We’re excited to announce **Public Access** for the **EloqCloud** platform!
The first product—our key-value database with Redis-compatible API—officially joins the **EloqCloud** family of cloud-native SaaS databases.

<!--truncate-->

**EloqCloud** is the SaaS platform for **EloqDB**, designed to deliver an **economical, scalable, and predictable** cloud experience for developers — using the APIs they already love.

EloqCloud is a **product matrix**, supporting a variety of data models and compute APIs, including **SQL**, **Redis**, **MongoDB**, **Vector**, **Graph**, as well as an all-in-one solution, [ConvergedDB](/blog/2025/03/19/agentic), that support operation cross data models. These product features will be rolled out over time — and today, we're thrilled to introduce the first product in **EloqCloud** family — a key-value database with Redis-compatible API.

## What is the First EloqCloud Product?

The first product in the **EloqCloud** family is a **cloud-native transactional key-value database** with full **Redis API compatibility**.

It goes far beyond a traditional in-memory cache — offering true ACID compliance database, built for **durability**, **availability**, and **performance**. Writes are **replicated before acknowledging** to the client with **cross-AZ persistence** to withstand **Availability Zone failures**, while the performance matches existing in-memory cache solutions.

Here’s a closer look at its key capabilities:

---

## 🔥 Key Features

**1. Scale to Zero**  
**EloqCloud** supports scale to zero. When idle for a short period of time, it can automatically free up all compute resources — and save costs. No usage? No bill.

**2. Dedicated Resources**  
Choose the SKU that fits your workload. Resources are **dedicated**, ensuring **predictable performance** without noisy neighbors.

**3. Economic High Availability**  
Why pay for [2x or 3x replicas](https://www.mongodb.com/docs/manual/replication) just to achieve high availability?  
With **EloqCloud**, one compute replica is enough. Our [Data Substrate](/blog/2024/08/11/data-substrate) architecture decouples compute, memory, log and storage, enabling:

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
Unlike typical Redis-like services, EloqCloud supports real **ACID transactions**, with familiar **Begin / Commit / Rollback** semantics — enabling SQL-style transactional patterns over Redis API.

**7. Seamless Scalability**  
Select the SKU that best matches your workload.
Auto-scaling is on our roadmap to make dynamic scaling effortless.

---

## The Most Cost-Effective Key-Value Solution in the Cloud

Imagine you're running a real-world workload: **10K writes per second**, **50K reads per second**, and **100GB of persistent data**, all requiring **high availability**.

On most cloud database platforms, this setup can easily cost **several hundred dollars per month**. Why? Because to achieve high availability, you typically need **three replicas**—each consuming full CPU, memory, and storage. But here’s the catch: those extra nodes don’t hold additional value. They're just **mirroring operations from the primary** to be ready _in case_ it fails.

That’s a lot of wasted compute.

You might argue, "I could use those replicas for read traffic!" Sure, that works in some cases. But in our workload, the primary node can already handle both reads and writes. And those read replicas? They come with **eventual consistency**, which means you risk serving stale data unless you’re very careful.

So why pay for all that extra CPU and memory, if your workload doesn’t need separate read replicas?

Now let’s talk about storage.

Many cloud databases store user data and WAL (write-ahead log) on **EBS**. But EBS volumes already have **triple replication under the hood**. When you add that to your three-node replica setup, you're writing the same data **nine times**. That’s not just overkill—it’s expensive and inefficient.

And worse, **EBS replication is within a single Availability Zone**. If that zone fails, even your triple-replicated EBS won’t save your data—unless your standby nodes are in different AZs, which drives costs even higher.

There’s a better way.

**Object storage**, by default, replicates data across AZs—and you can even enable cross-region replication. Plus, it’s **one order of magnitude cheaper than EBS**.

---

### So what does an economical, cloud-native architecture really look like?

- **One compute replica**, not three — but still achieves high availability.
- **Object storage** as the primary data store — reliable, cheap, and cross-AZ by default.
- **Local NVMe** as a cache — for ultra-fast access without persistent cost.
- **EBS only for WAL** — recent logs only, with size kept small.

This is also the design behind **EloqCloud**.

---

## Get Started

Ready to experience the future of cloud databases?  
[Join the EloqCloud Waitlist](https://cloud.eloqdata.com/join-waitlist) today — and receive an exclusive invitation to try EloqCloud for free.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/joinwaitlist.png').default} alt="Building a Data Foundation for Agentic AI Applications" />

</div></p>

📺 **Watch our quick demo video below to see EloqCloud in action!**

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
  <video controls src="/video/eloqcloud.mp4" width="800" />

</div></p>

We'll be sharing detailed benchmark results and comparisons with other key-value stores in upcoming posts — stay tuned!
