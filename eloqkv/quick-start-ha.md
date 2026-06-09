---
title: Deploy High Available Cluster on Shared Storage
description: Deploy a highly available EloqKV cluster with persistent storage, WAL, and shared storage using eloqctl.
summary: Learn how to quickly get started with the EloqKV database.
---

# Deploy a High Available Cluster Using Eloqctl

[Previously](./quick-start), we covered how to deploy a single node EloqKV cluster using `eloqctl`. In this document, we will focus on deploying a highly available cluster.

## 1. Prerequisites

Please ensure you've reviewed the following document:

- [Configuration Checklist](./prerequisite)

## 2. Deploy Eloqctl on the control machine

For step-by-step guidance, please check out the previous document:

- [Deploy Single Node Cluster](./quick-start)

## 3. Enable Persistent Data Store and WAL for Durability

Template EloqKV configuration file `EloqKv.ini` can be found in the `.eloqctl/config/` directory.

To deploy a highly available cluster, you need to first enable persistent data dtore and WAL feature in `EloqKv.ini`.

```
# set it to `on` to turn on persistent storage
enable_data_store=on
# set it to `on` to turn on WAL
enable_wal=on
```

## 4. Initialize the cluster topology file

Example cluster topology files can be found in the `.eloqctl/config/examples/` directory.

To deploy a highly available cluster, use `eloqkv_cassandra.yaml` as the default configuration template.

```
# example yaml file
.eloqctl/config/examples/eloqkv_cassandra.yaml
```

To enable high availability, edit the `eloqkv_cassandra.yaml` file. High availability is achieved through two key configurations:

1. The log cluster must be distributed and replicated.
2. The Cassandra cluster must be distributed and replicated.

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
    tx_host_ports: [10.0.0.1:6379, 10.0.0.2:6379, 10.0.0.3:6379]
  log_service:
    nodes:
      - host: 10.0.0.1
        port: 9000
        data_dir:
          - "/home/${USER}/eloqkv-cluster/wal_eloqkv"
      - host: 10.0.0.2
        port: 9000
        data_dir:
          - "/home/${USER}/eloqkv-cluster/wal_eloqkv"
      - host: 10.0.0.3
        port: 9000
        data_dir:
          - "/home/${USER}/eloqkv-cluster/wal_eloqkv"
    replica: 3
  storage_service:
    cassandra:
      host: [10.0.0.4, 10.0.0.5, 10.0.0.6]
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
      host: 10.0.0.7
    grafana:
      download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 10.0.0.7
    node_exporter:
      url: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
    cassandra_collector:
      mcac_agent: "https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
      mcac_port: 9103
```

For detailed explanations for each configuration option in the YAML file, please refer to the previous document [Deploy Single Node Cluster](./quick-start). In this document, we will focus specifically on the high availability aspects of the configuration file.

- **`tx_service.tx_host_ports`**:  
  _Type_: `List of Strings`  
  The transaction cluster is deployed across three nodes: 10.0.0.1:6379, 10.0.0.2:6379, and 10.0.0.3:6379. Data is sharded among these nodes, with each node responsible for a portion of the data. If one node fails, the remaining nodes will take over the data from the failed node and continue to serve client requests seamlessly.

- **`log_service.nodes`**:  
  _Type_: `Composite`  
  Here, we specify three nodes for the log service cluster, which are co-located with the transaction cluster. Alternatively, you can deploy the log service on separate machines if preferred.

- **`log_service.replica`**:  
  _Type_: `Integer`  
  Set the number of replicas for the log service to 3. This ensures that each WAL log record is replicated across three log nodes. With this setup, the logs will be preserved even in the event of a node failure or disk crash.

- **`storage_service.cassandra.host`**:  
  _Type_: `List of Strings`  
  When deploying EloqKV with Cassandra as the persistent storage engine, the compute and storage components are fully decoupled. In this example, Cassandra is deployed on three separate machines:
  10.0.0.4, 10.0.0.5, and 10.0.0.6.

- **`monitor`**  
  Prometheus and grafana are installed on a separate host at 10.0.0.7.

## 5. Run the deployment command

After you modified the `eloqkv_cassandra.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_cassandra.yaml -s
```

The command will installed the EloqKV componnets in the specified cluster.

If you see the following message, the EloqKV cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
```

Feel free to use `eloqkv-cli` or any other Redis client to connect to EloqKV and enjoy exploring its features.
