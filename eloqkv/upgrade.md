---
title: Upgrade Using Eloqctl
description: Upgrade EloqKV clusters with eloqctl.
summary: Upgrade an existing EloqKV deployment with eloqctl.
---

# Upgrade an EloqKV Cluster Using Eloqctl

Use `eloqctl` to upgrade an EloqKV cluster to a newer version.

Note that this upgrade process is only compatible with minor version upgrades, where a binary swap is sufficient.

## Get Cluster Name

Cluster name is set in the configuration file when you provision the cluster. The default cluser name is `eloqkv-cluster`. You can also check the cluster name using command below.

```
eloqctl list
```

The expected output will be:

```
+----------------+---------+---------+---------+-------+
| name           | product | store   | version | user  |
+----------------+---------+---------+---------+-------+
| eloqkv-cluster | EloqKV  | rocksdb | 0.7.4   | rocky |
+----------------+---------+---------+---------+-------+
```

## Upgrade Cluster

Use Eloqctl to upgrade EloqKV for minor version change.

```
eloqctl update ${cluster_name} ${version}
```

The upgrade tool will firstly stop the cluster, then update all the binaries across the cluster and finally start the cluster with the new binaries.
