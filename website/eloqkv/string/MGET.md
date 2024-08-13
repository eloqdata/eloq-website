---
title: MGET
---

# MGET

Returns the values of all specified keys. If a key does not exist, `nil` is returned for that key.

## Syntax

```
MGET key [key ...]
```

## Parameters

- **key**: The name of each key whose value you want to retrieve. You can specify multiple keys.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of keys to retrieve.
- **ACL categories:** `@read`, `@string`, `@fast`

The `MGET` command retrieves the values of one or more specified keys. The command returns a list of values corresponding to the specified keys, in the order in which the keys were requested. If a key does not exist, the corresponding value in the list will be `nil`.

## Examples

### Basic Usage

Assume we have three keys with the following values:

```
SET key1 "value1"
SET key2 "value2"
SET key3 "value3"
```

To retrieve the values of `key1`, `key2`, and `key3`:

```
MGET key1 key2 key3
```

This will return:

```
1) "value1"
2) "value2"
3) "value3"
```

### Handling Non-Existent Keys

If one of the keys does not exist:

```
MGET key1 key4 key3
```

This will return:

```
1) "value1"
2) (nil)
3) "value3"
```

### Mixed Data Types

If any of the keys hold values of different types (e.g., not strings), an error will be returned for those keys.

## Edge Cases

- If none of the specified keys exist, `MGET` returns a list of `nil` values.
- If a key exists but does not hold a string value, an error is returned.
- The command returns the values in the order of the requested keys.

## RESP2/RESP3 Reply

- Array reply: a list of values corresponding to the specified keys, with `nil` for non-existent keys.
