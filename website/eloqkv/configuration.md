---
title: Server Configuration
---

EloqKV offers configuration variables that can be adjusted to meet your specific requirements. You have two options for tuning these variables:

1. Command Line Arguments: For example, ./bin/eloqkv --core_number=3.
2. Configuration File: Specify the configuration file using --config=path_to_config_file.

Please note that command line arguments will override values specified in the configuration file. If a value is not set through either method, the default value will be applied.

Below is a detailed description of each configuration variable:

## `bind_all`
- Description: Whether listen on all interfaces. If `bind_all` is enabled EloqDoc will listen on `0.0.0.0`, otherwise it will listen on the address specified by `ip`.
- Category: [local]
- Commandline: --bind_all=true|false
- Scope: Global
- Data Type: Boolean
- Default Value: "false"

### `ip`

- Description: Local IP address of the EloqKV node. This value is recorded in the EloqKV catalog and cannot be changed once the server has been launched. It is strongly recommended to set this to the actual IP address of the node, rather than the default `127.0.0.1`, which will prevent external nodes from accessing this EloqKV instance. If you mistakenly set it to `127.0.0.1` and need to change it to the correct IP, you must clear the raft data directory and the associated persistent storage, such as RocksDB. Check `path` and `rocksdb_storage_path` parameters to obtain the location of raft data and RocksDB.
- Category: [local]
- Commandline: --ip=value
- Scope: Global
- Data Type: String
- Default Value: 127.0.0.1

### `port`

- Description: Listening port for the EloqKV node. Similar to the `ip` parameter, the `port` cannot be changed once the server has been launched.
- Category: [local]
- Commandline: --port=value
- Scope: Global
- Data Type: Integer
- Default Value: 6379

### `path`

- Description: The directory for storing Raft data, which contains two subdirectories:  
  **cc_ng:** Stores Raft logs for the tx_service cluster.  
  **tx_log:** Stores Raft logs for the redo log_service cluster.
- Category: [local]
- Commandline: --path=value
- Scope: Global
- Data Type: String
- Default Value: redis_raft_data

### `core_number`

- Description: Number of worker threads for an EloqKV node. EloqKV uses a one-thread-per-core model with coroutines for handling concurrency. The core_number represents the actual number of worker threads, which typically run in a busy loop to fetch and execute tasks.  
  Since worker threads operate in a busy loop, the number of threads should not exceed the number of CPU cores. A recommended setting is 80% of the available CPU cores in a CPU-intensive mode.  
  **If using local persistent storage like RocksDB:** Set core_number to 70% of CPU cores.  
  **If WAL (Write-Ahead Logging) is enabled:** Reserve 2 cores for each log instance.  
  These recommendations help optimize performance based on your workload and storage configuration.
- Category: [local]
- Commandline: --core_number=value
- Scope: Global
- Data Type: Integer
- Default Value: CPU_CORE_NUM \* 80%

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

- Description: Option to enable heap defragmentation when using the mimalloc allocator. Enabling this feature helps optimize memory usage by reducing fragmentation within the heap, potentially reducing memory overhead.
- Category: [local]
- Scope: Global
- Data Type: Boolean
- Default Value: false

### `enable_cache_replacement`

- Description: Option to allow evicting persisted data when memory is full. Enabling this feature allows EloqKV to store more data, but will lead to performance degradation when a cache miss happens. If this option is disabled, less data can be stored since all data must fit in memory.
- Category: [local]
- Scope: Global
- Data Type: Boolean
- Default Value: true

### `txn_isolation_level`

- Description: Isolation level of MULTI/EXEC transactions. You can set it to `RepeatableRead` or `ReadCommitted`.
- Category: [local]
- Scope: Global
- Data Type: String
- Default Value: RepeatableRead

### Log Configuration

EloqKV uses GLOG to manage logging with various log levels. You can modify GLOG's behavior by exporting environment variables prefixed with GLOG\_. For more information, refer to the [GLOG FLAGS documentation](https://github.com/google/glog/blob/master/docs/flags.md).

Here are two commonly used environment variables:

1. GLOG_log_dir: Specifies the directory where log files are stored.
2. GLOG_max_log_size: Defines the maximum size (in MB) for each log file.
