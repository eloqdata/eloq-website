---
title: Deploy EloqKV on AWS EKS
summary: How to deploy EloqKVCluster via eloq-operator
---

# Deploy EloqKV on AWS EKS

This document describes deploying EloqKV on AWS Elastic Kubernetes Service (EKS).

## Prerequisites

Before deploying an EolqDB cluster on AWS EKS, make sure the following requirements are satisfied:

- Install Helm 3: used to deploying elop-operator.
- Install and configure `aws-cli`.
- Install and configure `eksctl`, which is used to create Kubernetes clusters.
- Install `kubectl`.
- An EKS cluster.

## Deploy eloq-operator

```bash
helm repo add eloqdata https://monographdb.github.io/monograph-charts/
helm repo update
helm install eloq-operator  monographdb/eloq-operator --namespace eloq-operator-system
```

## Deploy the monitoring components for `EloqDBCluster`

The monitoring system of `EloqDBCluster` relies on the infrastructure of the Prometheus and Grafana communities.  Currently includes the following components:

- kube-prometheus-stack.
- Loki-distributed.
- Mimir-distributed.
- Promtail.

This section introduces how to deploy a complete monitoring system. Specifically, it includes the following steps:

1. Create a namespace for monitoring components.
2. Create and attach S3 access policy to a service account for monitoring components.
3. Install monitoring components.
4. Install EloqKV cluster dashboard.
5. Install `PodMonitor` to monitor EloqKV cluster.

**The monitoring-related infrastructure installation is optional** and depends on whether you have installed the following components.

**Please be sure to replace the variable names in the following commands with your own.**

- `AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)`

- `EKS_CLUSTER=eloqdb-dev`

- `AWS_REGION="ap-northeast-1"`

### Create a namespace for the monitoring components

Create a namespace using the following manifest:
```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: eloq-monitoring-ns
  labels:
    app.kubernetes.io/name: EloqDBCluster-Monitoring
```

Then execute:

```bash
kubectl apply -f monitoring-ns.yaml
```

### Create and attach S3 access policy to a service account for monitoring components

Create the policy file `monitoring-system-IAM-policy.json` with the following content:
``` json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3Access",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "*"
        }
    ]
}
```

Create the IAM policy `MonitoringSystemIAMPolicy`:
``` bash
aws iam create-policy \
  --policy-name MonitoringSystemIAMPolicy \
  --policy-document file://"path/to/monitoring-system-IAM-policy.json"
```

Create the IAM service account:
```bash
eksctl create iamserviceaccount \
  --region ${AWS_REGION} \
  --cluster ${EKS_CLUSTER} \
  --namespace eloq-monitoring-ns \
  --name monitoring-sa \
  --attach-policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/MonitoringSystemIAMPolicy \
  --approve
```

### Create S3 bucket for the monitoring infrastructure:

**Please be sure to replace the variable names in the following commands with your own.**

- `MIMIR_BLOCKS_STORAGE_BUCKET=eloq-mimir-blocks`

- `MIMIR_RULER_BUCKET=eloq-mimir-ruler`

- `MIMIR_ALERTMANAGER_BUCKET=eloq-mimir-alertmanager`

- `LOKI_BUCKET=eloq-loki-data`

```bash
aws s3 mb s3://${MIMIR_BLOCKS_STORAGE_BUCKET} --region ${AWS_REGION}
aws s3 mb s3://${MIMIR_RULER_BUCKET} --region ${AWS_REGION}
aws s3 mb s3://${MIMIR_ALERTMANAGER_BUCKET} --region ${AWS_REGION}
aws s3 mb s3://${LOKI_BUCKET} --region ${AWS_REGION}
```

### Using Helm to install the monitoring components:

**Please be sure to replace the variable names in the following commands with your own.**

- `S3_ENDPOINT="s3.ap-northeast-1.amazonaws.com`

```bash
helm install eloqdata-monitor-infra -n monographdb/eloq-monitoring --namespace eloq-monitoring-ns \
  --set global.namespace=eloq-monitoring-ns \
  --set global.serviceAccount.name=monitoring-sa \
  --set aws.region=${AWS_REGION} \
  --set aws.s3.endpoint=${S3_ENDPOINT} \
  --set loki-distributed.bucketnames=${LOKI_BUCKET} \
  --set mimir-distributed.ruler_storage.bucket_name=${MIMIR_RULER_BUCKET} \
  --set mimir-distributed.alertmanager_storage.bucket_name=${MIMIR_ALERTMANAGER_BUCKET} \
  --set mimir-distributed.blocks_storage.bucket_name={MIMIR_BLOCKS_STORAGE_BUCKET}
```

### Install EloqKV cluster dashboard and `PodMonitor`:

Install EloqKV cluster dashboard:
```bash
kubectl apply -f https://www.eloqdata.com/download/eloqdb-dashboards/eloqkv-overview.yaml
```

Create an `PodMonitor` manifest file named `eloqdb-pods-monitor.yaml` with the following content.

**Please be sure to replace the variable names in the following commands with your own.**

- `KUBE_PROMETHEUS_RELEASE=kube-prometheus-stack`


```yaml
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: eloqdata-pods-monitor
  labels:
    release: ${KUBE_PROMETHEUS_RELEASE}
  namespace: eloq-monitoring-ns
spec:
  namespaceSelector:
    any: true
    # matchNames: {}
  selector:
    matchExpressions:
    - key: eloqdata.com/srv
      values: ["tx", "log"]
      operator: In
  podMetricsEndpoints:
  - port: "metric-port"
    path: "/mono_metrics"
    relabelings:
    - targetLabel: instance
      sourceLabels:
      - __meta_kubernetes_pod_name
      action: replace
    - targetLabel: eloqdata_cluster
      sourceLabels:
      - __meta_kubernetes_pod_label_eloqdata_com_cluster
      action: replace
    - targetLabel: tenant
      sourceLabels:
      - __meta_kubernetes_namespace
      action: keep
```

Then install the `PodMonitor`:
```
kubectl apply -f eloqdb-pods-monitor.yaml
```

## Deploy an EloqKV Cluster

This section describes how to deploy an EloqKV cluster. Specifically, it includes the following steps:

1. Create a namespace for EloqKV cluster.
2. Create and attach s3 and dynamodb s3 access policy to a service account for EloqKV cluster.
3. Deploy EloqKV cluster.
4. Verify the EloqKV cluster is deployed.

### Create a nmaespace for EloqKV cluster

Create a namespace using the following manifest:
```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: eloqkv-test
  labels:
    app.kubernetes.io/name: EloqDBCluster
```

### Create and attach s3 and dynamodb s3 access policy to a service account for EloqKV cluster

Copy the following content and name it `dynamo-and-s3-policy.json`:
```
-- Please replace ${AWS_ACCOUNT_ID} with your account ID and ${AWS_REGION} with your region name.
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": "dynamodb:*",
      "Resource": "arn:aws:dynamodb:${AWS_REGION}:${AWS_ACCOUNT_ID}:table/*"
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::*"
    }
  ]
}
```

Create IAM policy using `dynamo-and-s3-policy.json`:

```bash
#!/bin/bash
aws iam create-policy \
  --policy-name EloqClusterResourceIAMPolicy \
  --policy-document file://"dynamo-and-s3-policy.json"
```

Create IAM Service Account:
**Please be sure to replace the variable names in the following commands with your own.**

- `SERVICE_ACCOUNT=eloqdb-aws-access`

```bash
eksctl create iamserviceaccount \
  --cluster ${EKS_CLUSTER} \
  --namespace eloqkv-test \
  --name ${SERVICE_ACCOUNT} \
  --attach-policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/EloqClusterResourceIAMPolicy \
  --override-existing-serviceaccounts \
  --region ${AWS_REGION} \
  --approve
```

### Create an EloqKV Cluster

This is an example manifest for EloqKV Cluster:
```yaml
apiVersion: eloqdbcluster.eloqdata.com/v1alpha1
kind: EloqDBCluster
metadata:
  labels:
    app.kubernetes.io/name: eloqdbcluster
    app.kubernetes.io/part-of: eloq-operator
    app.kubernetes.io/created-by: eloq-operator
  name: my-eloqkv
  namespace: eloqkv-test
spec:
  frontend:
    module: 'eloqkv'
    port: 6379
  tx:
    serviceAccountName: your-service-account
    replica: 1
    resources:
      requests:
        memory: '6000Mi'
        cpu: '4'
      limits:
        memory: '6000Mi'
        cpu: '4'
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
        memory: '2000Mi'
        cpu: '2'
      limits:
        memory: '2000Mi'
        cpu: '2'
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

Copy the above yaml file and name it `eloqkv-cluster.yaml`. Then execute:

```bash
kubectl apply -f eloq-cluster.yaml
```

For a more detailed CR configuration please refer to the document [Configure an EloqKV Cluster on AWS EKS](./configure-eloqkv-resource.md)

### Verify the EloqKV cluster is deployed

The EloqKV cluster starts successfully when all the pods in the StatefulSet are in the `Running` or `Ready` state.

```bash
kubectl get pods -n eloqkv-test
```

### Access the EloqKV Cluster

EloqKV is compatible with the Redis protocol, so your application can use a Redis client to access the database cluster. At the same time, the eloq-operator will create an intranet LoadBalancer for your EloqKV. You can also create a bastion on the cluster intranet to access the database. To create a bastion host on AWS console, refer to [AWS documentation](https://aws.amazon.com/solutions/implementations/linux-bastion/).

#### Install the redis-cli and connect

1. Login to the bastion via ssh

```bash
ssh [-i /your-private-key.pem] ec2-user@<bastion-public-dns-name>
```

2. Install the redis-cli

```bash
sudo yum install redis-tools
```

3. Connect to the EloqKV cluster

You can get the EXTERNAL-IP of the domain name with the following command:

```bash
kubectl get svc eloq-srv-tx-my-eloqkv-exposed  -n eloqkv-test
```

`<eloqkv-cluster-intranet-loadbalancer-dns-name>` is the LoadBalancer domain name of the EloqKV service.

```bash
redis-cli -h <eloqkv-cluster-intranet-loadbalancer-dns-name> -p 6379
```
