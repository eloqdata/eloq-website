---
title: '从旅游类 Agentic AI 应用出发，探索 EloqKV 的解耦式架构'
authors: eloq
date: 2025-03-19
tags: [Company]
image: /img/tourbuddy.png
description: 探索EloqKV的解耦架构如何为TourBuddy提供支持，从快速缓存到持久、弹性存储的平滑扩展——在每个成长阶段保持AI应用的快速、弹性和成本效益。
featured: true
blog: true
featuredMain: true
---

在上一篇博客中，我们讨论了[Agentic AI 应用的数据库基础](/blog/2025/03/19/agentic)。在本篇博客中，我们将简化 Agentic AI 应用程序，并使用 EloqKV 作为数据存储来探索 EloqKV 的解耦架构。

<!--truncate-->

## 开始旅行

想象一下，你正在构建一个[Agentic AI 应用程序](https://nvidianews.nvidia.com/news/nvidia-alphabet-and-google-collaborate-on-the-future-of-agentic-and-physical-ai)——一个能在数字世界中自主漫游的聊天助手，帮助用户处理从旅行建议到生活咨询的各种事务。你的智能助手很聪明，很主动，由大型语言模型（[LLM](https://chat.openai.com/)）驱动，但有一个问题：它需要记住*所有事情*。每一个机智的回应，每一个用户请求，每一个"啊哈！"时刻——这些都需要被可靠地存储在某个地方。这就是 EloqKV 发挥作用的地方。今天我将向你展示，这套解耦架构是如何在我的 AI 助手从一个简单原型演变为高负载、可扩展系统的过程中，起到的关键作用。

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/tourbuddy.png').default} alt="为智能 AI 应用构建数据基础" />

</div></p>

### 从简单的内存缓存开始

当我第一次启动我的智能助手——让我们称它为"TourBuddy"时，它是一个轻量级的对话者，引导用户进行虚拟旅行。我需要一个快速存储聊天历史的方法，所以我选择了 EloqKV 作为简单的内存缓存。使用这个 Docker Compose 文件进行单节点设置非常简单：

```yaml
version: '3.8'
networks:
  eloqnet:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
services:
  eloqkv:
    image: eloqdata/eloqkv_full:latest
    container_name: eloqkv
    networks:
      eloqnet:
        ipv4_address: 172.20.0.4
    ports:
      - '6379:6379'
    command: /EloqKVRocksDB/bin/eloqkv --config /EloqKVRocksDB/conf/eloqkv.ini --ip=172.22.0.4 --port=6379 --ip_port_list=172.22.0.4:6379
    working_dir: /EloqKVRocksDB
    tty: true
    stdin_open: true
```

搞定！TourBuddy 的聊天历史被缓存在内存中，闪电般快速，随时可以调用。这就像给我的智能助手升级了短期记忆——非常适合它的早期阶段。

### 使用持久存储进行扩展

随着 TourBuddy 获得了粉丝（谁不喜欢一个健谈的旅行向导呢？），聊天历史急剧增长。将所有内容存储在内存中开始感觉像是在行李箱里塞太多纪念品——既昂贵又不实用，特别是因为旧消息很少被访问。幸运的是，EloqKV 有一个持久存储的绝招。只需对配置进行一个小调整，我就启用了 RocksDB 作为后端：

```yaml
version: '3.8'
networks:
  eloqnet:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
services:
  eloqkv:
    image: eloqdata/eloqkv_full:latest
    container_name: eloqkv
    networks:
      eloqnet:
        ipv4_address: 172.20.0.4
    ports:
      - '6379:6379'
    command: /EloqKVRocksDB/bin/eloqkv --config /EloqKVRocksDB/conf/eloqkv.ini --enable_data_store=true --ip=172.22.0.4 --port=6379 --ip_port_list=172.22.0.4:6379
    working_dir: /EloqKVRocksDB
    tty: true
    stdin_open: true
```

现在，历史聊天记录愉快地存储在磁盘上，为热数据释放内存的同时降低了成本。TourBuddy 仍然可以回忆起几个月前美好的东京行程，而且不会浪费珍贵的内存资源。

### 确保灾难发生时的数据持久性

一切都很顺利，直到有一天，TourBuddy 忘记了我最新的冒险——我的新旅游记录凭空消失了！经过一些紧张的调试，我意识到缓存在一次故障期间丢失了数据。持久性成为了我新的需求。幸运的是，EloqKV 有预写日志（WAL）功能，可以让数据丢失成为过去。再次快速调整：

```yaml
version: '3.8'
networks:
  eloqnet:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
services:
  eloqkv:
    image: eloqdata/eloqkv_full:latest
    container_name: eloqkv
    networks:
      eloqnet:
        ipv4_address: 172.20.0.4
    ports:
      - '6379:6379'
    command: /EloqKVRocksDB/bin/eloqkv --config /EloqKVRocksDB/conf/eloqkv.ini --enable_data_store=true --enable_wal=true --ip=172.22.0.4 --port=6379 --ip_port_list=172.22.0.4:6379
    working_dir: /EloqKVRocksDB
    tty: true
    stdin_open: true
```

启用 WAL 后，每条聊天消息在提交之前都会被安全记录。TourBuddy 再也不会忘记任何目的地，我也能更安心地睡觉，知道我的数据是持久的。

### 解耦以实现可扩展性

TourBuddy 的名气越来越大，流量也随之增加。用户蜂拥而至，询问从巴黎到巴塔哥尼亚的旅行建议，但应用程序的响应时间开始增加。客户抱怨，我追踪到罪魁祸首是不断上升的缓存未命中率——我的内存缓冲区太小了。扩展整个集群感觉有点过度（移动数 TB 的磁盘数据？不了，谢谢！）。这时 EloqKV 的解耦架构派上了用场：我可以将计算/内存集群与存储分开扩展。以下是我如何设置一个带有 Cassandra 存储后端的 3 节点计算/内存集群：

以下是`docker-compose.yaml`文件的片段。完整的`decoupled_storage`配置，请参考[GitHub 仓库](https://github.com/eloqdata/docker-compose-example)。

```yaml
services:
  cassandra:
    image: cassandra:4.1.8
    container_name: cassandra
    networks:
      eloqnet:
        ipv4_address: 172.20.0.2
    ports:
      - '9042:9042'
    environment:
      - CASSANDRA_CLUSTER_NAME=eloq_kv
      - CASSANDRA_DC=DC1
    healthcheck:
      test: ['CMD', 'cqlsh', '-e', 'describe keyspaces']
      interval: 10s
      timeout: 5s
      retries: 20
  eloqkv1:
    image: eloqdata/eloqkv_full:latest
    container_name: eloqkv1
    networks:
      eloqnet:
        ipv4_address: 172.20.0.3
    ports:
      - '6379:6379'
    depends_on:
      cassandra:
        condition: service_healthy
      eloqkvbootstrap:
        condition: service_completed_successfully
    command: /EloqKVCassandra/bin/eloqkv --config /EloqKVCassandra/conf/eloqkv.ini --ip=${NODE1_IP} --port=${NODE1_PORT} --ip_port_list=${IP_PORT_LIST} --enable_wal=${ENABLE_WAL} --enable_data_store=${ENABLE_DATA_STORE} --checkpoint_interval=${CHECKPOINT_INTERVAL} --cass_hosts=172.20.0.2 --cass_password=cassandra --cass_user=cassandra
    working_dir: /EloqKVCassandra
  eloqkv2:
  eloqkv3:
```

几秒钟内，我就有了一个弹性内存池来处理热聊天数据，大大降低了读取延迟。TourBuddy 恢复了它的敏捷性，用即时响应让用户感到愉悦。

### 在预算内提升写入吞吐量

成功带来了新的挑战：随着用户聊天量激增，写入延迟飙升。我的 3 节点计算集群已经达到极限，而我的预算在大喊"不要再增加高规格节点了！"EloqKV 的解耦 WAL 日志服务来救场了。我添加了独立的低规格日志节点，每个节点都有自己的廉价磁盘，以提升写入吞吐量：

以下是`docker-compose.yaml`文件的片段。完整的`decoupled_log_storage`配置，请参考[GitHub 仓库](https://github.com/eloqdata/docker-compose-example)。

```yaml
services:
  cassandra:
    image: cassandra:4.1.8
    container_name: cassandra
    networks:
      eloqnet:
        ipv4_address: 172.20.0.2
    ports:
      - '9042:9042'
    environment:
      - CASSANDRA_CLUSTER_NAME=eloq_kv
      - CASSANDRA_DC=DC1
    healthcheck:
      test: ['CMD', 'cqlsh', '-e', 'describe keyspaces']
      interval: 10s
      timeout: 5s
      retries: 20
  eloqkv1:
    image: eloqdata/eloqkv_full:latest
    container_name: eloqkv1
    networks:
      eloqnet:
        ipv4_address: 172.20.0.3
    ports:
      - '6379:6379'
    depends_on:
      cassandra:
        condition: service_healthy
      eloqkvbootstrap:
        condition: service_completed_successfully
    command: /EloqKVCassandra/bin/eloqkv --config /EloqKVCassandra/conf/eloqkv.ini --ip=${NODE1_IP} --port=${NODE1_PORT} --ip_port_list=${IP_PORT_LIST} --enable_wal=${ENABLE_WAL} --enable_data_store=${ENABLE_DATA_STORE} --checkpoint_interval=${CHECKPOINT_INTERVAL} --cass_hosts=172.20.0.2 --cass_password=cassandra --cass_user=cassandra
    working_dir: /EloqKVCassandra
  eloqkv2:
  eloqkv3:
  logserver1:
    image: eloqdata/eloqkv_full:latest
    container_name: logserver1
    networks:
      eloqnet:
        ipv4_address: 172.20.0.11
    ports:
      - '9001:9001'
    command: sh -c "export LD_LIBRARY_PATH=/LogService/lib:${LD_LIBRARY_PATH};/LogService/bin/launch_sv -conf=172.20.0.11:9001,172.20.0.12:9002,172.20.0.13:9003 -start_log_group_id=0 -node_id=0 -storage_path=/wal_eloqkv1"
    working_dir: /LogServer
    tty: true
    stdin_open: true
  logserver2:
  logserver3:
```

写入延迟大幅下降，TourBuddy 快速地处理每一次聊天对话——而且没有使用额外的高配置机器，避免超出预算。

### 锦上添花——更多待探索的功能

现在，我的 EloqKV 集群是一个精简、高效、完全弹性的系统。我可以关闭一个计算节点、一个日志节点，甚至一个存储节点，而 TourBuddy 依然能正常运行，这要归功于 EloqKV 的高可用特性。没有任何单点故障能阻止我的智能助手分享旅行故事。

EloqKV 还在不断给我惊喜。它还包含了跨分片 LUA 脚本、Multi/Exec 命令以及带有 Begin/Commit/Rollback API 的显式事务等功能。快来探索吧！

---

## 旅行总结

用 EloqKV 构建 TourBuddy 就像带着一个值得信赖的伙伴踏上旅程。从简单的缓存到解耦的弹性数据库，EloqKV 适应了每一个转折点，保持我的 Agentic AI 应用快速、持久且具有成本效益。无论你是在缓存热数据、持久化历史记录，还是为大规模用户扩展，EloqKV 的解耦架构都能为你提供支持。所以，拿起这些 YAML 片段，启动 Docker，带着你自己的智能助手开始一次导览吧——你会惊讶于它能走多远！
