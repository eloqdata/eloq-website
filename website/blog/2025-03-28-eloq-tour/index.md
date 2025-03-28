---
title: 'Exploring EloqKV Decoupled Architecture: A Tour with an Agentic AI Application Case Study'
authors: eloq
date: 2025-03-19
tags: [Company]
image: /img/tourbuddy.png
description: Explore EloqKV’s decoupled architecture powering TourBuddy, scaling smoothly from fast cache to durable, elastic storage—keeping your AI apps quick, resilient, and cost-effective at every growth stage.
featured: true
blog: true
featuredMain: true
---

In the previous blog, we discussed the future [database foundation](/blog/2025/03/19/agentic) for Agentic AI Applications. In this blog we will simplify the agentic application and use EloqKV as data store to explore EloqKV's decoupled architecture.

<!--truncate-->

## Tour Begin

Imagine you’re building an [agentic AI application](https://nvidianews.nvidia.com/news/nvidia-alphabet-and-google-collaborate-on-the-future-of-agentic-and-physical-ai)—a chatty, autonomous assistant that roams the digital world, helping users with everything from travel tips to life advice. Your agent is smart, proactive, and powered by a large language model ([LLM](https://chat.openai.com/)), but there’s one catch: it needs to remember _everything_. Every witty remark, every user request, every "Aha!" moment—it all needs to be stored somewhere reliable. That’s where EloqKV comes in, and today, I’m taking you on a wild tour of how this decoupled architecture saved my AI agent (and my sanity) as it grew from a humble prototype to a bustling, scalable powerhouse.

<p align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./img/tourbuddy.png').default} alt="Building a Data Foundation for Agentic AI Applications" />

</div></p>

### Starting Simple with a Memory Cache

When I first launched my agent—let’s call it "TourBuddy"—it was a lightweight conversationalist, guiding users through imaginary trips. I needed a quick way to store chat history, so I turned to EloqKV as a simple memory cache. Deploying it was a breeze with a single-node setup using this Docker Compose file:

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
    command: /EloqKVRocksDB/bin/eloqkv --config /EloqKVRocksDB/conf/eloqkv.ini
    working_dir: /EloqKVRocksDB
    tty: true
    stdin_open: true
```

Boom! TourBuddy’s chat history was cached in memory, lightning-fast and ready to recall at a moment’s notice. It felt like giving my agent a short-term memory upgrade—perfect for its early days.

### Scaling Up with Persistent Storage

As TourBuddy gained fans (who doesn’t love a chatty travel guide?), the chat history ballooned. Storing everything in memory started to feel like stuffing a suitcase with too many souvenirs—expensive and impractical, especially since older messages were rarely accessed. Luckily, EloqKV has a persistent storage trick up its sleeve. With one tiny tweak to the config, I enabled RocksDB as a backend:

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
    command: /EloqKVRocksDB/bin/eloqkv --config /EloqKVRocksDB/conf/eloqkv.ini --enable_data_store=true
    working_dir: /EloqKVRocksDB
    tty: true
    stdin_open: true
```

Now, historical chats lived happily on disk, freeing up memory for hot data while keeping costs down. TourBuddy could still reminisce about that epic Tokyo itinerary from months ago without breaking the bank.

### Ensuring Durability When Disaster Strikes

Everything was smooth sailing until one day, TourBuddy forgot my latest adventure—my new location had vanished into thin air! After some frantic debugging, I realized the cache had lost data during a hiccup. Durability became my new obsession. Thankfully, EloqKV’s got a Write-Ahead Log (WAL) feature to make data loss a thing of the past. Another quick tweak:

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
    command: /EloqKVRocksDB/bin/eloqkv --config /EloqKVRocksDB/conf/eloqkv.ini --enable_data_store=true --enable_wal=true
    working_dir: /EloqKVRocksDB
    tty: true
    stdin_open: true
```

With WAL enabled, every chat message was safely logged before being committed. TourBuddy never forgot a destination again, and I slept better knowing my data was durable.

### Decoupling for Scalability

TourBuddy’s fame grew, and so did the traffic. Users flooded in, asking for tips from Paris to Patagonia, but the app’s response time crept up. Customers grumbled, and I traced the culprit to a rising cache miss rate—my memory buffer was too small. Scaling the entire cluster felt like overkill (moving terabytes of disk data? No thanks!). Enter EloqKV’s decoupled architecture: I could scale the compute/memory cluster separately from storage. Here’s how I set up a 3-node compute/memory cluster with a Cassandra storage backend:

Below is a snippet of the `docker-compose.yaml` file. For the complete `decoupled_storage` configuration, please refer to the [GitHub repository](https://github.com/eloqdata/docker-compose-example).

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

In seconds, I had an elastic memory pool to handle hot chat data, slashing read latency. TourBuddy was back to its zippy self, delighting users with instant responses.

### Boosting Write Throughput on a Budget

Success brought a new challenge: write latency spiked as users chatted up a storm. My 3-node compute cluster was maxed out, and my budget screamed "No more high spec nodes!" EloqKV’s decoupled WAL log service came to the rescue. I added standalone low spec log nodes, each with its own cheap disk, to boost write throughput:

Below is a snippet of the `docker-compose.yaml` file. For the complete `decoupled_log_storage` configuration, please refer to the [GitHub repository](https://github.com/eloqdata/docker-compose-example).

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

Write latency plummeted, and TourBuddy handled the chatter like a champ—all without breaking the bank.

### The Cherry on Top—More Features to Explore

Now, my EloqKV cluster was a lean, mean, fully elastic machine. I could kill a compute node, a log node, or even a storage node, and TourBuddy kept humming along, thanks to EloqKV’s high availability magic. No single point of failure could stop my agent from sharing travel tales.

EloqKV isn’t done surprising me. It’s packed with goodies like cross-shard LUA scripting, Multi/Exec commands, and explicit transactions with Begin/Commit/Rollback APIs. Dive in and explore!

---

## Wrapping Up the Tour

Building TourBuddy with EloqKV was like taking a trusty companion on a journey. From a simple cache to a decoupled, elastic database, EloqKV adapted to every twist and turn, keeping my agentic AI app fast, durable, and cost-effective. Whether you’re caching hot data, persisting history, or scaling for the masses, EloqKV’s decoupled architecture has your back. So, grab the YAML snippets, fire up Docker, and take your own agent on a tour—you’ll be amazed at where it can go!
