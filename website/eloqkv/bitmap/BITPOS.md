---
title: BITPOS
---

# BITPOS

Finds the position of the first bit set to 1 or 0 in a string stored at a key.

## Syntax

```
BITPOS key bit [start] [end]
```

## Parameters

- **key**: The name of the key containing the bitmap.
- **bit**: The bit value to search for. Can be either `0` or `1`.
- **start**: Optional. The starting byte index for the search. The index is inclusive and can be negative to indicate an offset from the end of the string.
- **end**: Optional. The ending byte index for the search. The index is inclusive and can be negative to indicate an offset from the end of the string.

## Details

- **Available since:** 4.0.0
- **Time complexity:** O(N) where N is the number of bytes scanned.
- **ACL categories:** `@read`, `@bitmap`, `@slow`

The `BITPOS` command searches for the first occurrence of a bit set to the specified value (`0` or `1`) in the bitmap stored at `key`. By default, it searches the entire bitmap. If `start` and `end` parameters are provided, it searches within the specified byte range. The search is inclusive of both `start` and `end` offsets.

### Byte Range Indexing

- **0**: The first byte in the string.
- **-1**: The last byte in the string.
- **-2**: The second last byte, and so on.

## Examples

### Finding the First Bit Set to 1

Assume we have a key called `mykey` with the following bitmap:

```
SETBIT mykey 0 0
SETBIT mykey 1 1
SETBIT mykey 2 1
SETBIT mykey 3 0
```

To find the position of the first bit set to `1`:

```
BITPOS mykey 1
```

This will return:

```
(integer) 1
```

The first bit set to `1` is at position 1.

### Finding the First Bit Set to 0

To find the position of the first bit set to `0`:

```
BITPOS mykey 0
```

This will return:

```
(integer) 0
```

The first bit set to `0` is at position 0.

### Searching Within a Specific Byte Range

To search for the first bit set to `1` starting from byte index 1 to byte index 2:

```
BITPOS mykey 1 1 2
```

This will return:

```
(integer) 9
```

The first occurrence of `1` within the specified range is at position 9.

## Edge Cases

- If the key does not exist, the command searches within an empty string and will return `-1` if no bit is found.
- If `start` and `end` parameters are specified but are out of range, the search will be adjusted accordingly.
- If the `bit` parameter is not `0` or `1`, the command returns an error.

## RESP2/RESP3 Reply

- Integer reply: the bit offset of the first occurrence of the specified bit value, or `-1` if the bit is not found.
