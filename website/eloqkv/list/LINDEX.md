---
title: LINDEX
---

# LINDEX

Returns the element at index `index` in the list stored at `key`. Negative indices are supported, with -1 being the last element of the list, -2 the penultimate, and so forth. When the value at `key` is not a list, an error is returned.

## Syntax

```
LINDEX key index
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of elements in the list. Index fetching is O(1) when the list is implemented as a linked list and small indexes are used.
- **ACL categories:** `@read`, `@list`, `@slow`

## Examples

Assume we have a list called `mylist` with elements "Hello", "World", and "Goodbye":

```
RPUSH mylist "Hello"
RPUSH mylist "World"
RPUSH mylist "Goodbye"
```

Now, let's fetch the element at index 1:

```
LINDEX mylist 1
```

This will output:

```
"World"
```

## RESP2/RESP3 Reply

Bulk string reply: the requested element, or `nil` when `index` is out of range.
