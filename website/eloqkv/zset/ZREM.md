---
title: ZREM
---

# ZREM

Removes one or more members from a sorted set.

## Syntax

```
ZREM key member [member ...]
```

## Parameters

- **key**: The name of the sorted set.
- **member**: The member(s) to be removed from the sorted set.

## Details

- **Available since:** 1.2.0
- **Time complexity:** O(M\*log(N)) where N is the number of elements in the sorted set, and M is the number of members to be removed.
- **ACL categories:** `@write`, `@sortedset`, `@fast`

The `ZREM` command removes the specified members from the sorted set stored at `key`. If the specified members are not part of the sorted set, they are simply ignored. If the key does not exist, it is treated as an empty sorted set and no operation is performed.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c" 4 "d" 5 "e"
```

To remove the member "b":

```
ZREM myzset "b"
```

This will return:

```
(integer) 1
```

### Removing Multiple Members

To remove members "c" and "e":

```
ZREM myzset "c" "e"
```

This will return:

```
(integer) 2
```

### Attempting to Remove Non-Existent Members

If you try to remove a member that does not exist:

```
ZREM myzset "z"
```

This will return:

```
(integer) 0
```

## Edge Cases

- If the key does not exist, `ZREM` returns `0`.
- If none of the specified members exist in the sorted set, `ZREM` returns `0`.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of members removed from the sorted set, not including non-existent members.
