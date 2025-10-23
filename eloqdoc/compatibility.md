---
title: EloqDoc Compatability
---

# Supported Features

## Index
- [✅] Single-field index
- [✅] Compound index
- [✅] Multikey index
- [✅] Full Text index
- [✅] Geospatial Index
- [✅] Sparse Index
- [⚠️] Unique Index
- [✅] Partial Index
- [✅] Covering Index
- [✅] TTL Index
- [❌] Hidden Index
- [❌] Hash Index
- [❌] Clustered Index
- [❌] Time-Series Index
- [❌] Wildcard Indexes

* Unique index is supported only when the collection is empty (create the index before inserting documents).

## CRUD
- [✅] Aggregate
- [✅] BulkWrite
- [✅] Count
- [✅] Delete
- [✅] Distinct
- [✅] Find
- [✅] FindAndModify
- [✅] GetMore
- [✅] Insert
- [✅] MapReduce
- [✅] Update 

## Aggregation Stage
- [✅] AddFields
- [✅] Bucket 
- [✅] BucketAuto
- [✅] CollStats
- [✅] Count 
- [✅] CurrentOp 
- [✅] Facet 
- [✅] GeoNear 
- [✅] GraphLookup
- [✅] group 
- [✅] IndexStats 
- [✅] Limit
- [✅] LimitLocalSessions
- [✅] LimitSessions
- [✅] Lookup
- [✅] Match
- [✅] Out
- [✅] Project
- [✅] Redact
- [✅] ReplaceRoot
- [✅] Sample
- [✅] Skip
- [✅] Sort
- [✅] SortByCount
- [✅] Unwind
- [✅] Sample 
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

## Transaction
- [✅] Distributed Transaction
- [✅] Multi-document transactions
- [✅] Multi-document transactions in cluster
- [✅] Single-document atomic writes
- [✅] Snapshot isolation
- [❌] Read Concern
- [❌] Retryable transactions
- [❌] Write Concern

## Security
- [✅] SCRAM Authentication
- [✅] x.509 Certificate Authentication
- [✅] Role-Based Access Control
- [✅] TLS/SSL
- [❌] Encryption at Rest
- [❌] LDAP Authentication
- [❌] Kerberos Authentication

## Backup & Restore
- [✅] Mongodump
- [✅] Mongosync
- [✅] Snapshot

## Others
- [✅] High Availability 
- [✅] Scale out
- [❌] Atlas Search
- [❌] Change Stream
- [❌] Time-Series
- [⚠️] Vector Search

* Vector Search in supported in EloqConvergedDB


# Compatibility with MongoDB 4.0 and MongoDB 8.0

This document provides a feature compatibility matrix comparing **EloqDoc** with **MongoDB 4.0** and **MongoDB 8.0**.

✅ = Supported  
❌ = Not Supported  
⚠️ = Partial Supported

---

## Feature Support Matrix

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


* Change Stream of EloqDoc use a separate CDC solution called `EloqCDC`.
* EloqDoc use single compute node and use cloud storage to achieve high availability. Kubernetes is used to auto failover the compute node.
* Unique index is supported only when the collection is empty (create the index before inserting documents).
