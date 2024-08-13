---
title: DUMP
---

# DUMP

Serializes the value of the specified key into a binary format.

## Syntax

```
DUMP key
```

## Parameters

- **key**: The key whose value you want to serialize and dump.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N), where N is the size of the value being serialized.
- **ACL categories:** `@read`

The `DUMP` command serializes the value of the specified key into a binary format that can be used to reconstruct the key later. This command returns a serialized string that can be used with the `RESTORE` command to recreate the key with its value.

## Examples

### Serializing a Key

To serialize the value of a key:

```
DUMP mykey
```

This command will return a binary string representing the serialized value of `mykey`. If `mykey` does not exist, the command will return `nil`.

### Restoring a Serialized Key

To restore a key from a serialized value:

1. Obtain the serialized value using `DUMP`:

   ```
   DUMP mykey
   ```

2. Use `RESTORE` to recreate the key:

   ```
   RESTORE mykey 0 <serialized_value>
   ```

Replace `<serialized_value>` with the binary string obtained from the `DUMP` command. The `0` specifies the TTL (Time To Live) for the restored key. Use `-1` if you do not want to set an expiration.

## RESP2/RESP3 Reply

- Bulk string reply: A binary string representing the serialized value of the key.

### Example Reply

```
"\x00\x01\x02..."
```

This is the serialized binary representation of the key's value.

## Notes

- The serialized format is Redis-specific and is used internally by Redis to store key-value pairs. It is not intended for direct manipulation outside of Redis.
- Use `DUMP` in combination with `RESTORE` for data migration or backup purposes.
- If the key does not exist, `DUMP` returns `nil`, indicating that there is nothing to serialize.
