---
title: 'EloqKV 中的 ACID：持久性'
authors: eloq
date: 2024-08-25
tags: [Benchmark]
image: /img/blog/durability.jpg
blog: true
description: An in-depth analysis of EloqKV's durability performance, comparing it with other key-value stores under various workloads.
---

在我们之前的博客中，我们对 **EloqKV** 在内存缓存模式下进行了基准测试，讨论了[单节点](/blog/2024/08/17/benchmark-single-node)和[集群](/blog/2024/08/22/benchmark-cluster)的性能。在这篇文章中，我们将对启用持久性的 **EloqKV** 进行基准测试。

<!--truncate-->

所有基准测试都在 AWS（区域：us-east-1）EC2 实例上进行，运行 Ubuntu 22.04。使用 [memtier-benchmark](https://github.com/RedisLabs/memtier_benchmark) 工具生成工作负载。在所有测试中，我们使用 **EloqKV** 0.7.4 版本。

### 理解持久性

持久性对于数据存储来说至关重要，特别是在服务器故障期间不能接受数据丢失的应用场景中。大多数持久化数据存储通过[预写日志（WAL）](https://en.wikipedia.org/wiki/Write-ahead_logging)来实现持久性，确保数据在响应用户之前写入磁盘。此外，许多存储系统会定期将数据检查点保存为更紧凑的形式，允许日志被截断。

然而，许多键值（KV）缓存优先考虑性能而不是持久性。例如，Redis 使用[追加文件（AOF）](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)来实现*某种程度*的持久性，通过定期或在每个写命令后将数据同步到日志文件来实现。Redis 的单线程架构会显著增加其他操作的延迟，如果写操作阻塞了线程，因此，在实践中很少部署每次写命令都进行 AOF 同步写入。因此，[DragonflyDB](https://www.dragonflydb.io/docs/managing-dragonfly/aof) 由于缺乏需求而完全放弃了 AOF，而只提供类似于 [Redis 的 RDB](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/) 的定期检查点功能。

**EloqKV** 是一个完全符合 ACID 的数据库，通过 WAL 提供完整的数据持久性。利用我们解耦的数据基底架构，**EloqKV** 服务器的 WAL 可以嵌入在同一进程中，也可以作为独立的日志服务运行。日志可以在多台机器或可用区之间复制，可以使用多个磁盘设备进行扩展，并可以使用分层存储将较旧的数据归档到更具成本效益的存储中。

然而，我们认识到并非所有应用程序都需要持久性。目前，**EloqKV** 的持久性可以通过配置打开和关闭。在未来的版本中，**EloqKV** 的持久性可以在每个数据库的基础上启用，这样持久和非持久的工作负载可以在单个 **EloqKV** 实例上共存。当禁用持久性时，**EloqKV** 避免了与持久性相关的开销，如[之前的博客文章](/blog/2024/08/17/benchmark-single-node)所示，可以提供不打折扣的性能。在这篇博客中，我们评估启用持久性的 **EloqKV**。

### 与 Kvrocks 比较

在第一个实验中，我们将 **EloqKV** 与 Apache [Kvrocks](https://kvrocks.apache.org/) 进行比较，后者是一个支持持久性的 Redis 兼容 NoSQL 数据库。我们评估了 **EloqKV** 和 Kvrocks 在写密集和混合工作负载下的性能。为了确保数据持久性，我们为两个数据库都启用了 fsync 预写日志（WAL）。对于 **EloqKV**，事务服务和日志服务都部署在同一个节点（c7gi.8xlarge）上。为了充分利用可用的磁盘 IO，我们在 **EloqKV** 中启动了两个日志服务进程来写入 WAL 日志。

### 硬件和软件规格

**服务器配置：**

| 服务类型 | 节点类型     | 节点数量 | 本地 SSD        | EBS gp3 卷 |
| -------- | ------------ | -------- | --------------- | ---------- |
| Kvrocks  | c7gd.8xlarge | 1        | 1 x 1900GB NVME | 1          |
| EloqKV   | c7gd.8xlarge | 1        | 1 x 1900GB NVME | 1          |

对于 **EloqKV**，我们启用持久存储并打开 WAL（预写日志）。

```
# 设置为 on 以启用持久存储
enable_data_store=on
# 设置为 on 以启用 WAL
enable_wal=on
```

对于 Kvrocks，我们主要更改了两个配置选项。

```
# 如果设置为 yes，写入操作将从操作系统
# 缓冲区缓存中刷新，然后才认为写入完成。
# 如果启用此标志，写入将变慢。
# 如果禁用此标志，且机器崩溃，一些最近的
# 写入可能会丢失。注意，如果只是进程崩溃
# （即机器不重启），即使 sync==false，也不会丢失任何写入。
#
# 默认值：no
# rocksdb.write_options.sync no
rocksdb.write_options.sync yes

# 工作线程的数量，增加或减少会影响性能。
# workers 8
workers 24
```

磁盘性能在写密集型工作负载中起着关键作用。因此，我们使用本地 SSD 和弹性块存储（EBS）进行基准测试。本地 SSD 提供低延迟和高 IOPS，非常适合高性能需求。然而，在云环境中，如果虚拟机（VM）停止，本地 SSD 上的数据可能会丢失。另一方面，EBS 提供高可用性，允许在原始 VM 失败时将卷附加到新的 VM。此外，EBS 是弹性的，允许精确控制卷的数量和大小。在我们的案例中，50GB 的 [EBS gp3](https://aws.amazon.com/ebs/volume-types/) 卷对于我们的 WAL 需求来说已经足够了。这样的卷每月只需 4 美元，同时提供 3000 IOPS 和 125 MB/s 的吞吐量。考虑到本地 SSD 和 EBS 的不同优势和限制，我们对两者都进行了实验。

我们使用以下配置运行 `memtier_benchmark`：

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=$ratio --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `-t`：并行执行的线程数，我们设置为 80。

- `-c`：每个线程的客户端数。我们设置为 5、10、20、40 来评估不同的并发级别。这导致总并发值为 400、800、1600 和 3200，计算方式为 `thread_num × client_num`。
- `--ratio`：Set\:Get 比率设置为 1:0 表示纯写工作负载，1:10 表示混合工作负载。

#### 结果

以下是纯写工作负载的结果。

X 轴：表示不同的并发度（`thread_num × client_num`），模拟不同级别的并发数据库访问。

左 Y 轴：每秒操作数（OPS）的吞吐量。

右 Y 轴：平均延迟（毫秒）。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqkv_kvrocks_set.png').default} alt="EloqKV vs Kvrocks Set" />

</div></p>

**EloqKV** 在 EBS 和本地 SSD 上都显著优于 Kvrocks。在 EBS 上，**EloqKV** 实现的写入吞吐量是 Kvrocks 的 10 倍，而在本地 SSD 上，它的速度是 Kvrocks 的 2-4 倍。这种性能提升得益于 **EloqKV** 的架构，它将事务和日志服务解耦，允许多个日志工作者并行写入预写日志（WAL）并执行 fsync 操作，从而提高整体吞吐量。此外，与 Kvrocks 相比，**EloqKV** 即使在高并发下也保持显著较低的延迟。

以下是混合工作负载的结果。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_kvrocks_setget.png').default} alt="EloqKV vs Kvrocks SetGet" />

</div></p>

结果显示，**EloqKV** 在混合工作负载上也优于 Kvrocks。**EloqKV** 即使在接近 900K OPS 的重型混合工作负载下，也能保持低于 1 ms 的读取延迟。相比之下，EBS 上的 Kvrocks 表现出显著更高的延迟，即使在相对较低的并发度下，读写延迟都超过 10 ms，随着并发度的增加，延迟上升到超过 50 ms。即使在本地 SSD 上，Kvrocks 的读取延迟也远高于 **EloqKV**。这表明 **EloqKV** 即使在集群承受重型写入工作负载时也能保持低读取延迟。

### 实验二：WAL 的磁盘扩展

**EloqKV** 的解耦 WAL 日志服务可以部署多个日志工作者将 WAL 日志写入多个磁盘。由于一旦完成检查点，WAL 日志就可以被截断，所需的磁盘大小通常相当小。Kvrocks 不支持跨多个磁盘写入重做日志，因此这个实验仅针对 **EloqKV** 进行。

**服务器配置：**

| 服务类型         | 节点类型     | 节点数量 | EBS gp3 卷 |
| ---------------- | ------------ | -------- | ---------- |
| EloqKV 日志      | c7g.12xlarge | 1        | 最多 10    |
| 客户端 - Memtier | c6gn.8xlarge | 1        | 0          |

我们使用不同数量的 WAL 磁盘和不同的线程数对 **EloqKV** 进行基准测试，使用以下命令：

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:0 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `-t`：并行执行的线程数，我们设置为固定值 80。
- `-c`：每个线程的客户端数。我们配置为 40、60 和 80，这导致总并发值为 3200、4800 和 6400，计算方式为 `thread_num × client_num`。

在这个实验中，由于将日志服务与事务服务分离导致延迟增加，我们的并发度比之前的实验更高。

#### 结果

下图显示了磁盘数量如何影响 **EloqKV** 的性能。

X 轴：表示基准测试期间使用的不同线程数，模拟不同级别的并发数据库访问。

左 Y 轴：每秒操作数（KOPS）的吞吐量

右 Y 轴：平均延迟（毫秒）。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_scale_disk_set.png').default} alt="EloqKV Disk Scale Set" />

</div></p>

我们可以观察到，随着磁盘数量的增加，当磁盘数为 1、2 和 4 时，吞吐量几乎呈线性增长，同时延迟相应降低。添加更多磁盘继续提升吞吐量，但增长速度较慢。对于 6 个和 8 个磁盘，吞吐量趋于平稳，即使在高并发下也保持基本相同。

### 实验三：TxServer 的扩容

如前所述，当磁盘数量超过六个时，吞吐量不再增加。这表明日志记录不再是瓶颈；要实现更高的吞吐量，扩展 TxServer 的 CPU 可能是下一步。显然，横向扩展也是另一个选择，但我们将在另一篇博客中讨论这个问题。

**服务器配置：**

| 服务类型      | 节点类型     | 节点数量 | EBS gp3 卷 |
| ------------- | ------------ | -------- | ---------- |
| EloqKV TX 8x  | c7gi.8xlarge | 1        | 1          |
| EloqKV TX 12x | c7g.12xlarge | 1        | 1          |

#### 结果

下图显示了当我们有多个磁盘提供日志 IOPS 时，CPU 核心数量如何影响 **EloqKV** 的性能。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_scale_cpu_set.png').default} alt="EloqKV CPU Scale Set" />

</div></p>

在 32 核 CPU 上，超过 8 个磁盘并不会显著增加吞吐量。通过将 TxServer 的 CPU 从 32 核扩展到 48 核，我们可以实现吞吐量的显著提升和延迟的降低。在高并发下，当添加更多 CPU 核心时，延迟显著从 10ms 降低到 8ms 以下。

### 分析和结论

在这篇博客中，我们评估了 **EloqKV** 并展示了在强制执行数据持久性时的性能。在普通的低端服务器上，**EloqKV** 可以轻松维持每秒超过 200,000 次写入，并保持可接受的延迟。虽然这低于我们在[之前博客](/blog/2024/08/17/benchmark-single-node)中强调的纯内存缓存性能，但对于许多实际应用来说仍然相当合适。请注意，这个性能数字与*单进程* Redis 服务器在相同硬件上纯内存模式下能够达到的性能没有太大差异。

此外，我们展示了 **EloqKV** 的架构优势，通过扩展日志服务来提高写入吞吐量，同时保持事务服务使用的资源。这种能力得益于我们革命性的[数据基底](/blog/2024/08/11/data-substrate)架构。考虑一个场景，尽管更新量很大，但总数据量可以轻松适应单个服务器的内存（例如高频交易）。**EloqKV** 的完全可扩展性对于支持此类应用而不浪费宝贵资源至关重要。
