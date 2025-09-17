---
title: ZRANGEBYSCORE
---

# ZRANGEBYSCORE

Returns a range of members in a sorted set, by score, within the given score range.

## Syntax

```
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
```

## Parameters

- **key**: The name of the sorted set.
- **min**: The minimum score (inclusive) of the range. The range can be inclusive (`min`) or exclusive (`(min`).
- **max**: The maximum score (inclusive) of the range. The range can be inclusive (`max`) or exclusive (`(max`).
- **WITHSCORES**: Optional. Returns the scores of the selected members along with the members.
- **LIMIT offset count**: Optional. Specifies the number of members to return starting from the `offset`. If not provided, the entire range is returned.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(log(N) + M) where N is the number of elements in the sorted set, and M is the number of elements being returned.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZRANGEBYSCORE` command is used to retrieve members in a sorted set stored at `key` within the specified score range. The members are returned in order from the lowest to the highest score.

### Special Range Syntax

- **Inclusive Range**: Use the score directly (e.g., `1`).
- **Exclusive Range**: Prefix the score with an open parenthesis (e.g., `(1`).
- **Unbounded Range**: Use `-inf` and `+inf` to represent the minimum and maximum possible scores, respectively.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To retrieve the members with scores between 2 and 4:

```
ZRANGEBYSCORE myzset 2 4
```

This will return:

```
1) "b"
2) "c"
3) "d"
```

### Retrieving with Scores

To retrieve the members with scores between 2 and 4 along with their scores:

```
ZRANGEBYSCORE myzset 2 4 WITHSCORES
```

This will return:

```
1) "b"
2) "2"
3) "c"
4) "3"
5) "d"
6) "4"
```

### Using Exclusive Range

To retrieve the members with scores greater than 2 but less than or equal to 4:

```
ZRANGEBYSCORE myzset (2 4
```

This will return:

```
1) "c"
2) "d"
```

### Using LIMIT

To retrieve only the first two members with scores between 2 and 4:

```
ZRANGEBYSCORE myzset 2 4 LIMIT 0 2
```

This will return:

```
1) "b"
2) "c"
```

## Edge Cases

- If `min` is greater than `max`, `ZRANGEBYSCORE` returns an empty array.
- If the key does not exist, `ZRANGEBYSCORE` returns an empty array.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members in the specified score range, optionally with their scores if `WITHSCORES` is used.
