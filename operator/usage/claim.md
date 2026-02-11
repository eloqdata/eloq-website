---
id: claim
title: EloqDBClusterClaim
---

# EloqDBClusterClaim

## Overview

`EloqDBClusterClaim` is the primary interface for users to request and manage database clusters. It acts as a request for a database where users define their desired database type (via a template) and provide S3 storage configurations for persistent **data and log state**. The Eloq Operator fulfills this request by either allocating an existing cluster or creating a new `EloqDBCluster` that matches the claim's specifications.

:::info
Throughout this documentation, we use `eloqdb-clusters` as the example namespace. Please replace it with your own namespace in actual usage.
:::

### Complete Example

Below is a typical `EloqDBClusterClaim` for an EloqDoc (MongoDB-compatible) cluster:

```yaml
apiVersion: eloqdbcluster.eloqdata.com/v1alpha1
kind: EloqDBClusterClaim
metadata:
  name: my-eloqdoc-cluster
  namespace: eloqdb-clusters
spec:
  # Desired operational state: Running or Idle
  state: Running
  # Reference to the administrative template
  templateRef:
    name: pool-eloqdoc-1c-8g
    namespace: eloqdb-clusters
  # Custom storage overrides for S3 data and log state
  overrides:
    txStore:
      storageType: eloqStore
      objectStorageType: s3
      eloqStore:
        # S3 path for persistent database data
        cloudStorePath: "eloqcloud-us-west-1/my-eloqdoc-cluster-store"
    logStore:
      storageType: rocksdbCloud
      objectStorageType: s3
      rocksdbCloud:
        # S3 path for persistent log state
        bucketName: eloqcloud-aws-us-west-1
        bucketPrefix: ""
        objectPath: "my-eloqdoc-cluster-log"
```

## Phase and Conditions

### Claim Phases

The `status.phase` indicates the high-level progression of the claim's lifecycle:

| Phase | Description |
| :--- | :--- |
| `Pending` | Waiting for the operator to process the claim. |
| `Binding` | The operator is allocating or creating an underlying cluster. |
| `Attaching` | The claim is bound, and the database processes are starting. |
| `Bound` | The claim is successfully linked to a ready `EloqDBCluster`. |
| `Releasing` | The claim is being deleted, and resources are being detached. |
| `Released` | The underlying cluster has been successfully released. |
| `Migrating` | The cluster is being moved between resource pools. |

### Status Conditions

Conditions provide detailed insights into specific aspects of the claim:

| Condition | Status | Description |
| :--- | :---: | :--- |
| `Valid` | `True` | The claim configuration and referenced template are valid. |
| `Bound` | `True` | The claim has been successfully paired with a cluster. |
| `Ready` | `True` | The database is fully started and accepting connections. |

## Usage Guide

### 1. Verify Status and Endpoints

Monitor the claim until it reaches the `Bound` phase and the `Ready` condition is `True`.

```bash
# Watch claim progress
kubectl get eloqdbclusterclaim my-eloqdoc-cluster -n eloqdb-clusters -w
```

### 2. Get Connection Endpoints

Once bound, connection details are populated in the status:

```bash
# Get service endpoints (Address and Availability)
kubectl get eloqdbclusterclaim my-eloqdoc-cluster -n eloqdb-clusters \
  -o jsonpath='{.status.serviceEndpoints}'
```

### 3. Retrieve Credentials

The operator automatically manages a Kubernetes Secret containing database credentials, referenced in `.status.dbUserSecretRef`.

```bash
# Get the secret name and extract credentials
SECRET_NAME=$(kubectl get eloqdbclusterclaim my-eloqdoc-cluster -n eloqdb-clusters -o jsonpath='{.status.dbUserSecretRef.name}')
export DB_USER=$(kubectl get secret $SECRET_NAME -n eloqdb-clusters -o jsonpath='{.data.username}' | base64 -d)
export DB_PASS=$(kubectl get secret $SECRET_NAME -n eloqdb-clusters -o jsonpath='{.data.password}' | base64 -d)

echo "Connect with: $DB_USER / $DB_PASS"
```

### 4. Manage Lifecycle

Users can toggle the operational state to optimize costs:

```bash
# Pause the cluster (Idle state)
kubectl patch eloqdbclusterclaim my-eloqdoc-cluster -n eloqdb-clusters \
  --type merge -p '{"spec":{"state":"Idle"}}'

# Resume the cluster (Running state)
kubectl patch eloqdbclusterclaim my-eloqdoc-cluster -n eloqdb-clusters \
  --type merge -p '{"spec":{"state":"Running"}}'
```

To permanently delete the cluster and its associated resources, delete the claim:
```bash
kubectl delete eloqdbclusterclaim my-eloqdoc-cluster -n eloqdb-clusters
```

## Detailed Field Reference

### Spec Fields

| Field | Type | Required | Default | Description |
| :--- | :--- | :---: | :---: | :--- |
| `state` | `string` | Yes | `Running` | Desired state: `Running` (Active) or `Idle` (Paused). |
| `templateRef` | `TemplateReference` | Yes | - | References an `EloqDBClusterTemplate` for base specs. |
| `overrides` | `OverrideSpec` | No | - | Claim-specific storage configuration overrides. |

#### TemplateReference

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `name` | `string` | Yes | Name of the template. |
| `namespace` | `string` | No | Namespace of the template (defaults to claim's namespace). |

#### OverrideSpec

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `txStore` | `StorageServiceSpec` | No | Overrides storage for the Transaction service. |
| `logStore` | `StorageServiceSpec` | No | Overrides storage for the Log service. |

### Status Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `phase` | `string` | Current operational phase of the claim. |
| `module` | `string` | Inferred protocol type: `eloqsql`, `eloqkv`, or `eloqdoc`. |
| `availableZone` | `string` | The availability zone where the cluster is deployed. |
| `clusterRef` | `ClusterReference` | Reference to the bound `EloqDBCluster`. |
| `dbUserSecretRef` | `SecretReference` | Reference to the Secret containing user credentials. |
| `serviceEndpoints` | `[]ServiceEndpoint` | List of connection addresses and health status. |
| `endpointAvailability`| `string` | Summary of available endpoints (e.g., "1/1"). |
| `adminCreated` | `boolean` | Whether the administrative user has been successfully created. |
| `conditions` | `[]Condition` | Detailed status conditions. |
| `observedGeneration` | `int64` | The most recent generation observed by the controller. |
