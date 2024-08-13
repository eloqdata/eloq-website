---
title: SCRIPT EXISTS
---

# SCRIPT EXISTS

Checks if one or more Lua scripts are loaded into the Redis server.

## Syntax

```
SCRIPT EXISTS sha1 [sha1 ...]
```

## Parameters

- **sha1**: One or more SHA1 hashes of the Lua scripts to check for. Each hash corresponds to a script previously loaded into Redis using the `SCRIPT LOAD` command.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N), where N is the number of SHA1 hashes provided.
- **ACL categories:** `@scripting`

The `SCRIPT EXISTS` command allows you to check if specific Lua scripts are currently loaded into Redis by providing their SHA1 hashes. This is useful for verifying whether scripts have been loaded and are available for execution with the `EVALSHA` command.

## Examples

### Checking a Single Script

To check if a specific Lua script is loaded:

1. First, load a script and get its SHA1 hash:

   ```
   SCRIPT LOAD "return redis.call('SET', 'key', 'value')"
   ```

2. Use `SCRIPT EXISTS` with the SHA1 hash:

   ```
   SCRIPT EXISTS <sha1>
   ```

Replace `<sha1>` with the SHA1 hash returned by `SCRIPT LOAD`. The command will return `1` if the script is loaded, or `0` if it is not.

### Checking Multiple Scripts

To check multiple scripts:

1. Load several scripts and note their SHA1 hashes:

   ```
   SCRIPT LOAD "return redis.call('GET', 'key')"
   SCRIPT LOAD "return redis.call('SET', 'key', 'value')"
   ```

2. Check if both scripts are loaded:

   ```
   SCRIPT EXISTS <sha1_1> <sha1_2>
   ```

Replace `<sha1_1>` and `<sha1_2>` with the respective SHA1 hashes. The command will return an array of `1`s and `0`s indicating the presence of each script:

```
1) (integer) 1
2) (integer) 0
```

This means the script with `<sha1_1>` is loaded, but the script with `<sha1_2>` is not.

## RESP2/RESP3 Reply

- Array reply: An array of integers where each integer is `1` if the corresponding script SHA1 exists and `0` if it does not.

### Example Reply

If checking two scripts:

```
1) (integer) 1
2) (integer) 0
```

The first script is loaded (`1`), and the second script is not loaded (`0`).

## Notes

- The `SCRIPT EXISTS` command is helpful for managing scripts and ensuring that necessary scripts are loaded before executing them with `EVALSHA`.
- Use `SCRIPT LOAD` to load scripts and `SCRIPT FLUSH` to remove all scripts from the server if needed.
