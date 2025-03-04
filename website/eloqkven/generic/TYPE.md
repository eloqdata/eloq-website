---
title: TYPE
---

# TYPE

Returns the type of the value stored at the specified key.

## Syntax

```
TYPE key
```

## Parameters

- **key**: The name of the key for which you want to determine the type.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`

The `TYPE` command is used to determine the type of value associated with a given key in Redis. The type can be one of the following:

- `string`
- `list`
- `set`
- `zset` (sorted set)
- `hash`
- `none` (if the key does not exist)

## Examples

### Checking the Type of a Key

To determine the type of a key:

```
TYPE mykey
```

If `mykey` is a string, the command will return `string`. If it's a list, the return value will be `list`, and so on.

### Example Usage

1. Set a key with different types:

   ```
   SET mystring "hello"
   LPUSH mylist "world"
   SADD myset "foo"
   ZADD myzset 1 "bar"
   HSET myhash field "value"
   ```

2. Check the type of each key:

   ```
   TYPE mystring
   TYPE mylist
   TYPE myset
   TYPE myzset
   TYPE myhash
   ```

3. Example output:

   ```
   string
   list
   set
   zset
   hash
   ```

### Non-existent Key

For a key that does not exist:

```
TYPE nonexistingkey
```

The reply will be:

```
none
```

## RESP2/RESP3 Reply

- Simple string reply: The type of the key. The possible values are `string`, `list`, `set`, `zset`, `hash`, or `none`.

### Example Reply

If the key `mykey` is a string:

```
"string"
```

If the key `mykey` does not exist:

```
"none"
```

## Notes

- The `TYPE` command provides a quick way to determine the type of a value associated with a key, which can be useful for debugging and scripting.
- The command does not check the existence of the key. It will return `none` for keys that do not exist in the database.
- Redis keys can only hold one type of value at a time. The `TYPE` command helps to ensure that operations on keys are compatible with their types.
