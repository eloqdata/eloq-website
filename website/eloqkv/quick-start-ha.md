---
title: 在共享存储上部署高可用集群
summary: 学习如何快速开始使用 EloqKV 数据库。
---

# 使用 Eloqctl 部署高可用集群

在[之前的文档](./quick-start)中,我们介绍了如何使用 `eloqctl` 部署单节点 EloqKV 集群。在本文档中,我们将重点介绍如何部署高可用集群。

## 1. 前置条件

请确保你已经阅读以下文档:

- [配置检查清单](./prerequisite)

## 2. 在控制机器上部署 Eloqctl

有关分步指导,请查看之前的文档:

- [部署单节点集群](./quick-start)

## 3. 启用持久化数据存储和 WAL 以实现持久性

模板 EloqKV 配置文件 `EloqKv.ini` 可以在 `.eloqctl/config/` 目录中找到。

要部署高可用集群,你需要首先在 `EloqKv.ini` 中启用持久化数据存储和 WAL 功能。

```
# 设置为 `on` 以启用持久化存储
enable_data_store=on
# 设置为 `on` 以启用 WAL
enable_wal=on
```

## 4. 初始化集群拓扑文件

示例集群拓扑文件可以在 `.eloqctl/config/examples/` 目录中找到。

要部署高可用集群,使用 `eloqkv_cassandra.yaml` 作为默认配置模板。

```
# 示例 yaml 文件
.eloqctl/config/examples/eloqkv_cassandra.yaml
```

要启用高可用性,编辑 `eloqkv_cassandra.yaml` 文件。高可用性通过两个关键配置实现:

1. 日志集群必须是分布式的且有副本
2. Cassandra 集群必须是分布式的且有副本

```yaml
connection:
  username: '${USER}'
  auth_type: 'keypair'
  auth:
    keypair: '/home/${USER}/.ssh/id_rsa'
deployment:
  cluster_name: 'eloqkv-cluster'
  product: 'EloqKV'
  version: 'latest'
  install_dir: '/home/${USER}'
  tx_service:
    tx_host_ports: [10.0.0.1:6379, 10.0.0.2:6379, 10.0.0.3:6379]
  log_service:
    nodes:
      - host: 10.0.0.1
        port: 9000
        data_dir:
          - '/home/${USER}/eloqkv-cluster/wal_eloqkv'
      - host: 10.0.0.2
        port: 9000
        data_dir:
          - '/home/${USER}/eloqkv-cluster/wal_eloqkv'
      - host: 10.0.0.3
        port: 9000
        data_dir:
          - '/home/${USER}/eloqkv-cluster/wal_eloqkv'
    replica: 3
  storage_service:
    cassandra:
      host: [10.0.0.4, 10.0.0.5, 10.0.0.6]
      kind: !Internal
        mirror: 'https://download.eloqdata.com'
        version: '4.1.3'
  monitor:
    data_dir: ''
    monograph_metrics:
      path: '/mono_metrics'
      port: 18081
    prometheus:
      download_url: 'https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz'
      port: 9500
      host: 10.0.0.7
    grafana:
      download_url: 'https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz'
      port: 3301
      host: 10.0.0.7
    node_exporter:
      url: 'https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz'
      port: 9200
    cassandra_collector:
      mcac_agent: 'https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz'
      mcac_port: 9103
```

关于 YAML 文件中每个配置选项的详细解释,请参考之前的文档[部署单节点集群](./quick-start)。在本文档中,我们将重点关注高可用性方面的配置。

- \*\*`tx_service.tx_host_ports`
