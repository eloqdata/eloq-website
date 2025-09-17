---
title: PUBSUB
---

# PUBSUB

Provides information about the state of the Pub/Sub subsystem, including channels and subscribers.

## Syntax

```
PUBSUB subcommand [argument [argument ...]]
```

## Subcommands

- **CHANNELS**: List all channels currently with at least one subscriber.
- **NUMSUB**: Get the number of subscribers for one or more channels.
- **NUMPAT**: Get the number of patterns currently subscribed to.

### CHANNELS

#### Syntax

```
PUBSUB CHANNELS [pattern]
```

#### Parameters

- **pattern**: An optional pattern to filter the channel names. Can include the wildcard character `*` to match multiple channels.

#### Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of channels. The complexity depends on the number of active channels.

The `CHANNELS` subcommand lists all active channels that have at least one subscriber. If a pattern is provided, only channels matching the pattern will be listed.

#### Example

```
PUBSUB CHANNELS news*
```

Returns channels like:

```
1) "news.sports"
2) "news.weather"
```

### NUMSUB

#### Syntax

```
PUBSUB NUMSUB channel [channel ...]
```

#### Parameters

- **channel**: One or more channel names to get the subscriber count for.

#### Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each channel queried.

The `NUMSUB` subcommand returns the number of subscribers for each specified channel. The command returns an array where each entry consists of a channel name followed by the number of subscribers to that channel.

#### Example

```
PUBSUB NUMSUB mychannel anotherchannel
```

Returns:

```
1) "mychannel"
2) (integer) 5
3) "anotherchannel"
4) (integer) 3
```

### NUMPAT

#### Syntax

```
PUBSUB NUMPAT
```

#### Details

- **Available since:** 1.0.0
- **Time complexity:** O(1).

The `NUMPAT` subcommand returns the number of patterns currently subscribed to. This provides insight into the number of pattern-based subscriptions.

#### Example

```
PUBSUB NUMPAT
```

Returns:

```
(integer) 2
```

## RESP2/RESP3 Reply

- **CHANNELS**: Array of channel names matching the pattern (if provided).
- **NUMSUB**: Array of channel names with their respective subscriber counts.
- **NUMPAT**: Integer representing the number of patterns subscribed to.

## Notes

- The `PUBSUB` command is used for monitoring and managing the state of the Pub/Sub subsystem in Redis.
- For more advanced monitoring, consider using Redis’s monitoring tools or client libraries with Pub/Sub support.
