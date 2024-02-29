---
title: MonographKVStore Redis Command Capabilities
---

# MonographKVStore - Redis Command Capabilities

## Bitmap

- [ ] BITCOUNT
- [ ] BITFIELD
- [ ] BITFIELD_RO
- [ ] BITOP
- [ ] BITPOS
- [ ] GETBIT
- [ ] SETBIT

## Connection

- [ ] AUTH
- [ ] CLIENT CACHING
- [ ] CLIENT GETNAME
- [ ] CLIENT ID
- [ ] CLIENT INFO
- [ ] CLIENT KILL
- [ ] CLIENT LIST
- [ ] CLIENT NO-EVICT
- [ ] CLIENT NO-TOUCH
- [ ] CLIENT PAUSE
- [ ] CLIENT REPLY
- [ ] CLIENT SETINFO
- [ ] CLIENT SETNAME
- [ ] CLIENT TRACKING
- [ ] CLIENT TRACKINGINFO
- [ ] CLIENT UNBLOCK
- [ ] CLIENT UNPAUSE
- [✅] ECHO
- [] HELLO
- [✅] PING
- [ ] QUIT
- [ ] RESET

## Generic

- [✅] DEL
- [ ] DUMP
- [✅] EXISTS
- [ ] EXPIRE
- [ ] EXPIREAT
- [✅] KEYS
- [ ] MIGRATE
- [ ] MOVE
- [ ] OBJECT
- [ ] PERSIST
- [ ] PEXPIRE
- [ ] PEXPIREAT
- [ ] PTTL
- [ ] RANDOMKEY
- [ ] RENAME
- [ ] RENAMENX
- [ ] RESTORE
- [✅] SCAN
- [ ] SORT
- [ ] TOUCH
- [ ] TTL
- [ ] TYPE
- [ ] UNLINK
- [ ] WAIT

## Hash

- [✅] HDEL
- [✅] HEXISTS
- [✅] HGET
- [✅] HGETALL
- [✅] HINCRBY
- [✅] HINCRBYFLOAT
- [✅] HKEYS
- [✅] HLEN
- [✅] HMGET
- [✅] HSET
- [✅] HSETNX
- [✅] HSTRLEN
- [✅] HVALS
- [✅] HRANDFIELD
- [✅] HSCAN
- [✅] HMSET (Deprecated)

## List

- [5-] BLMOVE //here blocking means client will be blocked when source of BLMOVE is empty until another client push the item into the source.
- [5-] BLMPOP
- [5-] BLPOP
- [5-] BRPOP
- [5-] BRPOPLPUSH
- [✅] LINDEX
- [✅] LINSERT
- [✅] LLEN
- [✅] LMOVE
- [1] LMPOP
- [✅] LPOP
- [✅] LPOS
- [✅] LPUSH
- [✅] LPUSHX
- [✅] LRANGE
- [✅] LREM
- [✅] LSET
- [✅] LTRIM
- [✅] RPOP
- [ ] RPOPLPUSH(deprecated 6.2.0)
- [✅] RPUSH
- [✅] RPUSHX
- [5] SORT (Note: The SORT command also works on Lists)

## Pub/Sub

- [ ] PSUBSCRIBE
- [ ] PUBLISH
- [ ] PUBSUB
- [ ] PUNSUBSCRIBE
- [ ] SUBSCRIBE
- [ ] UNSUBSCRIBE

## Scripting

- [✅] EVAL
- [✅] EVALSHA
- [ ] FCALL
- [ ] FUNCTION CREATE
- [ ] FUNCTION DELETE
- [ ] FUNCTION DUMP
- [ ] FUNCTION FLUSH
- [ ] FUNCTION KILL
- [ ] FUNCTION LIST
- [ ] FUNCTION LOAD
- [ ] FUNCTION RESTORE
- [ ] FUNCTION STATS
- [ ] SCRIPT DEBUG
- [✅] SCRIPT EXISTS
- [✅] SCRIPT FLUSH
- [ ] SCRIPT KILL
- [✅] SCRIPT LOAD

## Set

- [✅] SADD
- [✅] SCARD
- [✅] SDIFF
- [✅] SDIFFSTORE
- [✅] SINTER
- [✅] SINTERSTORE
- [✅] SISMEMBER
- [✅] SMEMBERS
- [✅] SMISMEMBER
- [✅] SMOVE
- [✅] SPOP
- [✅] SRANDMEMBER
- [✅] SREM
- [✅] SSCAN
- [✅] SUNION
- [✅] SUNIONSTORE

## Sorted Set

- [ ] BZPOPMIN
- [ ] BZPOPMAX
- [✅] ZADD
- [✅] ZCARD
- [✅] ZCOUNT
- [4-] ZDIFF
- [4-] ZDIFFSTORE
- [4-] ZINCRBY
- [4-] ZINTER
- [4-] ZINTERCARD
- [4-] ZINTERSTORE
- [✅] ZLEXCOUNT
- [3] ZMPOP
- [1] ZMSCORE
- [✅] ZPOPMAX
- [✅] ZPOPMIN
- [1] ZRANDMEMBER
- [✅] ZRANGE
- [✅] ZRANGEBYLEX
- [✅] ZRANGEBYSCORE
- [1] ZRANK
- [✅] ZREM
- [1] ZREMRANGEBYLEX
- [1] ZREMRANGEBYRANK
- [1] ZREMRANGEBYSCORE
- [1] ZREVRANGE
- [1] ZREVRANGEBYLEX
- [1] ZREVRANGEBYSCORE
- [1] ZREVRANK
- [✅] ZSCAN
- [✅] ZSCORE
- [4-] ZUNION
- [4-] ZUNIONSTORE

## String

- [✅] APPEND
- [✅] DECR
- [✅] DECRBY
- [✅] GET
- [✅] GETRANGE
- [✅] GETSET
- [✅] INCR
- [✅] INCRBY
- [✅] INCRBYFLOAT
- [✅] MGET
- [✅] MSET
- [✅] MSETNX
- [x] PSETEX // ttl is not required.
- [✅] SET
- [✅] SETEX
- [✅] SETNX
- [✅] SETRANGE
- [✅] STRLEN
- [✅] SUBSTR (Deprecated) //same as getrange

## Transactions

- [✅] DISCARD
- [✅] EXEC
- [✅] MULTI
- [✅] UNWATCH
- [✅] WATCH
