---
title: EloqKV 与不同 Redis 客户端的兼容性
---

# EloqKV 与不同 Redis 客户端的兼容性

## 概述

本文旨在说明使用 Redis 客户端（jedis、redis-py、go-redis）连接 EloqKV 和 Redis 集群时的兼容性和行为差异。

## 推荐的客户端版本

EloqKV 兼容 Redis7.0, 所以对 Redis 客户端版本有最低要求，以下是推荐的客户端版本：
| 客户端 | 版本 |
|-----------------|-------------------|
| jedis | >= 4.0，[请参考](https://github.com/redis/jedis/tree/master) |
| redis-py | >= 4.5.0，[请参考](https://github.com/redis/redis-py) |
| go-redis | >= v9，[请参考](https://github.com/redis/go-redis/discussions/2241) |

## 不兼容命令的行为

1. **集群行为差异**  
   在 Redis 集群中，`DBSIZE`、`INFO`、`FLUSHDB` 和 `SCAN` 等命令返回的是单个节点的结果。相比之下，EloqKV 返回的是跨所有节点的聚合全局结果。这导致这些命令的行为存在差异。

2. **Client Info 和 Client List**  
   `CLIENT INFO` 和 `CLIENT LIST` 的输出与 Redis 集群不一致。以下字段的值不可靠，用户不应依赖这些字段：（qbuf、qbuf-free、argv-mem、obl、omem、tot-mem）

3. **支持的 Config Set / Get**  
   目前，EloqKV 仅支持以下参数的 `CONFIG SET` 和 `CONFIG GET`：

   - `slowlog-log-slower-than`
   - `slowlog-max-len`

4. **跨槽错误**  
   如果启用了 `auto_redirect` 标志，EloqKV 将不会返回 `CROSS SLOT` 错误代码。在这种情况下，如果客户端收到 `CROSS SLOT` 错误，是因为某些客户端在发出命令之前会进行槽相关的检查。
