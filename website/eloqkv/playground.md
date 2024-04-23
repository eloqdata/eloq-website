---
title: Deploy EloqKV on Local Machine
---

# Table of Contents

1. [Deploy Using Tarball](#deploy-using-tarball)
2. [Deploy Using Cluster_mgr](#deploy-using-cluster_mgr)
3. [Explore More Features](#explore-more-features)

## Deploy Using Tarball

### Download and unzip EloqKV tarball

Eloqkv is compatible with CentOS 8, Ubuntu 18.04, and Ubuntu 20.04. The following example details the process for Ubuntu 20.04.

```shell
wget https://d143xau9fe26d8.cloudfront.net/eloqkv/ubuntu2004/rocksdb/latest/eloqkv-amd64.tar.gz
tar -zxvf eloqkv-amd64.tar.gz -C /home/ubuntu/eloqkv
```

### Prepare EloqKV config file

EloqKV uses a configuration file named redis.ini to customize settings. Below is an example of how to configure EloqKV to run on a local machine:

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
skip_kv=true
# whether enable redo log
skip_wal=true
path=data
# set event_dispatcher_num to core_number/7
event_dispatcher_num=1

[cluster]
# ip_port_list contains all the node endpoints of EloqKV cluster
ip_port_list=127.0.0.1:6389

[store]
# store related configuration. Use default rocksdb conf in this example
```

### Start EloqKV server

EloqKV `redis_server` binary is installed at `install/bin` directory. Start the server on local machine with below commands.

```shell
cd /home/ubuntu/eloqkv/install/bin
export LD_LIBRARY_PATH=/home/ubuntu/eloqkv/install/lib
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

### Start to play with EloqKV

```shell
cluster_mgr demo --product eloq-kv
```

Demo cluster will be installed at `/home/$USER/.eloqwaiter/demo-kv`

## Explore More Features

### Enable Data Store Feature

EloqKV supports the integration with pluggable data stores, enabling data persistence even when the EloqKV service is stopped. This capability facilitates the implementation of tiered storage strategies, allowing hot data to reside in memory for quick access, while cold data can be offloaded to more persistent storage solutions.

Edit `/home/$USER/.eloqwaiter/demo-kv/redis.ini` to enable data store of EloqKV

```shell
[local]
skip_kv=false
```

Note that enable persisitent kv will consume CPU resource to flush records in memory to kv store periodically. As a result, reduce core_num in `redis.ini` when enable persisitent kv.

### Enable Transaction Feature

Upon enabling the Write-Ahead Logging (WAL) and integrating a data store, EloqKV evolves into a fully transactional key-value store. The WAL ensures atomicity in distributed transactions and maintains data integrity by preventing data loss in the event of a system crash.

Edit `redis.ini` to enable WAL of EloqKV

```shell
[local]
skip_wal=false
```
