# TypeScript SDK Documentation

> Complete API reference for the Eloq TypeScript SDK with detailed function documentation, input/output specifications, and usage examples.

## Installation

You can install the SDK using npm or yarn:

```bash
npm install eloq-sdk-typescript
```

```bash
yarn add eloq-sdk-typescript
```

## Quick Start

### **Basic Setup**

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

// Method 1: Create client with API token directly
const client = createEloqClient('your_api_token');

// Method 2: Create client with full configuration
const client = createEloqClient({
  apiKey: 'your_api_token',
  baseURL: 'https://api.eloqdata.com',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
});
```

### **Getting Your API Token**

1. Log in to your [EloqCloud Dashboard](https://cloud.eloqdata.com)
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Copy the token for use in your application

### **Your First API Call**

Let's start by getting your organization information:

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

async function getOrganizationInfo() {
  try {
    // Initialize the client
    const client = createEloqClient('your_api_token');

    // Get organization information
    const orgInfo = await client.orgInfo();

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
import {createEloqClient} from 'eloq-sdk-typescript';

async function manageClusters() {
  const client = createEloqClient('your_api_token');

  try {
    // Step 1: Get organization information
    const orgInfo = await client.orgInfo();
    const orgId = orgInfo.org_info.org_id;

    // Use the first project for this example
    if (!orgInfo.org_info.projects.length) {
      console.log(
        'No projects found. Please create a project first.',
      );
      return;
    }

    const project = orgInfo.org_info.projects[0];
    const projectId = project.project_id;

    console.log(
      `Working with project: ${project.project_name} (ID: ${projectId})`,
    );

    // Step 2: List existing clusters
    console.log('\n=== Listing Clusters ===');
    const clusters = await client.clusters();
    console.log(`Found ${clusters.length} clusters:`);

    for (const cluster of clusters) {
      console.log(`- ${cluster.cluster_name}`);
      console.log(`  Status: ${cluster.status}`);
      console.log(`  Type: ${cluster.module_type}`);
      console.log(`  Region: ${cluster.region}`);
      console.log(`  Created: ${cluster.create_at}`);
    }

    // Step 3: Create a new cluster (if less than 4 clusters)
    if (clusters.length < 4) {
      // Free tier limit
      console.log('\n=== Creating New Cluster ===');
      const clusterName = `demo-cluster-${clusters.length + 1}`;

      try {
        const newCluster = await client.createCluster({
          clusterName,
          region: 'us-west-1',
          RequiredZone: 'us-west-1a',
          skuId: 1, // Basic SKU for free tier
        });

        console.log(
          `✅ Cluster created: ${newCluster.cluster_name}`,
        );
        console.log(`   Status: ${newCluster.status}`);
        console.log(`   Region: ${newCluster.region}`);
      } catch (error) {
        console.error(
          `❌ Failed to create cluster: ${error.message}`,
        );
      }
    } else {
      console.log(
        '\n⚠️  Free tier limit reached (4 clusters maximum)',
      );
    }

    // Step 4: Get cluster connection credentials
    if (clusters.length > 0) {
      console.log('\n=== Getting Cluster Credentials ===');
      const clusterName = clusters[0].cluster_name;

      try {
        const credentials = await client.clusterCredentials(
          clusterName,
        );
        console.log(`Cluster: ${clusterName}`);
        console.log(`Host: ${credentials.host}`);
        console.log(`Port: ${credentials.port}`);
        console.log(`Status: ${credentials.status}`);
        console.log(
          'Username and password are base64 encoded for security',
        );
      } catch (error) {
        console.error(
          `❌ Failed to get credentials: ${error.message}`,
        );
      }
    }
  } catch (error) {
    console.error('Error managing clusters:', error);
  }
}

// Run the cluster management example
manageClusters();
```

### **Environment Variables Setup**

For better security, store your API token in environment variables:

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

// Create client using environment variable
const client = createEloqClient(process.env.ELOQ_API_TOKEN!);

// Or with full configuration from environment
const client = createEloqClient({
  apiKey: process.env.ELOQ_API_TOKEN!,
  baseURL: process.env.ELOQ_API_URL || 'https://api.eloqdata.com',
  timeout: parseInt(process.env.ELOQ_TIMEOUT || '30000'),
});

// Now you can use the client
const orgInfo = await client.orgInfo();
console.log(`Organization: ${orgInfo.org_info.org_name}`);
```

### **Error Handling Best Practices**

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

async function robustApiCall() {
  const client = createEloqClient('your_api_token');

  try {
    // Your API calls here
    const orgInfo = await client.orgInfo();
    return orgInfo;
  } catch (error: any) {
    if (error.response) {
      // API returned an error response
      console.error(
        'API Error:',
        error.response.status,
        error.response.data,
      );
      console.error('This could be due to:');
      console.error('- Invalid API token');
      console.error('- Rate limiting');
      console.error('- Server issues');
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
      console.error('Check your internet connection');
    } else {
      // Other error
      console.error('Error:', error.message);
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

## Organization

### `orgInfo() -> Promise<EloqUser>`

Get current user's organization information.

**Returns:** `Promise<EloqUser>` object with the following structure:

- `auth_provider` (string): Authentication provider (e.g., "github")
- `create_at` (string): User account creation timestamp (e.g., "2025-08-20 08:20:21")
- `email` (string): User email address (e.g., "1111111@mail.com")
- `org_info` (EloqOrgInfo): Organization information object
- `user_name` (string): Username (e.g., "1976263299")

**EloqOrgInfo Object Fields:**

- `org_create_at` (string): Organization creation timestamp (e.g., "2025-05-14 13:51:02")
- `org_id` (number): Organization ID (e.g., 1)
- `org_name` (string): Organization name (e.g., "default-free-org")
- `projects` (EloqProject[]): List of projects in the organization
- `roles` (string[]): User roles in the organization (e.g., ["project-owner", "cluster-owner"])

**EloqProject Object Fields:**

- `create_at` (string): Project creation timestamp (e.g., "2025-08-20 08:20:21")
- `project_id` (number): Project ID (e.g., 147)
- `project_name` (string): Project name (e.g., "project1")

**Example:**

```typescript
const orgInfo = await client.orgInfo();
console.log(`Organization: ${orgInfo.org_info.org_name}`);
console.log(`User: ${orgInfo.user_name}`);
```

### `projects() -> Promise<ProjectSummary>`

Get all projects in the current user's organization.

**Returns:** `Promise<ProjectSummary>` object:

- `orgId` (number): Organization identifier
- `projects` (EloqProject[]): Array of project objects

**Example:**

```typescript
const {orgId, projects} = await client.projects();
console.log(`Organization ID: ${orgId}`);
projects.forEach(project => {
  console.log(
    `Project: ${project.project_name} (ID: ${project.project_id})`,
  );
});
```

## Cluster Management

### `clusters(page: number = 1, perPage: number = 20) -> Promise<EloqCluster[]>`

Get all clusters in a specific project.

**Parameters:**

- `page` (number, optional): Page number for pagination (default: 1)
- `perPage` (number, optional): Number of clusters per page (default: 20)

**Returns:** `Promise<EloqCluster[]>` - Array of cluster objects

**Example:**

```typescript
const clusters = await client.clusters(1, 20);
clusters.forEach(cluster => {
  console.log(
    `Cluster: ${cluster.cluster_name} (${cluster.status})`,
  );
});
```

### `cluster(clusterName: string) -> Promise<EloqCluster>`

Get cluster connection credentials including username, password, and address.

**Parameters:**

- `clusterName` (string): Cluster name

**Returns:** `Promise<EloqCluster>` object with cluster details

**Example:**

```typescript
const cluster = await client.cluster('my-cluster');
console.log(`Cluster: ${cluster.cluster_name}`);
console.log(`Status: ${cluster.status}`);
```

### `createCluster(request: CreateClusterRequest) -> Promise<EloqCluster>`

Create a new cluster.

**Parameters:**

- `request` (CreateClusterRequest): Cluster creation request object

**Returns:** `Promise<EloqCluster>` object

**Example:**

```typescript
const cluster = await client.createCluster({
  clusterName: 'new-cluster',
  region: 'us-east-1',
  RequiredZone: 'us-east-1a',
  skuId: 1,
});
```

### `clusterCredentials(clusterName: string) -> Promise<ClusterCredentials>`

Get cluster connection credentials.

**Parameters:**

- `clusterName` (string): Cluster name

**Returns:** `Promise<ClusterCredentials>` object with connection details

**Example:**

```typescript
const credentials = await client.clusterCredentials('my-cluster');
console.log(`Host: ${credentials.host}`);
console.log(`Port: ${credentials.port}`);
```

## Type Definitions

The SDK provides comprehensive TypeScript type definitions for all data structures:

### Core Types

```typescript
interface EloqUser {
  auth_provider: string;
  create_at: string;
  email: string;
  org_info: EloqOrgInfo;
  user_name: string;
}

interface EloqOrgInfo {
  org_create_at: string;
  org_id: number;
  org_name: string;
  projects: EloqProject[];
  roles: string[];
}

interface EloqProject {
  create_at: string;
  project_id: number;
  project_name: string;
}

interface EloqCluster {
  cloud_provider: string;
  cluster_name: string;
  create_at: string;
  module_type: string;
  region: string;
  status: string;
  version: string;
  zone: string;
}

interface CreateClusterRequest {
  clusterName: string;
  region: string;
  RequiredZone: string;
  skuId: number;
}

interface ClusterCredentials {
  username: string;
  password: string;
  host: string;
  port: number;
  status: string;
}
```

## Error Handling

The SDK provides comprehensive error handling with TypeScript types:

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

async function handleErrors() {
  const client = createEloqClient('your_api_token');

  try {
    const orgInfo = await client.orgInfo();
    console.log('Success:', orgInfo.org_info.org_name);
  } catch (error) {
    if (error.response) {
      // API returned an error response
      console.error(
        'API Error:',
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
  }
}
```

## Complete Examples

### Cluster Management Workflow

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

async function manageClusters() {
  const client = createEloqClient('your_api_token');

  try {
    // Get organization information
    const orgInfo = await client.orgInfo();
    const orgId = orgInfo.org_info.org_id;

    // Get all projects
    const {projects} = await client.projects();
    console.log(`Found ${projects.length} projects`);

    // List clusters for each project
    for (const project of projects) {
      console.log(
        `\n📁 Project: ${project.project_name} (ID: ${project.project_id})`,
      );

      try {
        const clusters = await client.clusters(
          orgId,
          project.project_id,
        );
        console.log(`  Clusters: ${clusters.length}`);

        clusters.forEach(cluster => {
          console.log(
            `    - ${cluster.cluster_name} (${cluster.status}) in ${cluster.region}`,
          );
        });
      } catch (error) {
        console.log(`  Error getting clusters: ${error.message}`);
      }
    }

    // Create a new cluster (example)
    if (projects.length > 0) {
      const firstProject = projects[0];
      console.log(
        `\n🚀 Creating cluster in project: ${firstProject.project_name}`,
      );

      try {
        const newCluster = await client.createCluster(
          orgId,
          firstProject.project_id,
          {
            clusterName: 'my-new-cluster',
            region: 'us-east-1',
            RequiredZone: 'us-east-1a',
            skuId: 1,
          },
        );

        console.log(
          `✅ Cluster created: ${newCluster.cluster_name}`,
        );
        console.log(`   Status: ${newCluster.status}`);
        console.log(`   Region: ${newCluster.region}`);
      } catch (error) {
        console.error(
          `❌ Failed to create cluster: ${error.message}`,
        );
      }
    }
  } catch (error) {
    console.error('Error managing clusters:', error);
  }
}

// Run the example
manageClusters();
```
