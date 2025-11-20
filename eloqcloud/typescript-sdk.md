---
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# TypeScript SDK

> Complete API reference for the Eloq TypeScript SDK with detailed function documentation, input/output specifications, and usage examples.

## Installation

### Requirements

- Node.js >= 16.0.0
- npm or yarn

### Install via npm

```bash
npm install eloq-sdk-typescript
```

### Install via yarn

```bash
yarn add eloq-sdk-typescript
```

## Quick Start

### **Basic Setup**

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

// Create client with API key
const client = createEloqClient('your_api_token');

// Get organization information
const orgInfo = await client.info();
console.log('Organization:', orgInfo.org_info.org_name);
console.log('Projects:', orgInfo.org_info.projects.length);
```

### **Getting Your API Key**

1. Log in to your [EloqCloud Dashboard](https://cloud.eloqdata.com)
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Copy the key for use in your application

### **Using Environment Variables**

For better security, store your API token in environment variables:

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

const client = createEloqClient(process.env.ELOQ_API_TOKEN || '');
```

### **Your First API Call**

Let's start by getting your organization information:

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

async function getOrganizationInfo() {
  try {
    // Initialize the client
    const client = createEloqClient('your_api_token');

    // Get organization information
    const orgInfo = await client.info();

    console.log('=== Organization Information ===');
    console.log(`Organization: ${orgInfo.org_info.org_name}`);
    console.log(`Organization ID: ${orgInfo.org_info.org_id}`);
    console.log(`User: ${orgInfo.user_name}`);
    console.log(`Email: ${orgInfo.email}`);
    console.log(`Created: ${orgInfo.create_at}`);
    console.log(`Projects: ${orgInfo.org_info.projects.length}`);

    return orgInfo;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Run the example
getOrganizationInfo();
```

### **Working with Clusters**

Here's a comprehensive example showing how to manage clusters:

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

async function manageClusters() {
  const client = createEloqClient('your_api_token');

  try {
    // Step 1: Get organization information
    const orgInfo = await client.info();

    // Step 2: Get available SKUs
    const skus = await client.get_skus({
      type: 'serverless',
      eloqModule: 'eloqkv',
      cloudProvider: 'aws'
    });
    console.log(`Found ${skus.length} available SKUs`);

    // Step 3: List existing clusters
    console.log('\n=== Listing Clusters ===');
    const clusters = await client.clusters(1, 20);
    console.log(`Total clusters: ${clusters.total}`);

    for (const cluster of clusters.cluster_list) {
      console.log(`- ${cluster.cluster_name}`);
      console.log(`  Status: ${cluster.status}`);
      console.log(`  Type: ${cluster.module_type}`);
      console.log(`  Region: ${cluster.region}`);
      console.log(`  Created: ${cluster.create_at}`);
    }

    // Step 4: Create a new cluster
    if (skus.length > 0) {
      console.log('\n=== Creating New Cluster ===');
      const clusterName = 'demo-cluster-1';

      try {
        const newCluster = await client.cluster_create({
          clusterName,
          region: 'us-west-1',
          RequiredZone: 'us-west-1a',
          skuId: skus[0].sku_id
        });

        console.log(`✅ Cluster created: ${newCluster.display_cluster_name}`);
        console.log(`   Status: ${newCluster.status}`);
        console.log(`   Region: ${newCluster.region}`);
      } catch (error) {
        console.error(`❌ Failed to create cluster: ${error.message}`);
      }
    }

    // Step 5: Get cluster connection credentials
    if (clusters.cluster_list.length > 0) {
      console.log('\n=== Getting Cluster Credentials ===');
      const clusterName = clusters.cluster_list[0].cluster_name;

      try {
        const credentials = await client.cluster_credentials(clusterName);
        console.log(`Cluster: ${clusterName}`);
        console.log(`Address: ${credentials.address}`);
        console.log(`Port: ${credentials.port}`);
        console.log(`Status: ${credentials.status}`);
      } catch (error) {
        console.error(`❌ Failed to get credentials: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error managing clusters:', error);
  }
}

// Run the cluster management example
manageClusters();
```

## Authentication & Client Initialization

The SDK provides multiple ways to initialize the client:

### 1. Simple Configuration

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

// Simple configuration with just API key
const client = createEloqClient('your_api_token');
```

### 2. Full Configuration

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

// Full configuration with all options
const client = createEloqClient({
  apiKey: 'your_api_token',
  baseURL: 'https://api-prod.eloqdata.com',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
});
```

### 3. From Environment Variables

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

const client = createEloqClient({
  apiKey: process.env.ELOQ_API_TOKEN!,
  baseURL: process.env.ELOQ_API_URL || 'https://api-prod.eloqdata.com',
  timeout: parseInt(process.env.ELOQ_TIMEOUT || '30000'),
});
```

### **Error Handling Best Practices**

The SDK provides comprehensive error handling with detailed error messages for different scenarios:

#### Error Types

- **Authentication Errors (401)**: Invalid, expired, or missing API key
- **Authorization Errors (403)**: Insufficient permissions
- **Not Found Errors (404)**: Requested resource doesn't exist
- **Bad Request Errors (400)**: Invalid request parameters
- **Server Errors (500)**: Internal server error
- **Network Errors**: Connectivity issues

#### Handling Errors

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

async function robustApiCall() {
  const client = createEloqClient('your_api_token');

  try {
    const orgInfo = await client.info();
    return orgInfo;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.error('Authentication failed. Please check your API key.');
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        console.error('Access denied. Check your API key permissions.');
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.error('Resource not found. Verify the resource exists.');
      } else if (error.message.includes('Network error')) {
        console.error('Network error. Check your internet connection.');
      } else {
        console.error('Unexpected error:', error.message);
      }
    }
    return null;
  }
}

// Use the robust function
const result = await robustApiCall();
if (result) {
  console.log('Success!');
} else {
  console.log('Failed to get organization info');
}
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

### `info() -> Promise<EloqUser>`

Get organization information including user details, organization details, and projects.

**Signature:**

```typescript
async info(): Promise<EloqUser>
```

**Input:** None

**Output:** `Promise<EloqUser>`

**Example:**

```typescript
const client = createEloqClient('your_api_token');
const orgInfo = await client.info();

console.log('Organization:', orgInfo.org_info.org_name);
console.log('Organization ID:', orgInfo.org_info.org_id);
console.log('User:', orgInfo.user_name);
console.log('Email:', orgInfo.email);
console.log('Projects:', orgInfo.org_info.projects.length);

// Access projects
orgInfo.org_info.projects.forEach(project => {
  console.log(`- ${project.project_name} (ID: ${project.project_id})`);
});
```

**Returns:**

- `EloqUser` object containing:
  - User information (user_name, email, auth_provider, create_at)
  - Organization information (org_info) containing:
    - Organization details (org_id, org_name, org_create_at)
    - Projects array (EloqProject[])
    - User roles (roles[])

### `get_skus(params) -> Promise<EloqSku[]>`

Get available SKUs filtered by type, module, and cloud provider. Only returns SKUs that are available in the user's subscription plan.

**Signature:**

```typescript
async get_skus(params: GetSkusParams): Promise<EloqSku[]>
```

**Input:**

```typescript
interface GetSkusParams {
  type: 'serverless' | 'dedicated';        // SKU type
  eloqModule: 'eloqkv' | 'eloqdoc';       // EloqDB module type
  cloudProvider: 'aws' | 'gcp';           // Cloud provider
}
```

**Output:** `Promise<EloqSku[]>`

**Parameter Validation:**

- `type`: Must be `'serverless'` or `'dedicated'`
- `eloqModule`: Must be `'eloqkv'` or `'eloqdoc'`
- `cloudProvider`: Must be `'aws'` or `'gcp'`

**Example:**

```typescript
const client = createEloqClient('your_api_token');

// Get serverless EloqKV SKUs on AWS
const skus = await client.get_skus({
  type: 'serverless',
  eloqModule: 'eloqkv',
  cloudProvider: 'aws'
});

console.log(`Found ${skus.length} SKU(s):`);
skus.forEach(sku => {
  console.log(`- ${sku.sku_name} (ID: ${sku.sku_id})`);
  console.log(`  Type: ${sku.sku_type}`);
  console.log(`  Module: ${sku.module_type}`);
  console.log(`  Version: ${sku.version}`);
  console.log(`  Cloud Provider: ${sku.cloud_provider}`);
});
```

**Returns:**

- Array of `EloqSku` objects, each containing:
  - SKU identification (sku_id, sku_name)
  - SKU type and module (sku_type, module_type)
  - Version information
  - Resource limits (CPU, memory, storage)
  - Replica configuration
  - Cloud provider information

**Note:** This API only returns SKUs that are:
- Available (`available = 1`)
- Included in the user's current subscription plan

## Cluster Management

### `clusters(page?, perPage?, orgId?, projectId?) -> Promise<ClustersListResponse>`

List clusters for a specific organization and project with pagination support.

**Signature:**

```typescript
async clusters(
  page?: number,        // Page number (default: 1, must be > 0)
  perPage?: number,     // Items per page (default: 20, must be 1-50)
  orgId?: number,       // Organization ID (optional, auto-fetched if not provided)
  projectId?: number    // Project ID (optional, uses first project if not provided)
): Promise<ClustersListResponse>
```

**Input:**

- `page` (optional): Page number, must be greater than 0 (default: 1)
- `perPage` (optional): Items per page, must be between 1 and 50 (default: 20)
- `orgId` (optional): Organization ID. If not provided, will be fetched from `info()`
- `projectId` (optional): Project ID. If not provided, will use the first project from `info()`

**Output:** `Promise<ClustersListResponse>`

**Example:**

```typescript
const client = createEloqClient('your_api_token');

// List clusters with default pagination
const response = await client.clusters();
console.log(`Total clusters: ${response.total}`);
console.log(`Clusters in this page: ${response.cluster_list.length}`);

// List clusters with custom pagination
const page2 = await client.clusters(2, 10);

// Display cluster information
response.cluster_list.forEach(cluster => {
  console.log(`- ${cluster.cluster_name}`);
  console.log(`  Status: ${cluster.status}`);
  console.log(`  Module: ${cluster.module_type}`);
  console.log(`  Cloud Provider: ${cluster.cloud_provider}`);
  console.log(`  Region: ${cluster.region}`);
  console.log(`  Zone: ${cluster.zone}`);
});
```

**Returns:**

```typescript
interface ClustersListResponse {
  cluster_list: ClusterListItem[];  // Array of cluster items
  total: number;                     // Total number of clusters
}
```

### `cluster(clusterName) -> Promise<EloqCluster>`

Get detailed information about a specific cluster.

**Signature:**

```typescript
async cluster(clusterName: string): Promise<EloqCluster>
```

**Input:**

- `clusterName` (required): The display name of the cluster

**Output:** `Promise<EloqCluster>`

**Example:**

```typescript
const client = createEloqClient('your_api_token');
const cluster = await client.cluster('my-cluster');

console.log('Cluster Name:', cluster.display_cluster_name);
console.log('Status:', cluster.status);
console.log('Module Type:', cluster.module_type);
console.log('Cloud Provider:', cluster.cloud_provider);
console.log('Region:', cluster.region);
console.log('Zone:', cluster.zone);
console.log('Version:', cluster.version);
console.log('Created At:', cluster.create_at);
```

**Returns:**

- `EloqCluster` object containing complete cluster information including:
  - Basic info (display_cluster_name, status, module_type, version)
  - Cloud details (cloud_provider, region, zone)
  - Resource limits (CPU, memory, replicas)
  - Connection info (elb_addr, elb_port, elb_state)
  - Admin credentials (admin_user, admin_password)
  - Deployment mode

### `cluster_create(request) -> Promise<EloqCluster>`

Create a new cluster in your organization.

**Signature:**

```typescript
async cluster_create(request: CreateClusterRequest): Promise<EloqCluster>
```

**Input:**

```typescript
interface CreateClusterRequest {
  clusterName: string;    // Name for the new cluster
  region: string;         // AWS region (e.g., 'us-east-1')
  RequiredZone: string;  // Availability zone (e.g., 'us-east-1a')
  skuId: number;          // SKU ID (obtain from get_skus())
}
```

**Output:** `Promise<EloqCluster>`

**Example:**

```typescript
const client = createEloqClient('your_api_token');

// First, get available SKUs
const skus = await client.get_skus({
  type: 'serverless',
  eloqModule: 'eloqkv',
  cloudProvider: 'aws'
});

if (skus.length === 0) {
  throw new Error('No available SKUs found');
}

// Create cluster with the first available SKU
const newCluster = await client.cluster_create({
  clusterName: 'my-new-cluster',
  region: 'us-east-1',
  RequiredZone: 'us-east-1a',
  skuId: skus[0].sku_id
});

console.log('Cluster created:', newCluster.display_cluster_name);
console.log('Status:', newCluster.status);
```

**Returns:**

- `EloqCluster` object for the newly created cluster

### `cluster_delete(clusterName, orgId?, projectId?) -> Promise<void>`

Delete a cluster. The cluster must be in `'available'` status to be deleted.

**Signature:**

```typescript
async cluster_delete(
  clusterName: string,    // Cluster display name
  orgId?: number,        // Organization ID (optional, auto-fetched if not provided)
  projectId?: number      // Project ID (optional, uses first project if not provided)
): Promise<void>
```

**Input:**

- `clusterName` (required): The display name of the cluster to delete
- `orgId` (optional): Organization ID. If not provided, will be fetched from `info()`
- `projectId` (optional): Project ID. If not provided, will use the first project from `info()`

**Output:** `Promise<void>`

**Requirements:**

- Cluster must be in `'available'` status
- User must have delete permissions

**Example:**

```typescript
const client = createEloqClient('your_api_token');

try {
  // Check cluster status first
  const cluster = await client.cluster('my-cluster');
  
  if (cluster.status !== 'available') {
    console.error(`Cannot delete cluster: status is '${cluster.status}', must be 'available'`);
    return;
  }
  
  // Delete the cluster
  await client.cluster_delete('my-cluster');
  console.log('Cluster deleted successfully');
} catch (error) {
  console.error('Failed to delete cluster:', error.message);
}
```

**Throws:**

- Error if cluster is not in `'available'` status
- Error if cluster is not found
- Error if user lacks permissions

### `cluster_credentials(clusterName) -> Promise<ClusterAdminInfo>`

Get cluster connection credentials including address, port, username, and password for database connections.

**Signature:**

```typescript
async cluster_credentials(clusterName: string): Promise<ClusterAdminInfo>
```

**Input:**

- `clusterName` (required): The display name of the cluster

**Output:** `Promise<ClusterAdminInfo>`

**Example:**

```typescript
const client = createEloqClient('your_api_token');
const credentials = await client.cluster_credentials('my-cluster');

console.log('Connection Details:');
console.log(`Address: ${credentials.address}`);
console.log(`Port: ${credentials.port}`);
console.log(`Username: ${credentials.username}`);
console.log(`Password: ${credentials.password}`);

// Use credentials for database connection
const connectionString = `redis://${credentials.username}:${credentials.password}@${credentials.address}:${credentials.port}`;
```

**Returns:**

```typescript
interface ClusterAdminInfo {
  address: string;        // Load balancer address
  port: number;           // Connection port
  username: string;       // Admin username (base64 decoded)
  password: string;       // Admin password (base64 decoded)
  clusterName: string;   // Cluster display name
  orgName: string;       // Organization name
  projectName: string;   // Project name
  status: string;         // Cluster status
  elbState: string;       // Load balancer state
}
```

**Note:**

- Username and password are automatically base64 decoded
- Cluster must be in `'idle'` or `'active'` status
- Load balancer must be in `'active'` state

## Type Definitions

### Core Types

#### `EloqUser`

Represents the authenticated user and their organization information.

```typescript
interface EloqUser {
  auth_provider: string;        // Authentication provider
  create_at: string;            // User creation timestamp
  email: string;                // User email address
  org_info: EloqOrgInfo;        // Organization information
  user_name: string;            // Username
}
```

#### `EloqOrgInfo`

Organization information including projects and roles.

```typescript
interface EloqOrgInfo {
  org_create_at: string;        // Organization creation timestamp
  org_id: number;               // Organization ID
  org_name: string;             // Organization name
  projects: EloqProject[];      // Array of projects
  roles: string[];              // User roles in the organization
}
```

#### `EloqProject`

Project information.

```typescript
interface EloqProject {
  create_at: string;            // Project creation timestamp
  project_id: number;          // Project ID
  project_name: string;         // Project name
}
```

#### `EloqCluster`

Complete cluster information including configuration and connection details.

```typescript
interface EloqCluster {
  org_name: string;             // Organization name
  project_name: string;         // Project name
  display_cluster_name: string; // Cluster display name
  module_type: string;          // Module type (EloqSQL, EloqKV, EloqDoc)
  cloud_provider: string;       // Cloud provider (AWS, GCP)
  region: string;               // AWS/GCP region
  zone: string;                 // Availability zone
  status: string;               // Cluster status
  tx_cpu_limit: number;         // Transaction CPU limit
  tx_memory_mi_limit: number;   // Transaction memory limit (Mi)
  log_cpu_limit: number;        // Log CPU limit
  log_memory_mi_limit: number;  // Log memory limit (Mi)
  tx_replica: number;           // Transaction replica count
  log_replica: number;          // Log replica count
  version: string;              // Cluster version
  elb_addr: string;             // Load balancer address
  elb_port: number;             // Load balancer port
  create_at: string;            // Cluster creation timestamp
  elb_state: string;            // Load balancer state
  admin_user: string;           // Admin username (base64 encoded)
  admin_password: string;       // Admin password (base64 encoded)
  cluster_deploy_mode: string;  // Deployment mode
}
```

#### `ClusterListItem`

Cluster information from the clusters list API.

```typescript
interface ClusterListItem {
  cluster_name: string;          // Cluster name
  version: string;              // Cluster version
  module_type: string;           // Module type (EloqSQL, EloqKV, EloqDoc)
  status: string;               // Status (available, unavailable, provisioning, etc.)
  cloud_provider: string;       // Cloud provider (AWS, GCP)
  region: string;               // Region
  zone: string;                 // Zone
  create_at: string;            // Creation timestamp (ISO 8601 format)
  sku_name: string;             // SKU name
}
```

#### `ClustersListResponse`

Response from the clusters list API.

```typescript
interface ClustersListResponse {
  cluster_list: ClusterListItem[];  // Array of cluster items
  total: number;                     // Total number of clusters
}
```

#### `EloqSku`

SKU information including resource limits and configuration.

```typescript
interface EloqSku {
  sku_id: number;               // SKU ID
  sku_name: string;             // SKU name
  sku_type: string;             // SKU type (serverless, dedicated, unspecified)
  module_type: string;          // Module type (EloqSQL, EloqKV, EloqDoc)
  version: string;              // Version
  tx_cpu_limit: number;         // Transaction CPU limit
  tx_memory_mi_limit: number;   // Transaction memory limit (Mi)
  tx_ev_gi_limit: number;       // Transaction EV storage limit (Gi)
  tx_pv_gi_limit: number;       // Transaction PV storage limit (Gi)
  log_cpu_limit: number;        // Log CPU limit
  log_memory_mi_limit: number;  // Log memory limit (Mi)
  log_pv_gi_limit: number;      // Log PV storage limit (Gi)
  cloud_provider: string;       // Cloud provider (AWS, GCP)
  tx_replica: number;           // Transaction replica count
  log_replica: number;          // Log replica count
}
```

#### `ClusterAdminInfo`

Cluster connection credentials and metadata.

```typescript
interface ClusterAdminInfo {
  address: string;              // Load balancer address
  port: number;                // Connection port
  username: string;             // Admin username (decoded)
  password: string;             // Admin password (decoded)
  clusterName: string;         // Cluster display name
  orgName: string;             // Organization name
  projectName: string;         // Project name
  status: string;              // Cluster status
  elbState: string;            // Load balancer state
}
```

#### `CreateClusterRequest`

Request parameters for creating a new cluster.

```typescript
interface CreateClusterRequest {
  clusterName: string;          // Cluster name
  region: string;               // AWS/GCP region
  RequiredZone: string;         // Availability zone
  skuId: number;                // SKU ID (from get_skus())
}
```

#### `GetSkusParams`

Parameters for querying available SKUs.

```typescript
interface GetSkusParams {
  type: 'serverless' | 'dedicated';      // SKU type
  eloqModule: 'eloqkv' | 'eloqdoc';      // EloqDB module type
  cloudProvider: 'aws' | 'gcp';           // Cloud provider
}
```

#### `EloqClientConfig`

Client configuration options.

```typescript
interface EloqClientConfig {
  apiKey: string;               // Required: API key
  baseURL?: string;             // Optional: API base URL (default: 'https://api-prod.eloqdata.com')
  timeout?: number;             // Optional: Request timeout in ms (default: 30000)
  maxRetries?: number;          // Optional: Max retry attempts (default: 3)
  retryDelay?: number;          // Optional: Base retry delay in ms (default: 1000)
}
```

## Error Handling

The SDK provides comprehensive error handling with detailed error messages for different scenarios. See the [Error Handling section](#error-handling-best-practices) above for detailed information.

## Complete Examples

### Full Workflow: Get SKUs → Create Cluster → Check Status → Delete Cluster

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

async function completeWorkflow() {
  const client = createEloqClient(process.env.ELOQ_API_TOKEN!);

  try {
    // Step 1: Get organization info
    const orgInfo = await client.info();
    console.log(`Organization: ${orgInfo.org_info.org_name}`);

    // Step 2: Get available SKUs
    const skus = await client.get_skus({
      type: 'serverless',
      eloqModule: 'eloqkv',
      cloudProvider: 'aws'
    });
    console.log(`Found ${skus.length} available SKUs`);

    if (skus.length === 0) {
      throw new Error('No available SKUs found');
    }

    // Step 3: Create cluster
    const newCluster = await client.cluster_create({
      clusterName: 'my-cluster',
      region: 'us-east-1',
      RequiredZone: 'us-east-1a',
      skuId: skus[0].sku_id
    });
    console.log(`Created cluster: ${newCluster.display_cluster_name}`);

    // Step 4: Check cluster status
    const cluster = await client.cluster('my-cluster');
    console.log(`Cluster status: ${cluster.status}`);

    // Step 5: Get credentials
    if (cluster.status === 'active') {
      const credentials = await client.cluster_credentials('my-cluster');
      console.log(`Connection: ${credentials.address}:${credentials.port}`);
    }

    // Step 6: List clusters
    const clusters = await client.clusters(1, 20);
    console.log(`Total clusters: ${clusters.total}`);

    // Step 7: Delete cluster (when done)
    if (cluster.status === 'available') {
      await client.cluster_delete('my-cluster');
      console.log('Cluster deleted successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

completeWorkflow();
```
