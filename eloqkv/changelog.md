---
title: EloqKV Change Log
---

## Version 0.8.18

### New Features

- **io_uring Support:** Integrated `io_uring` for high-performance asynchronous I/O operations, significantly improving throughput and reducing latency.
- **RocksCloud Integration:** Added support for RocksCloud as a storage backend, allowing for seamless deployment on cloud environments and leveraging its scalable and durable storage capabilities.

### Bug Fixes

- **Master-Slave Replication:** Resolved a critical bug in the master-slave replication protocol to ensure data consistency and reliability.
- **BLPOP Command:** Fixed an issue where the `BLPOP` command would hang indefinitely under certain conditions, improving the stability of blocking operations.
- **Pub/Sub Clients:** Addressed a client-side issue in the publish/subscribe mechanism to prevent message loss and ensure reliable message delivery.
