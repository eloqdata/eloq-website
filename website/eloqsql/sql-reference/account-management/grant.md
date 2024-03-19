---
title: GRANT
summary: An overview of the usage of GRANT  for the TiDB database.
---

#GRANT

grant access to the database object.

## Prerequisites

To use this `GRANT` statement, the user must have the `GRANT OPTION` privilege and have access to the granted privileges.

## Synopsis

```sql
# User or role permission grant
GRANT
     priv_type [(column_list)]
       [, priv_type [(column_list)]] ...
     ON [object_type] priv_level
     TO user_specification [ user_options...]

#Role Permissions
GRANT role TO grantee [, grantee ... ]
[ WITH ADMIN OPTION ]
```

The role of GRANT is divided into two aspects:

1. The GRANT statement is used to authorize certain privileges (privilege) to users or roles to access objects (objects) in the database, such as tables, views, stored procedures, etc.
2. The GRANT statement authorizes roles to users. Compared with directly granting corresponding permissions to users, authorizing roles to users is a more flexible and efficient permission control method.

`priv_type`: refers to the authorized permission type, such as SELECT, INSERT, UPDATE, DELETE, etc.
`column_list`: optional parameter, refers to the authorized column name.
`object_type`: optional parameter, refers to the authorized object type, such as TABLE, VIEW, PROCEDURE, etc.
`priv_level`: refers to the level of authorization, which can be global (GLOBAL), a database (DATABASE) or an object (TABLE, VIEW, PROCEDURE).
`user_specification`: refers to the authorized user or role, which can be user name, role name or ALL (represents all users).
`user_options`: optional parameter, which refers to some options during authorization, such as WITH GRANT OPTION (allows authorized users to authorize permissions to other users), etc. The method is the same as [CREATE USER](./create-user.md).
`role`: refers to the name of the role to be authorized.
`grantee`: refers to the authorized user or role, which can be user name, role name or PUBLIC (represents all users).
`WITH ADMIN OPTION`: optional parameter, indicating that the authorized user (grantee) can authorize this role to other users or roles, that is, has administrative rights.

## Examples

- grant the user `'lilly'@'%'` to create data tables in the mono database:
  ```sql
  GRANT CREATE ON mono.* TO 'lilly'@'%';
  Query OK, 0 rows affected (0.010 sec)
  ```
- grant the user `'lilly'@'%'` to access the columns "employee_id" and "phone_number" of the table "employees" with `SELECT` and `INSERT`, you can use the following statement:
  ```sql
  GRANT SELECT(employee_id,phone_number),INSERT(employee_id,phone_number) ON employees TO 'lilly'@'%';
  Query OK, 0 rows affected (0.009 sec)
  ```
- grant users to have multiple permissions on multiple objects, you can use commas to separate them. For example, grant user `'lilly'@'%'` for the `SELECT` permission of the table "employees" and "orders":
  ```sql
  GRANT SELECT ON 'employees','orders' TO 'lilly'@'%';
  ```
- grant users to have the privilege to grant permission to other users, you can add the `WITH GRANT OPTION` option:
  ```sql
  GRANT SELECT ON employees TO 'lilly'@'%' WITH GRANT OPTION;
  Query OK, 0 rows affected (0.010 sec)
  ```
- Suppose there is a role named "monorole", which includes permissions such as `SELECT`, `INSERT`, `UPDATE`, and now to grant this role to the user `lilly@%`, you can use the following statement:

  ```sql
  GRANT monorole TO 'lilly'@'%';
  Query OK, 0 rows affected (0.014 sec)
  ```

- If you want to grant multiple users, you can use commas to separate them:

  ```sql
  GRANT monorole TO 'lilly'@'%','bob'@'localhost';
  Query OK, 0 rows affected (0.028 sec)
  ```

- If you want to grant users to authorize this role to other users, you can add the `WITH ADMIN OPTION` option:
  ```sql
  GRANT monorole TO 'lilly'@'%' WITH ADMIN OPTION;
  Query OK, 0 rows affected (0.016 sec)
  ```

## MySQL Compatibility

The `GRANT` statement is fully compatible with the MySQL 8.0 "GRANT" feature

For more details, please refer to [mariadb:grant](https://mariadb.com/kb/en/grant/)
