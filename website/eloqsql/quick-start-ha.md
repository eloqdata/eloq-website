---
title: 在共享存储上部署高可用集群
summary: 了解如何快速开始使用 EloqSQL 数据库。
---

# 使用 Eloqctl 部署高可用集群

[之前](./quick-start)，我们介绍了如何使用 `eloqctl` 部署单节点 EloqSQL 集群。在本文档中，我们将重点介绍如何部署高可用集群。

## 1. 先决条件

请确保您已经查看了以下文档：

- [配置检查清单](./prerequisite)

## 2. 在控制机器上部署 Eloqctl

有关分步指导，请查看之前的文档：

- [部署单节点集群](./quick-start)

## 3. 初始化集群拓扑文件

示例集群拓扑文件可以在 `.eloqctl/config/examples/` 目录中找到。

要部署高可用集群，请使用 `eloqsql_cassandra.yaml` 作为默认配置模板。

```
# 示例 yaml 文件
.eloqctl/config/examples/eloqsql_cassandra.yaml
```

要启用高可用性，请编辑 `eloqsql_cassandra.yaml` 文件。高可用性通过两个关键配置实现：

1. 日志集群必须分布式且有副本。
2. Cassandra 集群必须分布式且有副本。

```
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"
deployment:
  cluster_name: "eloqsql-cluster"
  product: "EloqSQL"
  version: "latest"
  install_dir: "/home/${USER}"
  tx_service:
    tx_host_ports: [10.0.0.1:6379, 10.0.0.2:6379, 10.0.0.3:6379]
  log_service:
    nodes:
      - host: 10.0.0.1
        port: 9000
        data_dir:
          - "/home/${USER}/eloqsql-cluster/wal_EloqSql"
      - host: 10.0.0.2
        port: 9000
        data_dir:
          - "/home/${USER}/eloqsql-cluster/wal_EloqSql"
      - host: 10.0.0.3
        port: 9000
        data_dir:
          - "/home/${USER}/eloqsql-cluster/wal_EloqSql"
    replica: 3
  storage_service:
    cassandra:
      host: [10.0.0.4, 10.0.0.5, 10.0.0.6]
      kind: !Internal
        mirror: "https://download.eloqdata.com"
        version: "4.1.3"
  monitor:
    data_dir: ""
    monograph_metrics:
      path: "/mono_metrics"
      port: 18081
    prometheus:
      download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 10.0.0.7
    grafana:
      download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 10.0.0.7
    node_exporter:
      url: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
    cassandra_collector:
      mcac_agent: "https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
      mcac_port: 9103
```

有关 YAML 文件中每个配置选项的详细说明，请参阅之前的文档 [部署单节点集群](./quick-start)。在本文档中，我们将特别关注配置文件的高可用性方面。

- **`tx_service.tx_host_ports`**：  
  _类型_：`字符串列表`  
  事务集群部署在三个节点上：10.0.0.1:6379、10.0.0.2:6379 和 10.0.0.3:6379。数据在这些节点之间进行分片，每个节点负责一部分数据。如果一个节点发生故障，剩余节点将接管故障节点的数据，并继续无缝地为客户端请求提供服务。

- **`log_service.nodes`**：  
  _类型_：`复合类型`  
  在这里，我们为日志服务集群指定了三个节点，它们与事务集群位于同一位置。或者，如果您愿意，也可以将日志服务部署在单独的机器上。

- **`log_service.replica`**：  
  _类型_：`整数`  
  将日志服务的副本数量设置为 3。这确保每个 WAL 日志记录都会在三个日志节点上复制。通过这种设置，即使在节点故障或磁盘崩溃的情况下，日志也会被保留。

- **`storage_service.cassandra.host`**：  
  _类型_：`字符串列表`  
  当使用 Cassandra 作为持久化存储引擎部署 EloqSQL 时，计算和存储组件是完全解耦的。在本例中，Cassandra 部署在三台单独的机器上：
  10.0.0.4、10.0.0.5 和 10.0.0.6。

- **`monitor`**  
  Prometheus 和 Grafana 安装在 10.0.0.7 的单独主机上。

## 5. 运行部署命令

修改完 `eloqsql_cassandra.yaml` 后，使用 `eloqctl launch` 命令配置 EloqSQL 集群

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqsql_cassandra.yaml -s
```

该命令将在指定的集群中安装 EloqSQL 组件。

如果您看到以下消息，则表示 EloqSQL 集群已成功配置：

```
Launch cluster finished, Enjoy!
```

请随时使用 `/home/eloq/eloqsql-cluster/EloqSQL/bin/mariadb` 或任何其他 MariaDB/MySQL 客户端连接到 EloqSQL，并享受探索其功能的乐趣。
