---
title: 高级SQL操作
summary: 介绍MonographDB中的高级查询功能
sidebar_position: 2
---

# 高级查询

本章主要介绍除了基本的多表连接、聚合以及分组查询之外，Monograph 提供的高级查询函数，比如子查询和内联视图、JSON 函数、窗口函数（OVER）、CTE（Common Table Expression）、有序聚合函数以及常用时序函数。

下面以一个公司 2022 年每天各种产品的销售额为例，演示如何在 Monograph 中进行高级查询。

## 创建示例表 sales

在示例表 sales 中，我们设计了销售表的产品名称、当天销售额等字段，并且向其中插入 500 条测试数据，使用 Monograph 存储引擎。

```sql
CREATE TABLE sales (
  id INT PRIMARY KEY,
  product VARCHAR(50),
  date DATE,
  price DECIMAL(10,2),
)ENGINE=MONOGRAPH DEFAULT CHARSET=utf8;

INSERT INTO sales (id, product, date, price)
SELECT seq, CONCAT('Product ', FLOOR(RAND() * 10) + 1), DATE_ADD('2022-01-01', INTERVAL FLOOR(RAND() * 365) DAY), ROUND(RAND() * 10000, 2)+1000
FROM seq_1_to_500;
```

## 子查询

子查询是指在一个 SQL 查询中嵌套另一个 SQL 查询，用于从数据库中检索数据。子查询通常用于在查询结果中执行更复杂的过滤条件、计算和聚合操作。
子查询的主要作用有：

- 过滤数据：可以使用子查询作为`WHERE`子句中的过滤条件，从而根据子查询的结果过滤数据。
- 计算数据：可以在`SELECT`语句中使用子查询来计算数据。
- 聚合数据：可以使用子查询来计算汇总数据
  例如，我们想知道 2022 年当中销售额最高的产品在每个季度的销售额，可以使用如下的子查询语句：

```sql
SELECT product,
       QUARTER(date) AS quarter,
       SUM(price) AS total_sales
FROM sales
WHERE product = (SELECT product
                 FROM sales
                 GROUP BY product
                 ORDER BY SUM(price) DESC
                 LIMIT 1)
GROUP BY product, quarter;
```

该语句首先使用子查询查询出总销售额最高的产品名称，然后在主查询中使用`WHERE`子句筛选出该产品的销售记录。使用`QUARTER()`函数将销售日期转换为季度，然后使用`GROUP BY`子句按照产品和季度进行分组。最后使用`SUM()`函数计算每个季度的销售额，并将结果按照产品和季度进行展示。
查询结果如下：

```
+-----------+---------+-------------+
| product   | quarter | total_sales |
+-----------+---------+-------------+
| Product 8 |       1 |    79258.91 |
| Product 8 |       2 |   101168.19 |
| Product 8 |       3 |    92699.46 |
| Product 8 |       4 |    86234.08 |
+-----------+---------+-------------+
4 rows in set (0.013 sec)
```

## 内联视图

内联视图（Inline View），也称为派生表或子查询表，是在`FROM`子句中定义的一种虚拟表，它的结果集可以作为一个表格使用。内联视图常常用于简化复杂的查询，将一个复杂查询分解为多个简单查询，提高查询效率和可读性。
内联视图的主要作用有：

- 筛选数据：可以使用内联视图作为过滤条件，从而筛选出符合条件的数据。
- 计算数据：可以使用内联视图在查询中进行数据计算。
- 连接数据：可以使用内联视图将多个表格连接起来。

同样的，我们如果想实现 2022 年当中销售额最高的产品在每个季度的销售额的数据的查询，使用内联视图，可以采用如下的的 SQL 语句

```sql
SELECT product,
       quarter,
       SUM(price) AS total_sales
FROM (
  SELECT product,
         QUARTER(date) AS quarter,
         price
  FROM sales
) AS sales_by_quarter
WHERE product = (SELECT product
                 FROM sales
                 GROUP BY product
                 ORDER BY SUM(price) DESC
                 LIMIT 1)
GROUP BY product, quarter;
```

查询结果如下：

```
+-----------+---------+-------------+
| product   | quarter | total_sales |
+-----------+---------+-------------+
| Product 8 |       1 |    79258.91 |
| Product 8 |       2 |   101168.19 |
| Product 8 |       3 |    92699.46 |
| Product 8 |       4 |    86234.08 |
+-----------+---------+-------------+
```

> 内联视图（Inline View）和子查询（Subquery）都是在查询中嵌套查询的方式，但它们之间有一些区别。
>
> - 语法结构不同：内联视图是在 FROM 子句中定义一个虚拟表格，而子查询则是在 SELECT、WHERE、HAVING 或 IN 子句中定义一个嵌套查询。
> - 执行顺序不同：内联视图是在查询开始执行时就被计算出结果集，并作为一个虚拟表格供后续查询使用，而子查询是在外层查询执行时才会进行计算，产生一个临时表格。
> - 使用场景不同：内联视图通常用于连接多个表格、筛选出符合条件的数据、计算数据等场景，而子查询通常用于比较、存在性检查、IN 子句中等场景。
> - 性能表现不同：由于内联视图是预先计算出结果集，因此在某些情况下可以提高查询的性能，而子查询则需要在每次查询时进行计算，可能会影响查询的性能。
>   在实际应用中，应根据具体的查询需求和数据规模选择合适的方式来实现查询。

## 窗口函数

SQL 中的窗口函数（Window Function）是一种特殊的函数，它可以对查询结果进行分组、排序、汇总等操作，而不会改变原始数据的行数和内容。窗口函数可以在`SELECT`语句中使用，通常用于计算排名、累计、移动平均等统计指标。
窗口函数可以是`SUM`、`AVG`、`COUNT`、`ROW_NUMBER`、`RANK`、`DENSE_RANK`、`NTILE`等聚合函数，也可以是`LEAD`、`LAG`、`FIRST_VALUE`、`LAST_VALUE`等窗口函数。窗口函数必须使用`OVER` 关键字，并指定窗口函数所属的窗口。
窗口函数的窗口可以使用`PARTITION BY`子句指定分组列，用于将数据划分为若干个分组，然后在每个分组内进行计算。窗口还可以使用`ORDER BY`子句指定排序列，用于对每个分组内的数据进行排序，以便进行排名、累计等操作。窗口还可以使用 `ROWS`、`RANGE` 或`GROUPS`子句指定窗口的大小和类型，用于控制窗口的计算范围。
例如用户想从销售表 sales 中查询到每个日期的销售总额以及截至该日期的累积销售总额，可以使用如下 SQL 语句

1.  计算累积和
    通过`SUM`函数与`OVER`字句连用，可以计算目标累积和。

```sql
SELECT
  date,
  SUM(price) AS daily_sales,
  SUM(SUM(price)) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_sales
FROM sales
GROUP BY date
ORDER BY date;
```

这个查询使用了窗口函数 SUM() OVER() 来计算累积销售总额。`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`子句指定了窗口范围，使得每一行都会计算截至当前日期的累积销售总额。
查询结果如下：

```
+------------+-------------+------------------+
| date       | daily_sales | cumulative_sales |
+------------+-------------+------------------+
| 2022-01-02 |     9643.40 |          9643.40 |
| 2022-01-04 |    10252.92 |         19896.32 |
| 2022-01-05 |    11342.11 |         31238.43 |
| 2022-01-06 |    17028.10 |         48266.53 |
| 2022-01-07 |    23855.96 |         72122.49 |
| 2022-01-09 |    13743.68 |         85866.17 |
| 2022-01-11 |    27064.90 |        112931.07 |
| 2022-01-12 |     1860.01 |        114791.08 |
...
| 2022-12-29 |     4908.32 |       2996176.53 |
| 2022-12-30 |    14251.00 |       3010427.53 |
| 2022-12-31 |    14062.42 |       3024489.95 |
+------------+-------------+------------------+
274 rows in set (0.008 sec)
```

2. 平均值计算
   通过`AVG`函数与`OVER`字句连用，可以计算指定记录的平均值。
   例如，用户想要查询最后一季度各个产品每天的平均销售额，可以使用如下的 SQL 语句。

```sql
SELECT product, AVG(price) OVER (PARTITION BY product) AS avg_price
FROM sales
WHERE date >= '2022-10-01' AND date <= '2022-12-31'
GROUP BY product;
```

假设最后一季度为当年的第四季度，可以使用以下 SQL 语句查询最后一季度（即 10 月至 12 月）每个产品的平均销售额：

```
SELECT product, AVG(price) OVER (PARTITION BY product) AS avg_price
FROM sales
WHERE date >= '2022-10-01' AND date <= '2022-12-31'
GROUP BY product;
```

使用`SELECT`语句查询 product 和 avg_price 字段，其中 avg_price 字段使用`AVG`和`OVER`函数计算每个产品的平均销售额。使用`FROM`语句指定查询的表格为 sales。使用`WHERE`语句限制查询的日期范围为 2023 年的第四季度（即 10 月至 12 月）。使用`PARTITION BY`子句将数据按产品名称分组，用于计算每个产品的平均销售额。使用 `GROUP BY`子句按产品名称分组。
查询结果如下：

```
+------------+--------------+
| product    | avg_price    |
+------------+--------------+
| Product 1  |  3639.290000 |
| Product 10 |  4364.920000 |
| Product 2  |  2849.690000 |
| Product 3  | 10124.030000 |
| Product 4  |  2376.010000 |
| Product 5  |  5921.290000 |
| Product 6  |  9728.060000 |
| Product 7  |  9479.350000 |
| Product 8  |  6963.210000 |
| Product 9  |  5747.370000 |
+------------+--------------+
10 rows in set (0.004 sec)
```

## CTE 通用表表达式

CTE（Comman Table Expression）代表通用表达式，CTE（Common Table Expression）是一种在 SQL 中定义临时结果集的方式，其作用主要有以下几个方面：

- 提高可读性：CTE 可以将复杂的 SQL 查询分解成多个简单的步骤，提高查询语句的可读性和可维护性。
- 减少重复计算：CTE 中的结果集可以在后续的查询中被多次引用，避免了重复计算，提高了执行效率。
- 支持递归查询：CTE 还可以支持递归查询，即在一个表格中通过自身的关系定义来查询数据，比如查询组织机构的层级结构或者计算斐波那契数列等。
- 优化查询：CTE 还可以与其他查询优化技术（如索引、聚集函数、窗口函数等）结合使用，提高查询效率。
  在 SQL 中，CTE 通常使用 WITH 关键字来定义。
  例如用户想要将 sales 表中每个产品的总销售额查询出来，并按照销售额从高到低进行排序，可以使用如下的 SQL 语句

```sql
WITH product_sales AS (
  SELECT product, SUM(price) AS total_sales
  FROM sales
  GROUP BY product
)
SELECT product, total_sales
FROM product_sales
ORDER BY total_sales DESC;
```

这个查询中使用了一个 CTE，即 product_sales。该 CTE 包含一个聚合查询，用于计算每个产品的总销售额。然后，主查询从 CTE 中选择产品和总销售额，并按照总销售额从高到低进行排序。
查询结果如下：

```
+------------+-------------+
| product    | total_sales |
+------------+-------------+
| Product 8  |   359360.64 |
| Product 9  |   357930.75 |
| Product 2  |   340956.38 |
| Product 6  |   337142.04 |
| Product 10 |   323411.56 |
| Product 1  |   299035.24 |
| Product 4  |   269361.65 |
| Product 7  |   256186.60 |
| Product 3  |   245795.32 |
| Product 5  |   235309.77 |
+------------+-------------+
10 rows in set (0.008 sec)
```

## 时序函数

MonographDB 支持许多时序函数，例如最基本的`NOW()`、`DATE()`、`TIME()`、`DATE_ADD()`等等，除此之外 MonographDB 还支持一些高级的时序分析函数。

1. `FIRST_VALUE`/ `LAST_VALUE`
   使用`FIRST_VALUE`来查找每种产品第一天的价格

```sql
SELECT DISTINCT
    product,
    FIRST_VALUE(price) OVER (PARTITION BY product ORDER BY date) AS first_day_price
FROM
    sales;
```

使用`LAST_VALUE`查找每种产品最后天的价格

```sql
SELECT DISTINCT
    product,
    LAST_VALUE(price) OVER (PARTITION BY product ORDER BY date) AS first_day_price
FROM
    sales;
```
