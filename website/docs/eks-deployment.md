---
title: Deploy EKS Cluster
---

# Deploy EKS Cluster
## Environment Preparation
### Install AWS CLI

To install or update AWS CLI, please follow the instructions provided in [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). This guide offers a detailed, step-by-step process to ensure you can successfully set up AWS CLI on your system.

### Install `eksctl`

`eksctl` is a Kubernetes command line management tool similar to `kubectl` for managing Kubernetes clusters on AWS EKS. Follow the instructions below to install `eksctl` on Unix platforms:

```bash
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

For installing `eksctl` on other platforms, please refer to the [official documentation](https://github.com/weaveworks/eksctl/blob/main/README.md#installation).

### Install Helm3

Helm is a tool for managing Kubernetes packages called charts. Helm allows you to define, install, and upgrade complex Kubernetes applications. For Unix-based systems, use the following commands to install Helm3:
```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

For installing Helm3 on different platforms, please refer to the [official documentation](https://helm.sh/docs/intro/install/).


## Install and configure the EKS cluster
This section details how to use `eksctl` and AWS CLI to install and configure your EKS cluster.

**Please be sure to replace the variable names in the following commands with your own.**

- `AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)`

- `EKS_CLUSTER=eloqdb-dev`

- `AWS_REGION="ap-northeast-1"`

### Granting EKS Access Policies to an IAM User or Group

This section details the steps to grant EKS access policies to an IAM user or group. You'll need to perform several tasks, including retrieving your AWS account ID, preparing policy documents, creating policies, and attaching them to an IAM user or group.

**Please be sure to replace the variable names in the following commands with your own.**

- `IAM_USER=eks_user_0`

- `IAM_USER_GROUP=eks_team`

#### Step 1: Retrieve Your AWS Account ID
First, find your AWS account ID by running the following command:
```bash
aws sts get-caller-identity --query 'Account' --output text
```

#### Step 2: Prepare the EKS Full Access Policy File
Create a JSON file named `EKSFullAccess.json` for the EKS access policy. Replace `<aws_account_id>` with your actual AWS account ID in the policy file:

```json
-- EKSFullAccess.json  Note please replace <aws_account_id> with your AWS account id.
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "eks:*",
            "Resource": "*"
        },
        {
            "Action": [
                "ssm:GetParameter",
                "ssm:GetParameters"
            ],
            "Resource": [
                "arn:aws:ssm:*:<aws_account_id>:parameter/aws/*",
                "arn:aws:ssm:*::parameter/aws/*"
            ],
            "Effect": "Allow"
        },
        {
             "Action": [
               "kms:CreateGrant",
               "kms:DescribeKey"
             ],
             "Resource": "*",
             "Effect": "Allow"
        },
        {
             "Action": [
               "logs:PutRetentionPolicy"
             ],
             "Resource": "*",
             "Effect": "Allow"
        }
    ]
}
```

#### Step 3: Create the EKS Full Access Policy

Run the following command to create the `EKSFullAccess` policy:
```bash
aws iam create-policy --policy-name EKSFullAccess --policy-document file://EKSFullAccess.json
```

#### Step 4: Attach the EKS Full Access Policy to an IAM User or User Group

To attach the `EKSFullAccess` policy to an IAM user named `eks_user_0`, use the following commands:
```bash
aws iam attach-user-policy --user-name ${IAM_USER} --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
aws iam attach-user-policy --user-name ${IAM_USER} --policy-arn arn:aws:iam::aws:policy/AWSCloudFormationFullAccess
aws iam attach-user-policy --user-name ${IAM_USER} --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/EKSFullAccess
```

To attach the `EKSFullAccess` policy to an IAM user group named `eks_team`, execute the following commands:
```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
aws iam attach-group-policy --group-name ${IAM_USER_GROUP} --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
aws iam attach-group-policy --group-name ${IAM_USER_GROUP} --policy-arn arn:aws:iam::aws:policy/AWSCloudFormationFullAccess
aws iam attach-group-policy --group-name ${IAM_USER_GROUP} --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/EKSFullAccess
```

### Create an EKS Cluster

EloqDB instances are stateless nodes, and we recommend using EC2 instances of [compute-optimized instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/compute-optimized-instances.html) as EKS node pools. Create a pool of nodes per availability zone if possible for availability reasons.

This is an example manifest for EKS cluster configuration.


**Please be sure to replace the variable names in the following commands with your own.**

- `EKS_CLUSTER=eloqdb-dev`

- `AWS_REGION="ap-northeast-1"`

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: ${EKS_CLUSTER}
  region: ${AWS_REGION}

nodeGroups:
  - name: eloq-ap-1a-c5-2xlarge
    desiredCapacity: 1
    privateNetworking: true
    availabilityZones: ['${AWS_REGION}a']
    instanceType: c5.2xlarge
    labels:
      dedicated: eloqdb
    taints:
      dedicated: eloqdb:NoSchedule
  - name: eloq-ap-1c-c5-2xlarge
    desiredCapacity: 1
    privateNetworking: true
    availabilityZones: ['${AWS_REGION}c']
    instanceType: c5.2xlarge
    labels:
      dedicated: eloqdb
    taints:
      dedicated: eloqdb:NoSchedule
  - name: eloq-ap-1d-c5-2xlarge
    desiredCapacity: 1
    privateNetworking: true
    availabilityZones: ['${AWS_REGION}d']
    instanceType: c5.2xlarge
    labels:
      dedicated: eloqdb
    taints:
      dedicated: eloqdb:NoSchedule

```

Please replace the `EKS_CLUSTER` above and adjust the `region` and `desiredCapacity` values according to the application.

```bash
# create eks cluster
eksctl create cluster -f create-eks-cluster.yaml
```

Creating an EKS cluster takes about 20 minutes, depending on the network and resources.

### Tagging EKS Cluster Subnet

```bash
#!/bin/bash
# list all eks cluster subnetId for your eks cluster.
subnet_ids=$(aws eks describe-cluster --name ${EKS_CLUSTER}  --query "cluster.resourcesVpcConfig.subnetIds" --output text)
# The above command will have the following output
#[
#    "subnet-05900000000000000",
#    "subnet-09411111111111111",
#    "subnet-01522222222222222"
#]

# Run the following commands for all the above subnet ids.
# Loop over each subnet ID and apply tags
for subnet_id in ${subnet_ids}; do
  aws ec2 create-tags --resource ${subnet_id} --tags Key=kubernetes.io/role/elb,Value="" \
    Key=kubernetes.io/role/internal-elb,Value="" \
    Key=kubernetes.io/cluster/${EKS_CLUSTER},Value="owned"
done
```

**Note: Either way, it is required that you have the correct IAM permissions. Please ensure that you have the correct permissions to access EKS resources. You can also create an EKS Cluster through the AWS Management Console. Please refer to [this document](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html) for details.**


### Install Add-ons for EKS Cluster

**Please be sure to replace the variable names in the following commands with your own.**

- `AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)`

- `EKS_CLUSTER=eloqdb-dev`

- `AWS_REGION="ap-northeast-1"`

#### Install Amazon VPC CNI
##### Step 1: Determine the IP family of your cluster.

```bash
aws eks describe-cluster --name ${EKS_CLUSTER} | grep ipFamily
```
An example output is as follows.

```
"ipFamily": "ipv4"
```

##### Step 2: Create the IAM role.

For `IPV4`
```bash
eksctl create iamserviceaccount \
  --name aws-node \
  --namespace kube-system \
  --cluster ${EKS_CLUSTER} \
  --role-name AmazonEKSVPCCNIRole \
  --attach-policy-arn arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy \
  --override-existing-serviceaccounts \
  --approve
 ```

For `IPV6`
```bash
eksctl create iamserviceaccount \
  --name aws-node \
  --namespace kube-system \
  --cluster ${EKS_CLUSTER} \
  --role-name AmazonEKSVPCCNIRole \
  --attach-policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/AmazonEKS_CNI_IPv6_Policy \
  --override-existing-serviceaccounts \
  --approve
```
##### Step 3: Confirm the latest available addon version for your cluster.

```bash
eksctl get cluster --name ${EKS_CLUSTER} -o json | jq '.[].Version'
```

An example output is as follows.
```
"1.29"
```

List the available VPC CNI addon version for the Kubernetes version.
```bash
eksctl utils describe-addon-versions --kubernetes-version 1.29 --name vpc-cni | grep AddonVersion
```

An example output is as follows.
```
"AddonVersions": [
        "AddonVersion": "v1.18.1-eksbuild.3",
        "AddonVersion": "v1.18.1-eksbuild.1",
        "AddonVersion": "v1.18.0-eksbuild.1",
        "AddonVersion": "v1.17.1-eksbuild.1",
        "AddonVersion": "v1.16.4-eksbuild.2",
        "AddonVersion": "v1.16.3-eksbuild.2",
        "AddonVersion": "v1.16.2-eksbuild.1",
        "AddonVersion": "v1.16.0-eksbuild.1",
        "AddonVersion": "v1.15.5-eksbuild.1",
        "AddonVersion": "v1.15.4-eksbuild.1",
        "AddonVersion": "v1.14.1-eksbuild.1",
        "AddonVersion": "v1.13.4-eksbuild.1",
```

##### Step 4: Create the add-ons using AWS CLI.

Replace `v1.18.1-eksbuild.3` with the latest version listed in the latest version table for your cluster version.

```bash
aws eks create-addon \
  --cluster-name ${EKS_CLUSTER} \
  --addon-name vpc-cni \
  --addon-version v1.18.1-eksbuild.3 \
  --service-account-role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/AmazonEKSVPCCNIRole
 ```

##### Step 5: Confirm the addon is installed

```bash
eksctl get addon --cluster ${EKS_CLUSTER}
```
#### Install Amazon EBS CSI
##### Step 1: Create the IAM role.

```bash
eksctl create iamserviceaccount \
    --name ebs-csi-controller-sa \
    --namespace kube-system \
    --cluster ${EKS_CLUSTER} \
    --role-name AmazonEKS_EBS_CSI_DriverRole \
    --role-only \
    --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
    --approve
```

##### Step 2: Create the add-on using AWS CLI.

```bash
eksctl create addon --name aws-ebs-csi-driver \
    --cluster ${EKS_CLUSTER} \
    --service-account-role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/AmazonEKS_EBS_CSI_DriverRole \
    --force
```

##### Step 3: Confirm the addon is installed
```bash
eksctl get addon --cluster ${EKS_CLUSTER}
```

### Install the AWS load balancer controller

#### Step 1:  Download the IAM policy file from the following address.

```bash
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.7/docs/install/iam_policy.json
```

#### Step 2: Create IAM policy for AWS Load Balancer Controller.

```bash
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json
```

#### Step 3: Create IAM Service Account and Attach to the policy

```bash
eksctl utils associate-iam-oidc-provider --cluster ${EKS_CLUSTER} --region ${AWS_REGION} --approve
eksctl create iamserviceaccount \
  --cluster=${EKS_CLUSTER} \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::${AWS_ACCOUNT_ID}:policy/AWSLoadBalancerControllerIAMPolicy \
  --region ${AWS_REGION} \
  --approve
 ```

#### Step 4: Install AWS Load Balance Controller via helm3

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=${EKS_CLUSTER} \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

#### Step 5: Verify `aws-load-balancer-controller` is isnstalled.

```bash
kubectl get deployment -n kube-system aws-load-balancer-controller
```

An example output is as follows.
```
NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           -
```
