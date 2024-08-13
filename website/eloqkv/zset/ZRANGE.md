---
title: ZRANGE
---

# ZRANGE

Returns a range of members in a sorted set, by index. The members are ordered from the lowest to the highest score. Optionally, it can also return the scores of the selected members.

## Syntax

```
ZRANGE key start stop [WITHSCORES]
```

## Parameters

- **key**: The name of the sorted set.
- **start**: The starting index of the range (0-based). Negative indices can be used to indicate offsets from the end of the sorted set.
- **stop**: The ending index of the range (inclusive). Negative indices can be used to indicate offsets from the end of the sorted set.
- **WITHSCORES**: Optional. When specified, the command returns both the members and their scores.

## Details

- **Available since:** 1.2.0
- **Time complexity:** O(log(N) + M) where N is the number of elements in the sorted set, and M is the number of elements in the result.
- **ACL categories:** `@read`, `@sortedset`, `@fast`

The `ZRANGE` command is used to retrieve members in a sorted set stored at `key` within the specified range of indices. The range is inclusive of both `start` and `stop`, and members are returned in order of their scores.

### Indexing

- **0**: The first element in the sorted set.
- **-1**: The last element in the sorted set.
- **-2**: The second last element, and so on.

If `start` is greater than `stop`, an empty array is returned.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To retrieve the members from index 1 to 3:

```
ZRANGE myzset 1 3
```

This will return:

```
1) "b"
2) "c"
3) "d"
```

### Retrieving with Scores

To retrieve the members from index 0 to 2 along with their scores:

```
ZRANGE myzset 0 2 WITHSCORES
```

This will return:

```
1) "a"
2) "1"
3) "b"
4) "2"
5) "c"
6) "3"
```

### Using Negative Indices

To retrieve the last two members:

```
ZRANGE myzset -2 -1
```

This will return:

```
1) "d"
2) "e"
```

## Edge Cases

- If the key does not exist, `ZRANGE` returns an empty array.
- If the key exists but is not a sorted set, an error is returned.
- If `start` is greater than `stop`, `ZRANGE` returns an empty array.

## RESP2/RESP3 Reply

- Array reply: list of members in the specified range, optionally with their scores if `WITHSCORES` is used.
