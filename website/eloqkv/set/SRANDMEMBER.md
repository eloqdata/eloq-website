---
title: SRANDMEMBER
---

# SRANDMEMBER

Returns one or more random elements from the set stored at `key`.

## Syntax

```
SRANDMEMBER key [count]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** Without the count argument, O(1). With the count argument, O(N) where N is the absolute value of the count.
- **ACL categories:** `@read`, `@set`, `@fast`

## Example

Assume we have a set called `myset` with members "member1", "member2", and "member3":

```
SADD myset "member1" "member2" "member3"
```

Now, let's retrieve a random element from `myset`:

```
SRANDMEMBER myset
```

This might output something like:

```
"member1"
```

Now, let's retrieve 2 random elements from `myset`:

```
SRANDMEMBER myset 2
```

This might output something like:

```
1) "member3"
2) "member2"
```

## RESP2/RESP3 Reply

Bulk string reply: the random element(s), or an array of elements when `count` is specified and positive. If the key does not exist, `nil` is returned.
