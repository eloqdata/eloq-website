---
title: Configure an EloqKV Cluster on AWS EKS
summary: How to configure EloqKV resources. 
---

## Configure an EloqKV Cluster on AWS EKS

This document introduces how to configure an EloqKV cluster for production deployment.

### Configure resource

To ensure that EloqDB can be properly scheduled and run by EKS, we strongly recommend that you configure the Pod's QoS (Guaranteed-level quality of service) and make the resource limit equal to the request. Also, because EloqDB uses a multi-core architecture to maximize performance, the EloqDB service should have at least 2 CPU units.

### Configure EloqKV

To deploy EloqDB, you need to declare the EloqDBCluster CR. refer to the following example for specificity:

```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: eloq-operator-test
  labels:
    app.kubernetes.io/name: EloqDBCluster
---
apiVersion: eloqdbcluster.eloqdata.com/v1alpha1
kind: EloqDBCluster
metadata:
  labels:
    app.kubernetes.io/name: eloqdbcluster
    app.kubernetes.io/part-of: eloq-operator
    app.kubernetes.io/created-by: eloq-operator
  name: my-eloqkv
  namespace: eloq-operator-test
spec:
  frontend:
    module: "eloqkv"
    port: 6379
  tx:
    serviceAccountName: your-service-account
    replica: 1
    resources:
      requests:
        memory: "6000Mi"
        cpu: "4"
      limits:
        memory: "6000Mi"
        cpu: "4"
    image: ${TX_SRV_IMAGE_URL}
    keySpaceName: eloq_meta_test
    dataStore:
      pvc:
        spec:
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 2Gi
            limits:
              storage: 2Gi
          volumeMode: Filesystem
  log:
    serviceAccountName: your-service-account
    logGroup: 1
    resources:
      requests:
        memory: "2000Mi"
        cpu: "2"
      limits:
        memory: "2000Mi"
        cpu: "2"
    rpcPort: 8080
    image: ${LOG_SRV_IMAGE_URL}
    crossZone: false
    schedulePolicy:
      policyType: required
      preferredZone: ap-northeast-1a
    rocksdbCloud:
      sstFileCacheSize: 4GB
      readyTimeout: 10
      fileDeletionDelay: 3600
      cloudObjectStorage:
        cloudStoreType: s3
        bucketName: my-logsrv
        bucketPrefix: eloqkv-skipwal-
        region: ap-northeast-1
    dataStore:
      pvc:
        spec:
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 50Gi
            limits:
              storage: 50Gi
          volumeMode: Filesystem
  store:
    storageType: cass
    properties:
      - name: monograph_cass_hosts
        value: your-cassandra-host
      - name: monograph_cass_port
        value: your-cassandra-port
      - name: monograph_cass_user
        value: your-cassandra-user
      - name: monograph_cass_password
        value: your-cassandra-password
```

### Cluster Name

The cluster name can be configured by changing **`metadata.name`** in the EloqDBCluster CR.

### Select a specific node for EloqDB's services

If you wish to run the database on a machine with a specific specification, you can modify it in the following way. The Following configuration snippet applies to both Tx and Log. Both: **`spec.tx.schedulePolicy` **and **`spec.log.schedulePolicy`**

```yaml
schedulePolicy:
   policyType: preferred
   preferredZone: your-aws-zone
   labelSelector:
      matchExpressions:
        - key: node.kubernetes.io/instance-type
          operator: "In"
          values:
            - t3.xlarge
```

### Modify Configuration

eloq-operator provides the default configuration for the database; if you wish to change the default configuration, modify the spec.frontend :

```yaml
frontend:
 config:
 items:
   - name: "skip_wal"
     value: "false"
```

If you configure items that are not recognized by the database, they are ignored.

### Restart/Shutdown/Start the cluster

You can set **`metadata.annotations`** if you need to restart all service sheets of the database. Also, if you modify the associated resource configuration, services will be restarted on a rolling basis.

> NOTE: Although `eloq-operator` does a rolling restart of the database, some of the database services are temporarily unavailable during the restart.

```yaml
metadata:
  annotations:
     eloqdata.com/cluster-action: shutdown | start | restart_tx | restart_log | restart_all
```