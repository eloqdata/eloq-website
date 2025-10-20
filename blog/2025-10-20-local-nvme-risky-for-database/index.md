---
title: "Lessons from the AWS us-east-1 Outage: Why Local NVMe as Primary DB Storage Is Risky"
authors: eloq
date: 2025-10-20
tags: [Company]
image: /img/blog/awsoutage.jpg
description: "Many databases recommend local NVMe for performance with cross-AZ replicas for durability. The AWS outage showed how this can still lead to data loss. Here’s a breakdown and a safer alternative."
blog: true
featured: false
featuredMain: false
---

# 🚨 When Your Database Lives on Local NVMe: What the AWS us-east-1 Outage Just Taught Us

On October 20, 2025, AWS experienced a major disruption across multiple services in the **us-east-1 region**. According to [AWS Health Status](https://health.aws.amazon.com/health/status), various compute, storage, and networking services were impacted simultaneously. For many teams running OLTP databases on **instances backed by local NVMe**, this was not just a downtime problem—it was a **data durability nightmare**.

<p align="center">
<div style={{ width: '80%', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/awsoutage.jpg').default} alt="x" />

</div></p>

Cloud databases must constantly balance **durability, performance, and cost**. In modern cloud environments, there are three main types of storage available:

| Storage Type            | Durability  | Latency      | Cost           | Persistence Across VM Crash |
| ----------------------- | ----------- | ------------ | -------------- | --------------------------- |
| **Block Storage (EBS)** | ✅ High      | ⚠ Medium     | 💰 High         | ✅ Data persists             |
| **Local NVMe**          | ❌ None      | ✅ Ultra-fast | ✅ Low per IOPS | ❌ Lost on restart/crash     |
| **Object Storage (S3)** | ✅ Very High | 🐢 Slow       | ✅ Lowest       | ✅ Persistent                |

Let’s break down the trade-offs and why recent events place a spotlight on risky architectural choices.

---

## 📦 Option 1: Block-Level Storage (EBS) — Durable but Expensive and Slow

EBS is the default choice for reliability:

* It survives instance failures.
* It supports cross-AZ replication via multi-replica setups.
* It enables quick reattachment to replacement nodes.

**But the downside?**

* GP2/GP3 disks deliver modest IOPS and high latency.
* High-performance variants like IO2 are *extremely expensive* when provisioned for hundreds of thousands of IOPS.
* Scaling performance often means scaling cost linearly.

EBS gives you durability—but performance per dollar is disappointing.

---

## ⚡ Option 2: Local NVMe — Fast but Ephemeral (and Now Proven Risky)

Instance families like **i4i** provide **400K+ to 1M+ IOPS** from local NVMe, making them a natural fit for databases chasing performance.

So many database vendors recommend:
- ✅ Use local NVMe for primary storage
- ✅ Add cross-AZ replicas for durability

**But here’s the problem:** Local NVMe is *tied to the node lifecycle*.
If the node restarts, fails, gets terminated due to spot interruption, or is impacted by a region-level failure such as the recent us-east-1 outage—you lose **ALL** the data.

During routine failures, cross-AZ replicas often protect you. But during region-wide degradation or cascading incidents, with **local NVMe**, there is *nothing to recover*. The storage is simply gone. What you can do is to recovery from recent backups — often lagging days. Write loss is guaranteed between last backup and crash.

In contrast, EBS volumes can always be reattached to a new node.

👉 The AWS us-east-1 outage just validated that *“local NVMe + async replication” is a high-risk strategy for mission-critical databases.*

---

## ☁️ Option 3: Object Storage (S3) — Durable & Cheap, But Latency Is a Challenge

Object storage is:
- ✅ 3x cheaper than block storage
- ✅ Regionally and cross-region durable
- ✅ Built to survive region-level failures
- ✅ Practically infinite
- ✅ A first-class citizen for modern cloud-native platforms

But the challenge remains: **S3 latency is too high for OLTP** if accessed synchronously.

This is why traditional OLTP engines avoid it.

So the question becomes:
🧠 *How do we get the cost & durability benefits of S3 without paying the latency penalty?*

---

## ✅ The Data Substrate Approach: Object Storage First, NVMe as Cache, EBS for Logs

EloqData treats **object storage (e.g., S3)** as the **primary data store**, and architect the system to avoid the usual latency pitfalls:

| Layer                   | Role                   | Why                                  |
| ----------------------- | ---------------------- | ------------------------------------ |
| **S3 (Object Storage)** | Primary data store     | ✅ Ultra-durable, ✅ Cheap             |
| **EBS (Block Storage)** | Durable log storage    | ✅ Small volume, ✅ low latency writes |
| **Local NVMe**          | High-performance cache | ✅ Accelerates reads & async flushes  |

Through [Data Substrate](/blog/2024/08/11/data-substrate), we decouple storage from compute and split durability between:
- ✅ Log: persists immediately to EBS
- ✅ Data store: periodically checkpointed to S3 (async + batched)
- ✅ NVMe: purely a cache layer, safe to lose at any time

This allows us to:
- ✅ Withstand node crashes seamlessly
- ✅ Recover fully even if local NVMe is wiped
- ✅ Handle region-level disruption by replaying logs and checkpoints
- ✅ Enjoy millions of IOPS from NVMe without durability risk
- ✅ Cut storage cost by 3x+ compared to full EBS-based systems

Check out more on our products powered by Data Substrate:
- [EloqKV](https://github.com/eloqdata/eloqkv)
- [EloqDoc](https://github.com/eloqdata/eloqdoc)
- [EloqSQL](https://github.com/eloqdata/eloqsql)

---

## 🌍 The Larger Industry Trend

We are not alone in this shift. The broader ecosystem is moving object-storage-first:

| System                     | Use of Object Storage           |
| -------------------------- | ------------------------------- |
| Snowflake                  | OLAP on S3                      |
| StreamNative Ursa          | Streaming data on S3            |
| Confluent Freight Clusters | Streaming data on S3            |
| Turbopuffer                | Vector & full-text search on S3 |

EloqData brings this model to OLTP with a transactional, low-latency engine powered by Data Substrate.

---

## 📘 After the Outage: A Hard Question Every Architect Should Ask

> *If my database node died right now, would I lose all my data?*

If you're running a primary database on **local NVMe**, and relying solely on async replicas, the answer might be yes.

It’s time to rethink durability assumptions in the cloud era.

---

## ✅ TL;DR

| Strategy                                         | Performance | Durability | Region Outage Risk | Cost |
| ------------------------------------------------ | ----------- | ---------- | ------------------ | ---- |
| EBS only                                         | ❌ Limited   | ✅          | ✅                  | 💰💰💰  |
| Local NVMe only                                  | ✅✅✅         | ❌          | ❌                  | 💰💰   |
| NVMe + async replicas                            | ✅✅✅         | ⚠ Partial  | ⚠ High             | 💰💰   |
| Object Storage + Log + NVMe Cache (**EloqData**) | ✅✅          | ✅✅         | ✅✅                 | 💰    |

---

## 🔥 Final Thought

AWS us-east-1 just reminded the industry:
**Performance is replaceable. Lost data is not.**

With the right architecture, you don’t have to choose.

👉 *Build fast.*
👉 *Stay durable.*
👉 *Be outage-proof.*

That’s the future we’re building at **EloqData**. 

Check out more on our open source databases:
- [EloqKV](https://github.com/eloqdata/eloqkv)
- [EloqDoc](https://github.com/eloqdata/eloqdoc)
- [EloqSQL](https://github.com/eloqdata/eloqsql)
