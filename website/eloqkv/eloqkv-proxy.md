---
title: EloqKV Proxy
summary: EloqKV Proxy
---

# EloqKV Proxy

## Introduction

EloqKV Proxy is a high-performance proxy server written in Go, designed to manage multiple EloqKV clusters seamlessly. It allows clients to connect to different EloqKV clusters using tokens (passwords), enabling a multi-tenant environment. The proxy supports dynamic addition and removal of clusters via a RESTful web service, making it ideal for production environments where scalability and flexibility are essential.

### Key Features:

- \*_Multi-Tenancy Support:_ Route client connections to different EloqKV clusters based on tokens.
- \*_Dynamic Cluster Management:_ Add, remove, and check clusters on-the-fly using a RESTful web service.
- **Configurable:** Configure the proxy via a configuration file or command-line arguments.
- **Standard Redis Compatibility:** Supports standard Redis commands and authentication mechanisms.

## Quick Start

### Download Proxy

```shell
wget https://download.eloqdata.com/eloqkv/tools/amd64/eloqkv-proxy
chmod +x eloqkv-proxy
```

### Prerequiste

EloqKV must be configured with password

```
#eloqkv.ini
requirepass=aaaaaaaa
```

### Running the Proxy

You can run the proxy using a configuration file or command-line arguments.

**Option 1: Using a Configuration File**

1. Create a Configuration File (eloqproxy.ini). Note that token and password need to be the same in EloqKV proxy alpha version.

```
eloqkv_cluster_addr=127.0.0.1:6379,127.0.0.1:6380
eloqkv_cluster_token=xxxxxxxx
eloqkv_cluster_password=xxxxxxxx
```

- **eloqkv_cluster_addr:** Comma-separated list of EloqKV cluster node addresses.
- **eloqkv_cluster_token:** Token to indicate which cluster should be routed to. Token need to be the same as password in alpha version.
- **eloqkv_cluster_password:** Password the proxy uses to authenticate with the EloqKV cluster.

2. Run the Proxy:

```
./redis-cluster-proxy --config=eloqproxy.ini
```

**Option 2: Using Command-Line Arguments**

```
./redis-cluster-proxy \
  --eloqkv_cluster_addr=127.0.0.1:6379,127.0.0.1:6389 \
  --eloqkv_cluster_token=aaaaaaaa \
  --eloqkv_cluster_password=aaaaaaaa \
  --proxy_addr=:6380 \
  --web_service_addr=:8080
```

- **--eloqkv_cluster_addr:** Comma-separated list of EloqKV cluster addresses.
- **--eloqkv_cluster_token:** Token to indicate which cluster should be routed to. Token need to be the same as password in alpha version.
- **--eloqkv_cluster_password:** Password the proxy uses to authenticate with the EloqKV cluster.
- **--proxy_addr:** Address and port where the proxy listens for client connections (default :6380).
- **--web_service_addr:** Address and port where the management web service listens (default :8080).

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

### Adding a New Cluster

You can add a new EloqKV cluster to the proxy without restarting it.

**HTTP Request:**

- **Method:** POST
- **URL:** http://<web_service_addr>/cluster
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
- **URL:** http://<web_service_addr>/cluster/{token}

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
- **URL:** http://<web_service_addr>/cluster/{token}

Example using curl:

```
curl -X DELETE http://localhost:8080/cluster/bbbbbbbb
```

Response:

```
Cluster with token bbbbbbbb removed successfully
```
