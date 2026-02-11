---
title: Quick Start
description: Get started quickly with the EloqCloud distributed database platform.
---

# Quick Start

Welcome to **EloqCloud**, the most cost-effective cloud native database platform designed for scalability, resilience, and developer simplicity. This guide walks you through the essential steps to get up and running with **EloqKV**, our high-performance key-value store.

By the end of this guide, you'll be able to:

- Create your first database cluster.
- Explore the monitoring dashboard.
- Connect your application to the cluster with ease.

Whether you're evaluating the platform or preparing for production use, this quick start will help you hit the ground running.

---

# User Workflow

## 1. Create a Cluster

After logging in, you'll be directed to the **EloqKV** dashboard. Click the **Create Cluster** button in the upper-right corner to begin setup.

On the cluster creation page, configure the following options:

- **Cloud Provider**: Select your preferred cloud platform.
- **Region** and **Zone**: Define the deployment location.
- **Product Type**: Choose the type of service (e.g., EloqKV).
- **SKU**: Select the appropriate SKU (for beginner, the `free` variant is recommended).

You can proceed with the default values for a quick setup, or customize them to suit your requirements.

<div align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
import EnlargeableImage from '@site/src/pages/enlarge_pic';

<EnlargeableImage src={require('./media/eloqcloud_create_cluster.png').default} alt="Create Cluster UI" />

</div></div>

## 2. Cluster Dashboard

Once the cluster is created, it will appear on the homepage with basic status and configuration details.

<div align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
<EnlargeableImage src={require('./media/eloqcloud_cluster_list.png').default} alt="Cluster List View" />
</div></div>

Click on the cluster name to access the full dashboard.

In the example shown:

- **Tier**: `Serverless`
- **Status**: `IDLE`
- **Total Resource**: `CPU 0 Core, Memory 0Mi (indicates free-tier placeholder; actual resources are allocated on demand)`
- **Created At**: `Jun 15 2025 / 16:23:36`

Additional sections include:

- **Core Metrics**:

  - Displays real-time metrics once the cluster is in the `Available` state.
  - If the cluster is `IDLE`, metrics may show as "Metrics Unavailable".

- **Cluster Properties**:
  - **Cloud Provider**: `aws`
  - **Region**: `us-west-1`
  - **Zone**: `us-west-1a`
  - **Cluster Status**: `IDLE`
  - **Product Type**: `EloqKV`

To connect to the database, click the **CONNECT TEST** button in the top-right corner.

<div align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
<EnlargeableImage src={require('./media/eloqcloud_cluster_detail.png').default} alt="Cluster Detail Dashboard" />
</div></div>

## 3. Database Connection

The **CONNECT TEST** panel provides the necessary information and tools for integrating **EloqKV** into your environment.

<div align="center">
<div style={{ width: '720px', textAlign: 'center'}}>
<EnlargeableImage src={require('./media/eloqcloud_cluster_connect.png').default} alt="Connection Panel" />
</div></div>

Connection details include:

- **Username**
- **Password**
- **Command-line connection string**

You’ll also find sample code snippets in popular languages:

- Go
- Java
- Python
- Raw CLI

Select the method that best fits your application stack and follow the instructions to verify your connection.

You're now ready to start building your application with **EloqCloud**. For advanced uasge of **EloqKV**, please refer to [EloqKV Document](/eloqkv/introduction).
