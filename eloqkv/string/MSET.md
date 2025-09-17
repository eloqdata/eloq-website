---
title: MSET
---

# MSET

Sets the values of multiple keys in one atomic operation.

## Syntax

```
MSET key value [key value ...]
```

## Parameters

- **key**: The name of each key to set.
- **value**: The value to set for each specified key.

## Details

- **Available since:** 1.0.1
- **Time complexity:** O(N) where N is the number of keys to set.
- **ACL categories:** `@write`, `@string`, `@fast`

The `MSET` command sets the values of one or more keys in a single atomic operation. If a key already exists, its value is overwritten. `MSET` is faster than performing multiple `SET` operations separately because it ensures atomicity, meaning that either all the keys are set or none are.

## Examples

### Basic Usage

To set the values for multiple keys:

```
MSET key1 "value1" key2 "value2" key3 "value3"
```

This operation will set:

- `key1` to "value1"
- `key2` to "value2"
- `key3` to "value3"

### Overwriting Existing Values

If the keys already exist:

```
SET key1 "oldvalue1"
SET key2 "oldvalue2"

MSET key1 "newvalue1" key2 "newvalue2"
```

After this operation, `key1` and `key2` will be updated to "newvalue1" and "newvalue2" respectively.

### Setting a Mix of New and Existing Keys

If some keys exist and others do not:

```
SET key1 "value1"

MSET key1 "newvalue1" key2 "value2"
```

This will set `key1` to "newvalue1" and create `key2` with the value "value2".

## Edge Cases

- If an odd number of arguments is provided (e.g., missing a value for a key), the command will return an error.
- If any key holds a value that is not a string, an error is returned.
- `MSET` does not return any data; it only performs the operation.

## RESP2/RESP3 Reply

- Simple string reply: `OK` if the operation was successful.
