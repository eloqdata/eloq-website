---
title: LMOVE
---

# LMOVE

Atomically moves an element from one list to another. If the source list `source` does not exist or is empty, `nil` is returned. If the destination list `destination` does not exist, it is created as an empty list before performing the operation.

## Syntax

```
LMOVE source destination LEFT|RIGHT
```

## Details

- **Available since:** 7.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@list`, `@fast`

## Examples

Assume we have two lists, `list1` and `list2`, with elements "a", "b", and "c" in `list1`:

```
RPUSH list1 "a"
RPUSH list1 "b"
RPUSH list1 "c"
```

Now, let's move the leftmost element from `list1` to `list2`:

```
LMOVE list1 list2 LEFT
```

Retrieving the modified lists:

```
LRANGE list1 0 -1
LRANGE list2 0 -1
```

This will output:

```
list1:
1) "b"
2) "c"

list2:
1) "a"
```

## RESP2/RESP3 Reply

Bulk string reply: the element moved, or `nil` if the source list is empty or does not exist.
