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
- [✅] RPOPLPUSH(deprecated 6.2.0)
- [✅] RPUSH
- [✅] RPUSHX

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
- [✅] GETDEL
- [✅] GETRANGE
- [✅] GETSET
- [✅] INCR
- [✅] INCRBY
- [✅] INCRBYFLOAT
- [ ] LCS
- [✅] MGET
- [✅] MSET
- [✅] MSETNX
- [ ] PSETEX //ttl is not supported yet.
- [✅] SET
- [ ] SETEX //ttl is not supported yet.
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
- [✅] GETBIT
- [✅] SETBIT

## Transactions

- [✅] DISCARD
- [✅] EXEC
- [✅] MULTI
- [✅] UNWATCH
- [✅] WATCH

## Scripting

- [✅] EVAL
- [ ] EVAL_RO
- [✅] EVALSHA
- [ ] EVALSHA_RO
- [ ] FCALL
- [ ] FCALL_RO
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
- [✅] ECHO
- [ ] HELLO
- [✅] PING
- [ ] QUIT
- [ ] RESET

## Generic

- [✅] DEL
- [✅] DUMP
- [✅] EXISTS
- [ ] EXPIRE
- [ ] EXPIREAT
- [✅] INFO
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
- [✅] RESTORE
- [✅] SCAN
- [✅] SELECT
- [✅] SORT
- [ ] TOUCH
- [ ] TTL
- [✅] TYPE
- [ ] UNLINK
- [ ] WAIT
