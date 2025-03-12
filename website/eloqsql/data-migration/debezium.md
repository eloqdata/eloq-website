---
title: 使用 Debezium 从 MySQL 迁移到 EloqSQL
---

# 目录

- [目录](#目录)
  - [安装 Debezium](#安装-debezium)
    - [安装 Kafka](#安装-kafka)
    - [安装 Debezium](#安装-debezium-1)
  - [配置 Debezium](#配置-debezium)
  - [从 MySQL 迁移到 EloqSQL](#从-mysql-迁移到-eloqsql)

## 安装 Debezium

### 安装 Kafka

下载并解压 Kafka 压缩包。

```
wget https://dlcdn.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz
tar -zxvf kafka_2.13-3.7.0.tgz
mv kafka_2.13-3.7.0 kafka
```

### 安装 Debezium

安装 Java 11 并将其设置为默认 Java 版本。

```
sudo yum install -y java-11-openjdk-devel
sudo alternatives --config java
```

在 CentOS 7 上安装 Debezium。

```
cd kafka
wget https://www.eloqdata.com/download/debezium/debezium-connector-mysql-2.6.1.Final-plugin.tar.gz
wget https://www.eloqdata.com/download/debezium/debezium-connector-jdbc-2.6.1.Final-plugin.tar.gz
wget https://www.eloqdata.com/download/debezium/debezium-connector-jdbc-2.7.0-SNAPSHOT.jar
tar -xzf debezium-connector-mysql-2.6.1.Final-plugin.tar.gz
tar -xzf debezium-connector-jdbc-2.6.1.Final-plugin.tar.gz
rm debezium-connector-jdbc/debezium-connector-jdbc-2.6.1.Final.jar
mkdir plugins
mv debezium-connector-mysql/* plugins/
mv debezium-connector-jdbc/* plugins/
mv debezium-connector-jdbc-2.7.0-SNAPSHOT.jar plugins/
cp -p plugins/*.jar libs/
```

## 配置 Debezium

1. kafka/config/connect-standalone.properties

```
plugin.path=/home/centos/kafka/plugins
```

2. kafka/config/server.properties

```
# 日志文件可以删除的最小年龄
log.retention.hours=24
# 基于大小的日志保留策略。除非剩余段低于 log.retention.bytes，否则将从日志中删除段。
# 独立于 log.retention.hours 运行。
log.retention.bytes=30000000000
# 用于存储日志文件的目录列表，以逗号分隔
log.dirs=/data/kafka-logs
```

3. kafka/config/source-mysql.json

MySQL 源连接器从 MySQL 读取 binlog。源连接器的 MySQL 用户需要 REPLICATION SLAVE、REPLICATION CLIENT 权限。

```
CREATE USER 'replication_user'@'%' identified by 'replication_user';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'replication_user'@'%';
FLUSH PRIVILEGES;
```

```
{
    "name": "source-connector-mysql",
    "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "tasks.max": 1,
    "database.hostname": "127.0.0.1",
    "database.port": 3306,
    "database.user": "replication_user",
    "database.password": "replication_user",
    "database.server.id": 1,
    "database.include.list": "d1",
    "database.whitelist": "d1",
    "table.include.list": "d1.t1",
    "include.schema.changes": false,
    "topic.prefix": "topic_mysql",
    "schema.history.internal.kafka.bootstrap.servers": "localhost:9092",
    "schema.history.internal.kafka.topic": "topic_mysql",
    "topic.creation.default.replication.factor": "1",
    "topic.creation.default.partitions": "20"
  }
}
```

4. kafka/config/sink-to-eloqsql.json

```
{
  "name": "sink-connector-eloqsql",
  "config": {
    "connector.class": "io.debezium.connector.jdbc.JdbcSinkConnector",
    "tasks.max": "20",
    "connection.url": "jdbc:mariadb://127.0.0.1:3316/d1",
    "connection.username": "sysb",
    "connection.password": "sysb",
    "insert.mode": "insert",
    "schema.evolution": "none",
    "primary.key.mode": "none",
    "topics.regex": "topic_mysql.d1.(.*)",
    "table.name.format": "${topic}",
    "batch.size": "200",
    "transforms": "topicRename",
    "transforms.topicRename.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.topicRename.regex": "topic_mysql.d1.(.*)",
    "transforms.topicRename.replacement": "$1",
    "error_handler": "org.apache.kafka.connect.errors.RetryWithToleranceOperator",
    "errors.tolerance": "all",
    "errors.retry.timeout": "-1",
    "errors.retry.delay.max.ms": "60000",
    "errors.log.enable": "true",
    "errors.log.include.messages": "true"
  }
}
```

## 从 MySQL 迁移到 EloqSQL

1. 为 MySQL 启用 binlog。编辑 my.cnf

```
[mysqld]
server-id = 1
log_bin = mysql-bin
binlog-format = ROW
expire_logs_days  = 1
```

2. 在 EloqSQL 上创建表

如何设置 EloqSQL，请参考[部署 EloqSQL](https://www.eloqdata.com/eloqsql/quick-start)

```
CREATE TABLE t1(id int primary key, j int) engine eloq;
```

3. 启动 Zookeeper

```
/home/centos/kafka/bin/zookeeper-server-start.sh /home/centos/kafka/config/zookeeper.properties > logzookeeper 2>&1 &
```

4. 启动 Kafka

```
/home/centos/kafka/bin/kafka-server-start.sh /home/centos/kafka/config/server.properties > logkafka 2>&1 &
```

5. 启动 Kafka 连接器服务

```
/home/centos/kafka/bin/connect-distributed.sh /home/centos/kafka/config/connect-distributed.properties > logconnector 2>&1 &
```

6. 启动 MySQL 连接器

```
cd kafka/config
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -k -d @source-mysql.json
```

7. 验证源连接器

验证 Kafka 主题是否已创建。

```
/home/centos/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

可选，验证 Kafka 主题是否不为空。

```
/home/centos/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic topic_mysql.gamelog.t1 --from-beginning
```

8. 启动 JDBC Sink 连接器

```
cd kafka/config
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -k -d @sink-to-eloqsql.json
```

9. 验证连接器是否已设置

```
curl  http://localhost:8083/connectors/ -k
```
