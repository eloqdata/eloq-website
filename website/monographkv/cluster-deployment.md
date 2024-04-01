---
title: The guide for deploy a EloqKV Cluster
summary: Learn how to deploy and use the EloqKV cluster
---

# The guide for deploy a EloqKV Cluster

This document describes how to quickly deploy a EloqKV cluster on multiple Linux servers.

### Deployment prepare

Ensure the following requirements:

- Recommended hardware of compute node and storage node is 32+ physical CPU, 64GB+ memory. Hardware of log node
  is 4+ physical CPU, 16GB+ memory and 3 SSD disks. Log node can be deployed with compute node together.

- Recommended os version: Ubuntu 20.04. Supported version: Centos 7, Centos Steam 8.

- The Linux systems need to have access to the Internet, which is required to download EloqKV and its related dependencies.

- The node executing `cluster_mgr` can connect to all nodes in your cluster through SSH without entering password

For the EloqKV cluster topology, you can configure the required number of clusters on demand by changing the YAML file. In this deployment, the cluster topology is shown in the following table.

> **Note**
> The IP address of the following instances only serves as an example IP. In your actual deployment, you need to replace the IP with your actual IP. Don't use hostname like localhost, please use 127.0.0.1 instead.

| Instance        | Count | IP       |
| :-------------- | :---- | :------- |
| tx_service      | 1     | 10.0.1.1 |
| log_service     | 1     | 10.0.1.2 |
| storage_service | 1     | 10.0.1.3 |
| monitor         | 1     | 10.0.1.3 |

Environment Configuration:
Each of the multiple machines needs to complete the basic configuration of the system environment. For specific configuration steps, please refer to [Single Node Monograph Deployment Environment Configuration](../monographdb/quick-start)

### Deployment implementation

The `cluster_mgr` tool can realize the installation and deployment on multiple servers by modifying the parameters in deployment YAML files.

Create and start the cluster according to the following configuration template, edit the configuration file deployment_kv.yaml as you need:

```yaml
connection:
  username: 'centos'
  auth_type: 'keypair'
  auth:
    keypair: '/home/centos/.ssh/id_rsa'
deployment:
  product: 'EloqKV'
  version: 'latest'
  cluster_name: 'PlayKV'
  install_dir: '/home/centos/POC'
  port:
  tx_service:
    host:
      - 10.0.1.1
      - 10.0.1.2
      - 10.0.1.3
  storage_service:
    cassandra:
      download_url: 'https://archive.apache.org/dist/cassandra/4.1.0/apache-cassandra-4.1.0-bin.tar.gz'
      storage_cluster: 'PlayKV'
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

Launch cluster

```shell
cluster_mgr launch --topology-file ${CLUSTER_MGR_HOME}/config/deployment_kv.yaml
```
