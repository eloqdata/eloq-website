---
title: The guide for deploy a MonographDB Cluster
summary: Learn how to deploy and use the MonographDB cluster
---

# The guide for deploy a MonographDB Cluster

This document describes how to quickly deploy a MonographDB cluster on multiple Linux servers.

- [Installation and deployment of multi-node production environment] (#Deploy database system on multiple machines) (support centos)

> **Note**
>
> The MonographDB deployment in this guide is suitable for multi-node deployment of MonographDB clusters and can be used in production environments.
>
> - To deploy MonographDB on Kubernetes, please refer to [Quick Start MonographDB Operator](./monographdb-in-kubernetes.md).
> - To manage MonographDB on the cloud, please refer to [MonographDB Cloud Quick Start Guide](./monograph-in-cloud.md).

## Install and deploy MonographDB clusters on multiple machines

- Scenario: Use multiple machines to experience the complete topology of MonographDB clusters, and simulate the deployment in the production environment.

This section describes how to configure the YAML file of the MonographDB topology to deploy a MonographDB cluster.

### Deployment prepare

Prepare multiple target machines and ensure that their software meets the following requirements:

- CentOS 7 or Ubuntu 16.04(or later versions) is installed

- The Linux systems need to have access to the Internet, which is required to download MonographDB and its related dependencies

For the MonographDB cluster topology, you can configure the required number of clusters on demand by changing the YAML file. In this deployment, the cluster topology is shown in the following table

> **Note**
> The IP address of the following instances only serves as an example IP. In your actual deployment, you need to replace the IP with your actual IP.

| Instance        | count | IP                                                    | Configuration                                     |
| :-------------- | :---- | :---------------------------------------------------- | :------------------------------------------------ |
| mono_service    | 4     | 10.0.1.1 <br/> 10.0.1.2 <br/> 10.0.1.3 <br/> 10.0.1.4 | range ports <br/> Global directory configuration  |
| storage_service | 4     | 10.0.1.1 <br/> 10.0.1.2 <br/> 10.0.1.3 <br/> 10.0.1.4 | Default port <br/> Global directory configuration |
| Monitor         | 1     | 10.0.1.1                                              | Default Port <br/> Global Directory Configuration |

1. Environment Configuration
   Each of the multiple machines needs to complete the basic configuration of the system environment. For specific configuration steps, please refer to [Single Node Monograph Deployment Environment Configuration](./quick-start.md)
2. Transfer the MonographDB installation package
   Transfer the latest `monographdb-release.tar.gz` installation package to all machines
   ```shell
   scp <path of local tar package> <username>@<server IP address>: <server path>
   ```
3. Cluster network configuration
   It is necessary to ensure that each server can access other servers in the cluster through ssh. For specific configuration steps, please refer to [Single Node Monograph Deployment Network Configuration](./quick-start.md)

### Deployment implementation

The `Monograph_waiter` tool can realize the installation and deployment on multiple servers by modifying the parameters in deployment YAML files. For the details of `Monograph_waiter `, please refer to [Single Node Monograph Deployment Network Configuration](./quick-start.md)

- Create and start the cluster
  According to the following configuration template, edit the configuration file deployment.yaml as you need, where:

  - `username: "centos"`: The management of the cluster is done through the `centos` system user (the current system user name), port 22 is used to log in to the target machine via ssh
  - `auth_type`: The way of ssh login verification, the default is keypair
  - `keypair`: Set as the location of the ssh private key, note that this ssh key must have access to multiple servers
  - `host`: Set as the actual IP address of multiple servers
  - `install_image`: Can be set to the downloaded Monograph installation package locally or the download address of the remote MonographDB
  - `install_dir`: Set to the desired storage location for the user to install the cluster. This location must be the folder location with read and write permissions for the user specified by `username`. If the installation directory does not exist, it needs to be manually created in advance.
  - `storage_service`: Configure the remote download URL `download_url` of the `Cassandra` database, the installation location `(host)`, if configured as `localhost`, it means that the installation is locally.
  - `monitor`: Configure the remote download URL, installation location and installation port of MonographDB’s related monitoring software (prometheus, grafana).
    The configuration template is as follows:


      ```yaml
      connection:
      username: "centos"
      auth_type: "keypair"
      auth:
          keypair: "~/xx.pem"
      deployment:
      install_image: "file:///home/centos/monographdb-release-bin.tar.gz"
      cluster_name: "mono_cloud"
      install_dir: "/home/centos"
      port:
          mysql_port: 3300
          monograph_port:
          start: 8100
          end: 8200
      mono_service:
          host:
          - 10.0.1.1
          - 10.0.1.2
          - 10.0.1.3
          - 10.0.1.4
      storage_service:
          cassandra:
          download_url: "https://archive.apache.org/dist/cassandra/4.1.0/apache-cassandra-4.1.0-bin.tar.gz"
          storage_cluster: "mono-cass-cluster"
          host:
          - 10.0.1.1
          - 10.0.1.2
          - 10.0.1.3
          - 10.0.1.4
      monitor:
          data_dir: ""
          monograph_metrics:
          path: "/mono_metrics"
          port: 18081
          prometheus:
          download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
          port: 9090
          host: "10.0.1.1"
          grafana:
          download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
          port: 3300
          host: "10.0.1.1"
          node_exporter: "https://github.com/prometheus/node_exporter/releases/download/v1.5.0/node_exporter-1.5.0.linux-amd64.tar.gz"
          node_exporter_port: 9200
          mysql_exporter: "https://github.com/prometheus/mysqld_exporter/releases/download/v0.14.0/mysqld_exporter-0.14.0.linux-amd64.tar.gz"
          mysql_exporter_port: 9300
          cassandra_collector:
          mcac_agent: "https://github.com/datastax/metric-collector-for-apache-cassandra/releases/download/v0.3.4/datastax-mcac-agent-0.3.4-4.1-beta1.tar.gz"
          mcac_port: 9103

      #    dynamodb:
      #      access_key_id: "",
      #      secret_key: ""
      #      region: "XXXX",
      #      endpoint: "";
      ```

> **Note:**
> The deployment.yaml file above is the default configuration file, and users can configure the software to be installed as needed. For some software that does not need to be installed, it only needs to be deleted from the configuration file.

- Dependency files needed to install MonographDB
  ```shell
  ./cluster_mgr run-deps --topology-file ${PWD}/config/deployment.yaml
  ```
- Execute the MonographDB cluster deployment command
  ```
  ./cluster_mgr deploy --topology-file ${PWD}/config/deployment.yaml
  ```
- Execute the MonographDB cluster installation command
  ```
  ./cluster_mgr install --cluster $CLUSTER_NAME
  ```

> **Note:**
> In the process of installing the MonographDB cluster, you first need to set up the development environment of JDK (JAVA Development Kit), and set up the corresponding JAVA_HOME and PATH, in order to prevent errors during the execution of cassandra

- Start the MonographDB cluster
  ```shell
   ./cluster_mgr start --cluster $CLUSTER_NAME
  ```
- Access the cluster
  - Access the MonographDB database. By default, `mysql` is installed under `/home/$USER/opt/mono-poc/monographdb-release/install/`, enter this directory, and use socket to connect to the database.
    ```shell
    cd /home/$USER/opt/$CLUSTER_NAME/monographdb-release/install/
    sudo ./bin/mysql -u root -S /tmp/mysql3300.sock
    ```
  - Execute the following command to view the status of the cluster:
    ```shell
    ./cluster_mgr status -cluster $CLUSTER_NAME
    ```

## See also

- If you have just deployed a set of MonographDB local test clusters:
  - Learn [MonographDB SQL Operations](./basic-sql-operations.md)
  - [Migrate data to MonographDB](./migration-overview.md)
