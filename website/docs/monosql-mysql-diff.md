---
title: Difference between MonoSQL and MySQL
---

## Select

Select statements have two consistency levels: **Eventually-consistent-reads** and **Strongly-consistent-reads**. The default is Eventually-consistent-reads, which can be switched to Strongly-consistent-reads by `SET monosql_strongly_consistency=on`. See [Read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)

#### Scan

When scanning, you need to specify the first column (a.k.a dynamodb partition key) of the index with an equivalent condition, otherwise it will cause an expensive full table scan. Full table scan is disabled in the default configuration. It can be enabled by `SET monosql_full_tbl_scan=on`, and the scan result is disordered.

## Insert

#### Semantic

The Insert statement has two semantics: **Insert** and **Upsert**. The default semantic is Upsert, which can be switched to Insert by `SET monosql_upsert_semantic=off`. The difference between the two is that when the primary key already exists, Upsert will overwrite the write and Insert will fail, and the performance of Upsert is slightly better than that of Insert.

#### Bulk insert

When inserting multiple rows of data in an Insert statement, the effect is equivalent to row-by-row **Upsert**, which is not atomic. Use [BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) for better performance. You can BEGIN a transaction to trade performance for atomicity.

## Update

There are two execution processes of the Update statement: **Read-modify-write** and **Direct-update**.

#### Read-modify-write

First read the row of data from DynamoDB through [GetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html), complete the modification locally, and finally write to DynamoDB through [PutItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html). When a write-write conflict occurs, it is handled in the same way as a transaction. Updates involving primary key changes are special and require an additional [DeleteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) to delete rows with the old primary key, it may happen that PutItem is completed but DeleteItem fails in rare case, while you can BEGIN a transaction to avoid it completely.

#### Direct-update

Updating DynamoDB through [UpdateItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html) involves only one request so it has atomicity and better performance.
Triggering **Direct-update** needs to meet the following conditions at the same time:

1. Update do not belong to transaction
2. The Where clause specifies a single row of data through a complete primary key
3. Does not involve primary key changes
4. The update operation is the assignment of a column to const, or the addition and subtraction between a numeric type and const. For example `UPDATE t SET count=count+1 WHERE pk=1 AND sk=1;`

## Transaction

MonoSQL's transaction is based on [DynamoDB Transaction](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html), the operations between BEGIN and COMMIT is a transaction with ACID characteristics. In AutoCommit mode, only the statement that operates a single row of data is a transaction, for performance reasons, a single statement that manipulates multiple rows of data is not atomicity by default, but you can BEGIN a transaction to sacrifice performance in exchange for atomicity.  
Currently supports two isolation levels: **Read-committed** and **Repeatable-read**.

#### Read-committed

In a single transaction, the total number of Upsert/Insert/Update/Delete rows cannot exceed 100. If there is a write-write conflict between two transactions T1 and T2, and T1 commits before T2, T2 will overwrite the modification of T1.

#### Repeatable-read

In a single transaction, the total number of Read/Upsert/Insert/Update/Delete rows cannot exceed 100. All the versions of read tuples will be tracked and validated when committing. If there is a read-write conflict or a write-write conflict between two transactions T1 and T2, and T1 commits before T2, T2 will rollback.

## Secondary index

MonoSQL's secondary index corresponds to DynamoDB's [Global Secondary Index](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html). The base table and the secondary index are synchronized with eventual consistency, so creating secondary indexes will not affect the performance of updating the base table. Currently, the secondary index key contains at most 2 columns, and cannot contain packed columns.
Note that 1. the value of a column with a secondary index cannot be empty string or empty binary, but can be NULL. 2. the length of secondary index name should be in range of 3 to 255.

## Alter table

Alter table can be completed in a very short time. After adding column, the default value of the newly added column is NULL. After drop column, the dropped column will be invisible immediately, but will not be cleared immediately. It will be cleared lazily by the subsequent PutItem request.

## Human-readable DynamoDB

In general, the data written to DynamoDB is Human-readable, that is, the data displayed by MySQL is basically the same as that displayed by DynamoDB. Exceptions: 1. the primary key has N columns (N>=3), the 2nd to N columns will be packed into binary form and stored in DynamoDB. 2. data type like `timestamp`, `year`, `time` are stored in number format, which is human-readable in MySQL but not in DynamoDB. It is recommended to use `datetime` to represent time type in MonoSQL.
