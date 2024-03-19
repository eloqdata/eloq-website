---
title: The guide for deploy a EloqSQL Cluster
summary: Learn how to deploy and use the EloqSQL cluster
---

# The guide for deploy a EloqSQL Cluster

This document describes how to quickly deploy a EloqSQL cluster on multiple Linux servers.

### Deployment prepare

Ensure the following requirements:

- Recommended hardware of compute node and storage node is 32+ physical CPU, 64GB+ memory. Hardware of log node
  is 4+ physical CPU, 16GB+ memory and 3 SSD disks. Log node can be deployed with compute node together.

- Recommended os version: Ubuntu 20.04. Supported version: Centos 7, Centos Steam 8.

- The Linux systems need to have access to the Internet, which is required to download EloqSQL and its related dependencies.

For the EloqSQL cluster topology, you can configure the required number of clusters on demand by changing the YAML file. In this deployment, the cluster topology is shown in the following table.

> **Note**
> The IP address of the following instances only serves as an example IP. In your actual deployment, you need to replace the IP with your actual IP. Don't use hostname like localhost, please use 127.0.0.1 instead.

| Instance        | Count | IP       |
| :-------------- | :---- | :------- |
| tx_service      | 1     | 10.0.1.1 |
| log_service     | 1     | 10.0.1.2 |
| storage_service | 1     | 10.0.1.3 |
| monitor         | 1     | 10.0.1.3 |

1. Environment Configuration
   Each of the multiple machines needs to complete the basic configuration of the system environment. For specific configuration steps, please refer to [Single Node Eloq Deployment Environment Configuration](./quick-start.md)
2. Cluster network configuration
   It is necessary to ensure that each server can access other servers in the cluster through ssh. For specific configuration steps, please refer to [Single Node Eloq Deployment Network Configuration](./quick-start.md)

### Deployment implementation

The `Eloq_waiter` tool can realize the installation and deployment on multiple servers by modifying the parameters in deployment YAML files. For the details of `Eloq_waiter `, please refer to [Single Node Eloq Deployment Network Configuration](./quick-start.md)

- Create and start the cluster
  According to the following configuration template, edit the configuration file deployment.yaml as you need, where:

  - `product: "Redis"`: This can be set as Eloq or Redis
  - `username: "centos"`: The management of the cluster is done through the `centos` system user (the current system user name), port 22 is used to log in to the target machine via ssh
  - `auth_type`: The way of ssh login verification, the default is keypair
  - `keypair`: Set as the location of the ssh private key, note that this ssh key must have access to multiple servers
  - `host`: Set as the actual IP address of multiple servers
  - `install_image`: Can be set to the downloaded Eloq installation package locally or the download address of the remote EloqSQL
  - `install_dir`: Set to the desired storage location for the user to install the cluster. This location must be the folder location with read and write permissions for the user specified by `username`. If the installation directory does not exist, it needs to be manually created in advance.
  - `storage_service`: Configure the remote download URL `download_url` of the `Cassandra` database, the installation location `(host)`, if configured as `127.0.0.1`, it means that the installation is locally.
  - `monitor`: Configure the remote download URL, installation location and installation port of EloqSQL’s related monitoring software (prometheus, grafana).
    The configuration template is as follows:

    ```yaml
    connection:
    username: "centos"
    auth_type: "keypair"
    auth:
        keypair: "~/xx.pem"
    deployment:
    product: "Eloq"
    version: "0.3.3"
    cluster_name: "mono_cloud"
    install_dir: "/home/centos"
    port:
        mysql_port: 3300
        eloq_port:
        start: 8100
        end: 8200
    mono_service:
        host:
        - 10.0.1.1
        - 10.0.1.2
        - 10.0.1.3
        - 10.0.1.4
    storage_service:
        cassandra:
        download_url: "https://archive.apache.org/dist/cassandra/4.1.0/apache-cassandra-4.1.0-bin.tar.gz"
        storage_cluster: "mono-cass-cluster"
        host:
        - 10.0.1.1
        - 10.0.1.2
        - 10.0.1.3
        - 10.0.1.4
    monitor:
        data_dir: ""
        eloq_metrics:
        path: "/mono_metrics"
        port: 18081
        prometheus:
        download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
        port: 9090
        host: "10.0.1.1"
        grafana:
        download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
        port: 3300
        host: "10.0.1.1"
        node_exporter: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
        node_exporter_port: 9200
        mysql_exporter: "https://github.com/prometheus/mysqld_exporter/releases/download/v0.14.0/mysqld_exporter-0.14.0.linux-amd64.tar.gz"
        mysql_exporter_port: 9300
        cassandra_collector:
        mcac_agent: "https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
        mcac_port: 9103

    #    dynamodb:
    #      access_key_id: "",
    #      secret_key: ""
    #      region: "XXXX",
    #      endpoint: "";
    ```

> **Note:**
> The deployment.yaml file above is the default configuration file, and users can configure the software to be installed as needed. For some software that does not need to be installed, it only needs to be deleted from the configuration file.

- Launch cluster

  ```shell
  cluster_mgr launch --topology-file ${PWD}/config/deployment.yaml
  ```

## See also

- If you have just deployed a set of EloqSQL local test clusters:
  - Learn [EloqSQL SQL Operations](./basic-sql-operations.md)
  - [Migrate data to EloqSQL](./migration-overview.md)
