---
title: APPEND
---

# APPEND

Appends a value to the end of the string stored at a specified key. If the key does not exist, it is created and set as an empty string before appending the value.

## Syntax

```
APPEND key value
```

## Parameters

- **key**: The name of the key where the string is stored.
- **value**: The value to append to the existing string at the key.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(1) for the average case (when appending to an existing string), but can be O(N) where N is the length of the resulting string.
- **ACL categories:** `@write`, `@string`, `@fast`

The `APPEND` command adds the specified `value` to the end of the string stored at `key`. If the key does not already hold a string, a new string is created with the specified `value` as its content.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "Hello":

```
SET mykey "Hello"
```

To append the string " World" to `mykey`:

```
APPEND mykey " World"
```

This will return:

```
(integer) 11
```

After running this command, the value of `mykey` will be "Hello World".

### Creating a New String

If the key does not exist, `APPEND` will create a new string:

```
APPEND newkey "FirstValue"
```

This will return:

```
(integer) 10
```

The value of `newkey` will now be "FirstValue".

## Edge Cases

- If the key does not exist, `APPEND` creates a new string with the provided value.
- If the key holds a non-string value, an error is returned.
- If the resulting string exceeds the maximum allowed length for strings (512 MB), an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the length of the string after the append operation.
