---
title: EloqSQL 快速入门指南
summary: 了解如何快速开始使用 EloqSQL 数据库。
---

# EloqSQL 数据库快速入门指南

本指南介绍如何快速开始使用 EloqSQL 数据库，以及在`单节点`上快速部署和使用 EloqSQL 的步骤：

### 部署准备

准备一个部署主机，并确保其软件满足以下要求。

- 推荐的计算节点和存储节点硬件配置为 32+ 物理 CPU，64GB+ 内存。日志节点硬件配置为 4+ 物理 CPU，16GB+ 内存和 3 块 SSD 磁盘。日志节点可以与计算节点一起部署。
- 推荐操作系统版本：Ubuntu 20.04。支持的操作系统版本：CentOS 7，CentOS Stream 8。
- 运行环境需要能够访问互联网。
- 普通用户必须对数据库包的解压路径和安装路径具有读、写和执行权限，且安装路径必须为空。

1. 系统配置

以下是安装 EloqSQL 之前需要进行的一些必要配置

- 使用以下命令编辑系统配置文件 `/etc/security/limits.conf 或 /etc/security/limits.d/20-nproc.conf`
  ```shell
  sudo vi /etc/security/limits.conf
  ```
  在相应文件末尾添加以下资源限制参数
  ```shell
  * soft nofile 524288
  * hard nofile 524288
  * hard core unlimited
  * soft core unlimited
  ```
- 使用以下命令编辑配置文件 `/etc/sysctl.conf`
  ```shell
  sudo vi /etc/sysctl.conf
  ```
  在相应文件末尾添加以下配置参数
  ```shell
  kernel.core_pattern=/var/crash/core-%e-%s-%u-%g-%p-%t
  ```
- 执行以下命令加载上述参数修改。
  ```shell
  sudo sysctl -p
  ```
- 为了显示当前系统的所有限制资源信息，修改 bash 配置文件
  ```shell
  sudo vi ~/.bashrc
  ```
  在相应文件末尾添加
  ```
  ulimit -c unlimited
  ```
- 添加当前用户和组对 `/var/crash` 文件夹的所有权
  ```shell
  sudo chown -R $USER:$USER /var/crash
  ```
- 登出会话以使上述更改生效，然后重新登录

  ```shell
  log out
  ```

- Ubuntu18.04 需要 gcc11

  ```shell
  sudo apt update
  sudo apt install software-properties-common -y
  sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
  sudo apt update
  sudo apt install gcc-11 g++-11 -y
  ```

- Centos8 需要 openssl10
  ```shell
  sudo dnf makecache --refresh
  sudo dnf -y install compat-openssl10
  ```

2. 单节点网络配置
   `ssh` 服务配置，用户首先需要在自己的主机上安装相应的 `ssh` 服务，`ssh` 服务需要 `ssh` 客户端和 `ssh` 服务器的支持。

- 检查是否已安装 ssh 和 sshd 客户端
  ```shell
  which ssh
  which sshd
  ```
  如果上述命令没有输出，表示未安装相应服务。用户需要安装相应的 ssh 服务并启用相应的 ssh 服务。
- 在 centos 上安装并启用 ssh 服务
  ```shell
  ## 安装 ssh 客户端和服务器
  sudo yum –y install openssh-server openssh-clients
  ## 开启 ssh 服务
  sudo systemctl start sshd
  ## 开启 ssh 服务并使系统重启后 ssh 服务自动启动
  sudo systemctl enable sshd
  ```
- 在 ubuntu 上安装 ssh 服务并启动
  ```shell
   ## 安装 ssh 客户端和服务器
   sudo apt-get install openssh-server
   ## 开启 ssh 服务
   sudo service ssh start
  ```
- 为了使每个节点能够通过公钥登录到其他节点，需要在本地生成自己的公钥

  ```shell
  ssh-keygen
  ```

- 将公钥 `id_rsa.pub` 添加到 authorized_keys 中。请在所有主机上运行。
  ```shell
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  ssh-keyscan -H 127.0.0.1 >> ~/.ssh/known_hosts
  ```
- 设置 ssh 目录的权限
  ```shell
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
  ```

### 安装部署工具

安装命令行工具 `cluster_mgr`

```shell
curl --proto '=https' --tlsv1.2 -sSf https://www.eloqdata.com/download/mono-waiter/install.sh | sh
```

`cluster_mgr` 将安装在 `$HOME/.eloqwaiter` 下

`cluster_mgr` 工具可以通过修改部署 YAML 文件中的参数来实现在多个服务器上的安装和部署，这些文件位于 `$HOME/.eloqwaiter/config/examples/eloqsql_cassandra.yaml`

### 使用配置文件部署 EloqSQL

- 修改集群配置文件。

  根据需要编辑配置文件 `.eloqwaiter/config/examples/eloqsql_cassandra.yaml`。

  - 用节点私有 IP 更新 127.0.0.1：`sed -i 's/127.0.0.1/your_private_ip/g' .eloqwaiter/config/examples/eloqsql_cassandra.yaml`。注意保持 127.0.0.1 将阻止外部访问。
  - 更新产品版本。例如使用版本 0.4.1：`version: "0.4.1"`。
  - 更新安装路径 `install_dir`。设置为用户希望安装集群的存储位置。此位置必须是由 `username` 指定的用户具有读写权限的文件夹位置。
  - `storage_service`：配置 kv 存储集群的端点。
  - `monitor`：配置 prometheus 和 grafana。

```
connection:
  username: "$USER"
  auth_type: "keypair"
  auth:
    keypair: "/home/$USER/.ssh/id_rsa"
deployment:
  cluster_name: "eloqsql-cluster"
  product: "EloqSQL"
  version: "latest"
  install_dir: "/home/$USER/eloq"
  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - "/home/$USER/eloq/disk_wal_sql"
    replica: 1
  tx_service:
    host: [127.0.0.1]
    port: 8000
    client_port: 3316
  storage_service:
    cassandra:
      host: [127.0.0.1]
      kind: !Internal
        download_url: "https://d143xau9fe26d8.cloudfront.net/others/apache-cassandra-4.1.3-bin.tar.gz"
        storage_cluster: "eloqsql-cluster"
  monitor:
    data_dir: ""
    monograph_metrics:
      path: "/mono_metrics"
      port: 18081
    prometheus:
      download_url: "https://d143xau9fe26d8.cloudfront.net/others/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: "https://d143xau9fe26d8.cloudfront.net/others/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: "https://d143xau9fe26d8.cloudfront.net/others/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
    mysql_exporter:
      url: "https://d143xau9fe26d8.cloudfront.net/others/mysqld_exporter-0.14.0.linux-amd64.tar.gz"
      port: 9300
    cassandra_collector:
      mcac_agent: "https://d143xau9fe26d8.cloudfront.net/others/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
      mcac_port: 9103
```

- 启动集群

  ```shell
  cluster_mgr launch .eloqwaiter/config/examples/eloqsql_cassandra.yaml
  ```

- 访问集群

  - 访问 EloqSQL 数据库。默认情况下，`mysql` 安装在 `/home/$USER/opt/mono-poc/eloqdb-release/install/` 中，进入此目录，并使用 socket 方法连接到数据库。有关更多连接方法，请参阅[客户端连接](./connect-to-monodb/connect-by-client.md)。

    ```shell
    /home/centos/eloq/eloqsql-cluster/monograph-tx-service-release/install/bin/mariadb --user=centos -S /tmp/mysql3316.sock
    ```

  - 执行以下命令查看已安装集群的名称：

    ```shell
    cluster_mgr list
    ```

  - 执行以下命令查看集群状态：
    ```shell
    cluster_mgr status $CLUSTER_NAME
    ```
