---
title: HLEN
---

# HLEN

Returns the number of fields contained in the hash stored at `key`.

## Syntax

```
HLEN key
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1", "field2", and "field3":

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
HSET myhash field3 "value3"
```

Now, let's retrieve the number of fields in `myhash`:

```
HLEN myhash
```

This will output:

```
(integer) 3
```

## RESP2/RESP3 Reply

Integer reply: the number of fields in the hash, or `0` if the key does not exist.
