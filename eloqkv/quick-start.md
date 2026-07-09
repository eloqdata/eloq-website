---
title: Deploy Single Node Instance
description: Deploy a single-node EloqKV instance with eloqctl.
summary: Learn how to quickly get started with the EloqKV database.
---

# Deploy a Single Node EloqKV Instance Using Eloqctl

Use `eloqctl` to prepare the topology, deploy the node, and verify that the instance is running:

```shell
eloqctl check ./topology.yaml
eloqctl launch ./topology.yaml
eloqctl status <cluster-name> --wait 60
```

This page shows the simplest deployment: one EloqKV node on one machine.

## 1. Prerequisites

- The target machine should run Ubuntu 24.04 or newer.
- The control machine must be able to SSH to the target machine with the key configured in the YAML file.
- If you want to try the localhost demo, make sure `ssh localhost true` works for the current user.
- Review the platform checklist first:
  - [Configuration Checklist](./prerequisite)

Before running `eloqctl`, prepare the target machine with the setup steps in [Configuration Checklist](./prerequisite). That page covers user creation, SSH, `sudo`, limits, and other required host settings.

## 2. Install `eloqctl`

Install the latest `eloqctl` release on the control machine:

```shell
curl -fsSL https://raw.githubusercontent.com/eloqdata/eloqctl/main/install.sh | sh
source "${HOME}/.bash_profile"
eloqctl --version
```

`eloqctl` stores its local state under `${ELOQCTL_HOME:-$HOME/.eloqctl}` by default.

## 3. Create a Topology YAML

The installer places example topology files under:

```text
${ELOQCTL_HOME:-$HOME/.eloqctl}/config/examples/
```

For a local single-node trial, copy the localhost example and edit it:

```shell
cp "${ELOQCTL_HOME:-$HOME/.eloqctl}/config/examples/eloqctl_single_node_localhost.yaml" \
  ./eloqkv-local-demo.yaml
```

Use a topology like this:

```yaml
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    # Update this path if your SSH key is not id_rsa.
    keypair: "/home/${USER}/.ssh/id_rsa"

deployment:
  cluster_name: "eloqkv-local-demo"
  product: "EloqKV"
  version: "latest"
  install_dir: "${ELOQCTL_HOME}/demo/eloqkv-local-demo"
  enable_wal: false
  enable_io_uring: false
  enable_tls: false
  cluster_mode: false

  tx_service:
    tx_host_ports: [127.0.0.1:6389]

  log_service:
    nodes:
      - host: 127.0.0.1
        port: 9000
        data_dir:
          - "${ELOQCTL_HOME}/demo/eloqkv-local-demo/wal"
    replica: 1

  storage_service:
    rocksdb: !LOCAL

  hardware:
    127.0.0.1:
      cpu: 2
      memory: 2048
```

Important points:

- The examples in this document keep important deployment fields explicit instead of relying on omitted defaults.
- `deployment.cluster_mode` is required. For a single-node instance, set it to `false`.
- `deployment.enable_wal`, `deployment.enable_io_uring`, and `deployment.enable_tls` should be written explicitly in the YAML.
- `deployment.hardware` is required. Each host used by `tx_host_ports`, `standby_host_ports`, or `voter_host_ports` must have a `cpu` and `memory` entry.
- `hardware` is keyed by host, not by `host:port`. If you run multiple EloqKV processes on one machine, define that host once.
- `storage_service.rocksdb: !LOCAL` is the simplest persistent local-storage option for a first deployment.
- `log_service` is optional in general, but this example keeps a standalone single-node log service so the deployment shape is explicit and easy to inspect.

## 3.1 YAML Reference

For the complete field-by-field reference, see [Eloqctl Topology Reference](./topology-reference).

If you are deploying to a remote machine instead of localhost, replace:

- `127.0.0.1` with the remote host IP or hostname
- `install_dir` with a real path on the remote machine
- `connection.auth.keypair` with the private key path on the control machine

## 4. Validate and Launch

Run a local validation first:

```shell
eloqctl check ./eloqkv-local-demo.yaml
```

Then deploy and start the cluster:

```shell
eloqctl launch ./eloqkv-local-demo.yaml
```

Wait for the cluster to become healthy:

```shell
eloqctl status eloqkv-local-demo --wait 60
```

`launch` saves a launch-compatible copy of the topology under:

```text
${ELOQCTL_HOME:-$HOME/.eloqctl}/clusters/eloqkv-local-demo/topology.yaml
```

After launch, most commands use the cluster name and do not need the original YAML path.

## 5. Connect to EloqKV

Print a ready-to-use client command:

```shell
CLIENT=$(eloqctl -q connect eloqkv-local-demo)
eval "$CLIENT" ping
```

You can also inspect the live state at any time:

```shell
eloqctl status eloqkv-local-demo --detail
```

## 6. Clean Up

Stop and remove the demo cluster:

```shell
eloqctl stop eloqkv-local-demo --all --force
eloqctl remove eloqkv-local-demo --force
```

## Next Steps

- For the `RocksDB Cloud + MinIO` and `EloqStore Cloud + MinIO` HA topologies, continue with [Deploy High Availability Cluster with MinIO](./quick-start-ha-local-storage).
- For common operations after deployment, such as status, stop, export, and config updates, see [Manage Cluster Using Eloqctl](./manage-cluster).
