# Python SDK for Eloq

> Welcome to the **Python SDK** for Eloq! This SDK provides integration with Eloq's cloud cluster platform for managing your cluster infrastructure programmatically.

## About Python SDK for Eloq

The **Eloq Python SDK** is a Python client library for managing Eloq cloud cluster services. This SDK provides APIs to programmatically control your cluster infrastructure.

You can use the Eloq SDK to manage your Eloq Organization, Cluster. The SDK abstracts the underlying API requests, authentication, and error handling, allowing you to focus on building applications that interact with Eloq resources.

Our SDK allows you to manage:

- #### **Organization** Access organization details, user roles, and permissions

- #### **Cluster** Create clusters，Get real-time cluster status and performance metrics

Eloq API:

- [**Manage organization with the Eloq API**](./Organization)
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

- [`cluster()`](./pythondoc#clusterorg_id-int-project_id-int-cluster_name-str---descclusterdto)
- [`clusters()`](./pythondoc#clustersorg_id-int-project_id-int--page-int--1-per_page-int--20---listclusterlistitem)
- [`cluster_create()`](./pythondoc#cluster_createorg_id-int-project_id-int-json-dict---shelfresponse)
- [`cluster_credentials()`](./pythondoc#cluster_credentialsorg_id-int-project_id-int-cluster_name-str---clustercredentials)

---

View the [Eloq API](./api) for more information on the available endpoints and their parameters.
