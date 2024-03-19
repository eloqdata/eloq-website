---
title: 基本SQL操作
summary: 介绍EloqSQL中的基本查询功能
sidebar_position: 1
---

# 基本查询

在这个章节当中，将开始介绍如何使用 SQL 来对数据库中的数据进行基本的查询操作。

## 准备工作

在阅读本章之前，你需要做以下准备工作：

1.  构建 EloqSQL 集群（可使用[单节点构建](../quick-start.md)或[多节点构建](../cluster-deployment.md)）
2.  [导入或创建相应的测试数据表](./test-scheme-design.md)

## 基础查询

EloqSQL 基于 MySQL 开发，所以支持 MySQL 提供的标准 SELECT 语句做查询，包括利用 WHERE,GROUP Y,ORDER BY,LIMIT 等进行数据的筛选、排序，限制查询结果数量等复杂命令。
通过我们提供的数据库创建示例，可以创建`mono`数据库以及相应的数据表，其中创建的数据表`employees`存放了公司员工的一些基本信息，可以通过 `SELECT ... FROM ...` 查看相应数据表的所有数据信息。
通过 MySQL Client 或者 Mysql shell 中终端连接到数据库后，输入相应的命令

```sql
SELECT employee_id, first_name FROM employees;
```

输出的结果如下：

```
+-------------+-------------+
| employee_id | first_name  |
+-------------+-------------+
|         100 | Steven      |
|         101 | Neena       |
|         102 | Lex         |
|         103 | Alexander   |
...
|         203 | Susan       |
|         204 | Hermann     |
|         205 | Shelley     |
|         206 | William     |
+-------------+-------------+
107 rows in set (0.002 sec)
```

## 结果筛选

在某些数据表中，存在着大量的数据，如果全部都查询出来，数据量非常多，并且有些数据用户并不需要，这时候可以通过`where`语句对查询的结果进行过滤，从而找到想要查询的部分。
例如，我想找到`first_name`是`Nandita`的人的所有信息
可以使用 `WHERE` 子句添加筛选的条件：

```sql
SELECT * FROM employees WHERE first_name = 'Nandita';
```

输出的结果如下：

```
+-------------+------------+-----------+----------+--------------+------------+----------+---------+----------------+------------+---------------+
| employee_id | first_name | last_name | email    | phone_number | hire_date  | job_id   | salary  | commission_pct | manager_id | department_id |
+-------------+------------+-----------+----------+--------------+------------+----------+---------+----------------+------------+---------------+
|         184 | Nandita    | Sarchand  | NSARCHAN | 650.509.1876 | 1996-01-27 | SH_CLERK | 4200.00 |           NULL |        121 |            50 |
+-------------+------------+-----------+----------+--------------+------------+----------+---------+----------------+------------+---------------+
1 row in set (0.004 sec)
```

## 结果排序

在某些引用场景下，我们需要对数据表的某些信息做一下排序，知道相应数据的最大值是多少，最小值是多少。这时可以利用`ORDER BY` 语句可以让查询结果按照期望的方式进行排序。

例如，可以使用如下的 SQL 语句对 `employees` 表的数据按照 `salary` 列进行降序 (`DESC`) 排序，从而得到收入最少的员工列表。

```sql
SELECT employee_id, first_name, salary
FROM employees
ORDER BY salary DESC;
```

输出的结果如下：

```
+-------------+-------------+----------+
| employee_id | first_name  | salary   |
+-------------+-------------+----------+
|         100 | Steven      | 24000.00 |
|         101 | Neena       | 17000.00 |
|         102 | Lex         | 17000.00 |
|         145 | John        | 14000.00 |
|         146 | Karen       | 13500.00 |
|         201 | Michael     | 13000.00 |
|         205 | Shelley     | 12000.00 |
|         108 | Nancy       | 12000.00 |
...
|         131 | James       |  2500.00 |
|         191 | Randall     |  2500.00 |
|         140 | Joshua      |  2500.00 |
|         182 | Martha      |  2500.00 |
|         135 | Ki          |  2400.00 |
|         127 | James       |  2400.00 |
|         128 | Steven      |  2200.00 |
|         136 | Hazel       |  2200.00 |
|         132 | TJ          |  2100.00 |
+-------------+-------------+----------+
107 rows in set (0.007 sec)
```

## 自定义查询数量

如果用户希望在查询的时候只返回部分结果，可以使用 `LIMIT` 语句限制查询结果返回的记录数。

```sql
SELECT employee_id, first_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 10;
```

查询结果如下：

```
+-------------+------------+----------+
| employee_id | first_name | salary   |
+-------------+------------+----------+
|         100 | Steven     | 24000.00 |
|         101 | Neena      | 17000.00 |
|         102 | Lex        | 17000.00 |
|         145 | John       | 14000.00 |
|         146 | Karen      | 13500.00 |
|         201 | Michael    | 13000.00 |
|         205 | Shelley    | 12000.00 |
|         108 | Nancy      | 12000.00 |
|         147 | Alberto    | 12000.00 |
|         168 | Lisa       | 11500.00 |
+-------------+------------+----------+
10 rows in set (0.001 sec)
```

通过观察查询结果你会发现，在使用 `LIMIT` 语句之后，查询的时间明显缩短，这是因为 EloqSQL 对 `LIMIT` 子句做了相应的优化。

## 分组聚合查询

用户在实际查询的时候可能需要关注数据的整体情况，这个时候需要对数据进行聚合处理，使得用户可以按照某个指标关注数据的整体情况，来获得对数据的一个整体了解，这时候可以通过`GROUP BY`命令配合聚合函数，来达到对数据的一个整体了解

例如，想要知道那个部门的员工数量比较多，可以将作家基本信息按照`department_id`列进行分组，然后分别统计在不同部门的员工数：

```sql
SELECT department_id, COUNT(DISTINCT employee_id) AS employee_count
FROM employees
GROUP BY department_id
ORDER BY employee_count DESC;
```

查询结果如下：

```
+---------------+----------------+
| department_id | employee_count |
+---------------+----------------+
|            50 |             45 |
|            80 |             34 |
|           100 |              6 |
|            30 |              6 |
|            60 |              5 |
|            90 |              3 |
|           110 |              2 |
|            20 |              2 |
|          NULL |              1 |
|            10 |              1 |
|            40 |              1 |
|            70 |              1 |
+---------------+----------------+
12 rows in set (0.038 sec)
```

> **注意：**
> 使用 GROUP BY 子句按列进行分组，对于非分组列需要使用聚集函数：

### Eloq 支持的聚合函数

| 函数名                                                                                                             | 功能描述             |
| :----------------------------------------------------------------------------------------------------------------- | :------------------- |
| [`COUNT()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_count)                       | 返回检索到的行的数目 |
| [`COUNT(DISTINCT)`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_count-distinct)      | 返回不同值的数目     |
| [`SUM()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_sum)                           | 返回和               |
| [`AVG()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_avg)                           | 返回平均值           |
| [`MAX()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_max)                           | 返回最大值           |
| [`MIN()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_min)                           | 返回最小值           |
| [`GROUP_CONCAT()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_group-concat)         | 返回连接的字符串     |
| [`VARIANCE()`，`VAR_POP()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_var-pop)     | 返回总体标准方差     |
| [`STD()`，`STDDEV()`，`STDDEV_POP`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_std) | 返回总体标准差       |
| [`VAR_SAMP()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_var-samp)                 | 返回采样方差         |
| [`STDDEV_SAMP()`](https://dev.mysql.com/doc/refman/5.7/en/aggregate-functions.html#function_stddev-samp)           | 返回采样标准方差     |

## 多表连接

很多时候，我们需要的数据同时存放在多个表中，这个时候我们需要使用`JOIN`命令进行多表连接的操作使得两张或多张表的数据组合在一起，展现出来。Eloq 支持基本的内连接`INNER JOIN`，左外连接`LEFT OUTER JOIN`以及右外连接`RIGHT OUTER JOIN`

例如，想要知道每个员工的所在具体部门信息，而不仅仅是部门编号，需要将员工表`employees`与部门表`departments`进行连接，在下面的 SQL 语句中，通过`JOIN`声明要将左表`employees`和右表`departments`的数据行以内连接的方式进行连接，连接条件为`employees.department_id=departments.department_id`。

```sql
SELECT e.employee_id,e.first_name,d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
LIMIT 10;
```
