---
title: 部署高可用缓存集群(兼容 Redis 主从模式)
summary: 在本地存储上部署高可用缓存集群。
---

# 部署高可用缓存集群(兼容 Redis 主从模式)

在[之前的文档](./quick-start)中,我们介绍了如何使用 `eloqctl` 部署单节点 EloqKV 集群。在本文档中,我们将重点介绍如何在本地存储(RocksDB)上部署高可用缓存集群。此部署方式兼容 Redis 主从模式。

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

要部署高可用集群,使用 `eloqkv_rocksdb_standby_with_voter.yaml` 作为默认配置模板。

```
# 示例 yaml 文件
.eloqctl/config/examples/eloqkv_rocksdb_standby_with_voter.yaml
```

要启用高可用性,编辑 `eloqkv_rocksdb_standby_with_voter.yaml` 文件。在不同机器之间设置主节点、备用节点和投票节点。

```yaml
connection:
  username: '${USER}'
  auth_type: 'keypair'
  auth:
    keypair: '/home/${USER}/.ssh/id_rsa'
deployment:
  cluster_name: 'eloqkv_with_hot_standby_and_voter'
  product: 'EloqKV'
  version: 'latest'
  install_dir: '/home/${USER}'
  tx_service:
    tx_host_ports: [10.0.0.1:6379]
    standby_host_ports: [10.0.0.2:6379]
    voter_host_ports: [10.0.0.3:6379]
    enable_cache_replacement: on

  storage_service:
    rocksdb: Local

  monitor:
    data_dir: ''
    eloq_metrics:
      path: '/eloq_metrics'
      port: 18081
    prometheus:
      download_url: 'https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz'
      port: 9500
      host: 10.0.0.4
    grafana:
      download_url: 'https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz'
      port: 3301
      host: 10.0.0.4
    node_exporter:
      url: 'https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz'
      port: 9200
```

关于 YAML 文件中每个配置选项的详细解释,请参考之前的文档[部署单节点集群](./quick-start)。在本文档中,我们将重点关注高可用性方面的配置。

- **`tx_service.tx_host_ports`**:  
  _类型_: `字符串列表`  
  主节点列表。每个主节点处理读写操作,并持续将新的更改复制到备用节点。主节点之间用 `,` 分隔。

- **`tx_service.standby_host_ports`**:  
  _类型_: `字符串列表`  
  热备用节点列表。每个备用节点处理读操作,并在主节点发生故障时自动接管成为主节点。同一主节点的备用节点之间用 `|` 分隔,不同主节点的备用节点之间用 `,` 分隔。例如,`[10.0.0.2:6379| 10.0.0.3:6379, 10.0.0.4:6379| 10.0.0.5:6379]` 表示 tx_host_ports 中第一个主节点有 2 个备用节点,第二个主节点也有 2 个备用节点。

- **`tx_service.voter_host_ports`**:  
  _类型_: `Integer`  
  投票节点列表。当主节点发生故障时,投票节点参与选举新的主节点。投票节点不存储任何数据,也不能被选举为主节点。只有当集群中的节点总数少于 3 个时,才需要部署投票节点。

- **`tx_service.enable_cache_replacement`**:  
  _类型_: `Boolean`  
  _默认值_: `on`  
  是否允许将持久化的冷数据从内存缓存中驱逐。如果设置为 false,所有数据都将缓存在内存中,当内存已满时新数据插入将失败。这种模式下可以存储的数据较少,但所有请求都在内存中处理。如果设置为 true,冷数据将从内存中驱逐,以便新的写入请求可以成功。这种模式下可以存储更多数据,但缓存未命中的请求将导致磁盘读取。

- **`storage_service.rocksdb`**:  
  _类型_: `String`  
  `Local` 表示使用嵌入式 RocksDB 引擎进行磁盘数据存储。

## 4. 运行部署命令

修改完 `eloqkv_rocksdb_standby_with_voter.yaml` 后,使用 `eloqctl launch` 命令配置 EloqKV 集群:

```shell
eloqctl launch -s ${HOME}/.eloqctl/config/examples/eloqkv_rocksdb_standby_with_voter.yaml
```

该命令将在指定的集群中安装 EloqKV 组件。

如果你看到以下消息,则表示 EloqKV 集群已成功配置:

```
Launch cluster finished, Enjoy!
```

现在你可以使用 `eloqkv-cli` 或任何其他 Redis 客户端连接到 EloqKV 并开始探索其功能。

## 5. 自动故障转移

当主节点发生故障时,EloqKV 可以自动故障转移,备用节点将被选举为新的主节点来接收写入工作负载。

为了使客户端对主节点故障转移透明,应该在 EloqKV 集群前面部署代理，或者使用 Redis Cluster 客户端

EloqKV Proxy 是一个用 Go 编写的高性能代理服务器,旨在无缝管理多个 EloqKV 集群。它允许客户端使用令牌(密码)连接到不同的 EloqKV 集群,实现多租户环境。代理支持通过 RESTful Web 服务动态添加和删除集群,这使其非常适合需要可扩展性和灵活性的生产环境。

按照以下文档设置 EloqKV Proxy:

- [Eloqctl Proxy](./eloqkv-proxy)
