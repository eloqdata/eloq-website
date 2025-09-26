# Organization

> Welcome to the Organization documentation! Here you'll find comprehensive information about **organization concepts** and **API usage methods** for managing your Eloq organizations. Learn how organizations work in Eloq's cloud platform.

## About Organization

An **Organization** is a fundamental unit in our cloud service platform that enables **multi-user collaboration** and **multi-cluster management**. Organizations serve as the top-level container for managing users, projects, clusters, and resources in a structured and secure manner.

## Free Tier Limitations

Currently, free users are limited to one default free organization. This organization includes:

- ✅ **Basic organization management** - Manage one organization
- ✅ **Standard clusters** - Deploy EloqKV clusters
- ❌ **Multiple organizations** - Cannot create additional organizations
- ❌ **Advanced features** - Some enterprise features are not available

## Organization API

The Organization API provides programmatic access to manage organizational resources, user roles, and permissions. You can use these endpoints to automate organization management tasks and integrate Eloq services into your workflows.

### **Core API Endpoints:**

- **`GET /org-info`** - Get organization information and user details

### Org_info

#### **Input**

```bash
# Get organization information
curl -H "Authorization: Bearer {{YOUR_API_TOKEN}}" \
     https://api.eloqdata.com/api/v1/org-info

```

#### **Output**

Response Body

```json
{
  "auth_provider": "string",
  "create_at": "string",
  "email": "string",
  "org_info": {
    "org_create_at": "string",
    "org_id": 0,
    "org_name": "string",
    "projects": [
      {
        "create_at": "string",
        "project_id": 0,
        "project_name": "string"
      }
    ],
    "roles": ["string"]
  },
  "user_name": "string"
}
```
