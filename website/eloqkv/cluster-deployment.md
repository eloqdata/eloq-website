---
title: The guide for deploy a EloqKV Cluster
summary: Learn how to deploy and use the EloqKV cluster
---

# The guide for deploy a EloqKV Cluster

This document describes how to quickly deploy a EloqKV cluster on multiple Linux servers.

### Deployment prepare

Ensure the following requirements:

- Recommended hardware of compute node and storage node is 4+ physical CPU, 32GB+ memory. Hardware of log node
  is 4+ physical CPU, 16GB+ memory and 3 SSD disks. Log node can be deployed with compute node together.

- Recommended os version: Ubuntu 20.04. Supported version: Centos 7, Centos Steam 8.

- The Linux systems need to have access to the Internet, which is required to download EloqKV and its related dependencies.

- The node executing `cluster_mgr` can connect to all nodes in your cluster through SSH without entering password

### Install Deployment Tool

Install command line tool `cluster_mgr`

```shell
curl --proto '=https' --tlsv1.2 -sSf https://www.eloqdata.com/download/mono-waiter/install.sh | sh
```

`cluster_mgr` will be installed under `$HOME/.eloqwaiter`

The `cluster_mgr` tool can realize the installation and deployment on multiple servers by modifying the parameters in deployment YAML files which are located at `$HOME/.eloqwaiter/config/deployment_kv.yaml`

EloqKV can be deployed in two ways: `Decoupled` or `Coupled` .

### Decoupled Deployment

| Instance        | Count | IP       |
| :-------------- | :---- | :------- |
| tx_service      | 1     | 10.0.1.1 |
| log_service     | 1     | 10.0.1.2 |
| storage_service | 1     | 10.0.1.3 |
| monitor         | 1     | 10.0.1.3 |

Create and start the cluster according to the following configuration template, edit the configuration file `deployment_kv.yaml` as you need:

- `product`: set as EloqKV
- `username`: default is current user who run `cluster_mgr`
- `auth_type`: ssh login verification method, the default is the keypair form
- `keypair`: set to the storage address of the ssh private key file configured through the network
- `install_dir`: Set to the desired storage location for the user to install the cluster. This location must be the folder location with read and write permissions for the user specified by `username`.

```yaml
connection:
  username: '${USER}'
  auth_type: 'keypair'
  auth:
    keypair: '/home/${USER}/.ssh/id_rsa'
deployment:
  product: 'EloqKV'
  version: 'latest'
  cluster_name: 'eloqkv-cluster'
  install_dir: '/home/${USER}/eloq'
  port:
    cs_conn: 6389
  log_service:
    nodes:
      - host: 10.0.1.2
        port: 9000
        data_dir:
          - '/home/${USER}/eloq/disk_kv'
    replica: 1
  tx_service:
    host:
      - 10.0.1.1
  storage_service:
    cassandra:
      download_url: 'https://archive.apache.org/dist/cassandra/4.1.0/apache-cassandra-4.1.0-bin.tar.gz'
      storage_cluster: 'eloqkv-cluster'
      host:
        - 10.0.1.3
  monitor:
    data_dir: ''
    eloq_metrics:
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

### Coupled Deployment

| Instance        | Count | IP       |
| :-------------- | :---- | :------- |
| tx_service      | 3     | 10.0.1.1 |
| log_service     | 3     | 10.0.1.2 |
| storage_service | 3     | 10.0.1.3 |
| monitor         | 1     | 10.0.1.3 |

Create and start the cluster according to the following configuration template, edit the configuration file `deployment_kv.yaml` as you need:

```yaml
connection:
  username: '${USER}'
  auth_type: 'keypair'
  auth:
    keypair: '/home/${USER}/.ssh/id_rsa'
deployment:
  product: 'EloqKV'
  version: 'latest'
  cluster_name: 'eloqkv-cluster'
  install_dir: '/home/${USER}/eloq'
  port:
    cs_conn: 6389
  log_service:
    nodes:
      - host: 10.0.1.1
        port: 9000
        data_dir:
          - '/home/${USER}/eloq/disk_kv'
      - host: 10.0.1.2
        port: 9000
        data_dir:
          - '/home/${USER}/eloq/disk_kv'
      - host: 10.0.1.3
        port: 9000
        data_dir:
          - '/home/${USER}/eloq/disk_kv'
    replica: 1
  tx_service:
    host:
      - 10.0.1.1
      - 10.0.1.2
      - 10.0.1.3
  storage_service:
    cassandra:
      download_url: 'https://archive.apache.org/dist/cassandra/4.1.0/apache-cassandra-4.1.0-bin.tar.gz'
      storage_cluster: 'eloqkv-cluster'
      host:
        - 10.0.1.1
        - 10.0.1.2
        - 10.0.1.3
  monitor:
    data_dir: ''
    eloq_metrics:
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

### Launch Cluster

```shell
cluster_mgr launch --topology-file ${CLUSTER_MGR_HOME}/config/deployment_kv.yaml
```

### Stop Cluster

```shell
# stop EloqKV servers
cluster_mgr stop --cluster eloqkv-cluster --all true
# stop monitor process
cluster_mgr monitor --cluster eloqkv-cluster --command stop
```

### Advanced Features

#### Enable Persistence Feature

Edit `/home/${USER}/eloq/eloqkv-cluster/redis.ini` to enable persisitent kv store of EloqKV

```shell
[local]
skip_kv=false
```

Note that enable persisitent kv will consume CPU resource to flush records in memory to kv store periodically. As a result, reduce core_num in `redis.ini` when enable persisitent kv.
We recommand you to allocate 50% cpu to tx_service if coupled deployment is adopted.

#### Enable WAL Feature

Edit `redis.ini` to enable WAL of EloqKV

```shell
[local]
skip_wal=false
```

#### Upload Modification

To let your config modification take effect, you can upload config files and restart servers in one command.

```shell
cluster_mgr update-conf --cluster eloqkv-cluster --restart true
```
