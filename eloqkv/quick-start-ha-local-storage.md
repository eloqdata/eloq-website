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

## 5. Option C: EloqStore Local Storage HA (No Object Store)

You can also run a tx/standby/voter cluster on **EloqStore in local mode**, with no object storage. In this mode standby replicas sync data from the master with `rsync` instead of through a shared bucket.

Use an EloqStore backend **without** `eloq_store_cloud_store_path`:

```yaml
deployment:
  cluster_name: "eloqkv-ha-eloqstore-local"
  product: "EloqKV"
  version: "1.3.1"
  install_dir: "/home/${USER}"
  cluster_mode: true
  enable_wal: false
  enable_io_uring: true

  tx_service:
    tx_host_ports: [10.0.0.11:6379]
    standby_host_ports: [10.0.0.12:6379]
    voter_host_ports: [10.0.0.13:6379]
    enable_cache_replacement: on

  storage_service:
    eloqdss:
      backend: !eloqstore
        # Optional: cap on concurrent standby rsync/ssh jobs per node (default 100).
        eloq_store_standby_max_concurrency: 100

  hardware:
    10.0.0.11: { cpu: 8, memory: 32768 }
    10.0.0.12: { cpu: 8, memory: 32768 }
    10.0.0.13: { cpu: 4, memory: 16384 }
```

EloqStore standby replication turns on automatically because `standby_host_ports` is set; the replication source is assigned at runtime, so you do not configure it in YAML. This requires an EloqStore-backed EloqKV build.

> Object-storage modes (Option A and Option B above) replicate through the shared bucket and do **not** use `rsync` or SSH. The SSH requirements below apply only to this local-storage mode.

### 5.1 SSH Requirements for Local Standby

How the replica pulls from the master depends on placement:

- **Same machine** (all nodes share one IP, different ports): the replica syncs with a local `rsync` file copy. **No SSH or passwordless login is required.** Co-located master and replica must use **distinct data directories** — this is the default (paths are port-distinct), or set them explicitly per node with `eloq_data_path` / `eloq_store_data_path_list` (see the [Topology Reference](./topology-reference#deploymenthardware)).
- **Cross machine** (nodes on different hosts): the replica pulls with `rsync` over `ssh` and runs `ssh` to list remote files. These run non-interactively, so you must prepare:
  1. **Passwordless, key-based SSH** from each replica host to the master host, as the EloqKV run user:
     ```shell
     # On each standby/replica host, as the run user:
     ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519   # if no key yet
     ssh-copy-id -i ~/.ssh/id_ed25519.pub <run-user>@<master-host>
     ssh <run-user>@<master-host> true   # confirm it connects with no prompt
     ```
  2. The master host key already in the replica's `~/.ssh/known_hosts` (the `ssh` above records it). Otherwise `ssh` blocks on the host-key prompt until it times out.
  3. The login account having read access to the master's EloqStore data directories.

  This node-to-node SSH is separate from `connection.auth`, which `eloqctl` uses only for deployment.

### 5.2 SSH Server Concurrency on the Master

Each replica can launch up to `eloq_store_standby_max_concurrency` (default `100`) concurrent `rsync`/`ssh` connections, and every replica pulls from the master. The master's SSH daemon must accept the total:

```text
required sshd concurrency  ≥  number of standby/replica nodes  ×  eloq_store_standby_max_concurrency
```

The default `sshd` limit is low (`MaxStartups 10:30:100`), so concurrent pulls get throttled or refused and `rsync` fails. Raise it on the **master** host in `/etc/ssh/sshd_config`, then restart `sshd`:

```text
# Example for 2 replicas × 100 = 200 concurrent connections
MaxStartups 200:30:400
MaxSessions 200
```

```shell
sudo systemctl restart ssh   # or: sudo systemctl restart sshd
```

Either lower `eloq_store_standby_max_concurrency` or raise the master's `MaxStartups`/`MaxSessions` so the product fits within the SSH server limit.

## 6. After Deployment

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
