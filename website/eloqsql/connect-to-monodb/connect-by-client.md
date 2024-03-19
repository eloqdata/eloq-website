---
title: Client Connection
summary: Learn how to connect to the MonoGraphDB database using common SQL clients.
---

# client connection

This document describes how to use a client other than a terminal to connect to EloqSQL.

The document operating environment is

- win11 operating system

Examples of client connections include but are not limited to the following:

- Navicat
- Oracle MySQL Workbench
- SQLyog

1. [Navicat](https://navicat.com/en/products)
   Download and install the Navicat for MySQL client installation package of the corresponding operating system.
   ![](../media/connect-to-monodb/client/navicat-for-mysql-download.png)
   Open the Navicat client and create a MariaDB connection
   ![](../media/connect-to-monodb/client/navicat-new-sql-connection.jpg)
   Enter the IP of the server (Host) where the database is located, the port (Port) number (3300 by default), the database user name (User Name) is `mono` and the user password set when creating the user to complete the connection settings .
   ![](../media/connect-to-monodb/client/navicat-connection-setting.jpg)
   After the test connection is successful, save the connection and create a new query
   ![](../media/connect-to-monodb/client/navicat-connection-new-query.jpg)
   Write the SQL statement and click Run, it runs successfully.
   ![](../media/connect-to-monodb/client/navicat-sql-execution.jpg)

2. [Oracle MySQL Workbench](https://dev.mysql.com/downloads/file/?id=517975)
   Download and install the Mysql Workbench client installation package from the official website.
   Open the Mysql Workbench client and create a new Mysql connection.
   ![](../media/connect-to-monodb/client/workbench-new-sql-connection.jpg)
   Enter the IP of the server (Host) where the database is located, the port (Port) number (3300 by default), the database user name (User Name) is `mono` and the user password set when creating the user to complete the connection settings .
   ![](../media/connect-to-monodb/client/workbench-connection-setting.jpg)
   connection succeeded
   ![](../media/connect-to-monodb/client/workbench-connection-success.jpg)
   Create a new query, write a SQL statement and click Run.
   ![](../media/connect-to-monodb/client/workbench-sql-execution.jpg)

3. [SQLyog](https://webyog.com/product/sqlyog/)

Download and install the SQLyog installation package for the corresponding operating system.
Open the SQLyog client and create a new connection
![](../media/connect-to-monodb/client/SQLyog-new-sql-connection.jpg)
Enter the IP of the server (Host) where the database is located, the port (Port) number (3300 by default), the database user name (User Name) is `mono` and the user password set when creating the user to complete the connection settings .
![](../media/connect-to-monodb/client/SQLyog-connection-setting.jpg)
connection succeeded
![](../media/connect-to-monodb/client/SQLyog-connection-success.jpg)
Create a new query, write a SQL statement and click Run.
![](../media/connect-to-monodb/client/SQLyog-sql-execution.jpg)
