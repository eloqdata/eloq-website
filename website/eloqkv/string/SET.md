---
title: SET
---

# SET

Sets the value of a key, with optional parameters for expiration and conditions.

## Syntax

```
SET key value [NX | XX] [GET]
```

## Parameters

- **key**: The name of the key to set.
- **value**: The value to set for the specified key.
- **NX**: Optional. Set the key only if it does not already exist.
- **XX**: Optional. Set the key only if it already exists.
- **GET**: Optional. Return the old value stored at the key, or `nil` if the key did not exist.

## Details

- **Available since:** 1.0.0 (basic functionality), 6.2.0 (additional options)
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `SET` command sets the value of a key, with various optional parameters that allow for conditional setting and expiration. The command can be used in many scenarios, such as caching, managing time-limited data, or simply storing a value.

### Expiration Options

Expiration is not supported yet.

### Conditional Options

- **NX**: Set the key only if it does not already exist.
- **XX**: Set the key only if it already exists.

### Return Value Option

- **GET**: Return the old value stored at the key before the `SET` operation. If the key did not exist, return `nil`.

## Examples

### Basic Usage

To set a simple key-value pair:

```
SET mykey "Hello, World!"
```

This will set `mykey` to "Hello, World!".

### Conditional Set (NX)

To set a key only if it does not already exist:

```
SET mykey "Hello, Redis!" NX
```

### Conditional Set (XX)

To set a key only if it already exists:

```
SET mykey "Hello again!" XX
```

### Using GET Option

To set a key and return the old value:

```
SET mykey "Hello, New Value!" GET
```

This might return:

```
"Hello, World!"
```

If `mykey` did not exist before, it will return `nil`.

## Edge Cases

- If `NX` and `XX` are both specified, the command will always fail as the conditions are mutually exclusive.
- If the key exists but is not a string, an error is returned.
- If the `GET` option is used and the key did not exist, `nil` is returned.

## RESP2/RESP3 Reply

- Simple string reply: `OK` if the operation was successful.
- Bulk string reply: the old value stored at the key if the `GET` option is used, or `nil` if the key did not exist.
