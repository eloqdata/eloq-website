---
title: LPUSHX
---

# LPUSHX

Inserts a value at the head of the list stored at `key`, only if the list already exists. If the key does not exist, no operation is performed. When the key holds a value that is not a list, an error is returned.

## Syntax

```
LPUSHX key value
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@list`, `@fast`

## Example

Assume we have an empty list called `mylist`. Now, let's try to add element "a" to `mylist`:

```
LPUSHX mylist "a"
```

Since `mylist` does not exist initially, no operation is performed.

## RESP2/RESP3 Reply

Integer reply: the length of the list after the push operation, or `0` if no operation was performed.
