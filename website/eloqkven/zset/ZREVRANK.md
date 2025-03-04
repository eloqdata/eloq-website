---
title: ZREVRANK
---

# ZREVRANK

Returns the rank of a member in a sorted set, with the scores ordered from high to low. The rank is 0-based, meaning that the member with the highest score has rank 0.

## Syntax

```
ZREVRANK key member
```

## Parameters

- **key**: The name of the sorted set.
- **member**: The member whose rank you want to determine.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(log(N)) where N is the number of elements in the sorted set.
- **ACL categories:** `@read`, `@sortedset`, `@fast`

The `ZREVRANK` command returns the rank of a specified member in the sorted set stored at `key`, with scores ordered from high to low. If the member exists in the sorted set, the command returns its rank as an integer. If the member does not exist, `ZREVRANK` returns `nil`.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To get the rank of member "c" with scores ordered from high to low:

```
ZREVRANK myzset "c"
```

This will return:

```
(integer) 2
```

### Member Not Found

If you try to get the rank of a member that does not exist in the sorted set:

```
ZREVRANK myzset "f"
```

This will return:

```
(nil)
```

## Edge Cases

- If the member does not exist in the sorted set, `ZREVRANK` returns `nil`.
- If the key does not exist, `ZREVRANK` returns `nil`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the rank of the member if it exists, or `nil` if the member does not exist.
