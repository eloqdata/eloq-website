---
title: LINDEX
---

# LINDEX

Retrieves the element at index `index` in the list stored at `key`. If the index is out of bounds, `nil` is returned.

## Syntax

```
LINDEX key index
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of elements to traverse to get to the element at index. This is O(1) when `index` is near the head or tail of the list.

## Examples

Retrieve the first element from a list:

```
LINDEX mylist 0
```

Retrieve the third element from a list:

```
LINDEX mylist 2
```

## RESP2/RESP3 Reply

Bulk string reply: the element at the specified index, or `nil` if the index is out of range.
