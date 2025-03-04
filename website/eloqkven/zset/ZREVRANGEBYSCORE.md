---
title: ZREVRANGEBYSCORE
---

# ZREVRANGEBYSCORE

Returns a range of members in a sorted set, by score, within the given score range, with scores ordered from high to low.

## Syntax

```
ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
```

## Parameters

- **key**: The name of the sorted set.
- **max**: The maximum score (inclusive) of the range. The range can be inclusive (`max`) or exclusive (`(max`).
- **min**: The minimum score (inclusive) of the range. The range can be inclusive (`min`) or exclusive (`(min`).
- **WITHSCORES**: Optional. When specified, the command returns both the members and their scores.
- **LIMIT offset count**: Optional. Specifies the number of members to return starting from the `offset`. If not provided, the entire range is returned.

## Details

- **Available since:** 2.2.0
- **Time complexity:** O(log(N) + M) where N is the number of elements in the sorted set, and M is the number of elements being returned.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZREVRANGEBYSCORE` command retrieves members in a sorted set stored at `key` within the specified score range, with the scores ordered from high to low. This command is useful when you need to query the sorted set for members within a specific score range but want the results in descending order by score.

### Special Range Syntax

- **Inclusive Range**: Use the score directly (e.g., `5`).
- **Exclusive Range**: Prefix the score with an open parenthesis (e.g., `(5`).
- **Unbounded Range**: Use `+inf` and `-inf` to represent the maximum and minimum possible scores, respectively.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To retrieve the members with scores between 4 and 2, in descending order:

```
ZREVRANGEBYSCORE myzset 4 2
```

This will return:

```
1) "d"
2) "c"
3) "b"
```

### Retrieving with Scores

To retrieve the members with scores between 4 and 2 along with their scores:

```
ZREVRANGEBYSCORE myzset 4 2 WITHSCORES
```

This will return:

```
1) "d"
2) "4"
3) "c"
4) "3"
5) "b"
6) "2"
```

### Using Exclusive Range

To retrieve the members with scores less than 4 but greater than or equal to 2:

```
ZREVRANGEBYSCORE myzset (4 2
```

This will return:

```
1) "c"
2) "b"
```

### Using LIMIT

To retrieve only the first two members with scores between 5 and 2:

```
ZREVRANGEBYSCORE myzset 5 2 LIMIT 0 2
```

This will return:

```
1) "e"
2) "d"
```

## Edge Cases

- If `min` is greater than `max`, `ZREVRANGEBYSCORE` returns an empty array.
- If the key does not exist, `ZREVRANGEBYSCORE` returns an empty array.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members in the specified score range, ordered from high to low, optionally with their scores if `WITHSCORES` is used.
