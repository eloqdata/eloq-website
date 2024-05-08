---
title: HSCAN
---

# HSCAN

Incrementally iterates over a hash and its associated fields.

## Syntax

```
HSCAN key cursor [MATCH pattern] [COUNT count]
```

## Details

- **Available since:** 2.8.0
- **Time complexity:** O(1) for every call. O(N) for a full iteration, where N is the number of elements inside the collection.
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1", "field2", and "field3" with corresponding values:

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
HSET myhash field3 "value3"
```

Now, let's scan `myhash`:

```
HSCAN myhash 0
```

This will output something like:

```
1) "0"
2) 1) "field1"
   2) "value1"
   3) "field2"
   4) "value2"
   5) "field3"
   6) "value3"
```

## RESP2/RESP3 Reply

Array reply: a two-element array containing the next cursor and an array of field-value pairs.
