---
title: HMGET
---

# HMGET

Returns the values associated with the specified fields in the hash stored at `key`.

## Syntax

```
HMGET key field [field ...]
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N) where N is the number of fields being retrieved.
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1", "field2", and "field3" with corresponding values:

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
HSET myhash field3 "value3"
```

Now, let's retrieve the values associated with "field1" and "field3" from `myhash`:

```
HMGET myhash field1 field3
```

This will output:

```
1) "value1"
2) "value3"
```

## RESP2/RESP3 Reply

Array reply: list of values associated with the specified fields.
