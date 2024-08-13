---
title: SUBSCRIBE
---

# SUBSCRIBE

Subscribes the client to one or more channels.

## Syntax

```
SUBSCRIBE channel [channel ...]
```

## Parameters

- **channel**: One or more channel names to subscribe to. Each channel is specified separately.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each subscription. The time complexity depends on the number of channels subscribed to.
- **ACL categories:** `@pubsub`, `@read`

The `SUBSCRIBE` command allows a client to subscribe to one or more channels. Once subscribed, the client will receive messages sent to those channels. This command is used for direct channel-based message distribution, where each message is sent to the channels specified.

## Examples

### Basic Usage

To subscribe to a single channel:

```
SUBSCRIBE news
```

After running this command, the client will start receiving messages published to the `news` channel.

### Subscribing to Multiple Channels

To subscribe to multiple channels simultaneously:

```
SUBSCRIBE news sports weather
```

The client will receive messages from all specified channels: `news`, `sports`, and `weather`.

### Receiving Messages

When a message is published to a subscribed channel, the client will receive a message formatted as follows:

```
1) "message"
2) "channel"
3) "message content"
```

For example, if a message `"Hello world!"` is published to the `news` channel:

```
1) "message"
2) "news"
3) "Hello world!"
```

### Unsubscribing

To stop receiving messages from a channel, use the `UNSUBSCRIBE` command:

```
UNSUBSCRIBE news
```

## Edge Cases

- If a channel does not exist or has no subscribers, the client will still be subscribed to it, but no messages will be received until a message is published.
- If the client is already subscribed to the specified channels, the command has no effect on those existing subscriptions.

## RESP2/RESP3 Reply

- Array reply: The command returns an array containing the following elements:
  1. The message type `subscribe`.
  2. The channel that was subscribed to.
  3. The number of channels the client is currently subscribed to.

Example reply for `SUBSCRIBE news`:

```
1) "subscribe"
2) "news"
3) (integer) 1
```

This indicates that the client has been subscribed to the `news` channel and is currently subscribed to 1 channel.

## Notes

- The `SUBSCRIBE` command is used for direct channel-based messaging in Redis.
- For pattern-based subscriptions, use the `PSUBSCRIBE` command.
- To unsubscribe from channels, use the `UNSUBSCRIBE` command.
