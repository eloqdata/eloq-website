---
title: ZREMRANGEBYLEX
---

# ZREMRANGEBYLEX

Removes all members in a sorted set between the given lexicographical range.

## Syntax

```
ZREMRANGEBYLEX key min max
```

## Parameters

- **key**: The name of the sorted set.
- **min**: The minimum lexicographical value (inclusive) of the range. The range can be inclusive (`[value`) or exclusive (`(value`).
- **max**: The maximum lexicographical value (inclusive) of the range. The range can be inclusive (`[value`) or exclusive (`(value`).

## Details

- **Available since:** 2.8.9
- **Time complexity:** O(log(N) + M) with N being the number of elements in the sorted set and M the number of elements removed.
- **ACL categories:** `@write`, `@sortedset`, `@slow`

The `ZREMRANGEBYLEX` command removes all members in the sorted set stored at `key` that are lexicographically between `min` and `max`. The command is useful when you need to remove a range of members based on their lexicographical order.

### Special Range Syntax

- **Inclusive Range**: Use `[` followed by the value (e.g., `[a`).
- **Exclusive Range**: Use `(` followed by the value (e.g., `(a`).
- **Unbounded Range**: Use `-` for the minimum and `+` for the maximum to specify an open-ended range.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 0 "apple" 0 "banana" 0 "cherry" 0 "date" 0 "fig"
```

To remove members between "banana" and "date" (inclusive):

```
ZREMRANGEBYLEX myzset [banana [date
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
1) "apple"
2) "fig"
```

### Using Exclusive Range

To remove members between "banana" (exclusive) and "date" (exclusive):

```
ZREMRANGEBYLEX myzset (banana (date
```

This will return:

```
(integer) 1
```

After running this command, only "cherry" will be removed, and the set will contain:

```
1) "apple"
2) "banana"
3) "date"
4) "fig"
```

### Using Unbounded Range

To remove all members up to "cherry":

```
ZREMRANGEBYLEX myzset - [cherry
```

This will return:

```
(integer) 3
```

After running this command, the sorted set will contain:

```
1) "date"
2) "fig"
```

## Edge Cases

- If `min` is greater than `max`, `ZREMRANGEBYLEX` returns `0`.
- If the key does not exist, `ZREMRANGEBYLEX` returns `0`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of members removed from the sorted set.
