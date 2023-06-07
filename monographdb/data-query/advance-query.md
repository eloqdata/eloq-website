---
title: Advanced SQL Operations
summary: Introduces advanced query functions in MonographDB
sidebar_position: 2
---
# Advanced Search
This chapter mainly introduces the advanced query functions provided by Monograph, such as subqueries and inline views, JSON functions, window functions (OVER), CTE (Common Table Expression), ordered Aggregate functions and common time series functions.

The following takes a company's daily sales of various products in 2022 as an example to demonstrate how to perform advanced queries in Monograph.

## Create a sample table sales
In the sample table sales, we design the product name, sales of the day and other fields of the sales table, and insert 500 pieces of test data into it, using the Monograph storage engine.
```sql
CREATE TABLE sales (
   id INT PRIMARY KEY,
   product VARCHAR(50),
   date DATE,
   price DECIMAL(10,2),
)ENGINE=MONOGRAPH DEFAULT CHARSET=utf8;

INSERT INTO sales (id, product, date, price)
SELECT seq, CONCAT('Product ', FLOOR(RAND() * 10) + 1), DATE_ADD('2022-01-01', INTERVAL FLOOR(RAND() * 365) DAY), ROUND(RAND() * 10000 , 2)+1000
FROM seq_1_to_500;
```
## subquery
A subquery is a SQL query nested within another SQL query to retrieve data from the database. Subqueries are often used to perform more complex filters, calculations, and aggregations on query results.
The main functions of subqueries are:
    * Filter data: You can use a subquery as a filter condition in the `WHERE` clause to filter data based on the results of the subquery.
    * Calculated data: You can use subqueries in the `SELECT` statement to calculate data.
    * Aggregated data: You can use subqueries to calculate aggregated data
For example, if we want to know the sales of the products with the highest sales in each quarter in 2022, we can use the following subquery statement:
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
This statement first uses a subquery to query the name of the product with the highest total sales, and then uses the `WHERE` clause in the main query to filter out the sales records of this product. Use the `QUARTER()` function to convert the sales dates to quarters, then use the `GROUP BY` clause to group by product and quarter. Finally, use the `SUM()` function to calculate the sales of each quarter, and display the results by product and quarter.
The query results are as follows:
```
+-----------+---------+-------------+
| product | quarter | total_sales |
+-----------+---------+-------------+
| Product 8 | 1 | 79258.91 |
| Product 8 | 2 | 101168.19 |
| Product 8 | 3 | 92699.46 |
| Product 8 | 4 | 86234.08 |
+-----------+---------+-------------+
4 rows in set (0.013 sec)
```

## Inline view
Inline View (Inline View), also known as derived table or subquery table, is a virtual table defined in the `FROM` clause, and its result set can be used as a table. Inline views are often used to simplify complex queries, decompose a complex query into multiple simple queries, and improve query efficiency and readability.
The main functions of inline views are:
    * Filter data: You can use the inline view as a filter condition to filter out eligible data.
    * Calculated data: You can use inline views to perform data calculations in queries.
    * Join data: multiple tables can be joined using inline views.

Similarly, if we want to query the sales data of the products with the highest sales in each quarter in 2022, using the inline view, we can use the following SQL statement
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
The query results are as follows:
```
+-----------+---------+-------------+
| product | quarter | total_sales |
+-----------+---------+-------------+
| Product 8 | 1 | 79258.91 |
| Product 8 | 2 | 101168.19 |
| Product 8 | 3 | 92699.46 |
| Product 8 | 4 | 86234.08 |
+-----------+---------+-------------+
```

>Inline View (Inline View) and subquery (Subquery) are both ways of nesting queries within queries, but there are some differences between them.
>* The syntax structure is different: an inline view defines a virtual table in the FROM clause, while a subquery defines a nested query in the SELECT, WHERE, HAVING or IN clause.
>* The execution order is different: the inline view is calculated when the query starts to execute, and is used as a virtual table for subsequent queries, while the subquery is calculated when the outer query is executed, and a temporary table is generated .
>* Different usage scenarios: Inline views are usually used in scenarios such as connecting multiple tables, filtering out eligible data, and calculating data, while subqueries are usually used in scenarios such as comparison, existence check, and IN clause.
>* The performance is different: Since the inline view is a pre-calculated result set, it can improve the performance of the query in some cases, while the subquery needs to be calculated every time it is queried, which may affect the performance of the query.
In practical applications, an appropriate method should be selected according to the specific query requirements and data scale to realize the query.
## window function
Window Function in SQL is a special function that can perform operations such as grouping, sorting, and summarizing query results without changing the number of rows and content of the original data. Window functions can be used in the `SELECT` statement, and are usually used to calculate statistical indicators such as ranking, accumulation, and moving average.
The window function can be aggregate functions such as `SUM`, `AVG`, `COUNT`, `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`, or `LEAD`, `LAG`, `FIRST_VALUE`, Window functions such as `LAST_VALUE`. Window functions must use the `OVER` keyword and specify the window to which the window function belongs.
The window of the window function can use the `PARTITION BY` clause to specify the grouping column, which is used to divide the data into several groups, and then perform calculations in each group. The window can also use the `ORDER BY` clause to specify a sort column, which is used to sort the data in each group for ranking, accumulation and other operations. The window can also use the `ROWS`, `RANGE` or `GROUPS` clauses to specify the size and type of the window, which is used to control the calculation range of the window.
For example, if a user wants to query the total sales amount of each date and the cumulative sales amount up to that date from the sales table sales, the following SQL statement can be used
  1. Calculate the cumulative sum
The target cumulative sum can be calculated by using the `SUM` function with the `OVER` clause.
```sql
SELECT
   date,
   SUM(price) AS daily_sales,
   SUM(SUM(price)) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_sales
FROM sales
GROUP BY date
ORDER BY date;
```
This query uses the window functions SUM() OVER() to calculate the total cumulative sales. The `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` clause specifies the window range such that each row will calculate the cumulative sales total as of the current date.
The query results are as follows:
```
+------------+-------------+------------------+
| date | daily_sales | cumulative_sales |
+------------+-------------+------------------+
| 2022-01-02 | 9643.40 | 9643.40 |
| 2022-01-04 | 10252.92 | 19896.32 |
| 2022-01-05 | 11342.11 | 31238.43 |
| 2022-01-06 | 17028.10 | 48266.53 |
| 2022-01-07 | 23855.96 | 72122.49 |
| 2022-01-09 | 13743.68 | 85866.17 |
| 2022-01-11 | 27064.90 | 112931.07 |
| 2022-01-12 | 1860.01 | 114791.08 |
...
| 2022-12-29 | 4908.32 | 2996176.53 |
| 2022-12-30 | 14251.00 | 3010427.53 |
| 2022-12-31 | 14062.42 | 3024489.95 |
+------------+-------------+------------------+
274 rows in set (0.008 sec)
```
2. Average calculation
The average value of the specified records can be calculated by using the `AVG` function with the `OVER` clause.
For example, if a user wants to query the daily average sales of each product in the last quarter, the following SQL statement can be used.
```sql
SELECT product, AVG(price) OVER (PARTITION BY product) AS avg_price
FROM sales
WHERE date >= '2022-10-01' AND date <= '2022-12-31'
GROUP BY product;
```
Assuming that the last quarter is the fourth quarter of the current year, you can use the following SQL statement to query the average sales of each product in the last quarter (that is, from October to December):

```
SELECT product, AVG(price) OVER (PARTITION BY product) AS avg_price
FROM sales
WHERE date >= '2022-10-01' AND date <= '2022-12-31'
GROUP BY product;
```
Use the `SELECT` statement to query the product and avg_price fields, where the avg_price field uses the `AVG` and `OVER` functions to calculate the average sales of each product. Use the `FROM` statement to specify that the query table is sales. Use the `WHERE` clause to limit the date range of the query to the fourth quarter of 2023 (i.e. October to December). Use the `PARTITION BY` clause to group the data by product name, which is used to calculate the average sales for each product. Use the `GROUP BY` clause to group by product name.
The query results are as follows:
```
+------------+--------------+
| product | avg_price |
+------------+--------------+
| Product 1 | 3639.290000 |
| Product 10 | 4364.920000 |
| Product 2 | 2849.690000 |
| Product 3 | 10124.030000 |
| Product 4 | 2376.010000 |
| Product 5 | 5921.290000 |
| Product 6 | 9728.060000 |
| Product 7 | 9479.350000 |
| Product 8 | 6963.210000 |
| Product 9 | 5747.370000 |
+------------+--------------+
10 rows in set (0.004 sec)
```

## CTE Common Table Expression
CTE (Common Table Expression) stands for common expression. CTE (Common Table Expression) is a way to define temporary result sets in SQL. Its functions mainly include the following aspects:
* Improve readability: CTE can decompose complex SQL queries into multiple simple steps, improving the readability and maintainability of query statements.
* Reduce double calculation: The result set in CTE can be referenced multiple times in subsequent queries, avoiding double calculation and improving execution efficiency.
* Support recursive query: CTE can also support recursive query, that is, to query data through its own relationship definition in a table, such as querying the hierarchical structure of an organization or calculating the Fibonacci sequence, etc.
* Optimize query: CTE can also be used in combination with other query optimization techniques (such as index, aggregate function, window function, etc.) to improve query efficiency.
In SQL, CTEs are usually defined using the WITH keyword.
For example, if a user wants to query the total sales of each product in the sales table and sort the sales from high to low, the following SQL statement can be used
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
One CTE is used in this query, product_sales. This CTE contains an aggregation query that calculates the total sales for each product. The main query then selects the product and total sales from the CTE and sorts by total sales from highest to lowest.
The query results are as follows:
```
+------------+-------------+
| product | total_sales |
+------------+-------------+
| Product 8 | 359360.64 |
| Product 9 | 357930.75 |
| Product 2 | 340956.38 |
| Product 6 | 337142.04 |
| Product 10 | 323411.56 |
| Product 1 | 299035.24 |
| Product 4 | 269361.65 |
| Product 7 | 256186.60 |
| Product 3 | 245795.32 |
| Product 5 | 235309.77 |
+------------+-------------+
10 rows in set (0.008 sec)
```
## Timing function
MonographDB supports many timing functions, such as the most basic `NOW()`, `DATE()`, `TIME()`, `DATE_ADD()`, etc. In addition, MonographDB also supports some advanced timing analysis functions.
1. `FIRST_VALUE`/ `LAST_VALUE`
Use `FIRST_VALUE` to find the price of each product on the first day
```sql
SELECT DISTINCT
     product,
     FIRST_VALUE(price) OVER (PARTITION BY product ORDER BY date) AS first_day_price
FROM
     sales;
```
Use `LAST_VALUE` to find the last day's price for each product
```sql
SELECT DISTINCT
     product,
     LAST_VALUE(price) OVER (PARTITION BY product ORDER BY date) AS first_day_price
FROM
     sales;
```