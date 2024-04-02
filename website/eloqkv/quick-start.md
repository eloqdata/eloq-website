---
title: Quick Start Guide for the EloqKV
summary: Learn how to quickly get started with the EloqKV database.
---

# Quick Start Guide for the EloqKV Database

This guide introduces how to quickly get started with the EloqKV database, and the steps to quickly deploy and use EloqKV on `single node`:

### Deployment prepare

Prepare a deployment host and ensure its software meets the following requirements.

- Recommended hardware of compute node and storage node is 32+ physical CPU, 64GB+ memory. Hardware of log node is 4+ physical CPU, 16GB+ memory and 3 SSD disks. Log node can be deployed with compute node together.
- Recommended os version: Ubuntu 20.04. Supported os version: CentOS 7, CentOS Stream 8.
- The runtime environment needs to have access to the Internet.
- Regular users must have read, write, and execute permissions for the database package extraction path and installation path, and the installation path must be empty.
- sshd is running on this host and can be connected without entering password

### Deployment implementation

modify the cluster configuration file
According to the following configuration template, edit the configuration file config/deployment_kv.yaml as your need, where:

- `product: "EloqKV"`: This can be set as EloqKV or EloqKV
- `username: "monouser"`: Indicates that the `monouser` system user (the current system user name) is used for internal management of the cluster. By default, port 22 is used to log in to the target machine via ssh
- `auth_type`: ssh login verification method, the default is the keypair form
- `keypair`: set to the storage address of the ssh private key file configured through the network
- `host`: Set it to the IP of the deployment host, if it only needs to be installed on this machine, set it to 127.0.0.1. Please do not use `localhost`
- `tx_image`: Can be set to the downloaded Eloq installation package locally or the download address of the remote EloqKV
- `install_dir`: Set to the desired storage location for the user to install the cluster. This location must be the folder location with read and write permissions for the user specified by `username`. If the installation directory does not exist, it needs to be manually created in advance.
- `storage_service`: Configure the remote download URL `download_url` of the `Cassandra` database, the installation location `(host)`, if configured as `127.0.0.1`, it means that the installation is locally.
- `monitor`: Configure the remote download URL, installation location and installation port of EloqKV’s related monitoring software (prometheus, grafana).
  The configuration template is as follows:

```yaml
connection:
  username: 'monouser'
  auth_type: 'keypair'
  auth:
    keypair: '/home/monouser/.ssh/id_rsa'
deployment:
  cluster_name: 'eloqkv-cluster'
  product: 'EloqKV'
  version: 'latest'
  install_dir: '/home/monouser/eloq'
  port:
    cs_conn: 6389
  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - '/home/monouser/eloq/disk_kv'
    replica: 1
  tx_service:
    host:
      - 127.0.0.1
  storage_service:
    cassandra:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/apache-cassandra-4.1.3-bin.tar.gz'
      storage_cluster: 'eloqkv-cluster'
      host:
        - 127.0.0.1
  monitor:
    data_dir: ''
    monograph_metrics:
      path: '/mono_metrics'
      port: 18081
    prometheus:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/prometheus-2.42.0.linux-amd64.tar.gz'
      port: 9500
      host: '127.0.0.1'
    grafana:
      download_url: 'https://d143xau9fe26d8.cloudfront.net/others/grafana-9.3.6.linux-amd64.tar.gz'
      port: 3301
      host: '127.0.0.1'
    node_exporter: 'https://d143xau9fe26d8.cloudfront.net/others/node_exporter-1.5.0.linux-amd64.tar.gz'
    node_exporter_port: 9200
    mysql_exporter: 'https://d143xau9fe26d8.cloudfront.net/others/mysqld_exporter-0.14.0.linux-amd64.tar.gz'
    mysql_exporter_port: 9300
    cassandra_collector:
      mcac_agent: 'https://d143xau9fe26d8.cloudfront.net/others/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz'
      mcac_port: 9103
```

> **Note:**
> The above deployment_kv.yaml file is the default configuration file, and users can configure the software to be installed according to their needs. For some software that does not need to be installed, it only needs to be deleted from the configuration file.

For user who want to quickly customize topology config, these commands may be helpful to you:

```shell
sed -i "s/monouser/${USER}/g" ${CLUSTER_MGR_HOME}/config/deployment_kv.yaml
# check your ip address
ip -4 addr | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
sed -i "s|127.0.0.1|${YOUR_IP}|g" ${CLUSTER_MGR_HOME}/config/deployment_kv.yaml
```

Then, you can launch the cluster

```shell
cluster_mgr launch --topology-file ${CLUSTER_MGR_HOME}/config/deployment_kv.yaml
```
