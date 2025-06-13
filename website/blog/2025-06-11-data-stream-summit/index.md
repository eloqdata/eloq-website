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

At the recent [Data Stream Summit 2025](https://datastreaming-summit.org/event/data-streaming-virtual-2025/speakers), Hubert Zhang, CTO of EloqData, delivered a talk on building elastic agentic AI data pipelines using [Apache Pulsar](https://pulsar.apache.org/) and [EloqDoc](/product/eloqdoc). 

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

The rise of autonomous, agentic AI applications has significantly increased demands on underlying data infrastructure, emphasizing the critical need for scalable, flexible, and cost-efficient solutions. There are many discussions on scalability and flexibility of modern data infrastructures. EloqData's [Data Substrate](/blog/2024/08/11/data-substrate) architecture is designed from ground up for these goals. Achieving cost-efficiency, on the other hand, isn’t straightforward. Many organizations only realize the hefty database costs when they receive unexpectedly high bills from cloud vendors. In this post, we discuss how our revolutionary architecture offer ultimate cost savings to our customers. To understand this issue better, let's first explore traditional cloud data infrastructure’s pain points, particularly those using EBS or local NVMe storage.

## Challenges with Traditional Cloud Architectures

Traditional database architectures almost always assumes that disks are durable and network is free. This is far from the reality in the cloud. Cloud architectures carry significant economic and operational differences from traditional data centers. In particular:

- **Expensive and Slow Persistent Storage:** EBS provides durability but at high cost and limited performance.
- **Ephemeral Local Storage:** Local NVMe storage is fast but lacks durability, making it unsuitable for critical data storage.
- **High Cross-AZ and Cross-Region Costs:** Conventional architectures generate substantial network costs due to mandatory replication and frequent data movement across availability zones or regions.

Due to these differences, traditional database architecture is often not optimal after migrating to the cloud. Indeed, the most widely used stroage in the cloud is Object Storage, examplified by AWS S3. This is a new storage class that is foreign to most traditional database architectures. 

## Object Storage: The New Storage Standard in Cloud

Object storage offers significant benefits, including cost-effective scalability and separation between compute and storage, allowing optimized resource usage and substantial cost reductions. The key advantages of object storage include:

- **Persistent Durability:** Unlike EBS, which replicates data only within one AZ, object storage supports cross-AZ and cross-region replication by default, delivering durability with SLA guarantees of up to 99.999999999%.
- **Elimination of Cross-AZ Network Costs:** Leveraging object storage significantly reduces expensive cross-AZ replication fees.
- **Cost-Effective Bandwidth Usage:** In failover scenarios, pulling large datasets (TBs of data) from object storage incurs minimal costs—approximately \$0.1 per million requests, far less than other cloud storage.
- **Lowest Storage Cost Per GB:** Object storage is approximately 3.5 times cheaper than standard EBS, making it the most economical storage choice available.

Newer generation of databases have already started to leverage object storage, marking a clear industry shift. In the last decade, OLAP systems are the first to embraced object storage, with databases such as Snowflake and data formats such as Iceberg and Parquet taking full advantage of S3 and other object storage systems. More recently, streaming systems such as [StreamNative](https://streamnative.io/)'s Ursa engine have also started take advantage of object storage as the primary data store. Recognizing this trend, [Confluent]() has acquired [WarpStream](https://www.warpstream.com/), and introduced Freight Clusters that similarly utilize object storage. Vector and full-text search engines such as [turbopuffer](https://turbopuffer.com) have also made object store their main storage. 

 However, directly using object storage slightly increases latency. This might be acceptable for OLAP workloads and in asynchronous event-driven architectures, this latency is less ideal for databases where performance is crucial. Therefor, object storage is still rarely used in databases that handle OLTP workloads. 

## EloqDoc: A Cost-Efficient, High-Performance Document Database

Taking advantage of EloqData's ground breaking decoupled architecture, we are glad to announce that [EloqDoc](../product/eloqdoc), our MongoDB compatible JSON doucment store, addresses this specific challenge effectively. EloqDoc can take full advantage of object store and applies its advantage to a document databases, unlocking gains in elasticity, high performance, and substantial cost reductions. Unlike [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)—which incurs significant costs due to multiple replicas and cross-AZ traffic, EloqDoc efficiently utilizes object storage as its persistence layer.

Key advantages of EloqDoc include:

- **Stateless Compute with Single Replica:** Dramatically reduces unnecessary CPU and memory overhead while ensuring high availability and zero data loss.
- **Object Storage as Primary Storage:** Achieves high durability and cost-effectiveness by batching data writes asynchronously, mitigating the high latency of object storage. Note that data durability for recent writes is ensured by EBS.
- **Local NVMe Caching:** Provides high-throughput, low-latency reads, significantly outperforming EBS in IOPS. Local NVMe serves as the cache of object storage.
- **Scalable Redo Logs:** Enhances write performance economically by scaling with additional EBS storage.
- **MongoDB Compatibility and Transactions:** Supports seamless migration from MongoDB 4.0 with comprehensive distributed transaction capabilities powered by [Data Substrate](/blog/2024-08-11-data-substrate).

EloqDoc effectively addresses object storage latency concerns by leveraging local NVMe storage as a cache. Modern cloud storage-optimized instances typically offer substantial local NVMe storage (around 3.5TB per 16-core server), enabling efficient caching of active datasets and delivering exceptional performance and reduced operational costs.

Note that other cloud-native databases like [Neon](https://neon.com/) use a separate page server layer to cache data from object storage. However, there's no free lunch — you pay not only for the page server's storage but also for its CPU and memory usage. Additionally, cache misses trigger network reads, increasing latency. In contrast, using local NVMe as an object storage cache, as EloqDoc does, offers lower latency and better cost efficiency.


# Summary of the Video
In Hubert's presentation, we showcase how we can leverage EloqDoc and StreamNative’s Ursa to scale data pipelines. StreamNative’s Ursa is an innovative streaming storage solution that disrupts traditional models like Kafka, which rely heavily on costly persistent storage and cross-AZ traffic. Ursa's revolutionary design is diskless, stateless, and leverages object storage for direct data streaming. Key innovations of Ursa include:

- **Diskless Architecture:** Removes the dependency on expensive EBS storage, significantly cutting storage costs.
- **Stateless Brokers:** Allows instant scalability and seamless failover without moving data around.
- **Leaderless Operation:** Avoids traditional Kafka partition leader issues, thereby eliminating latency and cross-AZ network expenses.

Together with the EloqDoc, an efficient and cost-effective data pipeline can be built with object as primary data store. Fully taking advantage of the modern cloud storage infrastructure. 
