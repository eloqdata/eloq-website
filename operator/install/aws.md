---
id: aws
title: Install Eloq Operator on AWS EKS
---

# Install Eloq Operator on AWS EKS

This guide walks you through installing the Eloq Operator on AWS EKS.

> **Region Configuration**
>
> This guide uses `ap-northeast-1` (Tokyo) region as an example. If you're deploying in a different AWS region, you'll need to adjust the following:
> - Region name in the cluster configuration file
> - Availability zones (e.g., `ap-northeast-1a` → your region's zones)
> - AMI ID (Amazon Machine Image varies by region)
> - Region parameter in AWS CLI commands

## Prerequisites

Before you begin, ensure you have:

- `kubectl` installed (v1.28 or later)
- `helm` installed (v3.0 or later)
- `eksctl` installed (v0.150.0 or later)
- AWS CLI configured with appropriate credentials
- An AWS account with permissions to create EKS clusters, IAM policies, EBS and S3 buckets

## Step 1: Create EKS Cluster

### 1.1 List Availability Zones

First, check the available availability zones for your AWS region:

```bash
aws ec2 describe-availability-zones --region ap-northeast-1 \
  --query 'AvailabilityZones[*].[ZoneName, ZoneId]' \
  --output table
```

Example output:
```
----------------------------------
|    DescribeAvailabilityZones   |
+------------------+-------------+
|  ap-northeast-1a |  apne1-az4  |
|  ap-northeast-1c |  apne1-az1  |
|  ap-northeast-1d |  apne1-az2  |
+------------------+-------------+
```

### 1.2 Create EKS IAM Policy

Create a custom IAM policy to grant necessary EKS permissions:

```bash
cat >eks-full-access.json <<EOF
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
                "arn:aws:ssm:*:<YOUR_ACCOUNT_ID>:parameter/aws/*",
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
EOF

aws iam create-policy \
  --policy-name EKSFullAccess \
  --policy-document file://eks-full-access.json
```

### 1.3 Query Ubuntu AMI for EKS

Query the appropriate Ubuntu AMI ID for your EKS version and region:

```bash
AMI_ID=$(aws ssm get-parameters \
  --names "/aws/service/canonical/ubuntu/eks/24.04/1.33/stable/current/amd64/hvm/ebs-gp3/ami-id" \
  --region ap-northeast-1 \
  --query 'Parameters[0].Value' --output text)

echo "AMI ID: $AMI_ID"
```

> **Note:** For different EKS versions or Ubuntu releases, adjust the parameter path accordingly. For example:
> - Ubuntu 22.04 with EKS 1.32: `/aws/service/canonical/ubuntu/eks/22.04/1.32/stable/current/amd64/hvm/ebs-gp3/ami-id`
> - Ubuntu 24.04 with EKS 1.33: `/aws/service/canonical/ubuntu/eks/24.04/1.33/stable/current/amd64/hvm/ebs-gp3/ami-id`

### 1.4 Create Cluster Configuration File

Create an EKS cluster with i4i instance types for optimal performance. These instances provide local NVMe storage that EloqKV/EloqDoc can leverage.

Create a file named `eloqdb-demo.yaml` with the following configuration:

```yaml
# eloqdb-demo.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: eloqdb-demo
  region: ap-northeast-1
  version: "1.33"

managedNodeGroups:
  - name: ap-northeast-1a-i4i-xlarge
    privateNetworking: true
    availabilityZones: ['ap-northeast-1a']
    instanceType: i4i.xlarge
    spot: false
    volumeSize: 50
    ami: ami-04109c73fc2369af3
    amiFamily: Ubuntu2404
    labels:
      xfsQuota: enabled
    minSize: 0
    desiredCapacity: 0
    maxSize: 3

    overrideBootstrapCommand: |
      #!/bin/bash

      # Robust EC2 data-disk setup + mount for EKS nodes (XFS + quota),
      # then bootstrap.
      # - Waits for non-root, unmounted block device >= MIN_BYTES
      # - Accepts nvme/xvd/sd (Nitro and non-Nitro)
      # - Idempotent: skips mkfs if filesystem exists,
      #   skips fstab duplicates, etc.

      set -euo pipefail

      ###########################################################################
      # Configuration
      ###########################################################################

      CLUSTER_NAME="eloqdb-demo"
      CONTAINER_RUNTIME="containerd"

      # Minimum size to qualify as "data disk" (default 800 GiB)
      MIN_BYTES=$((800 * 1024 * 1024 * 1024))

      # Where to mount the data disk
      MNT_DIR="/mnt/xfs-quota"

      # Filesystem and mount options
      FS_TYPE="xfs"
      FS_OPTS="defaults,uquota,pquota,discard"

      # run with DEBUG=1 for verbose logs
      DEBUG=${DEBUG:-0}
      RETRIES="${RETRIES:-60}"
      SLEEP_SECONDS="${SLEEP_SECONDS:-2}"

      ###########################################################################
      # Helper: print log lines with timestamp
      ###########################################################################

      log() {
        printf '[%s] %s\n' "$(date '+%H:%M:%S')" "$*" >&2
      }

      [[ $DEBUG -eq 1 ]] && set -x

      ###########################################################################
      # Helper: find root disk (e.g., nvme0n1) so we can exclude it
      ###########################################################################
      get_root_disk() {
        df --output=source / | tail -n1 | xargs lsblk -no PKNAME
      }

      ###########################################################################
      # Helper: wait for a suitable data disk to appear
      # Criteria:
      #   - block device (TYPE=disk)
      #   - not the root disk (and not a partition of it)
      #   - unmounted
      #   - name starts with nvme/xvd/sd
      #   - size >= MIN_BYTES
      # Returns /dev/<name> to stdout
      ###########################################################################
      wait_for_data_disk() {
        local root="$1" min="$2" tries="$3" sleep_s="$4"

        for ((i=1; i<=tries; i++)); do
          while read -r name size type mnt pk; do
            # Skip if not a disk device
            [[ "$type" != "disk" ]] && continue
            # Skip the root disk itself
            [[ "$name" == "$root" ]] && continue
            # Skip mounted devices
            [[ -n "$mnt" ]] && continue
            # Accept common device name prefixes
            [[ "$name" =~ ^(nvme|xvd|sd) ]] || continue
            # Enforce minimum size
            if (( size >= min )); then
              echo "/dev/$name"
              return 0
            fi
          done < <(lsblk -b -dn -o NAME,SIZE,TYPE,MOUNTPOINT,PKNAME)

          log "Waiting for data disk to appear ($i/$tries)..."
          sudo udevadm settle || true
          sleep "$sleep_s"
        done

        return 1
      }

      ###########################################################################
      # Helper: if the disk has partitions, prefer the first partition node
      ###########################################################################
      pick_target_node() {
        local dev_path="$1"
        local base part
        base="$(basename "$dev_path")"
        # Find the first partition whose PKNAME equals the base device
        part="$(lsblk -nr -o NAME,TYPE,PKNAME | awk -v d="$base" '$2=="part" && $3==d{print $1; exit}')"
        if [[ -n "$part" ]]; then
          echo "/dev/$part"
        else
          echo "$dev_path"
        fi
      }

      ###########################################################################
      # 1. Detect root disk
      ###########################################################################
      ROOT_DISK="$(get_root_disk)"
      if [[ -z "${ROOT_DISK:-}" ]]; then
        log "ERROR: failed to detect root disk"
        lsblk -b -o NAME,SIZE,TYPE,MOUNTPOINT,PKNAME
        exit 1
      fi
      log "Root disk   : $ROOT_DISK"

      ###########################################################################
      # 2. Find candidate data disks (wait for attachment/udev)
      ###########################################################################
      DATA_DISK="$(wait_for_data_disk "$ROOT_DISK" "$MIN_BYTES" "$RETRIES" "$SLEEP_SECONDS")" || {
        log "ERROR: no unmounted data disk ≥ $((MIN_BYTES / 1024 / 1024 / 1024)) GiB found after waiting"
        log "lsblk snapshot:"
        lsblk -b -o NAME,SIZE,TYPE,MOUNTPOINT,PKNAME
        exit 1
      }

      log "Selected disk: ${DATA_DISK}"

      ###########################################################################
      # 3. If a partition exists, prefer it (avoids clobbering existing partition tables)
      ###########################################################################
      TARGET_NODE="$(pick_target_node "$DATA_DISK")"
      [[ "$TARGET_NODE" != "$DATA_DISK" ]] && log "Using partition node: $TARGET_NODE"

      ###########################################################################
      # 4. Install xfsprogs if needed (Ubuntu 24.04 doesn't include it by default)
      ###########################################################################
      if ! command -v mkfs.xfs &>/dev/null; then
        log "Installing xfsprogs package..."
        sudo apt-get update -qq
        sudo apt-get install -y xfsprogs
      fi

      ###########################################################################
      # 5. Create filesystem if missing (idempotent)
      ###########################################################################
      FSTYPE="$(lsblk -no FSTYPE "$TARGET_NODE" || true)"
      if [[ -z "${FSTYPE}" ]]; then
        log "No filesystem detected on ${TARGET_NODE}; creating ${FS_TYPE}"
        sudo mkfs."${FS_TYPE}" -f "${TARGET_NODE}"
      else
        log "Filesystem ${FSTYPE} already exists on ${TARGET_NODE}; skipping mkfs"
      fi

      ###########################################################################
      # 6. Resolve UUID with retries
      ###########################################################################
      UUID=""
      for _ in {1..10}; do
        UUID="$(lsblk -no UUID "${TARGET_NODE}" || true)"
        [[ -n "${UUID}" ]] && break
        sleep 1
      done

      if [[ -z "${UUID}" ]]; then
        log "ERROR: failed to read UUID for ${TARGET_NODE}"
        exit 1
      fi
      log "Detected UUID : ${UUID}"

      ###########################################################################
      # 7. Mount and persist in /etc/fstab (idempotent)
      ###########################################################################
      sudo mkdir -p "${MNT_DIR}"

      if ! mountpoint -q "${MNT_DIR}"; then
        log "Mounting ${TARGET_NODE} on ${MNT_DIR}"
        sudo mount -o "${FS_OPTS}" "UUID=${UUID}" "${MNT_DIR}"
      else
        log "${MNT_DIR} already mounted"
      fi

      if ! grep -q "UUID=${UUID}[[:space:]]\+${MNT_DIR}[[:space:]]" /etc/fstab; then
        log "Adding entry to /etc/fstab"
        # Use tee to ensure sudo applies to the file write
        echo "UUID=${UUID}  ${MNT_DIR}  ${FS_TYPE}  ${FS_OPTS},nofail  0  2" | sudo tee -a /etc/fstab >/dev/null
      else
        log "UUID already present in /etc/fstab; skipping"
      fi

      ###########################################################################
      # 8. Configure containerd for io_uring (requires LimitMEMLOCK=infinity)
      ###########################################################################
      log "Configuring containerd for io_uring support"
      # Create a systemd override directory for the containerd service
      sudo mkdir -p /etc/systemd/system/containerd.service.d

      # Create the override configuration file, directly setting LimitMEMLOCK to infinity for the service. (For io_uring)
      cat <<EOF | sudo tee /etc/systemd/system/containerd.service.d/override.conf > /dev/null
      [Service]
      LimitMEMLOCK=infinity
      EOF

      # Reload the systemd configuration and restart the containerd service to apply the change
      sudo systemctl daemon-reload
      sudo systemctl restart containerd

      ###########################################################################
      # 9. Bootstrap EKS (start kubelet after mount is ready)
      #    If you prefer the original order, move this *above* the disk steps.
      ###########################################################################
      log "Running EKS bootstrap for cluster '${CLUSTER_NAME}' (runtime: ${CONTAINER_RUNTIME})"
      sudo /etc/eks/bootstrap.sh "${CLUSTER_NAME}" --container-runtime "${CONTAINER_RUNTIME}"

      log "Done."

    iam:
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
        - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
        - arn:aws:iam::aws:policy/AmazonEC2FullAccess
        - arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess
        - arn:aws:iam::aws:policy/AmazonEKSClusterPolicy
        - arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy
        - arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
        - arn:aws:iam::<YOUR_ACCOUNT_ID>:policy/EKSFullAccess

iamIdentityMappings:
  - arn: arn:aws:iam::<YOUR_ACCOUNT_ID>:user/<YOUR_IAM_USER>
    groups:
      - system:masters
    username: <YOUR_IAM_USER>
    noDuplicateARNs: true
```

> **Note:** Replace the following placeholders in the configuration:
> - `<YOUR_ACCOUNT_ID>`: Your AWS account ID (e.g., `123456789012`)
> - `<YOUR_IAM_USER>`: Your IAM username (e.g., `admin-user`)
> - Update the `ami` field with the AMI ID queried in Step 1.3
> - Adjust `region`, `availabilityZones` according to your deployment requirements

### 1.5 Create the Cluster

```bash
# Create the EKS cluster
eksctl create cluster -f eloqdb-demo.yaml

# Configure kubectl to use the new cluster
aws eks update-kubeconfig --name eloqdb-demo --region ap-northeast-1

# Verify the configuration
kubectl config get-contexts

# Switch to the cluster context
kubectl config use-context <YOUR_CLUSTER_CONTEXT>
```

### 1.6 Scale Node Group

After the cluster is created successfully, scale the node group from 0 to 1 node:

```bash
# Scale the node group to 1 node
eksctl scale nodegroup \
  --cluster=eloqdb-demo \
  --name=ap-northeast-1a-i4i-xlarge \
  --nodes=1 \
  --region=ap-northeast-1

# Verify the node is ready
kubectl get nodes

# Check node details
kubectl describe node
```

> **Note:** The initial configuration sets `desiredCapacity: 0` to avoid unnecessary costs during setup. After scaling up, you can adjust the node count based on your workload requirements using the same `eksctl scale nodegroup` command.


## Step 2: Configure IAM OIDC Provider

The IAM OIDC provider allows Kubernetes service accounts to assume IAM roles, enabling pods to access AWS services securely.

```bash
# Check if OIDC issuer URL exists
aws eks describe-cluster --name eloqdb-demo --query "cluster.identity.oidc.issuer" --region ap-northeast-1 --output text

# Associate IAM OIDC provider with the cluster
eksctl utils associate-iam-oidc-provider --cluster eloqdb-demo --region ap-northeast-1 --approve
```

## Step 3: Install Required Components

### 3.1 Install AWS EBS CSI Driver

The EBS CSI driver enables dynamic provisioning of EBS volumes for persistent storage.

```bash
# Create IAM service account for EBS CSI driver
eksctl create iamserviceaccount \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster eloqdb-demo \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --region ap-northeast-1 \
  --approve

# Add Helm repository
helm repo add aws-ebs-csi-driver https://kubernetes-sigs.github.io/aws-ebs-csi-driver
helm repo update

# Install the driver
helm upgrade --install aws-ebs-csi-driver \
    --namespace kube-system \
    --set controller.serviceAccount.create=false \
    --set controller.serviceAccount.name=ebs-csi-controller-sa \
    aws-ebs-csi-driver/aws-ebs-csi-driver

# Verify installation
kubectl get pod -n kube-system -l "app.kubernetes.io/name=aws-ebs-csi-driver,app.kubernetes.io/instance=aws-ebs-csi-driver"
```

### 3.2 Install AWS Load Balancer Controller

The AWS Load Balancer Controller manages ALB and NLB for Kubernetes services.

#### Create IAM Policy

```bash
cat > aws-lb-controller-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAddresses",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeVpcs",
                "ec2:DescribeVpcPeeringConnections",
                "ec2:DescribeSubnets",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeInstances",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DescribeTags",
                "ec2:GetCoipPoolUsage",
                "ec2:DescribeCoipPools",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeListenerAttributes",
                "elasticloadbalancing:DescribeListenerCertificates",
                "elasticloadbalancing:DescribeSSLPolicies",
                "elasticloadbalancing:DescribeRules",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetGroupAttributes",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:DescribeTags"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cognito-idp:DescribeUserPoolClient",
                "acm:ListCertificates",
                "acm:DescribeCertificate",
                "iam:ListServerCertificates",
                "iam:GetServerCertificate",
                "waf-regional:GetWebACL",
                "waf-regional:GetWebACLForResource",
                "waf-regional:AssociateWebACL",
                "waf-regional:DisassociateWebACL",
                "wafv2:GetWebACL",
                "wafv2:GetWebACLForResource",
                "wafv2:AssociateWebACL",
                "wafv2:DisassociateWebACL",
                "shield:GetSubscriptionState",
                "shield:DescribeProtection",
                "shield:CreateProtection",
                "shield:DeleteProtection"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateSecurityGroup"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags"
            ],
            "Resource": "arn:aws:ec2:*:*:security-group/*",
            "Condition": {
                "StringEquals": {
                    "ec2:CreateAction": "CreateSecurityGroup"
                },
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateTags",
                "ec2:DeleteTags"
            ],
            "Resource": "arn:aws:ec2:*:*:security-group/*",
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:DeleteSecurityGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateTargetGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:CreateListener",
                "elasticloadbalancing:DeleteListener",
                "elasticloadbalancing:CreateRule",
                "elasticloadbalancing:DeleteRule"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:RemoveTags"
            ],
            "Resource": [
                "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
            ],
            "Condition": {
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:RemoveTags"
            ],
            "Resource": [
                "arn:aws:elasticloadbalancing:*:*:listener/net/*/*/*",
                "arn:aws:elasticloadbalancing:*:*:listener/app/*/*/*",
                "arn:aws:elasticloadbalancing:*:*:listener-rule/net/*/*/*",
                "arn:aws:elasticloadbalancing:*:*:listener-rule/app/*/*/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:AddTags"
            ],
            "Resource": [
                "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
            ],
            "Condition": {
                "StringEquals": {
                    "elasticloadbalancing:CreateAction": [
                        "CreateTargetGroup",
                        "CreateLoadBalancer"
                    ]
                },
                "Null": {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:SetIpAddressType",
                "elasticloadbalancing:SetSecurityGroups",
                "elasticloadbalancing:SetSubnets",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:ModifyTargetGroup",
                "elasticloadbalancing:ModifyTargetGroupAttributes",
                "elasticloadbalancing:DeleteTargetGroup"
            ],
            "Resource": "*",
            "Condition": {
                "Null": {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:RegisterTargets",
                "elasticloadbalancing:DeregisterTargets"
            ],
            "Resource": "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticloadbalancing:SetWebAcl",
                "elasticloadbalancing:ModifyListener",
                "elasticloadbalancing:AddListenerCertificates",
                "elasticloadbalancing:RemoveListenerCertificates",
                "elasticloadbalancing:ModifyRule"
            ],
            "Resource": "*"
        }
    ]
}

EOF

# Create the IAM policy
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://aws-lb-controller-policy.json
```

#### Deploy the Load Balancer Controller

```bash
# Create IAM service account
eksctl create iamserviceaccount \
    --cluster=eloqdb-demo \
    --namespace=kube-system \
    --name=aws-load-balancer-controller \
    --attach-policy-arn=arn:aws:iam::<YOUR_ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy \
    --region ap-northeast-1 \
    --approve

# Add Helm repository
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# Install the controller
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=eloqdb-demo \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Verify installation
kubectl get deployment -n kube-system aws-load-balancer-controller
```

### 3.3 Install OpenEBS

OpenEBS provides local persistent volumes with XFS quota support.

```bash
# Add Helm repository
helm repo add openebs https://openebs.github.io/openebs
helm repo update

# Install OpenEBS (local PV provisioner only)
helm install openebs --namespace openebs openebs/openebs \
  --set engines.local.lvm.enabled=false \
  --set engines.local.zfs.enabled=false \
  --set engines.replicated.mayastor.enabled=false \
  --create-namespace

# Verify installation
kubectl get pods -n openebs
```

### 3.4 Install cert-manager

cert-manager is required by the Eloq Operator for webhook certificate management.

```bash
# Install cert-manager
helm install cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --version v1.19.0 \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true

# Verify installation
kubectl get pods -n cert-manager
```

## Step 4: Install Eloq Operator

The Eloq Operator manages the lifecycle of EloqKV/EloqDoc database clusters.

```bash
# Add EloqData Helm repository
helm repo add eloqdata https://eloqdata.github.io/eloq-charts/
helm repo update

# Install the operator
helm install eloq-operator eloqdata/eloq-operator \
  --namespace eloq-operator-system \
  --create-namespace

# Verify operator installation
kubectl get pods -n eloq-operator-system
```

## Step 5: Set Up IAM for Database Clusters

### 5.1 Create IAM Policy for Database Resources

EloqKV/EloqDoc requires access to S3 for storing data and log service.

```bash
cat > EloqDBResourceIAMPolicy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3Access",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::*"
        },
        {
            "Sid": "EC2Permissions",
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeSubnets",
                "ec2:DescribeNetworkInterfaces",
                "ec2:CreateNetworkInterface"
            ],
            "Resource": "*"
        },
        {
            "Sid": "EKSAccess",
            "Effect": "Allow",
            "Action": [
                "eks:DescribeCluster"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Create the IAM policy
aws iam create-policy \
  --policy-name EloqDBResourceIAMPolicy \
  --policy-document file://EloqDBResourceIAMPolicy.json
```

### 5.2 Create Kubernetes ServiceAccount with IAM Role

Create a namespace and service account that can assume the IAM role.

```bash
# Create namespace for EloqKV/EloqDoc
kubectl create namespace eloqdb-clusters

# Create service account with IAM role binding
eksctl create iamserviceaccount \
  --cluster eloqdb-demo \
  --namespace eloqdb-clusters \
  --name eloq-aws-access \
  --attach-policy-arn arn:aws:iam::<YOUR_ACCOUNT_ID>:policy/EloqDBResourceIAMPolicy \
  --region ap-northeast-1 \
  --approve

# Verify service account creation
kubectl get sa -n eloqdb-clusters eloq-aws-access -o yaml
```

## Next Steps

Now that you have the Eloq Operator installed and the necessary IAM permissions configured, you can proceed to create your first database cluster.

Refer to the **[Manage Templates](../usage/template)** and **[Manage Claims](../usage/claim)** guides to learn how to:
1. Create a **Cluster Template** (as an administrator).
2. Create a **Cluster Claim** (as a user).
3. Connect to your database and manage its lifecycle.

