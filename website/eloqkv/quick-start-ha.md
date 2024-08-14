---
title: Deploy High Available Cluster
summary: Learn how to quickly get started with the EloqKV database.
---

# Deploy a High Available Cluster Using Eloqctl

[Previously](../quick-start), we covered how to deploy a single node EloqKV cluster using `eloqctl`. In this document, we will focus on deploying a highly available cluster.

## 1. Prerequisites

Please ensure you've reviewed the following document:

- [Configuration Checklist](./prerequisite)

## 2. Deploy Eloqctl on the control machine

For step-by-step guidance, please check out the previous document:

- [Deploy Single Node Cluster](./quick-start)

## 3. Initialize the cluster topology file

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
    host: [10.0.0.1, 10.0.0.2, 10.0.0.3]
    client_port: 6379
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
        mirror: "https://dlcdn.apache.org"
        version: "4.1.3"
  monitor:
    data_dir: ""
    monograph_metrics:
      path: "/mono_metrics"
      port: 18081
    prometheus:
      download_url: "https://download.eloqdata.com/others/prometheus-2.42.0.linux-amd64.tar.gz"
      port: 9500
      host: 10.0.0.7
    grafana:
      download_url: "https://download.eloqdata.com/others/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 10.0.0.7
    node_exporter:
      url: "https://download.eloqdata.com/others/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
    cassandra_collector:
      mcac_agent: "https://download.eloqdata.com/others/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
      mcac_port: 9103
```

For detailed explanations for each configuration option in the YAML file, please refer to the previous document [Deploy Single Node Cluster](./quick-start). In this document, we will focus specifically on the high availability aspects of the configuration file.

- **`tx_service.host`**:  
  _Type_: `List of Strings`  
  _Value_: `[10.0.0.1, 10.0.0.2, 10.0.0.3]`  
  The transaction cluster is deployed across three nodes: 10.0.0.1, 10.0.0.2, and 10.0.0.3. Data is sharded among these nodes, with each node responsible for a portion of the data. If one node fails, the remaining nodes will take over the data from the failed node and continue to serve client requests seamlessly.

- **`log_service.nodes`**:  
  _Type_: `Composite`  
  Here, we specify three nodes for the log service cluster, which are co-located with the transaction cluster. Alternatively, you can deploy the log service on separate machines if preferred.

- **`log_service.replica`**:  
  _Type_: `Integer`  
  _Value_: `3`  
  Set the number of replicas for the log service to 3. This ensures that each WAL log record is replicated across three log nodes. With this setup, the logs will be preserved even in the event of a node failure or disk crash.

- **`storage_service.cassandra.host`**:  
  _Type_: `List of Strings`  
  _Value_: `[10.0.0.4, 10.0.0.5, 10.0.0.6]`  
  When deploying EloqKV with Cassandra as the persistent storage engine, the compute and storage components are fully decoupled. In this example, Cassandra is deployed on three separate machines.

- **`monitor`**  
  Prometheus and grafana are installed on a separate host at 10.0.0.7.

## 4. Run the deployment command

After you modified the `eloqkv_cassandra.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_cassandra.yaml
```

The command will installed the EloqKV componnets in the specified cluster.

If you see the following message, the EloqKV cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
```

Feel free to use `eloqkv-cli` or any other Redis client to connect to EloqKV and enjoy exploring its features.
