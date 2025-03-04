---
title: 备份和导出工具
summary: 学习如何创建备份并将其转换为 rdb / aof 文件。
---

# 备份管理

你可以使用 `eloqctl` 创建和管理当前 EloqKV 集群的备份。

### 创建备份

创建集群备份并将其保存在指定节点的给定路径上。

```
eloqctl backup ${cluster_name} start [OPTIONS] --path /path/to/backup
```

选项：

- **--path**：  
  存储备份的完整路径。_(必需)_
- **--dest-user**：  
  存储备份的目标节点的用户。_(默认：当前用户)_
- **--dest-node**：  
  存储备份的节点地址。如果你想稍后将备份转换为 AOF 或 RDB，这个节点必须是 tx 服务器节点之一。_(默认：当前节点)_
- **--password**：  
  如果设置了集群密码则需要提供 _(默认："")_

### 列出集群的备份

列出集群当前可用的备份。

```
eloqctl backup ${cluster_name} list
```

### 将备份转换为 AOF 文件

1. 创建一个新的备份

   ```bash
   eloqctl backup eloqkv-cluster start --path /home/workspace/snapshot
   ```

2. 创建输出目录

   ```bash
   mkdir -p /home/workspace/output_aof
   ```

3. 将备份转换为 AOF 文件

   ```bash
   eloqctl backup eloqkv-cluster convert --path /home/workspace/snapshot --output /home/workspace/output_aof --format aof
   ```

4. 检查 AOF 文件

   ```bash
   redis-check-aof /home/workspace/output_aof/0.aof
   ```

   输出将如下所示：

   ```
   AOF analyzed: size=411068632, ok_up_to=411068632, diff=0
   AOF is valid
   ```

5. 使用 `redis-cli` 将 AOF 文件导入到另一个服务器：

   ```bash
   redis-cli --pipe < /home/workspace/output_aof/0.aof
   ```

   导入后，输出将如下所示：

   ```
   All data transferred. Waiting for the last reply...
   Last reply received from server.
   errors: 0, replies: 6567541
   ```

6. 删除之前的快照

```
 eloqctl backup eloqkv-cluster remove --until 1min
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
