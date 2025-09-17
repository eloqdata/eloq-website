---
title: HINCRBYFLOAT
---

# HINCRBYFLOAT

Increments the value of a field in a hash stored at `key` by the given `increment`. If the field does not exist, it is set to `increment`. If the key does not exist, a new hash is created with the field set to `increment`. The increment can be a positive or negative floating-point number.

## Syntax

```
HINCRBYFLOAT key field increment
```

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with a field "balance" initialized to 100.5:

```
HSET myhash balance 100.5
```

Now, let's increment the value of "balance" by 25.75:

```
HINCRBYFLOAT myhash balance 25.75
```

This will output:

```
"126.25"
```

## RESP2/RESP3 Reply

Bulk string reply: the value of the field after the increment.
