---
title: Migrate from MySQL to EloqSQL using Debezium
---

# Table of Contents

1. [Install Debezium](#install-debezium)
2. [Configure Debezium](#configure-debezium)
3. [Migrate from MySQL to EloqSQL](#migrate-from-mysql-to-eloqsql)

## Install Debezium

### Install Kafka

Download and unzip Kafka tarball.

```
wget https://dlcdn.apache.org/kafka/3.7.0/kafka_2.13-3.7.0.tgz
tar -zxvf kafka_2.13-3.7.0.tgz
mv kafka_2.13-3.7.0 kafka
```

### Install Debezium

Install Java 11 and choose Java 11 as default java version.

```
sudo yum install -y java-11-openjdk-devel
sudo alternatives --config java
```

Install Debezium on CentOS 7.

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

## Configure Debezium

1. kafka/config/connect-standalone.properties

```
plugin.path=/home/centos/kafka/plugins
```

2. kafka/config/server.properties

```
# The minimum age of a log file to be eligible for deletion due to age
log.retention.hours=24
# A size-based retention policy for logs. Segments are pruned from the log unless the remaining
# segments drop below log.retention.bytes. Functions independently of log.retention.hours.
log.retention.bytes=30000000000
# A comma separated list of directories under which to store log files
log.dirs=/data/kafka-logs
```

3. kafka/config/source-mysql.json

MySQL source connector read binlog from MySQL. The MySQL user of source connector requires
REPLICATION SLAVE, REPLICATION CLIENT privileges.

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

## Migrate from MySQL to EloqSQL

1. Enable binlog for MySQL. Edit my.cnf

```
[mysqld]
server-id = 1
log_bin = mysql-bin
binlog-format = ROW
expire_logs_days  = 1
```

2. Create table on EloqSQL

How to setup EloqSQL, please refer to [Deploy EloqSQL](https://www.eloqdata.com/eloqsql/quick-start)

```
CREATE TABLE t1(id int primary key, j int) engine monograph;
```

3. Start Zookeeper

```
/home/centos/kafka/bin/zookeeper-server-start.sh /home/centos/kafka/config/zookeeper.properties > logzookeeper 2>&1 &
```

4. Start Kafka

```
/home/centos/kafka/bin/kafka-server-start.sh /home/centos/kafka/config/server.properties > logkafka 2>&1 &
```

5. Start Kafka Connector Service

```
/home/centos/kafka/bin/connect-distributed.sh /home/centos/kafka/config/connect-distributed.properties > logconnector 2>&1 &
```

6. Start MySQL Connector

```
cd kafka/config
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -k -d @source-mysql.json
```

7. Verify Source Connector

Verify Kafka topic is created.

```
/home/centos/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

Optional, verify Kafka topic is not empty.

```
/home/centos/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic topic_mysql.gamelog.t1 --from-beginning

```

8. Start JDBC Sink Connector

```
cd kafka/config
curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -k -d @sink-to-eloqsql.json
```

9. Verify Connectors are Setup

```
curl  http://localhost:8083/connectors/ -k
```
