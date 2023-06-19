---
title: MonoSQL Deployment Solution based on Kubernetes Operator.
---

# MonoSQL deployment solution based on Kubernetes Operator 

## 1. About MonoSQL Operator （MonoSQL Controller Manager）

MonoSQL operator is a managed platform for MonoSQL clusters developed based on the [Kubernetes operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/). Currently, it provides features including. 

- Cluster deployment
- Upgrade
- Scale-up/Scale-out
- Configuration change.

Theoretically, with the help of the MonoSQL operator, MonoSQL Cluster can run seamlessly on public and private cloud platforms. Still, we only provide an AWS EKS deployment solution due to the current product limitation.

## 2. Environment Preparation

### Helm3 installation

Helm3 for MonoSQL Operator installation.

```shell
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

For installation on other platforms, please refer to the [official documentation](https://helm.sh/docs/intro/install/).

###  Install and configure the EKS cluster

#### eksctl Install

`eksctl` is a Kubernetes command line management tool similar to `kubectl` for creating and managing Kubernetes clusters on AWS EKS. For Unix platforms, please follow the command below to install

```shell
# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# (Optional) Verify checksum
curl -sL "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin

# Determine whether you already have eksctl installed on your device.
eksctl version
```

For other platforms, please see their [official  documentation](https://github.com/weaveworks/eksctl/blob/main/README.md#installation)

#### Create EKS Cluster

MonoSQL database instances are stateless nodes, and we recommend using EC2 instances of [compute-optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/compute-optimized-instances.html) as EKS  node pools. Create a pool of nodes per availability zone if possible for availability reasons.

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: ${EKS_CLUSTER_NAME}
  region: ap-northeast-1

nodeGroups:
  - name: monosql-ap-1a
    desiredCapacity: 1
    privateNetworking: true
    availabilityZones: ["ap-northeast-1a"]
    instanceType: c5.2xlarge
    labels:
      dedicated: monosql
    taints:
      dedicated: monosql:NoSchedule
  - name: monosql-ap-1d
    desiredCapacity: 1
    privateNetworking: true
    availabilityZones: ["ap-northeast-1d"]
    instanceType: c5.2xlarge
    labels:
      dedicated: monosql
    taints:
      dedicated: monosql:NoSchedule
  - name: monosql-ap-1c
    desiredCapacity: 1
    privateNetworking: true
    availabilityZones: ["ap-northeast-1c"]
    instanceType: c5.2xlarge
    labels:
      dedicated: monosql
    taints:
      dedicated: monosql:NoSchedule
```

Please replace the `EKS_CLUSTER_NAME` above and adjust the `region` and `desiredCapacity` values according to the application.

```shell
# create eks cluster 
eksctl create cluster -f create-eks-cluster.yaml
```

Creating an EKS cluster takes about 20 minutes, depending on the network and resources.

#### Tagging EKS Cluster Subnet 

```bash
# list all eks cluster subnetId for you eks cluster.
aws eks describe-cluster --name ${EKS_CLUSTER_NAME}  --query "cluster.resourcesVpcConfig.subnetIds" --output json
# The above command will have the following output
#[
#    "subnet-05900000000000000",
#    "subnet-09411111111111111",
#    "subnet-01522222222222222"
#]

# Run the following commands for all the above subnet ids in order. 
aws ec2 create-tags  --resource ${SUBNET_ID} --tags Key=kubernetes.io/role/elb,Value="" \
           Key=kubernetes.io/role/internal-elb,Value="" \
           kubernetes.io/cluster/${EKS_CLUSTER_NAME},Value="owned"
```

**Note: Either way, it is required that you have the correct IAM permissions. Please ensure that you have the correct permissions to access EKS resources. You can also create an EKS Cluster through the AWS Management Console. Please refer to [this document](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html) for details.**

#### Configure the AWS load balancer controller

The MonoSQL operator provides a stable IP address to the public through ELB and discovers new MonoSQL instances.AWS Load Balancer Controller is a controller to help manage Elastic Load Balancers for a Kubernetes cluster.

1. Download the IAM policy file from the following address

   ```bash
   # US-East or US-West AWS Regions
   curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.7/docs/install/aws-load-balance-controller-policy_us-gov.json
   
   # All other AWS Regions
   curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.7/docs/install/aws-load-balance-controller-policy.json
   ```

2. Create IAM policy for AWS Load Balancer Controller.

   ```bash
   #!/bin/bash
   aws iam create-policy \
   	--policy-name AWSMonographLoadBalancerControllerIAMPolicy \
   	--policy-document file://"aws-load-balance-controller-policy.json"
   ```

3. Create IAM Service Account

   ```shell
   # Replace ${EKS_CLUSTER_NAME} with the name of your cluster, 111122223333 with your account ID
   #!/bin/bash
   eksctl create iamserviceaccount \
   	--cluster=${EKS_CLUSTER_NAME} \
   	--namespace=kube-system \
   	--name=aws-load-balancer-controller \
   	--role-name AWSMonographLoadBalancerControllerIAMPolicy \
   	--attach-policy-arn=arn:aws:iam::111122223333:policy/AWSLoadBalancerControllerIAMPolicy \
   	--approve
   ```

4. Install AWS Load Balance Controller via helm3 

   ```shell
   helm repo add eks https://aws.github.io/eks-charts
   
   helm repo update eks
   
   helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
     -n kube-system \
     --set clusterName=${EKS_CLUSTER_NAME} \
     --set serviceAccount.create=false \
     --set serviceAccount.name=aws-load-balancer-controller
   
   # verify aws-load-balancer-controller installation, command has the following output.
   # NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
   # aws-load-balancer-controller   2/2     2            2           4d
   kubectl get deployment -n kube-system aws-load-balancer-controller
   ```

#### Configure Service Account for DynamoDB and SQS.

To ensure that MonoSQL works properly, you need to be able to access DynamoDB and SQS within the Kubernetes cluster. Create the IAM and Service Account. with the following commands. (MonoSQL is built on top of DynamoDB and SQS is used for state communication between MonoSQL instances)

1. Copy the following content and name it `dynamo-and-sqs-policy.json`

   ```json
   -- Replace 111122223333 with your account ID and ap-northeast-1 with your region name.
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllAPIActionsOnMonoSQLTables",
         "Effect": "Allow",
         "Action": "dynamodb:*",
         "Resource": "arn:aws:dynamodb:ap-northeast-1:111122223333:table/*"
       },
       {
         "Sid": "AllAPIActionOnMonoSqsQueues",
         "Effect": "Allow",
         "Action": "sqs:*",
         "Resource": "arn:aws:sqs:ap-northeast-1:111122223333:*"
       }
     ]
   }
   ```

2. Create IAM policy use `dynamo-and-sqs-policy.json`

   ```bash
   #!/bin/bash
   aws iam create-policy \
   	--policy-name MonoSQLResourceIAMPolicy \
   	--policy-document file://"dynamo-and-sqs-policy.json"
   ```

3. Create IAM Service Account

   ```bash
   #  Replace ${EKS_CLUSTER_NAME} with the name of your cluster 111122223333 with your account ID
   # If specifying a namespace, please create it beforehand and replace ${YOUR_NAMESPACE} with the correct namespace name.
   eksctl create iamserviceaccount \
   	--cluster=${EKS_CLUSTER_NAME} \
   	--namespace=${YOUR_NAMESPACE} \
   	--name=monosql-aws-access \
   	--attach-policy-arn=arn:aws:iam::111122223333:policy/MonoSQLResourceIAMPolicy \
   	--override-existing-serviceaccounts \
   	--approve
   ```

## 3 Deploy MonoSQL Cluster

#### Install MonoSQL Operator via [Helm charts](https://github.com/monographdb/monograph-charts)

```bash
helm repo add monograph https://monographdb.github.io/monograph-charts/
helm repo update
# for example: helm install --namespace monosql-operator monosql-operator-mgr  monograph/monosql-operator
# Note: If the installation specifies namespace please create it first
helm install --namespace [NAMESPACE_NAME] [RELEASE_NAME]  monograph/monosql-operator
# Check the installed MonoSQL Operator
# for example: helm list --namespace monosql-operator /helm list --all --all-namespaces
helm list --namespace [NAMESPACE_NAME]
```

#### Deploy MonoSQL Cluster use MonoSQL Operator

Copy the following content and name it `monosql-cluster.yaml`

```yaml
kind: Namespace
apiVersion: v1
metadata:
  name: monosql-operator
---
apiVersion: monosql-service.monographdb.com/v1alpha1
kind: MonoSQLCluster
metadata:
  labels:
    app.kubernetes.io/name: monosqlcluster
    app.kubernetes.io/part-of: monosql-operator
    app.kubernetes.io/created-by: monosql-operator
  name: monosqlcluster
  namespace: monosql-operator
spec:
  replica: 2
  resources:
    requests:
      memory: "500Mi"
      cpu: "1"
    limits:
      memory: "4000Mi"
      cpu: "4"
  image: 831875755683.dkr.ecr.ap-northeast-1.amazonaws.com/monosql:latest
  # imagePullSecrets:
  #  - name: awsecr-cred
  sqlPort: 3300
  maxConnection: 2000
  serviceAccount: monosql-aws-access
  keySpaceName: monosql_meta
  sqsQueueName: monosql_sqs_queue1
  dynamo:
    defaultCredential: "ON"
    region: "ap-northeast-1"
```

Deploy MonoSQL Cluster via kubectl

```bash
 kubectl apply -f monosql-cluster.yaml
```

Verify MonoSQL Deployment

```bash
> kubectl get customresourcedefinitions | grep monosqlcluster
monosqlclusters.monosql-service.monographdb.com   2023-06-19T07:55:41Z 

# check MonoSQL bootstrap job.
> kubectl get job --namespace monosql-operator

NAME                         COMPLETIONS   DURATION   AGE
monosql-job-monosqlcluster   0/1           54s        54s

# check out MonoSQL metadata table.
> aws dynamodb list-tables | grep monosql_meta
        "monosql_meta.mariadb_databases",
        "monosql_meta.mariadb_tables",
        "monosql_meta.mysql.column_stats",
        "monosql_meta.mysql.columns_priv",
        "monosql_meta.mysql.db",
        "monosql_meta.mysql.event",
        "monosql_meta.mysql.func",
        "monosql_meta.mysql.global_priv",
        "monosql_meta.mysql.help_category",
        "monosql_meta.mysql.help_keyword",
        …………

# The bootstrap process takes about 6 minutes. The bootstrap process takes about 6 minutes. If the job status is # complete, the bootstrap is successful.
> kubectl get job --namespace monosql-operator 
NAME                         COMPLETIONS   DURATION   AGE
monosql-job-monosqlcluster   1/1           5m45s      5m45s

# check the status of MonoSQL statefulset
> kubectl get statefulset  --namespace monosql-operator
NAME                         READY   AGE
monosql-sts-monosqlcluster   2/2     48s

# check the status of MonoSQL service
> kubectl get service   --namespace monosql-operator
NAME                         TYPE           CLUSTER-IP      EXTERNAL-IP                                         PORT(S)          AGE
monosql-srv-monosqlcluster   LoadBalancer   10.100.198.52   k8s-monosqlo-monosqls-XX.ap-northeast-1.amazonaws.com   3300:32430/TCP   4m29s

# Check the status of elb
> aws elbv2 describe-load-balancers --query 'LoadBalancers[*].[State.Code,LoadBalancerName,DNSName]' --output json
[
    
    [
        "active",
        "k8s-monosqlo-monosqls-000000",
        "k8s-monosqlo-monosqls-000000-f5123456.elb.ap-northeast-1.amazonaws.com"
    ]
]

```

When the deployment is successful, MonoSQL Operator creates a user with the username and password mono_operator. Note that the MonoSQL Service is an intranet LoadBalancer, so you can log in to MonoSQL from any machine in the cluster VPC or by creating a [bastion](https://aws.amazon.com/solutions/implementations/linux-bastion/). 

```bash
mysql --host ${MONOSQL_SERVICE}   --user mono_operator  --port 3300 --password
```

