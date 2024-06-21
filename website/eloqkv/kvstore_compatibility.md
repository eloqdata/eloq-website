---
title: EloqKV Redis Command Compatibility
---

# EloqKV Redis Command Compatibility

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

- [✅] BLMOVE
- [✅] BLMPOP
- [✅] BLPOP
- [✅] BRPOP
- [✅] BRPOPLPUSH
- [✅] LINDEX
- [✅] LINSERT
- [✅] LLEN
- [✅] LMOVE
- [✅] LMPOP
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
- [✅] SORT (Note: The SORT command also works on Lists)

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
- [✅] ZDIFF
- [✅] ZDIFFSTORE
- [✅] ZINCRBY
- [✅] ZINTER
- [✅] ZINTERCARD
- [✅] ZINTERSTORE
- [✅] ZLEXCOUNT
- [✅] ZMPOP
- [✅] ZMSCORE
- [✅] ZPOPMAX
- [✅] ZPOPMIN
- [✅] ZRANDMEMBER
- [✅] ZRANGE
- [✅] ZRANGEBYLEX
- [✅] ZRANGEBYSCORE
- [✅] ZRANK
- [✅] ZREM
- [✅] ZREMRANGEBYLEX
- [✅] ZREMRANGEBYRANK
- [✅] ZREMRANGEBYSCORE
- [✅] ZREVRANGE
- [✅] ZREVRANGEBYLEX
- [✅] ZREVRANGEBYSCORE
- [✅] ZREVRANK
- [✅] ZSCAN
- [✅] ZSCORE
- [✅] ZUNION
- [✅] ZUNIONSTORE

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
- [ ] PSETEX // ttl is not required.
- [✅] SET
- [✅] SETEX
- [✅] SETNX
- [✅] SETRANGE
- [✅] STRLEN
- [✅] SUBSTR (Deprecated) //same as getrange

## Pub/Sub

- [✅] PSUBSCRIBE
- [✅] PUBLISH
- [✅] PUBSUB
- [✅] PUNSUBSCRIBE
- [✅] SUBSCRIBE
- [✅] UNSUBSCRIBE

## Bitmap

- [✅] BITCOUNT
- [✅] BITFIELD
- [✅] BITFIELD_RO
- [✅] BITOP
- [✅] BITPOS
- [ ] GETBIT
- [ ] SETBIT

## Transactions

- [✅] DISCARD
- [✅] EXEC
- [✅] MULTI
- [✅] UNWATCH
- [✅] WATCH

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

## Connection

- [✅] AUTH
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
- [✅] SORT
- [ ] TOUCH
- [ ] TTL
- [ ] TYPE
- [ ] UNLINK
- [ ] WAIT
