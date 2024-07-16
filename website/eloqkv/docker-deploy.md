---
title: Deploy EloqKV using docker
---

Run EloqKV server (based on rocksdb) in docker:

```shell
docker network create --subnet=172.20.0.0/16 eloqnet
docker run -d --net eloqnet --ip 172.20.0.2 -p 6379:6379 --name=eloqkv monographdb/demo-eloqkv
```

Connect to EloqKV server:

```shell
redis-cli
# if you do not have redis-cli installed:
# docker exec -it eloqkv eloqkv-cli -h 172.20.0.2
```
