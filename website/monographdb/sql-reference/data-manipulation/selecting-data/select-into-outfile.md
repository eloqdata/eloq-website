---
title: SELECT INTO OUTFILE | MonographDB SQL Statement Reference
summary: Introduces the function and usage of SELECT INTO OUTFILE
---

# SELECT INTO OUTFILE

The `SELECT INTO OUTFILE` statement writes the query results to a file and can specify the output format using column and row terminators. By default, columns use tabs (\t) as terminators, and rows use line feeds (\n) as terminators.

> **Note**
> MonographDB requires file write permission.

## Examples

- For the test table `employees`, query the employee id (employee_id), employee phone number (phone_number) and salary (salary) and store them in the employees file in the home directory, the fields in the output file will be separated by commas and enclosed in double quotes, and each row will be terminated by a newline character. Each record will be terminated by a line break.

```sql
SELECT employee_id,phone_number, salary from employees
  INTO OUTFILE '/path/to/part_employees.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
```

- Export the entire employees table to the corresponding CSV file

```sql
SELECT * INTO OUTFILE '/path/to/full_mployees.csv'
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM employees
```

- Export records that meet certain criteria to a CSV file

```sql
SELECT * INTO OUTFILE '/path/to/IT.csv'
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM employees
WHERE job_id = 'IT_PROG '
```

## MySQL Compatibility

The `SELECT INTO OUTFILE` statement is fully compatible with MySQL 8.0's `SELECT INTO OUTFILE` feature.

For more details, please refer to [mariadb:SELECT INTO OUTFILE](https://mariadb.com/kb/en/select-into-outfile/)
