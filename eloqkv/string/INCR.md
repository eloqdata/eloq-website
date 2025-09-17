---
title: INCR
---

# INCR

Increments the integer value of a key by one.

## Syntax

```
INCR key
```

## Parameters

- **key**: The name of the key whose value you want to increment.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `INCR` command increases the integer value stored at `key` by one. If the key does not exist, it is set to `0` before performing the increment operation. The operation is atomic, ensuring that concurrent requests are correctly handled.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "5":

```
SET mykey "5"
```

To increment the value of `mykey` by 1:

```
INCR mykey
```

This will return:

```
(integer) 6
```

The value of `mykey` will now be "6".

### Handling a Non-Existent Key

If the key does not exist:

```
INCR newkey
```

This will return:

```
(integer) 1
```

The key `newkey` is now set to "1".

## Edge Cases

- If the key holds a value that is not an integer or cannot be represented as an integer, an error is returned.
- If the resulting value after the increment operation exceeds the maximum integer value allowed (`2^63 - 1`), an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the value of the key after the increment operation.
