---
title: EloqKV Compatibility with different Redis Clients
description: Review EloqKV compatibility notes for Redis client libraries including Jedis, redis-py, and go-redis.
---

# EloqKV Compatibility with different Redis Clients

## OverView

This document outlines the compatibility and connection behavior of EloqKV and Redis Cluster when accessed using the same client libraries (Jedis, redis-py, go-redis).

## Recommended Client Version

EloqKV is compatible with Redis 7.0. Clients built for earlier Redis versions may encounter compatibility issues. We recommend using one of the client versions listed below.

| Client   | Versions                                                                     |
| -------- | ---------------------------------------------------------------------------- |
| jedis    | >= 4.0, [please refer to](https://github.com/redis/jedis/tree/master)        |
| redis-py | >= 4.5.0, [please refer to](https://github.com/redis/redis-py)               |
| go-redis | >= v9, [please refer to](https://github.com/redis/go-redis/discussions/2241) |

## Incompatible Command Behavior

1. **Cluster Behavior Differences**  
   In Redis Cluster, commands like `DBSIZE`, `INFO`, `FLUSHDB`, and `SCAN` return results from a single node. In contrast, EloqKV returns aggregated, global results across all nodes. This leads to differences in behavior for these commands.

2. **Client Info and Client List**  
   Output of `CLIENT INFO` and `CLIENT LIST` is not consistent with Redis Cluster. The following are dummy fields and users should not rely on those. (qbuf, qbuf-free, argv-mem, obl, omem, tot-mem)
3. **Config Set / Get Support**  
   Currently, EloqKV supports `CONFIG SET` and `CONFIG GET` for the following parameters only:

   - `slowlog-log-slower-than`
   - `slowlog-max-len`

4. **Cross Slot Error**  
   If the `auto_redirect` flag is enabled, EloqKV will not return the `CROSS SLOT` error code. If the client receives a `CROSS SLOT` error in this case, it is because some clients perform slot related checks before issuing the command.
