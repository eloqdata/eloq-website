---
title: CREATE USER
summary: An overview of the usage of CREATE USER for the EloqSQL database.
---

# CREATE USER

Create a EloqSQL account

## Prerequisites

The current user must have the global `CREATE USER` permission or the `INSERT` permission for the mysql database.

## Synopsis

```sql
CREATE [OR REPLACE] USER [IF NOT EXISTS]
 user_specification [,authentication_option ...]
  [REQUIRE {NONE | tls_option [[AND] tls_option ...] }]
  [WITH resource_option [resource_option ...] ]
  [lock_option] [password_option]
```

- `OR REPLACE`: Use `OR REPLACE` to make the created user overwrite the user with the same name created in mysql.user.
- `user_specification`: set the account name. The account name is composed of two parts: the user name and the host name, which are connected by the @ symbol. It is recommended to add quotation marks between the user name and the host name to meet the requirement that the user name contains special characters or wildcards. When creating an account, if you do not specify a host name, it defaults to `localhost`.
- `authentication_option`: Specifies the authentication method of the account, which supports the following three methods in EloqSQL
  - `IDENTIFIED BY 'password'`: The account password is specified in clear text.
  - `IDENTIFIED BY PASSWORD 'password_hash'`: The account password is specified by a hashed password.
  - `IDENTIFIED {VIA|WITH} authentication_plugin`: specify the use of a specific authentication plugin to authenticate the account through the authentication plugin (authentication plugin)
- `TLS option`: Encrypt data between server and client using the Transport Layer Security (TLS) protocol.
- `resource_option`: Set specific resource limits for certain accounts.
- `lock_option`: EloqSQL supports account locking, allowing privileged administrators to lock or unlock user accounts
- `password_option`: used to set the expiration time of the account password.

## Examples

- Create a user named `mono1@localhost` with host name **localhost**, specified password as `monopasssword1`, and use `OR REPLACE` to delete possible existing users with the same name
  ```sql
  CREATE OR REPLACE USER 'mono1'@'localhost' IDENTIFIED BY 'monopassword1';
  ```
- Create a user named `mono2@%` with host name **%** and specify password as `monopassword2`
  ```sql
   CREATE OR REPLACE USER 'mono2'@'%' IDENTIFIED BY 'monopassword2';
  ```
- Create a user named `mono3` without hostname, and specify password as `monopassword3`

  ```sql
  CREATE USER 'mono3' IDENTIFIED BY 'monopassword3';
  ```

  Use the following SQL statement to show the hostname of the generated user

  ```sql
  select user,host from mysql.user where user='mono3';
  ```

  output

  ```bash
  +-------+------+
  | User | Host |
  +-------+------+
  | mono3 | % |
  +-------+------+
  1 row in set (0.005 sec)
  ```

  It can be seen that not specifying a host name is equivalent to creating an account with host name **%**.

- Create a user named `mono4`, specify **hashed password**
  First, use the PASSWORD function to calculate the hash value password corresponding to the plaintext password. For example, use the following statement to calculate the hash value of `mono`
  ```sql
  SELECT PASSWORD('mono');
  ```
  The output looks like this
  ```bash
  +-------------------------------------------+
  | PASSWORD('mono') |
  +-------------------------------------------+
  | *70EAEE5007749F475555BADD67A4F93B02B98000 |
  +-------------------------------------------+
  1 row in set (0.008 sec)
  ```
  Use the following SQL statement to create `mono4` user
  ```sql
  CREATE USER mono4 IDENTIFIED BY PASSWORD '*70EAEE5007749F475555BADD67A4F93B02B98000';
  ```
- Create an account and use the **identity plugin** method of user authentication
  For example, create a user `mono5` and use the USING or AS keywords to provide the plain text password to the plug-in method for corresponding authentication

```sql
CREATE USER mono IDENTIFIED VIA ed25519 USING PASSWORD('secret');
```

> **Note**
> The premise of using the `ed25519` plugin is that EloqSQL has loaded the corresponding plugin. If it is not loaded, you need to execute the following SQL statement to install it.
>
> ```sql
> INSTALL SONAME 'auth_ed25519';
> ```

- Create an anonymous account
  Anonymous accounts are accounts which the username of the account is blank. These accounts act as special universal accounts. If a user attempts to connect to the database from a certain host, and an anonymous account exists whose hostname part matches the user's host, then the user will be logged in as the anonymous account if no more specific account matches the username entered by the user.
  Create an anonymous user with the host name `localhost` using the following statement
  ```sql
  CREATE USER ''@'localhost';
  ```
  Connect to EloqSQL anonymously using the following statement
  ```bash
  mysql -u '' -h localhost
  ```
  Note that since mysql.db contains the default anonymous account `''@'%'` with the host name **%**, if you want to recreate `''@'%'` by yourself, you need to use `DROP USER` to delete the existing account Anonymous users, or use `OR REPLACE`.
- Set the account password expiration time
  In addition to the automatic password expiration determined by `default_password_lifetime`, password expiration can also be set on an individual user basis, overriding the global setting.
  When creating the user `'mono'@'localhost'`, specify a password expiration time of 100 days.
  ```sql
  CREATE USER 'mono'@'localhost' PASSWORD EXPIRE INTERVAL 100 DAY;
  ```
- Lock account
  Account Lockout allows privileged administrators to lock or unlock user accounts. If the account is locked (existing connections are not affected), new client connections are not allowed.
  ```sql
  CREATE OR REPLACE USER 'mono'@'localhost' ACCOUNT LOCK;
  ```

## MySQL Compatibility

The `CREATE USER` statement is almost fully compatible with the MySQL 8.0 "CREATE USER" feature.

For more details, please refer to [mariadb:create-user](https://mariadb.com/kb/en/create-user/)
