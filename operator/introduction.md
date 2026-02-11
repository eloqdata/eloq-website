---
id: introduction
title: Eloq Operator Introduction
---

# Eloq Operator Introduction

Eloq Operator is a Kubernetes operator that automates the deployment and management of EloqDB clusters (LogService and TxService) in a cloud-native manner. It follows the Kubernetes Operator pattern and uses Custom Resource Definitions (CRDs) to provide declarative cluster configuration and lifecycle management.

## Key Features

- **Multi-cloud support**: Native support for AWS EKS and GCP GKE (and other Kubernetes distributions).
- **Template-based Provisioning**: Reusable cluster configurations with flexible override support.
- **Full Lifecycle Management**: Handles bootstrapping, scaling, pausing (Idle), and resuming clusters.
- **Tiered Storage**: Optimized management for block storage, local instance store, and object storage.

## Core Architecture

Eloq Operator uses a three-tier resource model inspired by the Kubernetes PVC/PV/StorageClass pattern. This separation of concerns allows platform admins to manage infrastructure standards while giving users self-service database provisioning.

### Three-Tier Resource Model

```text
┌─────────────────────────────────────────────────────────────────────┐
│                        Resource Hierarchy                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────┐                                      │
│  │ EloqDBClusterTemplate    │  ← Platform Admin defines reusable   │
│  │ (like StorageClass)      │    configurations (compute, storage) │
│  └────────────┬─────────────┘                                      │
│               │                                                     │
│               │ references                                          │
│               ↓                                                     │
│  ┌──────────────────────────┐                                      │
│  │ EloqDBClusterClaim       │  ← User requests cluster with        │
│  │ (like PVC)               │    desired state (Running/Idle)      │
│  └────────────┬─────────────┘                                      │
│               │                                                     │
│               │ binds to                                            │
│               ↓                                                     │
│  ┌──────────────────────────┐                                      │
│  │ EloqDBCluster            │  ← Operator manages actual           │
│  │ (like PV)                │    infrastructure (Pods, Services)   │
│  └──────────────────────────┘                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

1.  **EloqDBClusterTemplate**: Defines reusable cluster configurations (compute resources, storage types, engine versions). Usually managed by platform administrators in a central namespace.
2.  **EloqDBClusterClaim**: The user-facing resource used to request a database cluster. Users specify a template and provide optional storage path overrides to ensures data isolation.
3.  **EloqDBCluster**: Represents the actual infrastructure deployment. It is managed automatically by the operator and contains the resolved configuration merged from the template and claim.

### Controller Interactions

The operator comprises multiple controllers working in harmony to reconcile the desired state:

```text
   User creates Claim                       ┌─────────────────────────┐
          │                                 │ EloqDBClusterTemplate   │
          │                                 │ Controller              │
          ↓                                 │                         │
┌─────────────────────────────┐             │ • Validates templates   │
│ EloqDBClusterClaim          │             │ • Prevents deletion if  │
│                             │             │   in use by claims      │
│ spec:                       │             └────────────┬────────────┘
│   state: Running            │                          │
│   templateRef:              │←─────────────────────────┘
│     name: pool-eloqkv-free  │           reads
└────────┬────────────────────┘
         │
         │ watches & reconciles
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│ EloqDBClusterClaimController                                        │
│                                                                     │
│ Phase: Pending                                                      │
│   → Resolve template + merge overrides                              │
│   → Generate unique cluster name                                    │
│   → Create EloqDBCluster resource                                   │
│   → Set bidirectional references (claim ↔ cluster)                  │
│                                                                     │
│ Phase: Binding → Attaching → Bound                                  │
│   → Wait for cluster to reach "Deployed" phase                      │
│   → If state=Running: ensure cluster is Attached                    │
│   → If state=Idle: detach cluster (scale down DB process)           │
└────────┬────────────────────────────────────────────────────────────┘
         │
         │ creates & manages
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│ EloqDBCluster                                                       │
│                                                                     │
│ status:                                                             │
│   phase: Deployed           ← Current lifecycle phase               │
│   conditions: [...]         ← Detailed status conditions            │
│   serviceEndpoints: [...]   ← Connection info                       │
└────────┬────────────────────────────────────────────────────────────┘
         │
         │ watches & reconciles
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│ EloqDBClusterController                                             │
│                                                                     │
│ Deployment Phases:                                                  │
│   Preparing → Initializing → Bootstrapping                          │
│   → DeployingLog → DeployingTx → Deployed                           │
│                                                                     │
│ Creates & manages:                                                  │
│   • ConfigMaps, Secrets, StatefulSets, Services, PVCs               │
└─────────────────────────────────────────────────────────────────────┘
```

## Design Principles

1.  **Separation of Concerns**: Infrastructure complexity is hidden in Templates, while Users focus on Claims.
2.  **Immutability**: Once an `EloqDBCluster` is created, its core spec is immutable to prevent risky configuration drifts.
3.  **Self-healing**: Controllers continuously monitor Pod health and Service endpoints to ensure high availability.
4.  **Data Isolation**: Claims force users to specify unique storage paths (bucket prefixes/paths) to prevent data overlap in shared object storage.

## Next Steps

- **Installation Guides**: [AWS](./install/aws), [GCP](./install/gcp), [Baidu Cloud](./install/baidu).
- **[EloqDBClusterTemplate](./usage/template)**: Learn how to create and manage cluster templates.
- **[EloqDBClusterClaim](./usage/claim)**: Learn how to request and manage database instances.
