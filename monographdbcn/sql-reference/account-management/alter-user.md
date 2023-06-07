---
title: ALTER USER
summary: 介绍ALTER USER的功能与用法
---

# ALTER USER

修改已经存在的MonographDB账户

## 使用前提

使用`ALTER USER`需要有全局的`CREATE USER`权限或者针对`mysql`数据库的`UPDATE`权限。如果数据库系统开启了只读(read_only)权限，则还需要有全局的`SUPER`权限（超级用户）。

## 概述

```sql
ALTER USER [IF EXISTS] 
 user_specification [authentication_option] ...
  [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
  [WITH resource_option [resource_option] ...]
  [lock_option] [password_option] 
```

参数解释：
* `IF EXISTS`:当使用 IF EXISTS 子句时，如果指定的用户不存在，MariaDB 将返回一个警告而不是错误。
* `user_specification`：需要修改的MonographDB账户名，账户名的指定方式与[`CREATE USER`](./create-user.md
)语句相同。
* `authentication_option`:修改账户的身份验证方式。MonographDB支持同时对一个账户使用多种身份验证方式，例如密码或者socket。具体可以查看[`CREATE USER`](./create-user.md
)中的验证方式。
* `TLS option`：使用传输层安全性（TLS）协议在服务器和客户端之间加密数据。
* `resource_option`：为某些账户设置特定的资源限制。
* `lock_option`:MonographDB支持帐户锁定，允许特权管理员锁定/解锁用户帐户
* `password_option`：用于设置账户密码的过期时间。

## 具体用法示例

* 修改已创建用户`'mono'@'%'`的密码为'monopd'

```sql
ALTER USER IF EXISTS 'mono'@'%' IDENTIFIED BY 'monopd';
```

* 修改当前用户的密码为'monopd'

```sql
ALTER USER CURRENT_USER() IDENTIFIED BY 'monopd';
```

* 设置用户`'mono'@'%'`密码过期时间为10天/永久/默认

```sql
ALTER USER 'mono'@'%' PASSWORD EXPIRE INTERVAL 10 DAY;
ALTER USER 'mono'@'%' PASSWORD EXPIRE NEVER;
ALTER USER 'mono'@'%' PASSWORD EXPIRE DEFAULT;
```

* 对用户`'mono'@'%'`进行锁定/解锁

```sql
ALTER USER 'mono'@'%' ACCOUNT LOCK;
ALTER USER 'mono'@'%' ACCOUNT UNLOCK;
```

* 设置用户`'mono'@'%'`的可以接受的实时连接数(MAX_USER_CONNECTIONS)为5，每个小时可以执行的SQL语句数量为400，执行的语句超时(MAX_STATEMENT_TIME)时间为100

```sql
ALTER USER 'mono'@'%' WITH
    MAX_USER_CONNECTIONS 5
    MAX_QUERIES_PER_HOUR 200
    MAX_STATEMENT_TIME 100;
```

## MySQL兼容性

`ALTER USER`语句与 MySQL 8.0 的“ALTER USER”功能几乎完全兼容。

更多详情，请参考[mariadb:alter-user](https://mariadb.com/kb/en/alter-user/)
