---
title: LINSERT
---

# LINSERT

Inserts an element into a list before or after another element. If the key does not exist, it is interpreted as an empty list and no operation is performed. An error is returned when the value stored at key is not a list.

## Syntax

```
LINSERT key BEFORE|AFTER pivot value
```

## Details

- **Available since:** 2.2.0
- **Time complexity:** O(N) where N is the number of elements in the list.
- **ACL categories:** `@write`, `@list`, `@slow`

## Examples

Assume we have a list called `mylist` with elements "World" and "Hello":

```
RPUSH mylist "World"
RPUSH mylist "Hello"
```

Now, let's insert "Goodbye" before "World":

```
LINSERT mylist BEFORE "World" "Goodbye"
```

Retrieving the modified list:

```
LRANGE mylist 0 -1
```

This will output:

```
1) "Goodbye"
2) "World"
3) "Hello"
```

## RESP2/RESP3 Reply

Integer reply: the length of the list after the insert operation.
