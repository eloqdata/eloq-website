---
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Python SDK Documentation

> Complete API reference for the Eloq Python SDK with detailed function documentation, input/output specifications, and usage examples.

## Installation

### Using pip

```bash
pip install eloq-sdk
```

### Requirements

- Python 3.7 or higher
- `requests>=2.25.0`
- `pydantic>=1.8.0`

## Quick Start

### **Basic Setup**

```python
from eloq_sdk import EloqAPI

# Initialize client from environment variable
client = EloqAPI.from_environ()

# Get organization information
org_info = client.info()
print(f"Organization: {org_info.org_info.org_name}")

# List clusters
clusters = client.clusters()
print(f"Found {clusters.total} clusters")
```

### **Environment Setup**

Set the `ELOQ_API_KEY` environment variable:

```bash
export ELOQ_API_KEY="your-api-key-here"
```

### **Getting Your API Key**

1. Log in to your [EloqCloud Dashboard](https://cloud.eloqdata.com)
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Copy the key for use in your application

### **Your First API Call**

Let's start by getting your organization information:

```python
from eloq_sdk import EloqAPI

def get_organization_info():
    try:
        # Initialize the client
        client = EloqAPI.from_environ()

        # Get organization information
        org_info = client.info()

        print("=== Organization Information ===")
        print(f"Organization: {org_info.org_info.org_name}")
        print(f"Organization ID: {org_info.org_info.org_id}")
        print(f"User: {org_info.user_name}")
        print(f"Email: {org_info.email}")
        print(f"Created: {org_info.create_at}")
        print(f"Projects: {len(org_info.org_info.projects)}")

        return org_info

    except Exception as e:
        print(f"Error: {e}")
        return None

# Run the example
get_organization_info()
```

### **Working with Clusters**

Here's a comprehensive example showing how to manage clusters:

```python
from eloq_sdk import EloqAPI
from eloq_sdk import schema
from eloq_sdk.exceptions import EloqAPIError

def manage_clusters():
    client = EloqAPI.from_environ()

    try:
        # Step 1: List existing clusters
        print("\n=== Listing Clusters ===")
        clusters = client.clusters()
        print(f"Found {clusters.total} clusters:")

        for cluster in clusters.cluster_list:
            print(f"- {cluster.cluster_name}")
            print(f"  Status: {cluster.status}")
            print(f"  Type: {cluster.module_type}")
            print(f"  Region: {cluster.region}")
            print(f"  Created: {cluster.create_at}")

        # Step 2: Get available SKUs
        print("\n=== Getting Available SKUs ===")
        skus = client.get_skus(
            sku_type=schema.SKUType.SERVERLESS,
            eloq_module=schema.EloqModule.ELOQKV,
            cloud_provider=schema.CloudProvider.AWS
        )
        print(f"Found {len(skus)} available SKUs")

        # Step 3: Create a new cluster
        if skus:
            print(f"\n=== Creating New Cluster ===")
            cluster_name = "demo-cluster-1"

            result = client.cluster_create(
                cluster_name=cluster_name,
                region="us-west-1",
                sku_id=skus[0].sku_id
            )

            if result.success:
                print(f"✅ {result.message}")
            else:
                print(f"❌ {result.message}")

            # Get cluster details
            cluster_details = client.cluster(cluster_name)
            print(f"Cluster status: {cluster_details.status}")

        # Step 4: Get cluster connection credentials
        if clusters.cluster_list:
            print(f"\n=== Getting Cluster Credentials ===")
            cluster_name = clusters.cluster_list[0].cluster_name

            credentials = client.cluster_credentials(cluster_name)
            print(f"Cluster: {cluster_name}")
            print(f"Host: {credentials.host}")
            print(f"Port: {credentials.port}")
            print(f"Status: {credentials.status}")

    except EloqAPIError as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

# Run the cluster management example
manage_clusters()
```

## Authentication & Client Initialization

The SDK provides multiple ways to initialize the client:

### 1. From Environment Variable

```python
from eloq_sdk import EloqAPI

client = EloqAPI.from_environ()
```

This reads the API key from the `ELOQ_API_KEY` environment variable.

### 2. From API Key

```python
from eloq_sdk import EloqAPI

client = EloqAPI.from_key("your-api-key-here")
```

### 3. From API Key and Custom URL

```python
from eloq_sdk import EloqAPI

client = EloqAPI.from_key_and_url(
    "your-api-key-here",
    "https://api-prod.eloqdata.com/api/v1/"
)
```

### **Error Handling Best Practices**

The SDK provides comprehensive error handling with specific exception types:

#### Exception Types

- `EloqAPIError`: Base exception for all API errors
- `EloqAuthenticationError`: Authentication failed (401)
- `EloqPermissionError`: Permission denied (403)
- `EloqNotFoundError`: Resource not found (404)
- `EloqRateLimitError`: Rate limit exceeded (429)
- `EloqValidationError`: Invalid request (400)
- `EloqServerError`: Server error (500+)

#### Handling Errors

```python
from eloq_sdk import EloqAPI
from eloq_sdk.exceptions import EloqAPIError, EloqNotFoundError

try:
    cluster = client.cluster("non-existent-cluster")
except EloqNotFoundError:
    print("Cluster not found")
except EloqAPIError as e:
    print(f"API error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

#### Operation Results

For create and delete operations, errors are automatically handled and returned as `OperationResult` objects:

```python
result = client.cluster_create(
    cluster_name="my-cluster",
    region="us-west-1",
    sku_id=123
)

if not result.success:
    print(f"Operation failed: {result.message}")
```

### **Common Use Cases**

#### **1. Monitor Cluster Health**

```python
def monitor_clusters():
    client = EloqAPI.from_environ()
    clusters = client.clusters()

    print(f"\n📁 Total Clusters: {clusters.total}")
    for cluster in clusters.cluster_list:
        status_emoji = "✅" if cluster.status == "available" else "⚠️"
        print(f"  {status_emoji} {cluster.cluster_name}: {cluster.status}")
```

#### **2. Batch Cluster Operations**

```python
def batch_cluster_info():
    client = EloqAPI.from_environ()
    clusters = client.clusters()

    all_clusters = []
    for cluster in clusters.cluster_list:
        cluster_details = client.cluster(cluster.cluster_name)
        all_clusters.append({
            'cluster': cluster.cluster_name,
            'status': cluster.status,
            'region': cluster.region,
            'type': cluster.module_type
        })

    return all_clusters

# Get comprehensive cluster information
cluster_info = batch_cluster_info()
for info in cluster_info:
    print(f"{info['cluster']}: {info['status']} in {info['region']}")
```

### **Next Steps**

After mastering the basics, explore:

1. **Advanced Cluster Management** - Learn about scaling and configuration
2. **Monitoring and Metrics** - Set up cluster monitoring
3. **Integration Patterns** - Integrate with your applications
4. **Best Practices** - Production deployment guidelines

For detailed function documentation, see the sections below.

---

## Basic

### `info() -> UserOrgInfoDTO`

Get detailed organization and project information for the current user.

**Input**: None (automatically detected from user context)

**Returns:** `UserOrgInfoDTO` object with the following structure:

- `auth_provider` (str): Authentication provider (e.g., "github")
- `create_at` (str): User account creation timestamp (e.g., "2025-08-20 08:20:21")
- `email` (str): User email address (e.g., "1111111@mail.com")
- `org_info` (OrgInfo): Organization information object
- `user_name` (str): Username (e.g., "1976263299")

**OrgInfo Object Fields:**

- `org_create_at` (str): Organization creation timestamp (e.g., "2025-05-14 13:51:02")
- `org_id` (int): Organization ID (e.g., 1)
- `org_name` (str): Organization name (e.g., "default-free-org")
- `projects` (List[SimpleProjectInfo]): List of projects in the organization
- `roles` (List[str]): User roles in the organization (e.g., ["project-owner", "cluster-owner"])

**SimpleProjectInfo Object Fields:**

- `create_at` (str): Project creation timestamp (e.g., "2025-08-20 08:20:21")
- `project_id` (int): Project ID (e.g., 147)
- `project_name` (str): Project name (e.g., "project1")

**Example:**

```python
org_info = client.info()
print(f"Organization: {org_info.org_info.org_name}")
print(f"User: {org_info.user_name}")
print(f"Projects: {len(org_info.org_info.projects)}")
```

### `org() -> SimpleOrgInfo`

Get simplified organization information.

This function extracts only the basic organization details for simplified access.

**Returns:** `SimpleOrgInfo` object containing basic organization information:

- `org_name` (str): Organization name (e.g., "default-free-org")
- `org_id` (int): Organization ID (e.g., 1)
- `org_create_at` (str): Organization creation timestamp (e.g., "2025-05-14 13:51:02")

**Example:**

```python
org = client.org()
print(f"Organization: {org.org_name}")
print(f"ID: {org.org_id}")
print(f"Created: {org.org_create_at}")
```

## Cluster Management

### `clusters(page: int = 1, per_page: int = 20) -> ClusterList`

List all clusters in the current project.

**Parameters:**

- `page` (int, optional): Page number for pagination (default: 1)
- `per_page` (int, optional): Number of items per page (default: 20)

**Returns:** `ClusterList` object containing:

- `cluster_list` (List[ClusterListItem]): List of cluster items
- `total` (int): Total number of clusters

**ClusterListItem** fields:

- `cloud_provider` (str): Cloud provider name (e.g., "AWS")
- `cluster_name` (str): Name of the cluster (e.g., "test-cluster-123", "nihhhh", "nihhhhop")
- `create_at` (str): Cluster creation timestamp in ISO format (e.g., "2025-08-26T08:06:41Z")
- `module_type` (str): Module type (e.g., "EloqKV")
- `region` (str): Cloud region (e.g., "us-west-1")
- `status` (str): Cluster status (e.g., "idle")
- `version` (str): Cluster version (e.g., "nightly-2025-05-16")
- `zone` (str): Cloud zone (e.g., "us-west-1a")

**Example:**

```python
clusters = client.clusters(page=1, per_page=10)
print(f"Total clusters: {clusters.total}")
for cluster in clusters.cluster_list:
    print(f"- {cluster.cluster_name} ({cluster.status})")
```

### `cluster(cluster_name: str) -> DescClusterDTO`

Get detailed information about a specific cluster.

**Parameters:**

- `cluster_name` (str): Name of the cluster

**Returns:** `DescClusterDTO` object with detailed cluster information including:

- `admin_password` (str): Base64 encoded admin password for the cluster
- `admin_user` (str): Base64 encoded admin username for the cluster
- `cloud_provider` (str): Cloud provider name (e.g., "aws")
- `cluster_deploy_mode` (str): Cluster deployment mode (e.g., "txWithInternalLog")
- `create_at` (str): Cluster creation timestamp in ISO format
- `display_cluster_name` (str): Display name of the cluster
- `elb_addr` (str): Elastic Load Balancer address
- `elb_port` (int): Elastic Load Balancer port
- `elb_state` (str): Elastic Load Balancer state (e.g., "active")
- `log_cpu_limit` (float): Log service CPU limit
- `log_memory_mi_limit` (float): Log service memory limit in Mi
- `log_replica` (int): Log service replica count
- `module_type` (str): Module type (e.g., "EloqKV")
- `org_name` (str): Organization name
- `project_name` (str): Project name
- `region` (str): Cloud region
- `status` (str): Cluster status (e.g., "idle")
- `tx_cpu_limit` (float): Transaction service CPU limit
- `tx_memory_mi_limit` (float): Transaction service memory limit in Mi
- `tx_replica` (int): Transaction service replica count
- `version` (str): Cluster version
- `zone` (str): Cloud zone

**Example:**

```python
cluster_info = client.cluster("my-cluster")
print(f"Status: {cluster_info.status}")
print(f"Region: {cluster_info.region}")
print(f"Module: {cluster_info.module_type}")
```

### `cluster_create(cluster_name, region, sku_id) -> OperationResult`

Create a new cluster.

**Parameters:**

- `cluster_name` (str): Cluster display name (required)
- `region` (str): Region where the cluster will be created, e.g., "us-west-1" (required)
- `sku_id` (int): SKU ID for the cluster (required). Use `get_skus()` to find available SKU IDs

**Returns:** `OperationResult` object containing:

- `success` (bool): True if operation succeeded, False otherwise
- `message` (str): Human-readable message describing the result

**Example:**

```python
from eloq_sdk import schema

# First, get available SKUs
skus = client.get_skus(
    sku_type=schema.SKUType.SERVERLESS,
    eloq_module=schema.EloqModule.ELOQKV,
    cloud_provider=schema.CloudProvider.AWS
)

# Create the cluster
result = client.cluster_create(
    cluster_name="my-cluster",
    region="us-west-1",
    sku_id=skus[0].sku_id
)

if result.success:
    print(f"✅ {result.message}")
else:
    print(f"❌ {result.message}")
```

### `cluster_delete(cluster_name) -> OperationResult`

Delete a cluster. The cluster must be in 'available' status to be deleted.

**Parameters:**

- `cluster_name` (str): Cluster display name (required)

**Returns:** `OperationResult` object containing:

- `success` (bool): True if operation succeeded, False otherwise
- `message` (str): Human-readable message describing the result

**Example:**

```python
result = client.cluster_delete("my-cluster")
if result.success:
    print(f"✅ {result.message}")
else:
    print(f"❌ {result.message}")
```

**Note**: The cluster must be in 'available' status to be deleted.

### `cluster_credentials(cluster_name) -> ClusterCredentials`

Get cluster credentials (username and password) for database connection. The admin user ID and password are automatically decoded from base64 encoding.

**Parameters:**

- `cluster_name` (str): Cluster display name (required)

**Returns:** `ClusterCredentials` object containing:

- `username` (str): Decoded admin username
- `password` (str): Decoded admin password
- `host` (str): Load balancer address
- `port` (int): Load balancer port
- `status` (str): Cluster status

**Example:**

```python
credentials = client.cluster_credentials("my-cluster")
print(f"Username: {credentials.username}")
print(f"Password: {credentials.password}")
print(f"Host: {credentials.host}:{credentials.port}")
```

### `get_skus(sku_type, eloq_module, cloud_provider) -> List[SKUInfo]`

Get available SKUs filtered by SKU type, EloqDB module type, and cloud provider. Only SKUs available in the user's subscription plan are returned.

**Parameters:**

- `sku_type` (SKUType enum): SKU type filter
  - `SKUType.SERVERLESS`: Serverless SKU
  - `SKUType.DEDICATED`: Dedicated SKU
- `eloq_module` (EloqModule enum): EloqDB module type filter
  - `EloqModule.ELOQKV`: EloqKV module
  - `EloqModule.ELOQDOC`: EloqDoc module
- `cloud_provider` (CloudProvider enum): Cloud provider filter
  - `CloudProvider.AWS`: Amazon Web Services
  - `CloudProvider.GCP`: Google Cloud Platform

**Returns:** List of `SKUInfo` objects, each containing:

- `sku_id` (int): SKU ID
- `sku_name` (str): SKU name
- `sku_type` (str): SKU type ("serverless", "dedicated", "unspecified")
- `module_type` (str): Module type ("EloqSQL", "EloqKV", "EloqDoc")
- `version` (str): Version
- `tx_cpu_limit` (float): Transaction CPU limit
- `tx_memory_mi_limit` (float): Transaction memory limit (Mi)
- `tx_ev_gi_limit` (float): Transaction ephemeral volume limit (Gi)
- `tx_pv_gi_limit` (float): Transaction persistent volume limit (Gi)
- `log_cpu_limit` (float): Log CPU limit
- `log_memory_mi_limit` (float): Log memory limit (Mi)
- `log_pv_gi_limit` (float): Log persistent volume limit (Gi)
- `cloud_provider` (str): Cloud provider ("AWS", "GCP")
- `tx_replica` (int): Transaction replica count
- `log_replica` (int): Log replica count

**Example:**

```python
from eloq_sdk import schema

skus = client.get_skus(
    sku_type=schema.SKUType.SERVERLESS,
    eloq_module=schema.EloqModule.ELOQKV,
    cloud_provider=schema.CloudProvider.AWS
)

print(f"Found {len(skus)} available SKUs:")
for sku in skus:
    print(f"  - SKU ID: {sku.sku_id}, Name: {sku.sku_name}")
    print(f"    Type: {sku.sku_type}, Module: {sku.module_type}")
    print(f"    Cloud: {sku.cloud_provider}")
```

## Data Models

The SDK uses Pydantic dataclasses for data validation and serialization. Key models include:

- **`UserOrgInfoDTO`**: User and organization information
- **`SimpleOrgInfo`**: Simplified organization information
- **`ClusterList`**: List of clusters with pagination information
- **`ClusterListItem`**: Basic cluster information
- **`DescClusterDTO`**: Detailed cluster information
- **`ClusterCredentials`**: Cluster credentials for database connection
- **`OperationResult`**: Result object for create and delete operations
- **`SKUInfo`**: SKU information object
- **`DataBaseAndOveragePlan`**: Billing plan information
- **`DashboardType`**: Dashboard configuration

### OperationResult

Result object returned by create and delete operations.

```python
@dataclass
class OperationResult:
    success: bool  # True if operation succeeded, False otherwise
    message: str   # Human-readable message describing the result
```

### SKUInfo

SKU information object.

```python
@dataclass
class SKUInfo:
    sku_id: int
    sku_name: str
    sku_type: str
    module_type: str
    version: str
    tx_cpu_limit: float
    tx_memory_mi_limit: float
    tx_ev_gi_limit: float
    tx_pv_gi_limit: float
    log_cpu_limit: float
    log_memory_mi_limit: float
    log_pv_gi_limit: float
    cloud_provider: str
    tx_replica: int
    log_replica: int
```

### Enums

#### SKUType

```python
class SKUType(Enum):
    SERVERLESS = "serverless"
    DEDICATED = "dedicated"
```

#### EloqModule

```python
class EloqModule(Enum):
    ELOQKV = "eloqkv"
    ELOQDOC = "eloqdoc"
```

#### CloudProvider

```python
class CloudProvider(Enum):
    AWS = "aws"
    GCP = "gcp"
```

## Error Handling

The SDK provides comprehensive error handling with specific exception types. See the [Error Handling section](#error-handling-best-practices) above for detailed information.

## Complete Examples

### Full Workflow: Get SKUs → Create Cluster → Check Status → Delete Cluster

```python
from eloq_sdk import EloqAPI
from eloq_sdk import schema

# Initialize client
client = EloqAPI.from_environ()

# Step 1: Get available SKUs
skus = client.get_skus(
    sku_type=schema.SKUType.SERVERLESS,
    eloq_module=schema.EloqModule.ELOQKV,
    cloud_provider=schema.CloudProvider.AWS
)

if not skus:
    print("No SKUs available")
    exit(1)

# Step 2: Create cluster
result = client.cluster_create(
    cluster_name="my-cluster",
    region="us-west-1",
    sku_id=skus[0].sku_id
)

if not result.success:
    print(f"Failed to create cluster: {result.message}")
    exit(1)

print(f"✅ {result.message}")

# Step 3: Check cluster status
cluster_info = client.cluster("my-cluster")
print(f"Cluster status: {cluster_info.status}")

# Step 4: Get credentials
credentials = client.cluster_credentials("my-cluster")
print(f"Connection: {credentials.host}:{credentials.port}")

# Step 5: Delete cluster (when done)
result = client.cluster_delete("my-cluster")
if result.success:
    print(f"✅ {result.message}")
```
