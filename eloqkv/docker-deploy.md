---
title: Run EloqKV using Docker
---

## Playground

Using `docker run` is the easiest way to get started. This is the preferred method to quickly get a taste of the rich features of **EloqKV**. To deploy a full cluster or require fine-grained control, we recommend the [EloqCtl tool](../eloqkv/quick-start). For those who do not need hand-holding, one can also deploy using [binary tarball](../eloqkv/install-from-binary).

If Docker isn't installed on your machine, you can install it following this [instruction](https://docs.docker.com/get-docker/).

```shell
# Create subnet for containers.
docker network create --subnet=172.20.0.0/16 eloqnet

docker run -d --net eloqnet --ip 172.20.0.10 -p 6379:6379 --name=eloqkv eloqdata/eloqkv
```

You're all set! Now you can connect to the EloqKV server:

```shell
redis-cli -h 172.20.0.10

172.20.0.10:6379> set hello world
OK
172.20.0.10:6379> get hello
"world"
```

## Pass in Configuration and Setup EloqKV cluster

Often, we need to pass a configuration file to EloqKV to modify its behavior. See the [next document](../eloqkv/install-from-binary#prepare-eloqkv-config-file) to find out some of the configuration options. The easiest way to pass in the configuration file is to [bind mount](https://docs.docker.com/engine/storage/bind-mounts/) a directory containing a file named `eloqkv.ini` to directory `/home/eloq/EloqKV/conf` inside the container, replacing the default `eloqkv.ini`. An alternative is to modify the original `eloqkv.ini` directly in the container.

As an example, we show how to create a simple EloqKV cluster using containers in a server. We will need 3 containers to form a cluster. In this example, assume we have generated three configuration files located in `/data/conf1`, `/data/conf2`, and `/data/conf3`.

```
#/data/conf1/eloqkv.ini
[local]
# Local ip and port
ip=172.20.0.11
port=6379

# Whether enable data store
enable_data_store=on

# Whether enable redo log
enable_wal=off

# EloqKV data directory.
eloq_data_path=eloq_data

# set tx service node group replica number
tx_nodegroup_replica_num=1

[cluster]
#ip_port_list should include all eloqkv nodes in a cluster deployment.
ip_port_list=172.20.0.11:6379,172.20.0.12:6379,172.20.0.13:6379

[store]
```

The files `/data/conf2/eloqkv.ini` and `/data/conf3/eloqkv.ini` are pretty much the same as `/data/conf1/eloqkv.ini`, except the local IP are set to `172.20.0.12` and `172.20.0.13` respectively.

Now, let's use `docker run` to start three containers, each functioning as a unique EloqKV node, to build the cluster.

```
# Create subnet for containers.
docker network create --subnet=172.20.0.0/16 eloqnet

# Mount local configuration files and launch three containers to create an EloqKV cluster.
docker run -d --net eloqnet --ip 172.20.0.11 -p 6380:6379 -v /data/conf1:/home/eloq/EloqKV/conf eloqdata/eloqkv
docker run -d --net eloqnet --ip 172.20.0.12 -p 6381:6379 -v /data/conf2:/home/eloq/EloqKV/conf eloqdata/eloqkv
docker run -d --net eloqnet --ip 172.20.0.13 -p 6382:6379 -v /data/conf3:/home/eloq/EloqKV/conf eloqdata/eloqkv
```

You're ready to connect to the EloqKV cluster:

```shell
redis-cli -h 172.20.0.13

172.20.0.13:6379> multi
OK
172.20.0.13:6379> set a a
QUEUED
172.20.0.13:6379> set b b
QUEUED
172.20.0.13:6379> set c c
QUEUED
172.20.0.13:6379> set d d
QUEUED
172.20.0.13:6379> exec
1) OK
2) OK
3) OK
4) OK
```

You might notice that even in a cluster, MULTI EXEC functions smoothly, just as it would in a single-node setup.
