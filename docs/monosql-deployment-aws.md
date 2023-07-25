---
title: Deploy MonoSQL Using Auto Scaling Group
---

# Deploy MonoSQL Using Auto Scaling Group
 
This document describes how to deploy MonoSQL on AWS. For more information about MonoSQL, please refer to the [MonoSQL Introduction](./monosql-introduction.md)

## Deployment prepare
1. The user needs to be able to access AWS services and select the `ap-northeast-1(Tokyo)` region for subsequent operations and deployments.
2. Create an `IAM role` named **monosql** as the instance configuration file for subsequent `MonoSQLServer` and `MonoSQL Monitor`, the role's permission must include `AmazonEC2ReadOnlyAccess`、`AmazonSQSFullAccess`、`AmazonDynamoDBFullAccess`、`CloudWatchLogsFullAccess` and `CloudWatchAgentServerPolicy`. The specific creation process can refer to the following demonstration or the official AWS documentation on[ Creating an IAM Role in IAM](https://docs.aws.amazon.com/zh_cn/mediaconvert/latest/ug/creating-the-iam-role-in-iam.html)
![](./media/dynosql/IAM-role.gif)

## Bootstrap MonoSQL to Create System Tables in DynamoDB
DynamoDB is a NoSQL database service provided by AWS, which can store and retrieve data quickly and reliably. With MonoSQL, you can easily migrate from MySQL or MariaDB to DynamoDB. Before using MonoSQL to access DynamoDB, you need to create system tables on DynamoDB first. System tables are special tables in DynamoDB, used to store metadata and configuration information related to the DynamoDB service itself. By running the bootstrap program to create system tables, you can ensure that the DynamoDB service can run normally and provide the required functions.
1. Create the EC2 instance based on MonoSQL
Select **EC2** > **instances** > **instances**
![](./media/dynosql/EC2-new.gif)
Click **launch instance**, to enter the specific configuration process for the EC2 instance.
   + Step 1: Configure the instance name, set as `Mono-Bootstrap`.
   + Step 2：Find the AMI image `MonoSQLServer` from `AWS Market Place`, and set the AMI to `MonoSQLServer`.
   + Step 3：Set the instance type to `c5.4xlarge`.
   + Step 4：Set the ssh keypair for SSH login without password, you can use the existing key pair or create a new one.
   + Step 5：Configure the network of the EC2 instance, note that the security group set here must allow flow from port 3306 or database access and setting. After completing the above configuration, verify that it is correct, then you can launch the instance.
![aws-ec2-setting](./media/dynosql/aws-ec2-setting.gif)

1. Create a system table corresponding to MonoSQL in DynamoDB
   + SSH into the newly created EC2 instance and run the following command to bootstrap MonoSQL to create system tables in `AWS DynamoDB`
        ```bash
        /home/ubuntu/install/scripts/mysql_install_db --defaults-file=/home/ubuntu/dynosql.cnf --basedir=/home/ubuntu/install --datadir=/home/ubuntu/data0 --plugin-dir=/home/ubuntu/install/lib/plugin > log 2>&1 &
        ```
        ![aws-instance-create-system-table](./media/dynosql/create-system-table.jpg)
       Run the tail -f log command to check if the execution was successful. If there is a ok prompt, it means that the bootstrapping was successful.
        ![aws-instance-log-ok](./media/dynosql/log-ok.jpg)
    + View the tables in `AWS DynamoDB`, You can see the tables created by MonoSQL in MonoSQL in `AWS DynamoDB`, further indicating that the bootstrapping was successful.
        ![aws-dynamoDB-tables](./media/dynosql/tables-now.gif)
    + Start the database service
        ```bash
        /home/ubuntu/install/bin/mysqld --defaults-file=/home/ubuntu/dynosql.cnf > mysql_log 2>&1 &
        ```
    + Connect to the database by the socket.
        ```bash
        # connect to db.
        cd ~/install
        sudo ./bin/mysql -S /tmp/mysqld3306.sock test
        ```
    + Create a SQL user `sysb`for benchmark testing and a user `mono` for database monitoring by the following command.
        ```sql
        # create sysbench user and monitor user.
        delete from mysql.user where User='';
        CREATE USER 'sysb'@'%' IDENTIFIED BY 'sysb';
        GRANT ALL PRIVILEGES ON * . * TO  'sysb'@'%';

        CREATE USER IF NOT EXISTS 'mono'@'%' IDENTIFIED BY 'mono' WITH MAX_USER_CONNECTIONS 5;
        GRANT ALL PRIVILEGES ON *.* TO 'mono'@'%' IDENTIFIED BY 'mono' WITH GRANT OPTION;
        FLUSH PRIVILEGES;
        ```
        After creating the above roles, you can enter the `mysql` database and check the `user` table to see if the users `sysb` and `mono` exist to verify if the creation was successful.
        ![](./media/dynosql/user-success.jpg)
## Create an Auto Scaling Group Based on MonoSQL
`Auto Scaling Group` is a cloud service provided by AWS that allows you to automatically adjust the number of EC2 instances to meet the needs of your application. With   `Auto Scaling Group`, you can automatically configure the number of MonoSQL instances based on request flow without manual intervention.
Select **EC2** > **Auto Scaling** > **Auto Scaling Group** 
![](./media/dynosql/auto-scaling/auto-scaling-start.gif)
Click **Crate Auto Scaling Group**, enter the specific configuration process for the Auto Scaling Group.
1. **Step 1** Choose a launch template or configuration
      + Set **Auto Scaling Group** name，Note that the group name **must** be set to `MonoSQL`，because the monitor components `Prometheus` and `Grafana` will monitor this resource group based on this name.
          ![auto-scaling-name](./media/dynosql/auto-scaling/auto-scaling-name.jpg)
      + Set the **launch template**, Choose **Launch Configuration**, ignore the warnings,  and click  **create a launch configuration**.
          ![](./media/dynosql/auto-scaling/auto-scaling-launch-setting.jpg)
          Configure a custom launch template according to the following demonstration. 
          ![](./media/dynosql/auto-scaling/auto-scaling-MonoSQLConfAlpha.gif)
        >**Note**
        >
        >When configure the launch template, the IAM instance configuration must meet condition 2 in [Deployment prepare](#deployment-prepare) that is select the user role named `monosql` that has already been created. 
        >![](./media/dynosql/auto-scaling/monosql-policy.jpg)
2. **Step 2** Choose instance start-up options
        Choose the appropriate availability zone and subnet `ap-northeast-1a | subnet-015bc66fedce1b8c0`
        ![](./media/dynosql/auto-scaling/auto-scaling-network.png)
3. **Step 3** Configure advanced options
    + Create a new network load balancer
         ![new-Load-Balancer](./media/dynosql/Network-Load-Balancer.jpg )
    + Set the`load balancer type` to `Network Load Balancer`    
   ![loader-type](./media/dynosql/auto-scaling/loader-type.jpg)
    + Configure the `load balancer name`，Here you can configure the desired name that complies with the AWS naming convention. Here, it is set to **MonoSQL-LB-ALPHA**
    + Set `load balancer scheme` to `Internal`
   ![loader-balancer-scenario](./media/dynosql/auto-scaling/loader-proposal.jpg)
    + Set `availability zone and subnet` to `subnet-015bc66fedce1b8c0(公有)`
   ![loader-balancer-scenario](./media/dynosql/auto-scaling/subnetwork.jpg)
    + Configure the `listener and routing` to listen on port 3306 and route to `MonoSQL-LB-Zean|TCP` by default.
     ![loader-balancer-port](./media/dynosql/auto-scaling/route-port.jpg)
4. **Step 4** Configure group size and scaling policies 
        Set the VM instance requirement value to 3, with a maximum value of 8 and a minimum value of 0. You can configure it as needed. 
        ![](./media/dynosql/auto-scaling/group-size.png)

After completing the above option settings, the other steps can be set to default and do not need to be modified. After all settings are completed, you can successfully create an `Auto Scaling Group` named `MonoSQL`, and the load balancer **MonoSQL-LB-ALPHA** will also be created along with it.
*  In the AWS console, select **EC2** > **Load Balancer** > **Load Balancers**:
    ![](./media/dynosql/auto-scaling/NLB-dns.jpg)
* In the AWS console, select  **EC2** > **Instances** > **Instances**:
    ![](./media/dynosql/auto-scaling/auto-scaling-ec2.png)
  As you can see, three new running instances have been added, which are the three demand nodes we set in the `Auto Scaling Group`.
## Create a Monitor Instance based on MonoSQLMonitor Virtual Image
The MonoSQLMonitor virtual image integrates Prometheus and Grafana monitoring components, which can be used to monitor the Auto Scaling Group. Prometheus is a monitoring tool that can collect and store metric data for distributed databases, and Grafana is a data visualization tool that can display this metric data in charts and other formats, helping users to better understand and analyze the performance and operating status of distributed databases.
   1. Create an EC2 Instance based on MonoSQLMonitor
   The process of creating a monitoring instance is basically the same as creating a MonoSQLServer instance, with one important point to note: the corresponding AMI needs to be set to `MonoSQLServer`.
   ![](./media/dynosql/monitor/AMI_monitor.jpg)
   2. Access the WebUI and view the Grafana Monitor Situation After creating the MonoSQLMonitor monitor instance, the instance will by default monitor the Auto Scaling Group with the name `MonoSQL`, You can enter `monitor EC2 instance IP:3000` in a browser to view the monitor situation of the components for this Auto Scaling Group. The following interface will appear
   ![](./media/dynosql/monitor/grafana.jpg)
   The default username and password are both **admin**，
   Select**Dashboards**> **General** > **Monograph Server** to enter the following interface
   ![](./media/dynosql/monitor/dashboards.jpg)
   Click **Monograph Server**  to enter the following interface, where you can see that the three started instances under the `Auto Scaling group` are all being monitored by the monitor instance
   ![](./media/dynosql/monitor/MonoSQL.jpg)
## Use Sysbench for Benchmark test
   1. Create a MySQL Client EC2 Instance 
   The process of creating a Myclient instance is basically the same as creating a MonoSQLServer instance, but one thing to note is that the corresponding AMI needs to be set to `dynosqlalpha`. The purpose of creating this EC2 instance is to use it as a MySQL client to interact with the `Network Load Balancer` which we set up.
   2. Performe Benchmark test
        + Login to the created MySQL Client instance and execute the following command to perform the `Sysbench` test:
            ```shell
            sysbench /usr/share/sysbench/oltp_insert.lua --mysql_storage_engine=monograph --tables=1 --table_size=100000 --mysql-user=sysb --mysql-host=<MonoSQL-dns-example> --mysql-port=3306 --mysql-password=sysb --mysql-db=test --time=120 --threads=100 --report-interval=5 --auto_inc=off --create_secondary=false --mysql-ignore-errors=all prepare
            sysbench /usr/share/sysbench/oltp_insert.lua --mysql_storage_engine=monograph --tables=1 --table_size=100000 --mysql-user=sysb --mysql-host=<MonoSQL-dns-example> --mysql-port=3306 --mysql-password=sysb --mysql-db=test --time=120 --threads=300 --report-interval=5 --auto_inc=off --create_secondary=false --mysql-ignore-errors=all run
            ```
       Replace the field`<MonoSQL-dns-example>` with the actual DNS of the load balancer created in [Create an Auto Scaling Group Based on MonoSQL](#create-an-auto-scaling-group-based-on-monosql)
       ![](./media/dynosql/sysbench/sysbench-DNS.jpg)
       According to the instance number of 3 configured in our Auto Scaling Group, you can set the thread count field `threads` to 300. The following figure shows the running results during the test
       ![](./media/dynosql/sysbench/run.jpg)
For detailed explanations and processes on using `Sysbench for Benchmark test`, refer to[MonoSQL Benchmark Result](https://github.com/zhangh43/dynosql/blob/main/monosql_benchmark.md)
## Use CloudWatch for Metric Tracking and Log Management
CloudWatch is a monitor service provided by AWS, which can be used to monitor resources and applications in the AWS cloud environment. It can monitor the metrics of AWS services, collect and track log files to help diagnose application and system problems. MonoSQL saves the running logs of instances in the Auto Scaling group in CloudWatch. Users can enter CloudWatch to view the logs and can also use CloudWatch to monitor their predictive scaling policies.
   Select **CloudWatch** > **Logs** > **Log Groups**, and click on **monosql-service** to display the following interface
   ![](./media/dynosql/cloudwatch/log.jpg)
You can view the corresponding log information as needed.
