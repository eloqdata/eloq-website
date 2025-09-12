# TypeScript SDK Documentation

> Complete API reference for the Eloq TypeScript SDK with detailed function documentation, input/output specifications, and usage examples.

## Organization & Project Management

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

### `clusters(orgId: number, projectId: number, page: number = 1, perPage: number = 20) -> Promise<EloqCluster[]>`

Get all clusters in a specific project.

**Parameters:**

- `orgId` (number): Organization ID
- `projectId` (number): Project ID
- `page` (number, optional): Page number for pagination (default: 1)
- `perPage` (number, optional): Number of clusters per page (default: 20)

**Returns:** `Promise<EloqCluster[]>` - Array of cluster objects

**Example:**

```typescript
const clusters = await client.clusters(1, 147, 1, 20);
clusters.forEach(cluster => {
  console.log(
    `Cluster: ${cluster.cluster_name} (${cluster.status})`,
  );
});
```

### `cluster(orgId: number, projectId: number, clusterName: string) -> Promise<EloqCluster>`

Get cluster connection credentials including username, password, and address.

**Parameters:**

- `orgId` (number): Organization ID
- `projectId` (number): Project ID
- `clusterName` (string): Cluster name

**Returns:** `Promise<EloqCluster>` object with cluster details

**Example:**

```typescript
const cluster = await client.cluster(1, 147, 'my-cluster');
console.log(`Cluster: ${cluster.cluster_name}`);
console.log(`Status: ${cluster.status}`);
```

### `createCluster(orgId: number, projectId: number, request: CreateClusterRequest) -> Promise<EloqCluster>`

Create a new cluster.

**Parameters:**

- `orgId` (number): Organization ID
- `projectId` (number): Project ID
- `request` (CreateClusterRequest): Cluster creation request object

**Returns:** `Promise<EloqCluster>` object

**Example:**

```typescript
const cluster = await client.createCluster(1, 147, {
  clusterName: 'new-cluster',
  region: 'us-east-1',
  RequiredZone: 'us-east-1a',
  skuId: 1,
});
```

### `clusterCredentials(orgId: number, projectId: number, clusterName: string) -> Promise<ClusterCredentials>`

Get cluster connection credentials.

**Parameters:**

- `orgId` (number): Organization ID
- `projectId` (number): Project ID
- `clusterName` (string): Cluster name

**Returns:** `Promise<ClusterCredentials>` object with connection details

**Example:**

```typescript
const credentials = await client.clusterCredentials(
  1,
  147,
  'my-cluster',
);
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
