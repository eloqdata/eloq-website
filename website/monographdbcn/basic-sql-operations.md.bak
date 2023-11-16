---
title: SQL 基本操作
aliases: ['/cn/basic-sql-operations/','/cn/how-to/get-started/explore-sql/']
---
# SQL 基本操作
成功部署MonographDB集群之后，便可以连接数据库执行相应的SQL语句。由于MonographDB兼容MySQL，用户可以使用MySQL客户端连接MonograhDB，并且可以直接执行相应的SQL语句（**注意**：部分Mysql语句不支持，具体可见[与Mysql兼容性对比](./mysql-compatibility.md)

## 分类

SQL 语言的功能通常分为以下四个部分：

- 数据定义语言（DDL）：用于定义数据库对象，如库、表、视图和索引等。
- 数据操作语言（DML）：用于操作与业务相关的记录。
- 数据查询语言（DQL）：用于查询经过条件筛选的记录。
- 数据控制语言（DCL）：用于定义访问权限和安全级别。
常见的 DDL 功能包括创建、修改和删除对象（如表、索引等），对应的命令是 CREATE、ALTER 和 DROP。

## 查看、创建和删除数据库
MonographDB中的数据库与MySQL语境中定义的基本一致，Database（数据库）可以被定义为一个由表、索引以及其他相关对象组成的集合。

* 使用 `SHOW DATABASES` 语句查看系统中数据库列表：


```sql
SHOW DATABASES;
```

* 使用名为 `mysql` 的数据库，mysql数据库是MySQL系统数据库之一，它在MySQL服务器安装过程中会自动生成。mysql数据库中保存着MySQL服务器的系统信息和元数据，用于管理和维护MySQL服务器的各种配置和状态信息。：

```sql
USE mysql;
```

使用 `SHOW TABLES` 语句查看数据库中的所有表。例如：

```sql
SHOW TABLES FROM mysql;
```

使用 `CREATE DATABASE` 语句创建数据库。语法如下：

```sql
CREATE DATABASE db_name [options];
```

例如，要创建一个名为 `mono` 的数据库，可使用以下语句：

```sql
CREATE DATABASE IF NOT EXISTS mono;
```

在SQL中，`IF NOT EXISTS`是一种条件语句，用于在执行`CREATE TABLE`、`CREATE INDEX`等DDL语句时，判断是否已经存在同名的表或索引，从而避免出现重复创建对象的错误

使用 `DROP DATABASE` 语句删除数据库。例如：

```sql
DROP DATABASE mono;
```
>**注意**
>
>数据库删除后，其中所有的表、视图、存储过程、触发器、事件等对象都将被永久删除，因此在执行DROP DATABASE语句之前，应该先备份所有重要的数据。
>
## 创建、查看和删除表

使用 `CREATE TABLE` 语句创建表。语法如下：

```sql
CREATE TABLE table_name (
   column1 datatype constraint,
   column2 datatype constraint,
   column3 datatype constraint,
   ...
   PRIMARY KEY (one or more columns)
);
```

以下是一个示例，用于创建一个名为"students"的表，包含id、name、age和gender四个列：

```sql
CREATE TABLE students (
   id INT ,
   name VARCHAR(50) ,
   age INT CHECK (age >= 18 AND age <= 60),
   gender ENUM('Male', 'Female')
);
```
上述示例中，age列必须大于等于18岁且小于等于60岁，gender列的取值必须为'Male'或'Female'。

使用 `SHOW CREATE` 或者`DESC`语句查看表结构，即 DDL。例如：

```sql
SHOW CREATE TABLE students;
DESC students;
```
`SHOW CREATE`和`DESC`都是SQL中用于查看表结构的命令，但它们的作用和输出结果有所不同：

* SHOW CREATE语句用于查询指定表的创建语句，即查看创建该表的SQL语句。它可以显示表的所有结构信息，包括表的名称、列名、数据类型、约束条件等。输出结果是一个包含创建表的完整语句的字符串。
* DESC命令用于查询表的列信息，即查看指定表的列名、数据类型、默认值、约束条件等。输出结果是一个表格，其中包含每个列的名称、数据类型、是否可以为NULL、键类型和默认值。
使用 `DROP TABLE` 语句删除表。例如：

```sql
DROP TABLE students;
```
## 创建、查看和删除索引
索引通常用于加速索引列上的查询。对于值不唯一的列，可使用 `CREATE INDEX` 语句创建普通索引。例如：

```sql
CREATE INDEX idx_id ON students (id);
```

对于值唯一的列，可以创建唯一索引。例如：

```sql
CREATE UNIQUE INDEX idx_unique_id ON students (id);
```

使用 `SHOW INDEX` 语句查看表内所有索引：

```sql
SHOW INDEX FROM students;
```

使用  `DROP INDEX` 语句来删除索引。例如：

```sql
DROP INDEX idx_id ON students;
```

注意：DDL 操作不是事务，在执行 DDL 时，不需要对应 COMMIT 语句。

常用的 DML 功能是对表记录的新增、修改和删除，对应的命令分别是 INSERT、UPDATE 和 DELETE。
## 记录的增删改
记录（Record）是指表中的每一行数据，也称为行（Row）或元组（Tuple）。每个记录包含表中所有列的数据，一般用于表示某个实体或对象的属性值。

使用 `INSERT` 语句向表内插入表记录。例如：

```sql
INSERT INTO students VALUES(101,'tom',20,'Male');
```

使用 `INSERT` 语句向表内插入包含部分字段数据的表记录。例如：

```sql
INSERT INTO students(id,name) VALUES(102,'bob');
```

使用 `UPDATE` 语句向表内修改表记录的部分字段数据。例如：


```sql
update students set age=21 where id=102;
```

使用 `DELETE` 语句向表内删除部分表记录。例如：


```sql
DELETE FROM students WHERE id=102;
```

>注意：UPDATE 和 DELETE 操作如果不带 WHERE 过滤条件是对全表进行操作。

DQL 数据查询语言是从一个表或多个表中检索出想要的数据行，通常是业务开发的核心内容。

## 查询数据
使用 `SELECT` 语句检索表内数据。例如：

```sql
SELECT * FROM studnets;
```

在 SELECT 后面加上要查询的列名。例如：


```sql
SELECT name FROM students;
```

```sql
+------+
| name |
+------+
| tom  |
+------+
1 rows in set (0.00 sec)
```

使用 WHERE 子句，对所有记录进行是否符合条件的筛选后再返回。例如：

```sql
SELECT * FROM studnets WHERE id=101;
```

常用的 DCL 功能是创建或删除用户，和对用户权限的管理。
## 创建、授权和删除用户

使用 `CREATE USER` 语句创建一个用户 `monouser`，密码为 `10001`：


```sql
CREATE USER 'monouser'@'localhost' IDENTIFIED BY '10001';
```

授权用户 `monouser` 可检索数据库 `mono` 内的表：


```sql
GRANT SELECT ON mono.* TO 'monouser'@'localhost';
```

查询用户 `monouser` 的权限：


```sql
SHOW GRANTS for monouser@localhost;
```

删除用户 `monouser`：

```sql
DROP USER 'monouser'@'localhost';
```

## 创建存储过程和函数
**存储过程**是一组预先编写好的SQL语句集合，可以接受输入参数并返回输出参数，用于执行一系列的数据库操作, **可以修改数据库中的数据**。存储过程通常被保存在数据库服务器中，可以被多次调用执行。存储过程可以包含条件判断、循环、事务控制等逻辑结构，具有灵活的控制流程和较高的性能优势。
针对students表，可以创建如下的存储过程，用于向students表格中插入一条新的学生记录
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
上述存储过程接收四个参数，分别表示学生的ID、姓名、年龄和性别，然后使用INSERT INTO语句将这些参数值插入到students表格中。
例如，可以使用以下命令调用insert_student存储过程，并向students表格中插入一条新的学生记录：
```sql
CALL insert_student(1, '张三', 20, 'Male');
```
**函数**是一段可重用的SQL代码，通常用于计算并返回一个结果，**不会修改数据库中的数据**。函数可以接收输入参数，并返回一个值作为结果。函数可以在SQL语句中直接使用，也可以在存储过程中被调用执行。函数可以实现一些简单的数学计算、字符串处理、日期处理等功能，也可以实现一些复杂的业务逻辑计算
针对students表，可以创建如下的函数，用于计算学生的出生年份。可以使用以下SQL语句创建一个名为`get_student_birth_year`的函数
```sql
CREATE FUNCTION get_student_birth_year(student_id INT) RETURNS INT
BEGIN
  DECLARE birth_year INT;
  SELECT YEAR(NOW()) - age INTO birth_year FROM students WHERE id = student_id;
  RETURN birth_year;
END;
```
例如，可以使用以下命令调用get_student_birth_year函数，并计算学生ID为1的出生年份：
```sql
SELECT get_student_birth_year(1);
```

