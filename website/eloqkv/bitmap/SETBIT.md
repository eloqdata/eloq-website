---
title: SETBIT
---

# SETBIT

Sets or clears the bit at the specified offset in the string stored at a key.

## Syntax

```
SETBIT key offset value
```

## Parameters

- **key**: The name of the key containing the string.
- **offset**: The bit offset to set or clear, which is a zero-based index.
- **value**: The bit value to set, which must be `0` or `1`.

## Details

- **Available since:** 2.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `SETBIT` command sets or clears the bit at the specified offset in a string stored at `key`. The bit offset is zero-based, meaning an offset of `0` refers to the first bit of the string.

If the `key` does not exist, it is created as a string of length sufficient to accommodate the specified offset. If the `offset` is beyond the current length of the string, the string is padded with zeroes to reach the specified offset.

The command returns the original bit value stored at the offset before it was updated.

## Examples

### Setting a Bit

Assume we have the following key with a string value:

```
SETBIT mykey 0 0
SETBIT mykey 1 0
SETBIT mykey 2 0
```

To set the bit at offset `1` to `1`:

```
SETBIT mykey 1 1
```

The command returns:

```
0
```

The string stored at `mykey` will now be `010`.

### Creating a New Key

If `mykey` does not exist and we set a bit at offset `5`:

```
SETBIT mykey 5 1
```

The command returns:

```
0
```

The string stored at `mykey` will now be `000001` (padded with zeroes).

### Retrieving the Original Bit Value

To retrieve the bit value that was originally at offset `5` before the update:

```
GETBIT mykey 5
```

The command will return:

```
1
```

## Edge Cases

- If `key` does not exist, it is created with sufficient length to accommodate the specified offset, and the new bit is set accordingly.
- If `offset` is negative or out of range for the current string length, the string will be extended as necessary with zeroes.
- The `value` must be either `0` or `1`. If an invalid value is provided, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the original bit value at the specified offset before the update, which is `0` or `1`.
