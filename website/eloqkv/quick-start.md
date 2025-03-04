---
title: 部署单节点实例
summary: 学习如何快速开始使用 EloqKV 数据库。
---

# 使用 Eloqctl 部署单节点 EloqKV 实例

`eloqctl` 是一个为 EloqKV 集群运维设计的强大工具。通过 Eloqctl,你可以轻松管理日常数据库任务,如部署、启动、停止、升级和下线 EloqKV 集群,以及配置集群参数。

`eloqctl` 支持部署各种类型的集群,包括 EloqKV 事务集群、EloqKV 日志集群、持久化存储集群(如 Cassandra)以及相关的监控系统。本文档提供在单个节点上部署 EloqKV 集群的指导。

## 1. 前置条件

EloqKV 兼容 Red Hat 8/9 和 Ubuntu 20.04、22.04 及 24.04。

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

你可以选择 `eloqkv_rocksdb.yaml` 或 `eloqkv_cassandra.yaml` 来设置 EloqKV 集群。关于 RocksDB 和 Cassandra 存储引擎的详细比较,请参考 [EloqKV 简介](./introduction)。在下面的示例中,我们将演示如何使用 RocksDB 设置集群拓扑文件。

```
# 示例 yaml 文件
.eloqctl/config/examples/eloqkv_rocksdb.yaml
```

运行 `vi eloqkv_rocksdb.yaml` 打开配置文件查看其内容:

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
    tx_host_ports: [127.0.0.1:6389]
    enable_cache_replacement: on
  # If you want to write wal log in your cluster, uncomment log_service section
  #log_service:
  #  nodes:
  #    - host: 127.0.0.1
  #      port: 9000
  #      data_dir:
  #        - "/home/${USER}/eloqkv-cluster/wal_eloqkv"
  #  replica: 1
  storage_service:
    rocksdb: Local
  monitor:
    data_dir: ''
    monograph_metrics:
      path: '/mono_metrics'
      port: 18081
    prometheus:
      download_url: 'https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz'
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: 'https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz'
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: 'https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz'
      port: 9200
```

接下来,我们将详细解释 YAML 文件中每个配置选项的含义。

`connection` 部分包含从控制机器连接到 EloqKV 节点的设置。如果你按照[前置条件文档](./prerequisite)中的步骤操作,可以保持 connection 部分不变。

`deployment` 部分涵盖了部署集群元数据以及三个关键组件的配置:事务集群、日志集群和持久化存储集群。

- **`cluster_name`**:  
  _类型_: `String`  
  _默认值_: `'eloqkv-cluster'`  
  正在部署的集群名称,作为集群的标识符。使用 `eloqctl`,你可以部署和管理多个集群,每个集群都由其唯一的名称区分。

- **`product`**:  
  _Type_: `String`  
  _Default_: `'EloqKV'`  
  The product name being deployed should be set to `'EloqKV'` for the current deployment. In the future, `eloqctl` will support the deployment of different database products like `EloqSQL` etc..

- **`version`**:  
  _Type_: `String`  
  _Default_: `'latest'`  
  Specifies the version of EloqKV to be installed. Setting this to `'latest'` ensures that the most recent version is used.

- **`install_dir`**:  
  _Type_: `String`  
  _Default_: `'/home/${USER}'`  
  Specifies the directory where the product will be installed. The `${USER}` placeholder dynamically references the current user's home directory.

- **`tx_service.tx_host_ports`**:  
  _Type_: `List of Strings`  
  _Default_: `[127.0.0.1:6389]`  
  The list of IP:PORT addresses for the transaction service hosts. The transaction service handles Redis client requests and is compatible with the Redis Protocol. Note that each IP address can only be listed once.

- **`tx_service.enable_cache_replacement`**:  
  _Type_: `Boolean`  
  _Default_: `on`  
  If persisted cold data can be evicted out of memory cache. If set to false, all data will be cached in memory and new data insertion will fail if memory is full. Less data can be stored in this mode, but all requests is handled in memory. If set to false, cold data will be evicted out of memory so that new write request can succeed. More data can be stored in this mode but a cache miss request will result in a disk read.

- **`log_service.nodes`**:  
  _Type_: `Composite`  
  Specify the log service hosts. You can configure anywhere from zero to multiple log service nodes. Setting this to zero indicates that the Write-Ahead Log (WAL) is coupled with the transaction service, in which case you should remove the log_service section entirely. If you specify a non-zero value, the log service is decoupled from the transaction service, running as a standalone process. This can be deployed in a separate cluster or within the same cluster as the transaction service, depending on your requirements.

- **`log_service.nodes.host`**:  
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address where each log service process is running.

- **`log_service.nodes.port`**:  
  _Type_: `Integer`  
  _Default_: `9000`  
  The port on which each log service process listens.

- **`log_service.nodes.data_dir`**:  
  _Type_: `Strings`  
  _Default_: `['/home/${USER}/disk_wal_kv']`  
  The directory where each log service process stores its WAL logs. You can specify a separate disk for the log service to improve write throughput.

- **`log_service.replica`**:  
  _Type_: `Integer`  
  _Default_: `1`  
  The number of replicas for the log service. A value of 1 means there is only one replica. For high availability, set this to 3 or 5. Note that the number of log service nodes should be greater than the number of replicas.

The `monitor` section contains configurations for deploying a Prometheus and Grafana-based monitoring system for EloqKV. Monitoring is optional; if you do not wish to include it, simply remove the monitor section. If you choose to enable monitoring, set the prometheus.host and grafana.host fields to specify the locations of Prometheus and Grafana, and leave the other fields unchanged. Note that Prometheus and Grafana cannot be shared with other software, so you must ensure that the ports used by Prometheus and Grafana are not occupied by other processes.

- **`monitor.grafana.host`**:
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address where grafana service is running.

- **`monitor.grafana.port`**:
  _Type_: `Integer`  
  _Default_: `'3301'`  
  The port on which grafana service listens.

- **`monitor.prometheus.host`**:
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address where prometheus service is running.

- **`monitor.prometheus.host`**:
  _Type_: `Integer`  
  _Default_: `'9500'`  
  The port on which prometheus service listens.

## 4. Run the deployment command

After you modified the `eloqkv_rocksdb.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_rocksdb.yaml -s
```

The command will install the EloqKV components in the specified cluster.

If you see the following message, the EloqKV cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
Connect to server:
	/home/eloq/eloqkv-cluster/EloqKV/bin/eloqkv-cli -h 127.0.0.1 -p 6389
Prometheus: http://127.0.0.1:9500
Grafana: http://127.0.0.1:3301
```

Feel free to use `eloqkv-cli` or any other Redis client to connect to EloqKV and enjoy exploring its features.
