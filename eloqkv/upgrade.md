---
title: Upgrade Using Eloqctl
description: Upgrade EloqKV clusters with eloqctl, including binary updates and Cassandra upgrade notes for existing deployments.
summary: Learn how to quickly get started with the EloqKV database.
---

# Upgrade an EloqKV Cluster Using Eloqctl

In this document, we will illustrate how to use `eloqctl` to upgrade EloqKV cluster to a newer version.

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

## Upgrade Cassandra

If you deploy EloqKV with Cassandra as perisistent storage engine, you can also use `eloqctl` to upgrade your cassandra cluster.

```
eloqctl update ${cluster_name} --cassandra ${version}
```

The upgrade tool will firstly stop the cluster with `-a` option, then upgrade Cassandra, move the data directory from old Cassandra cluster to new Cassandra cluster. Finally start the EloqKV cluster again.
