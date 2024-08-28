---
title: 'Benchmark EloqKV as ACID Data Store'
authors: eloq
date: 2024-08-25
tags: [Company]
---

In our previous blog, we benchmarked **EloqKV** in memory cache mode, discussing both single-node and cluster performance. In this post, we delve into its write performance in transaction mode. The benchmarks were conducted using the memtier-benchmark tool.

<!--truncate-->

### Hardware and Software Specification

The benchmark was conducted on AWS (region: us-east-1) EC2 instances, with Ubuntu 22.04.

**Server Machine:**

| Service type     | Node type    | Node count | Gp3 EBS disk count |
| ---------------- | ------------ | ---------- | ------------------ |
| Kvrocks          | c7gi.8xlarge | 1          | 1                  |
| EloqKV TX 8x     | c7gi.8xlarge | 1          | 1                  |
| EloqKV TX 12x    | c7g.12xlarge | 1          | 1                  |
| EloqKV Log       | c7g.12xlarge | 1          | up to 10 WAL disks |
| client - Memtier | c6gn.8xlarge | 1          | 0                  |

Node that `EloqKV Log` node and `EloqKV TX 12x` node are only utilized in the disk scaling and CPU scaling experiments.

EloqKV version 0.6.9 is used for the tests.

### Software Deployment and Configuration

Follow link [Deploy Single Node](/eloqkv/quick-start) to setup **EloqKV**. The TxService and LogService should be deployed separately; please refer to the deployment topology described in each experiment.

Note: To enable transaction mode, please enable persistent storage and turn on WAL (Write-Ahead Logging).

```
# set it to none to turn off persistent storage for all databases
enable_data_store=all
# set it to none to turn off WAL for all databases
enable_wal=all
```

### Experiment I: Write Workload with WAL

In the first experiment, we compare EloqKV with Apache Kvrocks, a Redis-compatible NoSQL database that supports persistence. We evaluate the performance of EloqKV and Kvrocks under write-intensive workloads. To ensure data integrity, we enable both Write-Ahead Logging (WAL) and the fsync feature for both databases during testing. For EloqKV, both the transaction service and log service are deployed on the same node (c7gi.8xlarge), utilizing two log workers to write WAL logs.

Disk performance plays a critical role in write-intensive workloads. Therefore, we conduct benchmarks using both local SSDs and Elastic Block Store (EBS), which are commonly used as WAL log disks in cloud environments. Local SSDs offer low latency and high IOPS, making them ideal for high-performance needs. However, they come with the drawback that data is lost if the virtual machine (VM) is stopped. On the other hand, EBS provides high availability, allowing the disk to be attached to a new VM if the original node fails. Additionally, EBS is elastic, enabling precise control over disk size and number to better suit specific requirements—such as the relatively small size needed for WAL storage. Given the distinct advantages and limitations of local SSDs and EBS, we conduct our experiments using both types of disks.

We run `memtier_benchmark` with the following configuration:

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=$ratio --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- Thread Number (-t): Specifies the number of threads for parallel execution, which we have set to a fixed value of 80.
- Client Number (-c): Represents the number of clients per thread. We configured it to 5, 10, 20, 40 and 60 to evaluate different concurrency levels. In our experiment, this resulted in total concurrency values of 400, 800, 1600, and 3200, calculated as `thread_num` × `client_num`.
- Ratio (--ratio): 1:0 for write-only workload.

#### Results

Below are the results of the write-only workload, which illustrates **EloqKV**'s throughput and latency with different disk types across varying thread numbers, simulating different levels of concurrent database access.

X-axis: Represents the varying thread numbers employed during the benchmark, simulating different levels of concurrent database access.

Left Y-axis: Measures the QPS (Queries Per Second) in thousands (K).

Right Y-axis: Measures the average Latency in ms.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_kvrocks_set.png)
</div>
</p>

The results show that EloqKV outperforms Kvrocks on both EBS and local SSD. On EBS, EloqKV achieves a write throughput that is 10 times higher than Kvrocks, while on local SSD, it is 2-4 times faster. This performance improvement is due to EloqKV's architecture, which decouples transaction and log services, allowing multiple log workers to write Write-Ahead Logs (WAL) and perform disk fsync operations in parallel, thereby enhancing overall throughput. Additionally, EloqKV maintains significantly lower latency compared to Kvrocks, even under high concurrency.

However, EloqKV's throughput on EBS (GP3 in AWS) is lower than on local SSD due to the IOPS and throughput limitations of GP3. While using io2 could improve throughput, it is priced based on provisioned IOPS and throughput, making it much more expensive than local SSD. So, is there a way to achieve high throughput without the risk of data loss if the VM is stopped, as with local SSD, and without incurring the high costs of provisioned IOPS like io2? The answer is yes. EloqKV's decoupled WAL log service can deploy multiple log workers writing WAL logs to multiple disks. Since WAL logs can be truncated once a checkpoint is completed, the required disk size is often quite small. Therefore, EloqKV can utilize ten small EBS GP3 disks, each 30GB in size, to achieve over 600,000 QPS. Further details on this approach are discussed in the following experiment: scaling disks.

### Experiment II: Scaling Disks of WAL

Kvrocks does not support writing redo logs across multiple disks, so this experiment is conducted with **EloqKV** only. We benchmarked EloqKV with different numbers of WAL disks and varying thread counts using the following command:

```
memtier_benchmark -t $thread_num -c $client_num -s $server_ip -p $server_port --distinct-client-seed --ratio=1:0 --key-prefix="kv_" --key-minimum=1 --key-maximum=5000000 --random-data --data-size=128 --hide-histogram --test-time=300
```

- Thread Number (-t): Specifies the number of threads for parallel execution, which we have set to a fixed value of 80.
- Client Number (-c): Represents the number of clients per thread. We configured it to 40, 60 and 80 to evaluate different concurrency levels. In our experiment, this resulted in total concurrency values of 3200, 4800 and 6400, calculated as `thread_num` × `client_num`.

#### Results

Below are the results of the write-only workload, which illustrates **EloqKV**'s throughput and latency with different disk across varying thread numbers, simulating different levels of concurrent database access. The following graph shows how disk count impacts the performance of **EloqKV**.

X-axis: Represents the varying thread numbers employed during the benchmark, simulating different levels of concurrent database access.

Left Y-axis: Measures the QPS (Queries Per Second) in thousands (K).

Right Y-axis: Measures the average Latency in ms.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_scale_disk_set.png)
</div>
</p>

From the results above, we can observe that as the number of disks increases, the throughput scales nearly linearly when the disk count is 1, 2, and 4, with a corresponding decrease in latency. However, adding more disks continues to boost throughput, but at a much slower rate. For 6 and 8 disks, the throughput levels off and remains nearly the same under high concurrency. This indicates that the disk is no longer the bottleneck, and attention should shift to increasing CPU resources to further improve throughput, as illustrated in the next experiment.

### Experiment III: Scaling CPU

As observed in the experiment above, throughput does not increase further when the number of disks exceeds six. This indicates that the disk is no longer the bottleneck; to achieve higher throughput, scaling the CPU should be the next step. We run the same `memtier-benchmark` workload as in the disk scaling experiment.

#### Result

The following graph shows how the number of CPU cores affects the performance of **EloqKV**.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
![](img/eloqkv_scale_cpu_set.png)
</div>
</p>

As we can see, adding more disks beyond 8 on a 32-core CPU does not significantly increase throughput. However, by scaling the CPU from 32 to 48 cores, we can achieve a notable increase in throughput and a decrease in latency. Under heavy concurrency, latency decreases significantly from 10ms to under 8ms when more CPU cores are added. This demonstrates the advantage of **EloqKV**—the ability to scale the appropriate component when encountering a bottleneck.
