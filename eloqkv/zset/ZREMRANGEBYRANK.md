---
title: ZREMRANGEBYRANK
---

# ZREMRANGEBYRANK

Removes all members in a sorted set within the given rank range.

## Syntax

```
ZREMRANGEBYRANK key start stop
```

## Parameters

- **key**: The name of the sorted set.
- **start**: The starting rank of the range (0-based index). Negative values indicate offsets from the end of the sorted set.
- **stop**: The ending rank of the range (inclusive). Negative values indicate offsets from the end of the sorted set.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(log(N) + M) with N being the number of elements in the sorted set and M the number of elements removed.
- **ACL categories:** `@write`, `@sortedset`, `@slow`

The `ZREMRANGEBYRANK` command removes all members in the sorted set stored at `key` with ranks between `start` and `stop`. The rank is based on the sorted order of the elements, with `0` being the element with the lowest score. Negative values can be used to specify ranks starting from the end of the set, with `-1` being the last element.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To remove members from rank 1 to rank 3:

```
ZREMRANGEBYRANK myzset 1 3
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

### Using Negative Indices

To remove the last two members:

```
ZREMRANGEBYRANK myzset -2 -1
```

This will return:

```
(integer) 2
```

After running this command, the sorted set will contain:

```
1) "a"
2) "b"
3) "c"
```

## Edge Cases

- If `start` is greater than `stop`, `ZREMRANGEBYRANK` returns `0`.
- If the key does not exist, `ZREMRANGEBYRANK` returns `0`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of members removed from the sorted set.
