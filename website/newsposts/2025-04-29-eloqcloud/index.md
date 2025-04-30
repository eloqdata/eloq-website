---
title: 'EloqCloud for EloqKV: 正式开放访问'
authors: eloq
date: 2025-04-29
tags: [Product]
news: true
image: /img/blog/eloqcloud_announce.png
description: 晨章数据首个云原生产品 EloqCloud for EloqKV - 一个兼容Redis API的云原生事务型键值数据库正式开放访问
newsFeatured: true
---

我们很高兴地宣布 **EloqCloud for EloqKV** 的**公共访问**现已开放，这是 EloqCloud 产品系列的第一个产品！

<!--truncate-->

**EloqCloud** 是 **EloqDB** 的 SaaS 平台，旨在为开发者提供**经济、可扩展且可预测**的云端体验 — 并由开发者选择使用自己熟悉的 API。

EloqCloud 是一个**产品矩阵**，支持多种数据模态和计算 API，包括 **SQL**、**Redis**、**MongoDB**、**Vector**、**Graph**，甚至还有一个全能型解决方案 [ConvergedDB](/blog/2025/03/19/agentic)。  
这些产品将陆续推出 — 今天，我们很兴奋地介绍 **EloqCloud for EloqKV**。

## 什么是 EloqCloud for EloqKV

简而言之，**EloqCloud for EloqKV** 是一个具有完整 **Redis API 兼容性**的**云原生事务型键值数据库**。

需要注意的是，它不仅仅是一个缓存 — 它是一个真正的数据库，专为**持久性**、**可用性**和**性能**而构建。每次写入都会在**确认之前进行复制**。它支持**跨可用区持久化**以应对**可用区故障**。

让我们来看看它的主要特性：

---

## 🔥 主要特性

**1. Scale to Zero**  
**EloqCloud for EloqKV**支持 scale to zero。当服务空闲一段时间之后，自动释放所有计算资源，以节约成本。做到没有使用就没有费用。

**2. 专属资源**  
选择适合您工作负载的规格。资源是**专属的**，确保**可预测的性能**，没有嘈杂”邻居“的影响。

**3. 经济高可用**  
为什么要为了实现高可用而支付[多副本](https://www.mongodb.com/docs/manual/replication)费用？  
使用 **EloqCloud for EloqKV**，**一个计算副本**就足够了。  
我们的[数据基层](/blog/2024/08/11/data-substrate)将计算、内存、日志和存储分离，实现：

- **秒级自动故障转移**
- **零数据丢失**
- **与传统高可用设置相比，成本最高可降低 70%**
- **支持热备份模式，进一步降低故障恢复时间**

节省大量成本 — 同时不牺牲可靠性。

**4. 混合存储架构**  
告别为[云端 EBS](https://aws.amazon.com/ebs/)支付过高费用或冒着实例[本地 NVMe](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html)数据丢失的风险。

- 最近的 WAL 存储在具有多个副本的 EBS 上，以实现快速恢复。
- 历史 WAL 和用户数据存储在**廉价、持久的对象存储**中，并在本地 nvme 上缓存以实现超快读取。

**5. 高性能**

- 单节点每秒处理**超过 100 万次操作**。
- **亚毫秒级读取延迟**，媲美或超越现有缓存服务。
- **个位数毫秒级**写入延迟 — **并具有持久性保证**。

**6. 完整 ACID 事务**  
与典型的 Redis 类服务不同，EloqCloud for EloqKV 支持真正的 **ACID 事务**，具有熟悉的**Begin/Commit/Rollback**语义 — 通过 Redis API 实现 SQL 风格的事务模式。

**7. 无缝扩展**  
选择最适合您工作负载的机器规格。  
自动扩展功能在我们的 Roadmap 中，将使动态扩展变得轻而易举。

---

## 开始使用

准备好体验云数据库的未来了吗？  
立即[申请 EloqCloud](https://cloud.eloqdata.com/join-waitlist) — 获得独家邀请，免费试用 EloqCloud。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/joinwaitlist.png').default} alt="为智能 AI 应用构建数据基础" />

</div></p>

📺 **观看下方的快速演示视频，了解 EloqCloud 的运行情况！**

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
  <video controls src="/video/eloqcloud.mp4" width="800" />

</div></p>

我们将在后续的博客中分享详细的基准测试结果，以及与其他 KV 存储系统的对比分析，敬请期待！
