# Basics

> Welcome to the **Basics** documentation.  
> This page introduces a set of **core public APIs** in Eloq Cloud, so that you can quickly understand how to query basic information and available resources from our platform.  
> The base API endpoint is: `https://api-prod.eloqdata.com`

## Basic API Overview

The following sections describe each basic API individually, including its purpose, input, output, and a `curl` example.

---

<a id="org-info-api"></a>

### API 1 – Get basic info (`GET /org-info`)

Fetch the current user’s organization information and basic profile data.

#### Endpoint

- **Method**: `GET`  
- **Path**: `/api/v1/org-info`  
- **Base URL**: `https://api-prod.eloqdata.com`

#### Input

- **Headers**:
  - `Authorization: {{YOUR_API_KEY}}`
- **Query parameters**: _None_

#### Example (`curl`)

```bash
curl -X GET "https://api-prod.eloqdata.com/api/v1/org-info" \
  -H "Authorization: {{YOUR_API_KEY}}"
```

#### Output

Example JSON response:

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

---

<a id="skus-by-args-api"></a>

### API 2 – Filter available SKUs (`GET /skus-by-args`)

Filter the SKU list by SKU type, module type, and cloud provider.  
Only SKUs that are available in the user’s current subscription plan are returned.

#### Endpoint

- **Method**: `GET`  
- **Path**: `/api/v1/skus-by-args`  
- **Base URL**: `https://api-prod.eloqdata.com`

#### Input

- **Headers**:
  - `Authorization: {{YOUR_API_KEY}}`
- **Query parameters**:

| Name           | Type   | Required | Description                           | Allowed values             |
|----------------|--------|----------|---------------------------------------|----------------------------|
| `type`         | string | Yes      | SKU type                              | `serverless`, `dedicated` |
| `eloqModule`   | string | Yes      | EloqDB module type                    | `eloqkv`, `eloqdoc`       |
| `cloudProvider`| string | Yes      | Cloud provider                        | `aws`            |

#### Example (`curl`)

```bash
curl -X GET "https://api-prod.eloqdata.com/api/v1/skus-by-args?type=serverless&eloqModule=eloqkv&cloudProvider=aws" \
  -H "Authorization: {{YOUR_API_KEY}}"
```

#### Output

**Success (200)**:

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "sku_id": 0,
      "sku_name": "string",
      "sku_type": "string",              // "serverless", "dedicated", "unspecified"
      "module_type": "string",           // "EloqSQL", "EloqKV", "EloqDoc"
      "version": "string",
      "tx_cpu_limit": 0.0,
      "tx_memory_mi_limit": 0.0,
      "tx_ev_gi_limit": 0.0,
      "tx_pv_gi_limit": 0.0,
      "log_cpu_limit": 0.0,
      "log_memory_mi_limit": 0.0,
      "log_pv_gi_limit": 0.0,
      "cloud_provider": "string",        // "AWS", "GCP"
      "tx_replica": 0,
      "log_replica": 0
    }
  ]
}
```

**Error responses**:

- `400`: Invalid request parameters  
- `500`: Internal server error

**Notes**:

- This API only returns SKUs that are included in the user’s current subscription plan  
- Returned SKUs must satisfy: `available = 1` and the user has an active subscription plan
