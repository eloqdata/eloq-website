---
title: LTRIM
---

# LTRIM

Trims a list so that it contains only the specified range of elements specified by the start and stop parameters. The start and stop are zero-based indexes, with 0 being the first element of the list (the head of the list), 1 being the next element, and so on. Negative indexes can be used to denote elements starting from the tail of the list, with -1 being the last element, -2 being the second last element, and so on.

## Syntax

```
LTRIM key start stop
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of elements to be removed.
- **ACL categories:** `@write`, `@list`, `@fast`

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

Now, let's trim `mylist` so that it contains elements from index 1 to 4 (inclusive):

```
LTRIM mylist 1 4
```

## RESP2/RESP3 Reply

Simple string reply: `OK` if the operation was successful.
