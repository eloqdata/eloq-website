---
title: KEYS
---

# KEYS

Returns all keys matching the specified pattern.

## Syntax

```
KEYS pattern
```

## Parameters

- **pattern**: The pattern to match against keys in the Redis database. The pattern can include glob-style wildcard characters:
  - `*` matches any sequence of characters (including an empty sequence).
  - `?` matches any single character.
  - `[abc]` matches any one of the characters within the brackets.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N), where N is the number of keys in the database. The command scans all keys and may be slow if the database contains a large number of keys.
- **ACL categories:** `@read`

The `KEYS` command is used to find all keys in the Redis database that match a given pattern. It is useful for debugging or for operations where you need to retrieve a subset of keys.

## Examples

### Matching All Keys

To retrieve all keys in the database:

```
KEYS *
```

This command returns all keys in the current database.

### Matching Specific Keys

To retrieve keys that start with a certain prefix:

```
KEYS user:*
```

This command returns all keys that begin with `user:`.

### Matching Keys with a Pattern

To find keys with a specific pattern:

```
KEYS session:?????
```

This command matches keys that start with `session:` followed by exactly five characters.

## RESP2/RESP3 Reply

- Array reply: An array of keys matching the pattern. Each key is returned as a bulk string.

### Example Reply

If the database contains the following keys: `user:1`, `user:2`, and `session:12345`, the reply for `KEYS user:*` would be:

```
1) "user:1"
2) "user:2"
```

## Notes

- The `KEYS` command is not recommended for production use in large databases because it can be slow and block the server.
- For production environments, consider using the `SCAN` command, which provides an incremental iteration over the keyspace and is more suitable for large datasets.
- The `KEYS` command can be useful for debugging or administrative purposes where the number of keys is manageable.
