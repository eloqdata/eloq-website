---
id: introduction
title: Eloq Operator Introduction
---

# Eloq Operator Introduction

Eloq Operator is a Kubernetes operator that automates the deployment and management of EloqKV and EloqDoc database clusters on Kubernetes. It follows the Kubernetes Operator pattern and uses Custom Resource Definitions (CRDs) to provide declarative cluster configuration.

## Getting Started

### Prerequisites

Before installing Eloq Operator, ensure you have:

- **Kubernetes cluster** (v1.28 or higher) on AWS EKS, Baidu Cloud CCE.
- **kubectl** (v1.28+) and **helm** (v3.0+)
- Cloud provider CLI for cloud-specific features

### Installation

**Step 1: Install Operator on Public Cloud Kubernetes**

Depending on your cloud platform:
- **AWS EKS**: [Install Eloq Operator on AWS EKS](./install-operator-aws)
- **Baidu Cloud CCE**: [Install Eloq Operator on Baidu Cloud CCE](./install-operator-baidu)

**Step 2: Deploy Database Clusters**

<!-- - [Deploy EloqDoc on AWS EKS](./deploy-eloqdoc) -->
<!-- - [Deploy EloqKV on AWS EKS](./deploy-eloqkv) -->

## Storage Types

Eloq Operator manages three types of storage for optimal performance and cost:

### Block Storage (Persistent Volumes)

**Purpose**: Raft consensus logs and metadata

- **Performance**: High IOPS, low latency
- **Durability**: Data persists across pod restarts
- **Providers**: AWS EBS, Baidu CDS
- **Use Case**: Transaction logs, critical metadata

**Example**:
```yaml
spec:
  dataStore:
    pvc:
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 500Mi
          limits:
            storage: 3Gi
        volumeMode: Filesystem
        # storageClassName: gp3  # AWS EBS gp3 type
```

### Local Storage (Instance Store)

**Purpose**: Hot data cache and high-performance operations

- **Performance**: Ultra-low latency with NVMe SSDs
- **Durability**: Ephemeral (data lost on pod restart)
- **Providers**: AWS i3/i4i instances, Baidu bcc.l5d instances
- **Use Case**: Active data cache, temporary computations

**Example**:
```yaml
spec:
  dataStore:
    ephemeral:
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 5Gi
          limits:
            storage: 10Gi
```

### Object Storage (S3-Compatible)

**Purpose**: Long-term data persistence and cold storage

- **Performance**: Optimized for throughput
- **Durability**: 99.999999999% (11 9's)
- **Providers**: AWS S3, Baidu BOS, any S3-compatible storage
- **Use Case**: SST files, transaction log archives, backups

**Example**:
```yaml
spec:
  storage:
    objectStorage:
      type: s3
      bucket: eloq-data-bucket
      region: us-west-2
```

### How Storage Tiers Work Together

```
Write: Client → Local SSD (cache) → Object Storage (persistent)
                    ↓
              Block Storage (metadata)

Read (Hot):  Client → Local SSD → Return
Read (Cold): Client → Local SSD (miss) → Object Storage → Cache → Return
```

**Benefits**:
- Hot data served from fast local SSDs
- Cold data automatically tiered to cost-effective object storage
- All data durably persisted in object storage
- Metadata and logs stored in reliable block storage

