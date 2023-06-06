---
title: REVOKE | MonographDB SQL Statement Reference
summary:  An overview of the usage of REVOKE for the MonographDB database.
---

# REVOKE

This statement removes a previously assigned access from a specified object.

## Prerequisites
To use the `REVOKE` statement, the user must have the global `CREATE USER` permission or the `UPDATE` permission for the mysql database.

## Synopsis

```sql
# Cancel user permissions
REVOKE
     priv_type [(column_list)]
       [, priv_type [(column_list)]] ...
     ON [object_type] priv_level
     FROM user [, user] ...

REVOKE ALL PRIVILEGES, GRANT OPTION
     FROM user [, user] ...

# cancel user authorization role
REVOKE role [, role ...]
     FROM grantee [, grantee2 ... ]

REVOKE ADMIN OPTION FOR role FROM grantee [, grantee2]
```
REVOKE has two main functions:
1. The `REVOKE` statement is used to remove some specific privileges (privilege) of users or roles to limit the user's access to objects (objects) in the database.
2. The `REVOKE` statement removes the user authorization role management rights. Compared with directly canceling user related rights, canceling user authorization role management rights is a more convenient way to limit user rights.

      * `priv_type`: refers to the type of permission to be canceled, such as SELECT, INSERT, UPDATE, DELETE, etc.
      * `column_list`: optional parameter, refers to the name of the column to be canceled.
      * `object_type`: optional parameter, refers to the object type to cancel the permission, such as TABLE, VIEW, PROCEDURE, etc.
      * `priv_level`: refers to the permission level to be canceled, which can be global (GLOBAL), a certain database (DATABASE) or an object (TABLE, VIEW, PROCEDURE).
      * `user`: refers to the user or role to be revoked, which can be user name, role name or PUBLIC (represents all users).
      * `role`: refers to the name of the role to be canceled.
      * `grantee`: refers to the user or role whose administrative authority has been revoked, which can be a user name, role name or PUBLIC (meaning all users).
      * `ADMIN OPTION`: Indicates the administrative authority to the role.
      The priv_type and priv_level supported in MonographDB correspond to the following

        |priv_type|priv_level|
        |:-- | :--|
        |`Global privileges`| `*.*`|
        |`Database privileges`|`db_name.*`|
        |`Table privileges`|`db_name.tbl_name`|
        |`Column privileges`|`(column_list)`|
        |`Function privileges`|`FUNCTION db_name.routine_name`|
        |`Procedure privileges`|`PROCEDURE db_name.routine_name`|


## Examples
1. Remove the specific permissions of the MonographDB account
Connect to MonographDB as user `'root'@'localhost'`
* Assume that user `'lilly'@'%'` is granted DELETE permission to access all tables in all databases, now you want to delete user `'lilly'@'%'` to delete records in all tables in all databases
    ```sql
    REVOKE DELETE ON *.* FROM 'lilly'@'%';
    Query OK, 0 rows affected (0.024 sec)
    ```
* Delete all permissions in all tables in all databases of user `'lilly'@'%'`
    ```sql
    REVOKE ALL PRIVILEGES ON *.* FROM 'lilly'@'%';
    Query OK, 0 rows affected (0.016 sec)
    ```
>**Note**
> After deleting all permissions of a user, the user's permission to add, delete, check and modify all tables does not exist
>

* Remove super user (super) privileges for user `'bob'@'localhost'`
    ```sql
    REVOKE super ON *.* FROM 'bob'@'localhost';
    Query OK, 0 rows affected (0.009 sec)
    ```

* If you want to remove multiple permissions of a user on multiple objects, you can use commas to separate them:
    ```sql
    REVOKE SELECT, INSERT ON orders, departments FROM 'lilly'@'%';
    ```
* If you want to remove some permissions of multiple users, you can use commas to separate them:
    ```sql
    REVOKE SELECT ON employees FROM 'lilly'@'%', 'bob'@'localhost';
    ```
1. Remove user authorization role
Log in to MonographDB as user `'root'@'localhost'`
    ```sql
    REVOKE monorole1 from 'lilly'@'%';
    Query OK, 0 rows affected (0.008 sec)
    ```
>**Note**
>The prerequisite for the successful execution of the above statement is that the ownership user of the role monorole1 is `'root'@localhost'`.

* Assume that the user `'lilly'@'%'` has administrator privileges for the role `monorole`, and now to remove the user's administrator privileges for the role, you can use the following statement:
    ```sql
    REVOKE ADMIN OPTION FOR monorole FROM 'lilly'@'%';
    Query OK, 0 rows affected (0.005 sec)
    ```
## MySQL Compatibility
The `REVOKE` statement is fully compatible with the MySQL 8.0 "REVOKE" feature

For more details, please refer to [mariadb:revoke](https://mariadb.com/kb/en/revoke/)