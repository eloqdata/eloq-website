---
title: RESTORE
---

# RESTORE

Restores a key from a serialized value, creating it in the Redis database.

## Syntax

```
RESTORE key ttl serialized-value
```

## Parameters

- **key**: The name of the key to be restored.
- **ttl**: The time-to-live (TTL) in milliseconds for the key. Use `0` to set no expiration, or a positive integer to specify the TTL.
- **serialized-value**: The binary serialized value of the key, typically obtained from the `DUMP` command.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N), where N is the size of the serialized value.
- **ACL categories:** `@write`

The `RESTORE` command is used to restore a key from a serialized value. The key is recreated with the value provided, and an optional TTL can be set. This command is useful for data migration or restoring keys from backups.

## Examples

### Restoring a Key

To restore a key from a serialized value:

1. Obtain the serialized value of the key using the `DUMP` command:

   ```
   DUMP mykey
   ```

2. Use `RESTORE` to recreate the key with the serialized value:

   ```
   RESTORE mykey 3600000 "serialized-value"
   ```

   Here, `3600000` is the TTL in milliseconds (1 hour), and `"serialized-value"` is the binary string obtained from the `DUMP` command.

### Restoring Without TTL

To restore a key without setting an expiration:

```
RESTORE mykey 0 "serialized-value"
```

This will create the key `mykey` with the value from the serialized data and will not expire.

## RESP2/RESP3 Reply

- Simple string reply: `OK` if the key was successfully restored.

### Example Reply

```
"OK"
```

This indicates that the `RESTORE` command was successful, and the key has been created with the provided serialized value.

## Notes

- The `serialized-value` must be in the format produced by the `DUMP` command. Using an incorrect format will result in an error.
- If the key already exists in the database, it will be overwritten with the new value provided by `RESTORE`.
- The TTL value is optional. Setting `ttl` to `0` means the key will not expire.
