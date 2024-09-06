---
title: 'ACID in EloqKV : Distributed Transaction'
authors: eloq
date: 2024-09-01
tags: [Company]
---

In the previous blog, we discussed the [durable feature](/blog/2024/08/25/benchmark-txlog) of **EloqKV** and benchmarked the write performance of **EloqKV** with the Write-Ahead-Log enabled. In this blog, we will continue to explore the transaction capabilities of **EloqKV** and benchmark the performance of distributed atomic operations using the Redis _WATCH / MULTI / EXEC_ commands.

<!--truncate-->

All benchmarks were conducted on AWS (region: us-east-1) EC2 instances, with Ubuntu 22.04. In all tests, we use **EloqKV** version 0.6.9.

### Transaction in EloqKV

Fifteen years ago, the esteemed database expert Mike Stonebraker famously wrote an [article](https://cacm.acm.org/blogcacm/stonebraker-on-nosql-and-enterprises/) in _Communications of the ACM_ declaring, "No ACID Equals No Interest" for enterprise users. Unfortunately, due to the high costs associated with distributed transactions, many distributed databases avoid full transaction support in favor of better performance. For example, while Redis supports limited transaction operations in single-node mode, it does not support transactions across servers in a cluster.

Thanks to our revolutionary [Data Substrate](/blog/2024/08/11/data-substrate) architecture, **EloqKV** is a fully ACID-compliant database. In addition to offering durability, which was discussed in a previous [blog post](/blog/2024/08/25/benchmark-txlog), **EloqKV**'s transaction capabilities support the Redis _WATCH, MULTI, DISCARD_, and _EXEC_ commands even in a cluster.

In this blog, we focus on benchmarking the _MULTI_ and _EXEC_ commands for _PUT/GET_ operations—specifically, performing a series of read and write operations atomically across a cluster of servers. We believe this workload provides valuable insights into the costs associated with distributed transactions. Although **EloqKV** also supports _WATCH, DISCARD_, and _Lua scripting_, creating standard representative test cases for these features is more challenging.

In **EloqKV**, the ACI (Atomicity, Consistency, Isolation) part of ACID is always enabled. No configuration changes are required to enable _MULTI_ and related commands in a cluster. A single key operation is executed as a transaction with a single command, and will not incur additional overhead. **EloqKV** supports different [levels of isolation](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Isolation_levels>), with the default being [Repeatable Reads](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Repeatable_reads>), which is the isolation level used in the experiments discussed in this blog.

### Experiments

In the first experiment, we compare EloqKV and Redis in batch mode across different workloads. We focus on two batch modes:

1. Pipeline Mode: In this mode, the client sends multiple commands to the server without waiting for responses to previous commands. The server processes these commands sequentially and returns all the responses at once. This batching approach significantly reduces network communication overhead, especially when executing many commands. Notice that each command in the pipeline is executed independently, with potentially other commands executed in between. However, we do enforce that the commands for any given key is executed in the order they appear in pipeline.

2. WATCH / MULTI / EXEC Command Mode: This mode ensures that a group of commands is executed as a single atomic operation, meaning either all commands are executed or none are.

Typically, pipeline mode offers higher performance compared to MULTI / EXEC due to the absence of isolation overhead. However, our experiment demonstrates that while MULTI / EXEC is slower than pipeline mode, it can still perform a few million kv operations per second, which is more than sufficient for most workloads.

In the following experiment, **EloqKV** operates in pure memory mode, with persistent storage and WAL disabled.

### Hardware and Software Specification

**Server Machine:**

| Service type         | Node type    | Node count |
| -------------------- | ------------ | ---------- |
| EloqKV 0.6.9         | c7g.8xlarge  | 1          |
| EloqKV 0.6.9 Cluster | c7g.8xlarge  | 3          |
| Redis 7.2.5          | c7g.8xlarge  | 1          |
| Client eloq-bench    | c6gn.8xlarge | 1          |

### Experiment:

We developed a new benchmarking tool, `eloq_benchmark`, specifically to test the transaction performance of Redis and **EloqKV**, as memtier_benchmark does not support `MultiExec`. You can download `eloq_benchmark` from [here](https://github.com/monographdb/redis_bench)

We run `eloq_benchmark` with the following configuration:

```
eloq_benchmark --h $server_ip --p $server_port --numKVPairEntries=$keynum --numConnections=$conn --getRatio=$ratio --opType=$optype --batchSize=$batchsize
```

- `--numKVPairEntries`: Number of entries, which is set to 1000000.

- `--numConnections`: Number of concurrent connnections, which is set to 256 for single-node and 768 for three-node cluster.

- `--getRatio`: Set it to 0 for write-only workload, 0.5 for mixed workload and 1 for read-only workload.

- `--opType`: Set batch mode, set it to `pipeline` for pipeline mode, set it to `tx` for `MutilExec` atomic mode.

- `--batchSize`: Number of keys in a batch command, which we set to 6.

#### Results

Below are the performance results of batch mode of Redis and **EloqKV** among various workload. Note that the batch size is fixed at 6.

X-axis: Represents the different workload types (read/write/mixed) used in the benchmark, simulating a range of real-world scenarios.

Y-axis: Throughput in Thousand OPS (Operations Per Second).

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqkv_redis_batch_rr.png').default} alt="EloqKV vs Redis Transaction" />

</div></p>
<!-- 
<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_redis_batch.png)
</div>
</p> -->

The results demonstrate that **EloqKV** significantly outperforms Redis in both pipeline and `MultiExec` atomic modes on a single node. With a fixed batch size of 6 keys, **EloqKV** achieves a throughput exceeding 200 million operations per key per second (KPS) in both modes, which is sufficient for most workloads while maintaining atomic semantics.

However, memory capacity can become a bottleneck, necessitating a cluster solution for handling larger datasets. Notably, Redis `MultiExec` is not supported in cluster mode if keys in a single batch are distributed across different shards. To work around this, users must use key `hashtags` to ensure all keys in a batch are located on the same shard, which can be cumbersome. **EloqKV**, on the other hand, does not have this limitation. It allows you to scale memory capacity seamlessly and maintain transactional integrity across a cluster, just as if you were operating on a single node.

It's worth mentioning that the throughput of a three-node **EloqKV** cluster is lower than that of a single-node **EloqKV**. This reduction is attributed to the additional network round trips and scheduling overhead introduced by automatic request redirection. We are actively working on optimizing network costs in future **EloqKV** releases.

### Evaluate the Impact of Batch Size

Next, we will run `eloq_benchmark` with batch sizes ranging from 1 to 6. In this benchmark, we configure EloqKV's transaction isolation level to RepeatableRead as well. This setup requires each Get operation in the `MultiExec` batch to acquire a read intent and undergo validation during the transaction commit phase.

#### Result

Below are the performance results of **EloqKV** `MultiExec` command with different batch size among various workload.

X-axis: Represents the different workload types (read/write/mixed) used in the benchmark, simulating a range of real-world scenarios.

Y-axis: Throughput in Thousand OPS (Operations Per Second).

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_batch_size.png').default} alt="EloqKV vs Redis Transaction" />

</div></p>

The results show that **EloqKV**’s throughput decreases as the batch size increases. This is because larger batch sizes introduce additional transaction overhead. For read requests, each key must be read and then validated during the transaction commit phase to ensure that RepeatableRead isolation is maintained. For write requests, a write lock must be acquired for each key and then released, along with updating the value during the transaction commit phase. Although the throughput per `MultiExec` command declines with larger batch sizes, the total keys processed per second (KPS) increases. For instance, with a batch size of 1, the KPS is 700,000, while with a batch size of 6, it rises to 2 million.

In conclusion, despite the increased overhead associated with larger batch sizes, **EloqKV** demonstrates improved overall throughput efficiency, as evidenced by the significant rise in KPS.
