---
title: SETEX
---

# SETEX

Sets the value of a key and sets an expiration time on the key.

## Syntax

```
SETEX key seconds value
```

## Parameters

- **key**: The name of the key to set.
- **seconds**: The expiration time for the key, in seconds.
- **value**: The value to set for the specified key.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `SETEX` command sets the value of a key and also sets an expiration time on the key. The key will automatically be deleted after the specified number of seconds. This command is a combination of the `SET` and `EXPIRE` commands, allowing you to atomically set a value with an expiration time in a single operation.

## Examples

### Basic Usage

To set a key with a value and an expiration time of 10 seconds:

```
SETEX mykey 10 "Hello, World!"
```

This will set `mykey` to "Hello, World!" and the key will expire after 10 seconds.

### Checking the Key After Expiration

If you try to retrieve the key after it has expired:

```
GET mykey
```

This will return:

```
(nil)
```

### Overwriting an Existing Key

If the key already exists, `SETEX` will overwrite the existing value and reset the expiration time:

```
SET mykey "Temporary Value"
SETEX mykey 20 "New Value"
```

After this operation, `mykey` will have the value "New Value" and will expire after 20 seconds.

## Edge Cases

- If the `seconds` parameter is not a valid integer or is less than or equal to `0`, an error is returned.
- If the key exists but is not a string, an error is returned.
- The key will be deleted automatically when the expiration time is reached.

## RESP2/RESP3 Reply

- Simple string reply: `OK` if the operation was successful.
