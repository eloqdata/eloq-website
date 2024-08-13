---
title: ZLEXCOUNT
---

# ZLEXCOUNT

Counts the number of members in a sorted set between a given lexicographical range.

## Syntax

```
ZLEXCOUNT key min max
```

## Parameters

- **key**: The name of the sorted set.
- **min**: The minimum lexicographical value (inclusive) of the range.
- **max**: The maximum lexicographical value (inclusive) of the range.

## Details

- **Available since:** 2.8.9
- **Time complexity:** O(log(N)) with N being the number of elements in the sorted set.
- **ACL categories:** `@read`, `@sortedset`, `@fast`

The `ZLEXCOUNT` command is used to count the number of elements in the sorted set stored at `key` with values lexicographically between `min` and `max`.

### Special Range Syntax

- **Inclusive Range**: Specify the range with the value directly (e.g., `min`, `max`).
- **Exclusive Range**: Prefix the value with an open parenthesis to exclude it from the range (e.g., `(min`, `(max`).
- **Unbounded Range**: Use `-` for the minimum and `+` for the maximum to specify an open-ended range.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 0 "apple" 0 "banana" 0 "cherry" 0 "date" 0 "fig"
```

To count the number of members between "banana" and "date" (inclusive):

```
ZLEXCOUNT myzset [banana [date
```

This will return:

```
(integer) 3
```

### Using Exclusive Range

To count the number of members between "banana" (exclusive) and "date" (exclusive):

```
ZLEXCOUNT myzset (banana (date
```

This will return:

```
(integer) 1
```

### Using Unbounded Range

To count all members up to "cherry":

```
ZLEXCOUNT myzset - [cherry
```

This will return:

```
(integer) 3
```

## Edge Cases

- If `min` is greater than `max`, `ZLEXCOUNT` returns `0`.
- If the key does not exist, `ZLEXCOUNT` returns `0`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of elements in the specified lexicographical range.
