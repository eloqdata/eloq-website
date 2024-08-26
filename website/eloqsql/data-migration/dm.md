---
title: Migrate from MySQL to EloqSQL using DM tool
---

# Table of Contents

1. [Download DM Tool](#download-dm-tool)
2. [DM Quick Start](#dm-quick-start)
3. [DM Helper Tool](#migrate-archived-table-using-eloqdm-helper)

## Download DM Tool

```shell
wget https://download.eloqdata.com/eloqsql/dm/eloqdm-0.4.3-linux-amd64.tar.gz
```

Optionally, download the eloqdm-helper tool to migrate tables one by one.

```shell
wget https://download.eloqdata.com/eloqsql/dm/eloqdm-helper.tar.gz
```

## DM Quick Start

### Deploy a DM cluster

1. Untar eloqdm and

```shell
# supporse we download eloqdm in /data directory
cd /data
tar -zxvf eloqdm-0.4.3-linux-amd64.tar.gz
cd EloqDM
export PATH=$PATH:${PWD}/bin
```

2. Start DM Master.

```shell
nohup dm-master -config config/dm-master.toml &
```

3. Start DM Worker.

```shell
nohup dm-worker -config config/dm-worker.toml &
```

### Prepare the data source

1. Edit configuration file for each data source as follows:

```shell
vi config/source.yaml
```

```
source-id: "mysql"
from:
  host: "127.0.0.1"
  user: "mysql-user"
  password: "mysql-pwd"
  port: 3306
```

2. Register the source the DM cluster.

```shell
dmctl --master-addr=127.0.0.1:8261 operate-source create config/source.yaml
```

### Create a data migration task

1. Create a task configuration file as follows:

```shell
cat > config/task.yaml <<EOF
# Task name. Each of the multiple tasks running at the same time must have a unique name.
name: "testdm"
# Task mode. Options are:
# full: only performs full data migration.
# incremental: only performs binlog real-time replication.
# all: full data migration + binlog real-time replication.
task-mode: "all"
# The configuration of the target EloqSQL database.
target-database:
  host: "127.0.0.1"
  port: 3316           # EloqSQL client port
  user: "eloquser"
  password: "eloqpwd" # Plaintext password is supported but not recommended. It is recommended to use dmctl encrypt to encrypt the plaintext password before using the password.

# The configuration of all MySQL instances of source database required for the current migration task.
mysql-instances:
-
  # The ID of an upstream instance or a replication group
  source-id: "mysql"
  # The names of the block list and allow list configuration of the schema name or table name that is to be migrated.
  block-allow-list: "bw-rule-1"
  mydumper-thread: 4
  loader-thread: 64
  syncer-thread: 256

# The global configuration of blocklist and allowlist. Each instance is referenced by a configuration item name.
block-allow-list:
  bw-rule-1:
    do-dbs: ["log1"]
    ignore-tables:
    - db-name: "log1"
      tbl-name: "~(gamelog(_[a-z]+)+|complaint)($|_(2023[0-9]{4}|20240[1-7][0-9]{2}|202408[0-1][0-9]|2024082[0-2]))"

  bw-rule-2:
    do-tables:
    - db-name: "log"
      tbl-name: "~^log_07.*" # Starting with "~" indicates that it is a regular expression.
    - db-name: "log"
      tbl-name: "~^log_062[1-3]" # Matches log_0621, log_0622, and log_0623.
    ignore-tables:
    - db-name: "log"
      tbl-name: "~^log_061.*"


EOF
```

2. Start the data migration task using `dmctl`.

```shell
dmctl --master-addr 127.0.0.1:8261 start-task config/task.yaml
```

### Check the status of the DM task

1. Check the task status using dmctl.

```shell
dmctl --master-addr 127.0.0.1:8261 query-status testdm
```

## Migrate archived table using eloqdm helper

To limit the traffic of source and target database during migration of archived table, we supply a dm-helper tool to migrate archived table one by one.

Note that eloqdm-helper only support `full` mode and can only be used for archived tables.

1. Untar eloqdm-helper

```
tar -zxvf eloqdm-helper.tar.gz
cd serial_tasks
```

2. Install command tool `jq`

```shell
# centos
sudo yum install jq
# ubuntu
sudo apt install jq
```

3. Edit the task config template file `task_temp.yaml` to fill correct ip, user, password information.

```shell
vim task_temp.yaml
```

4. Prepare the `tables_in.txt` to include all the archived tables in source database. User can use `show tables` to get full table list and use below regular expression to generate archived table list into `tables_in.txt`.

```
grep -E '(gamelog(_[a-z]+)+|complaint)($|_(2023[0-9]{4}|20240[1-7][0-9]{2}|202408[0-1][0-9]|2024082[0-2]))' full_tables.txt > tables_in.txt
```

5. Execute `serial.sh` to migrate table to EloqSQL one by one.

```shell
# Please replace `MASTER_ADDR` in this script with the address of DM master.

nohup bash serial.sh > out.txt 2>&1 &
tail -f out.txt
```
