---
title: Migrate from MySQL to EloqSQL using DM tool
---

# Table of Contents

1. [Download DM Tool](#download-dm-tool)
2. [Quick Start](#quick-start)

## Download DM Tool

```shell
wget https://download.eloqdata.com/eloqsql/dm/eloqdm-0.4.3-linux-amd64.tar.gz
tar -zxvf eloqdm-0.4.3-linux-amd64.tar.gz
```

Optionally, download the eloqdm-helper tool to migrate tables one by one.

```shell
wget https://download.eloqdata.com/eloqsql/dm/eloqdm-helper.tar.gz
```

## Quick Start

### Deploy a DM cluster

1. Prepare `config` and `logs` directories.

```shell
cd eloqdm
mkdir config
mkdir logs
```

2. Generate DM Master configuration file.

```shell
cat > config/dm-master.toml <<EOF
name = "master"

log-level = "info"
log-file = "logs/dm-master.log"

master-addr = "127.0.0.1:8261"
peer-urls = "127.0.0.1:8291"
initial-cluster = "master=http://127.0.0.1:8291"
EOF
```

3. Generate DM Worker configuration file.

```shell
cat > config/dm-worker.toml <<EOF
name = "worker"

log-level = "info"
log-file = "logs/dm-worker.log"

worker-addr = "127.0.0.1:8262"
join = "127.0.0.1:8261"
EOF
```

4. Start DM Master.

```shell
nohup ./dm-master -config config/dm-master.toml &
```

5. Start DM Worker.

```shell
nohup ./dm-worker -config config/dm-worker.toml &
```

### Prepare the data source

1. Create a configuration file for each data source as follows:

```shell
cat > config/source.yaml <<EOF
source-id: "mysql"
from:
  host: "127.0.0.1"
  user: "mysql-user"
  password: "mysql-pwd"
  port: 3306
EOF
```

2. Register the source the DM cluster.

```shell
./dmctl --master-addr=127.0.0.1:8261 operate-source create config/source.yaml
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

# The global configuration of blocklist and allowlist. Each instance is referenced by a configuration item name.
block-allow-list:
  bw-rule-1:
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
./dmctl --master-addr 127.0.0.1:8261 start-task config/task.yaml
```

### Check the status of the DM task

1. Check the task status using dmctl.

```shell
./dmctl --master-addr 127.0.0.1:8261 query-status testdm
```
