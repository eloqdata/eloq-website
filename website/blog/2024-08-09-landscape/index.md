---
title: Introduction to Data Substrate (Part 2 of 3)
authors: eloq
date: 2024-08-09
tags: [Company]
---

This is the second part of our three-part introduction to Data Substrate. You can read the other pieces [here](/blog/2024/08/08/underpinning) and [here](/blog/2024/08/11/data-substrate). In this blog, we discuss why we need so many databases today, why they are now creating so much headache, and what kind of foundation we need to construct the new generation modern databases in the cloud era.

<!--truncate-->

To understand why we reached our current state, we need to go back to the late 1990s and early 2000s. But before discussing the numerous new database systems, let’s first understand what the old-fashioned Relational Database Management System(RDBMS) is. In our opinion, there are three definitive features of the traditional RDBMS.

- The relational data model [Wikipedia Link](https://en.wikipedia.org/wiki/Relational_model)
- The declarative SQL query language [Wikipedia Link](https://en.wikipedia.org/wiki/SQL)
- The transactional semantics [Wikipedia Link](https://en.wikipedia.org/wiki/Database_transaction)

The first and second points are both easy to understand. The third important feature, i.e. the transaction semantics, is basically the famous [ACID properties](https://en.wikipedia.org/wiki/ACID). The operations to query and modify data in a database system needs to be [Atomic](<https://en.wikipedia.org/wiki/Atomicity_(database_systems)>), [Consistent](<https://en.wikipedia.org/wiki/Consistency_(database_systems)>), [Isolated](<https://en.wikipedia.org/wiki/Isolation_(database_systems)>), and [Durable](<https://en.wikipedia.org/wiki/Durability_(database_systems)>).

Before late 1990s, data intensive applications traditionally meant business applications such as bank transactions and monthly payrolls. RDBMS satisfied the demands of these applications quite well, and companies such as Oracle and IBM found great success commercially for their RDBMS products. Indeed, their products are still very popular for these applications today and create huge amounts of profits year after year with virtually the same architecture even after all these years.

But the meteoric rise of the Internet changed this for good. Internet applications such as search engines, e-commerce sites and social networks redefined what data intensive workload meant. There are three directions that drove the research and commercialization of new database systems, namely scalability, data models, and data access patterns and latency requirements.

### Scalability:

In the internet era, the sheer volume of data generated every second is staggering. From social media posts and e-commerce transactions to sensor data from IoT devices, the need for efficient, scalable storage systems has never been greater. Traditional relational databases, while robust and reliable, often struggle to keep up with these massive data influxes. This has led to the emergence of new database paradigms designed specifically for scalability.

Making a database system scale is not easy. Indeed, there were a lot of discussions about the so-called CAP theorem back in the old days. Interested readers can read many articles available on the internet to learn about this topic and its variations, such as the PACELC theorem. It is sufficient to say, that scaling a data storage system out onto a cluster of servers is very hard, doing so while maintaining the ACID properties without significantly sacrifice efficiency and performance is even harder.
s
Therefore, in the early 2000s, to scale a database system while still maintaining reasonable efficiency, people had to satisfy some aspects of the ACID properties. Two landmark systems that exemplify this shift are Google's BigTable and Amazon's Dynamo. Both were developed to meet the specific needs of their creators—handling vast amounts of data with high availability and low latency. They introduced innovative approaches to achieve scalability. In BigTable’s case, atomicity is limited to single row, while in Dynamo’s case, strong consistency is further replaced with a less strict eventual consistency model to allow the system to scale. Several other systems, such as Cassandra, followed the same model by trading off scalability with consistency guarantees.

The lack of consistency in these scalable systems is certainly not un-noticed. Mike Stonebraker famously wrote an article in Communication of ACM declaring “No ACID Equals No Interest” for enterprise users. As time goes by, new algorithms and systems have been designed to alleviate this problem. Proprietary systems such as F1, Percolator, and Spanner from Google, as well as commercial systems such as CockroachDB, YugaBytes and TiDB have all tried to build a scalable database while still maintaining the ACID semantics. These shared-nothing systems can scale, but often at the cost of significant loss of efficiency and increased latency.

Another direction people have been taken is shared-storage database systems, as exemplified by Amazon Aurora, Microsoft SQL Server HyerScale, and recently NeonDB. These databases can scale the storage space by leveraging the infinite cloud storage, but generally sacrifice scalability by only allowing a single writer node to operate on the database. They do allow multiple readers, often slightly lag behind the writer, to scale read throughput. By avoid distributed transactions, these systems are much more efficient and have a lower latency than the shared-nothing databases.

### Data Models

The second trend that appeared in the early 2000s is the demand to process diverse data models. It's increasingly clear that the traditional table-based relational model doesn't fit all workloads. With the advent of diverse data types and structures—such as streaming data, graph data, and JSON documents—new data models have emerged to meet these unique needs. These models not only require different storage formats to ensure efficient storage and retrieval but also necessitate specialized query languages for effective data processing.

Some of the more popular data models include straming data, graph data, and JSON documents. Streaming databases such as Apache Kafka and Apache Pulsar process continuous flow of data generated from sources such as social media feeds, sensor networks, and financial transactions. Similarly, Graph databases like Neo4j and Amazon Neptune are built to efficiently store and traverse graph data structures, which are used to model complex relationships and interconnections. JSON (JavaScript Object Notation) has become a popular data format due to its flexibility and ability to represent nested data structures. Document-oriented databases like MongoDB and Couchbase are designed to store and query JSON documents efficiently. Specialized query languages have been designed to tackle these special data models. Some of the specially designed query langauges examples include Kafka's KSQL for streams, Neo4j's Cypher for graph prcessing, and Couchbase's SQL++ for document query.

New data models continue to emerge due to new demand from applications. Recently, [vector databases](https://en.wikipedia.org/wiki/Vector_database) becomes popular due to recent boom in AI. As technology progresses, we expect additional data models continue to emerge and modern databases have to be able to handle them gracefully.

### Data access patterns and latency requirements

The third driving force leading us to the current state of data management systems is the data access patterns and latency requirements for data intensive applications. When a query comes in, a certain amount of data needs to be accessed and processed by the data management system and returned to the customer with some latency constraint. How to handle such queries efficiently and effectively laid out many design choices explored by various available database system.

The first dimension is how much total data is stored in the system. Often, if the amount of data is relatively small, the data can be fully loaded into memory to allow extremely fast access. Users of systems like Memcached and Redis often use them as pure in-memory cache and forgo persistency to obtain lowest latency possible for online services. In-memory databases such as SAP Hana and MemSQL also often need to load the entire database into main memory, though they usually still needs logging and checkpointing into persistent storage in order to maintain the ACID properties.

The second dimension is how data are accessed. If the data needs fast random access during the query time but has relatively few updates, traditional B-Tree is often a good choice, as used by many traditional RDBMS systems such as MySQL or PostgreSQL. If, on the other hand, write throughputs is also important, systems like Cassandra and MongoDB often take advantage of LSM-Tree based storage engines such as RocksDB and WiredTiger. To efficiently process queries that need to scan the tables, data is often stored in columnar formats. Parquet, Iceberg and Arrow are some of the open-source efforts to store data in columnar formats, in memory or on-disk.

The third dimension is how much data and computation is needed to process the query. To process small amounts of data, except for the data access part, the majority of the computation for an OLTP query is run on a single node, often by a single thread. On the other hand, to process large amounts of data for OLAP type analytical queries, MPP style parallel processing and vector-based computing engine is often needed to exploit the maximum parallelism.

### The Aftermath

Over the last 30 years, the varying data models, latency requirements, and scalability demands drove the database systems landscape into one of the most diverse and exciting computer fields. Traditional database companies such as Oracle and Microsoft continue to enjoy success while newcomers such as Snowflake and MongoDB have grown to be worth tens of billion dollars.

Unfortunately, due to these developments, typical enterprise data infrastructures became extremely complicated. Data nowadays is spread in multiple silo-ed systems. Such an infrastructure not only makes it expensive to store duplicated copies of the same data, but also makes development very complicated.

The obvious problem with so many data stores is the cost issues. Data is stored in multiple places, often duplicated many times unnecessarily thus incurring extra data storage and transformation cost. Databases require administrative staff, and few people have the knowledge and expertise to troubleshoot more than a couple database systems. Procuring a lot of software and dealing with many different vendors is also an expensive endeavor.

A not-so-obvious problem caused by using many database systems is the loss of agility and consistency.

systems is the From a systems administrator’s perspective,
On the other hand, the developers also have a nightmare understanding all the intricacies of the consistent models and APIs of different systems. We call this “non-smooth”
The complexity of the system is manifested on two fronts. First, these systems require different skillsets to maintain and operate. It is very difficult and expensive to find enough qualified system administrators to provide sufficient support for round-the-clock reliable operations.
