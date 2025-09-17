---
title: MSETNX
---

# MSETNX

Sets the values of multiple keys in one atomic operation, only if none of the keys already exist.

## Syntax

```
MSETNX key value [key value ...]
```

## Parameters

- **key**: The name of each key to set.
- **value**: The value to set for each specified key.

## Details

- **Available since:** 1.0.1
- **Time complexity:** O(N) where N is the number of keys to set.
- **ACL categories:** `@write`, `@string`, `@slow`

The `MSETNX` command sets the values of one or more keys in a single atomic operation, but only if none of the specified keys already exist. If even one of the keys already exists, the entire operation is aborted, and no keys are set. This ensures that `MSETNX` is atomic, meaning either all the keys are set, or none are.

## Examples

### Basic Usage

To set the values for multiple keys only if none of the keys exist:

```
MSETNX key1 "value1" key2 "value2" key3 "value3"
```

If none of the keys exist, this operation will set:

- `key1` to "value1"
- `key2` to "value2"
- `key3` to "value3"

### Handling Existing Keys

If any of the keys already exist, the operation fails, and no keys are set:

```
SET key1 "existingvalue1"

MSETNX key1 "newvalue1" key2 "value2"
```

This will return:

```
(integer) 0
```

In this case, neither `key1` nor `key2` will be set, because `key1` already exists.

### Successful Operation

If none of the keys exist:

```
MSETNX key3 "value3" key4 "value4"
```

This will return:

```
(integer) 1
```

Both `key3` and `key4` will be set to "value3" and "value4" respectively.

## Edge Cases

- If an odd number of arguments is provided (e.g., missing a value for a key), the command will return an error.
- If any key already exists, the entire operation is aborted, and none of the keys are set.
- `MSETNX` does not support partial success; it either sets all keys or none.

## RESP2/RESP3 Reply

- Integer reply: `1` if the operation was successful, or `0` if the operation was aborted because at least one key already existed.
