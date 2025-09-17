---
title: MULTI
---

# MULTI

Marks the start of a transaction block in which commands will be queued for atomic execution.

## Syntax

```
MULTI
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1).
- **ACL categories:** `@transaction`, `@write`

The `MULTI` command is used to start a transaction block in Redis. Once `MULTI` is called, all subsequent commands are queued and will be executed atomically when the `EXEC` command is issued. This means that either all the commands in the transaction will be executed or none will, ensuring atomicity and consistency.

## Examples

### Starting a Transaction

To start a transaction block:

```
MULTI
```

After issuing `MULTI`, all subsequent commands are queued and will be executed as a single unit.

### Queuing Commands

After starting the transaction with `MULTI`, you can queue multiple commands:

```
MULTI
SET key1 "value1"
SET key2 "value2"
```

The `SET` commands are queued and will be executed together when `EXEC` is called.

### Executing the Transaction

To execute the queued commands:

```
EXEC
```

The `EXEC` command will run all the queued commands atomically. If any command in the transaction fails, the rest of the commands are still executed, but the result will reflect the success or failure of each command.

### Example Workflow

1. Start a transaction:

   ```
   MULTI
   ```

2. Queue commands:

   ```
   SET key1 "value1"
   SET key2 "value2"
   ```

3. Execute the transaction:

   ```
   EXEC
   ```

The `EXEC` command will execute both `SET` commands and apply the changes.

## Edge Cases

- If `MULTI` is issued while already in a transaction (i.e., while `MULTI` has been called but `EXEC` has not been issued yet), it will simply queue the next commands.
- If commands are issued before `MULTI` is called, they will be executed immediately and will not be part of the transaction.

## RESP2/RESP3 Reply

- Simple string reply: `OK`

Example reply for `MULTI`:

```
"OK"
```

This indicates that the transaction block has been successfully started and subsequent commands will be queued.

## Notes

- Use `DISCARD` to abort a transaction and discard all queued commands if needed.
- The `MULTI` command must be followed by one or more commands and then `EXEC` to complete the transaction.
- For pattern-based subscriptions, use `PSUBSCRIBE` and `PUNSUBSCRIBE` in conjunction with `MULTI` and `EXEC` for transaction management.
