---
title: HKEYS
---

# HKEYS

Returns all field names in the hash stored at `key`.

## Syntax

```
HKEYS key
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N) where N is the size of the hash.
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1" and "field2":

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
```

Now, let's retrieve all field names from `myhash`:

```
HKEYS myhash
```

This will output:

```
1) "field1"
2) "field2"
```

## RESP2/RESP3 Reply

Array reply: list of field names.
