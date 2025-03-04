---
title: ZREMRANGEBYSCORE
---

# ZREMRANGEBYSCORE

Removes all members in a sorted set within the given score range.

## Syntax

```
ZREMRANGEBYSCORE key min max
```

## Parameters

- **key**: The name of the sorted set.
- **min**: The minimum score (inclusive) of the range. The range can be inclusive (`min`) or exclusive (`(min`).
- **max**: The maximum score (inclusive) of the range. The range can be inclusive (`max`) or exclusive (`(max`).

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(log(N) + M) with N being the number of elements in the sorted set and M the number of elements removed.
- **ACL categories:** `@write`, `@sortedset`, `@slow`

The `ZREMRANGEBYSCORE` command removes all members in the sorted set stored at `key` with scores between `min` and `max`. This command is useful when you want to remove a range of members based on their scores.

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

To remove members with scores between 2 and 4:

```
ZREMRANGEBYSCORE myzset 2 4
```

This will return:

```
(integer) 3
```

After running this command, the sorted set will contain:

```
ZRANGE myzset 0 -1
```

This will return:

```
1) "a"
2) "e"
```

### Using Exclusive Range

To remove members with scores greater than 2 but less than or equal to 4:

```
ZREMRANGEBYSCORE myzset (2 4
```

This will return:

```
(integer) 2
```

After running this command, the sorted set will contain:

```
1) "a"
2) "b"
3) "e"
```

### Using Unbounded Range

To remove all members with a score less than or equal to 3:

```
ZREMRANGEBYSCORE myzset -inf 3
```

This will return:

```
(integer) 3
```

After running this command, the sorted set will contain:

```
1) "d"
2) "e"
```

## Edge Cases

- If `min` is greater than `max`, `ZREMRANGEBYSCORE` returns `0`.
- If the key does not exist, `ZREMRANGEBYSCORE` returns `0`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of members removed from the sorted set.
