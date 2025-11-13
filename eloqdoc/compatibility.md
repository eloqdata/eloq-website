---
title: EloqDoc Compatibility
---

## Table of Contents
- [Supported Features](#supported-features)
- [Compatibility with MongoDB 4.0 and MongoDB 8.0](#compatibility-with-mongodb-4-0-and-mongodb-8-0)

## Supported Features

### Indexes
- [✅] Compound Index
- [✅] Covering Index
- [✅] Full-Text Index
- [✅] Geospatial Index
- [✅] Multikey Index
- [✅] Partial Index
- [✅] Single-Field Index
- [✅] Sparse Index
- [✅] TTL Index
- [⚠️] Unique Index
- [❌] Clustered Index
- [❌] Hash Index
- [❌] Hidden Index
- [❌] Time-Series Index
- [❌] Wildcard Indexes

* A unique index is supported only when the collection is empty. Create the index before inserting documents.

### CRUD
- [✅] Aggregate
- [✅] BulkWrite
- [✅] Count
- [✅] Delete
- [✅] Distinct
- [✅] Find
- [✅] FindAndModify
- [✅] GetMore
- [✅] Insert
- [❌] MapReduce
- [✅] Update

### Aggregation Stages
- [✅] AddFields
- [✅] Bucket
- [✅] BucketAuto
- [✅] CollStats
- [✅] Count
- [✅] CurrentOp
- [✅] Facet
- [✅] GeoNear
- [✅] GraphLookup
- [✅] Group
- [✅] IndexStats
- [✅] Limit
- [✅] LimitLocalSessions
- [✅] LimitSessions
- [✅] Lookup
- [✅] Match
- [✅] Project
- [✅] Redact
- [✅] ReplaceRoot
- [✅] Sample
- [✅] Skip
- [✅] Sort
- [✅] SortByCount
- [✅] Unwind
- [❌] Out
- [❌] Densify
- [❌] Documents
- [❌] Fill
- [❌] ListClusterCatalog
- [❌] ListSampleQueries
- [❌] ListSearchIndexes
- [❌] Merge
- [❌] PlanCacheStats
- [❌] QuerySettings
- [❌] QueryStats
- [❌] RankFusion
- [❌] ReplaceWith
- [❌] Score
- [❌] ScoreFusion
- [❌] Search
- [❌] SearchMeta
- [❌] Set
- [❌] SetWindowFields
- [❌] UnionWith
- [❌] Unset
- [❌] Vector Search

### Transactions
- [✅] Distributed Transaction
- [✅] Multi-document transactions
- [✅] Multi-document transactions in a cluster
- [✅] Single-document atomic writes
- [✅] Snapshot isolation
- [❌] Read Concern
- [❌] Retryable transactions
- [❌] Write Concern

### Security
- [✅] SCRAM Authentication
- [✅] x.509 Certificate Authentication
- [✅] Role-Based Access Control
- [✅] TLS/SSL
- [❌] Encryption at Rest
- [❌] LDAP Authentication
- [❌] Kerberos Authentication

### Backup & Restore
- [✅] Mongodump
- [✅] Mongosync
- [✅] Snapshot

### Other Features
- [✅] High Availability 
- [✅] Scale-Out
- [❌] Atlas Search
- [❌] Change Streams
- [❌] Time-Series Collections
- [⚠️] Vector Search

* Vector Search is supported in EloqConvergedDB.


## Compatibility with MongoDB 4.0 and MongoDB 8.0

This document provides a feature compatibility matrix comparing **EloqDoc** with **MongoDB 4.0** and **MongoDB 8.0**.

✅ = Supported  
❌ = Not Supported  
⚠️ = Partially Supported

Note: The table below lists only the differences between EloqDoc and MongoDB 4.0/8.0. For features commonly supported across products, refer to the [Supported Features](#supported-features) section above.

---

### Feature Support Matrix
| Feature                                  | EloqDoc | MongoDB 4.0 | MongoDB 8.0 |
| ---------------------------------------- | :-----: | :---------: | :---------: |
| Cluster-Wide Secondary Indexes           |    ✅    |      ❌      |      ✅      |
| Distributed Transaction                  |    ✅    |      ❌      |      ✅      |
| Large Transaction Size                   |    ✅    |      ❌      |      ✅      |
| Capped Collections                       |    ❌    |      ✅      |      ✅      |
| Command `dbhash`                         |    ❌    |      ✅      |      ✅      |
| Command `dbStats`                        |    ❌    |      ✅      |      ✅      |
| Command `repair`                         |    ❌    |      ✅      |      ✅      |
| Hash Index                               |    ❌    |      ✅      |      ✅      |
| Rename Collection                        |    ❌    |      ✅      |      ✅      |
| Storage Engine Profiling                 |    ❌    |      ✅      |      ✅      |
| Aggregation Operator: Merge/Union/Search |    ❌    |      ❌      |      ✅      |
| Atlas Search                             |    ❌    |      ❌      |      ✅      |
| Client-Side Field Level Encryption       |    ❌    |      ❌      |      ✅      |
| Columnstore Indexes                      |    ❌    |      ❌      |      ✅      |
| Queryable Encryption                     |    ❌    |      ❌      |      ✅      |
| Resumable Initial Sync                   |    ❌    |      ❌      |      ✅      |
| Schema Validation ($jsonschema)          |    ❌    |      ❌      |      ✅      |
| Time-Series Collections                  |    ❌    |      ❌      |      ✅      |
| Vector Search                            |    ❌    |      ❌      |      ✅      |
| Wildcard Indexes                         |    ❌    |      ❌      |      ✅      |
| Window Function                          |    ❌    |      ❌      |      ✅      |
| Change Streams                           |    ⚠️    |      ✅      |      ✅      |
| Replica Set Support                      |    ⚠️    |      ✅      |      ✅      |
| Unique Index                             |    ⚠️    |      ✅      |      ✅      |


* Change Streams in EloqDoc use a separate CDC solution called `EloqCDC`.
* EloqDoc uses a single compute node and cloud storage to achieve high availability. Kubernetes is used to automatically fail over the compute node.
* A unique index is supported only when the collection is empty. Create the index before inserting documents.
