---
title: SUBSTR (Deprecated)
---

# SUBSTR (Deprecated)

This command is deprecated and has been replaced by the `GETRANGE` command. It was used to return a substring of the string stored at a key, determined by the specified start and end offsets.

## Syntax

```
SUBSTR key start end
```

## Parameters

- **key**: The name of the key whose string you want to retrieve a substring from.
- **start**: The zero-based starting index of the substring. Negative values can be used to specify offsets from the end of the string.
- **end**: The zero-based ending index of the substring (inclusive). Negative values can be used to specify offsets from the end of the string.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the length of the returned substring.
- **ACL categories:** `@read`, `@string`, `@slow`

The `SUBSTR` command was used to retrieve a substring of the string stored at `key`, as specified by the `start` and `end` parameters. The substring includes both the `start` and `end` offsets. If the key does not exist, `SUBSTR` returns an empty string.

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
SUBSTR mykey 0 4
```

This will return:

```
"Hello"
```

### Using Negative Indices

To retrieve the substring from the last 6 characters of the string:

```
SUBSTR mykey -6 -1
```

This will return:

```
"World!"
```

## Edge Cases

- If the key does not exist, `SUBSTR` returns an empty string.
- If the key exists but is not a string, an error is returned.
- If `start` is greater than `end`, `SUBSTR` returns an empty string.
- If the specified range exceeds the length of the string, `SUBSTR` returns the available substring.

## RESP2/RESP3 Reply

- Bulk string reply: the requested substring, or an empty string if the key does not exist or the range is invalid.
