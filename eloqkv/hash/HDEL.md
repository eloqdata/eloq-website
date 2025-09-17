---
title: HDEL
---

# HDEL

Removes one or more fields from a hash stored at `key`. If the specified field does not exist, it is ignored. If key holds a non-hash value, an error is returned.

## Syntax

```
HDEL key field [field ...]
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N) where N is the number of fields to be removed.
- **ACL categories:** `@write`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1", "field2", and "field3":

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
HSET myhash field3 "value3"
```

Now, let's remove fields "field1" and "field2" from `myhash`:

```
HDEL myhash field1 field2
```

## RESP2/RESP3 Reply

Integer reply: the number of fields that were removed from the hash, not including specified but non-existing fields.
