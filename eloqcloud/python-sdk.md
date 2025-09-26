---
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Python SDK for Eloq

> On this page, you can learn about:
>
> 1. **Python SDK Overview** - Understand the SDK's functionality and purpose
> 2. **Installation** - Quick setup of the eloq-sdk package
> 3. **Basic Usage** - Learn how to create clients and basic configuration
> 4. **API Methods Directory** - View all available organization and cluster management methods
> 5. **Detailed Documentation Links** - Jump to complete API reference documentation

## About Python SDK for Eloq

The **Eloq Python SDK** is a Python client library for managing Eloq cloud cluster services. This SDK provides APIs to programmatically control your cluster infrastructure.

You can use the Eloq SDK to manage your Eloq Organization, Cluster. The SDK abstracts the underlying API requests, authentication, and error handling, allowing you to focus on building applications that interact with Eloq resources.

Our SDK allows you to manage:

- #### **Organization** Access organization details, user roles, and permissions

- #### **Cluster** Create clusters，Get real-time cluster status and performance metrics

Eloq API:

- [**Manage organization with the Eloq API**](./organization)
- [**Manage cluster with the Eloq API**](./cluster)

## Installation

You just need to use pip:

```bash
pip install eloq-sdk
```

### **Usage**

```python
from eloq_sdk import EloqAPI

# Create client with token
client = EloqAPI.from_token("your_api_token")

# Or create from environment variable
client = EloqAPI.from_environ()
```

## Documentation

Documentation for EloqAPI, including [quick start](./pythondoc#quick-start)

For detailed function documentation with input/output specifications, see [**Python SDK Documentation**](./pythondoc).

## Core API Methods

**Organization Management**

- [`org()`](./pythondoc#org---simpleorginfo)
- [`org_info()`](./pythondoc#org_info---userorginfodto)

**Cluster Management:**

- [`cluster()`](./pythondoc#clustercluster_name-str---descclusterdto)
- [`clusters()`](./pythondoc#clusterspage-int--1-per_page-int--20---listclusterlistitem)
- [`cluster_create()`](./pythondoc#cluster_createjson-dict---shelfresponse)
- [`cluster_credentials()`](./pythondoc#cluster_credentialscluster_name-str---clustercredentials)

---

View the [Eloq API](./api) for more information on the available endpoints and their parameters.
