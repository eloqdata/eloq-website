---
title: SCRIPT LOAD
---

# SCRIPT LOAD

Loads a Lua script into the Redis server and returns its SHA1 hash.

## Syntax

```
SCRIPT LOAD script
```

## Parameters

- **script**: The Lua script to be loaded into Redis. The script is provided as a string and should be a valid Lua code.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N), where N is the length of the script.
- **ACL categories:** `@scripting`

The `SCRIPT LOAD` command is used to load a Lua script into Redis. The script is stored in the server's script cache and is identified by its SHA1 hash. This hash can then be used with the `EVALSHA` command to execute the script. Loading a script into Redis does not execute it; it only stores it for future use.

## Examples

### Loading a Script

To load a Lua script into Redis:

```
SCRIPT LOAD "return redis.call('SET', 'key', 'value')"
```

This command loads the script into Redis and returns its SHA1 hash. The script sets the value of `key` to `value`.

### Executing the Loaded Script

1. Load the script:

   ```
   SCRIPT LOAD "return redis.call('GET', 'key')"
   ```

2. Note the SHA1 hash returned by the command.

3. Execute the script using `EVALSHA`:

   ```
   EVALSHA <sha1> 1 key
   ```

Replace `<sha1>` with the SHA1 hash returned by `SCRIPT LOAD`. This will execute the script that retrieves the value of `key`.

### Checking Script Existence

To verify if a script is loaded, use:

```
SCRIPT EXISTS <sha1>
```

Replace `<sha1>` with the hash returned by `SCRIPT LOAD`. This will return `1` if the script is loaded, or `0` if it is not.

## RESP2/RESP3 Reply

- Simple string reply: The SHA1 hash of the loaded script.

### Example Reply

```
"1a2b3c4d5e6f7g8h9i0j"
```

This SHA1 hash identifies the loaded script and can be used with `EVALSHA` for execution.

## Notes

- Use `SCRIPT LOAD` to store scripts in Redis when you need to execute them frequently without sending the script text repeatedly.
- The script is stored in the server's memory until it is removed with `SCRIPT FLUSH` or evicted.
- Ensure that your Lua script is efficient and does not consume excessive memory or execution time.
