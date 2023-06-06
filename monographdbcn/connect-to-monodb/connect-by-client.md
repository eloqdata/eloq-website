---
title: 客户端接入
summary: 了解如何使用常见的SQL客户端连接MonoGraphDB数据库。
---

# 客户端接入

本文档介绍了如何使用终端之外的客户端连接MonographDB并进行查询。

文档操作环境为
* win11 操作系统

客户端连接示例包括但不限于如下几种：
* Navicat
* Oracle MySQL Workbench
* SQLyog

1. [Navicat](https://navicat.com/en/products)
下载并安装相应操作系统的Navicat for MySQL客户端安装包。
![](../media/connect-to-monodb/client/navicat-for-mysql-download.png)
打开Navicat客户端，新建MariaDB连接
![](../media/connect-to-monodb/client/navicat-new-sql-connection.jpg)
输入数据库所在的服务器(Host)的IP，端口(Port)号(默认情况下3300)，数据库用户名(User Name)为`mono`以及在创建该用户时的设置的用户密码即可完成连接设置。
![](../media/connect-to-monodb/client/navicat-connection-setting.jpg)
测试连接成功后，保存连接，新建查询
![](../media/connect-to-monodb/client/navicat-connection-new-query.jpg)
写SQL语句并点击运行，运行成功。
![](../media/connect-to-monodb/client/navicat-sql-execution.jpg)


2. [Oracle MySQL Workbench](https://dev.mysql.com/downloads/file/?id=517975)
从官网上下载并安装Mysql Workbench客户端安装包。
打开Mysql Workbench客户端，新建Mysql连接。
![](../media/connect-to-monodb/client/workbench-new-sql-connection.jpg)
输入数据库所在的服务器(Host)的IP，端口(Port)号(默认情况下3300)，数据库用户名(User Name)为`mono`以及在创建该用户时的设置的用户密码即可完成连接设置。
![](../media/connect-to-monodb/client/workbench-connection-setting.jpg)
连接成功
![](../media/connect-to-monodb/client/workbench-connection-success.jpg)
新建查询，写SQL语句并点击运行。
![](../media/connect-to-monodb/client/workbench-sql-execution.jpg)


3. [SQLyog](https://webyog.com/product/sqlyog/)

下载并安装相应操作系统的SQLyog安装包。
打开SQLyog客户端，新建连接
![](../media/connect-to-monodb/client/SQLyog-new-sql-connection.jpg)
输入数据库所在的服务器(Host)的IP，端口(Port)号(默认情况下3300)，数据库用户名(User Name)为`mono`以及在创建该用户时的设置的用户密码即可完成连接设置。
![](../media/connect-to-monodb/client/SQLyog-connection-setting.jpg)
连接成功
![](../media/connect-to-monodb/client/SQLyog-connection-success.jpg)
新建查询，写SQL语句并点击运行。
![](../media/connect-to-monodb/client/SQLyog-sql-execution.jpg)

