---
title: ZREVRANGEBYLEX
---

# ZREVRANGEBYLEX

Returns a range of members in a sorted set, by lexicographical order, within the given range, ordered from higher to lower strings.

## Syntax

```
ZREVRANGEBYLEX key max min [LIMIT offset count]
```

## Parameters

- **key**: The name of the sorted set.
- **max**: The maximum lexicographical value (inclusive) of the range. The range can be inclusive (`[value`) or exclusive (`(value`).
- **min**: The minimum lexicographical value (inclusive) of the range. The range can be inclusive (`[value`) or exclusive (`(value`).
- **LIMIT offset count**: Optional. Specifies the number of members to return starting from the `offset`. If not provided, the entire range is returned.

## Details

- **Available since:** 2.8.9
- **Time complexity:** O(log(N) + M) where N is the number of elements in the sorted set, and M is the number of elements being returned.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZREVRANGEBYLEX` command retrieves members in a sorted set stored at `key` within the specified lexicographical range, ordered from higher to lower strings. This command is useful when the elements in the sorted set are strings, and you want to perform a reverse range query on those strings.

### Special Range Syntax

- **Inclusive Range**: Use `[` followed by the value (e.g., `[z`).
- **Exclusive Range**: Use `(` followed by the value (e.g., `(z`).
- **Unbounded Range**: Use `+` for the maximum and `-` for the minimum to specify an open-ended range.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 0 "apple" 0 "banana" 0 "cherry" 0 "date" 0 "fig"
```

To retrieve members between "date" and "banana" in reverse lexicographical order:

```
ZREVRANGEBYLEX myzset [date [banana
```

This will return:

```
1) "date"
2) "cherry"
3) "banana"
```

### Using Exclusive Range

To retrieve members between "date" (exclusive) and "banana" (exclusive) in reverse order:

```
ZREVRANGEBYLEX myzset (date (banana
```

This will return:

```
1) "cherry"
```

### Using Unbounded Range

To retrieve all members down to "cherry" in reverse lexicographical order:

```
ZREVRANGEBYLEX myzset [fig -
```

This will return:

```
1) "fig"
2) "date"
3) "cherry"
4) "banana"
5) "apple"
```

### Using LIMIT

To retrieve the first two members starting from "date" in reverse order:

```
ZREVRANGEBYLEX myzset [date [banana LIMIT 0 2
```

This will return:

```
1) "date"
2) "cherry"
```

## Edge Cases

- If `min` is greater than `max` in lexicographical order, `ZREVRANGEBYLEX` returns an empty array.
- If the key does not exist, `ZREVRANGEBYLEX` returns an empty array.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members in the specified lexicographical range, ordered from higher to lower.
