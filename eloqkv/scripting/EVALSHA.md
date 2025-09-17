---
title: EVALSHA
---

# EVALSHA

Evaluates a previously loaded Lua script by its SHA1 hash.

## Syntax

```
EVALSHA sha1 numkeys key [key ...] arg [arg ...]
```

## Parameters

- **sha1**: The SHA1 hash of the Lua script that was previously loaded into Redis using the `SCRIPT LOAD` command.
- **numkeys**: The number of keys that the script will access.
- **key**: The keys that the script will operate on. There should be `numkeys` keys specified.
- **arg**: Optional arguments that are passed to the script. They can be used inside the Lua script.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N), where N is the length of the script and the complexity of the operations performed by the script.
- **ACL categories:** `@scripting`, `@write`

The `EVALSHA` command allows you to execute a Lua script using its SHA1 hash. This is more efficient than `EVAL` when the script is frequently executed, as the script is pre-loaded into Redis and only needs to be referenced by its hash. The `EVALSHA` command is ideal for scenarios where you want to avoid repeatedly sending large Lua scripts to Redis.

## Examples

### Basic Usage

To execute a Lua script by its SHA1 hash:

1. Load the script into Redis:

   ```
   SCRIPT LOAD "return redis.call('SET', 'key', 'value')"
   ```

2. Note the SHA1 hash returned by the command.

3. Use `EVALSHA` with the SHA1 hash:

   ```
   EVALSHA <sha1> 1 key
   ```

In this example, replace `<sha1>` with the SHA1 hash returned by `SCRIPT LOAD`. The script sets the `key` to `value`.

### Script with Multiple Keys

To execute a script that operates on multiple keys:

1. Load a script with multiple keys:

   ```
   SCRIPT LOAD "return redis.call('MGET', KEYS[1], KEYS[2])"
   ```

2. Use `EVALSHA` with the appropriate SHA1 hash:

   ```
   EVALSHA <sha1> 2 key1 key2
   ```

This will retrieve the values of `key1` and `key2`.

### Script with Arguments

To pass arguments to a script:

1. Load a script with arguments:

   ```
   SCRIPT LOAD "return redis.call('SET', KEYS[1], ARGV[1])"
   ```

2. Execute using `EVALSHA`:

   ```
   EVALSHA <sha1> 1 key value
   ```

Here, `ARGV[1]` is set to `value` for `key`.

### Handling Errors

If the SHA1 hash does not match any loaded script, Redis will return an error. To check if a script is loaded, use `SCRIPT EXISTS` with the SHA1 hash.

## RESP2/RESP3 Reply

- The result of the script execution is returned as the reply. The reply format depends on the operations performed within the script.

### Example Reply

If the script sets a key:

```
"OK"
```

If the script retrieves a value:

```
"value"
```

## Notes

- Using `EVALSHA` is more efficient than `EVAL` for frequently executed scripts, as it avoids sending the script text repeatedly.
- If a script with the given SHA1 hash has not been loaded or has been evicted, Redis will return an error. In such cases, you may need to reload the script using `SCRIPT LOAD` and retry with `EVALSHA`.
