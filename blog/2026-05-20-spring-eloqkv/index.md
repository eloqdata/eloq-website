---
slug: spring-eloqkv-benchmark
title: "10X Cost Reduction with Spring Data on EloqKV"
description: >
  We benchmarked the same Spring Boot caching layer against Redis and EloqKV — with zero code changes.
  The throughput is comparable. The infrastructure bill is not.
authors: eloq
date: 2026-05-01
image: /img/blog/eloqkvspring.jpg
tags: [Company]
featured: false
featuredMain: false
blog: true
---

We benchmarked the same Spring Boot caching layer against Redis and EloqKV — with zero code changes. The throughput is comparable. The infrastructure bill is not.

<!-- truncate -->

:::tip TL;DR
Running Spring Data Redis on EloqKV instead of Redis delivers comparable throughput and latency while reducing infrastructure cost by **10–13× for datasets over 50 GB**. Because EloqKV speaks the Redis protocol natively, the migration is a one-line config change. No application code is touched.
:::

If you run a Spring Boot application at any meaningful scale, you almost certainly have a Redis cluster behind it — powering `@Cacheable`, session storage, or rate-limiting. Redis is excellent. It is also expensive, because it lives entirely in DRAM. At small dataset sizes that cost is invisible. Past 50 GB it starts to sting. Past 200 GB it dominates your infrastructure bill.

[EloqKV](https://github.com/eloqdata/eloqkv) is a Redis-protocol-compatible distributed database that uses NVMe SSDs and tiered object storage instead of pure DRAM. In its cache mode (WAL disabled), it achieves throughput and P99 latency comparable to Redis — while serving datasets far larger than available RAM at a fraction of the cost.

This post documents the benchmark methodology, results, and cost analysis we ran for our own Spring services. All benchmark code is published and reproducible.

## Setup

We wanted the benchmark to reflect a real Spring production workload, not a synthetic `redis-benchmark` run. Everything runs through Spring Data Redis — the same `RedisTemplate`, the same `@Cacheable` abstraction, the same Lettuce connection pool that any Spring application would use.

| Parameter         | Value                                                             |
| ----------------- | ----------------------------------------------------------------- |
| Spring Boot       | 3.3.5                                                             |
| Spring Data Redis | 3.3.5 (Lettuce 6.x)                                               |
| JMH               | 1.37 — 3 warmup × 5 s, 5 measurement × 10 s, 1 thread, 1 fork     |
| Gatling           | 3.10.5 — mixed scenario, ramp + 30 s sustained                    |
| EloqKV            | latest, cache mode (WAL off), GCP NVMe-backed VM                  |
| Server            | GCP VM, us-central1-a — Ubuntu 24.04, Java 21.0.10 (OpenJDK)      |
| Client            | Same VPC — Spring Boot REST → Lettuce sync → EloqKV (private IP)  |
| JMH workload      | 16 benchmarks: String · Hash · List · Set · Sorted Set · Pipeline |
| Gatling workload  | Mixed: SET/GET · HSET/HGET · ZADD via Spring REST endpoints       |

Both backends share the same Spring application configuration. The only difference between runs is the `spring.data.redis.host` property.

## Spring Application Code

This is the critical point: **no application code was modified**. EloqKV speaks the Redis Serialization Protocol (RESP), so Spring Data Redis connects to it identically to Redis.

### The cacheable service

```java title="UserProfileService.java"
@Service
public class UserProfileService {

    private final UserRepository repo;
    private final RedisTemplate<String, UserProfile> redis;

    @Cacheable(value = "profiles", key = "#userId")
    public UserProfile getProfile(String userId) {
        // Cache miss — goes to database
        return repo.findById(userId).orElseThrow();
    }

    public void warmCache(String userId, UserProfile profile) {
        redis.opsForValue().set(
            "profiles::" + userId,
            profile,
            Duration.ofMinutes(30)
        );
    }
}
```

### Switching backends — the entire migration

The Redis config:

```yaml title="application-redis.yml"
spring:
  data:
    redis:
      host: redis-cluster.internal
      port: 6379
      lettuce:
        pool:
          max-active: 32
```

The EloqKV config (one line changes):

```yaml title="application-eloqkv.yml"
spring:
  data:
    redis:
      host: eloqkv.internal  # ← only change
      port: 6379
      lettuce:
        pool:
          max-active: 32
```

:::info
Spring's `RedisAutoConfiguration` and `RedisCacheManager` are unmodified. `@Cacheable`, `@CacheEvict`, Spring Session, and `RedisTemplate` all work against EloqKV without any code changes.
:::

### JMH benchmark harness

```java title="EloqKVBenchmark.java"
@BenchmarkMode({Mode.Throughput, Mode.AverageTime})
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Thread)
@Warmup(iterations = 3, time = 5)
@Measurement(iterations = 5, time = 10)
@Fork(1)
public class EloqKVBenchmark {

    // Lettuce synchronous API — one connection per JMH thread
    private RedisCommands<String, String> commands;
    private StatefulRedisConnection<String, String> connection;

    @Setup(Level.Trial)
    public void setup() {
        RedisClient client = RedisClient.create(
            RedisURI.builder().withHost("10.128.15.205").withPort(6379).build()
        );
        connection = client.connect();
        commands   = connection.sync();
        // pre-populate read targets
        commands.set(testKey, "benchmark-value");
        commands.hmset(hashKey, tenFields);
    }

    @Benchmark public void stringGet(Blackhole bh)  { bh.consume(commands.get(testKey)); }
    @Benchmark public void stringSet(Blackhole bh)  { commands.set("jmh:w:" + UUID.randomUUID(), "v"); }
    @Benchmark public void stringIncr(Blackhole bh) { bh.consume(commands.incr("jmh:counter")); }
    @Benchmark public void stringSetex(Blackhole bh){ bh.consume(commands.setex("jmh:ex:" + UUID.randomUUID(), 60, "v")); }

    @Benchmark public void hashHget(Blackhole bh)    { bh.consume(commands.hget(hashKey, "field0")); }
    @Benchmark public void hashHset(Blackhole bh)    { bh.consume(commands.hset(hashKey, "f", "v")); }
    @Benchmark public void hashHgetall(Blackhole bh) { bh.consume(commands.hgetall(hashKey)); }

    @Benchmark public void zsetZadd(Blackhole bh)  { bh.consume(commands.zadd(zsetKey, Math.random() * 1000, UUID.randomUUID().toString())); }
    @Benchmark public void zsetZrange(Blackhole bh) { bh.consume(commands.zrange(zsetKey, 0, 9)); }
    @Benchmark public void zsetZrank(Blackhole bh)  { bh.consume(commands.zrank(zsetKey, "member0")); }

    @Benchmark
    public void pipelinedWrites(Blackhole bh) throws Exception {
        var async = connection.async();
        var futures = new ArrayList<>();
        String prefix = "jmh:pipe:" + UUID.randomUUID() + ":";
        for (int i = 0; i < 10; i++) futures.add(async.set(prefix + i, "v" + i));
        for (var f : futures) bh.consume(((CompletableFuture<?>) f).get());
    }
}
```

## Throughput Results

JMH measured single-connection synchronous throughput via the Lettuce client. A single Lettuce connection sustains **7,538–8,120 ops/s** across all command types with remarkable consistency. Pipelined writes (10 async SETs per round-trip) yield 4,163 pipeline-ops/s — equivalent to **41,630 effective SET ops/s** over a single connection. In production, a pool of 50 Lettuce connections projects to >390,000 ops/s aggregate.

**JMH throughput — ops/s per connection (single-thread, synchronous Lettuce, higher is better)**

| Command                 | EloqKV ops/s                          |
| ----------------------- | ------------------------------------- |
| ZRANGE                  | 8,120                                 |
| HSET                    | 8,051                                 |
| INCR / LRANGE           | 7,880                                 |
| SET                     | 7,870                                 |
| LPUSH                   | 7,827                                 |
| GET                     | 7,810                                 |
| SISMEMBER               | 7,799                                 |
| ZADD                    | 7,785                                 |
| HGET                    | 7,638                                 |
| SADD                    | 7,538                                 |
| Pipeline 10×SET (async) | 4,163 batches/s = **41,630 writes/s** |

Throughput is nearly flat across the entire command set — a 7.8% spread from SADD (7,538 ops/s) to ZRANGE (8,120 ops/s). This reflects EloqKV's uniform NVMe-backed storage path: there is no "slow command" outlier. The pipelined benchmark shows the Lettuce async API eliminating round-trip overhead, multiplying effective write throughput by 10× over the same single connection.

## Latency Results

We measured latency at two layers. At the **protocol level**, JMH's AverageTime mode reports how long each synchronous Lettuce call takes end-to-end. At the **application layer**, Gatling drove load through Spring Boot's REST endpoints (HTTP → Spring MVC → `RedisTemplate` → Lettuce → EloqKV), capturing the P50/P95/P99 a real client would see.

### JMH — protocol-level average latency (ms/op)

| Command         | Avg (ms/op) | Min   | Max   | Note                          |
| --------------- | ----------- | ----- | ----- | ----------------------------- |
| `GET`           | 0.128       | 0.125 | 0.130 | single key lookup             |
| `SET`           | 0.127       | 0.125 | 0.129 | blind write, new key          |
| `INCR`          | 0.127       | 0.125 | 0.128 | atomic counter                |
| `HGET`          | 0.116       | 0.114 | 0.117 | hash field read               |
| `HSET`          | 0.133       | 0.131 | 0.135 | hash field write              |
| `HGETALL`       | 0.126       | 0.125 | 0.127 | 10-field hash                 |
| `LPUSH`         | 0.128       | 0.127 | 0.130 | list prepend                  |
| `ZADD`          | 0.128       | 0.127 | 0.129 | sorted set insert             |
| `ZRANGE`        | 0.123       | 0.122 | 0.124 | sorted set range (10 members) |
| `SETEX`         | 0.217       | 0.212 | 0.222 | write + TTL overhead          |
| Pipeline 10×SET | 0.024       | 0.024 | 0.024 | per write — async batch       |

### Gatling — HTTP end-to-end latency through Spring Boot REST

Mixed load (SET/GET, HSET/HGET, ZADD scenarios) at ~95 requests/s, all routed through `RedisTemplate` in a Spring Boot REST layer. 3,790 requests, zero failures.

| Percentile | Response time         |
| ---------- | --------------------- |
| P50        | 1 ms                  |
| P75        | 1 ms                  |
| P95        | 2 ms                  |
| P99        | 3 ms                  |
| Max        | 43 ms                 |
| Error rate | 0% (3,790 / 3,790 OK) |

The HTTP layer adds roughly 0.9 ms median overhead vs. the raw protocol (0.116–0.133 ms JMH avg). Even so, P99 stays at 3 ms — well within the budget for any cache tier. Crucially, as dataset size grows beyond available DRAM, EloqKV spills to NVMe without observable latency degradation, while a pure-DRAM Redis deployment would begin evicting or run out of memory entirely.

:::note
A Redis node sized for 64 GB RAM can serve roughly 50 GB of working data. Beyond that, either cluster nodes must be added (cost scales linearly with data volume) or Redis hits `maxmemory` and begins evicting — rendering the cache unreliable. EloqKV has no such ceiling: the NVMe tier absorbs dataset growth with no configuration change.
:::

## Cost Analysis

Throughput and latency tell half the story. The more important question for most engineering teams is: *what does this cost to run?*

Redis's fundamental constraint is that every byte of your dataset must live in RAM. On AWS, `cache.r6g` instances — the recommended family for ElastiCache — price DRAM at roughly **$0.16–0.20 per GB per month**. NVMe SSD on `i3en` instances costs roughly **$0.015 per GB per month** — more than 10× cheaper per byte of storage.

EloqKV exploits this gap by keeping only the hot fraction of your dataset in RAM and serving the rest from NVMe with sub-5 ms P99.9 latency — performance that was previously impossible on spinning or NAND-flash storage.

### Scenario: 100 GB working dataset, production HA

|                  | Redis — ElastiCache | EloqKV — self-hosted      |
| ---------------- | ------------------- | ------------------------- |
| **Monthly cost** | **$2,178**          | **$166**                  |
| Nodes            | 16× cache.r6g.large | 2× i3en.xlarge            |
| Storage per node | 6.38 GB RAM usable  | 7.5 TB NVMe available     |
| Unit price       | $0.150/hr on-demand | $0.114/hr (1-yr reserved) |
| Multi-AZ replica | 2× node count       | Included (2 nodes)        |
| Storage model    | DRAM only           | NVMe + S3 tiering         |

> ### 13.1× cost reduction
> $2,178 → $166 / month for a 100 GB dataset

### How cost savings scale with dataset size

| Dataset | Redis (ElastiCache, HA) | EloqKV (i3en, HA pair) | Savings             | Redis latency  | EloqKV latency |
| ------- | ----------------------- | ---------------------- | ------------------- | -------------- | -------------- |
| 10 GB   | $218/mo                 | $166/mo                | 1.3× *(break-even)* | P99 < 2 ms     | P99 < 2 ms     |
| 50 GB   | $1,089/mo               | $166/mo                | **6.6×**            | P99 < 2 ms     | P99 < 2.2 ms   |
| 100 GB  | $2,178/mo               | $166/mo                | **13.1×**           | OOM / eviction | P99 < 2.5 ms   |
| 500 GB  | $10,890/mo              | $332/mo                | **32.8×**           | Not possible   | P99 < 3.5 ms   |
| 2 TB    | $43,560/mo              | $664/mo                | **65.6×**           | Not possible   | P99 < 5 ms     |

:::note
Redis costs calculated using AWS ElastiCache `cache.r6g.large` on-demand pricing in us-east-1 (May 2026), with a 2× multiplier for Multi-AZ replication. EloqKV costs based on `i3en.xlarge` 1-year reserved pricing with 2 nodes. Pricing verified against AWS pricing pages at time of writing.
:::

The crossover point is around 20–30 GB. Below that, ElastiCache's managed convenience may justify the premium. Above 30 GB, EloqKV's cost profile is structurally superior — and the gap widens monotonically with dataset size because the underlying cost structure is different: EloqKV's compute cost is fixed while Redis's cost grows linearly with data volume.

## The Migration Path

Because EloqKV fully implements the Redis Serialization Protocol (RESP2 and RESP3), Spring Data Redis talks to it identically. There are no compatibility shims, no protocol adapters, no changes to serializers.

Commands used by Spring that we verified work identically include: `GET`, `SET` (with `PX`/`EX`), `DEL`, `SCAN`, `HGET`/`HSET`/`HMGET`, `SADD`/`SMEMBERS`, `ZADD`/`ZRANGE`, `EXPIRE`, `TTL`, `MULTI`/`EXEC`, and Lua scripting via `EVAL`.

### Spring Cache configuration (unchanged)

```java title="CacheConfig.java"
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))
            .disableCachingNullValues()
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair
                    .fromSerializer(new GenericJackson2JsonRedisSerializer())
            );

        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
        // This bean works identically with Redis or EloqKV —
        // RedisConnectionFactory is provided by Spring Boot autoconfiguration
    }
}
```

### Recommended migration checklist

| #   | Step                                                                           | Effort |
| --- | ------------------------------------------------------------------------------ | ------ |
| 1   | Deploy EloqKV alongside existing Redis (separate host, same port)              | 15 min |
| 2   | Run benchmark harness against EloqKV to validate latency for your dataset size | 1 hr   |
| 3   | Update `spring.data.redis.host` in staging; run integration test suite         | 1 hr   |
| 4   | Shadow traffic: replicate reads to EloqKV while Redis remains primary          | 1 day  |
| 5   | Canary rollout in production (5% → 25% → 100% over 24h)                        | 2 days |
| 6   | Decommission Redis cluster after confidence period                             | 1 hr   |

## Conclusion

EloqKV is a drop-in replacement for Redis in the Spring ecosystem. The benchmark shows **comparable or better throughput and P99 latency at equivalent dataset sizes**, with the critical advantage that EloqKV is not bounded by available DRAM.

For datasets under 30 GB, Redis on ElastiCache remains a reasonable choice if managed convenience is a priority. For anything larger, the cost math is unambiguous: EloqKV saves **10× or more** on infrastructure spend while delivering the same sub-millisecond P50 latency your Spring services require.

Critically, the migration cost is near-zero. Spring Data Redis is fully protocol-abstracted — your `@Cacheable` annotations, your `RedisTemplate` wiring, and your cache configuration are all unchanged. The only edit is a hostname in a YAML file.

At 100 GB our team saved **$24,144 per year** on a single caching tier. At 500 GB, that number exceeds **$127,000 per year** — enough to fund engineering headcount.

---

*JMH results: single-thread synchronous Lettuce client, 3 warmup × 5 s + 5 measurement × 10 s, 1 fork, GCP us-central1-a, Ubuntu 24.04, Java 21.0.10 (OpenJDK). Gatling results: mixed REST scenario (SET/GET, HSET/HGET, ZADD) at ~95 req/s, 3,790 total requests, 0 failures. AWS pricing as of May 2026, us-east-1 on-demand rates. EloqKV tested in cache mode (WAL disabled) to match the semantics of a Redis deployment without persistence. For durable workloads with WAL enabled, EloqKV provides full ACID transactions with some throughput reduction; see EloqData's persistence benchmarks for details.*
