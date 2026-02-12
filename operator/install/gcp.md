---
id: gcp
title: Install Eloq Operator on Google Cloud GKE
---

# Install Eloq Operator on Google Cloud GKE

This guide walks you through installing the Eloq Operator on Google Kubernetes Engine (GKE).

## Prerequisites

Before you begin, ensure you have:

- `kubectl` installed (v1.28 or later)
- `helm` installed (v3.0 or later)
- Google Cloud CLI (`gcloud`) installed and authenticated
- A Google Cloud project with billing enabled
- Permissions to create GKE clusters, IAM Service Accounts, and Cloud Storage buckets

## Step 1: Create GKE Cluster

Create a GKE cluster with Ubuntu nodes and local SSDs for optimal performance.

### 1.1 Enable Required APIs

```bash
gcloud services enable \
    container.googleapis.com \
    compute.googleapis.com \
    storage.googleapis.com \
    iam.googleapis.com
```

### 1.2 Create GKE Cluster

We recommend using nodes with Local SSDs (e.g., `z3-highmem-8-highlssd`) for EloqKV and EloqDoc.

```bash
# Configuration
CLUSTER_NAME="eloqdb-demo"
REGION="us-west1"
ZONE="us-west1-a"
PROJECT_ID=$(gcloud config get-value project)

# Create the cluster with Workload Identity enabled
gcloud container clusters create ${CLUSTER_NAME} \
    --zone ${ZONE} \
    --num-nodes 3 \
    --image-type UBUNTU_CONTAINERD \
    --machine-type z3-highmem-8-highlssd \
    --workload-pool "${PROJECT_ID}.svc.id.goog"
```

### 1.3 Configure Node Setup Script (Optional)

If your nodes have multiple local SSDs or you need specific XFS quota settings, you can use a DaemonSet or a startup script. For standard GKE Ubuntu nodes, local SSDs are available at `/dev/nvme0n1`, `/dev/nvme0n2`, etc.

Refer to the [AWS EKS Guide](./aws.md#14-create-cluster-configuration-file) for a robust XFS formatting script that can be adapted for GKE nodes.

---

## Step 2: Install OpenEBS (LVM LocalPV)

We use OpenEBS to manage local NVMe storage on the nodes.

```bash
helm repo add openebs https://openebs.github.io/charts
helm repo update

helm install openebs --namespace openebs openebs/openebs \
  --create-namespace \
  --set lvm-localpv.enabled=true
```

---

## Step 3: Set up Google Cloud IAM (Workload Identity)

Workload Identity is the recommended way to grant Kubernetes workloads access to Google Cloud services.

### 3.1 Create Google Service Account (GSA)

```bash
GSA_NAME="eloq-operator-sa"

gcloud iam service accounts create ${GSA_NAME} \
    --display-name "Eloq Operator Service Account"
```

### 3.2 Grant IAM Roles to GSA

The Eloq Operator needs permissions for Cloud Storage (GCS), Persistent Disks (PD), and Load Balancers.

```bash
# GCS Admin for EloqStore data
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member "serviceAccount:${GSA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role "roles/storage.admin"

# Compute Admin for PD and Load Balancer management
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member "serviceAccount:${GSA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role "roles/compute.admin"
```

### 3.3 Create Kubernetes Service Account (KSA) and Bind

```bash
KSA_NAME="eloq-operator-sa"
NAMESPACE="eloq-operator-system"

kubectl create namespace ${NAMESPACE}

# Create KSA
kubectl create serviceaccount ${KSA_NAME} \
    --namespace ${NAMESPACE}

# Annotate KSA for Workload Identity
kubectl annotate serviceaccount ${KSA_NAME} \
    --namespace ${NAMESPACE} \
    iam.gke.io/gcp-service-account=${GSA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com

# Allow KSA to impersonate GSA
gcloud iam service accounts add-iam-policy-binding \
    ${GSA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:${PROJECT_ID}.svc.id.goog[${NAMESPACE}/${KSA_NAME}]"
```

---

## Step 4: Install Eloq Operator

Now you can install the operator using Helm, ensuring it uses the KSA we just created.

```bash
# Add Eloq Helm Repo (replace with actual repo URL)
helm repo add eloq https://charts.eloqdata.com
helm repo update

# Install Operator
helm install eloq-operator eloq/eloq-operator \
  --namespace ${NAMESPACE} \
  --set serviceAccount.create=false \
  --set serviceAccount.name=${KSA_NAME}
```

---

## Next Steps

Now that you have the Eloq Operator installed on GKE, you can proceed to create your first database cluster.

Refer to the **[Manage Templates](../usage/template)** and **[Manage Claims](../usage/claim)** guides to learn how to:
1. Create a **Cluster Template** (as an administrator).
2. Create a **Cluster Claim** (as a user).
3. Connect to your database and manage its lifecycle.
