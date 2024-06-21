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

  - `install_dir`: Set to the desired storage location for the user to install the cluster.
  - `log_service`: Configure log service nodes. You can deploy separate log server per disk.
  - `tx_service`: Configure tx service nodes.
  - `storage_service`: Configure the kv storage nodes. Currently we support Apapche Cassandra.
  - `monitor`: Configure the prometheus and grafana monitor stack.
    The configuration template is as follows:

```yaml
connection:
  username: '$USER'
  auth_type: 'keypair'
  auth:
    keypair: '/home/$USER/.ssh/id_rsa'
deployment:
  cluster_name: 'eloqsql-cluster'
  product: 'EloqSQL'
  version: 'latest'
  install_dir: '/home/$USER/eloq'
  log_service:
    nodes:
      - host: 10.0.1.2
        port: 9000
        data_dir:
          - '/data1/eloq/disk_wal_sql'
      - host: 10.0.1.2
        port: 9001
        data_dir:
          - '/data2/eloq/disk_wal_sql'
    replica: 1
  tx_service:
    host: [10.0.1.1]
    port: 8000
    client_port: 3316
  storage_service:
    cassandra:
      host: [10.0.1.3]
      kind: !Internal
        download_url: 'https://d143xau9fe26d8.cloudfront.net/others/apache-cassandra-4.1.3-bin.tar.gz'
        storage_cluster: 'eloqsql-cluster'
  monitor:
    data_dir: ''
    monograph_metrics:
      path: '/mono_metrics'
      port: 18081
    prometheus:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/prometheus-2.42.0.linux-amd64.tar.gz'
      port: 9500
      host: 10.0.1.3
    grafana:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/grafana-9.3.6.linux-amd64.tar.gz'
      port: 3301
      host: 10.0.1.3
    node_exporter:
      url: 'https://d143xau9fe26d8.cloudfront.net/others/node_exporter-1.5.0.linux-amd64.tar.gz'
      port: 9200
    mysql_exporter:
      url: 'https://d143xau9fe26d8.cloudfront.net/others/mysqld_exporter-0.14.0.linux-amd64.tar.gz'
      port: 9300
    cassandra_collector:
      mcac_agent: 'https://d143xau9fe26d8.cloudfront.net/others/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz'
      mcac_port: 9103
```

> **Note:**
> The deployment.yaml file above is the default configuration file, and users can configure the software to be installed as needed. For some software that does not need to be installed, it only needs to be deleted from the configuration file.

- Launch cluster

  ```shell
  cluster_mgr launch .eloqwaiter/config/examples/eloqsql_cassandra.yaml
  ```
