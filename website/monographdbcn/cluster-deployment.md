---
title: 集群部署
summary: 了解在多台服务器上快速部署、使用MonoGraphDB集群。
---

# MonographDB 数据库集群部署、使用指南

本文档描述了在多台服务器上快速部署、使用 MonographDB 集群的步骤。

## 在多机上安装部署数据库集群

- 适用场景：希望用多台服务器，体验 MonographDB 的完整拓扑的集群。

本节介绍如何配置 MonographDB 拓扑的 YAML 文件部署 MonographDB 集群。

### 部署准备

部署数据库之前，请先完成[部署前配置](./basic-sql-operations.md)

联系我们获取 MonographDB 安装包。其中，Monograph Waiter 是一个用于开发与管理 MonographDB 的工具包，其中包含`cluster_mgr`, 一个用于集群安装部署和管理的命令行工具用于安装和管理 MonographDB 集群。

```
monographdb-tx-release-bin.tar.gz
monographdb-log-release-bin.tar.gz
waiter-cluster-mgr.tar.gz
```

对于 MonographDB 集群拓扑，可以通过更改 YAML 文件按需配置所需要的集群数量，在本次测试中，集群拓扑如下表所示：
下表中拓扑实例的 IP 为示例 IP IP。在实际部署时，请替换为实际的 IP。**注意:单机请使用 127.0.0.1。不能使用 localhost**

| 实例            | 个数 | IP       |
| :-------------- | :--- | :------- |
| tx_service      | 1    | 10.0.1.1 |
| log_service     | 1    | 10.0.1.2 |
| storage_service | 1    | 10.0.1.3 |
| monitor         | 1    | 10.0.1.3 |

### 实施部署

1. 部署 MonographDB

- 修改 monographDB 启动选项
  编辑配置文件 config/my_template.cnf，添加线程池相关参数，并根据机器配置进行调整 CPU 和内存参数。

```
# under [mariadb]
# enable thread pool
thread_handling=pool-of-threads
thread_pool_max_threads=4
thread_pool_dedicated_listener=1
# thread_pool_size should be 3/8 of CPU core number.
thread_pool_size=4

# under monograph
# core_num should be 3/8 of CPU core number.
monograph_core_num=4
# node_memory_limit_mb is the buffer pool of monographDB,
# should be less than 60% physical memory.
monograph_node_memory_limit_mb=4000
```

- 修改集群配置文件
  按下面的配置模板，编辑配置文件 config/deployment.yaml，其中：

  - `username: "ubuntu"`：表示通过 `ubuntu`系统用户（当前系统用户名）来做集群的内部管理，默认使用 22 端口通过 ssh 登录目标机器,**ubuntu 需要有 sudo 权限，不支持使用 root 用户安装数据库**
  - `auth_type`：ssh 登陆验证的方式，默认为 keypair 形式
  - `keypair`: 设置为通过网络配置的 ssh 私钥文件存放地址
  - `host`：设置为本部署主机的 IP，如果只需要安装在本机，则设置为 127.0.0.1 **注意：不能使用 localhost**
  - `tx_image`：MonographDB TxService 安装包，支持本地地址以及远程地址。
  - `log_image`: MonographDB LogService 安装包，支持本地地址以及远程地址。
  - `install_dir`：设置为用户安装集群的期望存放位置，此位置须为`username`所指定的用户所具有读写权限的文件夹位置，如果安装目录不存在，目前需要提前手工创建。
  - `storage_service`：配置`Cassandra`数据库的远程下载网址`download_url`，安装位置`(host)`，如果配置成`127.0.0.1`,表示安装在本地。
  - `monitor`：配置 MonographDB 的相关监控软件（prometheus、 grafana）的远程下载网址、安装位置以及安装端口。**目前 monitor 需要安装在 storage_service 所在节点**。
  - `log_service`: data_dir 负责指定磁盘的位置 /data/opt/log_data1 /data/opt/log_data2 /data/opt/log_data3
  - `内网安装`: 无法连接外网下载 Cassandra，可以提前下载上传，使用 file:///home/file_path 从本地安装 Cassanra 等组件。
    配置模板如下：

    ```yaml
    connection:
      username: 'ubuntu'
      auth_type: 'keypair'
      auth:
        keypair: '/home/ubuntu/.ssh/ed25519_mono'
      port: 22
    deployment:
      product: 'Monograph'
      # monographdb 安装包路径 file:// 表示文件在本地。目前支持http 和 file 。
      tx_image: 'file:///home/ubuntu/monographdb-tx-release-bin.tar.gz'
      log_image: 'file:///home/ubuntu/monographdb-log-release-bin.tar.gz'
      cluster_name: 'mono-poc'
      # monographdb 安装路径，当前用户对该目录需要具备读写权限 。
      # `sudo chown -R $USER:$USER /data/opt`
      install_dir: '/data/opt'
      port:
        mysql_port: 3300
        monograph_port:
          start: 8000
          end: 8009
      log_service:
        nodes:
          - host: 10.0.1.2
            port: 9000
            data_dir:
              - '/data/opt/log_data1'
              - '/data/opt/log_data2'
              - '/data/opt/log_data3'
        replica: 1
      tx_service:
        # tx service 安装节点，可以是多个，但不能重复
        host:
          - 10.0.1.1
      storage_service:
        cassandra:
          download_url: 'https://dlcdn.apache.org/cassandra/4.1.3/apache-cassandra-4.1.3-bin.tar.gz'
          storage_cluster: 'mono-cass-cluster'
          host:
            - 10.0.1.3
      monitor:
        data_dir: ''
        monograph_metrics:
          path: '/mono_metrics'
          port: 18081
        prometheus:
          download_url: 'https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz'
          port: 9500
          host: '10.0.1.3'
        grafana:
          download_url: 'https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz'
          port: 3301
          host: '10.0.1.3'
        node_exporter: 'https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz'
        node_exporter_port: 9200
        mysql_exporter: 'https://github.com/prometheus/mysqld_exporter/releases/download/v0.14.0/mysqld_exporter-0.14.0.linux-amd64.tar.gz'
        mysql_exporter_port: 9300
        cassandra_collector:
          mcac_agent: 'https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz'
          mcac_port: 9103
    ```

> **注意：**
> 上述的 deployment.yaml 文件是默认配置文件，用户可以按需配置需要安装的软件。对于某些不需要安装的软件，只需要将其从配置文件中删除即可。如果不需要监控，请将 yaml 文件中 monitor 选项全部删除。

- 启动集群

  ```shell
  cluster_mgr launch --topology-file ${PWD}/config/deployment.yaml
  ```

- 访问集群
  - 访问 MonographDB 数据库，默认情况下，`mysql`安装在`/data/opt/mono-poc/monograph-tx-service-release/install/`下，进入到该目录下，使用 socket 方式来连接数据库。更多连接方式请参考[客户端连接](./connect-to-monodb/connect-by-client.md)。
    ```shell
    cd /data/opt/mono-poc/monograph-tx-service-release/install/
    sudo ./bin/mysql -u root  -S /tmp/mysql3300.sock
    CREATE USER 'sysb'@'%' IDENTIFIED BY 'sysb';
    GRANT ALL PRIVILEGES ON * . * TO  'sysb'@'%';
    FLUSH PRIVILEGES;
    ```
  - 执行以下命令可以查看集群的状态：
    ```shell
    ./cluster_mgr status --cluster $CLUSTER_NAME
    ```

### 批量导入数据

#### mydumper

推荐使用 [mydumper](https://github.com/monographdb/mydumper) 导出/导入数据.

```shell
# for ubuntu20.04
wget https://www.monographdata.com/download/mydumper/mydumper_focal.tar.gz
# for ubuntu22.04
wget https://www.monographdata.com/download/mydumper/mydumper_jammy.tar.gz

tar -xzvf mydumper.tar.gz
cd mydumper

# edit your config
vim monograph.cnf

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:${PWD}/lib
./mydumper --defaults-file ./monograph.cnf --outputdir exported
./myloader --defaults-file ./monograph.cnf --directory exported
```

#### mono_load.py

你也可以使用脚本导入， `mono_load.py` 是 MonographDB 的数据批量加载工具，其运行依赖 python3 通过以下命令安装其运行时依赖

```bash
sudo apt install python3 -y
sudo apt install python3-pip -y
sudo pip3 install chardet
sudo pip3 install mysql-connector
```

请根据当前的安装环境将下列参数修改正确

```bash
python3 mono_load.py --help
python3 mono_load.py -h $MYSQL_HOST -U $MYSQL_USER \
   -P $MYSQL_PASSWORD -d $MYSQL_DB -w $WORKER_NUMBER -f $CSV_FILE
```

## 更多探索

- 如果你刚刚部署好一套 MonographDB 本地测试集群：
  - 学习 [MonographDB SQL 操作](./basic-sql-operations.md)
