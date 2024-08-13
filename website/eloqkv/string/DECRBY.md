---
title: DECRBY
---

# DECRBY

Decrements the integer value of a key by the specified decrement.

## Syntax

```
DECRBY key decrement
```

## Parameters

- **key**: The name of the key whose value you want to decrement.
- **decrement**: The integer value by which the key's value should be decreased.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@string`, `@fast`

The `DECRBY` command decreases the integer value stored at `key` by the specified `decrement`. If the key does not exist, it is set to `0` before performing the decrement operation. The operation is atomic, ensuring that concurrent requests are correctly handled.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "10":

```
SET mykey "10"
```

To decrement the value of `mykey` by 3:

```
DECRBY mykey 3
```

This will return:

```
(integer) 7
```

The value of `mykey` will now be "7".

### Handling a Non-Existent Key

If the key does not exist:

```
DECRBY newkey 5
```

This will return:

```
(integer) -5
```

The key `newkey` is now set to "-5".

## Edge Cases

- If the key holds a value that is not an integer or cannot be represented as an integer, an error is returned.
- If the resulting value after the decrement operation is less than the minimum integer value allowed (`-2^63`), an error is returned.
- The `decrement` value must be an integer.

## RESP2/RESP3 Reply

- Integer reply: the value of the key after the decrement operation.
