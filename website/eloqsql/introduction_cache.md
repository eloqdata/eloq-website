---
title: EloqSQL Introduction
---

# MonoCache Introduction

EloqSQL

## Key Features

1. **Redis Compatible**: EloqSQL is compatible with MySQL protocol by leveraging the MySQL Parser and Executor as compute engine. Innodb storage engine is replaced by enhanced Data Substrate, which supports different transaction isolation level and concurrency control protocol, distributed buffer pool, data persistence and high availability.

2.

3. **Elastic Parallel Logging**: Write intensive workload requires the scalability of log service. Traditional databases write and fsync redo logs in the order of log sequence number into a single disk, which becomes the bottleneck of the whole system. EloqSQL's patented 1-PC technique enables concurrent transactions to write and fsync redo logs into multiple disks in parallel. Benchmark shows 4X TPS improvement compared with AWS Aurora.

4. **Elastic Memory Cache**: Read intensive workload requires the scalability of memory resource. To achieve low read latency, it is important to hold all the hot data into memory. EloqSQL supports hash and range partition, which can store a large amount of hot data across multiple hosts. As the hot data grows, EloqSQL can scale-out the cluster and rebalance the data range automatically. Cold data will be checkpointed into KV stores which can serve cache miss read.

5. **Decoupled Cloud Storage**: Large dataset requires a decouple storage layer which can be individually scaled regardless of read and write traffic. To reserve additional compute and memory for cold data is a waste of resource. Traditional shared-nothing architecture requires to add more compute nodes as the data volumn scales even if the read and write traffic is unchanged. EloqSQL's decoupled cloud storage enable you to only pay for the disk plus the IOPS cost of cold data.

6. **High Performance Distributed Transaction**:
