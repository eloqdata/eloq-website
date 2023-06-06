---
title: LOAD DATA INFILE | MonographDB SQL Statement Reference
summary: An overview of the usage of LOAD DATA INFILE for the MonographDB database.
---

# LOAD DATA INFILE

The `LOAD DATA INFILE` can be used to load data into a MonographDB table.

>**Note**
>When using the `LOAD DATA INFILE` statement, the table must already exist in the database. MonographDB will return an error if you try to load data into a table that does not exist.
>

## Examples

Load local files into a MonographDB database using `LOAD DATA LOCAL INFILE`


* Suppose there is a file named `employees.csv` with the following contents:
    ```
    id,first_name,last_name,age,salary
    1,John,Doe,30,20000
    2,Jane,Smith,25,10,000
    3,Bob,Johnson,45,30000
    ```
Now, we can load this file into a table named "local_employees"
```sql
LOAD DATA LOCAL INFILE '/path/to/employees.csv'
INTO TABLE local_employees
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS.
```

Difference between `LOAD DATA LOCAL INFILE` and `LOAD DATA INFILE`

When the `LOAD DATA INFILE` statement is executed, MonographDB tries to read the input files from its own file system. In contrast, when the `LOAD DATA LOCAL INFILE` statement is executed, the client tries to read the input file from its own file system and sends the contents of the input file to the MonographDB server. This loads the files from the client's local file system into the database. Therefore, the `LOAD DATA LOCAL INFILE` statement is more suitable for handling local files on the client than the `LOAD DATA INFILE` statement.

>**Note**
The `local_employees` table must be created either by executing `LOAD DATA LOCAL INFILE` or by the following table build statement before executing `LOAD DATA LOCAL INFILE`
>```sql
>CREATE TABLE `local_employees` (
>`employee_id` int(6) NOT NULL DEFAULT '0'.
>`first_name` varchar(20) DEFAULT NULL.
>`last_name` varchar(25) NOT NULL.
>`age` int(6) DEFAULT NULL.
>`salary` double(8,2) DEFAULT NULL.
> PRIMARY KEY (`employee_id`)
>) ENGINE=monograph DEFAULT CHARSET=utf8.
>```