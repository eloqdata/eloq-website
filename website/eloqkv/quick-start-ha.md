---
title: 部署高可用集群
summary: 学习如何部署高可用 EloqKV 集群。
---

# 部署高可用集群

在[之前的文档](./quick-start)中,我们介绍了如何使用 `eloqctl` 部署单节点 EloqKV 集群。在本文档中,我们将重点介绍如何部署高可用集群。

## 1. 前置条件

请确保你已经阅读以下文档:

- [配置检查清单](./prerequisite)

## 2. 在控制机器上部署 eloqctl

1. 在这里获取 eloqctl 安装脚本:

- [Eloqctl 安装脚本](../downloadeloqctl)

2. 要安装 eloqctl,只需运行以下命令:

```
bash eloqctl_installer.sh
```

如果显示以下消息,则表示你已成功安装 `eloqctl`:

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

该命令将 eloqctl 安装在 $HOME/.eloqctl 目录中,集群元数据和下载的组件也存储在该目录中。

请运行 `source $HOME/.bash_profile` 将 `$HOME/.eloqctl` 添加到 PATH 环境变量中,这样你就可以直接使用 `eloqctl`。

安装完成后,你可以通过运行以下命令验证 `eloqctl` 版本:

```
eloqctl --version
```

## 3. 初始化集群拓扑文件

示例集群拓扑文件可以在 `.eloqctl/config/examples/` 目录中找到。

要部署高可用集群,使用 `eloqkv_cassandra.yaml` 作为默认配置模板。

```
# 示例 yaml 文件
.eloqctl/config/examples/eloqkv_cassandra.yaml
```

要启用高可用性,编辑 `eloqkv_cassandra.yaml` 文件。在不同机器之间设置事务服务器、日志服务器和 Cassandra 存储。

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

- **`tx_service.tx_host_ports`**:  
  _类型_: `字符串列表`  
  事务服务器列表。每个事务服务器处理客户端请求并维护内存中的数据。事务服务器之间用 `,` 分隔。

- **`log_service.nodes`**:  
  _类型_: `复合类型`  
  日志服务器列表。每个日志服务器负责持久化数据更改。日志服务器可以部署在与事务服务器相同或不同的机器上。

- **`log_service.nodes.host`**:  
  _类型_: `字符串`  
  日志服务器的 IP 地址。

- **`log_service.nodes.port`**:  
  _类型_: `整数`  
  日志服务器的监听端口。

- **`log_service.nodes.data_dir`**:  
  _类型_: `字符串列表`  
  日志服务器存储 WAL 日志的目录。你可以为日志服务器指定单独的磁盘以提高写入吞吐量。

- **`log_service.replica`**:  
  _类型_: `整数`  
  日志副本数。设置为 3 或更高以启用高可用性。

- **`storage_service.cassandra.host`**:  
  _类型_: `字符串列表`  
  当使用 Cassandra 作为持久化存储引擎时,计算和存储组件是完全解耦的。在本例中,Cassandra 部署在三台独立的机器上:
  10.0.0.4、10.0.0.5 和 10.0.0.6。

- **`monitor`**  
  Prometheus 和 grafana 安装在单独的主机 10.0.0.7 上。

## 4. 运行部署命令

修改完 `eloqkv_cassandra.yaml` 后,使用 `eloqctl launch` 命令配置 EloqKV 集群:

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_cassandra.yaml -s
```

该命令将在指定的集群中安装 EloqKV 组件。

如果你看到以下消息,则表示 EloqKV 集群已成功配置:

```
Launch cluster finished, Enjoy!
```

现在你可以使用 `eloqkv-cli` 或任何其他 Redis 客户端连接到 EloqKV 并开始探索其功能。
