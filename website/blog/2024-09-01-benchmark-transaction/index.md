---
title: 'ACID in EloqKV : Atomic Operations'
authors: eloq
date: 2024-09-01
tags: [Company]
---

In the previous blog, we discussed the [durable feature](/blog/2024/08/25/benchmark-txlog) of **EloqKV** and benchmarked the write performance of **EloqKV** with the Write-Ahead-Log enabled. In this blog, we will continue to explore the transaction capabilities of **EloqKV** and benchmark the performance of distributed atomic operations using the Redis `MULTI EXEC` commands.

<!--truncate-->

In this blog, we evaluate _small scale_ clusters to show the behavior of **EloqKV** accross servers. Scalability in a larger scale cluster with different number of servers will be evaluated at a later blog. All benchmarks were conducted on AWS (region: us-east-1) EC2 instances, with Ubuntu 22.04. In all tests, we use **EloqKV** version 0.7.4.

### Transaction in EloqKV

Fifteen years ago, the esteemed database researcher and Turing Award Winner [Mike Stonebraker](https://en.wikipedia.org/wiki/Michael_Stonebraker) famously wrote an [article](https://cacm.acm.org/blogcacm/stonebraker-on-nosql-and-enterprises/) in _Communications of the ACM_ declaring, "No ACID Equals No Interest" for enterprise users. Unfortunately, due to the high costs associated with distributed transactions, many distributed databases avoid full transaction support in favor of better performance. For example, while Redis supports limited transaction operations in single-node mode, it does not support transactions across servers in a cluster.

Thanks to our revolutionary [Data Substrate](/blog/2024/08/11/data-substrate) architecture, **EloqKV** is a fully ACID-compliant database. In addition to offering durability, which was discussed in a previous [blog post](/blog/2024/08/25/benchmark-txlog), **EloqKV**'s transaction capabilities support the Redis _WATCH, MULTI, DISCARD_, and _EXEC_ commands even in a cluster.

In this blog, we focus on benchmarking the _MULTI_ and _EXEC_ commands for _PUT/GET_ operations—specifically, performing a series of read and write operations atomically across a cluster of servers. We believe this workload provides valuable insights into the costs associated with distributed transactions. Although **EloqKV** also supports _WATCH, DISCARD_, and _Lua scripting_, creating standard representative test cases for these features is more challenging.

In **EloqKV**, the ACI (Atomicity, Consistency, Isolation) part of ACID is always enabled. No configuration changes are required to enable _MULTI_ and related commands in a cluster. A single key operation is executed as a transaction with a single command, and will not incur additional overhead. **EloqKV** supports different [levels of isolation](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Isolation_levels>), with the default being [Repeatable Reads](<https://en.wikipedia.org/wiki/Isolation_(database_systems)#Repeatable_reads>), which is the isolation level used in the experiments discussed in this blog.

In Repeatable Reads isolation level, reads and writes are about the same complexity. For read requests, each key must be read and then validated during the transaction commit phase to ensure that no modification happened in between reading and commiting. For write requests, a write lock must be acquired for each key and then released at the commit phase. Both require extra round-trips to accomplish and thus more expensive than non-transactional operations.

### Experiments

In the first experiment, we compare **EloqKV** and Redis in batch mode across different workloads. We focus on two batch modes:

1. **Pipeline**: In this mode, the client sends multiple commands to the server without waiting for responses to previous commands. The server processes these commands sequentially and returns all the responses at once. This batching approach significantly reduces network communication overhead, especially when executing many commands. Notice that each command in the pipeline is executed independently, with potentially other commands executed in between. However, we do enforce that the commands for any given key is executed in the order they appear in pipeline.

2. **MULTI / EXEC**: This mode ensures that a group of commands is executed as a single atomic operation, meaning either all commands are executed or none are. Please [note](/eloqkv/known-limit) that the Redis `MULTI/EXEC` command without `WATCH` normally does not fail because Redis execute this commands in a single thread on a single server, whereas **EloqKV** can roll back and fail a transaction due to concurrent transaction conflicts.

Redis does not support `Multi Exec` in cluster mode if keys in a single batch do not fall on to the same shard. To work around this, users must use `hashtags` to ensure certain keys are located on the same shard. This can be cumbersome and often cause load imbalance. For Redis, `Pipeline` support is client dependent. It is not a feature supported on all Redis clients. **EloqKV**, on the other hand, does not have these limitations. Transactions and Pipelines work on a cluster of nodes just as on a single node. Though **EloqKV** does support `hashtags` to colocate keys and can reduce network overhead.

In the following experiment, **EloqKV** operates in pure memory mode, with persistent storage and WAL disabled.

### Hardware and Software Specification

**Server Machine:**

| Service type         | Node type    | Node count |
| -------------------- | ------------ | ---------- |
| EloqKV 0.7.4         | c7g.8xlarge  | 1          |
| EloqKV 0.7.4 Cluster | c7g.8xlarge  | 3          |
| Redis 7.2.5          | c7g.8xlarge  | 1          |
| Client eloq-bench    | c6gn.8xlarge | 1          |

### Experiment:

We developed a new benchmarking tool, `eloq_benchmark`, specifically to test the transaction performance of Redis and **EloqKV**, as `memtier_benchmark` does not support `Multi Exec`. You can download `eloq_benchmark` [here](https://download.eloqdata.com/eloqkv/tools/eloq_benchmark-0.7.4.zip)

We run `eloq_benchmark` with the following configuration:

```
eloq_benchmark --h $server_ip --p $server_port --numKeys=$keynum --numConnections=$conn --getRatio=$ratio --opType=$optype --batchSize=$batchsize --numTestOps=$testops
```

- `--numKeys`: Number of entries, which is set to 1000000.

- `--numConnections`: Number of concurrent connnections, which is set to 256 for single-node and 768 for three-node cluster.

- `--numTestOps`: Number of test operations, which is set to 5000000.

- `--getRatio`: Set it to 0 for write-only workload, 0.5 for mixed workload and 1 for read-only workload.

- `--opType`: Set batch mode, set it to `pipeline` for pipeline mode, set it to `tx` for `MutilExec` atomic mode.

- `--batchSize`: Number of `Put/Get` operations on random keys in a batch, which we set to 6.

#### Results

Below are the performance results of batch mode of Redis and **EloqKV** among various workload. Note that the number of operations of `PUT/GET` in a batch is fixed at **6**.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/eloqkv_redis_batch_rr.png').default} alt="EloqKV vs Redis Transaction" />

</div></p>

`X-axis`: Represents the different workload types (read/write/mixed) used in the benchmark, simulating a range of real-world scenarios.

`Y-axis`: Throughput in Thousand OPS (Operations Per Second) for the batches. This number should be multiplied by 6 (batch size) to obtain the total KV operations.

On a single node, **EloqKV** significantly outperforms Redis in both pipeline and `Multi Exec` modes. With a fixed batch size of 6 keys, **EloqKV** achieves a throughput exceeding 200 million KV operations per second (KPS) in both modes on a single server. `Multi Exec` is slower than `Pipeline` due to additional book-keeping needed for atomic operations.

The throughput of a three-node **EloqKV** cluster is lower than that of a single-node **EloqKV**. In Pipeline mode, this is because of the additional network round trips. For `Multi Exec`, additional operations are needed for lock acquisition and releasing. Even so, the performance is quite respectable.

### Evaluate the Impact of Batch Size

Transaction size affects the efficiency of distributed transactions. In this experiment, we test `eloq_benchmark` with batch sizes ranging from 1 to 6.

#### Result

Below are the performance results of **EloqKV** `Multi Exec` command with different batch size among various workload.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>

<EnlargeableImage src={require('./img/eloqkv_cluster_batch_size.png').default} alt="EloqKV vs Redis Transaction" />

</div></p>

`X-axis`: Represents the different workload types (read/write/mixed) used in the benchmark, simulating a range of real-world scenarios.

`Left Y-axis`: Throughput in Thousand OPS (Operations Per Second), shown as the bars.

`Right Y-axis`: Percentage of Transaction Retries, shown as the dashed lines.

As expected, **EloqKV**’s transaction throughput decreases as the batch size increases. This is because larger batch sizes introduce additional work. Notice that the total KV operations carried out in the cluster must be multiplied by the batch size. Currently, **EloqKV** does not perform "query optimization" within a transaction. To guarantee transactional semantics, the operations in a batch are executed sequentially. In the future, we may optimize this by allowing some operations within a batch to be executed in parallel.

In our workload, we selected several random keys from a range to perform `PUT/GET` operations. As mentioned earlier, the key range was set to 1,000,000 in all experiments. We observed that transaction retries increase with larger batch sizes in both mixed and write-only workloads. This is due to the higher likelihood of transaction conflicts as the batch size grows. Reducing the level of concurrency or expanding the key range can help mitigate these conflicts. Additionally, the more concurrent writes, the more likely conflicts will occur. For read-only workloads, no transaction conflicts arise, so no transaction retries occurred.
