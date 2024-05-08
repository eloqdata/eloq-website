---
title: HINCRBY
---

# HINCRBY

Increments the value of a field in a hash stored at `key` by the given `increment`. If the field does not exist, it is set to `increment`. If the key does not exist, a new hash is created with the field set to `increment`.

## Syntax

```
HINCRBY key field increment
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with a field "counter" initialized to 5:

```
HSET myhash counter 5
```

Now, let's increment the value of "counter" by 3:

```
HINCRBY myhash counter 3
```

This will output:

```
(integer) 8
```

## RESP2/RESP3 Reply

Integer reply: the value of the field after the increment.
