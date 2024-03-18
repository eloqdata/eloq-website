---
title: Deploy EloqKV on AWS EKS
summary: How to deploy EloqKVCluster via eloq-operator
---

# Deploy EloqKV on AWS EKS

This document describes deploying EloqKV on AWS Elastic Kubernetes Service (EKS).

### Prerequisites

Before deploying an EolqDB cluster on AWS EKS, make sure the following requirements are satisfied:

- Install Helm 3: used to deploying elop-operator.
- Install and configure awscli.
- Install and configure eksctl, which is used to create Kubernetes clusters.
- Install kubectl.

### Create an EKS cluster and a node pool

About how to create EKS Cluster, Please refer to the following section.

### Create Service Account

- Copy the following content and name it `dynamo-and-s3-policy.json`

```
-- Please replace ${ACCOUNT_ID} with your account ID and ${MY_REGION} with your region name.
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": "dynamodb:*",
      "Resource": "arn:aws:dynamodb:${MY_REGION}:${ACCOUNT_ID}:table/*"
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:${MY_REGION}:${ACCOUNT_ID}:*"
    }
  ]
}
```

- Create IAM policy use `dynamo-and-s3-policy.json`

```shell
#!/bin/bash
aws iam create-policy \
  --policy-name EloqClusterResourceIAMPolicy \
  --policy-document file://"dynamo-and-s3-policy.json"
```

- Create IAM Service Account

```shell
#  Replace ${EKS_CLUSTER_NAME} with the name of your cluster, ${ACCOUNT_ID} with your account ID,
#  ${MY_REGION} with your region name, ${MY_NAMESPACE} with your namespace. ${SERVICE_ACCOUNT_NAME} with your service account name.
eksctl create iamserviceaccount \
  --cluster ${EKS_CLUSTER_NAME} \
  --namespace ${MY_NAMESPACE} \
  --name ${SERVICE_ACCOUNT_NAME} \
  --attach-policy-arn arn:aws:iam::${ACCOUNT_ID}:policy/EloqClusterResourceIAMPolicy \
  --override-existing-serviceaccounts \
  --region ${MY_REGION} \
  --approve
```

### Deploy eloq-operator

```shell
helm repo add eloqdata https://monographdb.github.io/monograph-charts/
helm repo update
# for example: helm install eloq-operator eloqdata/eloq-operator --namespace eloq-operator-system
helm install [RELEASE_NAME]  monographdb/eloq-operator --namespace [NAMESPACE_NAME]
```

## Deploy a EloqKV Cluster and the monitoring component.

### Install monitoring component.

**The monitoring-related infrastructure installation is optional** and depends on whether you have installed the following components.

- kube-prometheus-stack
- Loki-distributed
- Mimir
- Promtail

EloqDBCluster relies on infrastructure from the Prometheus and Grafana communities. If you don't have these components installed in your current environment, you can install them with the following command.

- Create a namespace for the monitoring system:

```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: eloq-monitoring-ns
  labels:
    app.kubernetes.io/name: EloqDBCluster-Monitoring
```

Copy the above yaml file and name it `monitoring-ns.yaml`. Then execute:

```shell
kubectl apply -f monitoring-ns.yaml
```

- Create S3 bucket for the monitoring infrastructure:

```shell
aws s3 mb s3://eloq-mimir-ruler --region $REGION
aws s3 mb s3://eloq-mimir-blocks --region $REGION
aws s3 mb s3://eloq-mimir-alertmanager --region $REGION
aws s3 mb s3://eloq-loki-data --region $REGION
```

- Using Helm to install the monitoring components:

```shell
helm install eloqdata-monitor-infra -n monographdb/eloq-monitoring --namespace eloq-monitoring-ns \
  --set global.namespace=eloq-monitoring-ns \
  --set global.serviceAccount.name={your-service-account-name} \
  --set aws.region={your-aws-region} \ 
  --set aws.s3.endpoint={your-aws-s3-endpoint} \
  --set loki-distributed.bucketnames={loki-bucketname}
  --set mimir-distributed.ruler_storage.bucket_name={your-mimir-ruler-bucketname}
  --set mimir-distributed.alertmanager_storage.bucket_name={your-mimir-alertmanager-bucketname} 
  --set mimir-distributed.blocks_storage.bucket_name={your-mimir-blocks_storage-bucketname}
```

- Install EloqKV Dashboard

> TODO

```shell

```

### Deploy a EloqKV Cluster

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

Copy the above yaml file and name it `eloqkv-cluster.yaml`. Then execute:

```shell
kubectl apply -f eloq-cluster.yaml
```

For a more detailed CR configuration please refer to the document [Configure an EloqKV Cluster on AWS EKS](file:///Users/pangzhenzhou/workspace/golang/src/eloq-operator/docs/general/config-eloqkv-cluster-eks.md)

### Verify the deployment

The EloqKV cluster starts successfully when all the pods in the StatefulSet are in the `Running` or `Ready` state.

```shell
kubectl get pods -n eloq-operator-test
```

### Access the EloqKV Cluster

EloqKV is compatible with the Redis protocol, so your application can use a Redis client to access the database cluster. At the same time, the eloq-operator will create an intranet LoadBalancer for your EloqKV. You can also create a bastion on the cluster intranet to access the database. To create a bastion host on AWS console, refer to [AWS documentation](https://aws.amazon.com/solutions/implementations/linux-bastion/).

#### Install the redis-cli and connect

1. Login to the bastion via ssh

```shell
ssh [-i /your-private-key.pem] ec2-user@<bastion-public-dns-name>
```

1. Install the redis-cli

```shell
sudo yum install redis-tools 
```

1. Connect to the EloqKV cluster

You can get the EXTERNAL-IP of the domain name with the following command:

```shell
kubectl get svc eloq-srv-tx-my-eloqkv-exposed  -n eloq-operator-test
```

`<eloqkv-cluster-intranet-loadbalancer-dns-name>` is the LoadBalancer domain name of the EloqKV service.

```shell
redis-cli -h <eloqkv-cluster-intranet-loadbalancer-dns-name> -p 6379
```