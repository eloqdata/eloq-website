---
title: SPOP
---

# SPOP

Removes and returns one or more random elements from the set stored at `key`.

## Syntax

```
SPOP key [count]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for every call, O(N) for every element returned, where N is the number of elements returned.
- **ACL categories:** `@write`, `@set`, `@fast`

## Example

Assume we have a set called `myset` with members "member1", "member2", and "member3":

```
SADD myset "member1" "member2" "member3"
```

Now, let's remove and return a random element from `myset`:

```
SPOP myset
```

This might output something like:

```
"member3"
```

Now, let's remove and return 2 random elements from `myset`:

```
SPOP myset 2
```

This might output something like:

```
1) "member1"
2) "member2"
```

## RESP2/RESP3 Reply

Bulk string reply: the removed random element(s), or `nil` when `count` is specified and the key does not exist.
