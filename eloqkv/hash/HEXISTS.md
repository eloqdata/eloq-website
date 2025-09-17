---
title: HEXISTS
---

# HEXISTS

Returns if a field exists in a hash stored at `key`.

## Syntax

```
HEXISTS key field
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1" and "field2":

```
HSET myhash field1 "value1"
```

Now, let's check if "field1" and "field2" exist in `myhash`:

```
HEXISTS myhash field1
HEXISTS myhash field2
```

This will output:

```
(integer) 1
(integer) 0
```

## RESP2/RESP3 Reply

Integer reply: `1` if the hash contains the field, `0` if the hash does not contain the field or the key does not exist.
