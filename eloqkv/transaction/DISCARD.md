---
title: DISCARD
---

# DISCARD

Cancels the execution of all previously queued commands in a transaction and resets the connection to the non-transactional state.

## Syntax

```
DISCARD
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1).
- **ACL categories:** `@transaction`, `@write`

The `DISCARD` command is used to abort a transaction that was initiated using the `MULTI` command. When `DISCARD` is called, all commands that were queued up for execution within the transaction are discarded, and the connection is reset to its normal state. This means that no commands that were queued before `DISCARD` will be executed.

## Examples

### Aborting a Transaction

1. Start a transaction with `MULTI`:

   ```
   MULTI
   ```

2. Queue some commands:

   ```
   SET key1 "value1"
   SET key2 "value2"
   ```

3. Decide to abort the transaction and discard the queued commands:

   ```
   DISCARD
   ```

After running `DISCARD`, none of the commands queued with `MULTI` will be executed.

### After DISCARD

After calling `DISCARD`, the connection will be out of the transaction state and will be ready to accept new commands normally.

### Commands After DISCARD

You can continue to issue commands as usual after `DISCARD`. For example:

```
SET key3 "value3"
```

## Edge Cases

- If `DISCARD` is called when no transaction is in progress (i.e., when not in a `MULTI` state), the command will return an error stating that no transaction is in progress.
- `DISCARD` will not affect commands that have already been executed before the `MULTI` command.

## RESP2/RESP3 Reply

- Simple string reply: `OK`

Example reply for `DISCARD`:

```
"OK"
```

This indicates that the transaction was successfully aborted, and all queued commands were discarded.

## Notes

- The `DISCARD` command is used in conjunction with `MULTI` for managing transactions in Redis.
- To execute the queued commands, use the `EXEC` command instead of `DISCARD`.
