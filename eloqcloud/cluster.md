# Cluster

> Welcome to the Cluster documentation! Here you'll find comprehensive information about **cluster concepts** and **API usage methods** for managing your Eloq clusters. Learn how clusters work in Eloq's cloud platform.

## About Cluster

A **Cluster** is a flexible database cluster in our cloud service platform that enables **elastic scaling** and **seamless user experience**. Clusters serve as the core infrastructure for running EloqKV and EloqDoc databases with high availability and performance.

### **Key Features:**

- **Elastic Scaling** - Scale resources up or down based on demand without downtime
- **Seamless Experience** - Users experience minimal impact during scaling operations
- **Flexible Configuration** - Customize cluster settings for optimal performance

## Free Tier Limitations

Currently, free users are limited to **3 clusters** with **fixed resource quotas**. This includes:

- ✅ **Dedicated Resource** - Decicated CPU, memory, and storage limits
- ✅ **All Database Types** - Support EloqKV and EloqDoc clusters
- ✅ **Basic Monitoring** - Access to cluster status and basic metrics
- ❌ **Cluster Limit** - Maximum of 3 clusters per organization
- ❌ **Advanced Features** - Some enterprise features are not available

### **Resource Quotas:**

| Resource     | Free Tier Limit        |
| ------------ | ---------------------- |
| **Clusters** | 3 clusters maximum     |
| **Storage**  | 25 GB                  |

<a id="cluster-api"></a>

## Cluster API

The Cluster API provides programmatic access to manage cluster resources, configurations, and lifecycle operations.

- **Base path**: `/api/v1`  
- **Authentication**: All APIs require an `Authorization` header with your API key: `Authorization: {{YOUR_API_KEY}}`  
- **Base URL**: `https://api-prod.eloqdata.com`

The following sections describe each cluster-related API individually, including its purpose, input, output, and a `curl` example.

---

### API  – Create a cluster (`POST /orgs/{orgId}/projects/{projectId}/clusters`)

Create a new cluster in the specified project.

#### Endpoint

- **Method**: `POST`  
- **Path**: `/orgs/{orgId}/projects/{projectId}/clusters`

#### Input

- **Headers**:
  - `Authorization: {{YOUR_API_KEY}}`
  - `Content-Type: application/json`
- **Path parameters**:

| Name       | Type    | Required | Description  |
|-----------|---------|----------|--------------|
| `orgId`    | integer | Yes      | Organization ID |
| `projectId`| integer | Yes      | Project ID      |

Parameters ordId and projectId can be found at [GET /org-info API](./basic#api---get-basic-info-get-org-info)

- **Request body (JSON)**:

```json
{
  "clusterName": "string",
  "region": "string",
  "requiredZone": "string",
  "skuId": 0
}
```

Field details:

- `clusterName` (string, required): Cluster display name  
- `region` (string, required): Region (for example: `us-west-1`)  
- `requiredZone` (string, optional): Availability zone  
- `skuId` (integer, required): SKU ID

#### Example (`curl`)

```bash
curl -X POST "https://api-prod.eloqdata.com/api/v1/orgs/{orgId}/projects/{projectId}/clusters" \
  -H "Authorization: {{YOUR_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{
    "clusterName": "example-cluster",
    "region": "us-west-1",
    "requiredZone": "us-west-1a",
    "skuId": 1
  }'
```

#### Output

**Success (200)**:

```json
{
  "code": 200,
  "message": "",
  "data": null
}
```

**Error responses**:

- `400`: Invalid request parameters  
- `403`: Permission denied  
- `500`: Internal server error

---

### API – List clusters (`GET /orgs/{orgId}/projects/{projectId}/clusters`)

Get a paginated list of clusters under the specified project.

#### Endpoint

- **Method**: `GET`  
- **Path**: `/orgs/{orgId}/projects/{projectId}/clusters`

#### Input

- **Headers**:
  - `Authorization: {{YOUR_API_KEY}}`
- **Path parameters**:

| Name       | Type    | Required | Description  |
|-----------|---------|----------|--------------|
| `orgId`    | integer | Yes      | Organization ID |
| `projectId`| integer | Yes      | Project ID      |

- **Query parameters**:

| Name      | Type    | Required | Description        | Constraints |
|-----------|---------|----------|--------------------|------------|
| `perPage` | integer | Yes      | Number per page    | 1–50       |
| `page`    | integer | Yes      | Page index (1-based)| > 0        |

#### Example (`curl`)

```bash
curl -X GET "https://api-prod.eloqdata.com/api/v1/orgs/{orgId}/projects/{projectId}/clusters?perPage={perPage}&page={page}" \
  -H "Authorization: {{YOUR_API_KEY}}"
```

#### Output

**Success (200)**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "cluster_list": [
      {
        "cluster_name": "string",
        "version": "string",
        "module_type": "string",
        "status": "string",
        "cloud_provider": "string",
        "region": "string",
        "zone": "string",
        "create_at": "2024-01-01T00:00:00Z",
        "sku_name": "string"
      }
    ],
    "total": 0
  }
}
```

Field notes:

- `module_type`: `EloqSQL`, `EloqKV`, `EloqDoc`  
- `status`: e.g. `available`, `unavailable`, `provisioning`  
- `cloud_provider`: `AWS`, `GCP`

**Error responses**:

- `400`: Invalid request parameters  
- `403`: Permission denied  
- `500`: Internal server error

---

### API – Describe a cluster (`GET /orgs/{orgId}/projects/{projectId}/clusters/{clusterName}`)

Get detailed information for a specific cluster.

#### Endpoint

- **Method**: `GET`  
- **Path**: `/orgs/{orgId}/projects/{projectId}/clusters/{clusterName}`

#### Input

- **Headers**:
  - `Authorization: {{YOUR_API_KEY}}`
- **Path parameters**:

| Name         | Type    | Required | Description          |
|-------------|---------|----------|----------------------|
| `orgId`      | integer | Yes      | Organization ID      |
| `projectId`  | integer | Yes      | Project ID           |
| `clusterName`| string  | Yes      | Cluster display name |

#### Example (`curl`)

```bash
curl -X GET "https://api-prod.eloqdata.com/api/v1/orgs/{orgId}/projects/{projectId}/clusters/{clusterName}" \
  -H "Authorization: {{YOUR_API_KEY}}"
```

#### Output

**Success (200)**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "org_name": "string",
    "project_name": "string",
    "display_cluster_name": "string",
    "module_type": "string",
    "cloud_provider": "string",
    "region": "string",
    "zone": "string",
    "status": "string",
    "tx_cpu_limit": 0.0,
    "tx_memory_mi_limit": 0.0,
    "log_cpu_limit": 0.0,
    "log_memory_mi_limit": 0.0,
    "tx_replica": 0,
    "log_replica": 0,
    "version": "string",
    "elb_addr": "string",
    "elb_port": 0,
    "create_at": "2024-01-01T00:00:00Z",
    "elb_state": "string",
    "admin_user": "string",
    "admin_password": "string",
    "cluster_deploy_mode": "string"
  }
}
```

Field notes:

- `module_type`: `EloqSQL`, `EloqKV`, `EloqDoc`  
- `cloud_provider`: `AWS`, `GCP`  
- `status`: e.g. `available`, `unavailable`, `provisioning`  
- `admin_user`, `admin_password`: Base64-encoded admin credentials  
- `elb_state`: e.g. `active`, `provisioning`

**Error responses**:

- `400`: Invalid request parameters  
- `403`: Permission denied or cluster not found  
- `500`: Internal server error

---

### API – Delete a cluster (`DELETE /orgs/{orgId}/projects/{projectId}/clusters/{clusterName}/delete`)

Delete the specified cluster. The cluster must be in `available` state.

#### Endpoint

- **Method**: `DELETE`  
- **Path**: `/orgs/{orgId}/projects/{projectId}/clusters/{clusterName}/delete`

#### Input

- **Headers**:
  - `Authorization: {{YOUR_API_KEY}}`
- **Path parameters**:

| Name         | Type    | Required | Description          |
|-------------|---------|----------|----------------------|
| `orgId`      | integer | Yes      | Organization ID      |
| `projectId`  | integer | Yes      | Project ID           |
| `clusterName`| string  | Yes      | Cluster display name |

#### Example (`curl`)

```bash
curl -X DELETE "https://api-prod.eloqdata.com/api/v1/orgs/{orgId}/projects/{projectId}/clusters/{clusterName}/delete" \
  -H "Authorization: {{YOUR_API_KEY}}"
```

#### Output

**Success (200)**:

```json
{
  "code": 200,
  "message": "",
  "data": null
}
```

**Error responses**:

- `400`: Invalid request parameters  
- `403`: Permission denied or cluster not in an available state  
- `500`: Internal server error  

**Note**: The cluster must be in `available` status before it can be deleted.

---
