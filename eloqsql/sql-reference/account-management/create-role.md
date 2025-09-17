---
title: CREATE ROLE
summary: An overview of the usage of CREATE ROLE for the EloqSQL database.
---

# CREATE ROLE

Create a new role and assign new role to users as a part of role-based access control.

A role (ROLE) can include a set of permissions so that the same permissions can be assigned to multiple users. In this way, you can change the permissions of all users by only changing the permissions of the role, rather than change the permissions of each user individually.

## Synopsis

```sql
CREATE [OR REPLACE] ROLE [IF NOT EXISTS] role
   [WITH ADMIN
     {CURRENT_USER | CURRENT_ROLE | user | role}]
```

`WITH ADMIN`: When creating a new role, you can use the WITH ADMIN clause to specify who has the right to use this role. If the WITH ADMIN clause is omitted, the WITH ADMIN CURRENT_USER will be used by default, that is, the current user will have the right to grant this role to other users

> **Note**
> If the user is switched during the process of creating a new role and assigning the new role to the user, an error will occur due to the problem of role ownership

## Examples

Connect to EloqSQL as the `'root'@'localhost'` user

```shell
mysql -u root -h localhost
```

- Create a new role `eloqrole1` and a new user `jack`, and grant the role `eloqrole1` read permission to all tables in the database `test`, and assign the role `eloqrole1` to the newly created user `jack`

  ```sql
  CREATE ROLE eloqrole1;
  Query OK, 0 rows affected, 1 warning (0.008 sec)

  GRANT SELECT ON test.* TO eloqrole1;
  Query OK, 0 rows affected (0.011 sec)

  CREATE USER jack;
  Query OK, 0 rows affected (0.008 sec)

  GRANT eloqrole 1 TO jack;
  Query OK, 0 rows affected (0.008 sec)
  ```

Connect to EloqSQL as the `jack` user

- The user `jack` needs to execute the `SET ROLE eloqrole1` statement to use the privileges associated with the `eloqrole1` role:

```sql
SHOW GRANTS;
+----------------------------------+
| Grants for jack@% |
+----------------------------------+
| GRANT `eloqrole` TO `jack`@`%` |
| GRANT USAGE ON *.* TO `jack`@`%` |
+----------------------------------+

USE test;
Access denied for user 'jack'@'%' to database 'test'

SET ROLE eloqrole;
Query OK, 0 rows affected (0.011 sec)

SHOW GRANTS;
+----------------------------------------+
| Grants for jack@% |
+----------------------------------------+
| GRANT `eloqrole` TO `jack`@`%` |
| GRANT USAGE ON *.* TO `jack`@`%` |
| GRANT USAGE ON *.* TO `eloqrole` |
| GRANT SELECT ON `test`.* TO `eloqrole` |
+----------------------------------------+
4 rows in set (0.000 sec)

USE test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```

Connect to EloqSQL as user `'eloq'@'%'`

```bash
mysql -u eloq -p
```

Follow the prompt to enter the password to log in

- Create role `eloqrole2` and specify that only `root@localhost` user has permission to use this role

```sql
CREATE ROLE eloqrole2 WITH ADMIN 'root'@'localhost';
Query OK, 0 rows affected (0.009 sec)

CREATE USER lilly;
Query OK, 0 rows affected (0.009 sec)

GRANT eloqrole2 to lilly;
ERROR 1698 (28000): Access denied for user 'eloq'@'%'
```

Switch to using `root@localhost` to connect, and execute the following SQL statement

```sql
GRANT eloqrole2 to lilly;
Query OK, 0 rows affected (0.005 sec)
```

## MySQL Compatibility

The `CREATE ROLE` statement is fully compatible with the MySQL 8.0 "CREATE ROLE" feature

For more details, please refer to [mariadb:create-user](https://mariadb.com/kb/en/create-role/)
