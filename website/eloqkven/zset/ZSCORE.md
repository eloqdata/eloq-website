---
title: ZSCORE
---

# ZSCORE

Returns the score of a member in a sorted set.

## Syntax

```
ZSCORE key member
```

## Parameters

- **key**: The name of the sorted set.
- **member**: The member whose score you want to retrieve.

## Details

- **Available since:** 1.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@sortedset`, `@fast`

The `ZSCORE` command returns the score associated with the specified member in the sorted set stored at `key`. If the member does not exist in the sorted set, the command returns `nil`.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c"
```

To get the score of member "b":

```
ZSCORE myzset "b"
```

This will return:

```
"2"
```

### Member Not Found

If you try to get the score of a member that does not exist in the sorted set:

```
ZSCORE myzset "d"
```

This will return:

```
(nil)
```

## Edge Cases

- If the member does not exist in the sorted set, `ZSCORE` returns `nil`.
- If the key does not exist, `ZSCORE` returns `nil`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Bulk string reply: the score of the member as a string, or `nil` if the member does not exist.
