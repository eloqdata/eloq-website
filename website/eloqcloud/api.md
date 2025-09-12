# Eloq API

> Welcome to the Eloq API documentation! The Eloq API provides comprehensive programmatic access to Eloq's cloud platform, enabling you to manage organizations, projects, clusters, and resources through RESTful endpoints.

## About Eloq API

The **Eloq API** is a RESTful web service that allows you to programmatically interact with Eloq's cloud infrastructure. Our API follows industry-standard practices and provides secure, scalable access to all Eloq platform features.

- **Manage Organizations**- Create and configure organizations, manage user roles and permissions
- **Deploy Clusters** - Launch EloqKV, EloqSQL, and EloqDoc clusters with custom configurations

## Eloq API base URL

The base URL is:

https://api.eloqdata.com/api/v1/

### **Authentication**

All API requests require authentication using an API token. You can obtain your API token from the [EloqCloud Dashboard](https://cloud.eloqdata.com).

```bash
# Include your API token in the Authorization header
curl -H "Authorization: Bearer {{YOUR_API_TOKEN}}" \
     https://api.eloqdata.com/api/v1/org-info
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

### **Organization Management**

- `GET /org-info` - Get organization information

### **Cluster Management**

- `GET /orgs/{org_id}/projects/{project_id}/clusters` - List clusters
- `GET /orgs/{org_id}/projects/{project_id}/clusters/{cluster_name}` - Get cluster details
- `POST /orgs/{org_id}/projects/{project_id}/clusters/{cluster_name}` - Create a new cluster

## See details

- [Organization Management API](./Organization)
- [Cluster Management API](./cluster)

## SDK Support

For easier integration, we provide official SDKs:

- **[Python SDK](./python-sdk)** - Full-featured Python client library
- **[TypeScript SDK](./typescript-sdk)** - Type-safe JavaScript/TypeScript client

## Support

Need help? Check out our:
Join our **Discord** Server to ask questions or see what others are doing with Eloq.
