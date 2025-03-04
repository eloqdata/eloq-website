---
title: HGETALL
---

# HGETALL

Returns all fields and values of the hash stored at `key`.

## Syntax

```
HGETALL key
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N) where N is the size of the hash.
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1" and "field2" with corresponding values:

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
```

Now, let's retrieve all fields and values from `myhash`:

```
HGETALL myhash
```

This will output:

```
1) "field1"
2) "value1"
3) "field2"
4) "value2"
```

## RESP2/RESP3 Reply

Array reply: list of fields and their values.
