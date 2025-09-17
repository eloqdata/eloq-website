---
title: RPOP
---

# RPOP

Removes and returns the last element of the list stored at `key`.

## Syntax

```
RPOP key
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
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

Now, let's remove and return the last element from `mylist`:

```
RPOP mylist
```

This will output:

```
"e"
```

## RESP2/RESP3 Reply

Bulk string reply: the element removed from the list, or `nil` if the list is empty.
