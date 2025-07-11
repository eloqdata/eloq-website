---
title: Deploy Single Node Instance
summary: Learn how to quickly get started with the EloqSQL database.
---

# Deploy a Single Node EloqSQL Instance Using Eloqctl

`eloqctl` is a powerful tool designed for the operation and maintenance of EloqSQL clusters. With Eloqctl, you can effortlessly manage daily database tasks, such as deploying, starting, stopping, upgrading, and decommissioning EloqSQL clusters, as well as configuring cluster parameters.

`eloqctl` supports the deployment of various cluster types, including EloqSQL transactional clusters, EloqSQL log clusters, persistent storage clusters like Cassandra, and associated monitoring systems. This document provides guidance on deploying EloqSQL cluster on a single node.

## 1. Prerequisites

EloqSQL is compatible with Red Hat 9 and Ubuntu 20.04, 22.04, and 24.04.

Please ensure you've reviewed the following documents:

- [Configuration Checklist](/eloqkv/prerequisite)

## 2. Deploy eloqctl on the control machine

1. Get your eloqctl installation script here:

- [Eloqctl Install Script](/downloadeloqctl)

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

You can select `eloqsql_cassandra.yaml` to set up your EloqSQL cluster.

```
# example yaml file
.eloqctl/config/examples/eloqsql_cassandra.yaml
```

Open the configuration file by running `vi eloqsql_cassandra.yaml` to view its contents:

```
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"
deployment:
  cluster_name: "eloqsql-cluster"
  product: "EloqSQL"
  version: "latest"
  install_dir: "/home/${USER}"
  tx_service:
    tx_host_ports: [127.0.0.1:8000]
    client_port: 3316
  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - "/home/${USER}/eloqsql-cluster/wal_eloqsql"
    replica: 1
  storage_service:
    cassandra:
      host: [127.0.0.1]
      kind: !Internal
        mirror: "https://download.eloqdata.com"
        version: "4.1.3"
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
    mysql_exporter:
      url: "https://github.com/prometheus/mysqld_exporter/releases/download/v0.14.0/mysqld_exporter-0.14.0.linux-amd64.tar.gz"
      port: 9300
    cassandra_collector:
      mcac_agent: "https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
      mcac_port: 9103

```

Next, we'll provide detailed explanations for each configuration option available in the YAML file.

The `connection` section includes settings for connecting to EloqSQL nodes from the control machine. If you followed the steps in the [Prerequisite Document](/eloqkv/prerequisite), you can leave the connection section unchanged.

The `deployment` section covers the configurations for deploying cluster metadata as well as the three key components: the transaction cluster, log cluster, and persistent storage cluster.

- **`cluster_name`**:  
  _Type_: `String`  
  _Default_: `'eloqsql-cluster'`  
  The name of the cluster being deployed serves as an identifier for the cluster. With `eloqctl`, you can deploy and manage multiple clusters, each distinguished by its unique name.

- **`product`**:  
  _Type_: `String`  
  _Default_: `'EloqSQL'`  
  The product name being deployed should be set to `'EloqSQL'` for the current deployment. In the future, `eloqctl` will support the deployment of different database products like `EloqSQL` etc..

- **`version`**:  
  _Type_: `String`  
  _Default_: `'latest'`  
  Specifies the version of EloqSQL to be installed. Setting this to `'latest'` ensures that the most recent version is used.

- **`install_dir`**:  
  _Type_: `String`  
  _Default_: `'/home/${USER}'`  
  Specifies the directory where the product will be installed. The `${USER}` placeholder dynamically references the current user's home directory.

- **`tx_service.tx_host_ports`**:  
  _Type_: `List of Strings`  
  _Default_: `[127.0.0.1:6389]`  
  The list of IP:PORT addresses for the transaction service hosts. The transaction service handles Mysql client requests and is compatible with the Mysql Protocol. Note that each IP address can only be listed once.

- **`tx_service.client_port`**:  
  _Type_: `Integer`  
  _Default_: `3316`  
  The port that clients should use to connect to the transaction service. The transaction service listens on this port for incoming client connections, processing requests that conform to the Mysql Protocol.

<!-- Q? need this? -->

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

The `monitor` section contains configurations for deploying a Prometheus and Grafana-based monitoring system for EloqSQL. Monitoring is optional; if you do not wish to include it, simply remove the monitor section. If you choose to enable monitoring, set the prometheus.host and grafana.host fields to specify the locations of Prometheus and Grafana, and leave the other fields unchanged. Note that Prometheus and Grafana cannot be shared with other software, so you must ensure that the ports used by Prometheus and Grafana are not occupied by other processes.

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

After you modified the `eloqsql_cassandra.yaml`. Use the `eloqctl launch` command to provision an EloqSQL cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqsql_cassandra.yaml -s
```

The command will install the EloqSQL components in the specified cluster.

If you see the following message, the EloqSQL cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
Connect to server:
        LD_LIBRARY_PATH=/home/eloq/eloqsql-cluster/EloqSQL/lib:$LD_LIBRARY_PATH /home/eloq/eloqsql-cluster/EloqSQL/bin/mariadb --user=eloq -S /tmp/eloqsql3316.sock
Prometheus: http://127.0.0.1:9500
Grafana: http://127.0.0.1:3301
```

Feel free to use `/home/eloq/eloqsql-cluster/EloqSQL/bin/mariadb` or any other Mariadb/Mysql client to connect to EloqSQL and enjoy exploring its features.
