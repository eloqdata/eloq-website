---
title: "Scaling EloqKV to Power 800 Billion ChatGPT Agents: Beyond the Limits of PostgreSQL"
authors: eloq
date: 2026-01-26
tags: [Company]
image: /img/blog/800billlionagents.jpg
description: "OpenAI just showed how to push PostgreSQL to its limit for 800 million users. But what happens when 800 billion AI agents take over?"
blog: true
featured: true
featuredMain: false
---

# Background

First, a huge thank you to **Bohan Zhang** and the OpenAI engineering team for sharing their [data infrastructure journey](https://openai.com/index/scaling-postgresql/). It is a fantastic read, packed with hands-on best practices—from connection pooling with PgBouncer to ruthless query optimization—that any engineer scaling a relational monolith should study.

However, the definition of "scale" is shifting under our feet.

<!-- truncate -->

On January 22nd at the **Unlocked Conf** (shout out to **Khawaja** and **Daniela** at **Momento** and always smile **Madelyn** for hosting such an incredible event!), the industry saw what "real" scale looks like today. Experts from **Uber** (Yang Yang and Shawn Wang), **AWS** (Kevin and Sarthak), and **Apple** (Yiwen Zhang) shared mind-boggling numbers. Most notably, **Uber is now handling 1 billion RPS** using their cache layer. In that context, "millions of QPS" is just the starting line.

<div align="center">
<div style={{ width: '100%', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<!--
<EnlargeableImage src={require('./img/ces26_p9999.jpg').default} alt="EloqKV P9999 Latency Comparison" />
-->

<EnlargeableImage src={require('./img/800billlionagents.jpg').default} alt="EloqKV P9999 Latency Comparison" />
</div></div>

### From 800 Million Users to 800 Billion Agents

OpenAI’s current architecture of 50 read replicas is a masterpiece of efficiency for 800 million humans. But we are rapidly approaching the **Agentic Era**. We aren't just building for humans who type a few prompts a day; we are building for **800 billion autonomous agents** that never sleep, never stop querying, and never stop generating data.

When we talk about a **Trillion QPS** in a major AI company, we have to ask: **Can PostgreSQL read replicas actually survive?**

Even with cascading WAL shipping, the infrastructure cost of 50,000+ replicas is a budgetary black hole. More importantly, the **replication lag** and the **CPU overhead** of a traditional RDBMS engine make it the wrong tool for the "Trillion QPS" future.

### The "Cache Miss" Vulnerability

OpenAI’s post highlights a critical defense: a **cache locking and leasing mechanism** to prevent "thundering herds" from crashing PostgreSQL during a cache-miss storm. It’s a brilliant safety net, but it proves that the database is a liability in a high-velocity environment.

**Our question is simple: Why not just cache all the data?**

### Enter EloqKV: The "Full Cache" Reality

OpenAI mentions that their cache only holds "hot data" because keeping everything in memory is too expensive. In the traditional Redis world, they are right. Keeping 800 million users' (or 800 billion agents) session data in RAM is a waste of capital.

EloqKV changes the math. By building on EloqStore, we’ve created a Redis-compatible KV which holds **all your data on NVMe SSDs**, creating a "Full Cache" architecture where **cache misses simply don't exist.**

* **No More Cache Miss:** By making the "cache" with full data as high-performance layer for agent state, you eliminate the risk of a "burst of misses" crashing a back-end database.
* **NVMe Performance at Scale:** On a 16vCore GCP instance, EloqKV delivers **sub-millisecond P99 latency** and **under 2 millisecond P9999 latency** at 100K QPS. Need more? A single 44vCore machine can push **near 1 million QPS**.
* **10x Cost Savings:** PostgreSQL is great for relations, but for the raw key-value lookups required by 800 billion agents, it’s 10x more expensive than an SSD-optimized KV store like EloqKV.

How does **EloqKV on EloqStore** achieve it? Read our Tech: [EloqKV on EloqStore Introdution](https://www.eloqdata.com/blog/2026/01/08/eloqkv-on-eloqstore#introducing-our-open-source-eloqstore-engine)


### But What About Joins?

The classic rebuttal to KV stores is the lack of relational joins. However, as OpenAI themselves noted, they are already moving away from 12-table joins and toward application-layer logic.

We believe in the DynamoDB Philosophy: Design your data schema based on your access patterns. If you need predictable, single-digit millisecond performance at any scale, you denormalize.

The problem has always been that DynamoDB is prohibitively expensive at high QPS. If you’ve ever looked at a bill for 1 million provisioned WCUs/RCUs, you know the pain. **EloqKV** brings that same philosophy to your own infrastructure, making a **Trillion QPS future** not just technically possible, but economically affordable.

### Looking Forward

We agree with OpenAI that PostgreSQL is an incredible tool. But for the next generation of agent-generated traffic—where QPS will reach billions—the "Primary + 50k Replicas + Hot Cache" model will be too slow and too expensive.

The future belongs to Full Cache architectures that treat SSDs like memory and eliminate the database bottleneck entirely.

---

**Ready to scale for the Agentic Era?**

* **Read the Tech:** [EloqKV on EloqStore](https://www.eloqdata.com/blog/2026/01/08/eloqkv-on-eloqstore)
* **Explore the Source Code:** [EloqStore Repo](https://github.com/eloqdata/eloqstore) & [EloqKV Repo](https://github.com/eloqdata/eloqkv)
* **Try it Now:** [Install EloqKV in One Minute](https://www.eloqdata.com/eloqkv/install-from-binary)
