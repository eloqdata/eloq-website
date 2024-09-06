---
title: 'EloqKV as Memory Cache'
authors: eloq
date: 2024-08-17
tags: [Company]
---

In this blog, we evaluate EloqKV as an in-memory cache, focusing on its single-node performance. We compare EloqKV with [Redis](https://github.com/redis/redis), a widely used in-memory data store, and [DragonflyDB](https://www.dragonflydb.io), a newer option boasting high performance due to its multi-threaded architecture and optimized implementation leveraging [modern innovations](https://github.com/dragonflydb/dragonfly?tab=readme-ov-file#background).

<!--truncate-->

All benchmarks were conducted on AWS (region: us-east-1) EC2 instances with Ubuntu 22.04. The [memtier-benchmark](https://github.com/RedisLabs/memtier_benchmark) tool was used to generate workloads..

## Single Node Performance

We compare EloqKV with Redis and DragonflyDB in memory-only mode, without enabling persistent storage or transactional features. Both Redis and DragonflyDB have limited [persistency capabilities](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/). Redis offers logging (AOF) and checkpointing (RDB), but AOF isn't a true [Write-Ahead-Log (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) since data is written asynchronously. RDB only periodically saves in-memory state, meaning Redis can lose committed data if a node crashes. DragonflyDB supports only checkpointing, not AOF. Since Redis and DragonflyDB are typically used as in-memory caches, we benchmarked EloqKV in the same configuration.

### Hardware and Software Configurations

Server Machine:

| Service            | Node type    | Node count |
| ------------------ | ------------ | ---------- |
| Redis 7.2.5        | c7g.8xlarge  | 1          |
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

To evaluate **EloqKV**’s write performance, we run `memtier_benchmark` with ratio of 1:0 (write-only) with the following configuration:

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

Right Y-axis: 99.9 Percentile latency in milli seconds (ms).

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqkv_dragon_redis_set_new.png').default} alt="EloqKV vs DragonflyDB vs Redis Set" />

</div></p>

**EloqKV** and DragonflyDB both outperform Redis due to their support for multiple worker threads. **EloqKV** delivers almost the same high throughput and low latency as DragonflyDB across various concurrency scenarios.

### Read-Only Workload

For the read-only workload, we adjusted the Set\:Get ratio to 0:1 (read-only):

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=0:1 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `--ratio`: Set to 0:1 for read-only operations.

#### Results

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_dragon_redis_get_new.png').default} alt="EloqKV vs DragonflyDB vs Redis Get" />

</div></p>

Again, **EloqKV** offers slightly lower throughput, and slightly higher but still very respectable latency compared to DragonflyDB. Both **EloqKV** and DragonflyDB significantly outperform Redis, both in throughput and in latency.

### Mixed Write-Read Workload

Finally, the mixed workload with a 1:10 ratio of Put\:Get:

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:10 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- `--ratio`: Set to 1:10 for mixed write-read operations.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_dragon_redis_setget_new.png').default} alt="EloqKV vs DragonflyDB vs Redis SetGet" />

</div></p>

**EloqKV** exhibits similar throughput to DragonflyDB. As concurrency increases, **EloqKV** shows a slightly higher P999 latency than DragonflyDB, but remains under 4ms even with over a thousand concurrent connections.

### Analysis and Conclusion

Based on the previous experiments, we can obtain some interesting observations. In this section, we will give some (opinionated) analysis.

#### Single Worker vs Multiple Workers

**EloqKV** and DragonflyDB can significantly outperform _single process_ Redis on a modern multi-core server. The difference is the result of a fundamental [design philosophy](https://medium.com/@yashpaliwal42/redis-single-threaded-and-still-fast-89625094048b) took by Redis. Redis restricts internal in-memory data structure operations to a single worker thread, while multiple IO threads handle networking and persistency. This choice, though greatly simplifies Redis's design, naturally limits performance on multi-core systems. In comparison both **EloqKV** and DragonflyDB allow multiple workers.

There is plenty of [debate](https://redis.io/blog/redis-architecture-13-years-later/) about whether the performance comparison is fair. Redis is supposed to scale horizontally even on a single server node, by being deployed as a _cluster_ with multiple instances/shards. Even for single worker architecture, there is still space for optimization, as demonstrated by [Valkey](https://valkey.io/) that have been [pushing the performance](https://valkey.io/blog/unlock-one-million-rps/) of Redis-like KV store.

Nonetheless, with increasing CPU cores and more complex query workloads, we believe that single threaded designs face fundamental limitations. Even Redis is exploring multithreading for [certain queries](https://redis.io/blog/announcing-faster-redis-query-engine-and-our-vector-database-leads-benchmarks/).

#### Do We Really Need to Specialize?

Compared with DragonflyDB, **EloqKV** currently lacks a few optimizations such as [io_uring](https://en.wikipedia.org/wiki/Io_uring) based networking. Due to these limitations, our profiling shows that **EloqKV** is bound by the networking stack when serving the workloads in the experiments.

Even so, as the experiments demonstrated, **EloqKV** works _almost_ as well as DragonflyDB on a workload that DragonflyDB was specifically designed and optimized for. This begs the question of whether designing special database software for limited use cases is profitable. Unlike Redis and DragonflyDB, **EloqKV** is much more than a single node memory cache. It excels in clustered, durable, and fully ACID-compliant transactional setups. Future blog posts will explore these capabilities in greater detail.

**EloqKV** is based on our [Data Substrate](/blog/2024/08/11/data-substrate) technology. We believe that with this revolutionary technology, users can greatly simplify their data infrastructures by reducing the need for many specialized databases.
