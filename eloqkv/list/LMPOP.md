---
title: LMPOP
---

# LMPOP

Removes and returns the first `count` elements from the list stored at `key`. If the list does not exist or is empty, `nil` is returned.

## Syntax

```
LMPOP key count
```

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N) where N is the number of elements to be removed.
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

Now, let's remove the first 3 elements from `mylist`:

```
LMPOP mylist 3
```

This will output:

```
1) "a"
2) "b"
3) "c"
```

## RESP2/RESP3 Reply

Array reply: the elements removed from the list.
