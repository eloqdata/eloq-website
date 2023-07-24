---
title: Migration using AWS DMS
---

# Migration using AWS Database Migration Service(DMS)

This tutorial covers how to setting up AWS DMS to migrate data from exsiting SQL database into MonoSQL. The SQL databases include MySQL On-Premise, MySQL RDS and AWS Aurora for MySQL. Other SQL databases like PostgreSQL, Microsoft SQL Server are also supported, but needs additional migration work with expert help.

For a detailed guide about using AWS DMS and information about specific migration tasks, see the [AWS DMS documentation site](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html).


# Preparation

Please complete the following setup work:

1. Setup [replication instance](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Creating.html) in AWS console.
2. Setup [source point](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html) and point it to your source database.
3. Setup [target point](#create-target-point-for-monosql) following the below detailed instructions and point it to MonoSQL.
4. Disable MonoSQL transaction feature temporarily, since MonoSQL inherits the 100 items transaction limit from DynamoDB, but data migration job depends on large transaction. Future data validation can ensure whether all the data are loaded into the new database.

```
set global monosql_enable_transaction=off;
```

5. Create the database basic schema like database, table object etc.. Note that MonoSQL has its schema best practice and you may need to using AWS DMS [transformation rule](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TableMapping.SelectionTransformation.Transformations.html) to convert the schema for MonoSQL. Follow [MonoSQL schema best practice]() for details.
6. Create secret in [Secret Manager]

![create secret in Secret Manager](.media/create_secret.png)

7. Create the [IAM resource](https://docs.aws.amazon.com/dms/latest/userguide/dm-iam-resources.html) for homogeneous data migrations in AWS DMS.


# Create target point for MonoSQL
1. In the AWS Console, choose **AWS DMS**.
2. Choose **Endpoints** in the sidebar.
3. Click **Create endpoint**
4. In the **Endpoint type** section, select Target endpoint.
5. Supply an **Endpoint identifier** to identify the new target endpoint.
6. In the **Target engine** dropdown, select MySQL.
7. In the **Access to endpoint database** section, select AWS Secrets Manager
8. In the **Secret ID** section, supply the Amazon Resource Name(arn) of the previously created secret in Secret Manager.
9. In **IAM role** section, supply the arn of your migration role. 

![](.media/create_target_point1.png)

10. Optionally you can test the connection by clicking **Test endpoint connection**.
11. Click **Create endpoint**.

![](.media/create_target_point2.png)

# Config source database to enable DMS feature
Follow [CHAP_Source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html#CHAP_Source.MySQL.AmazonManaged) to config source MySQL database.

1. Ensure that the binary logs are available to AWS DMS. Because AWS-managed MySQL-compatible databases purge the binary logs as soon as possible, you should increase the length of time that the logs remain available. For example, to increase log retention to 24 hours, run the following command.

```
call mysql.rds_set_configuration('binlog retention hours', 24);                 ```

2. Set the binlog_format parameter to "ROW".

3. Set the binlog_row_image parameter to "Full".

4. Set the binlog_checksum parameter to "NONE".

Apply the above change in the **Parameter groups** of Amazon RDS console.
![](.media/create_parameter_group.png)

# Create data migration task
1. In **AWS DMS** console, select **Database migration tasks** in the sidebar.
2. Click **Create Task** in the top-right portion of the window.

![](.media/create_migration_task.png)

3. Supply a **Task identifier** to identify the replication task.
4. Select **Replication instance**
5. Select **Source database endpoint** created before.
6. Select **Target database endpoint**, use **MonoSQL** endpoint created before.
7. Select **Migration type** based on your needs. Here we choose Migrate existing data and replicate ongoing changes.

![](.media/create_migration_task1.png)

8. In **Task setting** section, configure the migration task.
9. For the **Editing mode** button, keep **Wizard** selected.
10. Select **Disable customer CDC stop mode** in **Custom CDC stop mode** section.
11. Select **Do nothing** in **Target table preparation mode** section.
12. Select **Don't stop** in **Stop task after full load completes** section.
13. Not click **Enable validation** check and user can compare the data in the source and target database manually.
14. Click **Enable CloudWatch logs** check for debug purpose.

![](.media/create_migration_task2.png)

15. In **Table mappings** section, configure migration rules.
16. For the **Editing mode** button, keep **Wizard** selected.
17. Select **Add new selection rule**.
18. In the **Schema** dropdown, select **Enter a schema**.
19. Supply the appropriate **Source name** (database name in MySQL), **Table name**, and **Action**.
20. Optionally, add transformation rule in *Transformation rules* section.

![](.media/create_migration_task3.png)

21. Click **Create task** button to start the migration job.


