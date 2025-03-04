---
title: HSET
---

# HSET

Sets the string value of a hash field.

## Syntax

```
HSET key field value
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1) for each field added.
- **ACL categories:** `@write`, `@hash`, `@fast`

## Example

Assume we have an empty hash called `myhash`. Now, let's set the field "field1" to "value1":

```
HSET myhash field1 "value1"
```

## RESP2/RESP3 Reply

Integer reply: `1` if the field is a new field in the hash and the value was set, or `0` if the field already exists in the hash and the value was updated.
