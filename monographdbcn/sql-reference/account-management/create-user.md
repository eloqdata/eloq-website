---
title: CREATE USER
summary: 介绍CREATE USER的弄能与用法
---

# CREATE USER
创建MonographDB 账户

## 使用前提
当前用户必须具有全局`CREATE USER`权限或mysql数据库的`INSERT`权限。

## 概述

```sql
CREATE [OR REPLACE] USER [IF NOT EXISTS] 
 user_specification [,authentication_option ...] 
  [REQUIRE {NONE | tls_option [[AND] tls_option ...] }]
  [WITH resource_option [resource_option ...] ]
  [lock_option] [password_option] 
```
参数解释
* `OR REPLACE`：使用`OR REPLACE`可以使得创建的用户覆盖mysql.user中创建的同名用户。
* `user_specification`：设定账户名。账户名由用户名和主机名两个部分组成，用@符号连接，推荐对用户名与主机名加上引号，以满足用户名中包含特殊字符或通配符的需求。创建账户时，不指定主机名，则默认为`localhost`。
* `authentication_option`：指定账户的身份验证方式，在MonographDB中支持如下的三种方式
    + `IDENTIFIED BY 'password'`：账户密码以明文方式指定。
    + `IDENTIFIED BY PASSWORD 'password_hash'`：账户密码以已经被哈希的密码指定。
    + `IDENTIFIED {VIA|WITH} authentication_plugin`：通过身份验证插件(authentication plugin)指定使用特定的身份验证插件来验证账户
* `TLS option`：使用传输层安全性（TLS）协议在服务器和客户端之间加密数据。
* `resource_option`：为某些账户设置特定的资源限制。
* `lock_option`:MonographDB支持帐户锁定，允许特权管理员锁定/解锁用户帐户
* `password_option`：用于设置账户密码的过期时间。


## 具体用法示例
* 创建**主机名为localhost**的新用户`mono1@localhost`，指定**明文密码**为`monopasssword1`，并且使用`OR REPLACE`则删除可能存在的的同名用户
  ```sql
  CREATE OR REPLACE USER 'mono1'@'localhost' IDENTIFIED BY 'monopassword1';
  ```
* 创建**主机名为%**的新用户`mono2@%`，指定**明文密码**为`monopassword2`
  ```sql
   CREATE OR REPLACE USER 'mono2'@'%' IDENTIFIED BY 'monopassword2';
  ```
* 创建**不指定主机名**的新用户`mono3`，指定**明文密码**为`monopassword3`
  ```sql
  CREATE USER 'mono3' IDENTIFIED BY 'monopassword3';
  ```
    使用以下SQL语句查看生成的用户的主机名
    ```sql
    select user,host from mysql.user where user='mono3';
    ```
    输出
    ```bash
    +-------+------+
    | User  | Host |
    +-------+------+
    | mono3 | %    |
    +-------+------+
    1 row in set (0.005 sec)
    ```
可以看出不指定主机名，相当于创建账户`'mono3'@'%'`。
* 创建用户`mono4`，指定**哈希值密码**
首先，使用PASSWORD函数计算出明文密码对应的哈希值密码。例如，使用下述语句计算处`mono`的哈希值密码
```sql
SELECT PASSWORD('mono');
```
输出如下所示
```bash
+-------------------------------------------+
| PASSWORD('mono')                          |
+-------------------------------------------+
| *70EAEE5007749F475555BADD67A4F93B02B98000 |
+-------------------------------------------+
1 row in set (0.008 sec)
```
使用如下的SQL语句，创建`mono4`用户
```sql
CREATE USER mono4 IDENTIFIED BY PASSWORD '*70EAEE5007749F475555BADD67A4F93B02B98000';
```
* 创建账户，使用**身份插件**的方式用户身份验证
例如创建用户`mono5`使用USING或AS关键字将将纯文本密码提供给插件的方法，进行相应的身份验证
```sql
CREATE USER mono IDENTIFIED VIA ed25519 USING PASSWORD('secret');
```
>**注意**
>使用`ed25519`插件的前提是相应的MonographDB已经加载，如果没有加载需要执行下述的SQL语句进行安装。
>```sql
>INSTALL SONAME 'auth_ed25519';
>```
* 创建匿名账户
匿名账户是指账户名称的用户名部分为空的账户。这些账户充当特殊的全能账户。如果用户尝试从某个主机登录系统，并且存在一个匿名账户，其主机名部分与用户的主机匹配，则如果没有更具体的账户匹配用户输入的用户名，用户将以匿名账户身份登录。
使用以下语句创建一个主机名为`localhost`匿名用户
```sql
CREATE USER ''@'localhost';
```
使用下述命令匿名登陆MonographDB
```bash
mysql -u '' -h localhost 
```
注意由于mysql.db中含有默认的主机名为%的匿名账户`''@'%'`，如果想自己重新创建`''@'%'`，需要先使用`DROP USER`删除已经存在的匿名用户，或者使用`OR REPLACE`。
* 创建账户时设置账户密码的过期时间
除了由`default_password_lifetime`确定的自动密码过期之外，还可以在单​​个用户的基础上设置密码过期时间，覆盖全局设置。
创建用户`'mono'@'localhost' `时，指定密码过期时间是100天。
```sql
CREATE USER 'mono'@'localhost' PASSWORD EXPIRE INTERVAL 100 DAY;
```
* 创建账户时锁定账户
帐户锁定允许特权管理员锁定/解锁用户帐户。如果帐户被锁定（现有连接不受影响），则不允许新的客户端连接。
```sql
CREATE OR REPLACE USER 'mono'@'localhost' ACCOUNT LOCK;
```


## MySQL兼容性

`CREATE USER`语句与 MySQL 8.0 的“CREATE USER”功能几乎完全兼容。

更多详情，请参考[mariadb:create-user](https://mariadb.com/kb/en/create-user/)
