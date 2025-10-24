---
title: "EloqCloud for EloqDoc: 10X Cheaper Document DBaaS"
date: 2025-10-23
authors: eloq
tags: [Product]
news: true
image: /img/blog/eloqcloudforeloqdoc.jpg
description: "Announcing EloqCloud for EloqDoc — a MongoDB-compatible document DBaaS that’s up to 10× cheaper than traditional solutions like MongoDB Atlas."
---

# EloqCloud for EloqDoc: 10× Cheaper MongoDB-Compatible DBaaS  

After the successful launch of [EloqCloud for EloqKV](https://www.eloqdata.com/news/2025/04/29/eloqcloud), today we are excited to announce **EloqCloud for EloqDoc** — our new **MongoDB-compatible document database** built for the cloud era.

<!--truncate-->

**EloqCloud for EloqDoc**  brings a breakthrough architecture that redefines the balance between cost, scalability, and performance for document workloads.

<p align="center">
<div style={{ width: '640px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqcloudforeloqdoc.jpg').default} alt="EloqCloud for EloqDoc" />

</div></p>

---

### Key Features of EloqCloud for EloqDoc

- **MongoDB-Compatible API** – Migrate your applications effortlessly.  
- **Tiered Storage Architecture** – Seamlessly manages hot and cold data between memory, NVMe, and object storage.  
- **Compute–Storage Decoupling** – Scale storage independently from compute for massive datasets at minimal cost.
- **Predictable High Performance** – Every instance, even in the free tier, comes with **dedicated resources**, delivering **up to 10X higher throughput** than MongoDB Atlas’s free tier.  

---

### First Production-Ready Free Tier for DocumentDB

EloqCloud for EloqDoc introduces a **production-grade free tier** with dedicated resources:

- **25 GB free storage** — 50X larger than MongoDB Atlas, Supabase, or Neon 
- **Automatic scale-to-zero** — Resources are freed when idle to minimize cost  
- **Instant cold start** — Bring your environment back online in seconds
- **High performance** - 10X higher throughput compared with MongoDB Atlas's free tier.

You can start building your application with a **real, isolated and predictable document database** — not shared compute or ephemeral sandboxes.

Below is the performance comparison between MongoDB Atlas and EloqCloud for EloqDoc (Free Tier) across three typical workloads — Read Only, Read Write, and Write Only.

The results show a dramatic difference: EloqCloud for EloqDoc consistently outperforms MongoDB Atlas by nearly an order of magnitude, delivering up to 10× higher throughput even on its free-tier environment.

<p align="center">
<div style={{ width: '640px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqdocmongofreetier.jpg').default} alt="EloqCloud for EloqDoc" />

</div></p>

---

### Flexible, Cost-Efficient Pricing Plan

Beyond the industry’s first **production-grade free tier**, EloqCloud for EloqDoc offers the **most flexible and affordable paid plans** in the market.  
You pay only for what you use — with **no forced replication, no bundled resources**.

| Resource Type | Unit Price              | Notes                               |
| ------------- | ----------------------- | ----------------------------------- |
| **Storage**   | **$0.10 / GB / month**  | Includes cross-AZ high availability |
| **Compute**   | **$0.14 / vCPU / hour** | Independent compute billing         |

You can scale compute and storage **independently** — keep a large dataset with a small compute footprint, or burst compute when you need it.

Below is the price comparison between MongoDB Atlas and EloqCloud for EloqDoc under the same configurations.

While both platforms offer similar compute and memory setups, the difference in architecture leads to dramatically different pricing.

EloqCloud for EloqDoc leverages object storage as its primary data layer and local SSDs for caching, delivering significant cost savings compared to MongoDB Atlas, which depends on multiple replicas and EBS-based storage.

<p align="center">
<div style={{ width: '640px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/mongoeloqdocprice.jpg').default} alt="EloqCloud for EloqDoc" />

</div></p>

---

### The Most Cost-Effective Architecture Ever Built for Document Databases

How can EloqCloud for EloqDoc deliver a **production-grade free tier** and **significant cost savings** compared to MongoDB Atlas? The answer lies in its **Cost-Effective Architecture**, a reimagined foundation purpose-built for the cloud.

MongoDB Atlas requires at least **three replica set nodes** to maintain availability — which **triples compute and memory consumption**. Even worse, it relies on **EBS volumes** as the default storage layer, which are significantly more expensive than cloud object storage. Since each EBS volume maintains **three replicas per compute node**, a standard three-node replica set ends up with **nine total storage replicas**, leading to excessive storage overhead and cost.

In contrast, **EloqCloud for EloqDoc** achieves the same or better reliability with a **storage-centric design** that eliminates redundant replicas and maximizes efficiency:

- **Storage-Driven High Availability** – Instead of replicating compute nodes, EloqDoc leverages **cloud object storage** with cross-AZ replication. This provides durable, high-availability storage while **reducing CPU and memory cost by up to 3X**.  
- **Object Storage as Primary Storage** – By replacing EBS with cloud object storage, EloqDoc reduces storage expenses by up to 10X while providing built-in cross-AZ durability — with no extra replication overhead. 
- **Local NVMe as Cache** – Each vCPU is paired with **200+ GB of local NVMe**, offering **10–100X higher IOPS** than EBS and drastically reducing cache-miss latency for faster read performance.  
- **Kubernetes-Based Failover** – A single compute replica is protected by **Kubernetes auto-failover**, which instantly restarts the compute pod on failure — ensuring **zero data loss** and no manual intervention.  

This architecture enables **EloqCloud for EloqDoc** to deliver lower TCO and superior performance for real-world production workloads.

---

### Try EloqCloud for EloqDoc Today

EloqCloud for EloqDoc is now available for public access.

[Start for Free](https://cloud.eloqdata.com/signup) and experience the next-generation document database —  
**MongoDB-compatible, object storage first, high performance and cost effective.**
