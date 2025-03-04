---
title: EloqKV正式发布
authors: eloq
date: 2024-08-16
tags: [Product]
news: true
image: /img/blog/eloqkv_launch.jpg
description: EloqKV 是一款前沿的键值数据库，具备高性能、可扩展性，并完全符合 ACID 特性。了解它如何通过创新架构和高级功能革新数据管理。
newsFeatured: true
---

我们很高兴地介绍 **EloqKV**，这是一个*高性能的 Redis API 兼容、ACID 事务性、可扩展、分布式*键值数据库。你可能会想，"真的吗？又一个键值数据库？"在这篇文章中，我们将解释是什么让 **EloqKV** 与众不同，以及 **EloqKV** 提供的独特价值。

<!--truncate-->

**EloqKV** 是我们基于突破性数据基底技术构建的第一个产品，这是一个创新架构，旨在为云时代创建高性能、模块化、可扩展和事务性的数据库。我们在[之前的博客文章](/blog/2024/08/11/data-substrate)中介绍了数据基底。

像许多键值存储一样，**EloqKV** 提供卓越的性能，在*单个服务器*上可以处理[每秒数百万次操作](/blog/2024/08/17/benchmark-single-node)，延迟低于毫秒级。但凭借其革命性的架构，**EloqKV** 提供了独特的功能，使其区别于其他键值数据库。

## 在需要时提供完整的 ACID 事务

许多键值存储将所有数据保存在内存中以实现低延迟。然而，这种方法显著增加了成本，因为即使是不经常访问的（冷）数据也会占用宝贵的内存。此外，为了追求性能，持久性通常被牺牲，尽管在现代 SSD 上优化的[预写日志（WAL）](https://en.wikipedia.org/wiki/Write-ahead_logging)通常可以帮助将影响降低到可接受的水平。此外，由于分布式事务的高成本，大多数分布式键值存储要么放弃事务支持，要么只提供有限的部分事务。

**EloqKV** 采用了不同的方法，拥抱 [ACID](https://en.wikipedia.org/wiki/ACID)（原子性、一致性、隔离性、持久性）事务很重要但不应在不需要时增加额外成本的理念。**EloqKV** 让你可以通过配置标志启用 ACID。当 ACID 被禁用时，**EloqKV** 不会产生任何额外开销，提供与非事务性键值数据库相当的性能。目前处于 Beta 版本，在未来版本中，**EloqKV** 将允许在每个数据库的基础上打开和关闭 ACID 支持，进一步避免不必要的开销并简化管理。

即使完全符合 ACID，**EloqKV** 也包含了几项创新来最小化开销。例如，WAL 日志的延迟通常由同步写入稳定存储所主导。在 **EloqKV** 中，日志可以水平扩展和独立扩展，当添加更多存储设备时可以减少日志延迟。此外，在 **EloqKV** 中，单键读取事务不会产生额外开销。这使得 **EloqKV** 对许多常见工作负载来说都非常快。我们将在未来的博客文章或学术论文中深入探讨这些技术。

## 按需扩展，扩展所需资源

**EloqKV** 从一开始就设计为可扩展的。每种资源类型 —— 内存、CPU 核心、日志 SSD 和持久存储 —— 都可以独立扩展。这种级别的灵活性在云时代非常有价值，因为可以轻松地从云提供商那里配置资源。

如果你的工作负载对延迟敏感并且需要将所有数据存储在内存中，你可以预留具有大内存容量的虚拟机。需要处理必须持久化的大量更新？只需添加几个额外的 EBS 卷作为日志设备。如果你的数据量很大，你可以使用像 DynamoDB 或 S3 这样的云存储选项来经济高效地存储不经常访问的数据。

我们还在开发透明、动态扩展，这将允许你根据工作负载的变化动态添加和删除资源。这个功能很快将在公开预览版中提供，敬请关注。

## 你想要易用性？你就能得到易用性

**EloqKV** 兼容 [Redis API](/eloqkv/kvstore_compatibility)，支持 Redis 的大多数基本数据结构。这意味着大多数现有应用程序只需很少的努力就可以轻松利用 **EloqKV** 的高级功能。

但 **EloqKV** 的易用性不仅仅在于 API 兼容性。**EloqKV** 真正的用户友好性在于我们做出的基本架构设计选择。

**EloqKV** 可以部署为单节点键值存储，类似于 [Redis](https://redis.io/) 和 [Memcached](https://memcached.org/)。然而，**EloqKV** 本质上是作为分布式系统设计的。它可以轻松部署在集群中，立即受益于真正分布式系统的高可用性和可扩展性 —— 无需 [sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/) 或特殊的[集群模式](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/)。

得益于其内置的集群感知和 ACID 支持，**EloqKV** 集群的行为几乎与单节点服务器相同。当连接到集群中的一个节点时，Redis 兼容客户端可以访问和修改整个集群中的数据，可能会有额外的网络跳转（因为物理定律适用），即使客户端不是集群感知的，即使当集群正在从故障中恢复或更改配置以添加/删除容量。此外，_WATCH/MULTI/EXEC_ 命令（即 Redis 事务）和 *Lua 脚本*可以在集群中运行，就像在单节点数据库上一样，消除了 SLOTS 和"CROSSSLOT Keys"错误等问题。

## 性能和成本

性能和成本始终是评估数据库系统的关键因素。[众多](https://www.scylladb.com/compare/)[数据库](https://aerospike.com/resources/benchmarks/)[供应商](https://www.dragonflydb.io/blog/scaling-performance-redis-vs-dragonfly)发布文章或白皮书声称性能优势。可以说，我们在性能优化方面投入了大量思考。我们努力使 **EloqKV** 在*功能公平匹配*时实现*同类最佳性能*，我们很高兴地报告我们在很大程度上实现了这个目标。我们鼓励你阅读我们的后续博客，或[尝试](/eloqkv/install-from-binary) **EloqKV** 并用你自己的工作负载评估它。

需要注意的一个关键点是，**EloqKV** 的一些高级功能 —— 比如启用日志以实现持久性、在多个节点之间执行原子 `MULTI` 操作，以及使用 SSD 存储冷数据以减少内存使用 —— 可能比你预期的更具成本效益。同样，我们鼓励你用你的工作负载测试它。

## 发布 **EloqKV** 公开预览版

今天，我们发布 **EloqKV** 公开预览版。此版本支持两个持久存储：Apache Cassandra 和 RocksDB。Cassandra 是一个分离的存储，可以在与 **EloqKV** 服务器不同的节点集上运行以实现高可用性，而 RocksDB 是一个嵌入式存储。你可以按照我们的文档学习如何设置[单节点](/eloqkv/quick-start)测试服务器或[集群](/eloqkv/quick-start-ha)。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloq_arch_new2.png').default} alt="EloqKV Architecture" />

</div></p>

**EloqKV** 可以在各种配置中部署：

- **作为缓存**：当关闭日志和持久存储时，**EloqKV** 作为高性能内存缓存运行，性能与主流缓存解决方案相当，匹配最先进的内存缓存服务器。

- **作为内存数据库**：通过启用日志和持久存储，**EloqKV** 提供持久性，同时保持与缓存相同的快速读取性能。它将写入刷新到日志并应用到内存中的数据。它还在稳定存储中维护快照，确保在故障或重启后完整、一致的数据恢复。

- **作为大于内存的数据库**：当分配的内存不足以存储所有数据时，**EloqKV** 将数据驱逐到稳定存储并根据需要检索。在这种模式下，**EloqKV** 作为许多 NoSQL 数据库的强大替代方案。

- **作为完整的事务性分布式数据库**：在云中部署时，**EloqKV** 可以配置为完全可扩展、高可用性和 ACID 兼容的数据库，可以用作主存储来托管主要数据。这传统上是昂贵的 RMDBS 所占据的位置。

我们预见到由于 **EloqKV** 的独特功能和能力，它在许多场景中都能发挥价值，我们很想听听你的使用案例和 **EloqKV** 可能解决的痛点。我们正在努力改进产品并添加更多功能。如果你有任何问题或建议，或想要进行面对面演示，请[联系我们](/contact)。

在接下来的几篇博客文章中，我们将分享 **EloqKV** 在不同场景下的一些性能基准测试。
