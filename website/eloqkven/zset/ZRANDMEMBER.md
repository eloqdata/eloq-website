---
title: ZRANDMEMBER
---

# ZRANDMEMBER

Returns one or more random members from a sorted set without removing them. Optionally, it can also return the scores of the randomly selected members.

## Syntax

```
ZRANDMEMBER key [count [WITHSCORES]]
```

## Parameters

- **key**: The name of the sorted set.
- **count**: Optional. Specifies the number of random members to return. If not provided, a single random member is returned. If count is negative, the command will return the same element multiple times.
- **WITHSCORES**: Optional. When specified, the command returns both the members and their scores.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(1) if `count` is 1, otherwise O(N) where N is the absolute value of `count`.
- **ACL categories:** `@read`, `@sortedset`, `@fast`

The `ZRANDMEMBER` command is used to retrieve random members from the sorted set stored at `key`. The members are returned without being removed from the sorted set. If `count` is positive, the command returns a list of distinct elements. If `count` is negative, the command allows repeated members in the output.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To retrieve a single random member:

```
ZRANDMEMBER myzset
```

This will return a random member, e.g.,:

```
"c"
```

### Retrieving Multiple Members

To retrieve three random members:

```
ZRANDMEMBER myzset 3
```

This will return:

```
1) "b"
2) "d"
3) "a"
```

### Retrieving Multiple Members with Scores

To retrieve two random members along with their scores:

```
ZRANDMEMBER myzset 2 WITHSCORES
```

This will return:

```
1) "e"
2) "5"
3) "a"
4) "1"
```

### Allowing Repeated Members

To retrieve three random members, allowing repetition:

```
ZRANDMEMBER myzset -3
```

This could return:

```
1) "b"
2) "b"
3) "d"
```

## Edge Cases

- If the key does not exist, `ZRANDMEMBER` returns a `nil` reply.
- If the key exists but is not a sorted set, an error is returned.
- If `count` is 0, an empty array is returned.

## RESP2/RESP3 Reply

- Bulk string reply if `count` is not specified: a single random member.
- Array reply if `count` is specified: a list of random members, optionally with their scores if `WITHSCORES` is used.
