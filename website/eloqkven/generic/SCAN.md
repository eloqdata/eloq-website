---
title: SCAN
---

# SCAN

Iterates over keys in the Redis database incrementally.

## Syntax

```
SCAN cursor [MATCH pattern] [COUNT count]
```

## Parameters

- **cursor**: The cursor position for the iteration. Initially, this should be `0`, and Redis will return a new cursor to continue the iteration.
- **MATCH pattern** (optional): A pattern to filter the keys returned. This uses glob-style pattern matching (`*`, `?`, `[abc]`).
- **COUNT count** (optional): A hint to the Redis server about how many keys to return per iteration. The actual number returned may vary.

## Details

- **Available since:** 2.8.0
- **Time complexity:** O(1) for each iteration step. The complexity of the complete iteration depends on the number of keys and the matching pattern.
- **ACL categories:** `@read`

The `SCAN` command is used to incrementally iterate over keys in the Redis database. Unlike the `KEYS` command, which may block the server if there are many keys, `SCAN` provides a cursor-based mechanism for iteration, allowing you to process keys in smaller, manageable chunks.

## Examples

### Basic Iteration

To start scanning keys from the beginning:

```
SCAN 0
```

This command will return a cursor and a list of keys. Use the cursor to continue scanning in subsequent calls.

### Iteration with Pattern Matching

To scan for keys matching a specific pattern:

```
SCAN 0 MATCH user:*
```

This command will return keys that match the pattern `user:*`. The cursor returned should be used to continue scanning.

### Iteration with Count Hint

To scan with a specific count hint:

```
SCAN 0 COUNT 100
```

This command will try to return approximately 100 keys per iteration. The actual number returned may be less, depending on the internal implementation.

### Example Iteration

1. Start the scan:

   ```
   SCAN 0
   ```

2. Response might include:

   ```
   1) "cursor"
   2) 1) "key1"
      2) "key2"
      3) "key3"
   ```

3. Continue scanning using the new cursor:

   ```
   SCAN cursor
   ```

4. Repeat until the cursor returned is `0`, indicating the end of the iteration.

## RESP2/RESP3 Reply

- Array reply: The first element is the new cursor position, and the second element is a list of keys matching the criteria.

### Example Reply

```
1) "12345"
2) 1) "user:1"
   2) "user:2"
```

Here, `"12345"` is the new cursor to use for the next scan, and the list contains the keys found.

## Notes

- `SCAN` is safer for production environments than `KEYS` because it does not block the server and provides a way to incrementally iterate over keys.
- Be aware that `SCAN` may return the same key multiple times or miss some keys in some rare cases, especially if keys are being added or removed during the scan.
- Use the `MATCH` option to filter results and `COUNT` to suggest the number of results per iteration, but note that these are hints and the actual behavior may vary.
