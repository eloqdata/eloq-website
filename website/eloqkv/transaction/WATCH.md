---
title: WATCH
---

# WATCH

Monitors one or more keys for changes. If any of the watched keys are modified before the transaction is executed, the transaction will be aborted.

## Syntax

```
WATCH key [key ...]
```

## Parameters

- **key**: One or more keys to be monitored for changes. Each key is specified separately.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of keys being watched.
- **ACL categories:** `@transaction`, `@write`

The `WATCH` command is used to monitor one or more keys for changes. When a key is watched, if any of the watched keys are modified (i.e., updated) before a transaction is executed, the transaction will be aborted. This mechanism helps ensure that transactions are executed only if the watched keys remain unchanged, which is useful for preventing conflicts and maintaining data consistency.

## Examples

### Watching Keys

To start watching one or more keys:

```
WATCH key1 key2
```

The keys `key1` and `key2` will be monitored for any changes. If either key is modified, the transaction that follows will be aborted.

### Using WATCH with Transactions

1. Watch keys:

   ```
   WATCH key1 key2
   ```

2. Start a transaction:

   ```
   MULTI
   ```

3. Queue commands:

   ```
   SET key1 "value1"
   SET key2 "value2"
   ```

4. Execute the transaction:

   ```
   EXEC
   ```

If any of `key1` or `key2` were modified by another client between the `WATCH` and `EXEC` commands, the transaction will be aborted, and `EXEC` will return a nil reply.

### Handling Transactions with WATCH

If no modifications occur to the watched keys, the queued commands will be executed:

```
WATCH key1
MULTI
SET key1 "newvalue"
EXEC
```

If `key1` was not modified by other clients, the `SET` command will be executed, and `key1` will be updated to `"newvalue"`.

### Unwatching Keys

To stop monitoring the keys, use:

```
UNWATCH
```

This will remove all keys from the watch list and reset the monitoring state.

## RESP2/RESP3 Reply

- Simple string reply: `OK`

Example reply for `WATCH`:

```
"OK"
```

This indicates that the specified keys are now being watched for changes.

## Notes

- `WATCH` is used in combination with `MULTI` and `EXEC` to ensure that a transaction is only executed if no watched keys have been modified.
- The `WATCH` command is useful for implementing optimistic concurrency control in Redis transactions.
- To cancel watching keys without executing the transaction, use the `UNWATCH` command.
