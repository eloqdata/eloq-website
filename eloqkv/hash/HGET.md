---
title: HGET
---

# HGET

Returns the value associated with `field` in the hash stored at `key`.

## Syntax

```
HGET key field
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1" and "field2" with corresponding values:

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
```

Now, let's retrieve the value associated with "field1":

```
HGET myhash field1
```

This will output:

```
"value1"
```

## RESP2/RESP3 Reply

Bulk string reply: the value associated with the field, or `nil` if the field does not exist or the key does not exist.
