---
title: GETDEL
---

# GETDEL

Gets the value of the specified key and deletes the key.

## Syntax

```
GETDEL key
```

## Parameters

- **key**: The name of the key whose value you want to retrieve and delete.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@write`

The `GETDEL` command retrieves the value of a key and simultaneously deletes the key from the Redis database. This command is useful when you want to perform both operations in a single, atomic operation.

## Examples

### Getting and Deleting a Key

To get the value of `mykey` and delete it:

```
GETDEL mykey
```

If `mykey` has the value `"hello"`, the command will return `"hello"` and remove `mykey` from the database.

### Example Usage

1. Set a key with a value:

   ```
   SET mykey "hello"
   ```

2. Retrieve and delete the key:

   ```
   GETDEL mykey
   ```

3. Example output:

   ```
   "hello"
   ```

   After executing this command, `mykey` will no longer exist in the database.

### Key Does Not Exist

If the key does not exist:

```
GETDEL nonexistingkey
```

The reply will be:

```
(nil)
```

## RESP2/RESP3 Reply

- Bulk string reply: The value of the key before deletion. If the key does not exist, the reply is `nil`.

### Example Reply

If `mykey` has a value `"hello"`:

```
"hello"
```

If the key does not exist:

```
(nil)
```

## Notes

- The `GETDEL` command is a combination of `GET` and `DEL`, providing a way to perform both actions atomically.
- This command is useful for ensuring that the key is deleted immediately after its value is retrieved, reducing the risk of race conditions.
- The command is atomic, meaning the retrieval and deletion happen as a single indivisible operation.
