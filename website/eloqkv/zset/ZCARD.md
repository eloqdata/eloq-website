---
title: ZCARD
---

# ZCARD

Returns the number of elements in the sorted set stored at the specified key.

## Syntax

```
ZCARD key
```

## Parameters

- **key**: The name of the sorted set.

## Details

- **Available since:** 1.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@sortedset`, `@fast`

If the key does not exist, `ZCARD` returns `0`, as an empty sorted set is considered to be of size `0`.

## Example

Assume we have a sorted set called `myzset` with three members:

```
ZADD myzset 1 "member1" 2 "member2" 3 "member3"
```

To get the number of elements in `myzset`:

```
ZCARD myzset
```

This will return:

```
(integer) 3
```

## Edge Cases

- If the specified key does not exist, `ZCARD` will return `0`.
- If the specified key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of elements in the sorted set.
