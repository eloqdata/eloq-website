---
title: Deploy High Available Cache Cluster on Local Storage
summary: Deploy High Available Cache Cluster on Local Storage.
---

# Deploy a High Available Cache Cluster on Local Storage

[Previously](./quick-start), we covered how to deploy a single node EloqKV cluster using `eloqctl`. In this document, we will focus on deploying a highly available cache cluster on local storage (RocksDB).

## 1. Prerequisites

Please ensure you've reviewed the following document:

- [Configuration Checklist](./prerequisite)

## 2. Deploy Eloqctl on the control machine

For step-by-step guidance, please check out the previous document:

- [Deploy Single Node Cluster](./quick-start)

## 3. Enable Persistent Data Store for Durability

Template EloqKV configuration file `EloqKv.ini` can be found in the `.eloqctl/config/` directory.

To deploy a highly available cache cluster on local storage, you need to first enable persistent data dtore feature in `EloqKv.ini`.

```
# set it to `on` to turn on persistent storage
enable_data_store=on
```

## 4. Initialize the cluster topology file

Example cluster topology files can be found in the `.eloqctl/config/examples/` directory.

To deploy a highly available cluster, use `eloqkv_rocksdb_standby_with_voter.yaml` as the default configuration template.

```
# example yaml file
.eloqctl/config/examples/eloqkv_rocksdb_standby_with_voter.yaml
```

To enable high availability, edit the `eloqkv_rocksdb_standby_with_voter.yaml` file. Setup primary, standby and voter nodes among different machines.

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

  storage_service:
    rocksdb: Local
```

For detailed explanations for each configuration option in the YAML file, please refer to the previous document [Deploy Single Node Cluster](./quick-start). In this document, we will focus specifically on the high availability aspects of the configuration file.

- **`tx_service.tx_host_ports`**:  
  _Type_: `List of Strings`  
  List of primary nodes. Each primary node handles both read and write operations, continuously replicating new changes to the standby nodes.

- **`tx_service.standby_host_ports`**:  
  _Type_: `List of Strings`  
  List of hot standby nodes. Each standby node handles read operations and automatically takes over as the primary node in case of a primary node failure.

- **`tx_service.voter_host_ports`**:  
  _Type_: `Integer`  
  List of voter nodes. In the event of a primary node failure, voters participate in electing a new primary node. Voter nodes do not store any data and are not eligible for election as the primary node.

- **`storage_service.rocksdb`**:  
  _Type_: `String`  
  `Local` indicates that an embedded RocksDB engine is used for on-disk data storage.

## 5. Run the deployment command

After you modified the `eloqkv_rocksdb_standby_with_voter.yaml`. Use the `eloqctl launch` command to provision an EloqKV cluster

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_rocksdb_standby_with_voter.yaml
```

The command will installed the EloqKV componnets in the specified cluster.

If you see the following message, the EloqKV cluster has been successfully provisioned:

```
Launch cluster finished, Enjoy!
```

Feel free to use `eloqkv-cli` or any other Redis client to connect to EloqKV and enjoy exploring its features.
