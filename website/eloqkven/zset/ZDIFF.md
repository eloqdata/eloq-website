---
title: ZDIFF
---

# ZDIFF

Computes the difference between the first sorted set and all successive sorted sets and returns the members of the resulting sorted set.

## Syntax

```
ZDIFF numkeys key [key ...] [WITHSCORES]
```

## Parameters

- **numkeys**: The number of sorted sets involved in the operation, including the first set.
- **key**: The name of each sorted set involved in the operation.
- **WITHSCORES**: Optional. When specified, the command returns both the members and their scores.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N + M log(M)) where N is the size of the input sorted sets and M is the size of the result set.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZDIFF` command returns the difference between the first sorted set and all the successive sorted sets. Specifically, it returns the members that are present in the first sorted set but not in any of the other sets.

## Examples

Assume we have three sorted sets:

```
ZADD set1 1 "a" 2 "b" 3 "c"
ZADD set2 1 "c" 2 "d"
ZADD set3 1 "a"
```

To find the difference between `set1` and the others:

```
ZDIFF 3 set1 set2 set3
```

This will return:

```
1) "b"
```

To get the difference along with scores:

```
ZDIFF 3 set1 set2 set3 WITHSCORES
```

This will return:

```
1) "b"
2) "2"
```

## Edge Cases

- If the first set is empty, `ZDIFF` will return an empty array.
- If there are no members left after subtracting all the successive sets, `ZDIFF` will return an empty array.
- If the key does not exist, it is treated as an empty sorted set.
- If any of the keys refer to non-sorted set data types, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members or members with their scores, depending on whether `WITHSCORES` is used.
