---
title: EloqKV Compatibility with different Redis Clients
---

# EloqKV Compatibility with different Redis Clients

## OverView
This document aims to illustrate the incompatibility and behavior of connecting eloqkv and redis cluster when using the same client (jedis, redis-py, go-redis).

## Recommended Client Version
EloqKV is compatible with higher versions of Redis, and there may be incompatibility problems for lower version clients. Below is the client version we recommend.
| Client  | Versions |
|-----------------|-------------------|
| jedis | >= 4.0,  [please refer to](https://github.com/redis/jedis/tree/master)  |
| redis-py | >= 4.5.0,  [please refer to](https://github.com/redis/redis-py) |
| go-redis | >= v9,  [please refer to](https://github.com/redis/go-redis/discussions/2241) |

## Incompatible Command Behavior

1. **Cluster Behavior Differences**  
   In Redis Cluster, commands like `DBSIZE`, `INFO`, `FLUSHDB`, and `SCAN` return results from a single node. In contrast, EloqKV returns aggregated, global results across all nodes. This leads to differences in behavior for these commands.

2. **Client Info and Client List**  
   Output of `CLIENT INFO` and `CLIENT LIST` is not consistent with Redis Cluster.
   
3. **Config Set / Get Support**  
   Currently, EloqKV supports `CONFIG SET` and `CONFIG GET` for the following parameters only:  
   - `slowlog-log-slower-than`  
   - `slowlog-max-len`