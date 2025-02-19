---
title: 使用 Docker 运行 EloqKV
---

## 快速体验

使用 `docker run` 是开始使用 EloqKV 最简单的方式。

如果你的机器上还没有安装 Docker,可以按照这个[说明](https://docs.docker.com/get-docker/)进行安装。

```shell
# 为容器创建子网。
docker network create --subnet=172.20.0.0/16 eloqnet

docker run -d --net eloqnet --ip 172.20.0.10 -p 6379:6379 --name=eloqkv eloqdata/eloqkv
```

一切就绪! 现在你可以连接到 EloqKV 服务器:

```shell
redis-cli -h 172.20.0.10

172.20.0.10:6379> set hello world
OK
172.20.0.10:6379> get hello
"world"
```

## 传入配置文件并设置 EloqKV 集群

通常,我们需要向 EloqKV 传递配置文件来修改其行为。查看[前面的文档](../eloqkv/install-from-binary#prepare-eloqkv-config-file)了解一些配置选项。传递配置文件最简单的方式是使用[绑定挂载](https://docs.docker.com/storage/bind-mounts/)。

作为示例,我们展示如何在服务器中使用容器创建一个简单的 EloqKV 集群。我们需要 3 个容器来形成集群。在本例中,假设我们已经生成了三个配置文件,位于 `/data/conf1`、`/data/conf2` 和 `/data/conf3`。

```
# 为容器创建子网。
docker network create --subnet=172.20.0.0/16 eloqnet

# 挂载本地配置文件并启动三个容器来创建 EloqKV 集群。
docker run -d --net eloqnet --ip 172.20.0.1 -p 6380:6379 -v /data/conf1:/home/eloquser/EloqKV/conf eloqdata/eloqkv
docker run -d --net eloqnet --ip 172.20.0.2 -p 6381:6379 -v /data/conf2:/home/eloquser/EloqKV/conf eloqdata/eloqkv
docker run -d --net eloqnet --ip 172.20.0.3 -p 6382:6379 -v /data/conf3:/home/eloquser/EloqKV/conf eloqdata/eloqkv
```

你已经可以连接到 EloqKV 集群了:

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

你可能注意到即使在集群中,MULTI EXEC 也能顺利运行,就像在单节点设置中一样。
