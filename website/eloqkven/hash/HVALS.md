---
title: HVALS
---

# HVALS

Returns all values in the hash stored at `key`.

## Syntax

```
HVALS key
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N) where N is the size of the hash.
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1", "field2", and "field3" with corresponding values:

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
HSET myhash field3 "value3"
```

Now, let's retrieve all values from `myhash`:

```
HVALS myhash
```

This will output:

```
1) "value1"
2) "value2"
3) "value3"
```

## RESP2/RESP3 Reply

Array reply: list of values.
