---
title: EloqKV 高可用性
---

# EloqKV 高可用性

## 本地存储

EloqKV 在使用 RocksDB 等本地存储时,通过热备用节点实现高可用性。主节点的任何新变更都会持续同步到备用节点。当主节点发生故障时,热备用节点可以自动被选举为新的主节点。接下来我们将深入了解备用节点的工作原理和故障转移的过程。

备用节点如何加入复制组:

1. 热备用节点启动并向主节点发送 `Join` 消息。
2. 主节点开始在本地命令缓存中跟踪所有新的变更。
3. 主节点执行检查点并确保所有旧数据都已刷新到 RocksDB。
4. 主节点为 RocksDB 创建快照并发送给备用节点。
5. 一旦备用节点完成远程 RocksDB 快照的加载,主节点就开始通过单独的同步工作线程持续发送命令缓存中的新命令给备用节点。
6. 备用节点接收并执行来自主节点的命令。如果命令序号不连续,备用节点将从主节点获取缺失的命令。如果缺失的命令在主节点的命令缓存中也已被清除,备用节点需要重新加入复制组。

当主节点发生故障时,将触发故障转移,其中一个备用节点将被选举为新的主节点来处理写请求。EloqKV 使用 Raft 共识组来实现自动故障转移。在 EloqKV 中,Raft 组中有三种角色:领导者、跟随者和投票者。领导者是

以下是部署 3 分片集群时的集群拓扑,每个主节点有一个备用节点。不同的颜色表示不同的复制组。每个复制组包含一个主节点、一个备用节点和一个投票者。由于投票者只参与共识选举过程且消耗资源很少,我们将投票者和主节点部署在同一台机器上,但对于特定的复制组,投票者、主节点和备用节点将分别部署以确保 EloqKV 可以容忍节点故障。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./media/redis_standby_voter.png').default} alt="EloqKV 架构" />

</div></p>

## 共享存储

EloqKV 是一个基于 Data Substrate 构建的解耦、分布式数据库,Data Substrate 是 EloqData 为云时代开发的创新数据库基础。

每个 EloqKV 实例包括一个与 Redis 协议兼容的前端,与核心 TxService 一起部署以处理数据操作。逻辑上独立的 LogService 处理预写日志(WAL)以确保持久性,而持久化存储服务管理内存状态检查点和冷数据存储。

在 EloqKV 中,TxService 负责并发控制,确保事务操作的一致性。日志服务可以复制日志并将其分布在不同的可用区(AZ)中,以提供对 AZ 级故障的弹性。存储服务支持各种持久化存储引擎,包括本地选项如 RocksDB、远程集群如 Cassandra,以及云存储解决方案如 AWS DynamoDB。这个持久化存储存储冷数据以应对缓存未命中,并在节点故障时提供高可用性。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./media/eloq_arch_new2.png').default} alt="EloqKV Architecture" />

</div></p>

<!--
<p align="center">
<div style={{ width: '600px', textAlign: 'center', display: 'block' }}>
![](./media/eloq_arch_new2.png)
</div>
</p> -->

## Beyond Caching, Embracing Transactions

Unlike many distributed KV stores, EloqKV is full ACID (Atomicity, Consistency, Isolation, Durability) capable. It supports distributed transactions. This unlocks unprecedented functionality, empowering you to:

- Ditch the Duo: Say goodbye to the cumbersome MySQL + Redis combo. EloqKV eliminates cache coherence issues entirely, simplifying your architecture and boosting efficiency.
- Transactional Confidence: Ensure data integrity across reads and writes, even in complex distributed environments.
- Unlock New Application Scenarios: Tackle use cases beyond traditional caching, venturing into the realm of transactional microservices and stateful data management.

## Cost-Conscious Performance Made Simple

EloqKV leverages Data Substrate's innovative architecture to deliver performance and cost-effectiveness in perfect harmony:

- Memory for Speed: Frequently accessed data are cached in-memory, guaranteeing lightning-fast reads and blazing-fast write performance through parallel logging.
- Cloud for Cold Data: As data cools, it gracefully migrates to cost-effective cloud key-value stores, freeing up precious DRAM resources.
- Asynchronous Checkpoints: Minimize IOPS requirements and optimize performance while keeping transactional reads readily available.
- Operational Efficiency: Slash operational costs with cloud storage and enjoy streamlined maintenance thanks to Data Substrate's modular design.

## Scale on Demand, Optimize on the Fly

EloqKV adapts to your dynamic needs, scaling seamlessly to match your workload:

- Memory Scaling: When hot data demands grow, memory capacity can be increased for better performance.
- Log Service Optimization: Handle surges in write traffic by scaling the log service.
- Cloud Storage Growth: As historical data accumulates, seamlessly expand the cloud storage layer to accommodate your evolving needs.
- On Demand Dynamic Scaling: achieve scaling without service interruptions (current in Beta).

## Read the Blogs

**EloqKV** is a reimagining of the modern Key-Value Store. To learn more about EloqKV and what it can do, you can read our blogs about its [unique features](/blog/2024/08/16/eloqkv) and [underlying technology](/blog/2024/08/11/data-substrate). You can also read benchmark results on its performance in [single-node](/blog/2024/08/17/benchmark-single-node) configurations and [clustering](/blog/2024/08/22/benchmark-cluster) configurations. You can also read about its unique capability to achieve [durability](/blog/2024/08/25/benchmark-txlog) and perform [distributed atomic operations](/blog/2024/09/01/benchmark-transaction). More technical content will be posted on the [blog](/blog) frequently, and we welcome your [feedback](/contact).
