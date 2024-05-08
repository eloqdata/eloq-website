---
title: HSTRLEN
---

# HSTRLEN

Returns the string length (in bytes) of the value associated with the field in the hash stored at `key`.

## Syntax

```
HSTRLEN key field
```

## Details

- **Available since:** 3.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with a field "field1" with value "Hello, world!":

```
HSET myhash field1 "Hello, world!"
```

Now, let's retrieve the string length of the value associated with "field1" in `myhash`:

```
HSTRLEN myhash field1
```

This will output:

```
(integer) 13
```

## RESP2/RESP3 Reply

Integer reply: the string length of the value associated with the field, or `0` if the field does not exist or the key does not exist.
