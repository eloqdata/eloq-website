---
title: Deploy High Availability Cluster with EloqStore Cloud
description: Deploy a highly available EloqKV cluster on EloqStore Cloud with MinIO using eloqctl.
summary: Learn how to deploy a highly available EloqKV cluster on EloqStore Cloud.
---

# Deploy a High Availability Cluster with EloqStore Cloud

This page covers clustered EloqKV with primary, standby, and voter nodes backed by `EloqStore Cloud`. This is the topology family exercised by `eloq_waiter/tests/e2e/topology.eloqstore-cloud.yaml`.

Compared with the `RocksDB Cloud + MinIO` variant:

- the cluster shape is the same: tx + standby + voter + log service
- storage moves from `storage_service.rocksdb` to `storage_service.eloqdss.backend: !eloqstore`
- the tx/standby/voter topology remains the same
- MinIO is still used as the backing object store in this example
- WAL and log service configuration remain separate and still point at object storage

## 1. Prerequisites

- Review [Deploy Single Node Instance](./quick-start) first.
- If you want the `RocksDB Cloud + MinIO` version instead, use [Deploy High Availability Cluster with MinIO](./quick-start-ha-local-storage).
- Review the host checklist:
  - [Configuration Checklist](./prerequisite)

Before using `eloqctl`, complete the target-host preparation checklist on every machine. That includes passwordless SSH from the control machine, passwordless `sudo`, and the documented host-level settings for limits, hostname, DNS, and core dumps.

The detailed procedure is in [Configuration Checklist](./prerequisite). `eloqctl` assumes the machines are already prepared; it does not bootstrap that initial host state for you.

`eloqctl` does not provision MinIO, S3, GCS, or any other object storage service. It only consumes an existing endpoint from the topology YAML. Before launching EloqKV, deploy the object store and create the bucket or cloud path it will use.

## 1.1 Deploy a Minimal MinIO for Testing

For a local or lab setup, you can bring up a simple MinIO instance like this:

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

Create the bucket used by EloqKV and EloqStore:

```shell
docker run --rm --network host --entrypoint /bin/sh quay.io/minio/mc -lc '
  mc alias set local http://127.0.0.1:9000 minioadmin minioadmin &&
  mc mb -p local/eloqservice || true
'
```

You can then use these values in the YAML:

- endpoint: `http://<minio-host>:9000`
- access key: `minioadmin`
- secret key: `minioadmin`
- bucket or store path base: `eloqservice`

For production, use a real object-storage deployment plan with durable disks, TLS, rotated credentials, and backup policies.

## 2. Create an EloqStore-Cloud HA Topology

Start from the bundled EloqStore-cloud example:

```shell
cp "${ELOQCTL_HOME:-$HOME/.eloqctl}/config/examples/eloqkv_eloqstore_cloud_standby_with_voter.yaml" \
  ./eloqkv-ha-eloqstore-cloud.yaml
```

Then update it to a current valid topology like this:

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

## 3. EloqStore Cloud Configuration Notes

- For the complete field-by-field reference, see [Eloqctl Topology Reference](./topology-reference).
- `cluster_mode: true` is required.
- Keep `install_dir`, `enable_wal`, `enable_io_uring`, and `enable_tls` explicit in the YAML. Do not omit these fields in deployment examples.
- `hardware` is required for every tx, standby, and voter host.
- `storage_service.eloqdss.backend: !eloqstore` is the EloqStore Cloud shape.
- `eloq_store_cloud_provider: "minio"` points EloqStore Cloud at a MinIO backend.
- `eloq_store_cloud_store_path` is the logical cloud store path used by EloqStore.
- `eloq_store_reuse_local_files` and `eloq_store_prewarm_cloud_cache` are commonly enabled in this mode.
- `log_service` still needs its own object-store settings for log data.
- This page intentionally mirrors the structure used in `tests/e2e/topology.eloqstore-cloud.yaml`.

EloqStore-cloud fields:

- `storage_service.eloqdss.backend.eloq_store_cloud_store_path`: Cloud store path used by EloqStore.
- `storage_service.eloqdss.backend.eloq_store_cloud_provider`: Cloud backend provider such as `minio`, `aws`, or `gcs`.
- `storage_service.eloqdss.backend.eloq_store_cloud_access_key`: Access key for MinIO or AWS style backends.
- `storage_service.eloqdss.backend.eloq_store_cloud_secret_key`: Secret key for MinIO or AWS style backends.
- `storage_service.eloqdss.backend.eloq_store_cloud_endpoint`: Object-store endpoint URL.
- `storage_service.eloqdss.backend.eloq_store_cloud_region`: Logical region value used by the backend.
- `storage_service.eloqdss.backend.eloq_store_cloud_verify_ssl`: Whether the endpoint TLS certificate is verified.
- `storage_service.eloqdss.backend.eloq_store_reuse_local_files`: Reuse previously downloaded local cache files.
- `storage_service.eloqdss.backend.eloq_store_prewarm_cloud_cache`: Prewarm cache from object storage at startup.

Shared cluster fields:

- `tx_service.tx_host_ports`: Primary node list.
- `tx_service.standby_host_ports`: Standby node list or grouped standby topology.
- `tx_service.voter_host_ports`: Voter node list or grouped voter topology.
- `tx_service.requirepass`: Optional Redis password used by client connections and some management operations.
- `log_service.nodes`: Log service placement.
- `log_service.bucket_name`: Bucket used by the log service.
- `log_service.bucket_prefix`: Prefix for log objects.
- `log_service.endpoint`: Object-store endpoint used by the log service.

## 4. Validate and Launch

Run local validation first:

```shell
eloqctl check ./eloqkv-ha-eloqstore-cloud.yaml
```

Launch the cluster:

```shell
eloqctl launch ./eloqkv-ha-eloqstore-cloud.yaml
```

Wait until the cluster is healthy:

```shell
eloqctl status eloqkv-ha-eloqstore-cloud --wait 120
```

## 5. Operate the Cluster

Print a client command:

```shell
CLIENT=$(eloqctl -q connect eloqkv-ha-eloqstore-cloud)
echo "$CLIENT"
```

Preview and apply supported topology changes later:

```shell
eloqctl plan ./eloqkv-ha-eloqstore-cloud.yaml
eloqctl apply ./eloqkv-ha-eloqstore-cloud.yaml
```

Export the saved topology from local state:

```shell
eloqctl export eloqkv-ha-eloqstore-cloud --output ./eloqkv-ha-eloqstore-cloud.exported.yaml
```
