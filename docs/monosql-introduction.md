---
title: MonoSQL Introduction
summary: This document introduces the MonoSQL tool, providing an overview of its architecture and operating principles. 
aliases: ['cn/monosql/monosql-introdcution']
sidebar_position: 1
---

# MonoSQL Introduction
MonoSQL is a wrapper based on DynamoDB, designed and developed by Monographdata, that enables users to migrate from MySQL or MariaDB to DynamoDB. It is a virtual mirror product with statelessness, automatic scaling, and data security advantages. With MonoSQL, users can continue to use JDBC or ODBC protocols to store, retrieve, and update data in DynamoDB without changing their existing reference programs.

MonoSQL's overall architecture can be divided into multiple modules that communicate with each other to form an integrated service, operations, and monitoring system, as shown in the following architecture diagram:
![architecture](./media/dynosql/arch.jpg)

## Features
MonoSQL server is stateless, all directories and data are stored in DynamoDB. The SQL query will be parsed, optimized, and executed by the MonoSQL server, and the MonoSQL server will request the actual data from DynamoDB by using GetItem, PutItem, etc. requests. MonoMonitor realizes the monitoring of the entire Auto Scaling group, and AWS Cloud Watch realizes the storage of logs of the entire Auto Scaling group.

## Key features
- **User and permission management**
Manage users in MonoSQL using the `CREATE USER` command and permissions using the `GRANT` command, both of which are compatible with MySQL.
- **Data Definition Language (DDL)**  Manage table structures using the `CREATE TABLE` and `DROP TABLE` commands.
- **Data Manipulation Language (DML)** Support `SELECT`, `INSERT`, `UPDATE`, and `DELETE` commands.
- **Connection operators**
- **aggregation operators**
- **Common Table Expression (CTE) and recursive CTE operators**

## Application cases
Compared to MySQL and MariaDB, DynamoDB has the following advantages:
- **High scalability**
DynamoDB is a highly scalable NoSQL database that can easily scale to billions of rows of data and high-concurrency access. MySQL or MariaDB, on the other hand, requires complex cluster architecture and tuning to achieve similar scale and performance.

- **Serverless architecture**
DynamoDB is a serverless database provided by AWS that eliminates the tedious task of maintaining database servers, allowing developers to focus on application development and deployment.

- **High performance**
DynamoDB is a high-performance database that supports millisecond-level response times and millions of concurrent accesses. This makes it ideal for handling real-time applications and high-concurrency workloads, while MySQL or MariaDB requires complex optimization and tuning to achieve similar performance.

- **Elastic scalability**
DynamoDB supports elastic scaling, automatically adjusting the number and configuration of database instances based on actual workloads. This makes it ideal for handling unstable workloads and peak access, while MySQL or MariaDB requires manual adjustment and management.

- **Availability and durability**
DynamoDB has high availability and durability, ensuring that data is not lost or damaged. This makes it ideal for handling important data and applications, while MySQL or MariaDB requires complex backup and recovery operations to achieve similar results.

The biggest challenge and pain point in migrating from MySQL or MariaDB to DynamoDB is that they have different APIs and query languages, requiring corresponding modifications to application programs and code to access DynamoDB correctly. MonoSQL can help users directly use their existing programs to complete the above data access operations, greatly reducing the transformation costs for enterprises or individuals.

## Usage Limitations
MonoSQL does not support the following MySQL features:
- `Explicit Transaction`is not supported. (Coming soon)
- `Trigger`is not not supported.
- `Full table scan` is not recommended.
