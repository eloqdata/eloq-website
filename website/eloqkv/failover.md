---
title: 故障转移命令
summary: 学习如何在 EloqKV 集群中执行手动故障转移。
---

# 故障转移命令

`eloqctl failover` 命令用于在具有热备份（hot standby）配置的 EloqKV 集群中启动手动故障转移流程。在当前主节点发生故障或需要维护时，此命令允许您将主节点转移到一个备份节点。

## 使用示例

```bash
eloqctl failover <cluster_name> --old-leader-host <host> --old-leader-port <port> --new-leader-host <host> --new-leader-port <port>
```

### 参数

- **`<cluster_name>`**：  
  执行故障转移的 EloqKV 集群名称。

- **`--old-leader-host`**：  
  当前主节点的主机名或 IP 地址。

- **`--old-leader-port`**：  
  当前主节点的端口号。

- **`--new-leader-host`**：  
  新主节点的主机名或 IP 地址。

- **`--new-leader-port`**：  
  新主节点的端口号。

## 示例

将主节点从 `192.168.122.24` 故障转移至新主节点 `192.168.122.25`，可使用以下命令：

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
