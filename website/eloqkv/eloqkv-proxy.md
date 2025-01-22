---
title: EloqKV Proxy
summary: EloqKV Proxy
---

# EloqKV Proxy

## Introduction

EloqKV Proxy is a high-performance proxy server written in Go, designed to manage multiple EloqKV clusters seamlessly. It allows clients to connect to different EloqKV clusters using tokens (passwords), enabling a multi-tenant environment. The proxy supports dynamic addition and removal of clusters via a RESTful web service, making it ideal for production environments where scalability and flexibility are essential.

### Key Features:

- **Multi-Tenancy Support:** Route client connections to different EloqKV clusters based on tokens.
- **Dynamic Cluster Management:** Add, remove, and check clusters on-the-fly using a RESTful web service.
- **High Available:** Proxy is stateless and is a High Available solution when configure with Load Balancer.
- **Configurable:** Configure the proxy via a configuration file or command-line arguments.
- **Standard Redis Compatibility:** Supports standard Redis commands and authentication mechanisms.

## Quick Start

EloqKV proxy can be installed using `eloqctl`.

### Initialize proxy topology file

Example proxy topology template files can be found in the .eloqctl/config/examples directory.

```
# example yaml file
.eloqctl/config/examples/eloqkv_proxy.yaml
```

To deploy proxy, edit the eloqkv_proxy.yaml file

```
connection:
  username: "${USER}"
  auth_type: "keypair"
  auth:
    keypair: "/home/${USER}/.ssh/id_rsa"
proxy_service:
  proxy_name: "proxy-1"
  proxy_host_ports: [10.0.0.5:6380,10.0.0.6:6380]
  web_service_ports: [8080, 8080]
  install_dir: "/home/${USER}"
  eloqkv_cluster_addr: [10.0.0.1:6379]
  eloqkv_cluster_token: ["xxxxxxxx"]
  eloqkv_cluster_password: ["xxxxxxxx"]
```

Next, we'll provide detailed explanations for each configuration option available in the YAML file.

The `connection` section includes settings for connecting to EloqKV nodes from the control machine. If you followed the steps in the [Prerequisite Document](./prerequisite), you can leave the connection section unchanged.

The `proxy_service` section covers the configurations for proxy topology and config parameter.

- **`proxy_name`**:  
  _Type_: `String`  
  The name of the proxy cluster being deployed serves as an identifier for the cluster. With `eloqctl`, you can deploy and manage multiple proxy clusters, each distinguished by its unique name.
- **`eloqkv_cluster_addr`**:  
   _Type_: `List of Strings`  
  Address of the EloqKV cluster. If there are multiple nodes in EloqKV cluster, you only need to put 1 node address here.
- **`eloqkv_cluster_token`**:
  _Type_: `String`  
  Token to indicate which cluster should be routed to. Token need to be the same as password in alpha version. If cluster does not have any password, leave it empty.
- **`eloqkv_cluster_password`**:
  _Type_: `String`  
  Password the proxy uses to authenticate with the EloqKV cluster. If cluster does not have any password, leave it empty.
- **`proxy_host_ports`**:
  _Type_: `List of Strings`  
  Address that each proxy node listens on.
- **`web_service_ports`**:
  _Type_: `List of Integers`  
  Port where the management web service listens on each proxy node.

### Running the Proxy

```shell
eloqctl proxy start --config .eloqctl/config/examples/eloqkv_proxy.yaml
```

### Connecting Clients

Clients can connect to the proxy as they would to a regular EloqKV server.

- With Token Authentication:

```
redis-cli -p 6380 -a aaaaaaaa
```

- Without Token (if only one cluster and no token is set):

```
redis-cli -p 6380
```

Once connected, clients can execute standard Redis commands:

```
SET key1 "Hello, Redis!"
GET key1
```

## Management

The proxy includes a RESTful web service for managing EloqKV clusters dynamically.

### Stop the proxy

```shell
eloqctl proxy stop --proxy-name ${proxy_name}
```

### List current proxies

```shell
eloqctl proxy list
```

### Adding a New Cluster

You can add a new EloqKV cluster to the proxy without restarting it.

**HTTP Request:**

- **Method:** POST
- **URL:** http://web_service_addr/cluster
- **Request Body (JSON):**

```
{
  "cluster_id": "cluster2",
  "addrs": ["127.0.0.1:6399"],
  "token": "bbbbbbbb",
  "password": "bbbbbbbb"
}
```

Example using curl:

```
curl -X POST -H "Content-Type: application/json" -d '{
  "cluster_id": "cluster2",
  "addrs": ["127.0.0.1:6399"],
  "token": "bbbbbbbb",
  "password": "bbbbbbbb"
}' http://localhost:8080/cluster
```

Response:

```
Cluster cluster2 added successfully
```

### Checking if a Cluster Exists

**HTTP Request:**

- **Method:** GET
- **URL:** http://web_service_addr/cluster/token

Example using curl:

```
curl http://localhost:8080/cluster/bbbbbbbb
```

Response:

```
Cluster with token bbbbbbbb exists
```

### Removing a Cluster

**HTTP Request:**

- **Method:** DELETE
- **URL:** http://web_service_addr/cluster/token

Example using curl:

```
curl -X DELETE http://localhost:8080/cluster/bbbbbbbb
```

Response:

```
Cluster with token bbbbbbbb removed successfully
```
