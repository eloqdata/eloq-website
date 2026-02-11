---
id: template
title: EloqDBClusterTemplate
---

# EloqDBClusterTemplate

## Overview

`EloqDBClusterTemplate` defines reusable configuration blueprints for database clusters. Administrators use templates to standardize performance tiers, storage backends, and deployment modes across different user protocols (EloqSQL, EloqKV, EloqDoc). A template encapsulates complex infrastructure requirements, including CPU/Memory resources, cloud-specific storage settings, and image versions, which users then reference in their `EloqDBClusterClaim`.

:::info
Throughout this documentation, we use `eloqdb-clusters` as the example namespace. Please replace it with your own namespace in actual usage.
:::

### Complete Example

Below is a template for an EloqDoc (MongoDB-compatible) cluster using AWS S3 for persistent **data and log state** storage:

```yaml
apiVersion: eloqdbcluster.eloqdata.com/v1alpha1
kind: EloqDBClusterTemplate
metadata:
  name: pool-eloqdoc-1c-8g
  namespace: eloqdb-clusters
spec:
  serviceAccountName: eloq-dbcluster-sa
  s3SecretName: eloqstore-credentials
  clusterDeployMode: txWithInternalLog
  tx:
    module:
      type: eloqdoc
      port: 27017
    replica: 1
    resources:
      requests:
        memory: "8Gi"
        cpu: "1"
    image: "eloqdata/eloqdoc-eloqstore-s3:0.3.0"
    ephemeralVolume:
      size: "90Gi"
    store:
      storageType: eloqStore
      objectStorageType: s3
      eloqStore:
        cloudStorePath: "eloqcloud-aws-us-west-1/eloqdoc-1c-8g-store"
        cloudRegion: "us-west-1"
  # Log Service Configuration
  log:
    persistentVolume:
      size: "10Gi"
      diskType: "gp3"
    store:
      storageType: rocksdbCloud
      objectStorageType: s3
      rocksdbCloud:
        bucketName: "eloqcloud-aws-us-west-1"
        objectPath: "eloqdoc-1c-8g-log"
```

## Phase and Conditions

### Template Phases

The `status.phase` indicates whether the template is validated and available for use:

| Phase | Description |
| :--- | :--- |
| `Ready` | The template configuration is valid and ready for cluster allocation. |
| `NotReady` | Validation failed (e.g., missing secrets or invalid resource specs). |

### Status Conditions

| Condition | Status | Description |
| :--- | :---: | :--- |
| `Ready` | `True` | All validation requirements (images, storage, resources) are met. |

## Detailed Field Reference

### Global Spec Fields

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `clusterDeployMode` | `string` | Yes | Deployment topology (e.g., `txWithInternalLog`). |
| `tx` | `TxServiceSpec` | Yes | Configuration for the Transaction engine. |
| `log` | `LogServiceSpec` | Yes | Configuration for the Log service. |
| `s3SecretName` | `string` | No | Secret containing `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. |
| `serviceAccountName`| `string` | No | Kubernetes ServiceAccount with cloud IAM permissions (EBS, S3). |

### TxServiceSpec (Transaction Engine)

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `module` | `ModuleSpec` | Yes | Defines protocol type (`eloqsql`, `eloqkv`, `eloqdoc`) and port. |
| `replica` | `int32` | Yes | Number of engine replicas (currently immutable). |
| `image` | `string` | Yes | Container image for the engine. |
| `resources` | `Resources` | No | CPU/Memory requirements. |
| `ephemeralVolume` | `Volume` | Yes | Performance storage (e.g., Local SSD) for transaction processing. |
| `store` | `StorageServiceSpec` | Yes | S3 configuration for persistent **database data** (EloqStore). |
| `transaction` | `TransactionConfig` | No | Fine-grained transaction policies (isolation, protocol). |
| `authentication` | `boolean` | Yes | Whether to enable database-level authentication. |
| `createAdmin` | `boolean` | Yes | Whether the operator should auto-create the admin user. |

### LogServiceSpec

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `persistentVolume` | `Volume` | Yes | Persistent storage (e.g., EBS) for the log service. |
| `logGroup` | `int32` | No | Number of Raft groups (default: 1). |
| `logReplica` | `int32` | No | Raft group replica count (default: 1). |
| `store` | `StorageServiceSpec` | Yes | S3 configuration for persistent **log state** (RocksDBCloud). |
| `crossZone` | `boolean` | No | Whether to enable cross-AZ deployment for high availability. |

### StorageServiceSpec

| Field | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `storageType` | `string` | Yes | - | Backends: `eloqStore` or `rocksdbCloud`. |
| `objectStorageType` | `string` | Yes | `s3` | Cloud provider: `s3` or `gcs`. |
| `rocksdbCloud` | `Config` | No | - | Configuration for RocksDBCloud (buckets, prefixes, cache). |
| `eloqStore` | `Config` | No | - | Configuration for EloqStore (paths, regions, limits). |

#### RocksDBCloudConfig (Log State)

| Field | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `bucketName` | `string` | - | Cloud bucket name. |
| `objectPath` | `string` | - | Object path (URI) under the bucket. |
| `region` | `string` | - | Cloud provider region (e.g., `us-west-1`). |
| `endpointUrl` | `string` | - | Custom S3-compatible endpoint URL (for Minio/self-hosted). |

#### EloqStoreConfig (Database Data)

| Field | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| `cloudStorePath` | `string` | - | Cloud store path (bucket/prefix). |
| `cloudRegion` | `string` | - | Cloud storage region. |
| `localSpaceLimit` | `string` | - | Local space limit for caching (e.g., `100GB`). |
| `dataAppendMode` | `bool` | `true` | Whether to use data append mode. |

### Status Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `phase` | `string` | Template phase. `Ready` indicates the configuration is validated and usable. |
| `observedGeneration`| `int64` | The most recent generation observed by the controller. |
| `conditions` | `[]Condition` | Standard status conditions. |

