---
title: Playground
---

# Playground

Install command line tool `cluster_mgr`

```shell
curl --proto '=https' --tlsv1.2 -sSf https://www.eloqdata.com/download/mono-waiter/install.sh | sh
```

Start to play with EloqKV

```shell
cluster_mgr demo --product eloq-kv
```

Demo cluster will be installed at `/home/$USER/.eloqwaiter/demo-kv`

# Enable Persistence Feature

Edit `/home/$USER/.eloqwaiter/demo-kv/redis.ini` to enable persisitent kv store of EloqKV

```shell
[local]
skip_kv=false
```

Note that enable persisitent kv will consume CPU resource to flush records in memory to kv store periodically. As a result, reduce core_num in `redis.ini` when enable persisitent kv.

# Enable WAL Feature

Edit `redis.ini` to enable WAL of EloqKV

```shell
[local]
skip_wal=false
```
