---
title: Install EloqCtl
description: Install eloqctl, the cluster deployment and management tool for Eloq databases.
summary: Install eloqctl on the control machine to deploy and manage Eloq database clusters.
---

# Install EloqCtl

`eloqctl` is the one-stop deployment and management tool for Eloq database clusters. You run it on a control machine, and it deploys, starts, stops, upgrades, and reconfigures clusters (EloqKV, EloqSQL, and their log, storage, and monitoring components) over SSH.

## Install with the Install Script

Run the install script on the control machine:

```shell
curl -fsSL https://raw.githubusercontent.com/eloqdata/eloqctl/main/install.sh | sh
source "${HOME}/.bash_profile"
eloqctl --version
```

The script downloads the latest `eloqctl` release and adds it to your `PATH` via `~/.bash_profile`. If `eloqctl --version` prints a version number, the installation succeeded.

## Where EloqCtl Stores Its Files

`eloqctl` keeps its local state under `${ELOQCTL_HOME:-$HOME/.eloqctl}` by default:

- `config/examples/` — example topology YAML files to copy and edit
- `clusters/<cluster>/topology.yaml` — the saved topology of each launched cluster

Set the `ELOQCTL_HOME` environment variable before running `eloqctl` to use a different location.

## Manual Download

To pin a specific version or inspect the artifacts, download a release directly from the [eloqctl GitHub releases page](https://github.com/eloqdata/eloqctl/releases).

## Next Steps

- Prepare the target machines: [Configuration Checklist](./prerequisite)
- Deploy a single-node EloqKV instance: [Quick Start](./quick-start)
- Deploy a single-node EloqSQL instance: [EloqSQL Quick Start](/eloqsql/quick-start)
- Operate a running cluster: [Manage Cluster](./manage-cluster)
