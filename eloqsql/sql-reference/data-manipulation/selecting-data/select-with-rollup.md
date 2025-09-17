---
title: SELECT WITH ROLLUP | EloqSQL SQL Statement Reference
summary: An overview of the usage of SELECT WITH ROLLUP for the EloqSQL database.
---

# SELECT WITH ROLLUP

`WITH ROLLUP` allows users to add summary rows to the query results, indicating the result of an aggregation calculation over all rows. These summary rows have NULL column values, and they correspond to the results of aggregation calculations for multiple GROUP BY columns. If there is more than one aggregation function in the query, a summary row will be added for each aggregation function.

## Examples

For the generated `employees` data table, the way the table is generated can be seen in [Test Table Generation](../../../data-query/test-scheme-design.md)
The information of the `emloyees` table is as follows:
This table is mainly used to store the basic information of employees

| Field Name     | Type        | Meaning                                                                        |
| -------------- | ----------- | ------------------------------------------------------------------------------ |
| employee_id    | int(6)      | Employee's unique identifier                                                   |
| first_name     | varchar(20) | The first name of the employee                                                 |
| last_name      | varchar(25) | employee's last name                                                           |
| email          | varchar(25) | The employee's email address                                                   |
| phone_number   | varchar(20) | Employee's phone number                                                        |
| hire_date      | date        | The employee's hire date                                                       |
| job_id         | varchar(10) | The employee's job type ID                                                     |
| salary         | double(8,2) | employee's salary                                                              |
| commission_pct | double(2,2) | The employee's commission commission                                           |
| manager_id     | int(6)      | The employee's supervisor ID                                                   |
| department_id  | int(4)      | The employee's department ID (associated to [departments](#departments table)) |

- Group employees by department ID and calculate the average and total salary for each department, and the total salary for all departments:

```sql
SELECT department_id, AVG(salary) AS avg_salary, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id WITH ROLLUP.
```

The query results are as follows:

```
+---------------+--------------+--------------+
| department_id | avg_salary | total_salary |
+---------------+--------------+--------------+
| NULL | 7000.000000 | 7000.00 |
| 10 | 4400.000000 | 4400.00 |
| 20 | 9500.000000 | 19000.00 |
| 30 | 4150.000000 | 24900.00 |
| 40 | 6500.000000 | 6500.00 |
| 50 | 3475.555556 | 156400.00 |
| 60 | 5760.000000 | 28800.00 |
| 70 | 10000.000000 | 10000.00 |
| 80 | 8955.882353 | 304500.00 |
| 90 | 19333.333333 | 58000.00 |
| 100 | 8600.000000 | 51600.00 |
| 110 | 10150.000000 | 20300.00 |
| NULL | 6461.682243 | 691400.00 |
+ ---------------+--------------+--------------+
13 rows in set (0.078 sec)
```

- Group employees by year of entry and calculate the number of employees and total payroll for each year, and the total payroll for all years:

```sql
SELECT YEAR(hire_date) AS hire_year, COUNT(*) AS emp_count, SUM(salary) AS total_salary
FROM employees
GROUP BY YEAR(hire_date) WITH ROLLUP.
```

The output results are as follows:

```
+-----------+-----------+--------------+
| hire_year | emp_count | total_salary |
+-----------+-----------+--------------+
| 1987 | 2 | 28400.00 |
| The total number of employees in the company is 1,000.
| 1990 | 1 | 9000.00 |
| 1991 | 1 | 6000.00 |
| The following is a summary of the results of the study.
| The company's main business is to provide a wide range of services to the public.
| The company's business is based on the following factors
| The following are some examples of the types of products that are available in the market
| The number of employees in the company is increasing.
| 1998 | 23 | 112100.00 |
| 1999 | 18 | 88900.00
| 2000 | 11 | 59200.00 |
| NULL | 107 | 691400.00 |
+ -----------+-----------+--------------+
13 rows in set (0.006 sec)
```

- Group employees by position ID and department ID and calculate the number of employees and total payroll for each position in each department, and the total payroll for all positions and all departments:

```sql
SELECT job_id, department_id, COUNT(*) AS emp_count, SUM(salary) AS total_salary
FROM employees
GROUP BY job_id, department_id WITH ROLLUP.
```

The output results are as follows:

```
+------------+---------------+-----------+--------------+
| job_id | department_id | emp_count | total_salary |
+------------+---------------+-----------+--------------+
| AC_ACCOUNT | 110 | 1 | 8300.00 |
| AC_ACCOUNT | NULL | 1 | 8300.00 |
| AC_MGR | 110 | 1 | 12000.00 |
| AC_MGR | NULL | 1 | 12000.00 |
| AD_ASST | 10 | 1 | 4400.00 |
...
| NULL | 1 | 1 12000.00 | AD_ASST | 10 | 1 | 4400.00 | ...
| ST_CLERK | NULL | 20 | 55700.00 |
| ST_MAN | 50 | 5 | 36400.00 |
| ST_MAN | NULL | 5 | 36400.00 |
| NULL | NULL | 107 | 691400.00 |
+ ------------+---------------+-----------+--------------+
40 rows in set (0.013 sec)
```

These queries use the `WITH ROLLUP` keyword to add summary rows and perform aggregate calculations for different groupings, which can facilitate data analysis and report creation for users.

> **Note**
> You cannot use the ORDER BY clause for sorting while using WITH ROLLUP. Although the GROUP BY column can be sorted using ASC or DESC clause, the super aggregated rows will always be added to the end of the result set.

## MySQL Compatibility

The `SELECT WITH ROLLUP` statement is fully compatible with MySQL 8.0's `SELECT WITH ROLLUP` feature.

For more details, please refer to [mariadb:SELECT WITH ROLLUP](https://mariadb.com/kb/en/select-with-rollup/)
