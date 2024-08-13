---
title: BITOP
---

# BITOP

Performs bitwise operations between multiple bitmaps and stores the result in a destination key.

## Syntax

```
BITOP operation destkey key [key ...]
```

## Parameters

- **operation**: The bitwise operation to perform. Options are:
  - `AND`: Bitwise AND
  - `OR`: Bitwise OR
  - `XOR`: Bitwise XOR
  - `NOT`: Bitwise NOT (unary operation)
- **destkey**: The key where the result of the bitwise operation will be stored.
- **key**: One or more keys to perform the bitwise operation on. These are the source bitmaps.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N) where N is the size of the bitmaps.
- **ACL categories:** `@write`, `@bitmap`, `@slow`

The `BITOP` command performs bitwise operations on one or more bitmaps and stores the result in a new key. It supports several bitwise operations including AND, OR, XOR, and NOT. The command operates on byte-level granularity and the result will be of the same length as the longest input bitmap.

### Operation Types

- **AND**: Performs a bitwise AND between all input bitmaps and stores the result in `destkey`.
- **OR**: Performs a bitwise OR between all input bitmaps and stores the result in `destkey`.
- **XOR**: Performs a bitwise XOR between all input bitmaps and stores the result in `destkey`.
- **NOT**: Performs a bitwise NOT on a single input bitmap and stores the result in `destkey`.

## Examples

### Bitwise AND Operation

Assume we have the following keys with bitmap values:

```
SETBIT mykey1 0 1
SETBIT mykey1 1 1
SETBIT mykey2 0 1
SETBIT mykey2 1 0
```

To perform a bitwise AND operation between `mykey1` and `mykey2` and store the result in `resultkey`:

```
BITOP AND resultkey mykey1 mykey2
```

The value of `resultkey` will be `01`, as the bitwise AND operation results in `01`.

### Bitwise OR Operation

To perform a bitwise OR operation between `mykey1` and `mykey2`:

```
BITOP OR resultkey mykey1 mykey2
```

The value of `resultkey` will be `11`, as the bitwise OR operation results in `11`.

### Bitwise XOR Operation

To perform a bitwise XOR operation between `mykey1` and `mykey2`:

```
BITOP XOR resultkey mykey1 mykey2
```

The value of `resultkey` will be `11`, as the bitwise XOR operation results in `11`.

### Bitwise NOT Operation

To perform a bitwise NOT operation on `mykey1`:

```
BITOP NOT resultkey mykey1
```

The result will be the bitwise NOT of `mykey1`. If `mykey1` had a value of `01`, the result will be the complement, which depends on the bit-width (e.g., `10` for an 8-bit width).

## Edge Cases

- If `destkey` already exists, it will be overwritten with the result.
- If `key` does not exist, it is treated as an empty bitmap.
- If `NOT` operation is used, only a single `key` should be specified.

## RESP2/RESP3 Reply

- Integer reply: the length of the resulting bitmap in bytes.
