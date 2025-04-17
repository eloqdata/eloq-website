---
title: Failover Command
summary: Learn how to perform manual failover in an EloqKV cluster.
---

# Failover Command

The `eloqctl failover` command is used to initiate a manual failover process in an EloqKV cluster with hot standby configurations. This command allows you to promote a new leader node when the current leader is failing or needs maintenance.

## Syntax

```bash
eloqctl failover <cluster_name> --old-leader-host <host> --old-leader-port <port> --new-leader-host <host> --new-leader-port <port>
```

### Parameters:

- **`<cluster_name>`**:  
  The name of the EloqKV cluster for which the failover is being initiated.

- **`--old-leader-host`**:  
  The hostname or IP address of the current leader node that is failing.

- **`--old-leader-port`**:  
  The port number of the current leader node.

- **`--new-leader-host`**:  
  The hostname or IP address of the new leader node that will take over.

- **`--new-leader-port`**:  
  The port number of the new leader node.

## Example

To perform a failover from an old leader at `192.168.122.24` to a new leader at `192.168.122.25`, you would use the following command:

```sh
$ eloqctl failover eloqkv_with_hot_standby_and_voter --old-leader-host 192.168.122.24 --old-leader-port 6389 --new-leader-host 192.168.122.25 --new-leader-port 6389

=> host=_local,cmd=topology,task=pre-failover-topology
cluster nodes
Success; {"masters":[{"ip":"192.168.122.24","port":6389}],"replicas":[{"ip":"192.168.122.25","port":6389}]}
---------------------------

=> host=_local,cmd=failover,task=execute-failover
failover operation
Success; Successfully initiated failover from 192.168.122.24:6389 to 192.168.122.25:6389. Response: OK
---------------------------

=> host=_local,cmd=topology,task=post-failover-topology
cluster nodes
Success; {"masters":[{"ip":"192.168.122.25","port":6389}],"replicas":[{"ip":"192.168.122.24","port":6389}]}
---------------------------


```

<!-- TODO(ZX) add output screen shot -->
