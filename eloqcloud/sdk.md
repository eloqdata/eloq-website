---
toc_min_heading_level: 2
toc_max_heading_level: 2
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# SDK for Eloq

> On this page, you can learn about:
>
> 1. **SDK Overview** - Understand the SDK's functionality and purpose
> 2. **Installation** - Quick setup of the SDK package
> 3. **Basic Usage** - Learn how to create clients and basic configuration
> 4. **API Methods Directory** - View all available organization and cluster management methods
> 5. **Detailed Documentation Links** - Jump to complete API reference documentation

## About SDK for Eloq

The **Eloq SDK** provides client libraries for managing Eloq cloud cluster services. We support both **Python** and **TypeScript** implementations, allowing you to programmatically control your cluster infrastructure with type-safe APIs.

You can use the Eloq SDK to manage your Eloq Organization and Cluster. The SDK abstracts the underlying API requests, authentication, and error handling, allowing you to focus on building applications that interact with Eloq resources.

Our SDK allows you to manage:

- #### **Organization** Access organization details, user roles, and permissions

- #### **Cluster** Create clusters，Get real-time cluster status and performance metrics

Eloq API:

- [**Manage organization with the Eloq API**](./basic)
- [**Manage cluster with the Eloq API**](./cluster)

## Features

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

- **Type-safe API**: Uses Pydantic dataclasses for structured input/output
- **Enum-based parameters**: No need to guess parameter values - use enums for type safety
- **Automatic error handling**: Comprehensive exception handling with clear error messages
- **Simple result objects**: Operations return clear success/failure results
- **Auto-detection**: Automatically retrieves organization and project IDs from user context

</TabItem>

<TabItem value="typescript">

- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **IntelliSense**: Excellent IDE support with autocomplete and inline documentation
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Retry Logic**: Built-in retry mechanism with exponential backoff
- **Modern API**: Promise-based async/await API design
- **Zero Dependencies**: Minimal dependencies for better performance

</TabItem>

</Tabs>

## Installation

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

### Using pip

```bash
pip install eloq-sdk
```

### Requirements

- Python 3.7 or higher
- `requests>=2.25.0`
- `pydantic>=1.8.0`

</TabItem>

<TabItem value="typescript">

### Using npm

```bash
npm install eloq-sdk-typescript
```

### Using yarn

```bash
yarn add eloq-sdk-typescript
```

### Requirements

- Node.js >= 16.0.0
- npm or yarn

</TabItem>

</Tabs>

## Quick Start

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

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

### Environment Setup

Set the `ELOQ_API_KEY` environment variable:

```bash
export ELOQ_API_KEY="your-api-key-here"
```

</TabItem>

<TabItem value="typescript">

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

// Create client with API key
const client = createEloqClient('your_api_token');

// Get organization information
const orgInfo = await client.info();
console.log('Organization:', orgInfo.org_info.org_name);
console.log('Projects:', orgInfo.org_info.projects.length);
```

### Getting Your API Key

1. Log in to your [EloqCloud Dashboard](https://cloud.eloqdata.com)
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Copy the key for use in your application

### Using Environment Variables

For better security, store your API token in environment variables:

```typescript
import { createEloqClient } from 'eloq-sdk-typescript';

const client = createEloqClient(process.env.ELOQ_API_TOKEN || '');
```

</TabItem>

</Tabs>

## Authentication & Client Initialization

The SDK provides multiple ways to initialize the client:

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

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

</TabItem>

<TabItem value="typescript">

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

</TabItem>

</Tabs>

## Documentation

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

Documentation for EloqAPI, including [quick start](./pythondoc#quick-start)

For detailed function documentation with input/output specifications, see [**Python SDK Documentation**](./pythondoc).

</TabItem>

<TabItem value="typescript">

Documentation for TypeScript SDK, including [quick start](./typescriptdoc#quick-start)

For detailed function documentation with input/output specifications, see [**TypeScript SDK Documentation**](./typescriptdoc).

</TabItem>

</Tabs>

## Error Handling

The SDK provides comprehensive error handling with specific exception types:

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

### Exception Types

- `EloqAPIError`: Base exception for all API errors
- `EloqAuthenticationError`: Authentication failed (401)
- `EloqPermissionError`: Permission denied (403)
- `EloqNotFoundError`: Resource not found (404)
- `EloqRateLimitError`: Rate limit exceeded (429)
- `EloqValidationError`: Invalid request (400)
- `EloqServerError`: Server error (500+)

### Handling Errors

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

### Operation Results

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

</TabItem>

<TabItem value="typescript">

### Error Handling

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

async function handleErrors() {
  const client = createEloqClient('your_api_token');

  try {
    const orgInfo = await client.info();
    console.log('Success:', orgInfo.org_info.org_name);
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
  }
}
```

</TabItem>

</Tabs>

## Core API Methods

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

**Basic:**

- [`org()`](./pythondoc#org---simpleorginfo) - Get simplified organization information
- [`info()`](./pythondoc#info---userorginfodto) - Get detailed organization and project information
- [`get_skus()`](./pythondoc#get_skussku_type-eloq_module-cloud_provider---listskuinfo) - Get available SKUs filtered by type, module, and cloud provider

**Cluster Management:**

- [`clusters()`](./pythondoc#clusterspage-int--1-per_page-int--20---clusterlist) - List all clusters in the current project
- [`cluster()`](./pythondoc#clustercluster_name-str---descclusterdto) - Get detailed information about a specific cluster
- [`cluster_create()`](./pythondoc#cluster_createcluster_name-region-sku_id---operationresult) - Create a new cluster
- [`cluster_delete()`](./pythondoc#cluster_deletecluster_name---operationresult) - Delete a cluster
- [`cluster_credentials()`](./pythondoc#cluster_credentialscluster_name---clustercredentials) - Get cluster credentials for database connection

</TabItem>

<TabItem value="typescript">

**Basic:**

- [`info()`](./typescriptdoc#info---promiseeloquser) - Get organization information including user details, organization details, and projects
- [`get_skus()`](./typescriptdoc#get_skusparams---promiseeloqsku) - Get available SKUs filtered by type, module, and cloud provider

**Cluster Management:**

- [`clusters()`](./typescriptdoc#clusterspage-perpage-orgid-projectid---promiseclusterslistresponse) - List clusters for a specific organization and project with pagination support
- [`cluster()`](./typescriptdoc#clusterclustername---promiseeloqcluster) - Get detailed information about a specific cluster
- [`cluster_create()`](./typescriptdoc#cluster_createrequest---promiseeloqcluster) - Create a new cluster in your organization
- [`cluster_delete()`](./typescriptdoc#cluster_deleteclustername-orgid-projectid---promisevoid) - Delete a cluster
- [`cluster_credentials()`](./typescriptdoc#cluster_credentialsclustername---promiseclusteradmininfo) - Get cluster connection credentials including address, port, username, and password

</TabItem>

</Tabs>

## Complete Examples

### Full Workflow: Get SKUs → Create Cluster → Check Status → Delete Cluster

<Tabs groupId="sdk-language" defaultValue="python" values={[
  { label: 'Python', value: 'python', },
  { label: 'TypeScript', value: 'typescript', },
]}>

<TabItem value="python">

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

</TabItem>

<TabItem value="typescript">

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

</TabItem>

</Tabs>

---

View the [Eloq API](./api) for more information on the available endpoints and their parameters.

