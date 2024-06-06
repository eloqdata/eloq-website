---
title: Quick Start Guide for the EloqSQL
summary: Learn how to quickly get started with the EloqSQL database.
---

# Quick Start Guide for the EloqSQL Database

This guide introduces how to quickly get started with the EloqSQL database, and the steps to quickly deploy and use EloqSQL on `single node`:

### Deployment prepare

Prepare a deployment host and ensure its software meets the following requirements.

- Recommended hardware of compute node and storage node is 32+ physical CPU, 64GB+ memory. Hardware of log node is 4+ physical CPU, 16GB+ memory and 3 SSD disks. Log node can be deployed with compute node together.
- Recommended os version: Ubuntu 20.04. Supported os version: CentOS 7, CentOS Stream 8.
- The runtime environment needs to have access to the Internet.
- Regular users must have read, write, and execute permissions for the database package extraction path and installation path, and the installation path must be empty.

1. System configuration

Below are some necessary configurations to be made before installing EloqSQL

- Edit the system configuration file `/etc/security/limits.conf or /etc/security/limits.d/20-nproc.conf` using the following command
  ```shell
  sudo vi /etc/security/limits.conf
  ```
  Add the following resource limit parameters at the end of the corresponding file
  ```shell
  * soft nofile 524288
  * hard nofile 524288
  * hard core unlimited
  * soft core unlimited
  ```
- Use the following command to edit the configuration file `/etc/sysctl.conf`
  ```shell
  sudo vi /etc/sysctl.conf
  ```
  Add the following configuration parameters at the end of the corresponding file
  ```shell
  kernel.core_pattern=/var/crash/core-%e-%s-%u-%g-%p-%t
  ```
- Execute the following command to load the above parameter modification.
  ```shell
  sudo sysctl -p
  ```
- In order to display all limit resource information of the current system, modify the bash configuration file
  ```shell
  sudo vi ~/.bashrc
  ```
  Add at the end of the corresponding file
  ```
  ulimit -c unlimited
  ```
- Add current user and group ownership to `/var/crash` folder
  ```shell
  sudo chown -R $USER:$USER /var/crash
  ```
- login the session for the above changes to take effect, then log in again

  ```shell
  log out
  ```

- Ubuntu18.04 requires gcc11

  ```shell
  sudo apt update
  sudo apt install software-properties-common -y
  sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
  sudo apt update
  sudo apt install gcc-11 g++-11 -y
  ```

- Centos8 requires openssl10
  ```shell
  sudo dnf makecache --refresh
  sudo dnf -y install compat-openssl10
  ```

2.  Single Node Network Configuration
    `ssh` service configuration, users first need to install the corresponding `ssh` service on their own host, `ssh` service needs the support of `ssh` client and `ssh` server.

- Check whether the ssh and sshd clients have been installed
  ```shell
  which ssh
  which sshd
  ```
  If the above command has no output, it means that the corresponding service is not installed. The user needs to install the corresponding ssh service and enable the corresponding ssh service.
- install and enable ssh service on centos
  ```shell
  ## Install ssh client and server
  sudo yum –y install openssh-server openssh-clients
  ## Open ssh service
  sudo systemctl start sshd
  ## Open the ssh service and make the ssh service automatically start after the system restarts
  sudo systemctl enable sshd
  ```
- Install ssh service on ubuntu and start it
  ```shell
   ## Install ssh client and server
   sudo apt-get install openssh-server
   ## Open ssh service
   sudo service ssh start
  ```
- In order to enable each node to log in to other nodes through the public key, it needs to generate its own public key locally

  ```shell
  ssh-keygen
  ```

- add the public key `id_rsa.pub` to the authorized_keys. Please run on all the hosts.
  ```shell
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  ssh-keyscan -H 127.0.0.1 >> ~/.ssh/known_hosts
  ```
- Set permissions for the ssh directory
  ```shell
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
  ```

### Install Deployment Tool

Install command line tool `cluster_mgr`

```shell
curl --proto '=https' --tlsv1.2 -sSf https://www.eloqdata.com/download/mono-waiter/install.sh | sh
```

`cluster_mgr` will be installed under `$HOME/.eloqwaiter`

The `cluster_mgr` tool can realize the installation and deployment on multiple servers by modifying the parameters in deployment YAML files which are located at `$HOME/.eloqwaiter/config/examples/eloqsql_cassandra.yaml`

### Deployment EloqSQL Using Config File

- Modify the cluster configuration file.

  Edit the configuration file `.eloqwaiter/config/examples/eloqsql_cassandra.yaml` as your need.

  - Update 127.0.0.1 with node private ip: `sed -i 's/127.0.0.1/your_private_ip/g' .eloqwaiter/config/examples/eloqsql_cassandra.yaml`. Note that keeping 127.0.0.1 will block external access.
  - Update product version. For example use version 0.4.1: `version: "0.4.1"`.
  - Update install path `install_dir`. Set to the desired storage location for the user to install the cluster. This location must be the folder location with read and write permissions for the user specified by `username`.
  - `storage_service`: Configure the endpoint of kv store cluster.
  - `monitor`: Configure the prometheus and grafana.

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

- Launch cluster

  ```shell
  cluster_mgr launch .eloqwaiter/config/examples/eloqsql_cassandra.yaml
  ```

- Access the cluster

  - Access the EloqSQL database. By default, `mysql` is installed in `/home/$USER/opt/mono-poc/eloqdb-release/install/`, enter this directory, and use the socket method to connect to the database. For more connection methods, please refer to [Client Connection](./connect-to-monodb/connect-by-client.md).

    ```shell
    /home/centos/eloq/eloqsql-cluster/monograph-tx-service-release/install/bin/mariadb --user=centos -S /tmp/mysql3316.sock
    ```

  - Execute the following command to check the name of installed cluster:

    ```shell
    cluster_mgr list
    ```

  - Execute the following command to view the status of the cluster:
    ```shell
    cluster_mgr status $CLUSTER_NAME
    ```
