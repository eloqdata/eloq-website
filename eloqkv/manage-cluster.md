---
title: Manage Cluster Using Eloqctl
summary: Operate an existing EloqKV deployment with eloqctl.
---

# Manage Cluster Using Eloqctl

This page explains the commands you are most likely to use after the cluster has already been deployed.

`eloqctl` stores a saved topology for each launched cluster under:

```text
${ELOQCTL_HOME:-$HOME/.eloqctl}/clusters/<cluster>/topology.yaml
```

After deployment, most commands work by cluster name and do not require the original YAML file path.

## Inspect Clusters

List locally registered clusters:

```shell
eloqctl list
```

Check one cluster:

```shell
eloqctl status eloqkv-cluster --wait 60
```

Add `--detail` for more live-state information:

```shell
eloqctl status eloqkv-cluster --detail
```

## Connect to EloqKV

Print a ready-to-use client command:

```shell
CLIENT=$(eloqctl -q connect eloqkv-cluster)
eval "$CLIENT" ping
```

## Start and Stop

Start the whole cluster:

```shell
eloqctl start eloqkv-cluster
```

Start only specific nodes that already exist in the saved topology:

```shell
eloqctl start eloqkv-cluster --nodes 10.0.0.11:6379,10.0.0.12:6379
```

Gracefully stop the cluster:

```shell
eloqctl stop eloqkv-cluster
```

Force stop everything:

```shell
eloqctl stop eloqkv-cluster --all --force
```

Stop only specific nodes:

```shell
eloqctl stop eloqkv-cluster --nodes 10.0.0.11:6379 --force
```

Manage monitor components separately when monitor config is present:

```shell
eloqctl monitor status --cluster eloqkv-cluster
eloqctl monitor stop --cluster eloqkv-cluster
eloqctl monitor start --cluster eloqkv-cluster
```

If the cluster uses `requirepass`, add `--password <value>` to commands that need Redis access.

## Export the Saved Topology

Export the topology currently saved in local state:

```shell
eloqctl export eloqkv-cluster --output ./eloqkv-cluster.yaml
```

Use this when you want to review the saved topology or make declarative changes to an existing cluster.

## Update the Topology Declaratively

For supported topology and deployment changes, edit the YAML and use:

```shell
eloqctl plan ./eloqkv-cluster.yaml
eloqctl apply ./eloqkv-cluster.yaml
```

`plan` is read-only. `apply` executes the same plan after checking live cluster health.

## Update Runtime Config Fields

For supported EloqKV config fields, use `update-conf` instead of manually editing generated ini files.

Examples:

```shell
eloqctl update-conf eloqkv-cluster --fields checkpointer_interval:300
eloqctl update-conf eloqkv-cluster --fields checkpointer_interval:300 --restart
eloqctl update-conf eloqkv-cluster --fields checkpointer_interval:300 --tx-node-id 1
```

Use `update-conf` when you want to push a small set of field changes to generated node config. Use `plan` and `apply` when you want to change the topology YAML itself.

## Remove a Cluster

Stop the cluster first if it is still running:

```shell
eloqctl stop eloqkv-cluster --all --force
```

Then remove local metadata and perform best-effort remote cleanup:

```shell
eloqctl remove eloqkv-cluster --force
```
