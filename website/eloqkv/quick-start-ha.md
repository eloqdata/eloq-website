---
title: Deploy a High Available Cluster
summary: Learn how to quickly get started with the EloqKV database.
---

# Deploy a High Available Cluster Using Eloqctl

Eloqctl is a cluster operation and maintenance tool for EloqKV.
By using Eloqctl, you can easily perform daily database operations, including deploying, starting, stopping, destroying and upgrading an EloqKV cluster, and manage EloqKV cluster parameters.

In the previous document, we have learnt how to deploy EloqKV using `eloqctl`. In this document, we will focus on how to deploy a high available cluster.

## Step 1. Prerequisites

Please follow previous document [Deploy Single Node Cluster](./quick-start)

## Step 2. Deploy Eloqctl on the control machine

Please follow previous document [Deploy Single Node Cluster](./quick-start)

## Step 3. Initialize cluster topology file

Example cluster topology files are located at folder `.eloqctl/config/examples/`.

To deploy high available cluster, choose `eloqkv_cassandra.yaml` as default configuration template.

```
# example yaml file
.eloqctl/config/examples/eloqkv_cassandra.yaml
```

Edit `vi eloqkv_rocksdb.yaml` to enable high availability. It has two folds:

1. Log cluster is distributed and replicated.
2. Cassandra cluster is distibuted and replicated.

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
      host: 127.0.0.1
    grafana:
      download_url: "https://download.eloqdata.com/others/grafana-9.3.6.linux-amd64.tar.gz"
      port: 3301
      host: 127.0.0.1
    node_exporter:
      url: "https://download.eloqdata.com/others/node_exporter-1.5.0.linux-amd64.tar.gz"
      port: 9200
    cassandra_collector:
      mcac_agent: "https://download.eloqdata.com/others/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
      mcac_port: 9103
```

For detailed explanations for each configuration option available in the YAML file, please refer to previous document [Deploy Single Node Cluster](./quick-start). In this document, we will focus on the high availability part of configuration file.

- **`tx_service.host`**:  
  _Type_: `List of Strings`  
  _Value_: `[10.0.0.1, 10.0.0.2, 10.0.0.3]`
  Transaction cluster is deploy on three nodes: 10.0.0.1, 10.0.0.2, 10.0.0.3. Data are sharded among the three nodes, each node is responsible for a part of data. If one node fails, other nodes will take over the data belong to the failed node and continue to server the client request.

- **`log_service.nodes`**:  
  _Type_: `Composite`
  Here we specify three nodes for log service cluster. They are colocate with transaction cluster. You can also use other machines to deploy log service separately.

- **`log_service.replica`**:  
  _Type_: `Integer`  
  _Value_: `3`  
  Set the number of replicas for the log service to 3. This enusre each WAL log record will be replicated in three log nodes. The log will not be lost even if one node failure or disk crash.

- **`storage_service.cassandra.host`**:
  _Type_: `List of Strings`
  _Value_: `[10.0.0.4, 10.0.0.5, 10.0.0.6]`
  When deploy EloqKV with Cassandra as persistent storage engine. The compute and storage are fully decoupled. In this example, we deploy Cassandra in three other machines.

## Step 4. Run the deployment command

After you modified the `eloqkv_cassandra.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_cassandra.yaml
```

The command will installed the EloqKV componnets in the desired cluster.

If the following message is displayed, you have successfully provisioned an EloqKV cluster:

```
Launch cluster finished, Enjoy!
```

Feel free to use eloqkv-cli or other redis client to connect to EloqKV and have fun.
