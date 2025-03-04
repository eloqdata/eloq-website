---
title: LREM
---

# LREM

Removes all occurrences of the specified values from the list stored at `key`. The count argument specifies the number of matching elements to remove. If count is 0, all occurrences of the value are removed. If count is negative, elements are removed from tail to head, and if positive, from head to tail.

## Syntax

```
LREM key count value
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the length of the list.
- **ACL categories:** `@write`, `@list`, `@fast`

## Example

Assume we have a list called `mylist` with elements "a", "b", "c", "b", and "d":

```
RPUSH mylist "a"
RPUSH mylist "b"
RPUSH mylist "c"
RPUSH mylist "b"
RPUSH mylist "d"
```

Now, let's remove all occurrences of "b" from `mylist`:

```
LREM mylist 0 "b"
```

This will output:

```
(integer) 2
```

## RESP2/RESP3 Reply

Integer reply: the number of removed elements.
