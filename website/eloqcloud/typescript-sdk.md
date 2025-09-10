# TypeScript SDK

Official TypeScript SDK for Eloq API - A powerful and type-safe way to interact with Eloq services.

## Installation

```bash
npm install eloq-sdk-typescript
```

```bash
yarn add eloq-sdk-typescript
```

## Function Directory

### Quick Start

- [Client Creation](#client-creation)
  - [`createEloqClient()`](#createeloqclientconfig-eloqclientconfig--string-eloqapiclient)

### Core Methods

- [Connection & Organization](#core-methods)
  - [`testConnection()`](#testconnection-promiseconnectiontestresult)
  - [`orgInfo()`](#orginfo-promiseeloquser)
  - [`projects()`](#projects-promiseprojectsummary)
  - [`project()`](#projectprojectid-number-promiseeloqproject)

### Cluster Management

- [Cluster Operations](#cluster-management)
  - [`clusters()`](#clustersparams-listclustersparams-promiseeloqcluster)
  - [`cluster()`](#clusterorgid-number-projectid-number-clustername-string-promiseeloqcluster)
  - [`cluster_admin()`](#cluster_adminorgid-number-projectid-number-clustername-string-promiseclusteradmininfo)
  - [`createCluster()`](#createclusterorgid-number-projectid-number-request-createclusterrequest-promiseeloqcluster)

---

## func Docs

### Basic Usage

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

// Create client with API key only
const client = createEloqClient('your-api-key-here');

// Or create client with full configuration
const client = createEloqClient({
  apiKey: 'your-api-key-here',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
});

// Test connection
const connectionResult = await client.testConnection();
if (connectionResult.success) {
  console.log('✅ Successfully connected to Eloq API');
  console.log(`Latency: ${connectionResult.latency}ms`);
} else {
  console.error(
    '❌ Connection failed:',
    connectionResult.message,
  );
}
```

### Get Organization Information

```typescript
try {
  const userInfo = await client.orgInfo();
  console.log('Organization:', userInfo.org_info.org_name);
  console.log('User:', userInfo.user_name);
  console.log('Email:', userInfo.email);
  console.log('Projects:', userInfo.org_info.projects);
} catch (error) {
  console.error('Failed to get organization info:', error);
}
```

### Get Projects and Clusters

```typescript
// Get all projects
const {orgId, projects} = await client.projects();
console.log(`Organization ID: ${orgId}`);
console.log(`Total ${projects.length} projects:`);

// Get clusters for all projects
const allClusters = await client.allClusters();
allClusters.forEach(({projectName, projectId, clusters}) => {
  console.log(`\n📁 Project: ${projectName} (ID: ${projectId})`);
  clusters.forEach(cluster => {
    console.log(
      `  - ${cluster.cluster_name} (${cluster.status}) in ${cluster.region}`,
    );
  });
});
```

## API Reference

### Client Creation

#### `createEloqClient(config: EloqClientConfig | string): EloqApiClient`

Create a new Eloq API client instance.

- **Inputs**:
  - **config**:
    - `string`: API key for authentication
    - `EloqClientConfig` object:
      - `apiKey` (string, required): Your Eloq API key for authentication
      - `baseURL` (string, optional): Base URL for API requests (default: 'https://api.eloqdata.com')
      - `timeout` (number, optional): Request timeout in milliseconds (default: 30000)
      - `maxRetries` (number, optional): Maximum retry attempts for failed requests (default: 3)
      - `retryDelay` (number, optional): Base delay between retries in milliseconds (default: 1000)
- **Returns**: `EloqApiClient` - Configured client instance for making API calls

```typescript
// Simple usage with API key
const client = createEloqClient('your-api-key');

// Full configuration
const client = createEloqClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.eloqdata.com',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
});
```

### Core Methods

#### `testConnection(): Promise<ConnectionTestResult>`

Test connection to Eloq API with latency measurement.

- **Inputs**: None
- **Returns**: `Promise<ConnectionTestResult>` object:
  - `success` (boolean): Whether the connection test was successful
  - `message` (string): Description of the connection result or error message
  - `latency` (number, optional): Response time in milliseconds (only present on success)

```typescript
const result = await client.testConnection();
// {
//   success: true,
//   message: 'Connection successful',
//   latency: 150
// }
```

#### `orgInfo(): Promise<EloqUser>`

Get complete organization and user information.

- **Inputs**: None
- **Returns**: `Promise<EloqUser>` object:
  - `auth_provider` (string): Authentication provider used (e.g., 'google', 'github')
  - `create_at` (string): User account creation timestamp
  - `email` (string): User's email address
  - `user_name` (string): User's display name
  - `org_info` (EloqOrgInfo object):
    - `org_create_at` (string): Organization creation timestamp
    - `org_id` (number): Unique organization identifier
    - `org_name` (string): Organization name
    - `projects` (EloqProject[]): Array of projects in the organization
    - `roles` (string[]): User's roles in the organization

```typescript
const userInfo = await client.orgInfo();
console.log('Organization:', userInfo.org_info.org_name);
console.log('User:', userInfo.user_name);
```

#### `projects(): Promise<ProjectSummary>`

Get summary information of all projects in the organization.

- **Inputs**: None
- **Returns**: `Promise<ProjectSummary>` object:
  - `orgId` (number): Organization identifier
  - `projects` (EloqProject[]): Array of project objects:
    - `create_at` (string): Project creation timestamp
    - `project_id` (number): Unique project identifier
    - `project_name` (string): Project display name

```typescript
const {orgId, projects} = await client.projects();
projects.forEach(project => {
  console.log(
    `- ${project.project_name} (ID: ${project.project_id})`,
  );
});
```

#### `project(projectId: number): Promise<EloqProject>`

Get a specific project by ID.

- **Inputs**:
  - **projectId** (number, required): Unique identifier of the project to retrieve
- **Returns**: `Promise<EloqProject>` object:
  - `create_at` (string): Project creation timestamp
  - `project_id` (number): Unique project identifier
  - `project_name` (string): Project display name

```typescript
const project = await client.project(123);
console.log('Project:', project.project_name);
```

### Cluster Management

#### `clusters(params: ListClustersParams): Promise<EloqCluster[]>`

Get cluster list for specified organization and project.

- **Inputs**:
  - **params** (ListClustersParams object):
    - `orgId` (number, required): Organization identifier
    - `projectId` (number, required): Project identifier
    - `perPage` (number, optional): Number of clusters per page (default: 10)
    - `page` (number, optional): Page number for pagination (default: 1)
- **Returns**: `Promise<EloqCluster[]>` - Array of cluster objects:
  - `cloud_provider` (string): Cloud provider name (e.g., 'aws', 'gcp')
  - `cluster_name` (string): Unique cluster identifier
  - `create_at` (string): Cluster creation timestamp
  - `module_type` (string): Type of cluster module
  - `region` (string): Geographic region where cluster is deployed
  - `status` (string): Current cluster status (e.g., 'active', 'creating', 'error')
  - `version` (string): Cluster version
  - `zone` (string): Availability zone within the region

```typescript
const clusters = await client.listClusters({
  orgId: 1,
  projectId: 147,
  perPage: 10,
  page: 1,
});
```

#### `cluster(orgId: number, projectId: number, clusterName: string): Promise<EloqCluster>`

Get a specific cluster.

- **Inputs**:
  - **orgId** (number, required): Organization identifier
  - **projectId** (number, required): Project identifier
  - **clusterName** (string, required): Unique name of the cluster to retrieve
- **Returns**: `Promise<EloqCluster>` object:
  - `cloud_provider` (string): Cloud provider name (e.g., 'aws', 'gcp')
  - `cluster_name` (string): Unique cluster identifier
  - `create_at` (string): Cluster creation timestamp
  - `module_type` (string): Type of cluster module
  - `region` (string): Geographic region where cluster is deployed
  - `status` (string): Current cluster status (e.g., 'active', 'creating', 'error')
  - `version` (string): Cluster version
  - `zone` (string): Availability zone within the region

```typescript
const cluster = await client.cluster(1, 147, 'my-cluster');
console.log('Cluster status:', cluster.status);
```

#### `createCluster(orgId: number, projectId: number, request: CreateClusterRequest): Promise<EloqCluster>`

Create a new cluster.

- **Inputs**:
  - **orgId** (number, required): Organization identifier
  - **projectId** (number, required): Project identifier
  - **request** (CreateClusterRequest object):
    - `clusterName` (string, required): Unique name for the new cluster
    - `region` (string, required): Geographic region for deployment (e.g., 'us-east-1')
    - `RequiredZone` (string, required): Availability zone within the region (e.g., 'us-east-1a')
    - `skuId` (number, required): SKU identifier for cluster specifications
- **Returns**: `Promise<EloqCluster>` object:
  - `cloud_provider` (string): Cloud provider name (e.g., 'aws', 'gcp')
  - `cluster_name` (string): Unique cluster identifier
  - `create_at` (string): Cluster creation timestamp
  - `module_type` (string): Type of cluster module
  - `region` (string): Geographic region where cluster is deployed
  - `status` (string): Current cluster status (e.g., 'active', 'creating', 'error')
  - `version` (string): Cluster version
  - `zone` (string): Availability zone within the region

```typescript
const cluster = await client.createCluster(1, 147, {
  clusterName: 'new-cluster',
  region: 'us-east-1',
  RequiredZone: 'us-east-1a',
  skuId: 1,
});
```
