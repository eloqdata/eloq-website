# TypeScript SDK for Eloq

> On this page, you can learn about:
>
> 1. **TypeScript SDK Overview** - Understand the SDK's functionality and type safety features
> 2. **Installation** - Quick setup of the eloq-sdk-typescript package
> 3. **Basic Usage** - Learn how to create clients and basic configuration
> 4. **API Methods Directory** - View all available organization and cluster management methods
> 5. **Detailed Documentation Links** - Jump to complete API reference documentation

## About TypeScript SDK for Eloq

The **Eloq TypeScript SDK** is a TypeScript client library for managing Eloq cloud cluster services. This SDK provides type-safe APIs to programmatically control your cluster infrastructure.

You can use the Eloq TypeScript SDK to manage your Eloq Organization, Cluster. The SDK abstracts the underlying API requests, authentication, and error handling, allowing you to focus on building applications that interact with Eloq resources.

Our SDK allows you to manage:

- #### **Organization** Access organization details, user roles, and permissions

- #### **Cluster** Create clusters，Get real-time cluster status and performance metrics

Eloq API:

- [**Manage organization with the Eloq API**](./Organization)
- [**Manage cluster with the Eloq API**](./cluster)

## Installation

You can install the SDK using npm:

```bash
npm install eloq-sdk-typescript
```

### **Usage**

```typescript
import {createEloqClient} from 'eloq-sdk-typescript';

// Create client with token
const client = createEloqClient('your_api_token');

// Or create with full configuration
const client = createEloqClient({
  apiKey: 'your_api_token',
  baseURL: 'https://api.eloqdata.com',
  timeout: 30000,
});
```

## Documentation

Documentation for TypeScript SDK, including [quick start](./typescriptdoc#quick-start)

For detailed function documentation with input/output specifications, see [**TypeScript SDK Documentation**](./typescriptdoc).

## Core API Methods

**Organization Management**

- [`orgInfo()`](./typescriptdoc#orginfo---promiseeloquser)

**Cluster Management:**

- [`clusters()`](./typescriptdoc#clusterspage-number--1-perpage-number--20---promiseeloqcluster)
- [`cluster()`](./typescriptdoc#clusterclustername-string---promiseeloqcluster)
- [`createCluster()`](./typescriptdoc#createclusterrequest-createclusterrequest---promiseeloqcluster)
- [`clusterCredentials()`](./typescriptdoc#clustercredentialsclustername-string---promiseclustercredentials)

---

View the [Eloq API](./api) for more information on the available endpoints and their parameters.
