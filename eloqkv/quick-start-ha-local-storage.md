---
title: Deploy High Availability Cluster with MinIO
description: Deploy a highly available EloqKV cluster with primary, standby, and voter nodes using RocksDB Cloud on MinIO.
summary: Deploy a highly available EloqKV cluster backed by MinIO.
---

# Deploy a High Availability EloqKV Cluster with MinIO

For a clustered EloqKV deployment with primary, standby, and voter nodes, the storage layer should not use plain local `RocksDB`.

The current deployment model for this shape is:

1. `cluster_mode: true`
2. tx, standby, and voter nodes
3. `RocksDB Cloud` as the storage backend
4. an S3-compatible object store such as `MinIO`
5. a `log_service` section describing where log service runs and where its data is stored

This page shows the MinIO-based setup because it is the easiest way to try the full HA topology in a lab environment.

## 1. Prerequisites

- Review [Deploy Single Node Instance](./quick-start) first.
- Review the host checklist:
  - [Configuration Checklist](./prerequisite)
- Prepare a reachable MinIO service and bucket.
- Make sure the control machine can SSH to every target host.

Before using `eloqctl`, complete the target-host preparation checklist on every machine. That includes passwordless SSH from the control machine, passwordless `sudo`, and the documented host-level settings for limits, hostname, DNS, and core dumps.

The detailed procedure is in [Configuration Checklist](./prerequisite). `eloqctl` assumes the machines are already prepared; it does not bootstrap that initial host state for you.

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

## 2. Why MinIO or S3 Is Required

Single-node EloqKV can use local storage such as:

```yaml
storage_service:
  rocksdb: !LOCAL
```

But once you deploy a clustered topology with primary and standby nodes, the documentation should switch to `RocksDB Cloud`, backed by an object store such as:

- `!MINIO`
- `!S3`

That is the correct model for standby/failover deployments.

## 3. Create the HA Topology YAML

There is no bundled standby-with-voter MinIO example yet, so create a topology like this:

```yaml
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"

deployment:
  cluster_name: "eloqkv-ha-minio"
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
          - "/home/${USER}/eloqkv-ha-minio/wal_eloqkv"
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

## 4. Topology Notes

- For the complete field-by-field reference, see [Eloqctl Topology Reference](./topology-reference).
- `cluster_mode: true` is required.
- Keep `install_dir`, `enable_wal`, `enable_io_uring`, and `enable_tls` explicit in the YAML. Do not rely on omitted defaults in deployment examples.
- `hardware` is required for every tx, standby, and voter host.
- `storage_service.rocksdb: !MINIO` means RocksDB Cloud uses MinIO as the object store backend.
- `bucket_name` must already exist or be created as part of your MinIO setup.
- `bucket_prefix` isolates this cluster's RocksDB Cloud objects inside the bucket.
- `log_service` should point to its object-store target explicitly. In this example it uses the same MinIO service as the storage layer, but that is a deployment choice rather than a rule derived from `enable_wal`.

MinIO-specific fields:

- `storage_service.rocksdb.aws_access_key_id`: MinIO access key.
- `storage_service.rocksdb.aws_secret_key`: MinIO secret key.
- `storage_service.rocksdb.bucket_name`: Bucket holding RocksDB Cloud objects.
- `storage_service.rocksdb.bucket_prefix`: Prefix used by this cluster inside the bucket.
- `storage_service.rocksdb.endpoint`: MinIO endpoint URL.
- `log_service.aws_access_key_id`: MinIO access key for log uploads.
- `log_service.aws_secret_key`: MinIO secret key for log uploads.
- `log_service.bucket_name`: Bucket for log objects.
- `log_service.endpoint`: MinIO endpoint URL used by the log service.

Cluster-shape fields:

- `tx_service.tx_host_ports`: Primary node list.
- `tx_service.standby_host_ports`: Standby node list or grouped standby topology.
- `tx_service.voter_host_ports`: Voter node list or grouped voter topology.
- `tx_service.enable_cache_replacement`: Whether cold data may be evicted from memory.
- `tx_service.requirepass`: Optional Redis password for client access.

## 5. Validate and Launch

Validate the YAML first:

```shell
eloqctl check ./eloqkv-ha-minio.yaml
```

Launch the cluster:

```shell
eloqctl launch ./eloqkv-ha-minio.yaml
```

Wait for the cluster to become healthy:

```shell
eloqctl status eloqkv-ha-minio --wait 120
```

## 6. Operate the Cluster

Print a client command:

```shell
CLIENT=$(eloqctl -q connect eloqkv-ha-minio)
echo "$CLIENT"
```

Preview and apply supported topology changes later:

```shell
eloqctl plan ./eloqkv-ha-minio.yaml
eloqctl apply ./eloqkv-ha-minio.yaml
```
