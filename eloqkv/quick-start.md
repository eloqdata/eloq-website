---
title: Deploy Single Node Instance
summary: Learn how to quickly get started with the EloqKV database.
---

# Deploy a Single Node EloqKV Instance Using Eloqctl

`eloqctl` is a powerful tool designed for the operation and maintenance of EloqKV clusters. With Eloqctl, you can effortlessly manage daily database tasks, such as deploying, starting, stopping, upgrading, and decommissioning EloqKV clusters, as well as configuring cluster parameters.

`eloqctl` supports the deployment of various cluster types, including EloqKV transactional clusters, EloqKV log clusters, persistent storage clusters like EloqStore, and associated monitoring systems. This document provides guidance on deploying EloqKV cluster on a single node.

## 1. Prerequisites

EloqKV requires Ubuntu 24.04+.

Please ensure you've reviewed the following documents:

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

You can select either `eloqkv_eloqstore_local.yaml` or `eloqkv_eloqstore_cloud.yaml` to set up your EloqKV cluster. In the following example, we will demonstrate how to set up the cluster topology file using EloqStore.

1. Yaml file example for EloqStore local storage:

```
# example yaml file
.eloqctl/config/examples/eloqkv_eloqstore_local.yaml
```

Open the configuration file by running `vi eloqkv_eloqstore_local.yaml` to view its contents:

```
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"
deployment:
  cluster_name: "eloqkv-cluster"
  product: "EloqKV"
  version: "latest"
  install_dir: "/home/${USER}"
  # If you want to write wal log in your cluster, uncomment enable_wal
  # enable_wal: true
  # If you want to use io_uring, uncomment enable_io_uring
  # enable_io_uring: true
  tx_service:
    tx_host_ports: [127.0.0.1:6389]
    enable_cache_replacement: on
  # If you want to deplay the logservice with standalone mode, uncomment log_service section
  #log_service:
  #  nodes:
  #    - host: 127.0.0.1
  #      port: 9000
  #      data_dir:
  #        - "/home/${USER}/eloqkv-cluster-singlenode-local/wal_eloqkv"
  #  replica: 1
  storage_service:
    eloqdss:
      backend: !eloqstore
  # We recommend deploying monitoring-related services to a separate machine.
  monitor:
    data_dir: ""
    eloq_metrics:
      path: "/eloq_metrics"
      port: 18081
    prometheus:
      download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
```

Next, we'll provide detailed explanations for each configuration option available in the YAML file.

The `connection` section includes settings for connecting to EloqKV nodes from the control machine. If you followed the steps in the [Prerequisite Document](./prerequisite), you can leave the connection section unchanged.

The `deployment` section covers the configurations for deploying cluster metadata as well as the three key components: the transaction cluster, log cluster, and persistent storage cluster.

- **`cluster_name`**:  
  _Type_: `String`  
  _Default_: `'eloqkv-cluster'`  
  The name of the cluster being deployed serves as an identifier for the cluster. With `eloqctl`, you can deploy and manage multiple clusters, each distinguished by its unique name.

- **`product`**:  
  _Type_: `String`  
  _Default_: `'EloqKV'`  
  The product name being deployed should be set to `'EloqKV'` for the current deployment. In the future, `eloqctl` will support the deployment of different database products like `EloqSQL` etc..

- **`version`**:  
  _Type_: `String`  
  _Default_: `'latest'`  
  Specifies the version of EloqKV to be installed. Setting this to `'latest'` ensures that the most recent version is used.

- **`install_dir`**:  
  _Type_: `String`  
  _Default_: `'/home/${USER}'`  
  Specifies the directory where the product will be installed. The `${USER}` placeholder dynamically references the current user's home directory.

- **`enable_wal`**:  
  _Type_: `Boolean`  
  _Default_: `false`  
  If write wal log in your cluster.

- **`enable_io_uring`**:  
  _Type_: `Boolean`  
  _Default_: `false`  
  If use io_uring as the IO engine.

- **`tx_service.tx_host_ports`**:  
  _Type_: `List of Strings`  
  _Default_: `[127.0.0.1:6389]`  
  The list of IP:PORT addresses for the transaction service hosts. The transaction service handles Redis client requests and is compatible with the Redis Protocol. Note that each IP address can only be listed once.

- **`tx_service.enable_cache_replacement`**:  
  _Type_: `Boolean`  
  _Default_: `on`  
  If persisted cold data can be evicted out of memory cache. If set to false, all data will be cached in memory and new data insertion will fail if memory is full. Less data can be stored in this mode, but all requests is handled in memory. If set to false, cold data will be evicted out of memory so that new write request can succeed. More data can be stored in this mode but a cache miss request will result in a disk read.

- **`log_service.nodes`**:  
  _Type_: `Composite`  
  Specify the log service hosts. You can configure anywhere from zero to multiple log service nodes. Setting this to zero indicates that the Write-Ahead Log (WAL) is coupled with the transaction service, in which case you should remove the log_service section entirely. If you specify a non-zero value, the log service is decoupled from the transaction service, running as a standalone process. This can be deployed in a separate cluster or within the same cluster as the transaction service, depending on your requirements.

- **`log_service.nodes.host`**:  
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address where each log service process is running.

- **`log_service.nodes.port`**:  
  _Type_: `Integer`  
  _Default_: `9000`  
  The port on which each log service process listens.

- **`log_service.nodes.data_dir`**:  
  _Type_: `Strings`  
  _Default_: `['/home/${USER}/disk_wal_kv']`  
  The directory where each log service process stores its WAL logs. You can specify a separate disk for the log service to improve write throughput.

- **`log_service.replica`**:  
  _Type_: `Integer`  
  _Default_: `1`  
  The number of replicas for the log service. A value of 1 means there is only one replica. For high availability, set this to 3 or 5. Note that the number of log service nodes should be greater than the number of replicas.

The `monitor` section contains configurations for deploying a Prometheus and Grafana-based monitoring system for EloqKV. Monitoring is optional; if you do not wish to include it, simply remove the monitor section. If you choose to enable monitoring, set the prometheus.host and grafana.host fields to specify the locations of Prometheus and Grafana, and leave the other fields unchanged. Note that Prometheus and Grafana cannot be shared with other software, so you must ensure that the ports used by Prometheus and Grafana are not occupied by other processes.

**NOTE:** We recommend deploying monitoring-related services to a separate machine.

- **`monitor.grafana.host`**:  
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address where grafana service is running.

- **`monitor.grafana.port`**:  
  _Type_: `Integer`  
  _Default_: `'3301'`  
  The port on which grafana service listens.

- **`monitor.prometheus.host`**:  
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address where prometheus service is running.

- **`monitor.prometheus.host`**:  
  _Type_: `Integer`  
  _Default_: `'9500'`  
  The port on which prometheus service listens.

2. Yaml file example for EloqStore cloud storage:

```
# example yaml file
.eloqctl/config/examples/eloqkv_eloqstore_cloud.yaml
```

Open the configuration file by running `vi eloqkv_eloqstore_cloud.yaml` to view its contents:

```
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"
deployment:
  cluster_name: "eloqkv-cluster-singlenode-cloud"
  product: "EloqKV"
  version: "latest"
  install_dir: "/home/${USER}"
  # If you want to write wal log in your cluster, uncomment enable_wal
  # enable_wal: true
  # If you want to use io_uring, uncomment enable_io_uring
  # enable_io_uring: true
  # If use the gcs as the cloud provider, the following two environment variables need to be set.
  # environment_variables:
  #  GOOGLE_CLOUD_PROJECT: "xxxxxxxx"
  #  GOOGLE_APPLICATION_CREDENTIALS: "/path/to/service-account-key.json"
  tx_service:
    tx_host_ports: [127.0.0.1:6389]
    enable_cache_replacement: on
  # If you want to deplay the logservice with standalone mode, uncomment log_service section
  #log_service:
  #  nodes:
  #    - host: 127.0.0.1
  #      port: 9000
  #      data_dir:
  #        - "/home/${USER}/eloqkv-cluster-singlenode-cloud/wal_eloqkv"
  #  replica: 1
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
  # We recommend deploying monitoring-related services to a separate machine.
  monitor:
    data_dir: ""
    eloq_metrics:
      path: "/eloq_metrics"
      port: 18081
    prometheus:
      download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
```

When deploying an EloqKV cluster, compared to EloqStore local mode, using EloqStore cloud mode requires configuring cloud-related settings(in the `storage_service` section). These are described below:

- **`eloq_store_cloud_store_path`**:  
  _Type_: `String`  
  _Default_: `None`  
  Cloud store path (using local mode if empty).

- **`eloq_store_cloud_provider`**:  
  _Type_: `String`  
  _Default_: `aws`  
  Cloud provider implementation(e.g., "aws", "minio", "gcs").

- **`eloq_store_cloud_region`**:  
  _Type_: `String`  
  _Default_: `None`  
  Cloud region/zone identifier.

- **`eloq_store_cloud_access_key`**:  
  _Type_: `String`  
  _Default_: `None`  
  Access key for cloud storage.

- **`eloq_store_cloud_secret_key`**:  
  _Type_: `String`  
  _Default_: `None`  
  Secret key for cloud storage.

- **`eloq_store_cloud_endpoint`**:  
  _Type_: `String`  
  _Default_: `None`  
  The cloud endpoint URL.

- **`eloq_store_reuse_local_files`**:  
  _Type_: `Boolean`  
  _Default_: `false`  
  Download recent files from cloud into local cache during startup.

- **`eloq_store_prewarm_cloud_cache`**:  
  _Type_: `Boolean`  
  _Default_: `false`  
  Reuse files already present in the local cache directory when the server starts.

**NOTE:** If use the gcs as the cloud provider, should set the environment variables on the machine that the EloqKV server deployed on.

- **`GOOGLE_CLOUD_PROJECT`**  
  _Type_: `String`  
  _Default_: `None`  
  Google cloud project id.

- **`GOOGLE_APPLICATION_CREDENTIALS`**  
  _Type_: `String`  
  _Default_: `None`  
  Google application credentials.

## 4. Run the deployment command

After you modified the `eloqkv_eloqstore_local.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_eloqstore_local.yaml -s
```

The command will install the EloqKV components in the specified cluster.

If you see the following message, the EloqKV cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
Connect to server:
	/home/eloq/eloqkv-cluster/EloqKV/bin/eloqkv-cli -h 127.0.0.1 -p 6389
Prometheus: http://127.0.0.1:9500
Grafana: http://127.0.0.1:3301
```

Feel free to use `eloqkv-cli` or any other Redis client to connect to EloqKV and enjoy exploring its features.
