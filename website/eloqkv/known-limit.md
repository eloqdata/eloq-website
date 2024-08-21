---
title: Known Limitations
---

Known Limitations of EloqKV:

1. The value associated with each key is limited to a maximum size of 256MB.
2. The "Max client" parameter limits the number of file handles in EloqKV, not the actual number of clients.
3. The RocksDB persistent storage engine does not currently support high availability. For high availability, consider using Cassandra, Scylla, or DynamoDB instead.
