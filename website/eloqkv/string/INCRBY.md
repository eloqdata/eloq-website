---
title: INCRBY
---

# INCRBY

Increments the integer value of a key by the specified increment.

## Syntax

```
INCRBY key increment
```

## Parameters

- **key**: The name of the key whose value you want to increment.
- **increment**: The integer value by which the key's value should be increased.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `INCRBY` command increases the integer value stored at `key` by the specified `increment`. If the key does not exist, it is set to `0` before performing the increment operation. The operation is atomic, ensuring that concurrent requests are correctly handled.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "10":

```
SET mykey "10"
```

To increment the value of `mykey` by 5:

```
INCRBY mykey 5
```

This will return:

```
(integer) 15
```

The value of `mykey` will now be "15".

### Handling a Non-Existent Key

If the key does not exist:

```
INCRBY newkey 3
```

This will return:

```
(integer) 3
```

The key `newkey` is now set to "3".

## Edge Cases

- If the key holds a value that is not an integer or cannot be represented as an integer, an error is returned.
- If the resulting value after the increment operation exceeds the maximum integer value allowed (`2^63 - 1`), an error is returned.
- The `increment` value must be an integer.

## RESP2/RESP3 Reply

- Integer reply: the value of the key after the increment operation.
