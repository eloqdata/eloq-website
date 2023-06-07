# MonoSQL部署指南

## MonoSQL产品介绍

### 产品基本功能

### 产品操作页面介绍

## 产品部署前提要求

### 对部署资源的要求

### 对技能或专业知识要求

熟悉MySQL数据库

熟悉AWS控制台和AWS相关服务

1. Amazon Network Load Balancer
2. Amazon Auto Scaling Group
3. Amazon EC2
4. Amazon VPC
5. Amazon SQS
6. Amazon DynamoDB
7. Amazon Cloud Watch

### 系统部署所需的环境配置
客户需要具备AWS账号，如没有，建议联系AWS销售或通过AWS官网进行账号的注册和认证。需使用Ubuntu操作系统进行部署。

## 产品部署架构图

部署产品时通过Amazon Auto Scaling Group实现根据负载动态调整集群规模。产品部署架构图如下图所示

## 部署选项

1. 单Region部署

在特定AWS Region，启动Auto Scaling Group，实例会自动连接当前region的AWS DynamoDB。

2. 多Region部署

在多个AWS Region分别启动多个Auto Scaling Group，实例会自动连接到对应region的AWS DynamoDB。
设置DynamoDB的表为Global Table，实现数据多写和跨Region自动同步。

## 产品部署成本预估

### 产品部署项目所需计费服务列表 

产品提供下列服务（以下均必选）
AWS EC2


