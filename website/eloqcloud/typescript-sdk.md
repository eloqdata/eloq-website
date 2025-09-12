# TypeScript SDK for Eloq

> Welcome to the TypeScript SDK for Eloq! This SDK provides type-safe integration with Eloq's cloud cluster platform for managing your cluster infrastructure programmatically. Built with TypeScript, it offers excellent developer experience with full type safety and IntelliSense support.

## About TypeScript SDK for Eloq

The **Eloq TypeScript SDK** is a TypeScript client library for managing Eloq cloud cluster services. This SDK provides type-safe APIs to programmatically control your cluster infrastructure.

You can use the Eloq TypeScript SDK to manage your Eloq Organization and Clusters. The SDK abstracts the underlying API requests, authentication, and error handling, allowing you to focus on building applications that interact with Eloq resources.

Our SDK enables the following functionalities:

#### **Organization Management**

- Access organization details, user roles, and permissions

#### **Cluster Management**

- Create clusters
- Get real-time cluster status and performance metrics
- Get cluster configurations and connection credentials

Eloq API:

- [**Manage organization with the Eloq API**](./Organization.md)
- [**Manage cluster with the Eloq API**](./cluster.md)

## Installation

You can install the SDK using npm or yarn:

```bash
npm install eloq-sdk-typescript
```

```bash
yarn add eloq-sdk-typescript
```

## Quick Start

### **Installation**

You can install the SDK using npm or yarn:

```bash
npm install eloq-sdk-typescript
```

```bash
yarn add eloq-sdk-typescript
```

### **Basic Usage**

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

// Create client with API key
const client = createEloqClient('your_api_token');

// Or create with full configuration
const client = createEloqClient({
  apiKey: 'your_api_token',
  baseURL: 'https://api.eloqdata.com',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
});
```

### **Get Your API Token**

Before using the SDK, you need to obtain your API token from the [EloqCloud Dashboard](https://cloud.eloqdata.com):

1. Log in to your EloqCloud account
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Copy the token for use in your application

### **First API Call**

Let's start with getting your organization information:

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

async function getOrganizationInfo() {
  try {
    // Initialize the client
    const client = createEloqClient('your_api_token');

    // Get organization information
    const orgInfo = await client.orgInfo();

    console.log('Organization:', orgInfo.org_info.org_name);
    console.log('User:', orgInfo.user_name);
    console.log('Email:', orgInfo.email);
    console.log('Projects:', orgInfo.org_info.projects.length);

    return orgInfo;
  } catch (error) {
    console.error('Error getting organization info:', error);
    throw error;
  }
}

// Call the function
getOrganizationInfo();
```

### **Working with Clusters**

Here's a more comprehensive example showing how to work with projects and clusters:

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

async function manageClusters() {
  const client = createEloqClient('your_api_token');

  try {
    // Get all projects
    const {orgId, projects} = await client.projects();
    console.log(`Organization ID: ${orgId}`);
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

### **Environment Variables**

For better security, you can store your API token in environment variables:

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

// Create client using environment variable
const client = createEloqClient(process.env.ELOQ_API_TOKEN);

// Or with full configuration from environment
const client = createEloqClient({
  apiKey: process.env.ELOQ_API_TOKEN,
  baseURL: process.env.ELOQ_API_URL || 'https://api.eloqdata.com',
  timeout: parseInt(process.env.ELOQ_TIMEOUT || '30000'),
});
```

### **Error Handling**

The SDK provides comprehensive error handling:

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

## Core API Methods

**Organization Management**

- [`orgInfo()`](#orginfo---promiseeloquser)

**Cluster Management:**

- [`clusters()`](#clustersorgid-number-projectid-number--page-number--1-perpage-number--20---promiseeloqcluster)
- [`cluster()`](#clusterorgid-number-projectid-number-clustername-string---promiseeloqcluster)
- [`createCluster()`](#createclusterorgid-number-projectid-number-request-createclusterrequest---promiseeloqcluster)
- [`clusterCredentials()`](#clustercredentialsorgid-number-projectid-number-clustername-string---promiseclustercredentials)

---

For detailed function documentation with input/output specifications, see [**TypeScript SDK API Documentation**](./typescriptdoc).
