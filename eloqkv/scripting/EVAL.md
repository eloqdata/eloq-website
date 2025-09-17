---
title: EVAL
---

# EVAL

Evaluates a Lua script in the context of the Redis server.

## Syntax

```
EVAL script numkeys key [key ...] arg [arg ...]
```

## Parameters

- **script**: The Lua script to be executed.
- **numkeys**: The number of keys that the script will access.
- **key**: The keys that the script will operate on. There should be `numkeys` keys specified.
- **arg**: Optional arguments that are passed to the script. They can be used inside the Lua script.

## Details

- **Available since:** 2.6.0
- **Time complexity:** O(N), where N is the length of the script and the complexity of the operations performed by the script.
- **ACL categories:** `@scripting`, `@write`

The `EVAL` command allows the execution of Lua scripts directly on the Redis server. Lua scripts can be used to perform complex operations atomically. The script is executed in the context of the server, meaning it has access to the same data as Redis commands and can perform operations as needed.

## Examples

### Basic Usage

To evaluate a simple Lua script:

```
EVAL "return redis.call('SET', 'key', 'value')" 1 key
```

In this example, the Lua script sets the key `key` to `value`. The `1` indicates that the script operates on one key, which is `key`.

### Script with Multiple Keys

To work with multiple keys:

```
EVAL "return redis.call('MGET', KEYS[1], KEYS[2])" 2 key1 key2
```

This script retrieves the values of `key1` and `key2`. The `2` indicates that there are two keys in the script.

### Script with Arguments

To pass additional arguments to the script:

```
EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 key value
```

Here, `ARGV[1]` is the argument `value`, which will be set for `key`. The `1` specifies that the script operates on one key.

### Complex Script Example

To perform more complex operations:

```
EVAL "
local key = KEYS[1]
local value = ARGV[1]
local existing = redis.call('GET', key)
if existing then
    return redis.call('SET', key, value)
else
    return redis.call('SET', key, value)
end
" 1 key newvalue
```

This script checks if `key` exists and sets it to `newvalue` accordingly.

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

- Lua scripts executed with `EVAL` are executed atomically, ensuring that no other Redis commands are executed in between.
- To check the execution time of a script, use `EVALSHA` with the script hash.
- Scripts can be preloaded into Redis using `SCRIPT LOAD` for improved performance with `EVALSHA`.
