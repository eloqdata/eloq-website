---
title: EloqData重磅开源
authors: eloq
date: 2025-03-05
tags: [Product, Open Source]
image: /img/blog/opensource.jpg
description: EloqData 宣布开源发布 EloqKV、EloqSQL 和 EloqDoc，向社区开放我们的高性能分布式数据库解决方案。
---

我们非常激动地宣布，**EloqData** 正式开源我们的核心产品：**EloqKV**、**EloqSQL** 和 **EloqDoc**，以及支撑这些产品的革命性技术——数据基层。这标志着我们在构建更加开放和协作的数据库生态系统的道路上迈出了重要的一步。

<!--truncate-->

## 我们的开源之旅

我们的开源之旅

开源已成为数据库和云基础设施的基石，推动着行业的创新与协作。通过提供透明且可访问的代码，开源项目（如 PostgreSQL、MySQL、Hadoop 大数据生态、Spark 生态系统等）彻底改变了数据库的开发、维护、管理和部署方式。这些开源项目不仅降低了成本，还促进了以社区驱动的方式解决问题，推动了技术的快速发展和广泛采用。更重要的是，它们激励了无数学生、研究人员、开发者和创业者，共同推进数据管理技术的前沿发展。

EloqData 受益于开源生态，我们通过研究开源项目学习技术，使用开源工具链开发产品，并利用开源项目来增强和补充我们的商业产品功能。

Data Substrate 架构专为与开源项目协同工作而设计。Data Substrate 是一个模块化、可插拔的架构，能够利用现有的开源项目提供更好的数据库解决方案，而无需重复造轮子。我们站在巨人的肩膀上，通过利用现有代码库，我们可以显著降低开发成本，并消除 API 兼容性问题。

今天，我们迈出了重要的一步，向开源社区开放我们的数据库解决方案。我们很高兴宣布，我们正在开源 Data Substrate 的部分核心组件，以更好地拥抱和受益于社区。此外，我们还发布了 EloqKV、EloqSQL 和 EloqDoc 的代码——这三个主要产品分别实现了 Redis API、MySQL API 和 MongoDB API，并构建在 Data Substrate 技术之上。我们的代码库还包含对其他开源项目的修改，使其能够与 Data Substrate 兼容。我们相信，创新源于协作，我们期待与全球开发者共同构建更优秀的数据库解决方案。

## 开源内容

### EloqKV

一款高性能的分布式事务型数据库，兼容 Redis API，提供以下特性：

- 兼容 Redis API
- 完全支持 ACID 事务
- 垂直 & 水平扩展能力
- 跨节点 Lua 脚本支持
- 自动内存与存储分层管理

### EloqSQL

一款兼容 MySQL 的分布式 SQL 数据库，提供：

- 分布式 SQL 处理
- 兼容 MySQL/MariaDB 协议
- 强一致性保证
- 支持多写节点的水平扩展

### EloqDoc

一款兼容 MongoDB 的文档存储数据库，提供：

- 面向文档的存储
- 兼容 MongoDB 查询语言
- 计算与存储分离架构
- 灵活的模式设计

## 快速上手

我们的所有产品现已在 GitHub 上开源，您可以在以下地址找到我们的代码库：

- EloqKV: [https://github.com/eloqdata/eloqkv](https://github.com/eloqdata/eloqkv)
- EloqSQL: [https://github.com/eloqdata/eloqsql](https://github.com/eloqdata/eloqsql)
- EloqDoc: [https://github.com/eloqdata/eloqdoc](https://github.com/eloqdata/eloqdoc)

## 加入我们的社区

我们邀请开发者、贡献者和数据库爱好者来：

- Star 我们的代码库
- 试用我们的产品
- 提交问题反馈
- 贡献代码
- 参与讨论

## 未来计划

这只是一个开始，我们承诺：

- 构建一个充满活力的开源社区
- 接受社区的贡献
- 提供全面的文档
- 定期发布更新和新版本

我们相信，通过开源我们的产品，可以加速数据库领域的创新，帮助开发者构建更优秀的应用。

敬请关注我们的最新动态，并欢迎在 GitHub 上为我们的代码库点亮 Star！

## 相关资源

- [GitHub 代码库](https://github.com/eloqdata/eloqkv)
- [官方文档](https://www.eloqdata.com/eloqkv/introduction)
- [社区论坛](https://eloqdata.discourse.group/)
