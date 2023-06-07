---
title: Simple Query
summary: Introduce the basic query functions in MonographDB
sidebar_position: 1
---
# Simple query

In this document, we will start to introduce how to use SQL to perform basic query operations on the data in the MonographDB.
## Preparation
Before reading this document, you need to do the following preparations:
  1. Build a MonographDB cluster (you can use [single machine build](../quick-start.md) or [multiple machine build](../cluster-deployment.md))
  2. [Import or create the corresponding test data table](./test-scheme-design.md)
  3. [Connect to MonographDB](../guide-connect-to-monographdb.md)
## Execute a simple query
MonographDB is compatible with MySQL, so it supports the standard SELECT statement provided by MySQL for query, including complex commands such as using `WHERE`, `GROUP BY`, `ORDER BY`, `LIMIT`, etc. to filter and sort data, and limit the number of query results.
Through the database creation example we provide, you can create a `mono` database and corresponding data tables. The created data table `employees` stores some basic information of the company's employees.

To view the data in the `employees`, use the `SELECT` statement
```sql
SELECT employee_id, first_name FROM employees;
```
The result is as follows:

```
+-------------+-------------+
| employee_id | first_name |
+-------------+-------------+
| 100 | Steven |
| 101 | Neena |
| 102 | Lex |
| 103 | Alexander |
...
| 203 | Susan |
| 204 | Hermann |
| 205 | Shelley |
| 206 | William |
+-------------+-------------+
107 rows in set (0.002 sec)
```
## Filter results
In some data tables, there are a large amount of data. If all of them are queried, the amount of data is very large, and some data users do not need. At this time, you can use the `where` statement to filter the query results to find the desired data.
Use the `WHERE` clause to query all information of an employee whose `first_name` is `Nandita`:
```sql
SELECT * FROM employees WHERE first_name = 'Nandita';
```
The result is as follows:
```
+-------------+------------+-----------+---------- +--------------+------------+----------+---------+ ----------------+------------+---------------+
| employee_id | first_name | last_name | email | phone_number | hire_date | job_id | salary | commission_pct | manager_id | department_id |
+-------------+------------+-----------+---------- +--------------+------------+----------+---------+ ----------------+------------+---------------+
184 | Nandita | Sarchand | NSARCHAN | 650.509.1876 | 1996-01-27 | SH_CLERK | 4200.00 | NULL | 121 |
+-------------+------------+-----------+---------- +--------------+------------+----------+---------+ ----------------+------------+---------------+
1 row in set (0.004 sec)
```

## Sort results
In some scenarios, we need to sort some information in the data table to know the maximum value and minimum value of the corresponding data. At this time, you can use the `ORDER BY` statement to sort the query results in the desired way.

For example, the following SQL statement can be used to sort the data of the `employees` table in descending order (`DESC`) according to the `salary` column
```sql
SELECT employee_id, first_name, salary
FROM employees
ORDER BY salary DESC;
```
The result is as follows:
```
+-------------+-------------+----------+
| employee_id | first_name | salary |
+-------------+-------------+----------+
| 100 | Steven | 24000.00 |
| 101 | Neena | 17000.00 |
| 102 | Lex | 17000.00 |
| 145 | John | 14000.00 |
| 146 | Karen | 13500.00 |
| 201 | Michael | 13000.00 |
| 205 | Shelley | 12000.00 |
| 108 | Nancy | 12000.00 |
...
| 131 | James | 2500.00 |
| 191 | Randall | 2500.00 |
| 140 | Joshua | 2500.00 |
| 182 | Martha | 2500.00 |
| 135 | Ki | 2400.00 |
| 127 | James | 2400.00 |
| 128 | Steven | 2200.00 |
| 136 | Hazel | 2200.00 |
| 132 | TJ | 2100.00 |
+-------------+-------------+----------+
107 rows in set (0.007 sec)
```

## Limit the number of query results
If users want to return only partial records when querying, they can use the `LIMIT` statement to limit the number of records returned by the query results.
```sql
SELECT employee_id, first_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 10;
```

The result is as follows:
```
+-------------+------------+----------+
| employee_id | first_name | salary |
+-------------+------------+----------+
| 100 | Steven | 24000.00 |
| 101 | Neena | 17000.00 |
| 102 | Lex | 17000.00 |
| 145 | John | 14000.00 |
| 146 | Karen | 13500.00 |
| 201 | Michael | 13000.00 |
| 205 | Shelley | 12000.00 |
| 108 | Nancy | 12000.00 |
| 147 | Alberto | 12000.00 |
| 168 | Lisa | 11500.00 |
+-------------+------------+----------+
10 rows in set (0.001 sec)
```
By observing the query results, you will find that after using the `LIMIT` statement, the query time is significantly shortened.

## Aggregate queries
Users may need to pay attention to the overall data situation. At this time, the data needs to be aggregated so that the user can pay attention to the overall situation of the data according to a certain indicator to obtain an overall understanding of the data. 

At this time, you can use `GROUP BY` statement with the aggregation function to achieve an overall understanding of the data

For example, if you want to know which department has a large number of employees, you can group the basic information of writers according to the `department_id` column, and then count the number of employees in different departments:

```sql
SELECT department_id, COUNT(DISTINCT employee_id) AS employee_count
FROM employees
GROUP BY department_id
ORDER BY employee_count DESC;
```

The result is as follows:
```
+---------------+----------------+
| department_id | employee_count |
+---------------+----------------+
| 50 | 45 |
| 80 | 34 |
| 100 | 6 |
| 30 | 6 |
| 60 | 5 |
| 90 | 3 |
| 110 | 2 |
| 20 | 2 |
| NULL | 1 |
| 10 | 1 |
| 40 | 1 |
| 70 |1 |
+---------------+----------------+
12 rows in set (0.038 sec)
```
> **Note:**
> Use the `GROUP BY` statement to group by column, for non-group columns need to use aggregate functions:
### Aggregation functions supported by MonographDB
| Function name | Function description |
|:---------|:---------------------|
| [`COUNT()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_count) | Returns the number of rows retrieved|
| [`COUNT(DISTINCT)`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_count-distinct) | returns the number of distinct values |
| [`SUM()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_sum) | returns sum |
| [`AVG()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_avg) | returns the average |
| [`MAX()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_max) | returns the maximum value |
| [`MIN()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_min) | returns the minimum value |
| [`GROUP_CONCAT()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_group-concat) | returns the concatenated string |
| [`VARIANCE()`, `VAR_POP()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_var-pop) | Returns the population standard variance |
| [`STD()`, `STDDEV()`, `STDDEV_POP`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_std) | returns the aggregate standard deviation |
| [`VAR_SAMP()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_var-samp) | Returns the sampling variance |
| [`STDDEV_SAMP()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_stddev-samp) | Returns the sampled standard deviation |

## Multi-table join queries
In many scenarios, the data we need is stored in multiple tables at the same time. At this time, we need to use the `JOIN` command to perform multi-table connection operations so that the data of two or more tables can be combined and displayed. Monograph supports basic inner join `INNER JOIN`, left outer join `LEFT OUTER JOIN` and right outer join `RIGHT OUTER JOIN`

For example, if you want to know the more specific department information of each employee, not just the department number, you need to connect the employee table `employees` with the department table `departments`.

* **INNER JOIN**
In the following SQL statement, use the `JOIN` statement to combine the data rows of the left table `employees` and the right table `departments` in the way of inner join, and the join condition is `employees.department_id=departments.department_id`.

    ```sql
    SELECT e.employee_id,e.first_name,d.department_name
    FROM employees e
    JOIN departments d ON e.department_id = d.department_id;
    ```

    The result is as follows：
    ```
    +-------------+-------------+------------------+
    | employee_id | first_name  | department_name  |
    +-------------+-------------+------------------+
    |         100 | Steven      | Executive        |
    |         101 | Neena       | Executive        |
    |         102 | Lex         | Executive        |
    |         103 | Alexander   | IT               |
    |         104 | Bruce       | IT               |
    |         105 | David       | IT               |
    |         106 | Valli       | IT               |
    ...
    |         176 | Jonathon    | Sales            |
    |         177 | Jack        | Sales            |
    |         179 | Charles     | Sales            |
    |         180 | Winston     | Shipping         |
    ...
    |         201 | Michael     | Marketing        |
    |         202 | Pat         | Marketing        |
    |         203 | Susan       | Human Resources  |
    |         204 | Hermann     | Public Relations |
    |         205 | Shelley     | Accounting       |
    |         206 | William     | Accounting       |
    +-------------+-------------+------------------+
    106 rows in set (0.004 sec)
    ```

* **LEFT OUTER JOIN**
The left outer join returns all the rows in the left table and the values in the right table that match the join condition. if no rows matched in the right table, it will be filled with `NULL`.

    For example, The table `employees` contains information about the company's employees, and the table  `departments` contains information about the company's departments. If you want to display all employees information and their departments information, even if some employees do not have departments, their information should be displayed.
    
    In the following SQL statement,  use the `LEFT JOIN` keyword to declare that the left table employees will be joined to the right table `employees` in a left outer join, thus ensuring that all rows in the `employees` table are returned.

    ```sql
    SELECT e.employee_id,e.first_name,d.department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.department_id;
    ```
    
    The result is as follows:
    ```
    +-------------+-------------+------------------+
    | employee_id | first_name  | department_name  |
    +-------------+-------------+------------------+
    |         100 | Steven      | Executive        |
    |         101 | Neena       | Executive        |
    |         102 | Lex         | Executive        |
    |         103 | Alexander   | IT               |
    |         104 | Bruce       | IT               |
    |         105 | David       | IT               |
    |         106 | Valli       | IT               |
    ...
    |         176 | Jonathon    | Sales            |
    |         177 | Jack        | Sales            |
    |         178 | Kimberely   | NULL             |
    |         179 | Charles     | Sales            |
    ...
    |         202 | Pat         | Marketing        |
    |         203 | Susan       | Human Resources  |
    |         204 | Hermann     | Public Relations |
    |         205 | Shelley     | Accounting       |
    |         206 | William     | Accounting       |
    +-------------+-------------+------------------+
    107 rows in set (0.002 sec)
    ```
* **RIGHT OUTER JOIN**
    A right outer join returns all the records in the right table and the values ​​in the left table that match the join condition. If there is no matching value, it is filled with `NULL`.

    For example, If you want to know which newly established departments do not have employees, you can use the `RIGHT JOIN` statement to combine the `employees` table and the `department` table.

    ```sql
    SELECT e.employee_id,e.first_name,d.department_name
    FROM employees e
    RIGHT JOIN departments d ON e.department_id = d.department_id;
    ```
    ```
    +-------------+-------------+----------------------+
    | employee_id | first_name  | department_name      |
    +-------------+-------------+----------------------+
    |         200 | Jennifer    | Administration       |
    |         201 | Michael     | Marketing            |
    |         202 | Pat         | Marketing            |
    |         114 | Den         | Purchasing           |
    |         115 | Alexander   | Purchasing           |
    ···
    |         176 | Jonathon    | Sales                |
    |         177 | Jack        | Sales                |
    |         179 | Charles     | Sales                |
    |         100 | Steven      | Executive            |
    ···
    |         205 | Shelley     | Accounting           |
    |         206 | William     | Accounting           |
    |        NULL | NULL        | Treasury             |
    |        NULL | NULL        | Corporate Tax        |
    |        NULL | NULL        | Control And Credit   |
    |        NULL | NULL        | Shareholder Services |
    |        NULL | NULL        | Benefits             |
    |        NULL | NULL        | Manufacturing        |
    |        NULL | NULL        | Construction         |
    |        NULL | NULL        | Contracting          |
    |        NULL | NULL        | Operations           |
    |        NULL | NULL        | IT Support           |
    |        NULL | NULL        | NOC                  |
    |        NULL | NULL        | IT Helpdesk          |
    |        NULL | NULL        | Government Sales     |
    |        NULL | NULL        | Retail Sales         |
    |        NULL | NULL        | Recruiting           |
    |        NULL | NULL        | Payroll              |
    +-------------+-------------+----------------------+
    122 rows in set (0.012 sec)
    ```
* **CROSS JOIN**
When the join condition is constant, the inner join between the two tables is called a cross join. A `cross join` joins every record of the left table to all the records of the right table. If the number of records in the left table is `m` and the number of records in the right table is `n`, then `m*n` records will be generated in the result set.