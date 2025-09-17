---
title: BITFIELD
---

# BITFIELD

Performs arbitrary bitfield operations on a string stored at a key.

## Syntax

```
BITFIELD key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]
```

## Parameters

- **key**: The name of the key containing the string to operate on.
- **GET type offset**: Retrieves a bitfield value from the string.
- **SET type offset value**: Sets a bitfield value in the string.
- **INCRBY type offset increment**: Increments (or decrements) a bitfield value by a given increment.
- **OVERFLOW WRAP|SAT|FAIL**: Optional. Specifies the overflow behavior when incrementing or decrementing a bitfield value.

### Bitfield Types

- **type**: Specifies the bitfield type, e.g., `i8`, `u4`, `i16`, etc.
  - `i` for signed integers
  - `u` for unsigned integers
- **offset**: The bit offset where the operation should start. Can be absolute or relative.
  - **#N**: Absolute bit offset from the start of the string.
  - **N**: Relative bit offset from the current position.

### Overflow Options

- **WRAP**: Wrap around on overflow.
- **SAT**: Saturate the value on overflow (clamp to the minimum or maximum value).
- **FAIL**: Return an error on overflow.

## Details

- **Available since:** 3.2.0
- **Time complexity:** O(1) for each subcommand, but the overall complexity depends on the number of subcommands and the size of the bitfields being operated on.
- **ACL categories:** `@write`, `@bitmap`, `@slow`

The `BITFIELD` command is a powerful tool for manipulating individual bits or groups of bits (bitfields) within a string stored at a key. It supports various operations, including retrieving, setting, and incrementing bitfield values, as well as specifying how to handle overflows when incrementing values.

## Examples

### Basic Usage

Assume we have a key called `mykey` and we want to set and retrieve some bitfield values:

#### Setting a Bitfield

```
BITFIELD mykey SET i8 0 100
```

This sets the first 8 bits (starting at offset 0) of `mykey` to the signed integer value 100.

#### Getting a Bitfield

```
BITFIELD mykey GET i8 0
```

This retrieves the value of the first 8 bits (starting at offset 0) as a signed integer:

```
(integer) 100
```

### Incrementing a Bitfield with Overflow Control

```
BITFIELD mykey INCRBY u4 4 1 OVERFLOW SAT
```

This increments the 4-bit unsigned integer at bit offset 4 by 1, using saturation overflow behavior. If the value would exceed the maximum representable value (15 for `u4`), it will be clamped to 15.

### Combining Multiple Operations

```
BITFIELD mykey SET i5 10 7 INCRBY i5 10 3 GET i5 10
```

This command sequence:

- Sets a 5-bit signed integer at bit offset 10 to 7.
- Increments the 5-bit signed integer at bit offset 10 by 3.
- Retrieves the resulting value.

The final result is:

```
1) (integer) 7
2) (integer) 10
3) (integer) 10
```

## Edge Cases

- If the key does not exist, `BITFIELD` operates as if the key contained an empty string of bits.
- The `OVERFLOW` option applies to subsequent `INCRBY` operations in the same command.
- If an operation specifies an offset outside the string's current length, the string is automatically extended with zeros.

## RESP2/RESP3 Reply

- Array reply: list of results corresponding to the `GET`, `SET`, and `INCRBY` operations in the order they were specified.
