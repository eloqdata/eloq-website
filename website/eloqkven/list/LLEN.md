---
title: LLEN
---

# LLEN

Returns the length of the list stored at `key`. If `key` does not exist, it is interpreted as an empty list and `0` is returned. An error is returned when the value stored at `key` is not a list.

## Syntax

```
LLEN key
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@list`, `@fast`

## Examples

First, add some elements to a list:

```
LPUSH mylist "World"
LPUSH mylist "Hello"
```

Then retrieve the length of the list:

```
LLEN mylist
```

This will output:

```
(integer) 2
```

## RESP2/RESP3 Reply

Integer reply: the length of the list.

## See Also

- [BLMOVE](https://redis.io/commands/blmove)
- [BLMPOP](https://redis.io/commands/blmpop)
- [BLPOP](https://redis.io/commands/blpop)
- [BRPOP](https://redis.io/commands/brpop)
- [BRPOPLPUSH](https://redis.io/commands/brpoplpush)
- [LINDEX](https://redis.io/commands/lindex)
- [LINSERT](https://redis.io/commands/linsert)
- [LMOVE](https://redis.io/commands/lmove)
- [LMPOP](https://redis.io/commands/lmpop)
- [LPOP](https://redis.io/commands/lpop)
- [LPOS](https://redis.io/commands/lpos)
- [LPUSH](https://redis.io/commands/lpush)
- [LPUSHX](https://redis.io/commands/lpushx)
- [LRANGE](https://redis.io/commands/lrange)
- [LREM](https://redis.io/commands/lrem)
- [LSET](https://redis.io/commands/lset)
- [LTRIM](https://redis.io/commands/ltrim)
- [RPOP](https://redis.io/commands/rpop)
- [RPOPLPUSH](https://redis.io/commands/rpoplpush)
- [RPUSH](https://redis.io/commands/rpush)
- [RPUSHX](https://redis.io/commands/rpushx)
