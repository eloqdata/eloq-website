---
title: Install Using Cluster_mgr Tool
summary: Learn how to quickly get started with the EloqKV database.
---

# Install Using Cluster_mgr Tool

## Prerequisite

EloqKV is compatible with CentOS 7, CentOS 8, Ubuntu 18.04, and Ubuntu 20.04.

Please follow [Prerequisite Document ](https://eloqdata.com/eloqkv/prerequisite) to setup the prerequisite to install EloqKV.

## Download and install cluster_mgr tool

`cluster_mgr` is a command-line tool designed to manage and operate EloqKV clusters.

Download and install the `cluster_mgr` tool using a single command line instruction.

```shell
curl --proto '=https' --tlsv1.2 -sSf https://www.eloqdata.com/download/mono-waiter/install.sh | sh
```

`cluster_mgr` will be installed in the `$HOME/.eloqwaiter` directory. Additionally, the `CLUSTER_MGR_HOME` environment variable will be set to `$HOME/.eloqwaiter`.

## Configure EloqKV config file

Below is a template for the EloqKV configuration file, which is included with the cluster_mgr installation. You can find this file at $HOME/.eloqwaiter/config/examples/eloqkv_rocksdb.yaml.

This template is designed for deploying the EloqKV server with RocksDB as the key-value store. To enable external access to EloqKV, replace 127.0.0.1 with your private or public IP address using the following command: `sed -i 's|127.0.0.1|${YOUR_IP}|g' eloqkv_rocksdb.yaml`.

```yml
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
  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - '/home/${USER}/disk_wal_kv'
    replica: 1
  tx_service:
    host: [127.0.0.1]
    client_port: 6389
  storage_service:
    rocksdb: Local
  monitor:
    data_dir: ''
    monograph_metrics:
      path: '/mono_metrics'
      port: 18081
    prometheus:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/prometheus-2.42.0.linux-amd64.tar.gz'
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/grafana-9.3.6.linux-amd64.tar.gz'
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: 'https://d143xau9fe26d8.cloudfront.net/others/node_exporter-1.5.0.linux-amd64.tar.gz'
      port: 9200
```

## Launch EloqKV

```shell
cluster_mgr launch ${CLUSTER_MGR_HOME}/config/examples/eloqkv_rocksdb.yaml
```

## Manage EloqKV

List cluster to get CLUSTER_NAME.

```shell
cluster_mgr list
```

Stop cluster.

```shell
cluster_mgr stop ${CLUSTER_NAME}
```

Start cluster.

```shell
cluster_mgr start ${CLUSTER_NAME}
```

Stop monitor. Note that monitor will not be stopped by cluster stop command.

```shell
cluster_mgr monitor ${CLUSTER_NAME} stop
```

## Connect to EloqKV server

EloqKV is compatible with Redis protocol. Use any redis client to connect to EloqKV. Please use the same ip and port in configuration file.

```shell
redis-cli -h 127.0.0.1 -p 6389
```

## Explore More Features

### Enable Data Store Feature

EloqKV supports the integration with pluggable data stores, enabling data persistence even when the EloqKV service is stopped. This capability facilitates the implementation of tiered storage strategies, allowing hot data to reside in memory for quick access, while cold data can be offloaded to more persistent storage solutions.

Edit `eloqkv.ini` and restart database to enable data store of EloqKV.

```shell
[local]
enable_data_store=all
```

Note that enable persisitent kv will consume CPU resource to flush records in memory to kv store periodically. As a result, reduce core_num in `eloqkv.ini` when enable persisitent kv.

### Enable Transaction Feature

Upon enabling the Write-Ahead Logging (WAL) and integrating a data store, EloqKV evolves into a fully transactional key-value store. The WAL ensures atomicity in distributed transactions and maintains data integrity by preventing data loss in the event of a system crash.

Edit `eloqkv.ini` and restart database to enable WAL of EloqKV.

```shell
[local]
enable_wal=all
```
