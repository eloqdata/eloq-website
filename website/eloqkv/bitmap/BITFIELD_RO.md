---
title: BITFIELD_RO
---

# BITFIELD_RO

Performs read-only operations on a bitfield stored at a key.

## Syntax

```
BITFIELD_RO key [GET type offset]
```

## Parameters

- **key**: The name of the key containing the bitfield to operate on.
- **GET type offset**: Retrieves a bitfield value from the string.

### Bitfield Types

- **type**: Specifies the bitfield type to retrieve, e.g., `i8`, `u4`, `i16`, etc.
  - `i` for signed integers
  - `u` for unsigned integers
- **offset**: The bit offset where the operation should start. Can be absolute or relative.
  - **#N**: Absolute bit offset from the start of the string.
  - **N**: Relative bit offset from the current position.

## Details

- **Available since:** 3.2.0
- **Time complexity:** O(1) for each subcommand, but overall complexity depends on the size of the bitfields being accessed.
- **ACL categories:** `@read`, `@bitmap`, `@fast`

The `BITFIELD_RO` command provides a way to perform read-only operations on a bitfield stored in a string. Unlike `BITFIELD`, `BITFIELD_RO` does not support write operations such as `SET` or `INCRBY`. It is used exclusively for retrieving values from a bitfield.

## Examples

### Basic Usage

Assume we have a key called `mykey` and we want to retrieve some bitfield values:

#### Retrieving a Bitfield Value

```
BITFIELD_RO mykey GET i8 0
```

This retrieves the 8-bit signed integer value stored at bit offset 0 of `mykey`. If the value at the specified offset is `100`, the command will return:

```
(integer) 100
```

### Retrieving Multiple Bitfield Values

```
BITFIELD_RO mykey GET i16 0 GET u8 8
```

This command retrieves:

- An 16-bit signed integer starting at bit offset 0.
- An 8-bit unsigned integer starting at bit offset 8.

If the values are `12345` and `255`, respectively, the command will return:

```
1) (integer) 12345
2) (integer) 255
```

## Edge Cases

- If the key does not exist, `BITFIELD_RO` operates as if the key contained an empty string of bits.
- If the specified `offset` is beyond the current length of the string, the result will be affected accordingly (e.g., returning zero or other default values).
- If the key exists but is not a string, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of results corresponding to the `GET` operations in the order they were specified.
