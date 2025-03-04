---
title: BITCOUNT
---

# BITCOUNT

Counts the number of set bits (1s) in the string stored at a key within the specified range.

## Syntax

```
BITCOUNT key [start end]
```

## Parameters

- **key**: The name of the key containing the string to count bits in.
- **start**: Optional. The starting byte index for counting. The index is inclusive and can be negative to indicate an offset from the end of the string.
- **end**: Optional. The ending byte index for counting. The index is inclusive and can be negative to indicate an offset from the end of the string.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N) where N is the length of the string.
- **ACL categories:** `@read`, `@bitmap`, `@slow`

The `BITCOUNT` command counts the number of bits set to 1 in the string stored at `key`. By default, it counts the bits in the entire string. If `start` and `end` parameters are provided, it counts the bits only within the specified byte range. The range is inclusive, meaning that both the start and end bytes are included in the count.

### Byte Range Indexing

- **0**: The first byte in the string.
- **-1**: The last byte in the string.
- **-2**: The second last byte, and so on.

## Examples

### Counting Bits in the Entire String

Assume we have a key called `mykey` with a binary value:

```
SETBIT mykey 0 1
SETBIT mykey 1 1
SETBIT mykey 2 0
SETBIT mykey 3 1
```

To count the number of set bits in the entire string:

```
BITCOUNT mykey
```

This will return:

```
(integer) 3
```

### Counting Bits in a Specific Range

To count the number of set bits between the first and second bytes:

```
BITCOUNT mykey 0 1
```

This will return:

```
(integer) 2
```

### Handling Non-Existent Key

If the key does not exist:

```
BITCOUNT nonexistingkey
```

This will return:

```
(integer) 0
```

## Edge Cases

- If the key does not exist, `BITCOUNT` returns `0`.
- If the `start` and `end` parameters are out of range, `BITCOUNT` returns `0`.
- The `start` and `end` parameters are inclusive.
- If the key exists but is not a string, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of bits set to 1 in the specified range.
