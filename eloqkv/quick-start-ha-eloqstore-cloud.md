---
title: Deploy High Available Cache Cluster (Compitable With Redis Master-Replica Mode)
summary: Deploy High Available Cache Cluster on Local Storage.
---

# Deploy a High Available Cache Cluster (Compitable With Redis Master-Replica Mode)

> **Note:** EloqKV on local-mode EloqStore will support using Eloqctl to install and manage soon. This document covers EloqKV on cloud-mode EloqStore.

[Previously](./quick-start), we covered how to deploy a single node EloqKV cluster using `eloqctl`. In this document, we will focus on deploying a highly available cache cluster on storage eloqstore. This deployment is compatible with Redis Master-Replica Mode

## 1. Prerequisites

Please ensure you've reviewed the following document:

- [Configuration Checklist](./prerequisite)

## 2. Deploy eloqctl on the control machine

1. Get your eloqctl installation script here:

- [Eloqctl Install Script](../downloadeloqctl)

2. To install eloqctl, simply run the following command:

```
bash eloqctl_installer.sh
```

If the following message is displayed, you have successfully installed `eloqctl`:

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16.6M  100 16.6M    0     0   203M      0 --:--:-- --:--:-- --:--:--  205M
/home/eloq/.bash_profile has been modified to add eloqctl to PATH
===============================================
To use it, open a new terminal or execute:
source /home/eloq/.bash_profile
===============================================
```

This command installs eloqctl in the $HOME/.eloqctl directory, where the cluster metadata and downloaded components are also stored.

Please run `source $HOME/.bash_profile` to add `$HOME/.eloqctl` to the PATH environment variable, so you can use `eloqctl` directly.

Once installed, you can verify the `eloqctl` version by running:

```
eloqctl --version
```

## 3. Initialize the cluster topology file

Example cluster topology files can be found in the `.eloqctl/config/examples/` directory.

To deploy a highly available cluster, use `eloqkv_eloqstore_cloud_standby_with_voter.yaml` as the default configuration template.

```
# example yaml file
.eloqctl/config/examples/eloqkv_eloqstore_cloud_standby_with_voter.yaml
```

To enable high availability, edit the `eloqkv_eloqstore_cloud_standby_with_voter.yaml` file. Setup primary, standby and voter nodes among different machines.

```
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"
deployment:
  cluster_name: "eloqkv_with_hot_standby_and_voter"
  product: "EloqKV"
  version: "latest"
  install_dir: "/home/${USER}"
  tx_service:
    tx_host_ports: [10.0.0.1:6379]
    standby_host_ports: [10.0.0.2:6379]
    voter_host_ports: [10.0.0.3:6379]
    enable_cache_replacement: on

  storage_service:
    eloqdss:
      backend: !eloqstore
        eloq_store_cloud_store_path: "eloqkv-cluster-singlenode"
        eloq_store_cloud_provider: "gcs"
        eloq_store_cloud_region: "xxxxxxxx"
        eloq_store_cloud_access_key: "xxxxxxxxx"
        eloq_store_cloud_secret_key: "xxxxxxxx"
        eloq_store_cloud_endpoint: "https://storage.googleapis.com"
        eloq_store_reuse_local_files: true
        eloq_store_prewarm_cloud_cache: true

  monitor:
    data_dir: ""
    eloq_metrics:
      path: "/eloq_metrics"
      port: 18081
    prometheus:
      download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 10.0.0.4
    grafana:
      download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 10.0.0.4
    node_exporter:
      url: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
```

For detailed explanations for each configuration option in the YAML file, please refer to the previous document [Deploy Single Node Instance](./quick-start). In this document, we will focus specifically on the high availability aspects of the configuration file.

- **`tx_service.tx_host_ports`**:  
  _Type_: `List of Strings`  
  List of primary nodes. Each primary node handles both read and write operations, continuously replicating new changes to the standby nodes. Each primary node is separated by `,`.

- **`tx_service.standby_host_ports`**:  
  _Type_: `List of Strings`  
  List of hot standby nodes. Each standby node handles read operations and automatically takes over as the primary node in case of a primary node failure. Use `|` to separate standby nodes for the same primary node and use `,` to separate standby nodes for different primary nodes. For example, `[10.0.0.2:6379| 10.0.0.3:6379, 10.0.0.4:6379| 10.0.0.5:6379]` means 2 standby nodes for the first primary node in tx_host_ports, and 2 standby nodes for the second primary node in tx_host_ports.

- **`tx_service.voter_host_ports`**:  
  _Type_: `Integer`  
  List of voter nodes. In the event of a primary node failure, voters participate in electing a new primary node. Voter nodes do not store any data and are not eligible for election as the primary node. You only need to deploy a voter node when the total number of nodes in cluster is less than 3.

- **`tx_service.enable_cache_replacement`**:  
  _Type_: `Boolean`  
   _Default_: `on`  
   If persisted cold data can be evicted out of memory cache. If set to false, all data will be cached in memory and new data insertion will fail if memory is full. Less data can be stored in this mode, but all requests is handled in memory. If set to false, cold data will be evicted out of memory so that new write request can succeed. More data can be stored in this mode but a cache miss request will result in a disk read.

- **`storage_service`**:  
  *(Please refer to the previous document [Deploy Single Node Instance](./quick-start))*

The following example demonstrates how to configure a distributed, highly available cluster. It features three primary nodes, each paired with a dedicated standby node. A single voter node is shared across the cluster to manage failover events. To implement this, modify your YAML configuration as shown below:

```
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"
deployment:
  cluster_name: "eloqkv_with_hot_standby_and_voter"
  product: "EloqKV"
  version: "latest"
  install_dir: "/home/${USER}"
  tx_service:
    tx_host_ports: [10.0.0.1:6379,10.0.0.2:6379,10.0.0.3:6379]
    standby_host_ports: [10.0.0.5:6379,10.0.0.6:6379,10.0.0.7:6379]
    voter_host_ports: [10.0.0.4:6379,10.0.0.4:6379,10.0.0.4:6379]
    enable_cache_replacement: on

  storage_service:
    eloqdss:
      backend: !eloqstore
        eloq_store_cloud_store_path: "eloqkv-cluster-singlenode"
        eloq_store_cloud_provider: "gcs"
        eloq_store_cloud_region: "xxxxxxxx"
        eloq_store_cloud_access_key: "xxxxxxxxx"
        eloq_store_cloud_secret_key: "xxxxxxxx"
        eloq_store_cloud_endpoint: "https://storage.googleapis.com"
        eloq_store_reuse_local_files: true
        eloq_store_prewarm_cloud_cache: true

  monitor:
    data_dir: ""
    eloq_metrics:
      path: "/eloq_metrics"
      port: 18081
    prometheus:
      download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 10.0.0.4
    grafana:
      download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 10.0.0.4
    node_exporter:
      url: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
```

## 4. Run the deployment command

After you modified the `eloqkv_eloqstore_cloud_standby_with_voter.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch -s ${HOME}/.eloqctl/config/examples/eloqkv_eloqstore_cloud_standby_with_voter.yaml
```

The command will installed the EloqKV componnets in the specified cluster.

If you see the following message, the EloqKV cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
```

Feel free to use `eloqkv-cli` or any other Redis client to connect to EloqKV and enjoy exploring its features.

## 5. Auto Failover

EloqKV can auto failover when primary node fails and the standby node will be elected as the new leader node to receive the write workload.

To make client transparent to primary failover, either deploy a proxy in front of EloqKV cluster or connect to EloqKV with a Redis Cluster SDK.

EloqKV Proxy is a high-performance proxy server written in Go, designed to manage multiple EloqKV clusters seamlessly. It allows clients to connect to different EloqKV clusters using tokens (passwords), enabling a multi-tenant environment. The proxy supports dynamic addition and removal of clusters via a RESTful web service, making it ideal for production environments where scalability and flexibility are essential.

Follow the document below to setup EloqKV Proxy.

- [Eloqctl Proxy](./eloqkv-proxy)
