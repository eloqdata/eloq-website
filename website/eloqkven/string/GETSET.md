---
title: GETSET
---

# GETSET

Sets the value of a key and returns the old value stored at the key.

## Syntax

```
GETSET key value
```

## Parameters

- **key**: The name of the key whose value you want to set.
- **value**: The new value to set at the specified key.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `GETSET` command sets the value of a key to the specified `value` and returns the old value stored at the key. If the key did not previously exist, `GETSET` returns `nil`. This command is useful for atomically setting a value while retrieving the previous value in a single operation.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "Hello":

```
SET mykey "Hello"
```

To set a new value "World" and get the old value:

```
GETSET mykey "World"
```

This will return:

```
"Hello"
```

After running this command, the value of `mykey` will be "World".

### Handling a Non-Existent Key

If the key does not exist and you use `GETSET`:

```
GETSET newkey "FirstValue"
```

This will return:

```
(nil)
```

The key `newkey` will now be set to "FirstValue".

## Edge Cases

- If the key does not exist, `GETSET` returns `nil` and sets the key to the specified value.
- If the key exists but is not a string, an error is returned.

## RESP2/RESP3 Reply

- Bulk string reply: the old value stored at the key, or `nil` if the key did not exist.
