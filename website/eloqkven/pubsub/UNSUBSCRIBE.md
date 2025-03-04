---
title: UNSUBSCRIBE
---

# UNSUBSCRIBE

Unsubscribes the client from one or more channels.

## Syntax

```
UNSUBSCRIBE channel [channel ...]
```

## Parameters

- **channel**: One or more channel names to unsubscribe from. Each channel is specified separately.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each unsubscription. The time complexity depends on the number of channels to unsubscribe from.
- **ACL categories:** `@pubsub`, `@write`

The `UNSUBSCRIBE` command allows a client to unsubscribe from one or more channels. Once unsubscribed, the client will no longer receive messages sent to those channels.

If no channels are specified, the command will unsubscribe the client from all channels it is currently subscribed to.

## Examples

### Unsubscribing from Specific Channels

To unsubscribe from a single channel:

```
UNSUBSCRIBE news
```

After running this command, the client will stop receiving messages from the `news` channel.

### Unsubscribing from Multiple Channels

To unsubscribe from multiple channels simultaneously:

```
UNSUBSCRIBE news sports weather
```

The client will be unsubscribed from the `news`, `sports`, and `weather` channels.

### Unsubscribing from All Channels

To unsubscribe from all channels:

```
UNSUBSCRIBE
```

If no channels are specified, the command will unsubscribe the client from all channels it is currently subscribed to.

## Edge Cases

- If the client is not subscribed to a specified channel, the command has no effect on that channel.
- The command does not affect pattern-based subscriptions made with `PSUBSCRIBE`. Use `PUNSUBSCRIBE` to handle pattern-based subscriptions.

## RESP2/RESP3 Reply

- Array reply: The command returns an array containing the following elements:
  1. The message type `unsubscribe`.
  2. The channel that was unsubscribed from (or `*` for all channels).
  3. The number of channels the client is currently subscribed to.

Example reply for `UNSUBSCRIBE news`:

```
1) "unsubscribe"
2) "news"
3) (integer) 2
```

This indicates that the client was unsubscribed from the `news` channel and is currently subscribed to 2 channels.

## Notes

- The `UNSUBSCRIBE` command is used for direct channel-based messaging in Redis.
- To unsubscribe from channels based on patterns, use the `PUNSUBSCRIBE` command.
- If a client is unsubscribed from all channels, it will receive a message indicating it is no longer subscribed.
