---
title: Known Limitations
---

Known Limitations of EloqKV:

1. The value associated with each key is limited to a maximum size of 256MB.
2. The RocksDB persistent storage engine does not currently support replication, thus data may no-longer be available when node fails. For high availability, consider using Cassandra or DynamoDB instead.
3. Redis, which runs data operations in a single thread, executes transactions enclosed in _MULTI/EXEC_ in a serial manner. EloqKV upports concurrent transactions. Therefore transactions may be aborted (i.e. fail) in EloqKV due to conflicts. Users cannot assume all _MULTI/EXEC_ transactions will return success even in single node situation.
