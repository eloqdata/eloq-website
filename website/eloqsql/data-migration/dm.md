---
title: 使用 DM 工具从 MySQL 迁移到 EloqSQL
---

# 目录

- [目录](#目录)
  - [下载 DM 工具](#下载-dm-工具)
  - [DM 快速入门](#dm-快速入门)
  - [DM 辅助工具](#使用-eloqdm-helper-迁移归档表)

## 下载 DM 工具

```shell
wget https://download.eloqdata.com/eloqsql/dm/eloqdm-0.4.3-linux-amd64.tar.gz
```

可选，下载 eloqdm-helper 工具以逐个迁移表。

```shell
wget https://download.eloqdata.com/eloqsql/dm/eloqdm-helper.tar.gz
```

## DM 快速入门

### 部署 DM 集群

1. 解压 eloqdm 并设置环境变量

```shell
# 假设我们在 /data 目录下载了 eloqdm
cd /data
tar -zxvf eloqdm-0.4.3-linux-amd64.tar.gz
cd EloqDM
export PATH=$PATH:${PWD}/bin
```

2. 启动 DM Master。

```shell
nohup dm-master -config config/dm-master.toml &
```

3. 启动 DM Worker。

```shell
nohup dm-worker -config config/dm-worker.toml &
```

### 准备数据源

1. 按如下方式编辑每个数据源的配置文件：

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

2. 在 DM 集群中注册数据源。

```shell
dmctl --master-addr=127.0.0.1:8261 operate-source create config/source.yaml
```

### 创建数据迁移任务

1. 按如下方式创建任务配置文件：

```shell
cat > config/task.yaml <<EOF
# 任务名称。同时运行的多个任务必须具有唯一的名称。
name: "testdm"
# 任务模式。选项包括：
# full：仅执行全量数据迁移。
# incremental：仅执行 binlog 实时复制。
# all：全量数据迁移 + binlog 实时复制。
task-mode: "all"
# 目标 EloqSQL 数据库的配置。
target-database:
  host: "127.0.0.1"
  port: 3316           # EloqSQL 客户端端口
  user: "eloquser"
  password: "eloqpwd" # 支持明文密码但不推荐。建议使用 dmctl encrypt 加密明文密码后再使用。

# 当前迁移任务所需的所有源数据库 MySQL 实例的配置。
mysql-instances:
-
  # 上游实例或复制组的 ID
  source-id: "mysql"
  # 要迁移的 schema 名称或表名称的黑白名单配置名称。
  block-allow-list: "bw-rule-1"
  mydumper-thread: 4
  loader-thread: 64
  syncer-thread: 256

# 黑白名单的全局配置。每个实例通过配置项名称引用。
block-allow-list:
  bw-rule-1:
    do-dbs: ["log1"]
    ignore-tables:
    - db-name: "log1"
      tbl-name: "~(gamelog(_[a-z]+)+|complaint)($|_(2023[0-9]{4}|20240[1-7][0-9]{2}|202408[0-1][0-9]|2024082[0-2]))"

  bw-rule-2:
    do-tables:
    - db-name: "log"
      tbl-name: "~^log_07.*" # 以 "~" 开头表示这是一个正则表达式。
    - db-name: "log"
      tbl-name: "~^log_062[1-3]" # 匹配 log_0621、log_0622 和 log_0623。
    ignore-tables:
    - db-name: "log"
      tbl-name: "~^log_061.*"

EOF
```

2. 使用 `dmctl` 启动数据迁移任务。

```shell
dmctl --master-addr 127.0.0.1:8261 start-task config/task.yaml
```

### 检查 DM 任务状态

1. 使用 dmctl 检查任务状态。

```shell
dmctl --master-addr 127.0.0.1:8261 query-status testdm
```

## 使用 eloqdm-helper 迁移归档表

为了限制源数据库和目标数据库在迁移归档表期间的流量，我们提供了 dm-helper 工具来逐个迁移归档表。

注意：eloqdm-helper 仅支持 `full` 模式，且只能用于归档表。

1. 解压 eloqdm-helper

```
tar -zxvf eloqdm-helper.tar.gz
cd serial_tasks
```

2. 安装命令行工具 `jq`

```shell
# centos
sudo yum install jq
# ubuntu
sudo apt install jq
```

3. 编辑任务配置模板文件 `task_temp.yaml`，填入正确的 IP、用户名、密码信息。

```shell
vim task_temp.yaml
```

4. 准备 `tables_in.txt` 文件，包含源数据库中的所有归档表。用户可以使用 `show tables` 获取完整表列表，并使用以下正则表达式将归档表列表生成到 `tables_in.txt` 中。

```
grep -E '(gamelog(_[a-z]+)+|complaint)($|_(2023[0-9]{4}|20240[1-7][0-9]{2}|202408[0-1][0-9]|2024082[0-2]))' full_tables.txt > tables_in.txt
```

5. 执行 `serial.sh` 逐个将表迁移到 EloqSQL。

```shell
# 请将此脚本中的 `MASTER_ADDR` 替换为 DM master 的地址。

nohup bash serial.sh > out.txt 2>&1 &
tail -f out.txt
```
