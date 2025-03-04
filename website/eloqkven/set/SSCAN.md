---
title: SSCAN
---

# SSCAN

Incrementally iterates over the elements of a set.

## Syntax

```
SSCAN key cursor [MATCH pattern] [COUNT count]
```

## Details

- **Available since:** 2.8.0
- **Time complexity:** O(1) for every call. O(N) for a full iteration, where N is the number of elements inside the collection.
- **ACL categories:** `@read`, `@set`, `@slow`

## Example

Assume we have a set called `myset` with members "member1", "member2", and "member3":

```
SADD myset "member1" "member2" "member3"
```

Now, let's scan `myset`:

```
SSCAN myset 0
```

This might output something like:

```
1) "0"
2) 1) "member1"
   2) "member2"
   3) "member3"
```

## RESP2/RESP3 Reply

Array reply: a two-element array containing the next cursor and an array of elements.
