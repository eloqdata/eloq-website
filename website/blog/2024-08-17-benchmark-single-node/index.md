---
title: 'EloqKV 作为内存缓存'
authors: eloq
date: 2024-08-17
tags: [Benchmark]
image: /img/blog/single.jpg
description: Comprehensive performance benchmarks of EloqKV in single-node cache mode, comparing it with Redis and DragonflyDB.
blog: true
---

在这篇博客中，我们评估 **EloqKV** 作为内存缓存的表现，重点关注其单节点性能。我们将 **EloqKV** 与广泛使用的内存数据存储 [Redis](https://github.com/redis/redis) 和较新的选择 [DragonflyDB](https://www.dragonflydb.io) 进行比较，后者由于其多线程架构和利用[现代创新](https://github.com/dragonflydb/dragonfly?tab=readme-ov-file#background)的优化实现而拥有高性能。

<!--truncate-->

所有基准测试都在 AWS（区域：us-east-1）EC2 实例上进行，运行 Ubuntu 22.04。使用 [memtier-benchmark](https://github.com/RedisLabs/memtier_benchmark) 工具生成工作负载。

## 单节点性能

我们在纯内存模式下比较 **EloqKV** 与 Redis 和 DragonflyDB，不启用持久存储或事务功能。Redis 和 DragonflyDB 都有有限的[持久性能力](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)。Redis 提供日志（AOF）和检查点（RDB），但由于性能问题，AOF 很少配置为在每次写入时都进行 fsync。RDB 只是定期保存内存状态，如果节点崩溃可能会导致数据丢失。DragonflyDB 只支持检查点，不支持 AOF。由于 Redis 和 DragonflyDB 通常用作内存缓存，我们在相同配置下对 **EloqKV** 进行基准测试。

### 硬件和软件配置

服务器配置：

| 服务类型           | 节点类型     | 节点数量 |
| ------------------ | ------------ | -------- |
| Redis 7.2.5        | c7g.8xlarge  | 1        |
| DragonflyDB 1.21.2 | c7g.8xlarge  | 1        |
| EloqKV 0.7.4       | c7g.8xlarge  | 1        |
| 客户端 - Memtier   | c6gn.8xlarge | 1        |

我们按照官方说明设置 [**EloqKV**](/eloqkv/install-from-binary)、[DragonflyDB](https://www.dragonflydb.io/docs/getting-started/binary) 和 [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)。

对于 Redis，我们禁用 AOF 和 RDB 持久性。

```
redis-server --save "" --appendonly no
```

对于 DragonflyDB，我们只需要禁用检查点，因为它还不支持日志。

```
dragonfly --dbfilename=
```

对于 **EloqKV**，我们在其 `config.ini` 文件中禁用持久存储并关闭 WAL（预写日志）。

```
# 设置为 off 以关闭持久存储
enable_data_store=off
# 设置为 off 以关闭 WAL
enable_wal=off
```

### 纯写工作负载

为了评估 **EloqKV** 的写入性能，我们使用比率为 1:0（纯写）运行 `memtier_benchmark`，配置如下：

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:0 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `-t`：线程数，设置为固定值 32。
- `-c`：每个线程的客户端数。我们配置为 4、8、16 和 32 以评估不同的并发级别。这导致总并发值为 128、256、512 和 1024，计算方式为 `thread_num × client_num`。
- `--ratio`：Set\:Get 比率，1:0 表示纯写工作负载。

#### 结果

以下是纯写工作负载的结果。

X 轴：表示不同的并发度（`thread_num × client_num`），模拟不同级别的并发数据库访问。

左 Y 轴：每秒查询数（QPS）的吞吐量。

右 Y 轴：99.9 百分位延迟（毫秒）。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqkv_dragon_redis_set_new.png').default} alt="EloqKV vs DragonflyDB vs Redis Set" />

</div></p>

由于支持多个工作线程，**EloqKV** 和 DragonflyDB 都优于 Redis。**EloqKV** 在各种并发场景下都能提供与 DragonflyDB 几乎相同的高吞吐量和低延迟。

### 纯读工作负载

对于纯读工作负载，我们将 Set\:Get 比率调整为 0:1（纯读）：

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=0:1 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `--ratio`：设置为 0:1 表示纯读操作。

#### 结果

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_dragon_redis_get_new.png').default} alt="EloqKV vs DragonflyDB vs Redis Get" />

</div></p>

同样，**EloqKV** 提供略低的吞吐量，以及略高但仍然非常可观的延迟，与 DragonflyDB 相比。**EloqKV** 和 DragonflyDB 在吞吐量和延迟方面都显著优于 Redis。

### 混合读写工作负载

最后，Put\:Get 比率为 1:10 的混合工作负载：

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:10 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `--ratio`：设置为 1:10 表示混合读写操作。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_dragon_redis_setget_new.png').default} alt="EloqKV vs DragonflyDB vs Redis SetGet" />

</div></p>

**EloqKV** 展示出与 DragonflyDB 相似的吞吐量。随着并发度的增加，**EloqKV** 显示出略高于 DragonflyDB 的 P999 延迟，但即使在超过一千个并发连接的情况下仍保持在 4ms 以下。

### 分析和结论

基于前面的实验，我们可以得到一些有趣的观察。在本节中，我们将给出一些（带有主观色彩的）分析。

#### 单工作者 vs 多工作者

**EloqKV** 和 DragonflyDB 在现代多核服务器上能够显著优于*单进程* Redis。这种差异是 Redis 采用的基本[设计理念](https://medium.com/@yashpaliwal42/redis-single-threaded-and-still-fast-89625094048b)的结果。Redis 将内部内存数据结构操作限制在单个工作线程中，而多个 IO 线程处理网络和持久性。这个选择虽然大大简化了 Redis 的设计，但自然限制了在多核系统上的性能。相比之下，**EloqKV** 和 DragonflyDB 都允许多个工作者。

关于性能比较是否公平，有很多[争论](https://redis.io/blog/redis-architecture-13-years-later/)。Redis 应该通过在单个服务器节点上部署为*集群*，使用多个实例/分片来实现水平扩展。即使对于单工作者架构，仍有优化空间，正如 [Valkey](https://valkey.io/) 所展示的那样，它一直在[推动](https://valkey.io/blog/unlock-one-million-rps/) Redis 类 KV 存储的性能极限。

尽管如此，随着 CPU 核心数量的增加和查询工作负载的复杂化，我们认为单线程设计面临着根本性的限制。即使 Redis 也在探索[某些查询](https://redis.io/blog/announcing-faster-redis-query-engine-and-our-vector-database-leads-benchmarks/)的多线程处理。Redis 集群的行为与单个服务器不同，需要特别注意键分区和负载平衡。我们将在[下一篇博客文章](/blog/2024/08/22/benchmark-cluster)中讨论集群化。

#### 我们真的需要专门化吗？

与 DragonflyDB 相比，**EloqKV** 目前缺少一些优化，比如基于 [io_uring](https://en.wikipedia.org/wiki/Io_uring) 的网络。由于这些限制，我们的性能分析显示，**EloqKV** 在服务实验中的工作负载时受到网络栈的限制。

即便如此，正如实验所示，**EloqKV** 在 DragonflyDB 专门设计和优化的工作负载上表现*几乎*一样好。这就引发了一个问题：为有限的使用场景设计专门的数据库软件是否有价值。与 Redis 和 DragonflyDB 不同，**EloqKV** 远不止是一个单节点内存缓存。它在集群化、持久化和完全符合 ACID 的事务设置中表现出色。未来的博客文章将详细探讨这些功能。

**EloqKV** 基于我们的[数据基底](/blog/2024/08/11/data-substrate)技术。我们相信，通过这项革命性技术，用户可以通过减少对多个专门数据库的需求来大大简化他们的数据基础设施。
