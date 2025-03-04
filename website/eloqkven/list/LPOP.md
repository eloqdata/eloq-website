---
title: LPOP
---

# LPOP

Removes and returns the first `count` elements from the list stored at `key`. If the list does not exist or is empty, `nil` is returned.

## Syntax

```
LPOP key [count]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for every element to be removed, O(N) overall where N is the number of elements returned.
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

Now, let's remove the first element from `mylist`:

```
LPOP mylist
```

This will output:

```
"a"
```

## RESP2/RESP3 Reply

Bulk string reply: the element removed from the list, or `nil` if the list is empty.
