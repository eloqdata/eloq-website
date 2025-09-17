---
title: Basic SQL Operations
---

# Explore SQL with EloqSQL

After successfully deploying the EloqSQL cluster, you can connect to the EloqSQL to execute the corresponding SQL statement. EloqSQL is compatible with MySQL, you can use the MySQL client to connect to EloqSQL, and can use MySQL statements directly in most of cases. (**Note**: Some Mysql statements are not supported, see [Comparison with Mysql Compatibility](./mysql-compatibility.md)

## Category

The types of the SQL is generally divided into the following four parts:

- Data Definition Language (DDL): It is used to define database objects such as databases, tables, views, and indexes.
- Data Manipulation Language (DML): It is used to manipulate related records.
- Data Query Language (DQL): It is used to query records filtered by conditions.
- Data Control Language (DCL): It is used to define access rights and security levels.
  Common DDL functions include creating, modifying, and dropping objects (such as tables, indexes, etc.), and the corresponding commands are CREATE, ALTER, and DROP.

## Show, create and drop a database

The database in EloqSQL is basically consistent with the definition in the MySQL context. Database (database) can be defined as a collection of tables, indexes and other related objects.

- Use the `SHOW DATABASES` statement to show the list of databases in the system:

  ```sql
  SHOW DATABASES;
  ```

- Use the database named `mysql`, the mysql database is one of the MySQL system databases, it will be automatically generated during the MySQL server installation. The system information and metadata of the MySQL server are stored in the mysql database, which is used to manage and maintain various configuration and status information of the MySQL server. :

  ```sql
  USE mysql;
  ```

Use the `SHOW TABLES` statement to show all tables in the database. For example:

```sql
SHOW TABLES FROM mysql;
```

Create a database using the `CREATE DATABASE` statement. The syntax is as follows:

```sql
CREATE DATABASE db_name [options];
```

For example, to create a database called `eloq`, use the following statement:

```sql
CREATE DATABASE IF NOT EXISTS eloq;
```

In SQL, `IF NOT EXISTS` is a conditional statement, which is used to determine whether a table or index with the same name already exists when executing DDL statements such as `CREATE TABLE`, `CREATE INDEX`, so as to avoid repeated creation of objects mistake

Use the `DROP DATABASE` statement to drop a database. For example:

```sql
DROP DATABASE eloq;
```

> **Note**
>
> After the database is deleted, all tables, views, stored procedures, triggers, events and other objects will be permanently deleted, so before executing the DROP DATABASE statement, you should back up all important data.

## Create, show and drop a table

Tables are created using the `CREATE TABLE` statement. The syntax is as follows:

```sql
CREATE TABLE table_name (
    column1 datatype constraint,
    column2 datatype constraint,
    column3 datatype constraint,
    ...
    PRIMARY KEY (one or more columns)
);
```

Here is an example to create a table named "students" with four columns id, name, age and gender:

```sql
CREATE TABLE students (
    id INT ,
    name VARCHAR(50) ,
    age INT CHECK (age >= 18 AND age <= 60),
    gender ENUM('Male', 'Female')
);
```

In the above example, the age column must be greater than or equal to 18 and less than or equal to 60 years old, and the value of the gender column must be 'Male' or 'Female'.

Use the `SHOW CREATE` or `DESC` statement to show the table structure, that is, DDL. For example:

```sql
SHOW CREATE TABLE students;
DESC students;
```

Both `SHOW CREATE` and `DESC` are statements to show the table structure in SQL, but their functions and results are different:

- The `SHOW CREATE` statement is used to query the creation statement of the specified table, that is, to view the SQL statement that created the table. It can display all structural information of the table, including the name of the table, column names, data types, constraints, etc. The output is a string containing the complete statement to create the table.
- The `DESC` statement is used to query the column information of the table, that is, to view the column name, data type, default value, constraint conditions, etc. of the specified table. The output is a table with each column's name, data type, nullability, key type, and default value.
  Use the `DROP TABLE` statement to drop a table. For example:

  ```sql
  DROP TABLE students;
  ```

## Create, show and drop an index

Indexes are often used to speed up queries on indexed columns. For columns with non-unique values, ordinary indexes can be created using the `CREATE INDEX` statement. For example:

```sql
CREATE INDEX idx_id ON students (id);
```

For columns with unique values, unique indexes can be created. For example:

```sql
CREATE UNIQUE INDEX idx_unique_id ON students (id);
```

Use `SHOW INDEX` statement to view all indexes in the table:

```sql
SHOW INDEX FROM students;
```

Use the `DROP INDEX` statement to drop an index. For example:

```sql
DROP INDEX idx_id ON students;
```

Note: DDL operations are not transactions, and do not need to correspond to COMMIT statements when executing DDL.

Commonly used DML functions are adding, modifying, and deleting table records, and the corresponding commands are INSERT, UPDATE, and DELETE.

## Insert, update and delete records

Record (Record) refers to each row of data in the table, also known as row (Row) or tuple (Tuple). Each record contains the data of all columns in the table and is generally used to represent the attribute value of an entity or object.

Use the `INSERT` statement to insert table records into a table. For example:

```sql
INSERT INTO students VALUES(101,'tom',20,'Male');
```

Use the `INSERT` statement to insert table records containing partial field data into a table. For example:

```sql
INSERT INTO students(id,name) VALUES(102,'bob');
```

Use the `UPDATE` statement to modify some field data of the table record in the table. For example:

```sql
update students set age=21 where id=102;
```

Use the `DELETE` statement to delete some table records from the table. For example:

```sql
DELETE FROM students WHERE id=102;
```

> Note: UPDATE and DELETE operations operate on the entire table without WHERE filter conditions.

DQL data query language is to retrieve the desired data rows from one or more tables, which is usually the core content of business development.

## Query data

Use the `SELECT` statement to retrieve data from a table. For example:

```sql
SELECT * FROM studnets;
```

Add the name of the column to be queried after the SELECT. For example:

```sql
SELECT name FROM students;
```

```sql
+------+
| name |
+------+
| tom |
+------+
1 row in set (0.00 sec)
```

Use the WHERE clause to filter all records to see if they meet the conditions before returning. For example:

```sql
SELECT * FROM studnets WHERE id=101;
```

Commonly used DCL functions are to create or delete users, and to manage user permissions.

## Create, authorize and delete a user

Use the `CREATE USER` statement to create a user `eloquser` with a password of `10001`:

```sql
CREATE USER 'eloquser'@'localhost' IDENTIFIED BY '10001';
```

The authorized user `eloquser` can search tables in the database `eloq`:

```sql
GRANT SELECT ON eloq.* TO 'eloquser'@'localhost';
```

Query the permissions of the user `eloquser`:

```sql
SHOW GRANTS for eloquser@localhost;
```

Delete user `eloquser`:

```sql
DROP USER 'eloquser'@'localhost';
```

## Create stored procedures and functions

**Stored procedure** is a set of pre-written SQL statements that can accept input parameters and return output parameters to perform a series of database operations, which can modify data in the database. **Stored procedures** are usually stored in the database server and can be called and executed multiple times. **Stored procedures** can contain logical structures such as conditional judgment, loops, and transaction control, and have flexible control processes and high performance advantages.
For the students table, you can create the following stored procedure to insert a new student record into the students table

```sql
CREATE PROCEDURE insert_student(
   IN student_id INT,
   IN student_name VARCHAR(50),
   IN student_age INT,
   IN student_gender ENUM('Male', 'Female')
)
BEGIN
   INSERT INTO students (id, name, age, gender) VALUES (student_id, student_name, student_age, student_gender);
END;
```

The above stored procedure receives four parameters, which respectively represent the ID, name, age and gender of the student, and then use the INSERT INTO statement to insert these parameter values into the students table.
For example, the following command can be used to call the insert_student stored procedure and insert a new student record into the students table:

```sql
CALL insert_student(1, 'Zhang San', 20, 'Male');
```

**Function** is a piece of reusable SQL code, usually used to calculate and return a result, which will not modify the data in the database. **Functions** can receive input parameters and return a value as a result. **Functions** can be used directly in SQL statements, or they can be called and executed in stored procedures. **Functions** can implement some simple mathematical calculations, string processing, date processing and other functions, as well as some complex business logic calculations
For the students table, you can create the following function to calculate the birth year of the students. A function named `get_student_birth_year` can be created using the following SQL statement

```sql
CREATE FUNCTION get_student_birth_year(student_id INT) RETURNS INT
BEGIN
   DECLARE birth_year INT;
   SELECT YEAR(NOW()) - age INTO birth_year FROM students WHERE id = student_id;
   RETURN birth_year;
END;
```

For example, it can be invoked with `get_student_birth_year` function, and calculate the birth year of student ID 1:

```sql
SELECT get_student_birth_year(1);
```
