---
title: 'EloqKV 中的 ACID：原子操作'
authors: eloq
date: 2024-09-01
tags: [Company]
image: /img/blog/atomic.jpg
blog: true
description: In this blog, we evaluate EloqKV as an in-memory cache, focusing on its single-node performance.
---

在上一篇博客中，我们讨论了 **EloqKV** 的[持久性特性](/blog/2024/08/25/benchmark-txlog)，并对启用预写日志（Write-Ahead-Log）时 **EloqKV** 的写入性能进行了基准测试。在这篇博客中，我们将继续探索 **EloqKV** 的事务功能，并使用 Redis 的 `MULTI EXEC` 命令对分布式原子操作的性能进行基准测试。

<!--truncate-->

在本博客中，我们评估了*小规模*集群，以展示 **EloqKV** 在多服务器间的行为。更大规模集群中不同服务器数量的可扩展性将在后续博客中评估。所有基准测试都在 AWS（区域：us-east-1）EC2 实例上进行，运行 Ubuntu 22.04。在所有测试中，我们使用 **EloqKV** 0.7.4 版本。

### EloqKV 中的事务

十五年前，著名的数据库研究者和图灵奖获得者 [Mike Stonebraker](https://en.wikipedia.org/wiki/Michael_Stonebraker) 在 _Communications of the ACM_ 上发表了一篇[文章](https://cacm.acm.org/blogcacm/stonebraker-on-nosql-and-enterprises/)，宣称"对企业用户来说，没有 ACID 就没有价值"。不幸的是，由于分布式事务的高成本，许多分布式数据库为了获得更好的性能而放弃了完整的事务支持。例如，虽然 Redis 在单节点模式下支持有限的事务操作，但在集群中不支持跨服务器的事务。

得益于我们革命性的[数据基底](/blog/2024/08/11/data-substrate)架构，**EloqKV** 是一个完全符合 ACID 的数据库。除了提供在前一篇[博客文章](/blog/2024/08/25/benchmark-txlog)中讨论的持久性外，**EloqKV** 的事务功能即使在集群中也支持 Redis 的 _WATCH、MULTI、DISCARD_ 和 _EXEC_ 命令。

在这篇博客中，我们重点关注 _MULTI_ 和 _EXEC_ 命令在 _PUT/GET_ 操作中的基准测试 —— 具体来说，就是在集群中原子地执行一系列读写操作。我们认为这个工作负载能够很好地展示分布式事务的成本。虽然 **EloqKV** 也支持 _WATCH、DISCARD_ 和 _Lua 脚本_，但为这些功能创建标准的代表性测试用例更具挑战性。

在 **EloqKV** 中，ACID 中的 ACI（原子性、一致性、隔离性）部分始终启用。在集群中启用 _MULTI_ 和相关命令不需要配置更改。单个键操作作为单个命令的事务执行，不会产生额外开销。**EloqKV** 支持不同的[隔离级别](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Isolation_levels>)，默认为[可重复读](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Repeatable_reads>)，这也是本博客中讨论的实验所使用的隔离级别。

在可重复读隔离级别下，读取和写入的复杂度大致相同。对于读取请求，必须在事务提交阶段读取并验证每个键，以确保在读取和提交之间没有发生修改。对于写入请求，必须为每个键获取写锁，并在提交阶段释放。两者都需要额外的往返来完成，因此比非事务操作更昂贵。

### 实验

在第一个实验中，我们比较了不同工作负载下 **EloqKV** 和 Redis 在批处理模式下的表现。我们关注两种批处理模式：

1. **Pipeline**：在这种模式下，客户端发送多个命令到服务器，而不需要等待前面命令的响应。服务器按顺序处理这些命令，并一次性返回所有响应。这种批处理方法显著减少了网络通信开销，特别是在执行大量命令时。请注意，管道中的每个命令都是独立执行的，中间可能会执行其他命令。但是，我们确保任何给定键的命令都按照它们在管道中出现的顺序执行。

2. **MULTI / EXEC**：这种模式确保一组命令作为单个原子操作执行，这意味着要么所有命令都执行，要么都不执行。请[注意](/eloqkv/known-limit)，没有 `WATCH` 的 Redis `MULTI/EXEC` 命令通常不会失败，因为 Redis 在单个服务器上的单个线程中执行这些命令，而 **EloqKV** 可能会因为并发事务冲突而回滚并失败事务。

如果单个批次中的键不在同一个分片上，Redis 在集群模式下不支持 `Multi Exec`。为了解决这个问题，用户必须使用 `hashtags` 来确保某些键位于同一个分片上。这可能会很麻烦，而且经常会导致负载不平衡。对于 Redis 来说，`Pipeline` 支持取决于客户端。并非所有 Redis 客户端都支持这个功能。另一方面，**EloqKV** 没有这些限制。事务和管道在节点集群上的工作方式与在单个节点上相同。虽然 **EloqKV** 确实支持 `hashtags` 来共同定位键并可以减少网络开销。

在以下实验中，**EloqKV** 在纯内存模式下运行，禁用了持久存储和 WAL。

### 硬件和软件规格

**服务器配置：**

| 服务类型          | 节点类型     | 节点数量 |
| ----------------- | ------------ | -------- |
| EloqKV 0.7.4      | c7g.8xlarge  | 1        |
| EloqKV 0.7.4 集群 | c7g.8xlarge  | 3        |
| Redis 7.2.5       | c7g.8xlarge  | 1        |
| 客户端 eloq-bench | c6gn.8xlarge | 1        |

### 实验：

我们开发了一个新的基准测试工具 `eloq_benchmark`，专门用于测试 Redis 和 **EloqKV** 的事务性能，因为 `memtier_benchmark` 不支持 `Multi Exec`。你可以在[这里](https://download.eloqdata.com/eloqkv/tools/eloq_benchmark-0.7.4.zip)下载 `eloq_benchmark`。

我们使用以下配置运行 `eloq_benchmark`：

```
eloq_benchmark --h $server_ip --p $server_port --numKeys=$keynum --numConnections=$conn --getRatio=$ratio --opType=$optype --batchSize=$batchsize --numTestOps=$testops
```

- `--numKeys`：条目数量，设置为 1000000。

- `--numConnections`：并发连接数，单节点设置为 256，三节点集群设置为 768。

- `--numTestOps`：测试操作数，设置为 5000000。

- `--getRatio`：设置为 0 表示纯写工作负载，0.5 表示混合工作负载，1 表示纯读工作负载。

- `--opType`：设置批处理模式，设置为 `pipeline` 表示管道模式，设置为 `tx` 表示 `MutilExec` 原子模式。

- `--batchSize`：批次中对随机键进行 `Put/Get` 操作的数量，我们设置为 6。

#### 结果

以下是 Redis 和 **EloqKV** 在各种工作负载下批处理模式的性能结果。注意，批次中 `PUT/GET` 操作的数量固定为 **6**。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqkv_redis_batch_rr.png').default} alt="EloqKV vs Redis Transaction" />

</div></p>

`X轴`：表示基准测试中使用的不同工作负载类型（读/写/混合），模拟各种真实场景。

`Y轴`：批次的每秒操作数（OPS）。这个数字需要乘以 6（批次大小）才能得到总的 KV 操作数。

在单个节点上，**EloqKV** 在管道和 `Multi Exec` 模式下都显著优于 Redis。在固定批次大小为 6 个键的情况下，**EloqKV** 在单个服务器上两种模式下都能达到超过每秒 2 亿次 KV 操作（KPS）的吞吐量。由于原子操作需要额外的簿记工作，`Multi Exec` 比 `Pipeline` 慢。

三节点 **EloqKV** 集群的吞吐量比单节点 **EloqKV** 实例略低，这是由于重定向导致的额外网络往返和调度开销。尽管如此，集群仍然能够实现超过每秒一百万次操作（OPS）。重要的是，这不需要对应用程序代码进行任何更改，允许开发人员轻松扩展并克服内存容量限制，而无需修改代码或依赖智能客户端。

如预期的那样，使用智能客户端时，三节点 **EloqKV** 集群在各种工作负载下的吞吐量几乎是单节点实例的三倍。这突显了 **EloqKV** 与智能客户端的兼容性，使其能够实现近乎线性的可扩展性。

### 评估批次大小的影响

事务大小会影响分布式事务的效率。在这个实验中，我们测试了批次大小从 1 到 6 的 `eloq_benchmark`。

#### 结果

以下是 **EloqKV** `Multi Exec` 命令在不同批次大小和各种工作负载下的性能结果。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_cluster_batch_size.png').default} alt="EloqKV vs Redis Transaction" />

</div></p>

`X轴`：表示基准测试中使用的不同工作负载类型（读/写/混合），模拟各种真实场景。

`左Y轴`：每秒操作数（OPS）的吞吐量，以柱状图显示。

`右Y轴`：事务重试百分比，以虚线显示。

正如预期的那样，随着批次大小的增加，**EloqKV** 的事务吞吐量会下降。这是因为更大的批次大小会引入额外的工作。请注意，集群中执行的总 KV 操作数必须乘以批次大小。目前，**EloqKV** 不在事务内执行"查询优化"。为了保证事务语义，批次中的操作按顺序执行。未来，我们可能会通过允许批次内的某些操作并行执行来进行优化。

在我们的工作负载中，我们从一个范围内选择几个随机键来执行 `PUT/GET` 操作。如前所述，所有实验中的键范围都设置为 1,000,000。我们观察到，在混合和纯写工作负载中，事务重试随着批次大小的增加而增加。这是因为随着批次大小的增长，事务冲突的可能性更高。减少并发级别或扩大键范围可以帮助缓解这些冲突。此外，并发写入越多，发生冲突的可能性就越大。对于只读工作负载，不会出现事务冲突，因此没有事务重试。
