---
title: 与 MySQL 兼容性比较
summary: 本文对 MonographDB 和 MySQL 二者之间从语法和功能特性上做出详细的对比。
---

# 与 MySQL 兼容性对比

MonographDB 高度兼容 MySQL 8.0 协议、MySQL 8.0 常用的功能及语法。MySQL 8.0 生态中的系统工具（PHPMyAdmin、Navicat、MySQL Workbench、mysqldump、Mydumper/Myloader）、客户端等均适用于 MonographDB。

但 MonographDB 尚未支持一些 MySQL 功能，可能的原因如下：

- 有更优秀的替代方案
- 目前并不急需这些功能，例如存储过程和函数。
- 一些功能在分布式系统中的实现存在较大的挑战。

## 不支持的功能

- 触发器
- 不支持在非`test`的数据库中创建索引
- 事件
- 全文语法与索引
- 空间类型的函数（例如 `GIS`/`GEOMETRY`）、数据类型和索引
- 特殊的字符集：非 `ascii`、`latin1`、`binary`、`utf8`、`utf8mb4`、`gbk` 的字符集
- SYS schema
- MySQL 追踪优化器
- XML 函数
- X-Protocol
- 列级权限
- `XA` 语法（TiDB 内部使用两阶段提交，但并没有通过 SQL 接口公开）
- `CREATE TABLE tblName AS SELECT stmt` 语法
- `CHECKSUM TABLE` 语法
- `REPAIR TABLE` 语法
- `OPTIMIZE TABLE` 语法
- `HANDLER` 语句
- `CREATE TABLESPACE` 语句
- `ALTER TABLE`语法
- `ALTER ROLE`语法
