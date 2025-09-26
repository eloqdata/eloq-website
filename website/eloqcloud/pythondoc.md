---
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Python SDK Documentation

> Complete API reference for the Eloq Python SDK with detailed function documentation, input/output specifications, and usage examples.

## Installation

You just need to use pip:

```bash
pip install eloq-sdk
```

## Quick Start

### **Basic Setup**

```python
from eloq_sdk import EloqAPI

# Method 1: Create client with API token directly
client = EloqAPI.from_token("your_api_token")

# Method 2: Create client from environment variable
# Set ELOQ_API_TOKEN environment variable first
import os
os.environ['ELOQ_API_TOKEN'] = 'your_api_token'
client = EloqAPI.from_environ()
```

### **Getting Your API Token**

1. Log in to your [EloqCloud Dashboard](https://cloud.eloqdata.com)
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Copy the token for use in your application

### **Your First API Call**

Let's start by getting your organization information:

```python
from eloq_sdk import EloqAPI

def get_organization_info():
    try:
        # Initialize the client
        client = EloqAPI.from_token("your_api_token")

        # Get organization information
        org_info = client.org_info()

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
from eloq_sdk.exceptions import EloqAPIError

def manage_clusters():
    client = EloqAPI.from_token("your_api_token")

    try:


        # Step 1 List existing clusters
        print("\n=== Listing Clusters ===")
        clusters = client.clusters()
        print(f"Found {len(clusters)} clusters:")

        for cluster in clusters:
            print(f"- {cluster.cluster_name}")
            print(f"  Status: {cluster.status}")
            print(f"  Type: {cluster.module_type}")
            print(f"  Region: {cluster.region}")
            print(f"  Created: {cluster.create_at}")

        # Step 2: Create a new cluster (if less than 4 clusters)
        if len(clusters) < 4:  # Free tier limit
            print(f"\n=== Creating New Cluster ===")
            cluster_name = f"demo-cluster-{len(clusters) + 1}"

            try:
                response = client.cluster_create(
                    org_id=org_id,
                    project_id=project_id,
                    clusterName=cluster_name,
                    region="us-west-1",
                    requiredZone="us-west-1a",
                    skuId=1  # Basic SKU for free tier
                )

                print(f"✅ Cluster creation initiated: {cluster_name}")
                print(f"Response: {response.message}")

                # Wait a moment and check cluster status
                import time
                time.sleep(5)

                # Get cluster details
                cluster_details = client.cluster(org_id, project_id, cluster_name)
                print(f"Cluster status: {cluster_details.status}")

            except EloqAPIError as e:
                print(f"❌ Failed to create cluster: {e}")
        else:
            print("\n⚠️  Free tier limit reached (4 clusters maximum)")

        # Step 3: Get cluster connection credentials
        if clusters:
            print(f"\n=== Getting Cluster Credentials ===")
            cluster_name = clusters[0].cluster_name

            try:
                credentials = client.cluster_credentials(cluster_name)
                print(f"Cluster: {cluster_name}")
                print(f"Host: {credentials.host}")
                print(f"Port: {credentials.port}")
                print(f"Status: {credentials.status}")
                print("Username and password are base64 encoded for security")

            except EloqAPIError as e:
                print(f"❌ Failed to get credentials: {e}")

    except EloqAPIError as e:
        print(f"API Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

# Run the cluster management example
manage_clusters()
```

### **Environment Variables Setup**

For better security, store your API token in environment variables:

```python
import os
from eloq_sdk import EloqAPI

# Set environment variable (do this once)
os.environ['ELOQ_API_TOKEN'] = 'your_actual_api_token'

# Create client from environment
client = EloqAPI.from_environ()

# Now you can use the client
org_info = client.org_info()
print(f"Organization: {org_info.org_info.org_name}")
```

### **Error Handling Best Practices**

```python
from eloq_sdk import EloqAPI
from eloq_sdk.exceptions import EloqAPIError

def robust_api_call():
    client = EloqAPI.from_token("your_api_token")

    try:
        # Your API calls here
        org_info = client.org_info()
        return org_info

    except EloqAPIError as e:
        # Handle API-specific errors
        print(f"API Error: {e}")
        print("This could be due to:")
        print("- Invalid API token")
        print("- Rate limiting")
        print("- Server issues")
        return None

    except ConnectionError as e:
        # Handle network errors
        print(f"Network Error: {e}")
        print("Check your internet connection")
        return None

    except Exception as e:
        # Handle unexpected errors
        print(f"Unexpected error: {e}")
        return None

# Use the robust function
result = robust_api_call()
if result:
    print("Success!")
else:
    print("Failed to get organization info")
```

### **Common Use Cases**

#### **1. Monitor Cluster Health**

```python
def monitor_clusters():
    client = EloqAPI.from_token("your_api_token")
    org_info = client.org_info()

    for project in org_info.org_info.projects:
        clusters = client.clusters(org_info.org_info.org_id, project.project_id)

        print(f"\n📁 Project: {project.project_name}")
        for cluster in clusters:
            status_emoji = "✅" if cluster.status == "idle" else "⚠️"
            print(f"  {status_emoji} {cluster.cluster_name}: {cluster.status}")
```

#### **2. Batch Cluster Operations**

```python
def batch_cluster_info():
    client = EloqAPI.from_token("your_api_token")
    org_info = client.org_info()

    all_clusters = []

    clusters = client.clusters()
    for cluster in clusters:
        cluster_details = client.cluster(
                cluster.cluster_name
            )
        all_clusters.append({
                'project': project.project_name,
                'cluster': cluster.cluster_name,
                'status': cluster.status,
                'region': cluster.region,
                'type': cluster.module_type
            })

    return all_clusters

# Get comprehensive cluster information
cluster_info = batch_cluster_info()
for info in cluster_info:
    print(f"{info['project']}/{info['cluster']}: {info['status']} in {info['region']}")
```

### **Next Steps**

After mastering the basics, explore:

1. **Advanced Cluster Management** - Learn about scaling and configuration
2. **Monitoring and Metrics** - Set up cluster monitoring
3. **Integration Patterns** - Integrate with your applications
4. **Best Practices** - Production deployment guidelines

For detailed function documentation, see the sections below.

---

## Organization

### `org_info() -> UserOrgInfoDTO`

Get current user's organization information.

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
org_info = client.org_info()
print(f"Organization: {org_info.org_info.org_name}")
print(f"User: {org_info.user_name}")
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

### `clusters(page: int = 1, per_page: int = 20) -> List[ClusterListItem]`

Get a list of clusters in a project.

**Parameters:**

- `page` (int, optional): Page number for pagination (default: 1)
- `per_page` (int, optional): Items per page (default: 20)

**Returns:** `List[ClusterListItem]` - List of cluster information objects, each containing:

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
clusters = client.clusters(org_id=123, project_id=456)
for cluster in clusters:
    print(f"Cluster: {cluster.cluster_name}, Status: {cluster.status}")
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
cluster_details = client.cluster(org_id=123, project_id=456, cluster_name="my-cluster")
print(f"Cloud Provider: {cluster_details.cloud_provider}")
print(f"Region: {cluster_details.region}")
```

### `cluster_create(**json: dict) -> ShelfResponse`

Create a new cluster in a project.

**Parameters:**

- `cluster_name` (string): Name of the cluster
- `region` (string): Cloud region
- `requiredZone` (string): Cloud zone
- `skuId` (int): SKU type ID

**Returns:** `ShelfResponse` object with the following structure:

- `code` (int): Response status code
- `data` (Any): Response data (usually cluster creation result)
- `message` (str): Response message

**Response Data Fields:**

- `cluster_id` (str): ID of the created cluster
- `cluster_name` (str): Name of the created cluster
- `status` (str): Creation status
- `message` (str): Additional information about the creation

**Example:**

```python
response = client.cluster_create(
    org_id=1,
    project_id=147,
    clusterName="test-cluster-123",
    region="us-west-1",
    requiredZone="us-west-1a",
    skuId=1
)
print(f"Cluster created: {response.data.cluster_name}")
```

### `cluster_credentials(cluster_name: str) -> ClusterCredentials`

Get cluster credentials (username and password) for database connection.

**Parameters:**

- `cluster_name` (str): Name of the cluster

**Returns:** `ClusterCredentials` object containing cluster credentials and connection info:

- `username` (str): Base64 encoded admin username for the cluster
- `password` (str): Base64 encoded admin password for the cluster
- `host` (str): Elastic Load Balancer address for connection
- `port` (int): Elastic Load Balancer port for connection
- `status` (str): Cluster status (e.g., "idle")

**Example:**

```python
credentials = client.cluster_credentials(1, 147, "my-cluster")
print(f"Username: {credentials.username}")
print(f"Password: {credentials.password}")
print(f"Host: {credentials.host}")
print(f"Port: {credentials.port}")
```

## Data Models

The SDK uses Pydantic dataclasses for data validation and serialization. Key models include:

- **`UserOrgInfoDTO`**: User and organization information
- **`ClusterListItem`**: Basic cluster information
- **`DescClusterDTO`**: Detailed cluster information
- **`ShelfResponse`**: Standard API response structure
- **`DataBaseAndOveragePlan`**: Billing plan information
- **`DashboardType`**: Dashboard configuration

## Error Handling

The SDK raises `EloqAPIError` for API-related errors:

```python
from eloq_sdk_python.exceptions import EloqAPIError

try:
    clusters = client.clusters(org_id=123, project_id=456)
except EloqAPIError as e:
    print(f"API Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Complete Examples

### Cluster Management Workflow

```python
from eloq_sdk_python import EloqAPI

# Initialize client
client = EloqAPI.from_token("your_token")

# Get organization info
org_info = client.org_info()
org_id = org_info.org_info.org_id
project_id = org_info.org_info.projects[0].project_id

# List clusters
clusters = client.clusters(org_id=org_id, project_id=project_id)
print(f"Found {len(clusters)} clusters")

# Create new cluster
response = client.cluster_create(
    org_id=org_id,
    project_id=project_id,
    clusterName="new-cluster",
    region="us-west-1",
    requiredZone="us-west-1a",
    skuId=1
)

# Get cluster details
cluster_details = client.cluster(org_id, project_id, "new-cluster")
print(f"Cluster status: {cluster_details.status}")

# Get connection credentials
credentials = client.cluster_credentials(org_id, project_id, "new-cluster")
print(f"Connection host: {credentials.host}:{credentials.port}")
```
