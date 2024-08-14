---
title: Deploy Single Node Cluster
summary: Learn how to quickly get started with the EloqKV database.
---

# Deploy a Single Node EloqKV Cluster Using Eloqctl

`eloqctl` is a powerful tool designed for the operation and maintenance of EloqKV clusters. With Eloqctl, you can effortlessly manage daily database tasks, such as deploying, starting, stopping, upgrading, and decommissioning EloqKV clusters, as well as configuring cluster parameters.

`eloqctl` supports the deployment of various cluster types, including EloqKV transactional clusters, EloqKV log clusters, persistent storage clusters like Cassandra, and associated monitoring systems. This document provides guidance on deploying EloqKV cluster on a single node.

## 1. Prerequisites

EloqKV is compatible with Red Hat 8/9 and Ubuntu 20.04, 22.04, and 24.04.

Please ensure you've reviewed the following documents:

- [Configuration Checklist](./prerequisite)

## 2. Deploy eloqctl on the control machine

1. Get your eloqctl installation script here:

- [Eloqctl Install Script](../downloadeloqctl)

2. To install eloqctl, simply run the following command:

```
bash install.sh
```

If the following message is displayed, you have successfully installed `eloqctl`:

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16.6M  100 16.6M    0     0   203M      0 --:--:-- --:--:-- --:--:--  205M
/home/ubuntu/.bash_profile has been modified to add eloqctl to PATH
===============================================
To use it, open a new terminal or execute:
source /home/ubuntu/.bash_profile
===============================================
```

This command installs eloqctl in the $HOME/.eloqctl directory, where the cluster metadata and downloaded components are also stored.

Please run `source $HOME/.bash_profile` to add `$HOME/.eloqctl` to the PATH environment variable, so you can use `eloqctl` directly.

Once installed, you can verify the `eloqctl` version by running:

```
eloqctl --version
```

Result:

```
eloqctl 0.6.0
```

## 3. Initialize the cluster topology file

Example cluster topology files can be found in the `.eloqctl/config/examples/` directory.

You can select either `eloqkv_rocksdb.yaml` or `eloqkv_cassandra.yaml` to set up your EloqKV cluster. For a detailed comparison between the RocksDB and Cassandra storage engines, please refer to the [EloqKV Introduction](./introduction). In the following example, we will demonstrate how to set up the cluster topology file using RocksDB.

```
# example yaml file
.eloqctl/config/examples/eloqkv_rocksdb.yaml
```

Open the configuration file by running `vi eloqkv_rocksdb.yaml` to view its contents:

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
  tx_service:
    host: [127.0.0.1]
    client_port: 6389
  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - "/home/${USER}/eloqkv-cluster/wal_eloqkv"
    replica: 1
  storage_service:
    rocksdb: Local
  monitor:
    data_dir: ""
    monograph_metrics:
      path: "/mono_metrics"
      port: 18081
    prometheus:
      download_url: "https://download.eloqdata.com/others/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 127.0.0.1
    grafana:
      download_url: "https://download.eloqdata.com/others/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: "https://download.eloqdata.com/others/node_exporter-1.5.0.linux-amd64.tar.gz"
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

- **`tx_service.host`**:  
  _Type_: `List of Strings`  
  _Default_: `[127.0.0.1]`  
  The list of IP addresses for the transaction service hosts. The transaction service handles Redis client requests and is compatible with the Redis Protocol. Note that each IP address can only be listed once.

- **`tx_service.client_port`**:  
  _Type_: `Integer`  
  _Default_: `6389`  
  Specifies the port on which the transaction service listens. Redis clients connect to this port, and all transaction service hosts will use the same `client_port`.

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

## 4. Run the deployment command

After you modified the `eloqkv_rocksdb.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_rocksdb.yaml
```

The command will install the EloqKV components in the specified cluster.

If you see the following message, the EloqKV cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
Connect to server:
	/home/rocky/eloqkv-cluster/EloqKV/bin/eloqkv-cli -h 127.0.0.1 -p 6389
Prometheus: http://127.0.0.1:9500
Grafana: http://127.0.0.1:3301
```

Feel free to use `eloqkv-cli` or any other Redis client to connect to EloqKV and enjoy exploring its features.
