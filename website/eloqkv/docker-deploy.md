---
title: Run EloqKV using Docker
---

## Playground

Using `docker run` is the easiest way to get started with EloqKV.

If Docker isn't installed on your machine, you can install it [here](https://docs.docker.com/get-docker/) before proceeding.

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

## Setup EloqKV cluster using Docker

Each container will function as an EloqKV node. To set up an EloqKV cluster using Docker, you'll need at least three containers, each with a unique configuration file. You can mount the local directory containing the `eloqkv.ini` file to the `/home/eloquser/EloqKV/conf` directory inside the container, replacing the default `eloqkv.ini`.

In the example below, assume you have generated three configuration files located in `/data/conf1`, `/data/conf2`, and `/data/conf3`.

```
#/data/conf1/eloqkv.ini
[local]
# Local ip and port
ip=172.20.0.1
port=6379

# Whether enable data store
enable_data_store=all

# Whether enable redo log
enable_wal=none

# Where to store log data
path=data

[cluster]
#ip_port_list should include all eloqkv nodes in a cluster deployment.
ip_port_list=172.20.0.1:6379,172.20.0.2:6379,172.20.0.3:6379
```

```
#/data/conf2/eloqkv.ini
[local]
# Local ip and port
ip=172.20.0.2
port=6379

# Whether enable data store
enable_data_store=all

# Whether enable redo log
enable_wal=none

# Where to store log data
path=data

[cluster]
#ip_port_list should include all eloqkv nodes in a cluster deployment.
ip_port_list=172.20.0.1:6379,172.20.0.2:6379,172.20.0.3:6379
```

```
#/data/conf3/eloqkv.ini
[local]
# Local ip and port
ip=172.20.0.3
port=6379

# Whether enable data store
enable_data_store=all

# Whether enable redo log
enable_wal=none

# Where to store log data
path=data

[cluster]
#ip_port_list should include all eloqkv nodes in a cluster deployment.
ip_port_list=172.20.0.1:6379,172.20.0.2:6379,172.20.0.3:6379
```

Now, let's use `docker run` to start three containers, each functioning as a unique EloqKV node, to build the cluster.

```
# Create subnet for containers.
docker network create --subnet=172.20.0.0/16 eloqnet

# Mount local configuration files and launch three containers to create an EloqKV cluster.
docker run -d --net eloqnet --ip 172.20.0.1 -p 6380:6379 -v /data/conf1:/home/eloquser/EloqKV/conf eloqdata/eloqkv
docker run -d --net eloqnet --ip 172.20.0.2 -p 6381:6379 -v /data/conf2:/home/eloquser/EloqKV/conf eloqdata/eloqkv
docker run -d --net eloqnet --ip 172.20.0.3 -p 6382:6379 -v /data/conf3:/home/eloquser/EloqKV/conf eloqdata/eloqkv
```

You're ready to connect to the EloqKV cluster:

```shell
redis-cli -h 172.20.0.3

172.20.0.3:6379> multi
OK
172.20.0.3:6379> set a a
QUEUED
172.20.0.3:6379> set b b
QUEUED
172.20.0.3:6379> set c c
QUEUED
172.20.0.3:6379> set d d
QUEUED
172.20.0.3:6379> exec
1) OK
2) OK
3) OK
4) OK
```

You'll notice that even in cluster mode, `MULTI EXEC` operates seamlessly across shards.
