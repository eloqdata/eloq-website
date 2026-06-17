---
title: Configuration Checklist
summary: Prepare target machines for EloqKV deployment with eloqctl.
---

# Prerequisite of Installing EloqKV

Run the host setup script from the `eloqctl` repository on every target host:

```shell
curl -fsSL https://raw.githubusercontent.com/eloqdata/eloq_waiter/main/scripts/setup-host.sh | sudo bash
```

Run that command on every machine that will run EloqKV, log service, DSS, Prometheus, or Grafana components.

## What the Script Does

The script performs the machine setup that `eloqctl` expects before deployment:

- installs baseline packages such as `openssh-server`, `sudo`, `curl`, `wget`, `tar`, `xz`, and `rsync`
- creates the `eloq` user if it does not already exist
- grants passwordless `sudo` to the `eloq` user
- enables SSH password authentication and public-key authentication
- configures `AuthorizedKeysFile .ssh/authorized_keys`
- raises file-descriptor and core-dump limits
- configures `kernel.core_pattern`
- creates `/var/crash` and gives the deployment user access
- appends `ulimit -c unlimited` to the deployment user's shell profile

To set the hostname during bootstrap, pass `HOSTNAME_VALUE`:

```shell
curl -fsSL https://raw.githubusercontent.com/eloqdata/eloq_waiter/main/scripts/setup-host.sh | \
  sudo HOSTNAME_VALUE=eloq-node-1 bash
```

To preload an SSH public key during bootstrap, pass `SSH_PUBKEY`:

```shell
curl -fsSL https://raw.githubusercontent.com/eloqdata/eloq_waiter/main/scripts/setup-host.sh | \
  sudo SSH_PUBKEY="$(cat ~/.ssh/id_rsa.pub)" bash
```

## What You Still Need To Do

After the script finishes, install the control-machine SSH public key on each target host.

On the control machine:

```shell
ssh-keygen -t rsa
ssh-copy-id -i ~/.ssh/id_rsa.pub eloq@10.0.0.1
ssh eloq@10.0.0.1
```

Repeat `ssh-copy-id` for each target host. The host is ready when `ssh eloq@<host>` no longer asks for a password.

## Minimal Verification

On each target host, verify the important state:

```shell
id eloq
sudo -l -U eloq
sudo systemctl status ssh || sudo systemctl status sshd
sudo cat /etc/security/limits.d/90-eloq.conf
sudo cat /etc/sysctl.d/90-eloq-core.conf
ls -ld /var/crash
```

On the control machine, verify SSH access:

```shell
ssh eloq@10.0.0.1 'sudo -n true && ulimit -n'
```

## Deployment YAML Expectations

After the hosts are prepared, make sure the topology YAML is complete before you run `eloqctl`:

- `deployment.install_dir` should always be explicit.
- `deployment.enable_wal`, `deployment.enable_io_uring`, and `deployment.enable_tls` should always be explicit.
- `deployment.cluster_mode` must be explicit.
- `deployment.hardware` must contain every host used by `tx_host_ports`, `standby_host_ports`, and `voter_host_ports`.
- `hardware` is keyed by host only. If several EloqKV processes run on one machine, define that host once, not once per port.
