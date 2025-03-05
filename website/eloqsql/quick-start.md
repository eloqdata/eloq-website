---
title: 部署单节点实例
summary: 了解如何快速开始使用 EloqSQL 数据库。
---

# 使用 Eloqctl 部署单节点 EloqSQL 实例

`eloqctl` 是一个强大的工具，专为 EloqSQL 集群的运维而设计。通过 Eloqctl，您可以轻松管理日常数据库任务，如部署、启动、停止、升级和退役 EloqSQL 集群，以及配置集群参数。

`eloqctl` 支持部署各种类型的集群，包括 EloqSQL 事务集群、EloqSQL 日志集群、持久化存储集群（如 Cassandra）以及相关的监控系统。本文档提供了在单节点上部署 EloqSQL 集群的指导。

## 1. 先决条件

EloqSQL 兼容 Red Hat 9 和 Ubuntu 20.04、22.04 及 24.04。

请确保您已经查看了以下文档：

- [配置检查清单](./prerequisite)

## 2. 在控制机器上部署 eloqctl

1. 在这里获取您的 eloqctl 安装脚本：

- [Eloqctl 安装脚本](../downloadeloqctl)

2. 要安装 eloqctl，只需运行以下命令：

```
bash eloqctl_installer.sh
```

如果显示以下消息，则表示您已成功安装 `eloqctl`：

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16.6M  100 16.6M    0     0   203M      0 --:--:-- --:--:-- --:--:--  205M
/home/eloq/.bash_profile has been modified to add eloqctl to PATH
===============================================
To use it, open a new terminal or execute:
source /home/eloq/.bash_profile
===============================================
```

此命令将 eloqctl 安装在 $HOME/.eloqctl 目录中，集群元数据和下载的组件也存储在该目录中。

请运行 `source $HOME/.bash_profile` 将 `$HOME/.eloqctl` 添加到 PATH 环境变量中，这样您就可以直接使用 `eloqctl`。

安装完成后，您可以通过运行以下命令验证 `eloqctl` 版本：

```
eloqctl --version
```

## 3. 初始化集群拓扑文件

示例集群拓扑文件可以在 `.eloqctl/config/examples/` 目录中找到。

您可以选择 `eloqsql_cassandra.yaml` 来设置您的 EloqSQL 集群。

```
# 示例 yaml 文件
.eloqctl/config/examples/eloqsql_cassandra.yaml
```

通过运行 `vi eloqsql_cassandra.yaml` 打开配置文件查看其内容：

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
    tx_host_ports: [127.0.0.1:8000]
    client_port: 3316
  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - "/home/${USER}/eloqsql-cluster/wal_eloqsql"
    replica: 1
  storage_service:
    cassandra:
      host: [127.0.0.1]
      kind: !Internal
        mirror: "https://download.eloqdata.com"
        version: "4.1.3"
  monitor:
    data_dir: ""
    monograph_metrics:
      path: "/eloq_metrics"
      port: 18081
    prometheus:
      download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: "https://github.com/grafana/grafana/releases/download/v9.3.6/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
    mysql_exporter:
      url: "https://github.com/prometheus/mysqld_exporter/releases/download/v0.14.0/mysqld_exporter-0.14.0.linux-amd64.tar.gz"
      port: 9300
    cassandra_collector:
      mcac_agent: "https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
      mcac_port: 9103
```

### 配置文件参数说明

- **`cluster_name`**：  
  _类型_：`字符串`  
  _默认值_：`'eloqsql-cluster'`  
  正在部署的集群名称，作为集群的标识符。使用 `eloqctl`，您可以部署和管理多个集群，每个集群都由其唯一名称区分。

- **`product`**：  
  _类型_：`字符串`  
  _默认值_：`'EloqSQL'`  
  正在部署的产品名称，对于当前部署应设置为 `'EloqSQL'`。未来，`eloqctl` 将支持部署不同的数据库产品，如 `EloqSQL` 等。

- **`version`**：  
  _类型_：`字符串`  
  _默认值_：`'latest'`  
  指定要安装的 EloqSQL 版本。将其设置为 `'latest'` 可确保使用最新版本。

- **`install_dir`**：  
  _类型_：`字符串`  
  _默认值_：`'/home/${USER}'`  
  指定产品将安装的目录。`${USER}` 占位符动态引用当前用户的主目录。

- **`tx_service.tx_host_ports`**：  
  _类型_：`字符串列表`  
  _默认值_：`[127.0.0.1:6389]`  
  事务服务主机的 IP:PORT 地址列表。事务服务处理 MySQL 客户端请求，并与 MySQL 协议兼容。请注意，每个 IP 地址只能列出一次。

- **`tx_service.client_port`**：  
  _类型_：`整数`  
  _默认值_：`3316`  
  客户端应用于连接事务服务的端口。事务服务在此端口上监听传入的客户端连接，处理符合 MySQL 协议的请求。

<!-- Q? need this? -->

- **`tx_service.enable_cache_replacement`**：  
  _类型_：`布尔值`  
  _默认值_：`on`  
  是否可以从内存缓存中驱逐持久化的冷数据。如果设置为 false，所有数据都将缓存在内存中，如果内存已满，新数据插入将失败。在此模式下可以存储较少的数据，但所有请求都在内存中处理。如果设置为 false，冷数据将从内存中驱逐，以便新的写入请求可以成功。在此模式下可以存储更多数据，但缓存未命中的请求将导致磁盘读取。

- **`log_service.nodes`**：  
  _类型_：`复合类型`  
  指定日志服务主机。您可以配置从零到多个日志服务节点。将其设置为零表示预写日志（WAL）与事务服务耦合，在这种情况下，您应该完全删除 log_service 部分。如果您指定非零值，则日志服务与事务服务解耦，作为独立进程运行。根据您的需求，这可以部署在单独的集群中，也可以部署在与事务服务相同的集群中。

- **`log_service.nodes.host`**：  
  _类型_：`字符串`  
  _默认值_：`'127.0.0.1'`  
  每个日志服务进程运行的 IP 地址。

- **`log_service.nodes.port`**：  
  _类型_：`整数`  
  _默认值_：`9000`  
  每个日志服务进程监听的端口。

- **`log_service.nodes.data_dir`**：  
  _类型_：`字符串`  
  _默认值_：`['/home/${USER}/disk_wal_kv']`  
  每个日志服务进程存储其 WAL 日志的目录。您可以为日志服务指定单独的磁盘以提高写入吞吐量。

- **`log_service.replica`**：  
  _类型_：`整数`  
  _默认值_：`1`  
  日志服务的副本数量。值为 1 表示只有一个副本。为了高可用性，请将其设置为 3 或 5。请注意，日志服务节点的数量应大于副本数量。

`monitor` 部分包含为 EloqSQL 部署基于 Prometheus 和 Grafana 的监控系统的配置。监控是可选的；如果您不希望包含它，只需删除 monitor 部分。如果您选择启用监控，请设置 prometheus.host 和 grafana.host 字段以指定 Prometheus 和 Grafana 的位置，并保持其他字段不变。请注意，Prometheus 和 Grafana 不能与其他软件共享，因此您必须确保 Prometheus 和 Grafana 使用的端口不被其他进程占用。

- **`monitor.grafana.host`**：
  _类型_：`字符串`  
  _默认值_：`'127.0.0.1'`  
  grafana 服务运行的 IP 地址。

- **`monitor.grafana.port`**：
  _类型_：`整数`  
  _默认值_：`'3301'`  
  grafana 服务监听的端口。

- **`monitor.prometheus.host`**：
  _类型_：`字符串`  
  _默认值_：`'127.0.0.1'`  
  prometheus 服务运行的 IP 地址。

- **`monitor.prometheus.host`**：
  _类型_：`整数`  
  _默认值_：`'9500'`  
  prometheus 服务监听的端口。

## 4. 运行部署命令

修改完 `eloqsql_cassandra.yaml` 后，使用 `eloqctl launch` 命令配置 EloqSQL 集群

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqsql_cassandra.yaml -s
```

该命令将在指定的集群中安装 EloqSQL 组件。

如果您看到以下消息，则表示 EloqSQL 集群已成功配置：

```
Launch cluster finished, Enjoy!
Connect to server:
        LD_LIBRARY_PATH=/home/eloq/eloqsql-cluster/EloqSQL/lib:$LD_LIBRARY_PATH /home/eloq/eloqsql-cluster/EloqSQL/bin/mariadb --user=eloq -S /tmp/eloqsql3316.sock
Prometheus: http://127.0.0.1:9500
Grafana: http://127.0.0.1:3301
```

请随时使用 `/home/eloq/eloqsql-cluster/EloqSQL/bin/mariadb` 或任何其他 MariaDB/MySQL 客户端连接到 EloqSQL，并享受探索其功能的乐趣。
