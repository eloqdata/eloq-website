---
title: Deploy EloqKV Using Eloqctl
summary: Learn how to quickly get started with the EloqKV database.
---

# Deploy an EloqKV Cluster Using Eloqctl

Eloqctl is a cluster operation and maintenance tool for EloqKV.
By using Eloqctl, you can easily perform daily database operations, including deploying, starting, stopping, destroying and upgrading an EloqKV cluster, and manage EloqKV cluster parameters.

Eloqctl supports to deploy EloqKV tx cluster, EloqKV log cluster, persistent storage cluster like Cassandra and the monitoring system. This document introduces how to deploy EloqKV clusters of different topologies.

## Step 1. Prerequisites

EloqKV is compatible with Redhat 8/9 and Ubuntu 20.04/22.04/24.04

Make sure that you have read the following documents:

- [Prerequisite Document](./prerequisite)

## Step 2. Deploy Eloqctl on the control machine

1. Download Eloqctl install script for free:

- [Eloqctl Install Script](../download)

2. Install Eloqctl by running the following command:

```
bash install.sh
```

If the following message is displayed, you have successfully installed Eloqctl:

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

This command installs eloqctl in the `$HOME/.eloqctl` folder. The cluster meta data and downloaded components are also placed in this folder.

Please run `source $HOME/.bash_profile` to add `$HOME/.eloqctl` to the PATH environment variable, so you can use eloqctl directly.

After installation, you can check the version of eloqctl:

```
eloqctl --version
```

```
eloqctl 0.6.0
```

## Step 3. Initialize cluster topology file

Example cluster topology files are located at folder `.eloqctl/config/examples/`.

You can choose either `eloqkv_rocksdb.yaml` or `eloqkv_cassandra.yaml` to setup your EloqKV cluster. Please refer to [EloqKV Introduction](./introduction) for the difference between Rocksdb and Cassandra persistent storage engine. In the following, we will use RocksDB as an example to illustrate how to setup the cluster topology file.

```
# example yaml file
.eloqctl/config/examples/eloqkv_rocksdb.yaml
```

Run `vi eloqkv_rocksdb.yaml` to see the configuration file content:

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

Next we will provide detailed explanations for each configuration option available in the YAML file.

The `connection` section contains the configurations for connecting to EloqKV nodes from the control machine. If you have followed the [Prerequisite Document](./prerequisite), just keep the `connection` section unchanged.

The `deployment` section contains the configurations for deploying the cluster meta data and three components: transaction cluster, log cluster and persistent storage cluster.

- **`cluster_name`**:  
  _Type_: `String`  
  _Default_: `'eloqkv-cluster'`  
  The name of the cluster being deployed. This is an identifier for the cluster. You can deploy and manage multiple cluster using `eloqctl`.

- **`product`**:  
  _Type_: `String`  
  _Default_: `'EloqKV'`  
  The product name being deployed. This should remain as `'EloqKV'` for current deployment. In future, we will support different kinds of database products.

- **`version`**:  
  _Type_: `String`  
  _Default_: `'latest'`  
  Specifies the version of the EloqKV to be installed. The `'latest'` value ensures that the most recent version will be used.

- **`install_dir`**:  
  _Type_: `String`  
  _Default_: `'/home/${USER}'`  
  Directory where the product will be installed. The `${USER}` placeholder is dynamically replaced by the current user’s home directory.

- **`tx_service.host`**:  
  _Type_: `List of Strings`  
  _Default_: `[127.0.0.1]`  
  The list of IP addresses for the transaction service hosts. Transaction service is responsible for handling redis client request and is compaitble with Redis Protocol. One IP address can only appear once.

- **`tx_service.client_port`**:  
  _Type_: `Integer`  
  _Default_: `6389`  
  The port on which the transaction service listens. Redis clients connect to this port. All the transaction service hosts will use this same client_port.

- **`log_service.nodes`**:  
  _Type_: `Composite`
  Specify the log service hosts. You can set zero to many log service nodes. `Zero` means WAL log is coupled with transaction service. In this setting, you should remove `log_service` section entirely. For `non zero` value, log service is decoupled with transaction service. They are standalone process which can be deployed in a new cluster or share the same cluster with transaction service as your need.
- **`log_service.nodes.host`**:  
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address of each log service process runs at.

- **`log_service.nodes.port`**:  
  _Type_: `Integer`  
  _Default_: `9000`  
  The port of each log service process listens on.

- **`log_service.nodes.data_dir`**:  
  _Type_: `Strings`  
  _Default_: `['/home/${USER}/disk_wal_kv']`  
  The directory of each log service process appends WAL logs. You can specify a separate disk to log service to improve write throughtput.

- **`log_service.replica`**:  
  _Type_: `Integer`  
  _Default_: `1`  
  The number of replicas for the log service. A value of `1` means there is only one replica. For high availablility, set it to 3 or 5. Node that the node number of log service should be greater than replica number.

The `monitor` section contains the configurations for deploying prometheus and grafana based monitor for EloqKV. Monitor is optional. You should remove the `monitor` section if you don't want to have it. Otherwise, set the `prometheus.host` and `grafana.host` to speficy the location of prometheus and grafana, keep other fields unchanged. Note that we don't support to share prometheus and grafana with other software, you should make sure the port of prometheus and grafana is not listened by other processes.

- **`monitor.grafana.host`**:
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address of grafana service runs at.

- **`monitor.grafana.port`**:
  _Type_: `Integer`  
  _Default_: `'3301'`  
  The port of grafana service listens on.

- **`monitor.prometheus.host`**:
  _Type_: `String`  
  _Default_: `'127.0.0.1'`  
  The IP address of prometheus service runs at.

- **`monitor.prometheus.host`**:
  _Type_: `Integer`  
  _Default_: `'9500'`  
  The port of prometheus service listens on.

## Step 4. Run the deployment command

After you modified the `eloqkv_rocksdb.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_rocksdb.yaml
```

The command will installed the EloqKV componnets in the desired cluster.

If the following message is displayed, you have successfully provisioned an EloqKV cluster:

```
Launch cluster finished, Enjoy!
Connect to server:
	/home/rocky/eloqkv-cluster/EloqKV/bin/eloqkv-cli -h 127.0.0.1 -p 6389
Prometheus: http://127.0.0.1:9500
Grafana: http://127.0.0.1:3301
```

Feel free to use eloqkv-cli or other redis client to connect to EloqKV and have fun.
