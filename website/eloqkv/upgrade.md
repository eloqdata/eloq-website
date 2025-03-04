---
title: 使用 Eloqctl 升级
summary: 学习如何快速开始使用 EloqKV 数据库。
---

# 使用 Eloqctl 升级 EloqKV 集群

本文将说明如何使用 `eloqctl` 将 EloqKV 集群升级到新版本。

注意此升级过程仅适用于次要版本升级,即只需要替换二进制文件的情况。

## 获取集群名称

集群名称在配置文件中设置,默认集群名称为 `eloqkv-cluster`。你也可以使用以下命令查看集群名称:

```
eloqctl list
```

预期输出:

```
+----------------+---------+---------+---------+-------+
| name           | product | store   | version | user  |
+----------------+---------+---------+---------+-------+
| eloqkv-cluster | EloqKV  | rocksdb | 0.7.4   | rocky |
+----------------+---------+---------+---------+-------+
```

## 升级集群

使用 Eloqctl 进行次要版本升级:

```
eloqctl update ${cluster_name} ${version}
```

升级工具会首先停止集群,然后更新集群中所有节点的二进制文件,最后使用新的二进制文件启动集群。

## 升级 Cassandra

如果你使用 Cassandra 作为持久化存储引擎部署 EloqKV,你也可以使用 `eloqctl` 升级 Cassandra 集群。

```
eloqctl update ${cluster_name} --cassandra ${version}
```

升级工具会首先使用 `-a` 选项停止集群,然后升级 Cassandra,将数据目录从旧的 Cassandra 集群移动到新的 Cassandra 集群。最后重新启动 EloqKV 集群。
