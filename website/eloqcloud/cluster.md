# Cluster

> Welcome to the Cluster documentation! Here you'll find comprehensive information about **cluster concepts** and **API usage methods** for managing your Eloq clusters. Learn how clusters work in Eloq's cloud platform.

## About Cluster

A **Cluster** is a flexible database cluster in our cloud service platform that enables **elastic scaling** and **seamless user experience**. Clusters serve as the core infrastructure for running EloqKV, EloqSQL, and EloqDoc databases with high availability and performance.

### **Key Features:**

- **Elastic Scaling** - Scale resources up or down based on demand without downtime
- **Seamless Experience** - Users experience minimal impact during scaling operations
- **Flexible Configuration** - Customize cluster settings for optimal performance

## Free Tier Limitations

Currently, free users are limited to **4 clusters** with **fixed resource quotas**. This includes:

- ✅ **Fixed Resource Allocation** - Predefined CPU, memory, and storage limits
- ✅ **Standard Database Types** - Deploy EloqKV clusters
- ✅ **Basic Monitoring** - Access to cluster status and basic metrics
- ❌ **Cluster Limit** - Maximum of 4 clusters per organization
- ❌ **Advanced Features** - Some enterprise features are not available

### **Resource Quotas:**

| Resource     | Free Tier Limit        |
| ------------ | ---------------------- |
| **Clusters** | 4 clusters maximum     |
| **CPU**      | 0.25 cores per cluster |
| **Memory**   | 2GB RAM per cluster    |
| **Storage**  | 20GB                   |

## Cluster API

The Cluster API provides programmatic access to manage cluster resources, configurations, and operations. You can use these endpoints to automate cluster management tasks and integrate Eloq services into your workflows.

### **Core API Endpoints:**

- **`GET /orgs/{org_id}/projects/{project_id}/clusters`** - List all clusters in a project
- **`GET /orgs/{org_id}/projects/{project_id}/clusters/{cluster_name}`** - Get cluster details and status
- **`POST /orgs/{org_id}/projects/{project_id}/clusters/{cluster_name}`** - Create a new cluster with custom configuration

### **Example Usage:**

```bash
# List all clusters in a project
curl -H "Authorization: Bearer {{YOUR_API_TOKEN}}" \
     https://api.eloqdata.com/api/v1/clusters?org_id=1&project_id=147

# Get cluster details
curl -H "Authorization: Bearer {{YOUR_API_TOKEN}}" \
     https://api.eloqdata.com/api/v1/cluster/1/147/my-cluster

# Create a new cluster
curl -X POST -H "Authorization: Bearer {{YOUR_API_TOKEN}}" \
     -H "Content-Type: application/json" \
     -d '{"clusterName":"new-cluster","region":"us-east-1","requiredZone":"us-east-1a","skuId":1}' \
     https://api.eloqdata.com/api/v1/cluster/create
```

## Cluster Types

### **EloqKV Clusters**

Redis-compatible key-value database clusters optimized for high-performance caching and session storage.

- **Use Cases**: Caching, session storage, real-time analytics
- **Features**: Sub-millisecond latency, high throughput, Redis API compatibility
- **Scaling**: Horizontal scaling with automatic sharding

### **EloqSQL Clusters**

MySQL-compatible relational database clusters with advanced features and performance optimizations.

- **Use Cases**: Transactional applications, data warehousing, business intelligence
- **Features**: ACID compliance, complex queries, MySQL API compatibility
- **Scaling**: Vertical and horizontal scaling options

### **EloqDoc Clusters**

MongoDB-compatible document database clusters for flexible schema and rapid development.

- **Use Cases**: Content management, user profiles, IoT data
- **Features**: Flexible schema, JSON documents, MongoDB API compatibility
- **Scaling**: Horizontal scaling with automatic sharding

## Best Practices

### **Cluster Management**

- **Monitor Resource Usage** - Regularly check CPU, memory, and storage utilization
- **Plan for Growth** - Consider future scaling needs when designing cluster architecture
- **Use Appropriate SKUs** - Choose the right SKU based on your workload requirements
- **Implement Backup Strategies** - Regular backups and disaster recovery planning

### **Performance Optimization**

- **Optimize Queries** - Use efficient query patterns and indexing strategies
- **Monitor Performance** - Track key metrics like latency, throughput, and error rates
- **Scale Proactively** - Monitor trends and scale before hitting resource limits
- **Use Connection Pooling** - Implement proper connection management for better performance
