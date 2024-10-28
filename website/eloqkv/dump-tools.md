---
title: Backup&Dump Tools
summary: Learn how to dump data from eloqkv.
---

# Dump data from EloqKV to AOF files.

We provide a tool called `eloqkv_to_aof` to dump data from **EloqKV** storage into files in Redis AOF format.


## How to use?

Usage: eloqkv_to_aof [options]

Options:

- **rocksdb_path**: The full path to the RocksDB storage data. *(no default)*
- **output_file_dir**: The full path to the directory for storing output AOF files. Ensure the directory is empty. The number of generated AOF files will match the `thread_count`, and they will be named as "{0-N}.aof". *(no default)*
- **thread_count**: The number of parsing worker threads. *(default: 1)*
- **round_batch_size**: The number of records to parse in one batch. *(default: 10,000)*


## Example of Dumping Data from EloqKV and Importing to Other Servers

1. Stop the EloqKV server
   
   (Before stopping, please ensure all data in memory is flushed to storage.)

2. Dump data:
   ```bash
   ./eloqkv_to_aof --rocksdb_path=/home/workspace/rocksdb_store/db --output_file_dir=/home/workspace/output_aof --thread_count=4 --round_batch_size=10000
   ```

3. After the dump is complete, check the files in the output directory `/home/workspace/output_aof`:
   ```bash
   ls /home/workspace/output_aof
   # Output: 0.aof 1.aof 2.aof 3.aof
   ```

4. Validate the AOF files using the `redis-check-aof` tool (Notice: this tool is provided by Redis):

   ```bash
   redis-check-aof /home/workspace/output_aof/0.aof
   redis-check-aof /home/workspace/output_aof/1.aof
   redis-check-aof /home/workspace/output_aof/2.aof
   redis-check-aof /home/workspace/output_aof/3.aof
   ```

   The output will look like:
   ```
   AOF analyzed: size=411068632, ok_up_to=411068632, diff=0
   AOF is valid
   ```

5. Import the AOF files to another server using `redis-cli`:
   ```bash
   redis-cli --pipe < /home/workspace/output_aof/0.aof
   redis-cli --pipe < /home/workspace/output_aof/1.aof
   redis-cli --pipe < /home/workspace/output_aof/2.aof
   redis-cli --pipe < /home/workspace/output_aof/3.aof
   ```

   After importing, the output will look like this:
   ```
   All data transferred. Waiting for the last reply...
   Last reply received from server.
   errors: 0, replies: 6567541
   ```