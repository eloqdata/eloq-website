---
title: RPUSHX
---

# RPUSHX

Appends a value to the end of a list, only if the list already exists. If the key does not exist, no operation is performed. When the key holds a value that is not a list, an error is returned.

## Syntax

```
RPUSHX key value
```

## Details

- **Available since:** 2.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@list`, `@fast`

## Example

Assume we have an empty list called `mylist`. Now, let's try to add element "a" to `mylist`:

```
RPUSHX mylist "a"
```

Since `mylist` does not exist initially, no operation is performed.

## RESP2/RESP3 Reply

Integer reply: the length of the list after the push operation, or `0` if no operation was performed.
