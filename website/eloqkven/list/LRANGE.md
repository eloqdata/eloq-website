---
title: LRANGE
---

# LRANGE

Returns the specified elements of the list stored at `key`. The offsets start and stop are zero-based indexes, with 0 being the first element of the list (the head of the list), 1 being the next element, and so on. Negative indexes can be used to denote elements starting from the tail of the list, with -1 being the last element, -2 being the second last element, and so on.

## Syntax

```
LRANGE key start stop
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(S+N) where S is the distance of start from the head and N is the number of elements to be returned.
- **ACL categories:** `@read`, `@list`, `@fast`

## Example

Assume we have a list called `mylist` with elements "a", "b", "c", "d", "e", and "f":

```
RPUSH mylist "a"
RPUSH mylist "b"
RPUSH mylist "c"
RPUSH mylist "d"
RPUSH mylist "e"
RPUSH mylist "f"
```

Now, let's retrieve elements from index 1 to 3 (inclusive) from `mylist`:

```
LRANGE mylist 1 3
```

This will output:

```
1) "b"
2) "c"
3) "d"
```

## RESP2/RESP3 Reply

Array reply: list of elements in the specified range.
