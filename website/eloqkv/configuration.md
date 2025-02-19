---
title: 服务器配置
---

EloqKV 提供了可以根据你的具体需求调整的配置变量。你有两种方式来调整这些变量：

1. 命令行参数：例如，./bin/eloqkv --core_number=3。
2. 配置文件：使用 --config=path_to_config_file 指定配置文件。

请注意，命令行参数会覆盖配置文件中指定的值。如果某个值没有通过这两种方式设置，将使用默认值。

以下是每个配置变量的详细说明：

### `ip`

- 描述：EloqKV 节点的本地 IP 地址。此值记录在 EloqKV 目录中，一旦服务器启动就不能更改。强烈建议将其设置为节点的实际 IP 地址，而不是默认的 `127.0.0.1`，后者会阻止外部节点访问此 EloqKV 实例。如果你错误地将其设置为 `127.0.0.1` 并需要更改为正确的 IP，你必须清除 raft 数据目录和相关的持久化存储，如 RocksDB。查看 `path` 和 `rocksdb_storage_path` 参数以获取 raft 数据和 RocksDB 的位置。
- 类别：[local]
- 命令行：--ip=value
- 作用域：全局
- 数据类型：字符串
- 默认值：127.0.0.1

### `port`

- 描述：EloqKV 节点的监听端口。与 `ip` 参数类似，`port` 一旦服务器启动就不能更改。
- 类别：[local]
- 命令行：--port=value
- 作用域：全局
- 数据类型：整数
- 默认值：6379

### `path`

- 描述：存储 Raft 数据的目录，包含两个子目录：  
  **cc_ng:** 存储 tx_service 集群的 Raft 日志。  
  **log_ng:** 存储 log_service 集群的 Raft 日志。
- 类别：[local]
- 命令行：--path=value
- 作用域：全局
- 数据类型：字符串
- 默认值：data

### `core_number`

- 描述：用于处理客户端请求的工作线程数。建议将其设置为 CPU 核心数的一半。
- 类别：[local]
- 命令行：--core_number=value
- 作用域：全局
- 数据类型：整数
- 默认值：1

### `event_dispatcher_num`

- Description: The number of I/O event dispatcher threads. This setting impacts the latency when processing a large volume of client requests. To maintain low latency under heavy workloads, it is recommended to set this value to `core_number/7`.
- Commandline: --event_dispatcher_num=value
- Scope: Global
- Data Type: Integet
- Default Value: `core_number/7`

### `node_memory_limit_mb`

- Description: Sets the memory upper limit for an EloqKV node, measured in megabytes (MB).  
  **In pure memory mode:** When the memory limit is reached, entries are evicted from memory based on the Least Recently Used (LRU) policy.  
  **In persistent storage mode:** Entries are periodically flushed to persistent storage. Once flushed, these entries can be evicted from memory, also based on the LRU policy.  
  Please note that node_memory_limit_mb is calculated based on allocated memory, and the actual committed memory may exceed this limit. Therefore, it is recommended to set node_memory_limit_mb to 60% of the total system memory.
- Category: [local]
- Commandline: --node_memory_limit_mb=value
- Scope: Global
- Data Type: Integer
- Default Value: 8192

### `checkpoint_interval`

- Description: Checkpoint interval in seconds. The tx_service periodically flushes modified data from memory to persistent storage, and this interval determines how frequently checkpoints occur.  
  **A shorter interval** results in more frequent flushing, reducing recovery time in case of failure.  
  **A longer interval** decreases the amount of data written to persistent storage during heavy update scenarios, as only the most recent value of a key is flushed.  
  When used in conjunction with the WAL log service, EloqKV ensures no data loss, regardless of the checkpoint interval.
- Category: [local]
- Commandline: --checkpoint_interval=value
- Scope: Global
- Data Type: Integer
- Default Value: 10

### `enable_data_store`

- Description: Set it to false/off to turn off persistent storage. Set it to true/on to turn on persistent storage. When enabled, data in memory will be periodically flushed to persistent storage by checkpointer.
- Category: [cluster]
- Commandline: --enable_data_store=true|false
- Scope: Global
- Data Type: Boolean
- Default Value: "false"

### `enable_wal`

- Description: Set it to false/off to turn off WAL. Set it to true/on to turn on WAL. When enabled, new data is first written to the log server before updating memory, ensuring durability.
- Category: [cluster]
- Commandline: --enable_wal=true|false
- Scope: Global
- Data Type: Boolean
- Default Value: "false"

### `ip_port_list`

- Description: Describe the EloqKV tx_service cluster topology. The `ip_port_list` should include all EloqKV nodes, with each entry formatted as `ip:port` and separated by commas. For a single-node deployment, set this to match the `ip:port` specified in the [local] section.
- Category: [cluster]
- Commandline: --ip_port_list=value
- Scope: Global
- Data Type: String
- Default Value: ""

### `auto_redirect`

- Description: Indicator to automatically redirect requests to a remote node if the key is not found locally.
- Category: [cluster]
- Commandline: --auto_redirect=value
- Scope: Global
- Data Type: Boolean
- Default Value: "true"

### `rocksdb_storage_path`

- Description: The directory where RocksDB stores its data when used as the persistent storage engine. For improved performance during checkpoints and cache miss reads, RocksDB can be configured to store data on a separate disk."
- Category: [store]
- Commandline: --rocksdb_storage_path=value
- Scope: Global
- Data Type: String
- Default Value: rocksdb_data

### `requirepass`

- Description: The `requirepass` setting is used to enforce authentication. When enabled, EloqKV will not process any commands from clients that are not authenticated. `requirepass` is only supported in config file.
- Category: [local]
- Scope: Global
- Data Type: String
- Default Value: Empty

### `txlog_service_list`

- Description: Redo Log group servers configuration when deploying log servers seaprately. The `txlog_service_list` should include all the redo log groups, with each entry formatted as `ip:port` and separated by commas.
- Category: [local]
- Scope: Global
- Data Type: String
- Default Value: Empty

### `txlog_group_replica_num`

- Description: Number of replicas for a redo log group. The default value is 1, indicating no high availability (HA) support. To enable HA, set this value to 3 or higher.
- Category: [local]
- Scope: Global
- Data Type: Integer
- Default Value: 1

### `enable_heap_defragment`

- 描述：使用 mimalloc 分配器时是否启用堆碎片整理。启用此功能有助于通过减少堆内的碎片来优化内存使用，可能减少内存开销。
- 类别：[local]
- 作用域：全局
- 数据类型：布尔值
- 默认值：false

### `enable_cache_replacement`

- 描述：是否允许在内存已满时驱逐已持久化的数据。启用此功能允许 EloqKV 存储更多数据，但当缓存未命中时会导致性能下降。如果禁用此选项，由于所有数据都必须适合内存，可以存储的数据会更少。
- 类别：[local]
- 作用域：全局
- 数据类型：布尔值
- 默认值：true

### `txn_isolation_level`

- 描述：MULTI/EXEC 事务的隔离级别。你可以设置为 `RepeatableRead` 或 `ReadCommitted`。
- 类别：[local]
- 作用域：全局
- 数据类型：字符串
- 默认值：RepeatableRead

### 日志配置

EloqKV 使用 GLOG 来管理具有各种日志级别的日志。你可以通过导出以 GLOG\_ 为前缀的环境变量来修改 GLOG 的行为。更多信息，请参考 [GLOG FLAGS 文档](https://github.com/google/glog/blob/master/docs/flags.md)。

以下是两个常用的环境变量：

1. GLOG_log_dir：指定存储日志文件的目录。
2. GLOG_max_log_size：定义每个日志文件的最大大小(以 MB 为单位)。
