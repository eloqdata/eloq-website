---
title: CREATE ROLE
summary: 介绍CREATE ROLE的功能与用法
---

# ALTER USER

创建新角色并将新角色分配给用户

角色(ROLE)可以将一组权限打包在一起，以便将相同权限分配给多个用户。这样，只需更改角色的权限即可更改所有用户的权限，而不必逐个更改每个用户的权限。

## 概述

```sql
CREATE [OR REPLACE] ROLE [IF NOT EXISTS] role
  [WITH ADMIN
    {CURRENT_USER | CURRENT_ROLE | user | role}]
```

`WITH ADMIN`：在创建一个新的角色时，可以通过 WITH ADMIN 子句来指定谁有权使用这个角色。如果省略了 WITH ADMIN 子句，那么默认情况下会使用 WITH ADMIN CURRENT_USER，也就是当前用户会有权将这个角色授权给其他用户

> **注意**
> 如果进行新角色创建并将新角色分配给用户的过程中，切换了用户，会因为角色所有权的问题导致错误

## 具体用法示例

以`'root'@'localhost'`用户登陆 EloqSQL

```bash
mysql -u root -h localhost
```

- 创建新角色`monorole1`和新用户 `jack`，并且赋予角色`monorole1`对于数据库`test`中所有表格的读取权限，并且将角色`monorole1`赋予新创建的用户`jack`

```sql
CREATE ROLE monorole1;
Query OK, 0 rows affected, 1 warning (0.008 sec)

GRANT SELECT ON test.* TO monorole1;
Query OK, 0 rows affected (0.011 sec)

CREATE USER jack;
Query OK, 0 rows affected (0.008 sec)

GRANT monorole1 TO jack;
Query OK, 0 rows affected (0.008 sec)
```

以用户`jack`登录 EloqSQL

- 用户`jack`需要执行`SET ROLE monorole1`语句才能使用与`monorole1`角色相关联的权限：

```sql
SHOW GRANTS;
+-----------------------------------+
| Grants for jack@%                |
+-----------------------------------+
| GRANT `monorole` TO `jack`@`%`   |
| GRANT USAGE ON *.* TO `jack`@`%` |
+-----------------------------------+

USE test;
Access denied for user 'jack'@'%' to database 'test'

SET ROLE monorole;
Query OK, 0 rows affected (0.011 sec)

SHOW GRANTS;
+----------------------------------------+
| Grants for jack@%                     |
+----------------------------------------+
| GRANT `monorole` TO `jack`@`%`        |
| GRANT USAGE ON *.* TO `jack`@`%`      |
| GRANT USAGE ON *.* TO `monorole`       |
| GRANT SELECT ON `test`.* TO `monorole` |
+----------------------------------------+
4 rows in set (0.000 sec)

USE test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```

以`'mono'@'%'`用户登陆 EloqSQL

```bash
mysql -u mono -p
```

按提示输入密码登陆

- 创建角色`monorole2`，并指定只有`root@localhost`用户有权使用该角色

```sql
CREATE ROLE monorole2 WITH ADMIN 'root'@'localhost';
Query OK, 0 rows affected (0.009 sec)

CREATE USER lilly;
Query OK, 0 rows affected (0.009 sec)

GRANT monorole2 to lilly;
ERROR 1698 (28000): Access denied for user 'mono'@'%'
```

切换到使用`root@localhost`登录，执行如下 SQL 语句

```sql
GRANT monorole2 to lilly;
Query OK, 0 rows affected (0.005 sec)
```

## MySQL 兼容性

`CREATE ROLE`语句与 MySQL 8.0 的“CREATE ROLE”功能完全兼容

更多详情，请参考[mariadb:create-user](https://mariadb.com/kb/en/create-role/)
