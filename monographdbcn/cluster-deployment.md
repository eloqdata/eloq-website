---
title: MonoGraphDB 数据库集群部署、使用指南
summary: 了解在多台服务器上快速部署、使用MonoGraphDB集群。
---

# MonographDB 数据库集群部署、使用指南
本文档描述了在多台服务器上快速部署、使用MonographDB集群的步骤。

## 在多机上安装部署数据库集群

- 适用场景：希望用多台服务器，体验MonographDB的完整拓扑的集群。

本节介绍如何配置MonographDB拓扑的YAML文件部署MonographDB集群。
### 部署准备
准备多台部署主机，确保其软件满足相关要求：
* 推荐安装Ubuntu2004版本
  
* 运行环境需要接入互联网访问，用于下载MonographDB及其相关依赖。
对于MonographDB集群拓扑，可以通过更改YAML文件按需配置所需要的集群数量，在本次测试中，集群拓扑如下表所示：
下表中拓扑实例的 IP 为示例IP IP。在实际部署时，请替换为实际的 IP。**注意:单机请使用127.0.0.1。不能使用localhost**

| 实例 | 个数 | IP |
|:-- | :-- | :-- |
|tx_service| 1 | 10.0.1.1|
|log_service| 1 | 10.0.1.2|
|storage_service| 1 | 10.0.1.3 |
|monitor| 1 | 10.0.1.3 |
1. 系统配置

下面是一些安装MonographDB之前所要进行的必要配置。
  + 使用下面的命令编辑系统配置文件`/etc/security/limits.d/20-nproc.conf`(centos) `/etc/security/limits.conf` (ubuntu)
    ```shell
    sudo vi /etc/security/limits.d/20-nproc.conf
    sudo vi /etc/security/limits.conf
    ```
    在相应的文件末尾添加如下的资源限制参数
    ```shell
    * soft nofile 524288
    * hard nofile 524288
    * hard core unlimited
    * soft core unlimited
    ```
 + 使用如下的命令编辑配置文件`/etc/sysctl.conf`
    ```shell
    sudo vi /etc/sysctl.conf
    ```
    在相应的文件末尾添加如下配置参数
    ```shell
    kernel.core_pattern=/var/crash/core-%e-%s-%u-%g-%p-%t
    ```
 + 执行如下的命令，载入上述的参数修改。
    ```shell
    sudo sysctl -p
    ```
 + 为了显示当前系统所有的limit资源信息，修改bash配置文件
    ```shell
    sudo vi ~/.bashrc
    ```
    在相应的文件末尾添加
    ```
    ulimit -c unlimited
    ```
 + 添加当前用户及组对于`/var/crash`文件夹的所有权
    ```shell
    sudo chown -R $USER:$USER /var/crash
    ```
 + 重新登陆会话，使得上述的更改生效,然后再次登陆
    ```shell
    logout
    ```
 + Ubuntu18.04需要额外安装gcc11
    ```shell
    sudo apt update
    sudo apt install software-properties-common -y
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
    sudo apt update
    sudo apt install gcc-11 g++-11 -y
    ```

2. 单节点网络配置
 `ssh`服务配置，用户首先需要在自己的系统上安装好相应的`ssh`服务，`ssh`服务需要有`ssh`客户端以及`ssh`服务端的支持。
 + 检查ssh、sshd客户端是否已经安装
    ```shell
    which ssh
    which sshd
    ```
    正常情况下，用户如果上述的命令没有输出，则说明相应的服务没有安装。用户需要安装相应的ssh服务并且进行相应ssh服务的开启

+  centos安装ssh服务并开启
    ```shell
    ## 安装ssh客户端与服务端
    sudo yum –y install openssh-server openssh-clients
    ## 开启ssh服务
    sudo systemctl start sshd
    ## 开启ssh服务并使得系统重启后自动启动ssh服务
    sudo systemctl enable sshd
    ```
+ ubuntu安装ssh服务并开启
    ```shell
    ##  安装ssh客户端与服务端
    sudo apt-get install openssh-server
    ## 开启ssh服务
    sudo service ssh start
    ```

+ 为了使得每个节点都可以通过公钥登陆到其他的节点，在本地需要生成自己的公钥
    > **注意：**
    > 注意此处使用的是ed25519加密签名算法，相比于普通的RSA签名算法，其更快、更安全，字节数更短。
    ```bash
    ssh-keygen -t ed25519 -f ~/.ssh/ed25519_mono
    ```

    运行上面的命令后会出现一系列提示，可以一路回车，其中有一个问题是，要不要对私钥设置口令（`passphrase`），如果担心私钥的安全，可以自行设置。
    运行结束后，会在$HOME/.ssh目录下生成两个文件，一个是私钥文件`id_ed25519`，一个是公钥文件`id_ed25519.pub`

+ 生成的公钥`id_ed25519.pub`添加到authorized_keys
    如果要将MonographDB服务安装在本地，则只需要运行下面的
    ```shell
    cat .ssh/ed25519_mono.pub >> .ssh/authorized_keys
    ```
    对于分布式环境，需要将ed25519_mono.pub内容写入所有节点的authorized_keys文件中
+ 给ssh目录设置权限
    ```shell
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    ```
3. 获取MonographDB安装包
请下载MonographDB的安装包,解压后包括下述文件
```
monographdb-tx-release-bin.tar.gz
monographdb-log-release-bin.tar.gz
waiter-cluster-mgr-ubuntu2004.tar.gz
```
Monograph Waiter是一个用于开发与管理MonographDB的工具包，其中包含`cluster_mgr`, 一个用于集群安装部署和管理的命令行工具，旨在让非Kubernetes环境下更容易安装和管理MonographDB集群。

### 实施部署

1. 部署MonographDB
+ 修改monographDB启动选项
编辑配置文件config/my_template.cnf，添加线程池相关参数，并根据机器配置进行调整CPU和内存参数。
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

+ 修改集群配置文件
  按下面的配置模板，编辑配置文件config/deployment.yaml，其中：
  
  * `username: "mono"`：表示通过 `mono`系统用户（当前系统用户名）来做集群的内部管理，默认使用 22 端口通过 ssh 登录目标机器
  * `auth_type`：ssh登陆验证的方式，默认为keypair形式
  * `keypair`: 设置为通过网络配置的ssh私钥文件存放地址
  * `host`：设置为本部署主机的IP，如果只需要安装在本机，则设置为127.0.0.1 **注意：不能使用localhost**
  * `tx_image`：MonographDB TxService安装包，支持本地地址以及远程地址。
  *  `log_image`:  MonographDB LogService安装包，支持本地地址以及远程地址。
  * `install_dir`：设置为用户安装集群的期望存放位置，此位置须为`username`所指定的用户所具有读写权限的文件夹位置，如果安装目录不存在，目前需要提前手工创建。
  * `storage_service`：配置`Cassandra`数据库的远程下载网址`download_url`，安装位置`(host)`，如果配置成`127.0.0.1`,表示安装在本地。
  * `monitor`：配置MonographDB的相关监控软件（prometheus、 grafana）的远程下载网址、安装位置以及安装端口。
  * `log_service`: data_dir 负责指定磁盘的位置 /data/opt/log_data1 /data/opt/log_data2 /data/opt/log_data3
  * `内网安装`: 无法连接外网下载Cassandra，可以提前下载上传，使用file:///home/file_path从本地安装Cassanra等组件。
    配置模板如下：
    
    ```yaml
    connection:
      username: "ubuntu"
      auth_type: "keypair"
      auth:
        keypair: "/home/ubuntu/.ssh/ed25519_mono"
      port: 22
    deployment:
      # monographdb 安装包路径 file:// 表示文件在本地。目前支持http 和 file 。
      tx_image: "file:///home/ubuntu/monographdb-tx-release-bin.tar.gz"
      log_image: "file:///home/ubuntu/monographdb-log-release-bin.tar.gz"
      cluster_name: "mono-poc"
      # monographdb 安装路径，当前用户对该目录需要具备读写权限 。
      # `sudo chown -R $USER:$USER /data/opt`
      install_dir: "/data/opt"
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
              - "/data/opt/log_data1"
              - "/data/opt/log_data2"
              - "/data/opt/log_data3"
        replica: 1    
      tx_service:
        # tx service 安装节点，可以是多个，但不能重复
        host:
          - 10.0.1.1
      storage_service:
        cassandra:
          download_url: "https://dlcdn.apache.org/cassandra/4.1.3/apache-cassandra-4.1.3-bin.tar.gz"
          storage_cluster: "mono-cass-cluster"
          host:
            - 10.0.1.3
      monitor:
        data_dir: ""
        monograph_metrics:
          path: "/mono_metrics"
          port: 18081
        prometheus:
          download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
          port: 9500
          host: "10.0.1.3"
        grafana:
          download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
          port: 3301
          host: "10.0.1.3"
        node_exporter: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
        node_exporter_port: 9200
        mysql_exporter: "https://github.com/prometheus/mysqld_exporter/releases/download/v0.14.0/mysqld_exporter-0.14.0.linux-amd64.tar.gz"
        mysql_exporter_port: 9300
        cassandra_collector:
          mcac_agent: "https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
          mcac_port: 9103
    ```



> **注意：**
> 上述的deployment.yaml文件是默认配置文件，用户可以按需配置需要安装的软件。对于某些不需要安装的软件，只需要将其从配置文件中删除即可。如果不需要监控，请将yaml文件中monitor选项全部删除。
+ 安装MonographDB所需的依赖文件
    ```shell
    ./cluster_mgr run-deps --topology-file ${PWD}/config/deployment.yaml
    ```
+ 执行MonographDB集群部署命令
    ```
    ./cluster_mgr deploy --topology-file ${PWD}/config/deployment.yaml
    ```
+ 执行MonographDB集群安装命令
    ```
    ./cluster_mgr install --cluster  $CLUSTER_NAME
    ```

    
> **注意：**
> 在安装MonographDB集群的过程中首先需要设置好JDK(JAVA Development Kit)的开发环境，并且设置好相应的JAVA_HOME与PATH,为了防止cassandra执行过程中出错

+ 启动MonographDB集群
    ```shell
    ./cluster_mgr start  --cluster  $CLUSTER_NAME
    ```

+ 访问集群
  - 访问 MonographDB 数据库，默认情况下，`mysql`安装在`/home/$USER/opt/mono-poc/monographdb-release/install/`下，进入到该目录下，使用socket方式来连接数据库。更多连接方式请参考[客户端连接](./connect-to-monodb/connect-by-client.md)。
    ```shell
    cd /home/$USER/opt/$CLUSTER_NAME/monographdb-release/install/
    sudo ./bin/mysql -u root  -S /tmp/mysql3300.sock
    ```
  - 执行以下命令可以查看集群的状态：
    ```shell
    ./cluster_mgr status -cluster $CLUSTER_NAME
    ```

### 批量导入数据

`mono_load.py` 是MonographDB的数据批量加载工具，其运行依赖 python3 通过一下命令安装其运行时依赖

```bash
sudo pip3 install chardet
sudo pip3 install mysql-connector
```

请根据当前的安装环境将下列参数修改正确

```bash
python3 monograph_load.py -h $MYSQL_HOST -U $MYSQL_USER \ 
   -P $MYSQL_PASSWORD -d $MYSQL_DB -w $WORKER_NUMBER -f $CSV_FILE
```



## 更多探索

- 如果你刚刚部署好一套 MonographDB 本地测试集群：
    - 学习 [MonographDB SQL 操作](./basic-sql-operations.md)

