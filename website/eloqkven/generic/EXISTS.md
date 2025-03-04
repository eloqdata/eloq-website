---
title: EXISTS
---

# EXISTS

Checks if the specified key exists in the Redis database.

## Syntax

```
EXISTS key [key ...]
```

## Parameters

- **key**: One or more keys to check for existence. Each key is specified separately.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each key checked.
- **ACL categories:** `@read`

The `EXISTS` command determines whether one or more keys exist in the Redis database. It returns `1` if the key exists and `0` if it does not. The command can accept multiple keys and will return an integer array indicating the existence of each key.

## Examples

### Checking a Single Key

To check if a single key exists:

```
EXISTS mykey
```

This command will return `1` if the key `mykey` exists, or `0` if it does not.

### Checking Multiple Keys

To check if multiple keys exist:

```
EXISTS key1 key2 key3
```

This command will return an array of integers, where each integer corresponds to the existence status of each key:

```
1) (integer) 1
2) (integer) 0
3) (integer) 1
```

In this example, `key1` and `key3` exist, while `key2` does not.

### Using EXISTS for Key Management

1. Create keys:

   ```
   SET key1 "value1"
   SET key2 "value2"
   ```

2. Check existence:

   ```
   EXISTS key1 key2 key3
   ```

The result will indicate the presence of `key1` and `key2`, and `0` for `key3`, which does not exist.

## RESP2/RESP3 Reply

- Integer reply: `1` if the key exists, `0` if it does not. For multiple keys, an array of integers is returned.

### Example Reply

If checking multiple keys:

```
1) (integer) 1
2) (integer) 0
3) (integer) 1
```

This means `key1` and `key3` exist, while `key2` does not.

## Notes

- The `EXISTS` command can be used to verify the presence of keys before performing operations that assume the key exists.
- In Redis versions 3.0.0 and above, the `EXISTS` command is more efficient with multiple keys, returning an array of results in a single call.
- For checking the existence of keys that may be set to expire, ensure you perform checks at appropriate intervals.
