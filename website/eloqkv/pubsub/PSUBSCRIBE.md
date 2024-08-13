---
title: PSUBSCRIBE
---

# PSUBSCRIBE

Subscribes the client to channels matching the specified patterns.

## Syntax

```
PSUBSCRIBE pattern [pattern ...]
```

## Parameters

- **pattern**: One or more patterns to subscribe to. Patterns can include the wildcard character `*` to match multiple channels.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each subscription. The time complexity depends on the number of channels matched by the patterns.
- **ACL categories:** `@pubsub`, `@read`

The `PSUBSCRIBE` command allows a client to subscribe to multiple channels simultaneously using patterns. The client will receive messages published to channels that match the specified patterns. The command uses pattern matching, where `*` can be used to match any number of characters.

When a message is published to a channel matching one of the patterns, the client receives the message along with the name of the channel.

## Examples

### Basic Usage

To subscribe to all channels that start with "news":

```
PSUBSCRIBE news*
```

With this subscription, the client will receive messages published to channels like `news.sports`, `news.weather`, etc.

### Multiple Patterns

To subscribe to channels matching multiple patterns:

```
PSUBSCRIBE news* sport* tech*
```

The client will receive messages published to channels like `news.sports`, `sport.football`, `tech.gadgets`, etc.

### Using Wildcards

To subscribe to all channels:

```
PSUBSCRIBE *
```

This subscription will capture messages from all channels.

## Edge Cases

- If the pattern includes spaces or special characters, ensure proper escaping or quoting in the command.
- Subscriptions to invalid patterns or empty patterns are handled as normal subscriptions and will not return errors.

## RESP2/RESP3 Reply

- Array reply: The command returns an array containing the following elements:
  1. The message type `subscribe`.
  2. The pattern that was subscribed to.
  3. The number of patterns to which the client is currently subscribed.

Example reply for `PSUBSCRIBE news*`:

```
1) "psubscribe"
2) "news*"
3) (integer) 1
```

- If the command is sent after a `SUBSCRIBE` command, the client will receive additional replies indicating both pattern-based and direct subscriptions.

## Notes

- The `PSUBSCRIBE` command is used in conjunction with the `PUBLISH` command for pattern-based messaging in Redis.
- To unsubscribe from patterns, use the `PUNSUBSCRIBE` command.
