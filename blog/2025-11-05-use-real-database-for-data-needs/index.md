---
title: "Don't Split My Data: I Will Use a Database (Not PostgreSQL) for My Data Needs"
authors: eloq
date: 2025-11-05
image: /img/blog/awsoutage.jpg
tags: [Company]
description: "Discussing the converged database substrate and why postgresql is not sufficient"
blog: true
featured: true
featuredMain: true
---

The internet (or at least the IT community) had a field day when a couple of blog posts claimed you could replace Redis and Kafka with PostgreSQL. ["Redis is fast, I'll cache in Postgres"](https://dizzy.zone/2025/09/24/Redis-is-fast-Ill-cache-in-Postgres/) and ["Kafka is fast -- I'll use Postgres"](https://topicpartition.io/blog/postgres-pubsub-queue-benchmarks) have gotten much attention on HackerNews [here](https://news.ycombinator.com/item?id=45380699) and [here](https://news.ycombinator.com/item?id=45747018), and on Reddit [here](https://www.reddit.com/r/programming/comments/1nph2jh/redis_is_fast_ill_cache_in_postgres/) and [here](https://www.reddit.com/r/programming/comments/1oj7q6q/kafka_is_fast_ill_use_postgres/). Obviously, some of the claims in the posts got roasted on HN and Reddit for suggesting you could replace Redis or Kafka with PostgreSQL. Many people (correctly) pointed out that the benchmarks were far from properly set up, and the workloads were non-typical. Some of the Kafka people also posted [long articles](https://www.morling.dev/blog/you-dont-need-kafka-just-use-postgres-considered-harmful/) to clarify what Kafka is designed for and why it is not hard to use. But, on the flip side, many of the posts also (correctly) preached a valid point: keeping fewer moving parts matters, and using the right tool for the job matters even more.

Those "Postgres can replace Redis/Kafka" posts benchmarked tiny workloads where serious tools simply aren't needed and then stretched that into a sweeping "you don't need Redis or Kafka" narrative. It's like writing an article on how much cargo a U-Haul can carry, and concluding that you'll just use your convertible for grocery runs. Nobody would post that on a trucking forum expecting a heated debate. So why does the same flavored reasoning blow up every time someone writes it about databases?

Sure, part of the drama is emotional. Developers get attached to their tools. Kafka, Redis, and Postgres all have cult-like followings, and any praise or criticism feels personal. But there's more to it than fandom. These debates touch on real technical trade-offs: complexity, durability, scaling, and the cost of managing multiple systems. In this article, we'll look at why it actually makes sense to use a *real* database for workloads that used to require specialized systems, and then tackle the elephant in the room: why this shift hasn't happened before and what's finally making it possible.

## The Advantage of Combining Workloads on a Real Database

Back in the pre-internet days, "database" basically meant Oracle or Sybase: big relational systems that stored all of a company's data and powered every enterprise app. Then came the internet era, and data exploded in both volume and variety. The once-unified database stack shattered into a zoo of specialized systems: PostgreSQL and MySQL for transactional truth, Kafka for streams, Redis for caching, and Spark, Snowflake, or ClickHouse for analytics. Each tool solved a particular problem, but together, they created a monster of complexity. IT teams now spend countless hours wiring, tuning, and babysitting these silos just to keep data moving.

Lately, there's been a growing movement to consolidate around a single database (often PostgreSQL) as the backbone of data infrastructure. The obvious motivation is simplicity and cost: running one system is easier (and cheaper) than orchestrating a zoo of databases stitched together with duct tape and ETL jobs. But beyond operational convenience, there are deeper reasons this trend deserves attention. A unified data architecture unlocks advantages that go far beyond saving money and any systems architect can't afford to ignore.

### 1. Avoid Cascading Failures

Every engineer who's operated a large-scale system knows this pain: one small failure snowballs into a full-blown outage. When you glue together multiple systems, say Kafka feeding MySQL with Redis caching on top, each layer becomes a potential failure point. A hiccup in Kafka can stall writes, which can then cause cache invalidations to fail, which can then cause a thundering herd of retries. In a converged architecture, where all data flows through a single database, node failures degrade capacity proportionally rather than triggering a domino effect. The system scales down gracefully instead of collapsing catastrophically.

> **Example: Twitter's Cache Incident (via [Dan Luu](https://danluu.com/cache-incidents/))**
> In 2013, Twitter experienced an outage where a minor latency issue in the caching layer caused by interrupt-affinity misconfiguration led to a GC spiral on the tweet service. As cache latency grew, more requests bypassed the cache, overwhelming downstream services and eventually collapsing success rates to near 0% in one datacenter.
>
> The database itself wasn't the root cause, but the incident shows how fragile multi-tiered data stacks can be: when layers depend on each other for throughput, even small delays can cascade into total failure.

This is exactly the kind of chain reaction that converged database architectures can avoid????????by keeping durability, caching, and data access under one coordinated system instead of scattered layers of dependency.

### 2. Avoid Development Complexity

Maintaining two code paths for the same data is a tax on every engineering team. A typical "read-through" cache setup means developers have to write one logic path for MySQL (cache miss) and another for Redis (cache hit). Over time, these two paths drift apart: schema changes, data formats, and business rules slowly go out of sync. Debugging that kind of inconsistency is pure misery. A single database eliminates that duality. Your application talks to one API, with one transaction model, and one source of truth. Simpler code, fewer bugs, faster iteration.

Here is an example code for reading user information. If Redis cache is involved, the code looks like this:

```python
def get_user(user_id):
    # Try cache first
    try:
        user = redis.get(f"user:{user_id}")
        if user:
            return json.loads(user)
    except RedisTimeout:
        logger.warning("Redis timeout, falling back to DB")
    except RedisConnectionError:
        logger.error("Redis down, falling back to DB")
    
    # Cache miss or Redis failed, try database
    try:
        with postgres.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            # Try to update cache (but don't fail if Redis is down)
            try:
                redis.set(f"user:{user_id}", json.dumps(user), ex=3600)
            except:
                pass  # "It's fine, we'll cache it next time"
                
            return user
    except PostgresConnectionError:
        # Both Redis and Postgres down? Try the read replica
        with postgres_replica.cursor() as cur:
            # ... more error handling ...
```

**47 lines of code to read one user.** And this doesn't even handle cache invalidation, which was another 200 lines of scattered `redis.delete()` calls that everyone was afraid to touch.

With everything in one database, the code becomes trivial:

```python
def get_user(user_id):
    with db.cursor() as cur:
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        return cur.fetchone()

def update_user(user_id, data):
    with db.cursor() as cur:
        cur.execute("UPDATE users SET ... WHERE id = %s", (..., user_id))
```

### 3. Avoid Consistency Confusion

Distributed systems are already hard to reason about. Add multiple data tiers like Redis, Kafka, and a transactional database and you multiply the number of failure and consistency scenarios. Each component has its own guarantees: Kafka offers *at-least-once* delivery (so duplicates happen unless you build idempotency), Redis is *eventually consistent* (so stale reads are normal), and your SQL database is *transactionally consistent*, but only for its own data. Stitch them together, and you're left trying to reason about correctness in a house of cards.

> **Example: Stale Writes and Inconsistent Cache at Scale (via [Dan Luu](https://danluu.com/cache-incidents/))**
> Dan Luu's review of real-world cache incidents includes multiple cases where caches went out of sync with the source of truth. In one Twitter incident, stale data persisted in the cache after the underlying value had changed, leading to users seeing outdated timelines. In another, duplicate cache entries caused some users to appear in multiple shards simultaneously: an impossible state from the database's perspective. The fixes required strict cache invalidation ordering and retry logic to prevent stale data from overwriting newer updates.
>
> None of these were database bugs; they were *integration bugs*, symptoms of managing consistency across disconnected systems.

A single, converged database architecture eliminates this entire class of problems. There's no cache to drift out of sync, no queue to replay twice, no data race between "source of truth" and "derived truth." Everything from reads to writes to streaming happens within one transaction boundary and one consistency model. You don't just simplify the system; you make correctness *provable* instead of probabilistic.

## What About Scalability and Performance?

If converging everything into a single database simplifies architecture so dramatically, the obvious question is: why hasn't everyone already done it? The short answer: performance and scalability. Specialized systems like Redis and Kafka were born because traditional databases couldn't keep up. Caches were faster, queues were more scalable, and analytics engines could crunch far more data than your average OLTP database. The trade-off was fragmentation and complexity, but at least things stayed fast. For decades, this was a necessary compromise.

Only recently have database architectures evolved enough to make convergence a realistic alternative. In this section, we discuss the necessary capabilities of a database that must be satisfied to enable such convergence.

### 1. Scalable Transactions

For years, *transactions* were the deal-breaker for scaling databases. Everyone wanted the simplicity of ACID semantics, but once workloads outgrew a single machine, something had to give. The conventional wisdom was: you can have transactions or scale, but not both. That's how we ended up with a zoo of specialized systems. NoSQL databases like MongoDB and Cassandra threw away multi-record atomicity in exchange for horizontal scale. Developers got used to compensating in application code: implementing retries, deduplication, or manual rollback logic. It worked, but it was painful and brittle. For relational systems, manual sharding became the necessary evil: once you hit the single-node ceiling, you split your data and your sanity along with it.

As workloads grew, people learned that sharding relational databases by hand was a nightmare. Every cross-shard join, every transaction that touched more than one key, became a distributed systems problem. You could scale reads, but writes were a different story. And once data started to overlap across shards, consistency slipped through your fingers.

That's why the new generation of distributed transactional databases, often grouped under the "NewSQL" label, was such a breakthrough. Systems like **Google Spanner**, **TiDB**, and **CockroachDB** showed that you could have global scale and serializable transactions, thanks to better consensus protocols, hybrid logical clocks, and deterministic commit algorithms. Even previously non-ACID systems have evolved: MongoDB added multi-document transactions in 4.0, and Aerospike introduced distributed ACID transactions feature in 8.0.0. The takeaway is that distributed transactions are already standard features in many systems.

This changes the calculus completely. When your database can handle distributed transactions efficiently, you no longer need to glue together different engines just to scale. You get scalability and correctness in one system that can become a foundation for building truly unified data architectures.

### 2. Independent Resource Scaling

Different workloads stress different parts of a system. Streaming ingestion (like Kafka) is I/O-bound and needs massive sequential write throughput. Caching workloads (like Redis) are memory-bound, thriving on low-latency access to hot data. Analytical queries and vector search, on the other hand, are CPU-bound, demanding large compute bursts. Traditional *shared-nothing* databases where compute, storage, and memory scale together force you to over-provision one resource just to satisfy another. You end up paying for RAM you don't use or SSDs that sit mostly idle.

That's why people historically broke their pipelines into multiple specialized systems. You could put Kafka on write-optimized disks, Redis on high-RAM nodes, and MySQL on balanced hardware. It worked, but it came at the cost of fragmentation and data movement. Each system had to be connected, synchronized, and constantly re-tuned.

Now, cloud infrastructure is changing that equation. Modern cloud platforms allow **elastic and independent scaling** of compute, storage, and memory. Databases are starting to embrace this model directly. The **separation of compute and storage**, first popularized by cloud data warehouses like Snowflake and BigQuery, is now making its way into OLTP systems as well. This decoupling lets a single database scale ingest, query, and cache layers independently.

A truly unified database architecture must exploit this flexibility: scale write nodes when ingestion spikes, scale compute when CPU demands surge, and expand storage as data volumn grows.

### 3. Performance and the Zero-Overhead Principle

C++ developers have a mantra: the **zero-overhead principle**
1. *You don't pay for what you don't use.*
2. *What you do use is just as efficient as what you could reasonably write by hand.*

That's exactly the mindset a unified database must adopt. Existing databases rarely meet this bar. Even if you just want to run an in-memory cache, most engines still insist on running full durability machinery: write-ahead logging, background checkpoints, transaction journals, and page eviction logic. The result? You're paying CPU and latency overhead for guarantees you may not need on a given workload. 

This is why Redis can outperform MySQL on pure in-memory reads even when both are running on the same hardware and the dataset is identical. The overhead isn't only in the query parser; it's in the architectural layers designed for persistence, recovery, and buffer management that never get out of the way.

A truly unified database must treat these mechanisms as *pluggable*, not mandatory. Durable writes, replication, and recovery logging should be modular: enabled only when needed, bypassed when not. The same engine should be able to act as a blazing-fast cache, a strongly consistent OLTP store, or a long-term analytical system, without paying unnecessary tax in the fast path.

In other words, **unification can not come at the cost of overhead**. It has to come from rethinking the core execution and storage engine so that the same system can be both flexible *and* ruthlessly efficient, depending on how it's used.

## PostgreSQL May Not Be the Answer

If "just use Postgres for everything" sounds too easy, that's because it is. PostgreSQL deserves its reputation: it's battle-tested, reliable, and absurdly extensible. But it was never designed to be the all-in-one database the modern world needs. Its architecture still reflects the assumptions of the 1990s: local disks, tightly coupled storage and compute, and a single-threaded execution model wrapped in process-based concurrency. Extensions like logical replication, foreign data wrappers, and background workers are impressive engineering feats, but they're patches on a monolith, not blueprints for a unified data platform.

When people benchmark Postgres against Redis or Kafka, they're really comparing apples to power tools. Postgres can simulate a cache or a queue, but it isn't optimized for them. WAL writes still happen, visibility maps still update, vacuum still runs. The performance gaps show up not because Postgres is "slow," but because it's doing far more work than those specialized systems ever attempt. Its design trades raw throughput for correctness and compatibility, a perfectly valid choice, just not one that scales linearly to every use case.

The deeper issue is architectural: Postgres doesn't separate compute and storage, can't independently scale read and write nodes, and doesn't natively exploit object storage or distributed consensus for global transactions. You can retrofit it with external layers: Citus for sharding, Neon for decoupled storage, Logical Decode for streaming, but that just recreates the complexity we were trying to eliminate.

Another school of thought argues that as hardware keeps improving, scalability itself becomes less relevant. If a single server can pack terabytes of RAM and hundreds of cores, why bother with distributed systems at all? Why not just keep everything in one big Postgres instance and call it a day? We fundamentally disagree with this line of thinking. Hardware growth helps, but data growth is exponential. User expectations for availability, latency, and global presence grow even faster. Scaling vertically might postpone the problem, it doesn't solve it. This is especially true in the AI age, when data is the lifeline of all applications. We'll dedicate another article to discuss this in detail.

PostgreSQL has earned its place as the default database of our time, but it's not the *endgame*. There is opportunity in databases that internalize the lessons of distributed systems, cloud elasticity, and modular design.

## The Road Ahead: Toward a True Data Substrate

The industry's obsession with patching and stitching different data systems together is a legacy of the past twenty years of hardware and software limits. But those limits are fading. The next generation of data infrastructure won't be defined by whether it speaks SQL or supports transactions. It will be defined by whether it can unify the data lifecycle without compromise: streaming, caching, analytics, and transactions under a single, coherent architecture.

That's exactly what we're building with **EloqData's Data Substrate**. Instead of bolting more features onto yesterday's database engines, we started from a clean slate: modular storage and compute layers, fully ACID-compliant distributed transactions, object storage as a first-class persistence medium, and elastic scaling across workloads. The same engine that serves as a durable operational database can act as a high-throughput cache, a streaming log, or an analytical backend without duplicating data or wiring together half a dozen systems. 

This is the promise of a **converged data platform**: simplicity without trade-offs, scalability without fragmentation, and performance without overhead. The future of data infrastructure belongs to systems that treat data as a continuous substrate rather than a pile of disconnected silos. That's where we're headed. Of course, we still have a very long way to go, but we are working hard on this goal. Join the discussion on our Discord Channel. We would happy to hear your thoughts on the future of databases. 