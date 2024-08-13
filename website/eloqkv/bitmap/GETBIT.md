---
title: GETBIT
---

# GETBIT

Returns the bit value at the specified offset in the string stored at a key.

## Syntax

```
GETBIT key offset
```

## Parameters

- **key**: The name of the key containing the string.
- **offset**: The bit offset to retrieve, which is a zero-based index.

## Details

- **Available since:** 2.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@string`, `@fast`

The `GETBIT` command retrieves the bit value at a specified offset in a string stored at `key`. The bit offset is zero-based, meaning an offset of `0` refers to the first bit of the string. The command returns `0` or `1`, indicating the value of the bit at the specified position.

If the `key` does not exist, it is treated as an empty string, and `GETBIT` will return `0` for any offset.

## Examples

### Basic Usage

Assume we have the following key with a string value:

```
SETBIT mykey 0 1
SETBIT mykey 1 0
SETBIT mykey 2 1
```

To get the bit value at offset `1`:

```
GETBIT mykey 1
```

This will return:

```
0
```

### Retrieving a Bit from an Empty Key

If the key `mykey` does not exist, the following command will return `0` for any offset:

```
GETBIT mykey 5
```

This will return:

```
0
```

### Retrieving a Bit from a Non-Existing Offset

If the offset is beyond the current length of the string (e.g., offset `10` for a string of length `3`), the command will still return `0`:

```
GETBIT mykey 10
```

This will return:

```
0
```

## Edge Cases

- If the `key` does not exist, it is treated as a string of zero length, so all bit offsets return `0`.
- If the offset is negative or out of range for the string, `GETBIT` will return `0`.

## RESP2/RESP3 Reply

- Integer reply: the bit value at the specified offset, which is `0` or `1`.
