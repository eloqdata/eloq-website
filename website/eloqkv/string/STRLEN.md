---
title: STRLEN
---

# STRLEN

Returns the length of the string stored at a key.

## Syntax

```
STRLEN key
```

## Parameters

- **key**: The name of the key whose string length you want to retrieve.

## Details

- **Available since:** 2.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@string`, `@fast`

The `STRLEN` command returns the length of the string value stored at the specified `key`. If the key does not exist, `STRLEN` returns `0`. This command is useful for quickly determining the size of a string stored at a particular key.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "Hello, World!":

```
SET mykey "Hello, World!"
```

To retrieve the length of the string stored in `mykey`:

```
STRLEN mykey
```

This will return:

```
(integer) 13
```

The length of "Hello, World!" is 13 characters.

### Handling a Non-Existent Key

If you try to get the length of a key that does not exist:

```
STRLEN nonexistingkey
```

This will return:

```
(integer) 0
```

## Edge Cases

- If the key does not exist, `STRLEN` returns `0`.
- If the key exists but does not hold a string value, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the length of the string at the specified key.
