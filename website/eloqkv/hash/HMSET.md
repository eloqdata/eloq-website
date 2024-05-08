---
title: HMSET
---

# HMSET

Sets the specified fields to their respective values in the hash stored at `key`.

## Syntax

```
HMSET key field1 value1 [field2 value2 ...]
```

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N) where N is the number of fields being set.
- **ACL categories:** `@write`, `@hash`, `@fast`

## Example

Assume we have an empty hash called `myhash`. Now, let's set the fields "field1", "field2", and "field3" with their respective values:

```
HMSET myhash field1 "value1" field2 "value2" field3 "value3"
```

## RESP2/RESP3 Reply

Simple string reply: `OK` if the operation was successful.
