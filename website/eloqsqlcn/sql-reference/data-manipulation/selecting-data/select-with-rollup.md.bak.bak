---
title: SELECT WITH ROLLUP
summary: 介绍SELECT WITH ROLLUP的功能与用法
aliases: ['/cn/sql-reference/data-manipulation/selecting-data/select-with-rollup']
---

# SELECT WITH ROLLUP

`WITH ROLLUP`可以在查询结果中添加汇总行，表示对所有行进行聚合计算的结果。这些汇总行的列值为NULL，它们对应的是多个GROUP BY列的聚合计算结果。如果在查询中有多个聚合函数，则会为每个聚合函数添加一个汇总行。

## 具体用法示例
针对生成的`employees`数据表，表格的生成方式可以查看[测试表格生成](../../../data-query/test-scheme-design.md)
`emloyees`表的具体信息如下：
该表主要用于存储员工的基本信息

| 字段名        | 类型          | 含义                                  |
|--------------|---------------|---------------------------------------|
| employee_id    | int(6)      | 员工的唯一标识        |
| first_name     | varchar(20) | 员工的首名                              |
| last_name      | varchar(25) | 员工的末名                                |
| email          | varchar(25) | 员工的邮件地址                            |
| phone_number   | varchar(20) | 员工的电话号码  |  
| hire_date      | date        | 员工的雇佣日期  |     
| job_id         | varchar(10) | 员工的工作类型标识  | 
| salary         | double(8,2) | 员工的薪水|     
| commission_pct | double(2,2) | 员工的佣金提成  |     
| manager_id     | int(6)      | 员工的主管人员标识 | 
| department_id  | int(4)      | 员工所在的部门标识(关联至[departments](#departments表)) |

* 按部门ID对员工进行分组，并计算每个部门的平均薪资和总薪资，以及所有部门的总薪资：
```sql
SELECT department_id, AVG(salary) AS avg_salary, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id WITH ROLLUP;
```
查询结果如下：
```
+---------------+--------------+--------------+
| department_id | avg_salary   | total_salary |
+---------------+--------------+--------------+
|          NULL |  7000.000000 |      7000.00 |
|            10 |  4400.000000 |      4400.00 |
|            20 |  9500.000000 |     19000.00 |
|            30 |  4150.000000 |     24900.00 |
|            40 |  6500.000000 |      6500.00 |
|            50 |  3475.555556 |    156400.00 |
|            60 |  5760.000000 |     28800.00 |
|            70 | 10000.000000 |     10000.00 |
|            80 |  8955.882353 |    304500.00 |
|            90 | 19333.333333 |     58000.00 |
|           100 |  8600.000000 |     51600.00 |
|           110 | 10150.000000 |     20300.00 |
|          NULL |  6461.682243 |    691400.00 |
+---------------+--------------+--------------+
13 rows in set (0.078 sec)
```
* 按入职年份对员工进行分组，并计算每个年份的员工数量和总薪资，以及所有年份的总薪资：
```sql
SELECT YEAR(hire_date) AS hire_year, COUNT(*) AS emp_count, SUM(salary) AS total_salary
FROM employees
GROUP BY YEAR(hire_date) WITH ROLLUP;
```
输出结果如下：
```
+-----------+-----------+--------------+
| hire_year | emp_count | total_salary |
+-----------+-----------+--------------+
|      1987 |         2 |     28400.00 |
|      1989 |         1 |     17000.00 |
|      1990 |         1 |      9000.00 |
|      1991 |         1 |      6000.00 |
|      1993 |         1 |     17000.00 |
|      1994 |         7 |     68800.00 |
|      1995 |         4 |     18100.00 |
|      1996 |        10 |     86000.00 |
|      1997 |        28 |    180900.00 |
|      1998 |        23 |    112100.00 |
|      1999 |        18 |     88900.00 |
|      2000 |        11 |     59200.00 |
|      NULL |       107 |    691400.00 |
+-----------+-----------+--------------+
13 rows in set (0.006 sec)
```
* 按职位ID和部门ID对员工进行分组，并计算每个职位在每个部门的员工数量和总薪资，以及所有职位和所有部门的总薪资：

```sql
SELECT job_id, department_id, COUNT(*) AS emp_count, SUM(salary) AS total_salary
FROM employees
GROUP BY job_id, department_id WITH ROLLUP;
```
输出结果如下：
```
+------------+---------------+-----------+--------------+
| job_id     | department_id | emp_count | total_salary |
+------------+---------------+-----------+--------------+
| AC_ACCOUNT |           110 |         1 |      8300.00 |
| AC_ACCOUNT |          NULL |         1 |      8300.00 |
| AC_MGR     |           110 |         1 |     12000.00 |
| AC_MGR     |          NULL |         1 |     12000.00 |
| AD_ASST    |            10 |         1 |      4400.00 |
...
| ST_CLERK   |            50 |        20 |     55700.00 |
| ST_CLERK   |          NULL |        20 |     55700.00 |
| ST_MAN     |            50 |         5 |     36400.00 |
| ST_MAN     |          NULL |         5 |     36400.00 |
| NULL       |          NULL |       107 |    691400.00 |
+------------+---------------+-----------+--------------+
40 rows in set (0.013 sec)
```
这些查询使用`WITH ROLLUP`关键字来添加汇总行，并对不同的分组进行聚合计算，可以方便用户进行数据分析和报表制作。

>**注意**
>不能在使用WITH ROLLUP的同时使用ORDER BY子句进行排序。虽然可以使用ASC或DESC子句对GROUP BY列进行排序，但超级聚合行总是会被添加到结果集的末尾。
>

## MySQL 兼容性
`SELECT WITH ROLLUP`语句与 MySQL 8.0 的“SELECT WITH ROLLUP”功能完全兼容

更多详情，请参考[mariadb:SELECT WITH ROLLUP](https://mariadb.com/kb/en/select-with-rollup/)