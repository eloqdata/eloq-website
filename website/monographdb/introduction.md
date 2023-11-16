---
title: MonographDB Introduction
---

# MonographDB Introduction

MonographDB

MonoSQL is a stateless SQL wrapper for Amazon DynamoDB. Customer is enable to migrate from RDS to DynamoDB without modifying their application code, but can still benefit from the consistent performance at scale, full managed and high availability features supplied by DynamoDB. MonoSQL is MySQL8.0 compatible. Customer can still use JDBC/ODBC to connect to database and use rich SQL query language like join, aggrgate and recursive cte to query data.

MonoSQL servers are stateless, with all the catalog and user data stored in DynamoDB. This design makes MonoSQL simple and stable. MonoSQL is fault tolerant, a new instance or pod will be created automatically by auto scaling group or Kubernetes cluster when MonoSQL server failure is detected. The traditional database recovery process is skipped in MonoSQL, since all the data is persistent at DynamoDB following a synchronous way.

## Key Features

1. **MySQL Compatible**: MonographDB is compatible with MySQL protocol by leveraging the MySQL Parser and Executor as compute engine. Innodb storage engine is replaced by enhanced Data Substrate, which supports different transaction isolation level and concurrency control protocol, distributed buffer pool, data persistence and high availability.

2. **Elastic Parallel Logging**: Write intensive workload requires the scalability of log service. Traditional databases write and fsync redo logs in the order of log sequence number into a single disk, which becomes the bottleneck of the whole system. MonographDB's patented 1-PC technique enables concurrent transactions to write and fsync redo logs into multiple disks in parallel. Benchmark shows 4X TPS improvement compared with AWS Aurora.

3. **Elastic Memory Cache**: Read intensive workload requires the scalability of memory resource. To achieve low read latency, it is important to hold all the hot data into memory. MonographDB supports hash and range partition, which can store a large amount of hot data across multiple hosts. As the hot data grows, MonographDB can scale-out the cluster and rebalance the data range automatically. Cold data will be checkpointed into KV stores which can serve cache miss read.

4. **Decoupled Cloud Storage**: Large dataset requires a decouple storage layer which can be individually scaled regardless of read and write traffic. To reserve additional compute and memory for cold data is a waste of resource. Traditional shared-nothing architecture requires to add more compute nodes as the data volumn scales even if the read and write traffic is unchanged. MonographDB's decoupled cloud storage enable you to only pay for the disk plus the IOPS cost of cold data.

5. **High Performance Distributed Transaction**:
