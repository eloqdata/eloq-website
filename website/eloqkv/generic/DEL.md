---
title: DEL
---

# DEL

Removes the specified keys from the Redis database.

## Syntax

```
DEL key [key ...]
```

## Parameters

- **key**: One or more keys to be deleted. Each key is specified separately.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N), where N is the number of keys to be removed. If the keys do not exist, the time complexity is O(1).
- **ACL categories:** `@write`

The `DEL` command removes the specified keys from the Redis database. If a key does not exist, it is ignored. The command can accept multiple keys in a single call, and it will return the number of keys that were removed.

## Examples

### Removing a Single Key

To delete a single key:

```
DEL mykey
```

This command will remove the key `mykey` from the database. If `mykey` does not exist, the command will simply return `0`.

### Removing Multiple Keys

To delete multiple keys:

```
DEL key1 key2 key3
```

This command will remove `key1`, `key2`, and `key3` from the database. The command will return the number of keys that were actually removed. If some of the keys did not exist, they will be ignored.

### Checking Key Deletion

To verify if a key is deleted, you can use:

```
EXISTS mykey
```

After executing `DEL`, `EXISTS mykey` should return `0` if `mykey` was successfully removed.

## RESP2/RESP3 Reply

- Integer reply: The number of keys that were removed.

### Example Reply

If two keys were removed:

```
(integer) 2
```

This indicates that two of the specified keys were successfully deleted.

## Notes

- The `DEL` command is an atomic operation, meaning that all specified keys will be removed in a single step.
- Use `DEL` with caution, as deleting keys is irreversible. Ensure that you are not inadvertently removing important data.
- For removing keys with expiration, consider using the `EXPIRE` command instead.
