---
title: Migration Overview
---

# Migrate Your Database to MonoSQL

## Design Migration Plan

### Downtime metric

Determine the downtime based on use cases:

1. Considering a business that is active during daytime and is able to be taken offline during a predetermined timeframe without disrupting the user experience. For example the upgradation in Game industry. In this senario, migration can occur in a downtime window. To be specific, take your application offline, load a snapshot of the data into MonoSQL, and perform a cutover to MonoSQL once the data is migrated.
2. Considering a businees that is crucia and cannot tolerate a long downtime window. For example, bank transfer. In this senario, migration need zero or near-zero downtime. "Zero" means that downtime is reduced to either an absolute minimum or zero, such that users do not notice the migration. Consistent migrations reduce downtime to an absolute minimum i.e. sub-seconds, while keeping data synchronized between the source database and MonoSQL. Consistency requires downtime. In this approach, downtime occurs right before cutover, as you drain the remaining transactions from the source database to MonoSQL.


### Cutover stategy
Cutover is to switch business traffic from source database to target database MonoSQL. There are serveral Cutover staregies.

#### Immediate cutover

Immediate cutover mode switches from source database to MonoSQL in a single cutover. To be specific all the workloads will be changed to MonoSQL at once. The cutover point is selected when MonoSQL and source database are in nearly sync state, which means MonoSQL can catch up the source database in subsecond.

Optionally, you can add a fallback plan to the simple all-at-once cutover.

In addition to moving data to MonoSQL, data is also replicated from MonoSQL back to the source database in case you need to roll back the migration. Continuous replication is already possible when performing a zero-downtime migration that dual writes to both databases. Otherwise, you will need to ensure that data is replicated in the reverse direction at cutover.

#### Phased cutover
A phased cutover only migrates a portion of workloads or tables over time. The source database will continue to sync with MonoSQL using CDC until all the workloads or tables are migrated.

This approach enables you to take your time with the migration, and to pause or roll back as you monitor the migration for issues and performance. A phased rollout has reduced business risk and user impact.

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

There are serveral tools to help migrate data from other SQL databases to MonoSQL.
1. [AWS Data Migration Service](http://monographdata.com/docs/monosql-migration-awsdms)
2. [MonoSQL Migration Tool](http://monographdata.com/docs/monosql-migration-ddb-import)

If application can tolerate downtime, the Migration steps include:
1. Using MonoSQL migration tool to convert source database dumped csv files into json files.
2. Upload json files to S3.
3. Using DynamoDB's import tool to load json files from S3 into DynamoDB tables.
4. Run `CREATE TABLE` in MonoSQL to create the corresponding catalog for the target tables.

Note that this approach is cost effective compared with load data using MonoSQL interface. But there is a limitation that when the sortkey of DynamoDB corresponding to multiple columns in MonoSQL, these columns must be integer type. Choose AWS DMS if you encounter error when using MonoSQL migration tool.

If application expect a near-zero downtime, the Migration steps include:
1. Record the source database CDC start point, e.g. the binlog start point in MySQL using `show master status;`.
2. Migrate the existing data using MonoSQL migration tool or AWS DMS.
3. After existing data are migrated, replay the cached and ongoing changed data from the CDC start point. This can be done using AWS DMS.
4. Cutover the application when the replay lag between the source database and target database are small. 
