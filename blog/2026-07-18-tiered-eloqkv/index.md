---
slug: eloqkv-tiered-storage
title: "Hot/Warm/Cold User State: Scaling Redis-Compatible Data Without Scaling DRAM"
description: "How EloqKV uses memory, local NVMe SSD, and object storage to serve active user state at low latency while reducing DRAM-heavy Redis cost."
authors: eloq
date: 2026-07-17
image: /img/blog/eloqkvtierstorage.png
tags: [Company]
featured: true
featuredMain: true
blog: true
---

Most Redis deployments start as caches. A product needs fast profile lookups, session state, rate limits, feature flags, feed metadata, or counters, and Redis is the obvious answer: familiar API, low latency, mature tooling.

The problem appears later.

The cache quietly becomes a state layer. The dataset grows from tens of gigabytes to hundreds of gigabytes or terabytes. Only a small fraction of users are active at any moment, but the infrastructure bill still follows total memory size. The hot working set is small. The Redis cluster is not.

This is where EloqKV's hot/warm/cold architecture matters.

EloqKV is a Redis- and Valkey-compatible database for large stateful workloads. It keeps active data fast, serves datasets beyond DRAM from local NVMe SSD, and uses object storage for durable capacity. The application still speaks Redis-compatible APIs, but the storage architecture is no longer forced to keep every byte in memory.

## TL;DR

For user-state workloads, EloqKV maps data temperature to storage cost:

| Data temperature | Example data                                                       | EloqKV placement | Why it matters                     |
| ---------------- | ------------------------------------------------------------------ | ---------------- | ---------------------------------- |
| Hot              | Active users, active sessions, recently updated features           | Memory           | Lowest-latency request path        |
| Warm             | Recently active users, profile state, feed metadata, feature state | Local NVMe SSD   | Fast access without DRAM-only cost |
| Cold             | Inactive users, historical state, durable checkpoints              | Object storage   | Low-cost durable capacity          |

The result is a Redis-compatible architecture for workloads where the dataset is much larger than the active working set.

## Redis Is Great Until the Working Set Stops Fitting the Budget

Redis is excellent for low-latency in-memory access. For small hot datasets, it is hard to beat.

But many production systems use Redis for more than disposable cache entries:

- session stores
- user profiles
- shopping carts
- feed lists
- leaderboards
- feature stores
- rate-limit state
- AI conversation state
- agent checkpoints

Once Redis holds this kind of state, it starts behaving like part of the online database path. The operational questions change:

- How much of the dataset is truly hot?
- How much DRAM are we buying for users who are not active right now?
- What happens when Redis persistence is enabled?
- How do we control P99 and P99.99 latency during background work?
- How many shards and replicas are we adding just to hold capacity?

Redis Open Source supports persistence through RDB snapshots, AOF logs, no persistence, or RDB plus AOF. The official Redis documentation is clear that these modes involve tradeoffs: RDB is compact and useful for backups, while AOF can improve durability but introduces fsync and log rewrite behavior that must be managed carefully.

That is not a criticism of Redis. It is a sign that the workload has changed. A cache is being asked to carry durable state.

## The EloqKV Model: Memory + NVMe + Object Storage

EloqKV separates the Redis-compatible serving layer from the assumption that all useful data must live in DRAM.

The architecture is simple:

1. **Memory for active state.**  
   The users currently generating traffic stay on the fastest path.

2. **Local NVMe SSD for warm state.**  
   Recent but less active data remains close to compute and can be served at low latency without occupying expensive DRAM.

3. **Object storage for durable cold data.**  
   Historical state, merged data, and checkpoints move to low-cost durable storage.

For the application, the goal is boring compatibility. Existing Redis and Valkey clients should not need to know whether a key is hot, warm, or cold. The storage system should handle tiering, merge, and persistence behind the API.

That is the point of EloqKV: keep the Redis-compatible developer experience, but change the cost and capacity curve underneath.

## Example: User Features

Imagine a product with 100 million registered users.

At any given time, maybe 1% of users are active. Their features change frequently:

- recent clicks
- cart updates
- recommendation signals
- risk counters
- preference changes
- session state
- AI agent context

In a memory-only architecture, the team often provisions Redis around total feature size. If the full feature dataset grows to 1 TB, the Redis footprint grows with it, even if the active working set is much smaller.

In EloqKV, active feature updates can hit memory first. Semi-active feature state remains available from local NVMe. Older merged state can be checkpointed into object storage. The application keeps using Redis-compatible commands, while the storage layer handles the temperature shift.

This is the difference between scaling active data and scaling all data as if it were active.

## Example: Sessions, Profiles, and Feed State

Session and feed workloads naturally have temperature.

A user currently browsing the app needs the fastest session and profile updates. A user who was active yesterday may still need fast access, but not necessarily DRAM residency. A user inactive for 90 days mainly needs durable recovery and eventual access.

The same pattern appears in feed systems. Recent feed items and active timelines are hot. Older feed history is warm or cold.

With memory-only Redis, long-tail state can become a DRAM bill. With EloqKV, that long tail can move down the storage hierarchy:

- active timelines in memory;
- recent feed state on local NVMe;
- historical feed state and checkpoints in object storage.

The operational model becomes closer to the actual product behavior: active users get the fastest path, inactive users do not force the same memory footprint.

## Example: AI App State and Agent Memory

AI applications make this pattern even more visible.

Early AI apps often store active conversations or agent state in Redis. That works well for prototypes and small deployments. As the product grows, state becomes more durable:

- users return to old conversations;
- agents need checkpoints;
- workflows need recovery;
- enterprise customers expect state to survive failures;
- long-term memory becomes product data, not cache data.

This is a natural hot/warm/cold workload.

Active conversations should stay fast. Recent conversations should remain nearby. Long-term memory and older checkpoints should move to durable storage. EloqKV gives AI teams a Redis-compatible way to model that lifecycle without treating all state as DRAM-resident cache keys.

## Why This Is Different From Simply Adding Persistence to Redis

Persistence and tiering are related, but they are not the same thing.

Redis persistence protects data through mechanisms such as RDB and AOF. Those mechanisms are important, but Redis still primarily serves from memory. When the dataset grows, capacity planning often remains tied to DRAM, shards, replicas, and eviction policy.

EloqKV treats tiering as part of the storage architecture:

- memory is the hot tier;
- local NVMe is the warm capacity tier;
- object storage is the durable cold tier;
- background merge/checkpoint processes manage movement across tiers.

That matters when the full dataset is much larger than the hot working set.

## EloqKV vs Memory-Only Redis

| Question           | Memory-only Redis / Valkey                      | EloqKV                                                                |
| ------------------ | ----------------------------------------------- | --------------------------------------------------------------------- |
| Application API    | Redis-compatible                                | Redis- and Valkey-compatible                                          |
| Hot data           | DRAM                                            | Memory                                                                |
| Warm data          | Usually still DRAM, unless managed by the app   | Local NVMe SSD                                                        |
| Cold durable data  | RDB/AOF or another system                       | Object storage through tiered architecture                            |
| Capacity economics | Often scale with memory                         | Track hot set in memory and larger dataset on NVMe/object storage     |
| Best fit           | Small hot datasets, pure cache, ephemeral state | Large Redis-style state where dataset size exceeds active working set |

Redis remains the right answer for many small caches. EloqKV is for the moment when Redis-compatible data becomes large, stateful, persistent, and expensive to keep entirely in DRAM.

## When to Evaluate EloqKV

EloqKV is worth evaluating when several of these are true:

- your Redis-compatible dataset is above 50 GB and growing;
- user state is much larger than the active user set;
- Redis stores sessions, profiles, feeds, feature state, counters, or AI app state;
- memory capacity is the main cost driver;
- you need predictable tail latency as the dataset grows beyond RAM;
- you want to keep Redis/Valkey-compatible clients and tools;
- you are adding shards or replicas mainly for capacity rather than throughput.

It is especially relevant for products with a clear user-activity curve: active now, recently active, inactive.

## When Redis Is Still Fine

Use Redis when the workload is a small pure cache, when the full dataset comfortably fits in memory, or when data loss is acceptable because Redis is only a derived cache.

Use EloqKV when Redis-compatible data starts looking like a database: large, durable, stateful, and expensive to scale in DRAM.

## Practical Evaluation Checklist

Before changing architecture, answer these questions:

| Question                                                                      | What it tells you                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------- |
| How many users are active in the last 5 minutes, 1 hour, and 24 hours?        | The size of the hot working set                   |
| How large is the full Redis dataset?                                          | The memory cost baseline                          |
| Which Redis data structures dominate memory?                                  | Whether the workload is state-heavy               |
| Do you use RDB, AOF, or another persistence path?                             | Whether Redis is carrying durability expectations |
| What happens to P99 and P99.99 latency during peak writes or background work? | Whether tail latency is already visible           |
| Are you adding Redis shards for capacity, throughput, or both?                | Whether tiered storage could simplify scaling     |

If your hot set is small but your full dataset is large, memory-only scaling is probably the wrong cost model.

## FAQ

### What is EloqKV?

EloqKV is a Redis- and Valkey-compatible database for large stateful workloads. It serves datasets beyond DRAM using memory, local NVMe SSD, and object storage while preserving Redis-compatible access patterns.

### What is hot/warm/cold storage for Redis-compatible data?

Hot/warm/cold storage places active data in memory, semi-active data on local SSD, and durable cold data in object storage. For Redis-compatible workloads, this lets applications keep Redis-style APIs while avoiding a DRAM-only capacity model.

### How does EloqKV reduce Redis infrastructure cost?

EloqKV reduces DRAM pressure by keeping active data in memory and placing larger warm/cold datasets on NVMe and object storage. This changes the cost model for workloads where total data is much larger than the active working set.

### Is EloqKV a drop-in Redis replacement?

EloqKV is Redis and Valkey compatible, but teams should validate command coverage, latency, cluster behavior, durability settings, and operational expectations before migration.

### Is this useful for AI applications?

Yes. AI applications often have active conversations, recent context, agent checkpoints, and long-term memory. That data naturally fits hot/warm/cold tiering: active state in memory, recent state on NVMe, durable memory and checkpoints in object storage.

### Does object storage sit on the hot request path?

No. In this model, object storage is for durable cold data, merge, and checkpoint flows. Hot requests should hit memory, and warm requests should be served from local NVMe where possible.

## The Bottom Line

Redis-compatible workloads are changing. They are no longer just small caches. They increasingly hold user state, feature state, session state, feed state, and AI application memory.

When all of that data is treated as equally hot, DRAM becomes the bottleneck and the bill.

EloqKV gives those workloads a different path: memory for active state, local NVMe for warm state, object storage for durable cold state, and Redis/Valkey compatibility for the application.

That is how you scale Redis-compatible data without scaling DRAM.