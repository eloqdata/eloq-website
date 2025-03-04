---
title: EloqSQL 集群部署指南
summary: 了解如何部署和使用 EloqSQL 集群
---

# EloqSQL 集群部署指南

本文档描述如何在多个 Linux 服务器上快速部署 EloqSQL 集群。

### 部署准备

确保满足以下要求：

- 推荐的计算节点和存储节点硬件配置为 32+ 物理 CPU，64GB+ 内存。日志节点硬件配置为 4+ 物理 CPU，16GB+ 内存和 3 块 SSD 磁盘。日志节点可以与计算节点一起部署。

- 推荐操作系统版本：Ubuntu 20.04。支持的版本：CentOS 7，CentOS Stream 8。

- Linux 系统需要能够访问互联网，这是下载 EloqSQL 及其相关依赖项所必需的。

对于 EloqSQL 集群拓扑，您可以通过更改 YAML 文件来按需配置所需的集群数量。在本次部署中，集群拓扑如下表所示。

> **注意**
> 以下实例的 IP 地址仅作为示例 IP。在实际部署中，您需要将 IP 替换为您的实际 IP。不要使用 localhost 这样的主机名，请使用 127.0.0.1 代替。

| 实例            | 数量 | IP       |
| :-------------- | :--- | :------- |
| tx_service      | 1    | 10.0.1.1 |
| log_service     | 1    | 10.0.1.2 |
| storage_service | 1    | 10.0.1.3 |
| monitor         | 1    | 10.0.1.3 |

1. 环境配置
   每台机器都需要完成系统环境的基本配置。具体配置步骤，请参考[单节点 Eloq 部署环境配置](./quick-start.md)
2. 集群网络配置
   需要确保集群中的每台服务器都可以通过 ssh 访问其他服务器。具体配置步骤，请参考[单节点 Eloq 部署网络配置](./quick-start.md)

### 部署实施

`Eloq_waiter` 工具可以通过修改部署 YAML 文件中的参数来实现在多个服务器上的安装和部署。有关 `Eloq_waiter` 的详细信息，请参考[单节点 Eloq 部署网络配置](./quick-start.md)

- 创建并启动集群
  根据以下配置模板，按需编辑配置文件 deployment.yaml，其中：

  - `install_dir`：设置为用户希望安装集群的存储位置。
  - `log_service`：配置日志服务节点。您可以为每个磁盘部署单独的日志服务器。
  - `tx_service`：配置事务服务节点。
  - `storage_service`：配置 kv 存储节点。目前我们支持 Apache Cassandra。
  - `monitor`：配置 prometheus 和 grafana 监控堆栈。
    配置模板如下：

```yaml
connection:
  username: '$USER'
  auth_type: 'keypair'
  auth:
    keypair: '/home/$USER/.ssh/id_rsa'
deployment:
  cluster_name: 'eloqsql-cluster'
  product: 'EloqSQL'
  version: 'latest'
  install_dir: '/home/$USER/eloq'
  log_service:
    nodes:
      - host: 10.0.1.2
        port: 9000
        data_dir:
          - '/data1/eloq/disk_wal_sql'
      - host: 10.0.1.2
        port: 9001
        data_dir:
          - '/data2/eloq/disk_wal_sql'
    replica: 1
  tx_service:
    host: [10.0.1.1]
    port: 8000
    client_port: 3316
  storage_service:
    cassandra:
      host: [10.0.1.3]
      kind: !Internal
        download_url: 'https://d143xau9fe26d8.cloudfront.net/others/apache-cassandra-4.1.3-bin.tar.gz'
        storage_cluster: 'eloqsql-cluster'
  monitor:
    data_dir: ''
    monograph_metrics:
      path: '/mono_metrics'
      port: 18081
    prometheus:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/prometheus-2.42.0.linux-amd64.tar.gz'
      port: 9500
      host: 10.0.1.3
    grafana:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/grafana-9.3.6.linux-amd64.tar.gz'
      port: 3301
      host: 10.0.1.3
    node_exporter:
      url: 'https://d143xau9fe26d8.cloudfront.net/others/node_exporter-1.5.0.linux-amd64.tar.gz'
      port: 9200
    mysql_exporter:
      url: 'https://d143xau9fe26d8.cloudfront.net/others/mysqld_exporter-0.14.0.linux-amd64.tar.gz'
      port: 9300
    cassandra_collector:
      mcac_agent: 'https://d143xau9fe26d8.cloudfront.net/others/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz'
      mcac_port: 9103
```

> **注意：**
> 上述 deployment.yaml 文件是默认配置文件，用户可以根据需要配置要安装的软件。对于不需要安装的软件，只需从配置文件中删除即可。

- 启动集群

  ```shell
  cluster_mgr launch .eloqwaiter/config/examples/eloqsql_cassandra.yaml
  ```
