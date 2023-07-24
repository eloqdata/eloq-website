---
title: Migration Overview
---

# Migrate Your Database to MonoSQL

## Design Migration Plan

### Downtime metric

Determine the downtime based on use cases:

1. Considering a business that is active during daytime and is able to be taken offline during a predetermined timeframe without disrupting the user experience. For example the upgradation in Game industry. In this senario, migration can occur in a downtime window. To be specific, take your application offline, load a snapshot of the data into MonoSQL, and perform a cutover to CockroachDB once the data is migrated.
2. Considering a businees that is crucia and cannot tolerate a long downtime window. For example, bank trans In this case, you will aim for zero or near-zero downtime.


### Cutover stategy
Cutover is to switch business traffic from source database to target database MonoSQL.

## Prepare the Migration

### Data Modeling
MonoSQL is built on top of Amazon DynamoDB, which is a NoSQL database with different data modeling best practice compared to SQL database.

For DynamoDB data modeling best practice, please refer to [Data modeling foundations]https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/data-modeling-foundations.html() for details. Here is a brief summary of the two table desgin type of DynamoDB: single table and multiple table.

Single table design is a pattern that allows you to store multiple types (entities) of data in a single DynamoDB table. It aims to optimize data access patterns, improve performance, and reduce costs by eliminating the need for maintaining multiple tables and complex relationships between them. This is possible because DynamoDB stores items with the same partition key (known as an item collection) on the same partition(s) as each other. In this design, different types of data are stored as items in the same table, and each item is identified by a unique sort key.

Multiple table design is a pattern that is more like a traditional database design where you store a single type(entity) of data in a each DynamoDB table. Data within each table will still be organized by partition key so performance within a single entity type will be optimized for scalability and performance, but queries across multiple tables must be done independently.

The advantages of multiple table design is to retrieve multiple heterogenous items using a single request, which brings the value of cheaper price and faster performance. The advantage of single table design is to avoid application side query result paring, export to other store easily etc.

MonoSQL supports both single table design and multiple table design. It's a tradeoff to choose between multiple table design and single table design. Given the context that migrating MySQL to MonoSQL, it's recommnaded to use multiple table design and keep the MySQL data schema.

### Test migration at small workload
To minimize the potential migration risk and cost, it is recommended to test migration at small workload.

1. Generate small sample workload in source database.
2. Create table in MonoSQL using converted schema.
3. Migrate the small workload from source database to MonoSQL.
4. Run the test workload to ensure the behavior is expected.
5. Compare the performance to ensure there is no performance regression.

## Execute the Migration


