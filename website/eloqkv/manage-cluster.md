---
title: 使用 Eloqctl 管理集群
summary: 学习如何快速开始使用 EloqKV 数据库。
---

# 使用 Eloqctl 管理集群

本文档将说明如何使用 `eloqctl` 管理 EloqKV 集群。

请确保集群已经配置完成。关于如何部署 EloqKV 集群,请参考[部署集群](./quick-start)。

## 检查集群状态

集群名称在配置集群时在配置文件中设置。默认集群名称是 `eloqkv-cluster`。你也可以使用以下命令查看集群名称。

```
eloqctl list
```

预期输出将是:

```
+----------------+---------+---------+---------+-------+
| name           | product | store   | version | user  |
+----------------+---------+---------+---------+-------+
| eloqkv-cluster | EloqKV  | rocksdb | 0.7.4   | rocky |
+----------------+---------+---------+---------+-------+
```

使用以下命令查询集群状态:

```
eloqctl status ${cluster_name}
```

如果你在每个节点的输出中都看到`Success`，那么集群运行正常。

## 启动集群

使用以下命令启动集群:

```
eloqctl start ${cluster_name}
```

使用以下命令启动特定的节点:

```
eloqctl start --nodes node1_ip:node1_port,node2_ip:node2_port ${cluster_name}
```

## 停止集群

1. 正常关闭（Graceful Shutdown）：以下命令将正常地停止事务集群和日志集群，这意味着内存中的所有数据都会在进程退出前刷新到持久化存储中。这样一来，下次启动集群的速度会很快，因为不需要重放重做日志（redo logs）。

```
eloqctl stop ${cluster_name}
```

2. 强制关闭（Force Shutdown）：你也可以通过添加 -f 选项来立即停止集群。该命令实际上会向所有事务进程和日志进程发送 SIGKILL 信号。

```
eloqctl stop ${cluster_name} -f
```

3. 停止持久化存储（Stop Persistent Storage）：当你部署了解耦的持久化存储（如 Cassandra）时，执行 eloqctl stop 并不会自动停止 Cassandra 集群。你需要添加 -a 选项，告诉 eloqctl 停止除监控组件外的所有组件。

```
eloqctl stop ${cluster_name} -a
```

4. 停止监控（Stop Monitor）：可以通过以下命令停止 Prometheus 和 Grafana

```
eloqctl monitor stop ${cluster_name}
```

5. 如果集群部署时设置了密码，以上所有命令都需要添加 `--password` 选项。

```
eloqctl stop ${cluster_name} --password xxxxx
```

## 更新集群配置

EloqKV 提供了各种配置选项,其中一些用于启用功能。例如,`enable_data_store` 激活持久化数据存储,`enable_wal` 启用预写日志以实现持久性。其他配置与性能相关,如 `core_number` 用于指定工作线程数,`node_memory_limit_mb` 用于设置内存限制。

你可以使用 eloqctl 轻松调整这些设置。过程如下:

1. 编辑位于 `$HOME/.eloqctl/upload/${cluster_name}/EloqKv.ini` 的配置文件。在下面的示例中,core_number 设置为 8,并启用了持久化数据存储和预写日志。
1. 编辑配置文件 `$HOME/.eloqctl/upload/${cluster_name}/{node_ip}/EloqKv-tx-{port}.ini` 以更新对应节点的配置。在下面的示例中，将 `core_number` 设置为 8，同时启用了持久化数据存储和预写日志（Write-Ahead Log）。

```
[local]
path=data
ip=127.0.0.1
port=6379
core_number=8
enable_data_store=on
enable_wal=on
[cluster]
[store]
[metrics]
enable_metrics=on
```

2. 使用 `eloqctl update-conf` 在集群中更新配置文件并用一个命令重启它。

```
eloqctl update-conf ${cluster_name} --restart
```

## 扩展集群

使用 `eloqctl` 进行集群扩容和缩容的功能即将推出!
