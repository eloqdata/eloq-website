---
title: HSETNX
---

# HSETNX

Sets the string value of a hash field, only if the field does not already exist.

## Syntax

```
HSETNX key field value
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@hash`, `@fast`

## Example

Assume we have an empty hash called `myhash`. Now, let's set the field "field1" to "value1":

```
HSETNX myhash field1 "value1"
```

Since the field "field1" does not exist in `myhash`, this will output:

```
(integer) 1
```

Now, let's try to set "field1" again:

```
HSETNX myhash field1 "new_value"
```

Since "field1" already exists in `myhash`, this will output:

```
(integer) 0
```

## RESP2/RESP3 Reply

Integer reply: `1` if the field was set, `0` if the field already existed in the hash and no operation was performed.
