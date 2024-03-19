---
title: GRANT
summary: 介绍GRANT的功能与用法
aliases: ['/cn/sql-reference/account-management/revoke']
---

# GRANT

赋予访问权限

## 使用权限
使用此`GRANT`语句，用户必须具有`GRANT OPTION`权限，并且具有所赋予的权限的访问权。

## 概述

```sql
#用户或角色权限赋予
GRANT
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    TO user_specification [ user_options ...]

#角色权限
GRANT role TO grantee [, grantee ... ]
[ WITH ADMIN OPTION ]
```
GRANT的作用分为两个方面：
1. GRANT语句用于授权给用户或角色某些特定的权限（privilege）来访问数据库中的对象（object），如表、视图、存储过程等。
2. GRANT语句授权角色给用户，相比于直接赋予相应的权限给用户，授权角色给用户是一种更加灵活和高效的权限控制方式。

参数解释：
`priv_type`：指授权的权限类型，如SELECT、INSERT、UPDATE、DELETE等。
`column_list`：可选参数，指授权的列名。
`object_type`：可选参数，指授权的对象类型，如TABLE、VIEW、PROCEDURE等。
`priv_level`：指授权的级别，可以是全局（GLOBAL）或某个数据库（DATABASE）或某个对象（TABLE、VIEW、PROCEDURE）。
`user_specification`：指被授权的用户或角色，可以是用户名、角色名或者ALL（表示所有用户）。
`user_options`：可选参数，指授权时的一些选项，如WITH GRANT OPTION（允许被授权的用户再将权限授权给其他用户）等。其方式与[CREATE USER](./create-user.md)相同。
`role`：指要授权的角色名。
`grantee`：指被授权的用户或角色，可以是用户名、角色名或者PUBLIC（表示所有用户）。
`WITH ADMIN OPTION`：可选参数，表示授权用户（grantee）可以将该角色授权给其他用户或角色，即具有管理权限。

## 具体用法示例
* 假设要授权用户`'lilly'@'%'`对于mono数据库中的创建数据表的权限：
```sql
GRANT CREATE ON mono.* TO 'lilly'@'%';
Query OK, 0 rows affected (0.010 sec)
```
* 假设要授权用户`'lilly'@'%'`可以`SELECT`和`INSERT`访问表"employees"的"employee_id"和"phone_number"两列，则可以使用以下语句：
```sql
GRANT SELECT(employee_id,phone_number),INSERT(employee_id,phone_number) ON employees TO 'lilly'@'%';
Query OK, 0 rows affected (0.009 sec)
```
* 如果要授权用户对多个对象的多个权限，可以使用逗号分隔，例如授权用户`'lilly'@'%'`对于表"employees"，"orders"的`SELECT`权限：
```sql
GRANT SELECT ON employees,'orders' TO 'lilly'@'%';
```
* 如果要授权用户可以将该权限授权给其他用户，可以添加`WITH GRANT OPTION`选项：
```sql
GRANT SELECT ON employees TO 'lilly'@'%' WITH GRANT OPTION;
Query OK, 0 rows affected (0.010 sec)
```
* 假设有一个角色名为"monorole"，其中包含了`SELECT`、`INSERT`、`UPDATE`等权限，现在要将这个角色授权给用户`lilly@%`，则可以使用以下语句：
```sql
GRANT monorole TO 'lilly'@'%';
Query OK, 0 rows affected (0.014 sec)
```

* 如果要将授权给多个用户，可以使用逗号分隔：
```sql
GRANT monorole TO 'lilly'@'%','bob'@'localhost';
Query OK, 0 rows affected (0.028 sec)
```

* 如果要授权用户可以将该角色授权给其他用户，可以添加`WITH ADMIN OPTION`选项：
```sql
GRANT monorole TO 'lilly'@'%' WITH ADMIN OPTION;
Query OK, 0 rows affected (0.016 sec)
```

## MySQL 兼容性
`GRANT`语句与 MySQL 8.0 的“GRANT”功能完全兼容

更多详情，请参考[mariadb:grant](https://mariadb.com/kb/en/grant/)

