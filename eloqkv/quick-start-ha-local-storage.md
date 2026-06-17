---
title: Deploy High Availability Cluster with MinIO
description: Deploy a highly available EloqKV cluster with MinIO using either RocksDB Cloud or EloqStore Cloud.
summary: Deploy a highly available EloqKV cluster backed by MinIO.
---

# Deploy a High Availability EloqKV Cluster with MinIO

For a clustered EloqKV deployment with primary, standby, and voter nodes, use MinIO or another S3-compatible service as the object-storage backend.

With `eloqctl`, the two MinIO-backed cluster shapes you should use are:

1. `RocksDB Cloud + MinIO`
2. `EloqStore Cloud + MinIO`

Both deployment options use:

1. `cluster_mode: true`
2. tx, standby, and voter nodes
3. a `log_service` section
4. a MinIO endpoint that you provision separately

## 1. Prerequisites

- Review [Deploy Single Node Instance](./quick-start) first.
- Review the host checklist:
  - [Configuration Checklist](./prerequisite)
- Prepare a reachable MinIO service and bucket.
- Make sure the control machine can SSH to every target host.

Before running `eloqctl`, prepare every target machine with the steps in [Configuration Checklist](./prerequisite).

`eloqctl` does not deploy MinIO or any other S3-compatible object store for you. You must provision the object storage service first, then point the topology YAML at that endpoint.

## 1.1 Deploy a Minimal MinIO for Testing

For a lab or local test environment, one simple way to start MinIO is:

```shell
mkdir -p /data/minio

docker run -d \
  --name eloq-minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  -v /data/minio:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

Then create the bucket used by EloqKV. For example, with the MinIO client:

```shell
docker run --rm --network host --entrypoint /bin/sh quay.io/minio/mc -lc '
  mc alias set local http://127.0.0.1:9000 minioadmin minioadmin &&
  mc mb -p local/eloqservice || true
'
```

After that, use:

- endpoint: `http://<minio-host>:9000`
- access key: `minioadmin`
- secret key: `minioadmin`
- bucket: `eloqservice`

For production, deploy MinIO with durable disks, proper credentials, TLS, and backup policies. The example above is only a minimal test setup.

## 2. Choose the Storage Backend

Single-node EloqKV can use local storage such as:

```yaml
storage_service:
  rocksdb: !LOCAL
```

For a tx/standby/voter cluster backed by MinIO, choose one of these storage backends:

- `RocksDB Cloud + MinIO`
- `EloqStore Cloud + MinIO`

For the complete field-by-field YAML reference, see [Eloqctl Topology Reference](./topology-reference).

## 3. Option A: Deploy with RocksDB Cloud + MinIO

Create a topology like this:

```yaml
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"

deployment:
  cluster_name: "eloqkv-ha-rocksdb-cloud"
  product: "EloqKV"
  version: "latest"
  install_dir: "/home/${USER}"
  cluster_mode: true
  enable_wal: true
  enable_io_uring: false
  enable_tls: true
  checkpointer_interval: 120

  tx_service:
    tx_host_ports: [10.0.0.11:6379]
    standby_host_ports: [10.0.0.12:6379]
    voter_host_ports: [10.0.0.13:6379]
    enable_cache_replacement: on

  log_service:
    nodes:
      - host: 10.0.0.13
        port: 9000
        data_dir:
          - "/home/${USER}/eloqkv-ha-rocksdb-cloud/wal_eloqkv"
    replica: 1
    aws_access_key_id: "minioadmin"
    aws_secret_key: "minioadmin"
    bucket_name: "eloqservice"
    endpoint: "http://10.0.0.20:9000"

  storage_service:
    rocksdb: !MINIO
      aws_access_key_id: "minioadmin"
      aws_secret_key: "minioadmin"
      bucket_name: "eloqservice"
      bucket_prefix: "store"
      endpoint: "http://10.0.0.20:9000"

  hardware:
    10.0.0.11:
      cpu: 8
      memory: 32768
    10.0.0.12:
      cpu: 8
      memory: 32768
    10.0.0.13:
      cpu: 4
      memory: 16384
```

Use this option if you want the KV layer to run on RocksDB Cloud and use MinIO for object storage.

Validate and launch:

```shell
eloqctl check ./eloqkv-ha-rocksdb-cloud.yaml
eloqctl launch ./eloqkv-ha-rocksdb-cloud.yaml
eloqctl status eloqkv-ha-rocksdb-cloud --wait 120
```

## 4. Option B: Deploy with EloqStore Cloud + MinIO

Start from the bundled example:

```shell
cp "${ELOQCTL_HOME:-$HOME/.eloqctl}/config/examples/eloqkv_eloqstore_cloud_standby_with_voter.yaml" \
  ./eloqkv-ha-eloqstore-cloud.yaml
```

Then use a topology like this:

```yaml
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"

deployment:
  cluster_name: "eloqkv-ha-eloqstore-cloud"
  product: "EloqKV"
  version: "latest"
  install_dir: "/home/${USER}"
  cluster_mode: true
  enable_wal: false
  enable_io_uring: false
  enable_tls: true
  checkpointer_interval: 120

  tx_service:
    tx_host_ports: [10.0.0.11:6379]
    standby_host_ports: [10.0.0.12:6379]
    voter_host_ports: [10.0.0.13:6379]
    requirepass: "testpass"

  log_service:
    nodes:
      - host: 10.0.0.13
        port: 9000
        data_dir:
          - "/home/${USER}/log-data"
    replica: 1
    aws_access_key_id: "minioadmin"
    aws_secret_key: "minioadmin"
    bucket_name: "eloqservice"
    bucket_prefix: "wal"
    endpoint: "http://10.0.0.20:9000"

  storage_service:
    eloqdss:
      backend: !eloqstore
        eloq_store_cloud_store_path: "storeeloqservice"
        eloq_store_cloud_provider: "minio"
        eloq_store_cloud_access_key: "minioadmin"
        eloq_store_cloud_secret_key: "minioadmin"
        eloq_store_cloud_endpoint: "http://10.0.0.20:9000"
        eloq_store_cloud_region: "us-east-1"
        eloq_store_cloud_verify_ssl: false
        eloq_store_reuse_local_files: true
        eloq_store_prewarm_cloud_cache: true

  hardware:
    10.0.0.11:
      cpu: 8
      memory: 32768
    10.0.0.12:
      cpu: 8
      memory: 32768
    10.0.0.13:
      cpu: 4
      memory: 16384
```

Use this option if you want the same cluster shape but store data through `EloqStore Cloud`.

Validate and launch:

```shell
eloqctl check ./eloqkv-ha-eloqstore-cloud.yaml
eloqctl launch ./eloqkv-ha-eloqstore-cloud.yaml
eloqctl status eloqkv-ha-eloqstore-cloud --wait 120
```

## 5. After Deployment

Print a client command for either cluster:

```shell
CLIENT=$(eloqctl -q connect <cluster-name>)
echo "$CLIENT"
```

Preview and apply supported topology changes later:

```shell
eloqctl plan ./topology.yaml
eloqctl apply ./topology.yaml
```
