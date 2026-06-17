---
title: Eloqctl Topology Reference
summary: Reference for the deployment YAML used by eloqctl.
---

# Eloqctl Topology Reference

This page describes the topology YAML consumed by `eloqctl check`, `eloqctl launch`, `eloqctl plan`, and `eloqctl apply`.

The topology YAML is the source of truth for deployment shape, storage backend, monitor placement, and host sizing.

## Required Deployment Fields

Write these fields explicitly in deployment YAML:

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

`hardware` is keyed by host only. If several EloqKV processes run on one machine, define that host once, not once per port.

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
  version: "latest"
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
- `connection.ssh_endpoints`: Optional mapping from deployment host to control-plane reachable SSH endpoint.
- `connection.service_endpoints`: Optional mapping from deployment service address to control-plane reachable service endpoint.

Use `ssh_endpoints` and `service_endpoints` when the deployment hostnames or ports differ from what the control machine can reach directly, such as in Docker, NAT, or bastion setups.

## `deployment`

- `deployment.cluster_name`: Unique cluster name in local `eloqctl` state.
- `deployment.product`: Must be `EloqKV`.
- `deployment.version`: EloqKV release version to deploy. Use `latest` unless you need a pinned release.
- `deployment.install_dir`: Base directory on the target host.
- `deployment.enable_wal`: Whether each write is appended to WAL before completion.
- `deployment.enable_io_uring`: Whether to use the `io_uring` I/O path.
- `deployment.enable_tls`: Whether to enable TLS for EloqKV client traffic.
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
- `deployment.storage_service.eloqdss.backend: !eloqstore`: EloqStore backend.

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

- `storage_service.eloqdss.backend.eloq_store_cloud_store_path`
- `storage_service.eloqdss.backend.eloq_store_cloud_provider`
- `storage_service.eloqdss.backend.eloq_store_cloud_access_key`
- `storage_service.eloqdss.backend.eloq_store_cloud_secret_key`
- `storage_service.eloqdss.backend.eloq_store_cloud_endpoint`
- `storage_service.eloqdss.backend.eloq_store_cloud_region`
- `storage_service.eloqdss.backend.eloq_store_cloud_verify_ssl`
- `storage_service.eloqdss.backend.eloq_store_reuse_local_files`
- `storage_service.eloqdss.backend.eloq_store_prewarm_cloud_cache`

## `deployment.hardware`

- `deployment.hardware.<host>.cpu`: Required host CPU count used by `eloqctl` to derive runtime config.
- `deployment.hardware.<host>.memory`: Required host memory in MiB.
- `deployment.hardware.<host>.event_dispatcher_num`: Optional explicit dispatcher count.

If multiple EloqKV processes run on the same host with different ports, define that host once in `hardware`.

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
