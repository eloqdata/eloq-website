---
title: EXEC
---

# EXEC

Executes all commands issued after the `MULTI` command in a transaction.

## Syntax

```
EXEC
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of commands queued in the transaction.
- **ACL categories:** `@transaction`, `@write`

The `EXEC` command is used to execute all the commands that were queued up after a `MULTI` command. When `EXEC` is called, all the commands that were queued within the transaction are executed atomically. This means that either all of the commands are executed or none of them are, ensuring atomicity and consistency.

## Examples

### Executing a Transaction

1. Start a transaction with `MULTI`:

   ```
   MULTI
   ```

2. Queue some commands:

   ```
   SET key1 "value1"
   SET key2 "value2"
   ```

3. Execute the queued commands:

   ```
   EXEC
   ```

After running `EXEC`, both `SET` commands will be executed, and the keys `key1` and `key2` will be set to `"value1"` and `"value2"`, respectively.

### Handling Transaction Errors

If any of the commands in the transaction fail during execution, Redis will still execute all the successfully executed commands. The client will receive an array of responses from `EXEC`, where each element corresponds to the response of each command executed.

### Example of Executing Commands

```
MULTI
SET key1 "value1"
SET key2 "value2"
EXEC
```

After `EXEC`, the result might look like:

```
1) "OK"
2) "OK"
```

This indicates that both `SET` commands were executed successfully.

### Example with a Failed Command

```
MULTI
SET key1 "value1"
SET non_existing_key "value2"  // Simulating a command failure
EXEC
```

If `SET non_existing_key` fails, the result might look like:

```
1) "OK"
2) (error) ERR unknown command 'SET'
```

This indicates that while the first command was executed successfully, the second command failed.

## Edge Cases

- If `EXEC` is called without a preceding `MULTI`, it will return an error indicating that no transaction is in progress.
- `EXEC` will not execute commands that were not queued properly due to errors or invalid commands.

## RESP2/RESP3 Reply

- Array reply: An array where each element is the result of the corresponding command in the transaction. The order of the results matches the order of commands in the transaction.

Example reply for `EXEC`:

```
1) "OK"
2) "OK"
```

This indicates that all commands in the transaction were executed successfully.

## Notes

- Use `DISCARD` to abort a transaction and discard all queued commands if needed.
- `EXEC` ensures that all commands in the transaction are executed atomically, which is crucial for maintaining data consistency.
