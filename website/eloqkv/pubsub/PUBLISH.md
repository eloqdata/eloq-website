---
title: PUBLISH
---

# PUBLISH

Posts a message to the specified channel.

## Syntax

```
PUBLISH channel message
```

## Parameters

- **channel**: The name of the channel to which the message will be published.
- **message**: The message to be sent to the specified channel.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of subscribers to the channel.
- **ACL categories:** `@pubsub`, `@write`

The `PUBLISH` command sends a message to the specified channel. All clients currently subscribed to that channel will receive the message. The message is sent to all clients subscribed to the channel and is not stored by Redis.

## Examples

### Basic Usage

To publish a message to the channel `news`:

```
PUBLISH news "Breaking news: Redis 7.0 released!"
```

Clients subscribed to the `news` channel will receive the message:

```
"Breaking news: Redis 7.0 released!"
```

### Multiple Subscribers

If multiple clients are subscribed to the `news` channel, each of them will receive the published message.

### Message Content

The message can be any string value. For example:

```
PUBLISH announcements "New features in Redis 7.0: Improved performance and new commands!"
```

### Channel with Multiple Subscribers

If `mychannel` has three subscribers, publishing to `mychannel` will send the message to all three subscribers:

```
PUBLISH mychannel "Hello subscribers!"
```

Each of the three clients will receive:

```
"Hello subscribers!"
```

## Edge Cases

- If the channel does not exist or has no subscribers, the message is still sent, but no clients will receive it.
- The message size is limited by Redis memory constraints.

## RESP2/RESP3 Reply

- Integer reply: The number of clients that received the message.

Example reply for `PUBLISH mychannel "Hello world!"`:

```
(integer) 3
```

This reply indicates that three clients received the message.

## Notes

- The `PUBLISH` command is used in conjunction with the `SUBSCRIBE` and `PSUBSCRIBE` commands for message distribution in Redis.
- Messages are not stored; they are only sent to clients that are currently subscribed to the channel.
