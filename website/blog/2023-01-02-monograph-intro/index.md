---
title: Introduction to EloqDB
authors: eloq
date: 2023-11-06
tags: [Company]
---

Established in 2021, EloqDB is a start-up company focusing on the database field. The founding team comes from Microsoft Asia Research Institute and VMware. They have more than ten years of experience in database research and development, and have published many related academic papers at top database conferences. At present, they have received investment from top technical experts and venture capital investment funds. EloqDB is committed to creating new next generation of enterprise-level database and data management solutions with independent property rights and global differentiation.

<!--truncate-->

EloqDB is a distributed database based on the Data Substrate, which supports both private and public cloud deployment. The Data Substrate implements core database functions such as data caching, concurrent reading and writing, persistence, consistency, and fault tolerance. Through the assembly of modules, data products based on the Data Substrate can flexibly and efficiently support multiple data models, and realize horizontal or vertical dynamic expansion while supporting transactions and high availability.

The concept of Data Substrate comes from the team's thinking and summary of database architecture over the years. The infrastructure of different database products requires many similar components, including transaction management, distributed fault tolerance, elastic expansion, etc., but the difference "may only be 10% to 20%". Therefore, EloqDB establishes a standardized API in a modular way by abstracting the common functions of different databases, and establishes a unified data base for databases with different functions. In effect, the Data Substrate architecture of EloqDB can unify the basic functions of the database without sacrificing performance, assemble modules with different functions through decoupling, and quickly build a database that can adapt to different scenarios and applications, a more flexible database to meet the increasingly complex data needs from users.

EloqDB for OLTP version is the first product of EloqDB, which focus on OLTP scenario. Data front end is compatible with the MySQL protocol, and the data storage supports Cassandra and DynamoDB cloud services. Based on the three-tier separation architecture of computing, memory and storage, it can flexibly and dynamically balance the performance and cost of distributed databases.

- MariaDB computing engine, compatible with MySQL protocol
- Support multiple concurrency protocols: MVCC/OCC/LOCKING
- Support multiple isolation levels: READ COMMITTED/REPEATABLE READ
- Support ternary elastic scaling: computing, memory state and storage
- Support multi-node read and write
- Separation of hot and cold data: hot data is stored in the data substrate layer; cold storage is in distributed KV storage
- Asynchronous Checkpoint: KV performance jitter does not affect database query performance
- Support cloud-native deployment

![](img/datasubstrate.png)

Compared with the traditional NewSQL database, it can perfectly solve the problems that computing nodes do not support caching, KV background operation affects system stability, etc., and its performance in benchmarks such as TPCC is also better.

EloqDB——For OLTP version is very suitable for application scenarios with changing traffic, such as e-commerce promotion, game copy, traffic ticket grabbing, etc. Traffic changes include two aspects: the change in the ratio of hot and cold data and the change in the amount of concurrent queries. In order to adapt to traffic change scenarios, distributed databases need to support: 1. Add more memory to cache hot data. 2. Add more computing resources to handle concurrency and new data.

The storage and memory of traditional NewSQL databases are tightly coupled. Therefore, for traffic change scenarios, data needs to be redistributed in advance, which will involve a large amount of disk data movement.

EloqDB for OLTP can independently expand the memory layer (data substrate layer) horizontally without moving the storage layer data to cache more hot data and handle higher concurrent queries.

In the future, the scalable data substrate layer is applicable to any data mode, and EloqDB will have more products in the market.
