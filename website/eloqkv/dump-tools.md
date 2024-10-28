---
title: Backup&Dump Tools
summary: Learn how to dump data from eloqkv.
---

# Dump data from eloqkv storage to AOF files.

We provide one tool (eloqkv_to_aof) to dump data in **eloqkv** storage to `Redis AOF` files.

Now, only support dump data from EloqKV with RocksDB storage.

## How to use?
usage: eloqkv_to_aof [options]

options: 
- rocksdb_path: Full path of rocksdb storage data. (no default)
- output_file_dir: Full path of the directory to store output aof files. Please ensure the directory is empty. The count of generated aof files is equal to `thread_count` and they are named as "{0-N}.aof". (no default)
- thread_count: The number of parse worker threads. (default 1)
- round_batch_size: The number of records to parse in one batch.(default 10000)

## Example of dump from EloqKV and import to other servers.
(1) Stop EloqKV server and make sure all data in memory are flushed to storage.

(2) Dump data.
```
./eloqkv_to_aof --rocksdb_path=/home/workspace/rocksdb_store/db --output_file_dir=/home/workspace/output_aof --thread_count=4 --round_batch_size=10000

```

(3) After dump finished, check files in output directory "/home/workspace/output_aof".

```
ls /home/workspace/output_aof

# 0.aof 1.aof 2.aof 3.aof
```

(4) Check the aof file using "redis-check-aof" tool:
```
redis-check-aof /home/workspace/output_aof/0.aof
redis-check-aof /home/workspace/output_aof/1.aof
redis-check-aof /home/workspace/output_aof/2.aof
redis-check-aof /home/workspace/output_aof/3.aof
```

(5) Import the aof files to another server using "redis-cli":
```
 redis-cli  --pipe < /home/workspace/output_aof/0.aof
 redis-cli  --pipe < /home/workspace/output_aof/1.aof
 redis-cli  --pipe < /home/workspace/output_aof/2.aof
 redis-cli  --pipe < /home/workspace/output_aof/3.aof

```

After being imported, it will print results as follow:
```
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 6567541
```
