---
title: ZRANGEBYLEX
---

# ZRANGEBYLEX

Returns a range of members in a sorted set, by lexicographical order, within the given lexicographical range.

## Syntax

```
ZRANGEBYLEX key min max [LIMIT offset count]
```

## Parameters

- **key**: The name of the sorted set.
- **min**: The minimum lexicographical value (inclusive) of the range. The range can be inclusive (`[value`) or exclusive (`(value`).
- **max**: The maximum lexicographical value (inclusive) of the range. The range can be inclusive (`[value`) or exclusive (`(value`).
- **LIMIT offset count**: Optional. Specifies the number of members to return starting from the `offset`. If not provided, the entire range is returned.

## Details

- **Available since:** 2.8.9
- **Time complexity:** O(log(N) + M) where N is the number of elements in the sorted set, and M is the number of elements being returned.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZRANGEBYLEX` command is used to retrieve members in a sorted set stored at `key` within the specified lexicographical range, ordered by lexicographical order. This command is useful when the elements in the sorted set are strings and you want to perform a range query on those strings.

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

To retrieve members between "banana" and "date" (inclusive):

```
ZRANGEBYLEX myzset [banana [date
```

This will return:

```
1) "banana"
2) "cherry"
3) "date"
```

### Using Exclusive Range

To retrieve members between "banana" (exclusive) and "date" (exclusive):

```
ZRANGEBYLEX myzset (banana (date
```

This will return:

```
1) "cherry"
```

### Using Unbounded Range

To retrieve all members up to "date":

```
ZRANGEBYLEX myzset - [date
```

This will return:

```
1) "apple"
2) "banana"
3) "cherry"
4) "date"
```

### Using LIMIT

To retrieve the first two members starting from "banana":

```
ZRANGEBYLEX myzset [banana [date LIMIT 0 2
```

This will return:

```
1) "banana"
2) "cherry"
```

## Edge Cases

- If `min` is greater than `max`, `ZRANGEBYLEX` returns an empty array.
- If the key does not exist, `ZRANGEBYLEX` returns an empty array.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members in the specified lexicographical range.
