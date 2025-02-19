---
title: EloqKV 代理
summary: EloqKV 代理
---

# EloqKV 代理

## 简介

EloqKV 代理是一个用 Go 编写的高性能代理服务器,旨在无缝管理多个 EloqKV 集群。它允许客户端使用令牌(密码)连接到不同的 EloqKV 集群,实现多租户环境。代理支持通过 RESTful Web 服务动态添加和删除集群,这使其非常适合需要可扩展性和灵活性的生产环境。

### 主要特性:

- **多租户支持:** 基于令牌将客户端连接路由到不同的 EloqKV 集群。
- **动态集群管理:** 通过 RESTful Web 服务添加、删除和检查集群。
- **高可用性:** 代理是无状态的,当配置负载均衡器时可以实现高可用。
- **可配置:** 通过配置文件或命令行参数配置代理。
- **标准 Redis 兼容性:** 支持标准 Redis 命令和认证机制。

## 快速开始

EloqKV 代理可以使用 `eloqctl` 安装。

### 初始化代理拓扑文件

示例代理拓扑模板文件可以在 .eloqctl/config/examples 目录中找到。

```
# 示例 yaml 文件
.eloqctl/config/examples/eloqkv_proxy.yaml
```

要部署代理,编辑 eloqkv_proxy.yaml 文件

```yaml
connection:
  username: '${USER}'
  auth_type: 'keypair'
  auth:
    keypair: '/home/${USER}/.ssh/id_rsa'
deployment:
  cluster_name: 'eloqkv-proxy'
  product: 'EloqKV'
  version: 'latest'
  install_dir: '/home/${USER}'
  proxy:
    host: 10.0.0.1
    port: 6379
    web_service_addr: '10.0.0.1:8080'
```

### 运行部署命令

修改完 `eloqkv_proxy.yaml` 后,使用 `eloqctl launch` 命令配置 EloqKV 代理:

```shell
eloqctl launch ${HOME}/.eloqctl/config/examples/eloqkv_proxy.yaml -s
```

该命令将在指定的主机上安装 EloqKV 代理。

### 添加集群

**HTTP 请求:**

- **方法:** POST
- **URL:** http://web_service_addr/cluster/token

使用 curl 示例:

```
curl -X POST http://localhost:8080/cluster/bbbbbbbb -d '{"nodes": ["10.0.0.2:6379", "10.0.0.3:6379", "10.0.0.4:6379"]}'
```

响应:

```
Cluster with token bbbbbbbb added successfully
```

### 检查集群

**HTTP 请求:**

- **方法:** GET
- **URL:** http://web_service_addr/cluster/token

使用 curl 示例:

```
curl http://localhost:8080/cluster/bbbbbbbb
```

响应:

```
Cluster with token bbbbbbbb exists
```

### 删除集群

**HTTP 请求:**

- **方法:** DELETE
- **URL:** http://web_service_addr/cluster/token

使用 curl 示例:

```
curl -X DELETE http://localhost:8080/cluster/bbbbbbbb
```

响应:

```
Cluster with token bbbbbbbb removed successfully
```
