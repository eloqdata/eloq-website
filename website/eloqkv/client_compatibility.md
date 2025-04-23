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
| jedis | >= 5.2.0,  [please refer to](https://github.com/redis/jedis/tree/master)  |
| redis-py | >= 5.0.0,  [please refer to](https://github.com/redis/redis-py) |
| go-redis | >= v9,  [please refer to](https://github.com/redis/go-redis/discussions/2241) |

## Incompatible Command Behavior
### 1. info:
**Compared with redis cluster, eloqkv's info command result is missing some fields.**

**Keyspace returned by info in redis cluster only shows how many keys are in the current node, while eloqkv returns how many keys are in the entire cluster.**

### 2. client info:
**Compared with redis cluster, eloqkv's client info command result is missing some fields.**

### 3. client list:
**Compared with redis cluster, eloqkv's client list command result is missing some fields.**

### 4. dbsize:
**Redis cluster needs to send dbsize commands to all primary nodes, while eloqkv only needs to send commands to one of the primary nodes.**
- **redis-py:**  `client.dbsize(target_nodes="primaries")` will return an incorrect result.
- **go-redis:** `client.dbsize()` will return an incorrect result.

### 5. flushdb, flushall:
**Redis cluster needs to send flushdb commands to all primary nodes to clear database, while eloqkv only needs to send commands to one of the primary nodes.**
- **redis-py:**  `client.flushdb()` will send commands to all primary nodes and can be successfully executed, but flushdb will be repeatedly executed by different primary nodes.
- **go-redis:** Sending flushdb command to all primary nodes using the `ForEachMaster` interface provided by the client will result in failure.

### 6. scan:
**Redis cluster needs to send flushdb commands to all primary nodes to get the complete result, while eloqkv only needs to send commands to one of the primary nodes. The standby node of redis cluster supports the scan command, while the standby node of eloqkv does not support it.** 
- **redis-py:**  `client.scan()` will send commands to all primary nodes, resulting in incorrect results
- **go-redis:** Sending scan command to all primary nodes using the `ForEachMaster` interface provided by the client will result in incorrect result.

### 7. config set, config get:
**eloqkv only support to set `slowlog-log-slower-than` and `slowlog-max-len`**