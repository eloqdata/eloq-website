---
title: Backup&Dump Tools
summary: Learn how to create backup and convert it to rdb / aof file.
---

# Backup management

You can use `eloqctl` to create and manage backup of current EloqKV cluster.

### Create backup

Create a cluster backup and save it at given path on a specified node.

```
eloqctl backup ${cluster_name} start [OPTIONS] --path /path/to/backup
```

Options:

- **--path**:  
  The full path to where the backup is stored. _(required)_
- **--dest-user**:  
  User of the destination node where the backup is stored. _(default: current user)_
- **--dest-node**:  
  Node address where the backup is stored. If you want to convert backups to AOF or RDB later, this node must be on of the tx server nodes. _(default: current node)_
- **--password**:  
  Cluster password if set _(default: "")_

### List backup of a cluster

List current available backups of a cluster.

```
eloqctl backup ${cluster_name} list
```

### Cleanup backup of a cluster

```
eloqctl backup ${cluster_name} remove [OPTIONS]
```

If no option is provided, remove will delete all backups of the current cluster.  
Options:

- **--until \<PERIOD\>**:  
  Deletes all snapshots older than the specified period.
  Accepted formats: - '2 days' - '15h' - '1 week' - '3 months' - '1y 6mo 2w 4d 3h 5m 7s'
  See https://docs.rs/humantime/latest/humantime/fn.parse_duration.html for more details.
- **--before\>TIMESTAMP\>**:
  Deletes all snapshots created before this timestamp.
  Accepted formats: - RFC 3339: '2024-11-14T15:01:00Z' - 'YYYY-MM-DD HH:MM:SS' (assumed local time zone) - 'YYYY-MM-DDTHH:MM:SS' (assumed local time zone)

### Convert existing backup to AOF file.

```
eloqctl backup ${cluster_name} dump-aof [OPTIONS] --rocksdb-path <ROCKSDB_PATH> --output-file-dir <OUTPUT_FILE_DIR>
```

eloqctl will convert a previous backup in this cluster to AOF files. AOF files will be written to the same node where the backup is stored.  
Options:  
-**--rocksdb-path**:  
Path to the backup location. Must match one of the backup path returned in `eloqctl backup list`.  
-**--output-file-dir**:  
Path where the AOF files will be written to.  
-**--thread-count**:  
Worker thread count for converting backup to AOF. Each worker will consume 1 vcpu on the target node. _(default:1)_

### Convert existing backup to RDB file.

```
eloqctl backup ${cluster_name} dump-rdb [OPTIONS] --rocksdb-path <ROCKSDB_PATH> --output-file-dir <OUTPUT_FILE_DIR>
```

eloqctl will convert a previous backup in this cluster to RDB files. RDB file will be written to the same node where the backup is stored.  
Options:  
-**--rocksdb-path**:  
Path to the backup location. Must match one of the backup path returned in `eloqctl backup list`.  
-**--output-file-dir**:  
Path where the RDB file will be written to.  
-**--thread-count**:  
Worker thread count for converting backup to RDB. Each worker will consume 1 vcpu on the target node. _(default:1)_

## Example of Dumping Data from EloqKV and Importing to Other Servers

1. Dump data:

   ```bash
   eloqctl backup eloqkv-cluster start --path /data/backup
   ```

2. After the backup is created, check available backups.

   ```bash
    eloqctl backup eloqkv-cluster list
   available snapshots: [
    (
        "eloqkv-cluster",
        2024-12-04T10:02:36.165807800Z,
        "/data/backup/eloqkv-cluster/2024-12-04-10-02-36",
        "172.31.42.205",
        "ubuntu",
    ),
   ]
   ```

3. Convert backup to AOF file.

   ```bash
   eloqctl backup eloqkv-cluster dump-aof --rocksdb-path /data/backup/eloqkv-cluster/2024-12-04-10-02-36 --output-file-dir /home/workspace/output_aof
   ```

4. Check AOF files

   ```bash
   redis-check-aof /home/workspace/output_aof/0.aof
   ```

   The output will look like:

   ```
   AOF analyzed: size=411068632, ok_up_to=411068632, diff=0
   AOF is valid
   ```

5. Import the AOF files to another server using `redis-cli`:

   ```bash
   redis-cli --pipe < /home/workspace/output_aof/0.aof
   ```

   After importing, the output will look like this:

   ```
   All data transferred. Waiting for the last reply...
   Last reply received from server.
   errors: 0, replies: 6567541
   ```

6. Remove previous snapshot

```
 eloqctl backup eloqkv-cluster remove --until 1min
```
