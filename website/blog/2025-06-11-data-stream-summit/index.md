---
title: 'The Rise of Object Storage in Cloud OLTP Architecture'
authors: eloq
date: 2025-06-11
tags: [Company]
image: /img/dds2025.jpeg
description: At Data Stream Summit 2025, EloqData showed how Ursa and EloqDoc use object storage to cut costs and boost scalability—redefining cloud OLTP and streaming for AI-era workloads.
featured: true
blog: true
featuredMain: true
---

At the recent [Data Stream Summit 2025](https://datastreaming-summit.org/event/data-streaming-virtual-2025/speakers), Hubert Zhang, CTO of EloqData, delivered a talk on building elastic, agentic AI data pipelines using [Apache Pulsar](https://pulsar.apache.org/) and [EloqDoc](https://www.eloqdata.com/product/eloqdoc).

<!--truncate-->

<div align="center">
  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/VwOh2e7cwbA"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

The rise of autonomous, agentic AI applications has dramatically increased demands on underlying data infrastructure—highlighting the need for scalable, flexible, and cost-efficient solutions. While scalability and flexibility are widely discussed, cost-efficiency is harder to achieve. Many organizations only recognize the high cost of databases when faced with unexpectedly large cloud bills.

EloqData's [Data Substrate](/blog/2024/08/11/data-substrate) architecture is built from the ground up to address these challenges. In this post, we explore how our innovative approach delivers substantial cost savings. To understand the context, let’s first examine the pain points of traditional cloud data infrastructures, particularly those relying on EBS or local NVMe storage.

## Challenges with Traditional Cloud Architectures

Traditional database architectures often assume that disk storage is durable and networking is free—assumptions that don't hold true in the cloud. Cloud environments introduce unique economic and operational characteristics. Key issues include:

- **Expensive and Slow Persistent Storage:** EBS offers durability, but at high cost and with limited performance.
- **Ephemeral Local Storage:** Local NVMe is fast but lacks durability, making it unsuitable for critical data.
- **High Cross-AZ and Cross-Region Costs:** Conventional architectures incur substantial network expenses due to required replication and frequent cross-zone or cross-region data transfers.

Because of these differences, traditional architectures often perform poorly after migrating to the cloud. The most widely adopted storage class in the cloud is now **object storage**, exemplified by AWS S3—a format that traditional databases were not designed to support.

## Object Storage: The New Storage Standard in the Cloud

Object storage provides key benefits that enable cost-effective scaling and separation of compute and storage resources. Its advantages include:

- **High Durability:** Object storage offers cross-AZ and cross-region replication by default, with SLAs up to 99.999999999% durability.
- **Reduced Network Costs:** Eliminates costly cross-AZ replication fees.
- **Low Bandwidth Cost for Access:** Even in failover scenarios, retrieving terabytes of data costs around \$0.10 per million requests—far lower than other storage solutions.
- **Lowest Cost Per GB:** Object storage is approximately 3.5× cheaper than standard EBS.

Next-generation databases are already leveraging object storage. OLAP systems were early adopters, with technologies like Snowflake and formats like Iceberg and Parquet making full use of S3. More recently, streaming platforms such as [StreamNative](https://streamnative.io/)'s Ursa engine have adopted object storage as the primary storage layer. Recognizing this trend, [Confluent](https://www.confluent.io/) acquired [WarpStream](https://www.warpstream.com/) and introduced Freight Clusters that also utilize object storage. Vector and full-text search engines like [Turbopuffer](https://turbopuffer.com) have followed suit.

However, using object storage directly introduces additional latency. While acceptable for OLAP workloads and asynchronous event-driven architectures, this latency is less suitable for OLTP workloads that demand low-latency responses. As a result, object storage is rarely used in OLTP database systems—until now.

## EloqDoc: A Cost-Efficient, High-Performance Document Database

Leveraging EloqData’s groundbreaking decoupled architecture, [EloqDoc](../product/eloqdoc)—a MongoDB-compatible JSON document store—effectively solves this challenge. EloqDoc fully embraces object storage, extending its benefits to document databases and unlocking elasticity, performance, and cost-efficiency. Unlike [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), which incurs high costs from multiple replicas and cross-AZ traffic, EloqDoc uses object storage as its persistent layer.

Key advantages of EloqDoc include:

- **Stateless Compute with Single Replica:** Minimizes CPU and memory overhead while ensuring high availability and zero data loss.
- **Object Storage as Primary Storage:** Batches writes asynchronously to mitigate object storage latency, while recent data is safeguarded with EBS for durability.
- **Local NVMe Caching:** Delivers high-throughput, low-latency reads that outperform EBS IOPS by caching object storage locally.
- **Scalable Redo Logs:** Improves write performance cost-effectively using additional EBS volumes.
- **MongoDB Compatibility and Distributed Transactions:** Seamless migration from MongoDB, with robust transaction support powered by [Data Substrate](/blog/2024-08-11-data-substrate).

EloqDoc addresses the latency challenge by using local NVMe storage as an intelligent cache. Modern cloud-optimized instances offer significant local NVMe capacity (e.g., 3.5TB per 16-core server), enabling high-performance caching of active data while reducing costs.

## Summary of the Video

In Hubert’s presentation, we demonstrate how EloqDoc and StreamNative’s Ursa can be combined to build scalable, efficient data pipelines. Ursa is an innovative streaming storage engine that disrupts traditional models like Kafka, which rely on costly persistent storage and cross-AZ replication.

Key innovations of Ursa include:

- **Diskless Architecture:** Eliminates the need for expensive EBS storage.
- **Stateless Brokers:** Enables instant scaling and seamless failover without data movement.
- **Leaderless Design:** Avoids Kafka’s partition leader bottlenecks, reducing latency and cross-AZ costs.

Together with EloqDoc, Ursa enables the construction of a modern data pipeline that uses object storage as the primary data layer—fully realizing the potential of cloud-native infrastructure.
