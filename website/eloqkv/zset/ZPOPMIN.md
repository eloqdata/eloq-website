---
title: ZPOPMIN
---

# ZPOPMIN

Removes and returns one or more members with the lowest scores in a sorted set.

## Syntax

```
ZPOPMIN key [count]
```

## Parameters

- **key**: The name of the sorted set.
- **count**: Optional. Specifies the number of members to pop. If not provided, the default is 1.

## Details

- **Available since:** 5.0.0
- **Time complexity:** O(log(N) \* M) with N being the number of elements in the sorted set and M being the number of elements popped.
- **ACL categories:** `@write`, `@sortedset`, `@fast`

The `ZPOPMIN` command is used to remove and return the member(s) with the lowest score(s) from the sorted set stored at `key`. If multiple members have the same lowest score, they are returned in lexicographical order.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "a" 2 "b" 3 "c"
```

To pop the member with the lowest score:

```
ZPOPMIN myzset
```

This will return:

```
1) "a"
2) "1"
```

### Popping Multiple Members

To pop the two members with the lowest scores:

```
ZPOPMIN myzset 2
```

This will return:

```
1) "a"
2) "1"
3) "b"
4) "2"
```

### Handling an Empty Set

If `myzset` is now empty and we try to pop again:

```
ZPOPMIN myzset
```

This will return:

```
(nil)
```

## Edge Cases

- If the sorted set is empty, `ZPOPMIN` returns a `nil` reply.
- If the specified `count` is greater than the number of available members, all members are returned.
- If the key does not exist, `ZPOPMIN` returns a `nil` reply.
- If the key exists but is not a sorted set, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members and their scores, ordered from the lowest to the highest scores.
