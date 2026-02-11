---
title: Backup Tools
summary: Learn how to create backup and restore from a snapshot.
---

# Backup management

You can use `eloqctl` to create and manage backup of current EloqKV cluster.

### Create backup

Create a cluster backup (For cloud (S3) storage).

```
eloqctl backup ${cluster_name} start
```

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
- **--before \<TIMESTAMP\>**:
  Deletes all snapshots created before this timestamp.
  Accepted formats: - RFC 3339: '2024-11-14T15:01:00Z' - 'YYYY-MM-DD HH:MM:SS' (assumed local time zone) - 'YYYY-MM-DDTHH:MM:SS' (assumed local time zone)

### Restore a cluster from a snapshot timestamp.

```
eloqctl backup ${cluster_name} restore --snapshot-ts <SNAPSHOT_TS>
```

**NOTE:** Restore can only be performed when the cluster is stopped.

Options:
- **--snapshot-ts** `<SNAPSHOT_TS>`:
Snapshot timestamp to restore. Must match a snapshot_name in t_snapshot_info table.
          Accepted formats:
          - RFC 3339: '2024-11-14T15:01:00Z'
          - 'YYYY-MM-DD HH:MM:SS' (assumed UTC)
          - 'YYYY-MM-DDTHH:MM:SS' (assumed UTC)
          Example: '2025-11-05T03:45:45Z'

## Example of Backup EloqKV and Restore from a snapshot timestamp

1. Backup:

   ```bash
   eloqctl backup eloqkv-cluster start
   ```

2. After the backup is created, check available backups.

   ```bash
    eloqctl backup eloqkv-cluster list
   available snapshots: [
    (
        "eloqkv-cluster",
        2024-12-04T10:02:36.165807800Z,
        "backup_ts: 1733364156729512",
        "",
        "",
        "cloud (S3)"
    ),
   ]
   ```

3. Restore from a snapshot timestamp.

   Must stop the cluster firstly.

   ```bash
   eloqctl stop eloqkv-cluster
   ```

   ```bash
   eloqctl backup eloqkv-cluster restore --snapshot-ts 2024-12-04T10:02:36.165807800
   ```

4. Remove previous snapshot

   ```bash
   eloqctl backup eloqkv-cluster remove --until 1min
   ```
