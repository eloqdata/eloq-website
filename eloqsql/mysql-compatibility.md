---
title: Compatibility with MySQL
summary: This article makes a detailed comparison between EloqSQL and MySQL in terms of syntax and functional characteristics.
---

#Comparison with MySQL compatibility

EloqSQL is highly compatible with the MySQL 8.0 protocol, common functions and syntax. The system tools in the MySQL 8.0 ecosystem and the clients(PHPMyAdmin, Navicat, MySQL Workbench, mysqldump, Mydumper/Myloader, etc), which are all applicable to EloqSQL.

But EloqSQL does not yet support some MySQL features, the possible reasons are as follows:

- There are better alternatives
- There is no urgent need for these features, such as stored procedures and functions.
- The implementation of some functions in a distributed system presents great challenges.

## Unsupported features

- Triggers
- Create indexes in databases named not `test`
- Events
- Full text syntax and indexes
- Spatial functions (e.g. `GIS`/`GEOMETRY`), data types, and indexes
- Special character sets: Character sets other than `ascii`, `latin1`, `binary`, `utf8`, `utf8mb4`, `gbk`
- SYS schema
- MySQL optimizer trace
- XML functions
- X-Protocol
- Column-level permissions
- `CREATE TABLE tblName AS SELECT stmt` syntax
- `CHECKSUM TABLE` syntax
- `REPAIR TABLE` syntax
- `OPTIMIZE TABLE` syntax
- `HANDLER` statement
- `CREATE TABLESPACE` statement
- `ALTER TABLE` syntax
- `ALTER ROLE` syntax
