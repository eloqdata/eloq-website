---
title: EloqKV 简介
---

# EloqKV：分布式事务性键值存储

## 架构

EloqKV 是一个基于 Data Substrate 构建的解耦、分布式数据库，Data Substrate 是 EloqData 为云时代开发的创新数据库基础。

每个 EloqKV 实例包括一个与 Redis 协议兼容的前端，与核心 TxService 一起部署以处理数据操作。逻辑上独立的 LogService 处理预写日志(WAL)以确保持久性，而持久化存储服务管理内存状态检查点和冷数据存储。

在 EloqKV 中，TxService 负责并发控制，确保事务操作的一致性。日志服务可以复制日志并将其分布在不同的可用区(AZ)中，以提供对 AZ 级故障的弹性。存储服务支持各种持久化存储引擎，包括本地选项如 RocksDB、远程集群如 Cassandra，以及云存储解决方案如 AWS DynamoDB。这个持久化存储存储冷数据以应对缓存未命中，并在节点故障时提供高可用性。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./media/eloq_arch_new2.png').default} alt="EloqKV 架构" />

</div></p>

## 超越缓存，拥抱事务

与许多分布式键值存储不同，EloqKV 完全支持 ACID(原子性、一致性、隔离性、持久性)特性。它支持分布式事务。这解锁了前所未有的功能，使你能够：

- 摒弃双系统：告别繁琐的 MySQL + Redis 组合。EloqKV 完全消除了缓存一致性问题，简化你的架构并提升效率。
- 事务可靠性：即使在复杂的分布式环境中，也能确保读写操作的数据完整性。
- 开启新的应用场景：超越传统缓存的使用场景，进入事务性微服务和有状态数据管理的领域。

## 兼顾成本的简单性能

EloqKV 利用 Data Substrate 的创新架构，完美平衡性能和成本效益：

- 内存速度：频繁访问的数据缓存在内存中，通过并行日志记录保证极快的读写性能。
- 冷数据云存储：随着数据冷却，优雅地迁移到成本效益高的云键值存储，释放宝贵的内存资源。
- 异步检查点：最小化 IOPS 需求并优化性能，同时保持事务读取随时可用。
- 运维效率：通过云存储降低运营成本，得益于 Data Substrate 的模块化设计享受简化的维护。

## 按需扩展，实时优化

EloqKV 能够适应你的动态需求，无缝扩展以匹配工作负载：

- 内存扩展：当热数据需求增长时，可以增加内存容量以提升性能。
- 日志服务优化：通过扩展日志服务处理写入流量的突增。
- 云存储增长：随着历史数据积累，无缝扩展云存储层以适应不断发展的需求。
- 按需动态扩展：实现无服务中断的扩展(目前处于 Beta 阶段)。

## 阅读博客

**EloqKV** 重新构想了现代键值存储。要了解更多关于 EloqKV 及其功能，你可以阅读我们关于其[独特特性](/news/2024/08/16/eloqkv)和[底层技术](/blog/2024/08/11/data-substrate)的博客。你还可以阅读其在[单节点](/blog/2024/08/17/benchmark-single-node)配置和[集群](/blog/2024/08/22/benchmark-cluster)配置下的性能基准测试结果。你也可以了解其实现[持久性](/blog/2024/08/25/benchmark-txlog)和执行[分布式原子操作](/blog/2024/09/01/benchmark-transaction)的独特能力。更多技术内容将定期发布在[博客](/blog)上，我们欢迎你的[反馈](/contact)。
