---
title: PUNSUBSCRIBE
---

# PUNSUBSCRIBE

Unsubscribes the client from channels matching the specified patterns.

## Syntax

```
PUNSUBSCRIBE [pattern [pattern ...]]
```

## Parameters

- **pattern**: One or more patterns to unsubscribe from. Patterns should match those previously subscribed to using the `PSUBSCRIBE` command.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each unsubscription. The time complexity depends on the number of patterns to unsubscribe from.
- **ACL categories:** `@pubsub`, `@write`

The `PUNSUBSCRIBE` command is used to unsubscribe from channels that match the specified patterns. Patterns are the same as those used with `PSUBSCRIBE`, allowing clients to remove themselves from multiple channels at once.

If no patterns are specified, the command unsubscribes the client from all patterns it is currently subscribed to.

## Examples

### Unsubscribing from Specific Patterns

To unsubscribe from channels matching the pattern `news*`:

```
PUNSUBSCRIBE news*
```

After running this command, the client will no longer receive messages from channels like `news.sports`, `news.weather`, etc.

### Unsubscribing from Multiple Patterns

To unsubscribe from multiple patterns:

```
PUNSUBSCRIBE news* sport* tech*
```

The client will be unsubscribed from channels matching any of the specified patterns, such as `news.sports`, `sport.football`, `tech.gadgets`, etc.

### Unsubscribing from All Patterns

To unsubscribe from all patterns:

```
PUNSUBSCRIBE
```

If no patterns are provided, the client will be unsubscribed from all patterns it is currently subscribed to.

## Edge Cases

- If the patterns provided do not match any currently subscribed channels, the command has no effect.
- The command will not unsubscribe the client from channels subscribed to using `SUBSCRIBE` (direct channel subscriptions).

## RESP2/RESP3 Reply

- Array reply: The command returns an array containing the following elements:
  1. The message type `punsubscribe`.
  2. The pattern that was unsubscribed from (or `*` for all patterns).
  3. The number of patterns the client is currently subscribed to.

Example reply for `PUNSUBSCRIBE news*`:

```
1) "punsubscribe"
2) "news*"
3) (integer) 2
```

This indicates that the client was unsubscribed from channels matching the `news*` pattern, and currently has 2 patterns subscribed.

## Notes

- The `PUNSUBSCRIBE` command works with `PSUBSCRIBE` for pattern-based message subscriptions.
- To unsubscribe from specific channels (not patterns), use the `UNSUBSCRIBE` command.
