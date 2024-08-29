---
title: 'Benchmark EloqKV as Memory Cache'
authors: eloq
date: 2024-08-17
tags: [Company]
---

In this blog, we benchmark **EloqKV** to evaluate it as an in-memory cache, focusing first on single-node performance and later discussing its scalability in cluster mode. In the single node case, we benchmark **EloqKV** against the popular in-memory data structure store [Redis](https://github.com/redis/redis) as well as a recent contender [DragonflyDB](https://www.dragonflydb.io), which claims to achieve high performance due to its multi-threaded worker architecture and a highly optimized implementation leveraging some [modern innovations](https://github.com/dragonflydb/dragonfly?tab=readme-ov-file#background).

<!--truncate-->

All benchmarks were conducted on AWS (region: us-east-1) EC2 instances, with Ubuntu 22.04. Workloads were generated using the [memtier-benchmark](https://github.com/RedisLabs/memtier_benchmark) tool.

## Single Node Performance

We compare the performance of **EloqKV** with Redis and DragonflyDB. The goal of this comparison is to evaluate the performance of **EloqKV** in memory-only mode, without persistent storage and transactional features enabled. Both Redis and DragonflyDB have limited [persistency capabilities](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/). Redis offers two mechanisms for persistency: logging (AOF) and checkpointing (RDB). However, AOF is not a proper implementation of [Write-Ahead-Log (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging), as data is written to disk asynchronously. RDB periodically saves in-memory state as checkpoints. Therefore, Redis can lose committed data if a node crashes. DragonflyDB currently only supports checkpointing and does not offer AOF. As Redis and DragonflyDB are typically used as pure in-memory caches, we benchmarked EloqKV against them under this configuration.

### Hardware and Software Configurations

Server Machine:

| Service            | Node type    | Node count |
| ------------------ | ------------ | ---------- |
| Redis 6.0.16       | c7g.8xlarge  | 1          |
| DragonflyDB 1.21.2 | c7g.8xlarge  | 1          |
| EloqKV 0.6.9       | c7g.8xlarge  | 1          |
| Client - Memtier   | c6gn.8xlarge | 1          |

We follow the official instructions to setup [**EloqKV**](/eloqkv/install-from-binary), [DragonflyDB](https://www.dragonflydb.io/docs/getting-started/binary) and [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/).

For Redis, we disable AOF and RDB persistency.

```
redis-server --save "" --appendonly no
```

For DragonflyDB, we only need to disable checkpointing since it does not yet support logging.

```
dragonfly --dbfilename=
```

For EloqKV, we disable persistent storage and turn off WAL (Write-Ahead Logging) in its `config.ini` file.

```
# set it to none to turn off persistent storage for all databases
enable_data_store=none
# set it to none to turn off WAL for all databases
enable_wal=none
```

### Write-Only Workload

To assess **EloqKV**’s write performance, we run memtier_benchmark with ratio of 1:0 (write-only) with the following configuration:

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:0 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `-t`: Number of threads, which was set to a fixed value of 32.
- `-c`: Number of clients per thread. We configured it to 4, 8, 16 and 32 to evaluate different concurrency levels. This resulted in total concurrency of 128, 256, 512 and 1024, calculated as `thread_num × client_num`.
- `--ratio`: Set\:Get ratio, 1:0 for write-only workload.

#### Results

Below are the results of the write-only workload.

X-axis: Represents the varying concurrencies (`thread_num × client_num`), simulating different levels of concurrent database access.

Left Y-axis: Throughput in QPS (Queries Per Second).

Right Y-axis: 99.9 Percentile latency in micro seconds (us).

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_dragon_redis_set_new.png)
</div>
</p>

**EloqKV** and DragonflyDB both outperform Redis due to their support for multiple worker threads. **EloqKV** delivers the same high throughput and low latency as DragonflyDB across various concurrency scenarios.

### Read-Only Workload

For the read-only workload, we adjusted the Set\:Put ratio to 0:1 (read-only):

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=0:1 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `--ratio`: Set to 0:1 for read-only operations.

#### Results

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_dragon_redis_get_new.png)
</div>
</p>

Again, **EloqKV** offers similar throughput, while exhibits slightly higher but still very respectable latency compared to DragonflyDB. Both **EloqKV** and DragonflyDB significantly outperform Redis, both in throughput and in latency.

### Mixed Write-Read Workload

Finally, the mixed workload with a 1:10 ratio:

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:10 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `--ratio`: Set to 1:10 for mixed write-read operations.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_dragon_redis_setget_new.png)
</div>
</p>

**EloqKV** exhibits similar throughput to DragonflyDB. As concurrency increases, **EloqKV** shows a slightly higher P999 latency than DragonflyDB, but remains under 4ms even with over a thousand concurrent connections.

### Analysis and Conclusion

Based on the previous experiments, we can obtain some interesting observations. In this section, we will give some ( opinionated ) analysis.

#### Single Worker vs Multiple Workers vs Cluster

We can observe that for in-memory caching applications, **EloqKV** and DragonflyDB can significantly outperform _single process_ Redis on a modern multi-core server. The difference is a result of a fundamental [design philosophy](https://medium.com/@yashpaliwal42/redis-single-threaded-and-still-fast-89625094048b) took by Redis. Redis restricts internal in-memory data structure operations to a single worker thread, while multiple IO threads handle networking and persistency. In comparison both **EloqKV** and DragonflyDB allow multiple workers.

There is already plenty of [debate](https://redis.io/blog/redis-architecture-13-years-later/) on whether the performance comparison is fair. Redis is supposed to scale horizontally even on a single server node, by being deployed as a _cluster_ with multiple instances/shards. Unfortunately, a cluster is much more difficult to manage, and behaves differently from a single server instance. For example, one cannot perform transactional "MULTI" operations cross shards even on the same server node. We do believe that a single threaded design will eventually hit its limitations as CPU cores keep increasing and the computation performed for each database access becomes more [complex](https://redis.io/blog/announcing-faster-redis-query-engine-and-our-vector-database-leads-benchmarks/).

For most real world applications that only needs KV cache, even single-threaded Redis is already plenty fast. Indeed, more often than not, the limiting factor is actually memory capacity. In this case, KV caches have to be deployed as a cluster. Though DragonflyDB avoids the issue of horizontal scaling on a single server node, it was still designed as a _single node server_, not a distributed system. DragonflyDB is not cluster aware, and requires external mechinanary to scale out. Moreover, it also cannot perform "MULTI" operations cross servers. **EloqKV** fully eliminates these issues as it is designed as a full blown distributed transactional database.

#### Do We Really Need to Specialize?

Compared with DragonflyDB, **EloqKV** currently lacks a few optimizations such as [io_uring](https://en.wikipedia.org/wiki/Io_uring) based networking support. Due to these limitations, our profiling shows that **EloqKV** is bound by the networking stack when serving the workloads in previous experiments.

Even so, as the experiments demonstrated, **EloqKV** works _almost_ as well as DragonflyDB on a workload that DragonflyDB was specifically designed and optimized for. This begs the question of whether designing special database software for limited use cases is profitable. Notice that unlike Redis and DragonflyDB, **EloqKV** is much more than a single node memory cache. Indeed, experiments in the next section and our follow up blog posts will show that **EloqKV** performs very well as a clustered system, as a durable data store, or even as a fully ACID transactional store.

**EloqKV** is based on our [Data Substrate](/blog/2024/08/11/data-substrate) technology. We believe that with this revolutionary technology, users can greatly reduce the complexity of their data infrastructures by eliminatating many specialized databases for their data management needs.

## Scaling in Cluster Mode

Most key-value caches support horizontal scaling and can operate in a _cluster mode_. They partition data into multiple slots and distribute the slots to each shards. In a horizontally scaled cluster, KV caches pretty much scales linearly, modulo load imbalances and failure cases. To achieve such scalability, application developers need to understand the concept of _"slots"_ and _"shards"_ and _"tags"_. And the so called _cluster-aware_ clients need to know the topology of the cluster and direct requests to the proper server where data reside.

Clustering for KV cache is notoriously full of pitfalls, not least because nodes in a cluster may fail. Sometimes external tools (such as [Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/), [Twemproxy](https://github.com/twitter/twemproxy), [Dragonfly Cloud services](https://www.dragonflydb.io/docs/managing-dragonfly/cluster-mode)) are used to monitor the health and perform fail-over for the cluster. How these tools' interaction with the clients are never well specified. The fundmental reason is that all the KV caches are first designed as a single node process, while clustering is often an afterthought and a bolt-on feature.

**EloqKV** can work as a single node server while leveraging various clustering tools to provide horizontal scalability. In this mode, it can work with all the _"smart Redis clients"_ and provide the same scalability as other caching solutions. However, as a general purpose distributed database, a **EloqKV** cluster can also work as a whole, without exposing cluster details to the clients. A client can just interact with any node in an **EloqKV** cluster without worrying about whether the key is local to the server, how many servers are in the cluster, how data are shareded among the servers, whether there is a failure happening in the cluster, or whether the cluster is reconfiging to dynamically increase or reduce capacity.

Obviously, shielding cluster details has cost. In particular, a node redirecting requests will cause an extra network round trip. In this section, we compare the performance of a single-node **EloqKV** instance with that of an **EloqKV** cluster to evaluate the scalability.

In this assessment, **EloqKV** operates in pure memory mode, with persistent storage and transactional features disabled.

### Hardware and Software Specification

**Server Machine:**

| Service type         | Node type    | Node count |
| -------------------- | ------------ | ---------- |
| EloqKV 0.6.9         | c7g.8xlarge  | 1          |
| EloqKV 0.6.9 Cluster | c7g.8xlarge  | 3          |
| Client - Memtier     | c6gn.8xlarge | 3          |

### Experiment:

We benchmarked a single-node **EloqKV** with different read-write ratios using the following command:

```
memtier_benchmark -t 32 -c 20 -s $server_ip -p $server_port --distinct-client-seed --ratio=$ratio --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

To assess **EloqKV**’s scalability under different workloads, we ran memtier_benchmark in cluster mode with varying read-write ratios using the following configuration:

```
memtier_benchmark -t 32 -c 20 --cluster-mode -s $server_ip1 -p $server_port1 -s $server_ip2 -p $server_port2 -s $server_ip3 -p $server_port3 --distinct-client-seed --ratio=$ratio --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

#### Results

Below are the results of **EloqKV**'s scalability benchmark, comparing the throughput between a single-node **EloqKV** and a three-node **EloqKV** cluster across various workloads.

X-axis: Represents the different workload types (read/write/mixed) used in the benchmark, simulating a range of real-world scenarios.

Y-axis: Measures the QPS (Queries Per Second).

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_scale.png)
</div>
</p>

As we can see, **EloqKV** three nodes cluster's throughput is almost three times higher than the single node **EloqKV** among different types of workload. It verify **EloqKV**'s capability to maintain performance as it scales horizontally. We can conclude that **EloqKV** is a robust cache solution, particularly well-suited for all kinds of workloads.
