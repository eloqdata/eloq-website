---
title: CREATE ROLE
summary: An overview of the usage of CREATE ROLE for the MonographDB database.
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
>**Note**
>If the user is switched during the process of creating a new role and assigning the new role to the user, an error will occur due to the problem of role ownership
>


## Examples
Connect to MonographDB as the `'root'@'localhost'` user
```shell
mysql -u root -h localhost
```
* Create a new role `monorole1` and a new user `jack`, and grant the role `monorole1` read permission to all tables in the database `test`, and assign the role `monorole1` to the newly created user `jack`
  ```sql
  CREATE ROLE monorole1;
  Query OK, 0 rows affected, 1 warning (0.008 sec)

  GRANT SELECT ON test.* TO monorole1;
  Query OK, 0 rows affected (0.011 sec)

  CREATE USER jack;
  Query OK, 0 rows affected (0.008 sec)

  GRANT monorole 1 TO jack;
  Query OK, 0 rows affected (0.008 sec)
  ```

Connect to MonographDB as the `jack` user
* The user `jack` needs to execute the `SET ROLE monorole1` statement to use the privileges associated with the `monorole1` role:
```sql
SHOW GRANTS;
+----------------------------------+
| Grants for jack@% |
+----------------------------------+
| GRANT `monorole` TO `jack`@`%` |
| GRANT USAGE ON *.* TO `jack`@`%` |
+----------------------------------+

USE test;
Access denied for user 'jack'@'%' to database 'test'

SET ROLE monorole;
Query OK, 0 rows affected (0.011 sec)

SHOW GRANTS;
+----------------------------------------+
| Grants for jack@% |
+----------------------------------------+
| GRANT `monorole` TO `jack`@`%` |
| GRANT USAGE ON *.* TO `jack`@`%` |
| GRANT USAGE ON *.* TO `monorole` |
| GRANT SELECT ON `test`.* TO `monorole` |
+----------------------------------------+
4 rows in set (0.000 sec)

USE test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```

Connect to MonographDB as user `'mono'@'%'`
```bash
mysql -u mono -p
```
Follow the prompt to enter the password to log in

* Create role `monorole2` and specify that only `root@localhost` user has permission to use this role
```sql
CREATE ROLE monorole2 WITH ADMIN 'root'@'localhost';
Query OK, 0 rows affected (0.009 sec)

CREATE USER lilly;
Query OK, 0 rows affected (0.009 sec)

GRANT monorole2 to lilly;
ERROR 1698 (28000): Access denied for user 'mono'@'%'
```
Switch to using `root@localhost` to connect, and execute the following SQL statement
```sql
GRANT monorole2 to lilly;
Query OK, 0 rows affected (0.005 sec)
```
## MySQL Compatibility
The `CREATE ROLE` statement is fully compatible with the MySQL 8.0 "CREATE ROLE" feature

For more details, please refer to [mariadb:create-user](https://mariadb.com/kb/en/create-role/)
