---
title: LPOS
---

# LPOS

Returns the index of the first occurrence of an element matching the specified value in a list stored at `key`. If the element is not found or the key does not exist, `nil` is returned.

## Syntax

```
LPOS key element [RANK rank]
```

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N) where N is the number of elements in the list.
- **ACL categories:** `@read`, `@list`, `@fast`

## Example

Assume we have a list called `mylist` with elements "a", "b", "c", "b", and "d":

```
RPUSH mylist "a"
RPUSH mylist "b"
RPUSH mylist "c"
RPUSH mylist "b"
RPUSH mylist "d"
```

Now, let's find the index of the first occurrence of "b" in `mylist`:

```
LPOS mylist "b"
```

This will output:

```
1
```

## RESP2/RESP3 Reply

Integer reply: the index of the first occurrence of the element, or `nil` if the element is not found.
