---
title: GET
---

# GET

Retrieves the value of a key. If the key does not exist, `GET` returns `nil`.

## Syntax

```
GET key
```

## Parameters

- **key**: The name of the key whose value you want to retrieve.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@string`, `@fast`

The `GET` command returns the value associated with the specified `key`. If the key exists but contains a value of a different type, an error is returned. If the key does not exist, `GET` returns `nil`.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "Hello, World!":

```
SET mykey "Hello, World!"
```

To retrieve the value of `mykey`:

```
GET mykey
```

This will return:

```
"Hello, World!"
```

### Handling a Non-Existent Key

If you try to get the value of a key that does not exist:

```
GET nonexistingkey
```

This will return:

```
(nil)
```

## Edge Cases

- If the key does not exist, `GET` returns `nil`.
- If the key exists but is not a string, an error is returned.

## RESP2/RESP3 Reply

- Bulk string reply: the value of the key, or `nil` if the key does not exist.
