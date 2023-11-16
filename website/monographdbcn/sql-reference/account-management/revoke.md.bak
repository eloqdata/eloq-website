---
title: REVOKE
summary: 介绍REVOKE的功能与用法
aliases: ['/cn/sql-reference/account-management/revoke']
---

# REVOKE

删除访问权限

## 使用权限
使用此`REVOKE`语句，用户必须具有全局`CREATE USER`权限或mysql数据库的`UPDATE`权限。

## 概述
```sql
# 取消用户权限
REVOKE 
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    FROM user [, user] ...

REVOKE ALL PRIVILEGES, GRANT OPTION
    FROM user [, user] ...

# 取消用户授权角色
REVOKE role  [, role ...]
    FROM grantee [, grantee2 ... ]

REVOKE ADMIN OPTION FOR role FROM grantee [, grantee2]
```
REVOKE的主要功能有两个：
1. REVOKE语句用于取消用户或角色的某些特定权限（privilege），以限制用户对数据库中的对象（object）的访问
2. REVOKE语句取消用户授权角色管理权限的语法说明，相比于直接取消用户的相关权限，取消用户授权角色管理权限则是一种限制用户权限的方式。

参数解释：
* `priv_type`：指要取消的权限类型，如SELECT、INSERT、UPDATE、DELETE等。
* `column_list`：可选参数，指要取消的列名。
* `object_type`：可选参数，指要取消权限的对象类型，如TABLE、VIEW、PROCEDURE等。
* `priv_level`：指要取消的权限级别，可以是全局（GLOBAL）或某个数据库（DATABASE）或某个对象（TABLE、VIEW、PROCEDURE）。
* `user`：指要取消权限的用户或角色，可以是用户名、角色名或者PUBLIC（表示所有用户）。
* `role`：指要取消的角色名。
* `grantee`：指被取消授权管理权限的用户或角色，可以是用户名、角色名或者PUBLIC（表示所有用户）。
* `ADMIN OPTION`：表示对角色的管理权限。
在MonographDB中支持的priv_type与priv_level对应如下

| priv_type | priv_level|
|:-- | :--|
|`Global privileges`| `*.*`|
|`Database privileges`|`db_name.*`|
|`Table privileges`|`db_name.tbl_name`|
|`Column privileges`|`(column_list)`|
|`Function privileges`|`FUNCTION db_name.routine_name`|
|`Procedure privileges`|`PROCEDURE db_name.routine_name`|


## 具体用法示例
1. 取消MonographDB账户的特定权限
以`'root'@'localhost'`用户登录到MonographDB
* 假设用户`'lilly'@'%'`被授权DELETE权限访问所有数据库中的所有表，现在要删除用户`'lilly'@'%'`对所有数据库中所有表中的记录的删除权限
```sql
REVOKE DELETE ON *.* FROM 'lilly'@'%';
Query OK, 0 rows affected (0.024 sec)
```
* 删除用户`'lilly'@'%'`的所有数据库中所有表中所有权限
```sql
REVOKE ALL PRIVILEGES ON *.* FROM 'lilly'@'%';
Query OK, 0 rows affected (0.016 sec)
```
>**注意**
>删除一个用户的所有权限后，该用户对于所有表的增删查改权限均不存在
>

* 删除用户`'bob'@'localhost'`的超级用户(super)权限
```sql
REVOKE super ON *.* FROM 'bob'@'localhost';
Query OK, 0 rows affected (0.009 sec)
```

* 如果要取消用户对多个对象的多个权限，可以使用逗号分隔：
```sql
REVOKE SELECT, INSERT ON orders, departments FROM 'lilly'@'%';
```
* 如果要取消多个用户的某些权限，可以使用逗号分隔：
```sql
REVOKE SELECT ON employees FROM 'lilly'@'%', 'bob'@'localhost';
```
2. 取消用户授权角色
以`'root'@'localhost'`用户登录到MonographDB
```sql
REVOKE monorole1 from 'lilly'@'%';
Query OK, 0 rows affected (0.008 sec)
```
>**注意**
>上述语句执行成功的前提是角色monorole1的所有权用户是`'root'@localhost'`。

* 假设用户`'lilly'@'%'`对于角色`monorole`具有管理员权限，现在要取消该用户对角色的管理员权限，则可以使用如下语句：
```sql
REVOKE ADMIN OPTION FOR monorole FROM 'lilly'@'%';
Query OK, 0 rows affected (0.005 sec)
```
## MySQL 兼容性
`REVOKE`语句与 MySQL 8.0 的“REVOKE”功能完全兼容

更多详情，请参考[mariadb:revoke](https://mariadb.com/kb/en/revoke/)

