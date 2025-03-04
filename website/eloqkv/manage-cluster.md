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

预期输出将是:

```
+----------------+---------+---------+---------+-------+
| name           | product | store   | version | user  |
+----------------+---------+---------+---------+-------+
| eloqkv-cluster | EloqKV  | rocksdb | 0.7.4   | rocky |
+----------------+---------+---------+---------+-------+
```

## 启动和停止集群

使用以下命令启动集群:

```
eloqctl start ${cluster_name}
```

使用以下命令停止集群:

```
eloqctl stop ${cluster_name} --password xxxxx
```

## 更新集群配置

EloqKV 提供了各种配置选项,其中一些用于启用功能。例如,`enable_data_store` 激活持久化数据存储,`enable_wal` 启用预写日志以实现持久性。其他配置与性能相关,如 `core_number` 用于指定工作线程数,`node_memory_limit_mb` 用于设置内存限制。

你可以使用 eloqctl 轻松调整这些设置。过程如下:

1. 编辑位于 `$HOME/.eloqctl/upload/${cluster_name}/EloqKv.ini` 的配置文件。在下面的示例中,core_number 设置为 8,并启用了持久化数据存储和预写日志。

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

2. 使用 `eloqctl update-conf` 在集群中更新配置文件并用一个命令重启它。

```
eloqctl update-conf ${cluster_name} --restart
```

## 扩展集群

使用 `eloqctl` 进行集群扩容和缩容的功能即将推出!
