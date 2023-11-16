---
title: ALTER USER
summary: An overview of the usage of ALTER USER for the MonographDB database.
---

# ALTER USER

The `alter user` statement is used to modify the user information in the database.

## Prerequisites

Use `ALTER USER` requires the global `CREATE USER` permission or the `UPDATE` permission for the `mysql` database. If the database system has enabled the read-only (read_only) permission, you also need to have the global `SUPER` permission (super user).

## Synopsis

```sql
ALTER USER [IF EXISTS]
 user_specification [authentication_option] ...
  [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
  [WITH resource_option [resource_option] ...]
  [lock_option] [password_option]
```

- `IF EXISTS`: When using the `IF EXISTS` clause, MonographDB will return a warning instead of an error if the specified user does not exist.
- `user_specification`: The MonographDB account name that needs to be modified, the account name is specified in the same way as [`CREATE USER`](./create-user.md) statement is the same.
- `authentication_option`: Modify the authentication method of the account. MonographDB supports multiple authentication methods for an account at the same time, such as password or socket. For details, see [`CREATE USER`](./create-user.md) in the verification method.
- `TLS option`: Encrypt data between server and client using the Transport Layer Security (TLS) protocol.
- `resource_option`: Set specific resource limits for certain accounts.
- `lock_option`: MonographDB supports account locking, allowing privileged administrators to lock/unlock user accounts
- `password_option`: used to set the expiration time of the account password.

## Examples

- Modify the password of the created user `'mono'@'%'` to 'monopd'

  ```sql
  ALTER USER IF EXISTS 'mono'@'%' IDENTIFIED BY 'monopd';
  ```

- Change the current user's password to 'monopd'

  ```sql
  ALTER USER CURRENT_USER() IDENTIFIED BY 'monopd';
  ```

- Set user `'mono'@'%'` password expiration time to 10 days/permanent/default

  ```sql
  ALTER USER 'mono'@'%' PASSWORD EXPIRE INTERVAL 10 DAY;
  ALTER USER 'mono'@'%' PASSWORD EXPIRE NEVER;
  ALTER USER 'mono'@'%' PASSWORD EXPIRE DEFAULT;
  ```

- Lock/unlock user `'mono'@'%'`

  ```sql
  ALTER USER 'mono'@'%' ACCOUNT LOCK;
  ALTER USER 'mono'@'%' ACCOUNT UNLOCK;
  ```

- Set the acceptable number of real-time connections (MAX_USER_CONNECTIONS) of user `'mono'@'%'` to 5, the number of SQL statements that can be executed per hour to 400, and the timeout (MAX_STATEMENT_TIME) of executed statements to 100

  ```sql
  ALTER USER 'mono'@'%' WITH
      MAX_USER_CONNECTIONS 5
      MAX_QUERIES_PER_HOUR 200
      MAX_STATEMENT_TIME 100;
  ```

## MySQL Compatibility

The `ALTER USER` statement is almost fully compatible with the MySQL 8.0 "ALTER USER" feature.

For more details, please refer to [mariadb:alter-user](https://mariadb.com/kb/en/alter-user/)
