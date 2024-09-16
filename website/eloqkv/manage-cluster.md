---
title: Manage Cluster Using Eloqctl
summary: Learn how to quickly get started with the EloqKV database.
---

# Manage Cluster Using Eloqctl

In this document, we will illustrate how to use `eloqctl` to manage EloqKV cluster.

Please ensure the cluster is already provisioned. For how to deploy EloqKV cluster, please refer to [Deploy Cluster](./quick-start).

## Check Cluster Status

Cluster name is set in the configuration file when you provision the cluster. The default cluser name is `eloqkv-cluster`. You can also check the cluster name using command below.

```
eloqctl list
```

The expected output will be:

```
+----------------+---------+---------+---------+-------+
| name           | product | store   | version | user  |
+----------------+---------+---------+---------+-------+
| eloqkv-cluster | EloqKV  | rocksdb | 0.7.4   | rocky |
+----------------+---------+---------+---------+-------+
```

Use the following command to query the cluster status:

```
eloqctl status ${cluster_name}
```

If you see `Success` in the output for every node , then the cluster runs normally.

## Start Cluster

Use the following

```
eloqctl start ${cluster_name}
```

## Stop Cluster

1. Graceful Shutdown. The following command will stop the transaction cluster and log cluster gracefully which means that all the data in memory will be flushed to persistent storage before the processes exit. In this case, the next launch of cluster is fast since there is no redo logs to be replayed.

```
eloqctl stop ${cluster_name}
```

2. Force Shutdown. You can also stop the cluster immediately by passing `-f` option. It actually send SIGKILL signal to all the transaction processes and log processes.

```
eloqctl stop ${cluster_name} -f
```

3. Stop Persistent Storage. When you deploy a decoupled persistent storage, i.e. Cassandra, the Cassandra cluster will not be stopped automatically by `eloqctl stop`. You should pass `-a` option to tell `eloqctl` to stop every components except monitor.

```
eloqctl stop ${cluster_name} -a
```

4. Stop Monitor. Prometheus and grafana will be stopped by the following command:

```
eloqctl monitor ${cluster_name} stop
```

## Update Cluster Configuration

EloqKV offers various configurations, some of which enable features. For example, `enable_data_store` activates persistent data storage, and `enable_wal` enables the Write-Ahead Log for durability. Other configurations are performance-related, such as `core_number` for specifying the number of worker threads, and `node_memory_limit_mb` to set the memory limit.

You can easily adjust these settings using eloqctl. The process is as follows:

1. Edit the configuration file located at `$HOME/.eloqctl/config/EloqKv.ini`. In the example below, core_number is set to 8, and both the persistent data store and Write-Ahead Log are enabled."

```
[local]
path=data
ip=${OVERRIDE}
port=${OVERRIDE}
core_number=8
enable_data_store=on
enable_wal=on
[cluster]
[store]
[metrics]
enable_metrics=${OVERRIDE}
```

2. Use `eloqctl update-conf` to update the configuration file across the cluster and restart it with a single command.

```
eloqctl update-conf ${cluster_name} --restart
```

## Scale Cluster

Cluster expansion and shrinkage using `eloqctl` will be available soon!
