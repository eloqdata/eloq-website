---
title: DECR
---

# DECR

Decrements the integer value of a key by one.

## Syntax

```
DECR key
```

## Parameters

- **key**: The name of the key whose value you want to decrement.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `DECR` command decreases the integer value stored at `key` by one. If the key does not exist, it is set to `0` before performing the decrement operation. The operation is atomic, ensuring that concurrent requests are correctly handled.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "5":

```
SET mykey "5"
```

To decrement the value of `mykey` by 1:

```
DECR mykey
```

This will return:

```
(integer) 4
```

The value of `mykey` will now be "4".

### Handling a Non-Existent Key

If the key does not exist:

```
DECR newkey
```

This will return:

```
(integer) -1
```

The key `newkey` is now set to "-1".

## Edge Cases

- If the key holds a value that is not an integer or cannot be represented as an integer, an error is returned.
- If the resulting value after the decrement operation is less than the minimum integer value allowed (`-2^63`), an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the value of the key after the decrement operation.
