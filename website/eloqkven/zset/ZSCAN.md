---
title: ZSCAN
---

# ZSCAN

Incrementally iterates over members and their scores in a sorted set.

## Syntax

```
ZSCAN key cursor [MATCH pattern] [COUNT count]
```

## Parameters

- **key**: The name of the sorted set.
- **cursor**: The cursor position from which to start iterating. The first call must use `0` as the cursor.
- **MATCH pattern**: Optional. Filters the results to only include members that match the given pattern.
- **COUNT count**: Optional. Provides a hint to the command about how many elements to return per call (the default is 10).

## Details

- **Available since:** 2.8.0
- **Time complexity:** O(1) per call, but the overall complexity is O(N) where N is the number of elements in the sorted set.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZSCAN` command is used to incrementally iterate over the members and their scores in a sorted set stored at `key`. Unlike commands that return all elements at once, `ZSCAN` returns elements in batches, which is useful for retrieving large datasets in a memory-efficient way.

### Cursor-Based Iteration

- The **cursor** is an opaque string that represents the position of the iterator. On the first call, `0` must be used to start iteration.
- The command returns a new cursor that should be used in subsequent calls. When the returned cursor is `0`, the iteration is complete.

### Pattern Matching

- The **MATCH** option allows filtering members by a pattern (e.g., `MATCH a*` to match members starting with "a").
- The pattern can include `*` (matches any number of characters), `?` (matches a single character), and character classes (e.g., `[a-z]`).

### Count Hint

- The **COUNT** option provides a hint to the server about the number of elements to return. However, this is only a suggestion, and the actual number of elements returned may vary.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To iterate over all members and their scores:

```
ZSCAN myzset 0
```

This might return:

```
1) "3"
2) 1) "a"
   2) "1"
   3) "c"
   4) "3"
```

The first element `"3"` is the next cursor, which you would use in a subsequent call to continue the iteration.

### Using MATCH

To iterate over members that start with the letter "b":

```
ZSCAN myzset 0 MATCH b*
```

This might return:

```
1) "0"
2) 1) "b"
   2) "2"
```

### Using COUNT

To retrieve members in larger batches:

```
ZSCAN myzset 0 COUNT 100
```

This command will attempt to return more elements per call, depending on the dataset and server configuration.

## Edge Cases

- If the key does not exist, `ZSCAN` returns a cursor of `0` and an empty array.
- If the key exists but is not a sorted set, an error is returned.
- The iteration is complete when the returned cursor is `0`.

## RESP2/RESP3 Reply

- Array reply: an array containing the next cursor and a list of members with their scores.
