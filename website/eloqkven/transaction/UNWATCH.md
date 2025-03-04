---
title: UNWATCH
---

# UNWATCH

Stops monitoring all keys that were being watched for changes in the current transaction.

## Syntax

```
UNWATCH
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1).
- **ACL categories:** `@transaction`, `@write`

The `UNWATCH` command is used to cancel the monitoring of keys that were being watched for changes during a transaction. When a transaction is started with the `MULTI` command and `WATCH` was used to monitor specific keys, `UNWATCH` stops the monitoring of all those keys. This is useful when you want to abort the current transaction without executing any commands and prevent any potential conflicts or issues due to key changes.

## Examples

### Unwatching Keys

1. Start a transaction and watch keys:

   ```
   WATCH key1 key2
   MULTI
   ```

2. Queue commands:

   ```
   SET key1 "value1"
   SET key2 "value2"
   ```

3. Unwatch the keys if needed:

   ```
   UNWATCH
   ```

4. Decide not to execute the transaction and call `DISCARD`:

   ```
   DISCARD
   ```

After calling `UNWATCH`, the keys `key1` and `key2` will no longer be monitored for changes. The transaction can now be discarded without executing the commands.

### Using UNWATCH in a Transaction

1. Watch a key:

   ```
   WATCH key1
   ```

2. Start a transaction:

   ```
   MULTI
   ```

3. Queue commands:

   ```
   SET key1 "value1"
   ```

4. Unwatch the key and execute:

   ```
   UNWATCH
   EXEC
   ```

In this case, `UNWATCH` cancels the monitoring of `key1`, and the `EXEC` command will not execute if any changes occurred to `key1` while being watched.

## RESP2/RESP3 Reply

- Simple string reply: `OK`

Example reply for `UNWATCH`:

```
"OK"
```

This indicates that all watched keys have been unmonitored and the transaction state has been reset regarding key monitoring.

## Notes

- The `UNWATCH` command is typically used in conjunction with `WATCH` and `MULTI` to manage transaction states and handle potential conflicts with watched keys.
- `UNWATCH` is particularly useful when you want to ensure that watched keys are no longer monitored before committing or discarding a transaction.
