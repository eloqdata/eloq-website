---
title: LSET
---

# LSET

Sets the value of an element in a list by its index. If the index is out of range, an error is returned.

## Syntax

```
LSET key index value
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the length of the list.
- **ACL categories:** `@write`, `@list`, `@fast`

## Example

Assume we have a list called `mylist` with elements "a", "b", "c", "d", and "e":

```
RPUSH mylist "a"
RPUSH mylist "b"
RPUSH mylist "c"
RPUSH mylist "d"
RPUSH mylist "e"
```

Now, let's set the value at index 2 in `mylist` to "z":

```
LSET mylist 2 "z"
```

## RESP2/RESP3 Reply

Simple string reply: `OK` if the operation was successful.
