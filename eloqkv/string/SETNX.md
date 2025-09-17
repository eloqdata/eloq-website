---
title: SETNX
---

# SETNX

Sets the value of a key, only if the key does not already exist.

## Syntax

```
SETNX key value
```

## Parameters

- **key**: The name of the key to set.
- **value**: The value to set for the specified key.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `SETNX` (SET if Not eXists) command sets the value of a key only if the key does not already exist. This command is useful for implementing locks or ensuring that a key is only set if it is not already in use. If the key already exists, the command does nothing.

## Examples

### Basic Usage

To set a key only if it does not already exist:

```
SETNX mykey "Hello, World!"
```

If `mykey` does not exist, this command will set it to "Hello, World!" and return:

```
(integer) 1
```

If `mykey` already exists:

```
SETNX mykey "New Value"
```

This will return:

```
(integer) 0
```

The value of `mykey` will remain unchanged.

### Using `SETNX` for Simple Locking

`SETNX` can be used to implement a simple locking mechanism:

```
SETNX lockkey "lockvalue"
```

If the command returns `1`, the lock was successfully acquired. If it returns `0`, the lock is already held by someone else.

## Edge Cases

- If the key already exists, the command returns `0` and does not modify the key.
- If the key does not exist, the command sets the key and returns `1`.
- If the key exists but is not a string, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: `1` if the key was set, `0` if the key was not set.
