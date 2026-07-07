---
title: Deployment YAML Reference
summary: Reference for the EloqKV deployment YAML used by eloqctl.
---

# Deployment YAML Reference

This page describes the YAML file used by `eloqctl check`, `eloqctl launch`, `eloqctl plan`, and `eloqctl apply`.

This YAML defines the deployment shape, storage backend, monitor placement, and host sizing.

## Required Deployment Fields

Write these fields explicitly:

- `deployment.cluster_name`
- `deployment.product`
- `deployment.version`
- `deployment.install_dir`
- `deployment.enable_wal`
- `deployment.enable_io_uring`
- `deployment.enable_tls`
- `deployment.cluster_mode`
- `deployment.hardware`

`deployment.hardware` must contain every host used by `tx_host_ports`, `standby_host_ports`, and `voter_host_ports`.

`hardware` keys may be `ip:port` (recommended) or `ip` (legacy). Use an `ip:port` key to size each node individually — this is required when several EloqKV processes run on one machine (same IP, different ports). A bare `ip` key applies to every node on that host and is used as a fallback when no matching `ip:port` key exists.

## Top-Level Shape

```yaml
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"

deployment:
  cluster_name: "eloqkv-cluster"
  product: "EloqKV"
  version: "1.3.1"
  install_dir: "/home/${USER}"
  enable_wal: false
  enable_io_uring: false
  enable_tls: false
  cluster_mode: false

  tx_service:
    tx_host_ports: [127.0.0.1:6389]

  storage_service:
    rocksdb: !LOCAL

  hardware:
    127.0.0.1:
      cpu: 2
      memory: 2048
```

## `connection`

- `connection.username`: SSH username used by the control machine.
- `connection.auth_type`: SSH authentication type. Current examples use `keypair`.
- `connection.auth.keypair`: Private key path on the control machine.
- `connection.ssh_endpoints`: Optional mapping from deployment host to the SSH endpoint reachable from the control machine.
- `connection.service_endpoints`: Optional mapping from deployment service address to the service endpoint reachable from the control machine.

Use `ssh_endpoints` and `service_endpoints` when the control machine cannot reach the deployment hosts or service ports directly, such as in Docker, NAT, or bastion setups.

## `deployment`

- `deployment.cluster_name`: Unique cluster name in local `eloqctl` state.
- `deployment.product`: Must be `EloqKV`.
- `deployment.version`: EloqKV release version to deploy. Must be a concrete published release such as `1.3.1`. `latest` is no longer published and will not resolve to a downloadable artifact. Run `eloqctl versions` to list available versions.
- `deployment.install_dir`: Base directory on the target host.
- `deployment.enable_wal`: Whether each write is appended to WAL before completion.
- `deployment.enable_io_uring`: Whether to use the `io_uring` I/O path.
- `deployment.enable_tls`: Whether to enable TLS for EloqKV client traffic.
- `deployment.bind_all`: Optional. Whether each EloqKV node listens on all interfaces (`0.0.0.0`) instead of only the address given in `tx_host_ports`. Defaults to `false`. Set it to `true` when clients need to reach a node through an address other than its configured one, such as `127.0.0.1` on a node deployed with an internal IP.
- `deployment.cluster_mode`: `false` for single-node topology, `true` for clustered tx/standby/voter topology.
- `deployment.checkpointer_interval`: Checkpoint interval in seconds.
- `deployment.maxclients`: Optional Redis client connection limit.
- `deployment.environment_variables`: Optional environment variables exported before startup. This is commonly used for cloud credentials.

## `deployment.tx_service`

- `deployment.tx_service.tx_host_ports`: Required list of tx node `host:port` entries.
- `deployment.tx_service.standby_host_ports`: Optional standby topology. Use `|` to separate multiple standbys for one tx node and `,` to separate different tx groups.
- `deployment.tx_service.voter_host_ports`: Optional voter topology using the same grouping rule.
- `deployment.tx_service.requirepass`: Optional Redis password.
- `deployment.tx_service.enable_cache_replacement`: Whether cold data can be evicted from memory cache.
- `deployment.tx_service.client_port`: Optional client-port override.
- `deployment.tx_service.max_standby_lag`: Optional standby lag threshold used by failover-related flows.

## `deployment.log_service`

`log_service` describes where log service runs and where its data is stored. It is separate from the meaning of `enable_wal`.

- `deployment.log_service.nodes`: Log service node list.
- `deployment.log_service.nodes[].host`: Host running one log service process.
- `deployment.log_service.nodes[].port`: Log service port.
- `deployment.log_service.nodes[].data_dir`: One or more log-service data directories on that host.
- `deployment.log_service.replica`: Log replica count.
- `deployment.log_service.bthread_concurrency`: Optional log-service concurrency setting.
- `deployment.log_service.aws_access_key_id`: Access key for S3-compatible object storage.
- `deployment.log_service.aws_secret_key`: Secret key for the same object storage.
- `deployment.log_service.bucket_name`: Bucket used by the log service.
- `deployment.log_service.bucket_prefix`: Optional object prefix for log data.
- `deployment.log_service.region`: Region for AWS-style backends.
- `deployment.log_service.endpoint`: Endpoint for MinIO or another S3-compatible service.

## `deployment.storage_service`

Common shapes:

- `deployment.storage_service.rocksdb: !LOCAL`: Embedded local RocksDB.
- `deployment.storage_service.rocksdb: !MINIO`: RocksDB Cloud backed by MinIO.
- `deployment.storage_service.rocksdb: !S3`: RocksDB Cloud backed by AWS S3 or another S3-compatible service.
- `deployment.storage_service.rocksdb: !GCS`: RocksDB Cloud backed by Google Cloud Storage.
- `deployment.storage_service.rocksdb: !ELOQDSS_ROCKSDB`: RocksDB served by a separate Data Store Service (DSS) process; requires `peer_host_ports`.
- `deployment.storage_service.eloqdss.backend: !eloqstore`: EloqStore backend (local or cloud).
- Omit `storage_service` entirely for a pure in-memory deployment.

### Choosing a Storage Backend

| Goal | Use |
| --- | --- |
| Single node or dev/test on local disk | `rocksdb: !LOCAL` |
| KV layer on RocksDB Cloud + object storage | `rocksdb: !S3` (AWS S3), `!MINIO` (self-hosted S3), or `!GCS` (Google Cloud Storage) |
| RocksDB through a decoupled remote DSS process | `rocksdb: !ELOQDSS_ROCKSDB` with `peer_host_ports` |
| EloqStore on local disk (single node or local master/standby, no object store) | `eloqdss.backend: !eloqstore` with no `eloq_store_cloud_store_path` |
| EloqStore reading/writing object storage directly | `eloqdss.backend: !eloqstore` with `eloq_store_cloud_store_path` + `eloq_store_cloud_provider` (`aws`/`minio` → S3-compatible, `gcs` → GCS) |
| In-memory only, no durable backend | omit `storage_service` |

EloqStore mode is selected by `eloq_store_cloud_store_path`: empty or unset means local mode; a non-empty value enables cloud mode.

### RocksDB Cloud Fields

- `storage_service.rocksdb.aws_access_key_id`
- `storage_service.rocksdb.aws_secret_key`
- `storage_service.rocksdb.bucket_name`
- `storage_service.rocksdb.bucket_prefix`
- `storage_service.rocksdb.endpoint`
- `storage_service.rocksdb.region`
- `storage_service.rocksdb.target_file_size_base`
- `storage_service.rocksdb.sst_file_cache_size`

### EloqStore Cloud Fields

- `storage_service.eloqdss.backend.eloq_store_cloud_store_path`: Bucket/path that enables cloud mode (non-empty turns cloud mode on).
- `storage_service.eloqdss.backend.eloq_store_cloud_provider`: `aws`, `minio`, or `gcs`.
- `storage_service.eloqdss.backend.eloq_store_cloud_access_key`: Access key (required for `aws`/`minio`).
- `storage_service.eloqdss.backend.eloq_store_cloud_secret_key`: Secret key (required for `aws`/`minio`).
- `storage_service.eloqdss.backend.eloq_store_cloud_endpoint`: Object-storage endpoint URL. Specify it to target a custom or S3-compatible endpoint such as MinIO (`http://<host>:9000`) or GCS (`https://storage.googleapis.com`); overrides the provider's default endpoint.
- `storage_service.eloqdss.backend.eloq_store_cloud_region`: Storage region (for example `us-east-1`).
- `storage_service.eloqdss.backend.eloq_store_reuse_local_files`: Reuse local cache files across restarts.
- `storage_service.eloqdss.backend.eloq_store_prewarm_cloud_cache`: Prewarm the local cache from cloud on startup.

### EloqStore Common Fields

These apply to both local and cloud mode:

- `storage_service.eloqdss.backend.eloq_store_data_path_list`: EloqStore data directory(ies), comma-separated. In local mode this is where data is stored; in cloud mode it is the local data/cache directory. Optional — defaults to `{install_dir}/EloqKV/data/port-{port}/eloq_dss/eloqstore_data`, which is already distinct per node. For per-node overrides (for example, placing co-located nodes on different disks), set it per node under `hardware` instead (see [`deployment.hardware`](#deploymenthardware)).

Other `eloq_store_*` tuning fields are optional advanced knobs; set them only when needed.

### EloqStore Standby

EloqStore master/standby replication is enabled automatically when `tx_service.standby_host_ports` is set — there is no separate enable flag, and the replication source is assigned at runtime (do not set it in YAML). It requires an EloqStore-backed EloqKV build.

- `storage_service.eloqdss.backend.eloq_store_standby_max_concurrency`: Maximum concurrent standby `rsync`/`ssh` jobs per node. Optional; defaults to `100`.

For local (non-object-storage) standby, replicas sync from the master with `rsync`. Same-machine replicas copy files locally (no SSH); cross-machine replicas pull over SSH and require passwordless key-based SSH and sufficient SSH server concurrency. See [Deploy a High Availability Cluster with Local Storage](./quick-start-ha-local-storage) for the SSH setup.

## `deployment.hardware`

Keys are either `ip:port` (recommended) or `ip` (legacy). An `ip:port` key sizes one specific node; a bare `ip` key applies to every node on that host and is used only as a fallback when no `ip:port` key matches. To give co-located nodes (same host, different ports) distinct settings, key them by `ip:port`.

Per-node fields:

- `cpu`: Required CPU count for the node; used by `eloqctl` to derive `core_number` and the memory limit.
- `memory`: Required memory in MiB.
- `event_dispatcher_num`: Optional explicit dispatcher count.
- `eloq_data_path`: Optional override of the node's base data directory. Defaults to `{install_dir}/EloqKV/data/port-{port}`. Overriding it relocates the whole node data tree, and the EloqStore data directory follows this base unless `eloq_store_data_path_list` is also set.
- `eloq_store_data_path_list`: Optional per-node EloqStore data directory(ies), comma-separated. Takes precedence over the shared `storage_service` value and the auto-derived default. Useful for placing co-located nodes on different disks.

```yaml
deployment:
  hardware:
    127.0.0.1:6379:
      cpu: 2
      memory: 10240
      event_dispatcher_num: 1
      eloq_data_path: /data/disk1/master
    127.0.0.1:7379:
      cpu: 2
      memory: 10240
      eloq_store_data_path_list: /data/disk2/standby
    127.0.0.1:8379:
      cpu: 2
      memory: 10240
```

Default data directories are already distinct per port, so multiple nodes on one machine work without overrides; use `eloq_data_path` / `eloq_store_data_path_list` only when you want specific paths or disks.

## `deployment.monitor`

`monitor` is optional. Use it when `eloqctl` should manage Prometheus, Grafana, and node exporter.

- `deployment.monitor.data_dir`
- `deployment.monitor.eloq_metrics.path`
- `deployment.monitor.eloq_metrics.port`
- `deployment.monitor.prometheus.host`
- `deployment.monitor.prometheus.port`
- `deployment.monitor.prometheus.download_url`
- `deployment.monitor.grafana.host`
- `deployment.monitor.grafana.port`
- `deployment.monitor.grafana.download_url`
- `deployment.monitor.node_exporter.url`
- `deployment.monitor.node_exporter.port`

## Practical Rules

- Use `cluster_mode: false` for localhost or single-node examples.
- Use `cluster_mode: true` for tx/standby/voter topologies.
- Keep `enable_wal`, `enable_io_uring`, and `enable_tls` explicit in every YAML example.
- For HA object-storage deployments, configure `storage_service` and `log_service` independently.
- Start from the bundled examples under `${ELOQCTL_HOME:-$HOME/.eloqctl}/config/examples/`, then edit hostnames, credentials, and object-store settings.
