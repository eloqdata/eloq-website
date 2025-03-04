---
title: 'EloqKV 集群模式'
authors: eloq
date: 2024-08-22
tags: [Benchmark]
image: /img/blog/cluster.jpg
blog: true
description: Benchmarking EloqKV cluster performance and scalability.
---

在我们[之前的博客](/blog/2024/08/17/benchmark-single-node)中，我们对 **EloqKV** 进行了基准测试，评估了它作为内存缓存的单节点性能。在这篇博客中，我们将关注 **EloqKV** 的集群化，并讨论为什么它提供了一个从根本上更好的解决方案。

<!--truncate-->

在本博客中，我们评估*小规模*集群，以展示 **EloqKV** 在多服务器间的行为。更大规模集群中不同服务器数量的可扩展性将在后续博客中评估。所有基准测试都在 AWS（区域：us-east-1）EC2 实例上进行，运行 Ubuntu 22.04。使用 [memtier-benchmark](https://github.com/RedisLabs/memtier_benchmark) 工具生成工作负载。

## KV 存储集群化

对于大多数需要键值（KV）缓存的实际应用来说，即使是单线程的 Redis 通常也[足够快](https://medium.com/hprog99/why-is-redis-incredibly-fast-unpacking-the-secrets-of-its-speed-f10f051b3f23)。事实上，限制因素通常是内存容量。因此，KV 缓存通常以*集群模式*部署。

大多数 KV 缓存通过将数据分区到槽（slots）并将它们分布在分片（shards）上来支持水平扩展和集群模式操作。在水平扩展的集群中，性能和容量通常可以几乎线性扩展，尽管负载不平衡和故障情况可能会带来挑战。要实现这种可扩展性，开发人员必须理解*槽*、*分片*和*标签*的概念。而所谓的*集群感知*客户端需要知道集群拓扑，以便将请求定向到正确的服务器。

KV 缓存的集群化充满了陷阱，其中最重要的是因为集群中的节点可能会失败。通常需要外部工具，如 [Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/)、[Twemproxy](https://github.com/twitter/twemproxy)、[Dragonfly Cloud services](https://www.dragonflydb.io/docs/managing-dragonfly/cluster-mode) 来监控集群健康状况并处理故障转移。这些工具如何与客户端交互通常没有很好的规范。此外，KV 缓存集群的行为与单节点服务器不同。例如，"MULTI / EXEC" 命令在集群环境中不起作用。

根本问题是，许多 KV 缓存最初是作为单节点服务器设计的，集群化是后来作为附加功能添加的。例如，[Redis](https://en.wikipedia.org/wiki/Redis) 于 2009 年 5 月发布，而 Sentinel 支持直到 2013 年 12 月的 Redis 2.8 才出现。Redis 集群直到 2015 年 4 月的 Redis 3.0 才成为稳定功能。许多其他 KV 存储也是如此。

## 为什么 EloqKV 集群化与众不同

**EloqKV** 通过从一开始就设计为完全分布式的事务性数据库来消除这些问题。虽然它可以作为单节点服务器运行，并使用各种集群工具进行水平扩展，但它也能够在不向客户端暴露集群细节的情况下作为集群运行。客户端可以与 **EloqKV** 集群中的任何节点交互，而不必担心哪个服务器持有键、数据如何分片、集群中是否有故障，或者集群是否正在重新配置以动态增加或减少容量。这简化了开发过程，减少了对集群感知客户端的需求。

显然，使这个过程对客户端透明并屏蔽集群细节是有代价的。特别是，重定向请求会产生额外的网络往返。因此，我们确实允许启用一个标志，使服务器遵循 Redis 集群协议，当请求的数据不在本地时不重定向请求。在这种情况下，_智能_ Redis 客户端将按预期运行。与大多数 KV 缓存集群不同，**EloqKV** 集群是强一致性的。例如，如果由于网络分区而将节点从集群中删除，它会意识到这种情况，并可以拒绝为外部请求提供服务，直到它重新加入。

我们将单节点 **EloqKV** 实例的性能与 **EloqKV** 集群的性能进行比较，以评估透明重定向的成本。在这次评估中，**EloqKV** 在纯内存模式下运行，禁用了持久存储和事务功能。

## 硬件和软件规格

**服务器配置：**

| 服务类型          | 节点类型     | 节点数量 |
| ----------------- | ------------ | -------- |
| EloqKV 0.7.4      | c7g.8xlarge  | 1        |
| EloqKV 0.7.4 集群 | c7g.8xlarge  | 3        |
| 客户端 - Memtier  | c6gn.8xlarge | 3        |

## 实验：

我们对单节点 **EloqKV** 数据库在不同读写比率下进行了性能基准测试，使用单个 `memtier-benchmark` 客户端。用于基准测试的命令如下：

```
memtier_benchmark -t 32 -c 16 -s $server_ip -p $server_port --distinct-client-seed --ratio=$ratio --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

为了评估三节点 **EloqKV** 集群的性能，我们在常规和智能客户端模式下使用了三个 memtier-benchmark 客户端。在常规客户端模式下，用户与 **EloqKV** 集群的交互就像与单个节点一样，无需考虑键的存储位置。对每个常规客户端使用相同的 `memtier-benchmark` 命令，每个客户端连接到集群中的不同 **EloqKV** 节点。

对于智能客户端模式，我们在集群模式下运行 memtier-benchmark，使用不同的读写比率，配置如下：

```
memtier_benchmark -t 32 -c 16 --cluster-mode -s $server_ip1 -p $server_port1 -s $server_ip2 -p $server_port2 -s $server_ip3 -p $server_port3 --distinct-client-seed --ratio=$ratio --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

### 结果

以下是单节点 **EloqKV** 实例与三节点 **EloqKV** 集群在各种工作负载下的吞吐量比较结果。对于三节点集群，我们使用常规客户端和智能客户端进行了基准测试。使用常规客户端时，如果请求的键不在本地存储，**EloqKV** 会自动将请求重定向到其他节点。相比之下，使用智能客户端时，所有请求都直接发送到持有键的节点，这是基于智能客户端中缓存的集群配置。

X 轴：表示基准测试中使用的不同工作负载类型（读/写/混合），模拟各种真实场景。

Y 轴：每秒操作数（OPS）。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqkv_scale.png').default} alt="EloqKV Scale" />

</div></p>

使用常规客户端时，由于重定向导致的额外网络往返和调度开销，三节点 **EloqKV** 集群的吞吐量略低于单节点实例。尽管如此，集群仍然能够实现超过**每秒一百万次操作（OPS）**。重要的是，这不需要对应用程序代码进行任何更改，允许开发人员轻松扩展并克服内存容量限制，而无需修改代码或依赖智能客户端。

如预期的那样，使用智能客户端时，三节点 **EloqKV** 集群在各种工作负载下的吞吐量几乎是单节点实例的三倍。这突显了 **EloqKV** 与智能客户端的兼容性，使其能够实现近乎线性的可扩展性。
