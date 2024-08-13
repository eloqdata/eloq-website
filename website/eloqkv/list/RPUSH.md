---
title: RPUSH
---

# RPUSH

Appends all the specified values to the end of the list stored at `key`. If the key does not exist, it is created as an empty list before performing the push operations. When the key holds a value that is not a list, an error is returned.

## Syntax

```
RPUSH key value [value ...]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each element added, O(N) overall where N is the number of elements to be inserted.
- **ACL categories:** `@write`, `@list`, `@fast`

## Example

Assume we have an empty list called `mylist`. Now, let's add elements "a", "b", and "c" to `mylist`:

```
RPUSH mylist "a" "b" "c"
```

## RESP2/RESP3 Reply

Integer reply: the length of the list after the push operation.
