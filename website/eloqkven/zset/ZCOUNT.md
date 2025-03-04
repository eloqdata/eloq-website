---
title: ZCOUNT
---

# ZCOUNT

Returns the number of elements in the sorted set at the specified key with a score between the given minimum and maximum values.

## Syntax

```
ZCOUNT key min max
```

## Parameters

- **key**: The name of the sorted set.
- **min**: The minimum score (inclusive) of the range.
- **max**: The maximum score (inclusive) of the range.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(log(N)) with N being the number of elements in the sorted set.
- **ACL categories:** `@read`, `@sortedset`, `@fast`

The `min` and `max` parameters can be specified with the following options:

- Include the value with the score by using the score directly (e.g., `2`).
- Exclude the value with the score by prefixing the score with an open parenthesis (e.g., `(2`).
- Use `-inf` and `+inf` to represent the minimum and maximum possible scores, respectively.

## Examples

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "member1" 2 "member2" 3 "member3" 4 "member4"
```

To count the number of members with scores between 2 and 3 inclusive:

```
ZCOUNT myzset 2 3
```

This will return:

```
(integer) 2
```

To count the number of members with scores greater than 2 but less than or equal to 4:

```
ZCOUNT myzset (2 4
```

This will return:

```
(integer) 2
```

## Edge Cases

- If `min` is greater than `max`, `ZCOUNT` returns `0`.
- If the sorted set does not exist, `ZCOUNT` returns `0`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of elements in the specified score range.
