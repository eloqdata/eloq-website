---
title: GETRANGE
---

# GETRANGE

Returns a substring of the string stored at a key, determined by the specified start and end offsets.

## Syntax

```
GETRANGE key start end
```

## Parameters

- **key**: The name of the key whose value you want to retrieve a substring from.
- **start**: The zero-based starting index of the substring. Negative values can be used to specify offsets from the end of the string.
- **end**: The zero-based ending index of the substring (inclusive). Negative values can be used to specify offsets from the end of the string.

## Details

- **Available since:** 2.4.0
- **Time complexity:** O(N) where N is the length of the returned substring.
- **ACL categories:** `@read`, `@string`, `@slow`

The `GETRANGE` command retrieves a substring of the string value stored at `key`, as specified by the `start` and `end` parameters. The substring includes both the `start` and `end` offsets. If the key does not exist, `GETRANGE` returns an empty string.

### Indexing

- **0**: The first character in the string.
- **-1**: The last character in the string.
- **-2**: The second last character, and so on.

## Examples

### Basic Usage

Assume we have a key called `mykey` with the value "Hello, World!":

```
SET mykey "Hello, World!"
```

To retrieve the substring from index 0 to 4:

```
GETRANGE mykey 0 4
```

This will return:

```
"Hello"
```

### Using Negative Indices

To retrieve the substring from the last 6 characters of the string:

```
GETRANGE mykey -6 -1
```

This will return:

```
"World!"
```

### Handling a Non-Existent Key

If you try to get a range from a key that does not exist:

```
GETRANGE nonexistingkey 0 4
```

This will return:

```
""
```

## Edge Cases

- If the key does not exist, `GETRANGE` returns an empty string.
- If the key exists but is not a string, an error is returned.
- If `start` is greater than `end`, `GETRANGE` returns an empty string.
- If the specified range exceeds the length of the string, `GETRANGE` returns the available substring.

## RESP2/RESP3 Reply

- Bulk string reply: the requested substring, or an empty string if the key does not exist or the range is invalid.
