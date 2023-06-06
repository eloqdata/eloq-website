---
title: Quick Start Guide for the MonographDB Database Platform
summary: Learn how to quickly get started with the MonographDB database.
---
# Quick Start Guide for the MonographDB Database

This guide introduces how to quickly get started with the MonographDB database, and the steps to quickly deploy and use MonographDB on `single node`:

- [Single-node test environment installation and deployment](#install-and-deploy-a-single-database-system-on-a-single-machine) (for centos and ubuntu)

> **Note:**
>
> The deployment method provided in this guide is **ONLY FOR** quick start, **NOT FOR** production.
>
> - To deploy an production cluster, see [production installation guide](./production-deployment-using-monographdb.md).
> - To deploy MonographDB on Kubernetes, see [Get Started with MonographDB on Kubernetes](./monographdb-in-kubernetes.md).
> - To manage MonographDB in the cloud, see [MonographDB Cloud Quick Start](./monograph-in-cloud.md).

## Install and deploy a single database system on a single machine

- Scenario: use a single server to experience the smallest complete topology of MonographDB and simulate the deployment steps in the production environment.

This section describes how to deploy MonographDB with reference to a YAML file of MonographDB's minimal topology.

### Deployment prepare
Prepare a deployment host and ensure its software meets the following requirements.

-  CentOS 7 or Ubuntu 16.04 or later versions is installed
-  The runtime environment needs to have access to the Internet.
-  Regular users must have read, write, and execute permissions for the database package extraction path and installation path, and the installation path must be empty.
  
1. System configuration

Below are some necessary configurations to be made before installing MonoGraphDB

+ Edit the system configuration file `/etc/security/limits.d/20-nproc.conf` using the following command
     ```shell
     sudo vi /etc/security/limits.d/20-nproc.conf
     ```
    Add the following resource limit parameters at the end of the corresponding file
    ```shell
    * soft nofile 524288
    * hard nofile 524288
    * hard core unlimited
    * soft core unlimited
    ``` 
+ Use the following command to edit the configuration file `/etc/sysctl.conf`
    ```shell
    sudo vi /etc/sysctl.conf
    ```
    Add the following configuration parameters at the end of the corresponding file
    ```shell
    kernel.core_pattern=/var/crash/core-%e-%s-%u-%g-%p-%t
    ```
+ Execute the following command to load the above parameter modification.
    ```shell
    sudo sysctl -p
    ```
+ In order to display all limit resource information of the current system, modify the bash configuration file
    ```shell
    sudo vi ~/.bashrc
    ```
    Add at the end of the corresponding file
    ```
    ulimit -c unlimited
    ```
+ Add current user and group ownership to `/var/crash` folder
    ```shell
    sudo chown -R $USER:$USER /var/crash
    ```
+ login the session for the above changes to take effect, then log in again
    ```shell
    log out
    ```
2.  Single Node Network Configuration
`ssh` service configuration, users first need to install the corresponding `ssh` service on their own host, `ssh` service needs the support of `ssh` client and `ssh` server.
+ Check whether the ssh and sshd clients have been installed
    ```shell
    which ssh
    which sshd
    ```
    If the above command has no output, it means that the corresponding service is not installed. The user needs to install the corresponding ssh service and enable the corresponding ssh service.
+ install and enable ssh service on centos
     ```shell
     ## Install ssh client and server
     sudo yum –y install openssh-server openssh-clients
     ## Open ssh service
     sudo systemctl start sshd
     ## Open the ssh service and make the ssh service automatically start after the system restarts
     sudo systemctl enable sshd
     ```
+ Install ssh service on ubuntu and start it
    ```shell
     ## Install ssh client and server
     sudo apt-get install openssh-server
     ## Open ssh service
     sudo service ssh start
    ```
+ In order to enable each node to log in to other nodes through the public key, it needs to generate its own public key locally
    ```shell
    ssh-keygen -t ed25519
    ```
    > **Note:**
    > Note that the ed25519 encryption signature algorithm is used here, which is faster, more secure, and shorter in bytes than the ordinary RSA signature algorithm.

After the ssh key generation, two files will be generated in the $HOME/.ssh directory, one is the private key file `id_ed25519`, and the other is the public key file `id_ed25519.pub`.

+ add the public key `id_ed25519.pub` to the authorized_keys
    ```shell
     cat .ssh/id_ed25519.pub | ssh username@host 'cat >> .ssh/authorized_keys'
    ```
    If you just install the MonoGraph service locally, you only need to run the following
    ```shell
     cat .ssh/id_ed25519.pub | ssh $USER@localhost 'cat >> .ssh/authorized_keys'
    ```
+ Set permissions for the ssh directory
    ```shell
     chmod 700 ~/.ssh
     chmod 600 ~/.ssh/authorized_keys
    ```
3. Get the MonoGraphDB installation package

Firstly, you need to download the latest MonoGraphDB installation image from the cloud warehouse
+ Download the corresponding AWS command line interface tool (aws cli)
    ```shell
    # Download the aws cli toolkit
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    # aws cli toolkit decompression
    unzip awscliv2.zip
    # Installation of aws cli tools
    sudo ./aws/install
    ```
+ Download the MonoGraphDB installation package through the `get-object` command of the aws cli tool
    ```shell
    aws s3api get-object --bucket monographdb-release --key main-centos-7-range/monographdb-release-bin.tar.gz monographdb-release-bin.tar.gz
    ```
4. Download Monograph Waiter
Monograph Waiter is a toolkit for development and management of MonographDB database, which includes `cluster_mgr`, a command-line tool for cluster installation, deployment and management, designed to make it easier to install and manage MonographDB clusters in non-Kubernetes environments.
    ```shell
    git clone https://github.com/monographdb/monograph_waiter.git
    ```

### Deployment implementation
1. Deploy MonographDB
+ modify the cluster configuration file
According to the following configuration template, edit the configuration file config/deployment.yaml as your need, where:
   * `username: "mono"`: Indicates that the `mono` system user (the current system user name) is used for internal management of the cluster. By default, port 22 is used to log in to the target machine via ssh
   * `auth_type`: ssh login verification method, the default is the keypair form
   * `keypair`: set to the storage address of the ssh private key file configured through the network
   * `host`: Set it to the IP of the deployment host, if it only needs to be installed on this machine, set it to localhost
   * `install_image`: Can be set to the downloaded Monograph installation package locally or the download address of the remote MonographDB
   * `install_dir`: Set to the desired storage location for the user to install the cluster. This location must be the folder location with read and write permissions for the user specified by `username`. If the installation directory does not exist, it needs to be manually created in advance.
   * `storage_service`: Configure the remote download URL `download_url` of the `Cassandra` database, the installation location `(host)`, if configured as `localhost`, it means that the installation is locally.
   * `monitor`: Configure the remote download URL, installation location and installation port of MonographDB’s related monitoring software (prometheus, grafana).
   The configuration template is as follows:
        ```yaml
        connection:
        username: "mono"
        auth_type: "keypair"
        auth:
        keypair: "/home/$USER/.ssh/id_rsa"
        deployment:
        install_image: "file:///home/ubuntu/monographdb-release.tar.gz"
        cluster_name:  $CLUSTER_NAME
        install_dir: "/$USER/opt"
        port:
        mysql_port: 3300
        monograph_port:
        start: 8100
        end: 8200
        mono_service:
        host:
        - localhost
        storage_service:
        cassandra:
        download_url: "https://archive.apache.org/dist/cassandra/4.1.0/apache-cassandra-4.1.0-bin.tar.gz"
        storage_cluster: "mono-cass-cluster"
        host:
            - localhost
        monitor:
        data_dir: ""
        monograph_metrics:
        path: "/mono_metrics"
        port: 18081
        prometheus:
        download_url: "https://github.com/prometheus/prometheus/releases/download/v2.42.0/prometheus-2.42.0.linux-amd64.tar.gz"
        port: 9090
        host: "localhost"
        grafana:
        download_url: "https://dl.grafana.com/oss/release/grafana-9.3.6.linux-amd64.tar.gz"
        port: 3300
        host: "localhost"
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
> The above deployment.yaml file is the default configuration file, and users can configure the software to be installed according to their needs. For some software that does not need to be installed, it only needs to be deleted from the configuration file.
+ Dependency files needed to install MonographDB
     ```shell
     ./cluster_mgr run-deps --topology-file ${PWD}/config/deployment.yaml
     ```
+ Execute the MonographDB cluster deployment command
     ```
     ./cluster_mgr deploy --topology-file ${PWD}/config/deployment.yaml
     ```
+ Execute the MonographDB cluster installation command
     ```
     ./cluster_mgr install --cluster $CLUSTER_NAME
     ```
> **Note:**
> In the process of installing the MonographDB cluster, you first need to set up the development environment of JDK (JAVA Development Kit), and set up the corresponding JAVA_HOME and PATH, in order to prevent errors during the execution of cassandra

+ Start the MonographDB cluster
     ```shell
     ./cluster_mgr start --cluster $CLUSTER_NAME
     ```

+ Access the cluster
   - Access the MonographDB database. By default, `mysql` is installed in `/home/$USER/opt/mono-poc/monographdb-release/install/`, enter this directory, and use the socket method to connect to the database. For more connection methods, please refer to [Client Connection](./connect-to-monodb/connect-by-client.md).
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
    