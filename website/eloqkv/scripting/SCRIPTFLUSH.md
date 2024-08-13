---
title: SCRIPT FLUSH
---

# SCRIPT FLUSH

Removes all Lua scripts from the Redis server's script cache.

## Syntax

```
SCRIPT FLUSH
```

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N), where N is the number of scripts stored in the server’s script cache.
- **ACL categories:** `@scripting`

The `SCRIPT FLUSH` command clears all Lua scripts from the Redis server’s script cache. This operation removes all scripts that have been loaded into memory using the `SCRIPT LOAD` command. After executing `SCRIPT FLUSH`, the script cache will be empty, and all script-related operations will need to reload scripts if required.

## Examples

### Flushing All Scripts

To remove all scripts:

```
SCRIPT FLUSH
```

After this command is executed, all previously loaded scripts are removed from the cache. This is useful when you want to clear the server’s script cache to free up memory or ensure that no old or unnecessary scripts remain loaded.

### Use Case Scenario

1. Load a script into Redis:

   ```
   SCRIPT LOAD "return redis.call('SET', 'key', 'value')"
   ```

2. Check if the script is loaded using `SCRIPT EXISTS`:

   ```
   SCRIPT EXISTS <sha1>
   ```

3. Flush all scripts:

   ```
   SCRIPT FLUSH
   ```

4. Verify the script is no longer available:

   ```
   SCRIPT EXISTS <sha1>
   ```

After flushing, `SCRIPT EXISTS` will return `0`, indicating that the script with SHA1 hash `<sha1>` is no longer loaded.

## RESP2/RESP3 Reply

- Simple string reply: `OK`

### Example Reply

```
"OK"
```

This indicates that the `SCRIPT FLUSH` command was successful and all scripts have been removed.

## Notes

- The `SCRIPT FLUSH` command is a global operation and affects all clients connected to the Redis server.
- Use `SCRIPT FLUSH` with caution, especially in production environments, as it will clear all scripts from the server.
- To clear specific scripts, use `SCRIPT KILL` to stop a running script or manage scripts individually.
