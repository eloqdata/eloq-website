---
title: SETRANGE
---

# SETRANGE

Overwrites part of the string stored at a key, starting at the specified offset, with the given value.

## Syntax

```
SETRANGE key offset value
```

## Parameters

- **key**: The name of the key containing the string to overwrite.
- **offset**: The zero-based starting index in the string where the overwriting begins.
- **value**: The string value to overwrite starting from the specified offset.

## Details

- **Available since:** 2.2.0
- **Time complexity:** O(M) where M is the length of the `value`.
- **ACL categories:** `@write`, `@string`, `@slow`

The `SETRANGE` command overwrites part of the string stored at `key`, starting at the specified `offset`, with the given `value`. If the `offset` is larger than the current length of the string, the string is padded with null bytes (`\0`) until the specified offset is reached. If the key does not exist, it is treated as an empty string, and the command behaves as if it is creating the string from scratch.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "Hello World":

```
SET mykey "Hello World"
```

To overwrite part of the string starting at offset 6:

```
SETRANGE mykey 6 "Redis"
```

This will return:

```
(integer) 11
```

After running this command, the value of `mykey` will be "Hello Redis".

### Overwriting Beyond the Current Length

If the offset is beyond the current length of the string:

```
SETRANGE mykey 20 "!"
```

This will return:

```
(integer) 21
```

The value of `mykey` will now be "Hello Redis\0\0\0\0\0\0\0\0\0!".

### Handling a Non-Existent Key

If the key does not exist:

```
SETRANGE newkey 0 "Hello"
```

This will return:

```
(integer) 5
```

The value of `newkey` will be "Hello".

## Edge Cases

- If the key does not exist, `SETRANGE` creates a new string starting at the specified offset.
- If the `offset` is larger than the current length of the string, the string is padded with null bytes.
- If the key exists but is not a string, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the length of the string after the `SETRANGE` operation.
