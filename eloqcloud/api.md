# API Overview

> On this page, you can learn about:
>
> 1. **API Overview** - Understand the Eloq API's capabilities and architecture
> 2. **Authentication** - Learn how to authenticate and secure your API requests
> 3. **Base URL & Endpoints** - Access the API base URL and available endpoints
> 4. **Request/Response Format** - Understand API request and response structures
> 5. **Example Usage** - See practical examples of API calls with curl commands
> 6. **SDK Integration** - Links to Python and TypeScript SDKs for easier development

## About Eloq API

The **Eloq API** is a RESTful web service that allows you to programmatically interact with Eloq's cloud infrastructure. Our API follows industry-standard practices and provides secure, scalable access to all Eloq platform features.

- **Manage Organizations**- Create and configure organizations, manage user roles and permissions
- **Deploy Clusters** - Launch EloqKV, EloqSQL, and EloqDoc clusters with custom configurations

## Eloq API base URL

The base URL is:

`https://api-prod.eloqdata.com/api/v1/`

### **Authentication**

All API requests require authentication using an API token. You can obtain your API token from the [EloqCloud Dashboard](https://cloud.eloqdata.com/settings/api-keys).

```bash
# Include your API token in the Authorization header
curl -X GET "https://api-prod.eloqdata.com/api/v1/org-info" \
  -H "Authorization: {{YOUR_API_KEY}}"
```

### **Response Format**

The API returns responses in JSON format with standard HTTP status codes:

```json
{
  "code": 0,
  "data": "string",
  "message": "string"
}
```

## API Endpoints Overview

### **Basic Information**

- [`GET /org-info`](./basic#org-info-api) - Get organization information
- [`GET /skus-by-args`](./basic#skus-by-args-api) - Filter available SKUs by type, module, and cloud provider

### **Cluster Management**

- [`POST /orgs/{orgId}/projects/{projectId}/clusters`](./cluster#cluster-api) - Create a new cluster
- [`GET /orgs/{orgId}/projects/{projectId}/clusters`](./cluster#cluster-api) - List clusters
- [`GET /orgs/{orgId}/projects/{projectId}/clusters/{clusterName}`](./cluster#cluster-api) - Get cluster details
- [`DELETE /orgs/{orgId}/projects/{projectId}/clusters/{clusterName}/delete`](./cluster#cluster-api) - Delete a cluster

## See details

- [Basic Information API](./basic)
- [Cluster Management API](./cluster)


## Support

Need help? Check out our:
Join our **Discord** Server to ask questions or see what others are doing with Eloq.
