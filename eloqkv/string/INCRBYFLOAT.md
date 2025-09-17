---
title: INCRBYFLOAT
---

# INCRBYFLOAT

Increments the value of a key by the specified floating-point increment.

## Syntax

```
INCRBYFLOAT key increment
```

## Parameters

- **key**: The name of the key whose value you want to increment.
- **increment**: The floating-point value by which the key's value should be increased.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `INCRBYFLOAT` command increases the value stored at `key` by the specified floating-point `increment`. If the key does not exist, it is set to `0` before performing the increment operation. The operation is atomic, ensuring that concurrent requests are correctly handled. The new value is stored as a string, even if the value was originally stored as an integer.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "10.5":

```
SET mykey "10.5"
```

To increment the value of `mykey` by 0.7:

```
INCRBYFLOAT mykey 0.7
```

This will return:

```
"11.2"
```

The value of `mykey` will now be "11.2".

### Handling a Non-Existent Key

If the key does not exist:

```
INCRBYFLOAT newkey 2.5
```

This will return:

```
"2.5"
```

The key `newkey` is now set to "2.5".

## Edge Cases

- If the key holds a value that cannot be represented as a floating-point number, an error is returned.
- If the resulting value after the increment operation exceeds the precision limits of floating-point numbers, an error is returned.

## RESP2/RESP3 Reply

- Bulk string reply: the value of the key after the increment operation, returned as a string.
