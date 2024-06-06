---
title: Deploy EloqKV on Local Machine
---

# Table of Contents

1. [Deploy Using Tarball](#deploy-using-tarball)
2. [Deploy Using Cluster_mgr](#deploy-using-cluster_mgr)
3. [Explore More Features](#explore-more-features)

## Deploy Using Tarball

### Download and unzip EloqKV tarball

Eloqkv is compatible with CentOS 7, CentOS 8, Ubuntu 18.04, and Ubuntu 20.04. The following example details the process for CentOS 7.

```shell
wget https://d143xau9fe26d8.cloudfront.net/eloqkv/centos7/rocksdb/eloqkv-latest-amd64.tar.gz
mkdir /home/centos/eloqkv
tar -zxvf eloqkv-latest-amd64.tar.gz -C /home/centos/eloqkv
```

### Prepare EloqKV config file

EloqKV uses a configuration file named redis.ini to customize settings. Below is an example of how to configure EloqKV to run on a local machine.

Note: Please update 127.0.0.1 with your private/public ip address.

```yaml
[local]
# set ip to private/public ip address
ip=127.0.0.1
port=6389
# set core_number to 70% of core number
core_number=3
# checkpoint_interval determine the frequency of flushing dirty records into data store
checkpoint_interval=60
# set node_memory_limit_mb to 60% of system memory
node_memory_limit_mb=8192
# whether enable data store
enable_data_store=none
# whether enable redo log
enable_wal=none
path=data
# set event_dispatcher_num to core_number/7
event_dispatcher_num=1

[cluster]
# ip_port_list contains all the node endpoints of EloqKV cluster
# set ip to private/public ip address
ip_port_list=127.0.0.1:6389

[store]
# data store related configuration. Keep it empty for rocksdb based data store.
```

### Start EloqKV server

EloqKV `redis_server` binary is installed at `install/bin` directory. Start the server on local machine with below commands.

```shell
cd /home/centos/eloqkv/install/bin
export LD_LIBRARY_PATH=/home/centos/eloqkv/install/lib
./redis_server --config=redis.ini > log 2>&1 &
```

### Connect to EloqKV server

EloqKV is compatible with Redis protocol. Use redis client to connect EloqKV.

```shell
./redis_cli -server 127.0.0.1:6389
```

## Deploy Using Cluster_mgr

`cluster_mgr` is the deployment tool of EloqKV. To quickly setup a demo cluster on local machine, you can use `cluster_mgr demo` command. Cassandra will be choosed as default data store.

### Install Command Line Tool `cluster_mgr`

```shell
curl --proto '=https' --tlsv1.2 -sSf https://www.eloqdata.com/download/mono-waiter/install.sh | sh
```

### Deploy EloqKV using config file

- Modify the cluster configuration file.

  Edit the configuration file `.eloqwaiter/config/examples/eloqsql_cassandra.yaml` as your need.

  - Update 127.0.0.1 with node private ip: `sed -i 's/127.0.0.1/your_private_ip/g' .eloqwaiter/config/examples/eloqsql_cassandra.yaml`. Note that keeping 127.0.0.1 will block external access.
  - Update product version. For example use version 0.4.1: `version: "0.4.1"`.
  - Update install path `install_dir`. Set to the desired storage location for the user to install the cluster. This location must be the folder location with read and write permissions for the user specified by `username`.
  - `storage_service`: Configure the endpoint of kv store (RocksDB or Cassandra).
  - `monitor`: Configure the prometheus and grafana.

```
connection:
  username: "$USER"
  auth_type: "keypair"
  auth:
    keypair: "/home/$USER/.ssh/id_rsa"
deployment:
  cluster_name: "eloqkv-cluster"
  product: "EloqKV"
  version: "latest"
  install_dir: "/home/$USER/eloq"
  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - "/home/$USER/eloq/disk_wal_kv"
    replica: 1
  tx_service:
    host: [127.0.0.1]
    client_port: 6389
  storage_service:
    rocksdb: Local
  monitor:
    data_dir: ""
    monograph_metrics:
      path: "/mono_metrics"
      port: 18081
    prometheus:
      download_url: "https://d143xau9fe26d8.cloudfront.net/others/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: "https://d143xau9fe26d8.cloudfront.net/others/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: "https://d143xau9fe26d8.cloudfront.net/others/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
```

- Launch cluster

  ```shell
  cluster_mgr launch .eloqwaiter/config/examples/eloqsql_cassandra.yaml
  ```

- Access the cluster

  ```shell
  LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/centos/eloq/eloqkv-cluster/monograph_redis/lib /home/centos/eloq/eloqkv-cluster/monograph_redis/redis_cli -server 127.0.0.1:6389
  ```

### Deploy EloqKV Using Demo

cluster_mgr demo command supports to deploy a playground EloqKV. It is just a playground which is not recommanded to run redis benchmark based on demo EloqKV.

```shell
cluster_mgr demo eloq-kv
```

Demo cluster will be installed at `/home/$USER/.eloqwaiter/demo-kv`

## Explore More Features

### Enable Data Store Feature

EloqKV supports the integration with pluggable data stores, enabling data persistence even when the EloqKV service is stopped. This capability facilitates the implementation of tiered storage strategies, allowing hot data to reside in memory for quick access, while cold data can be offloaded to more persistent storage solutions.

Edit `/home/$USER/.eloqwaiter/demo-kv/redis.ini` to enable data store of EloqKV

```shell
[local]
enable_data_store=all
```

Note that enable persisitent kv will consume CPU resource to flush records in memory to kv store periodically. As a result, reduce core_num in `redis.ini` when enable persisitent kv.

### Enable Transaction Feature

Upon enabling the Write-Ahead Logging (WAL) and integrating a data store, EloqKV evolves into a fully transactional key-value store. The WAL ensures atomicity in distributed transactions and maintains data integrity by preventing data loss in the event of a system crash.

Edit `redis.ini` to enable WAL of EloqKV

```shell
[local]
enable_wal=all
```
