---
title: ZMSCORE
---

# ZMSCORE

Returns the scores associated with the specified members in the sorted set stored at the specified key.

## Syntax

```
ZMSCORE key member [member ...]
```

## Parameters

- **key**: The name of the sorted set.
- **member**: The member(s) whose scores are to be retrieved.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N) where N is the number of members being requested.
- **ACL categories:** `@read`, `@sortedset`, `@fast`

The `ZMSCORE` command returns the scores of the specified members in the sorted set stored at `key`. For every member that does not exist in the sorted set, a `nil` value is returned.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c"
```

To retrieve the scores of members "a" and "c":

```
ZMSCORE myzset "a" "c"
```

This will return:

```
1) "1"
2) "3"
```

### Handling Non-Existent Members

If you request the score of a member that does not exist:

```
ZMSCORE myzset "a" "d"
```

This will return:

```
1) "1"
2) (nil)
```

## Edge Cases

- If the key does not exist, `ZMSCORE` returns an array of `nil` values for each member.
- If a member does not exist in the sorted set, `nil` is returned for that member.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of scores for the specified members, with `nil` for members that do not exist.
