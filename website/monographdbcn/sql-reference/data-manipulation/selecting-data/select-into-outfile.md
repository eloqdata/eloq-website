---
title: SELECT INTO OUTFILE
summary: 介绍SELECT INTO OUTFILE的功能与用法
---

# SELECT INTO OUTFILE

`SELECT INTO OUTFILE`语句可以将查询结果写入一个文件，并且可以使用列和行终止符来指定输出格式。默认情况下，列使用制表符(\t)作为终止符，行使用换行符(\n)作为终止符。

> **注意**
> 写入的文件不能存在同名文件，用户需要有 FILE 权限才能运行`SELECT INTO OUTFILE`。MonographDB 需要对于文件写入的位置具有文件写入权限。

## 具体用法示例

- 对于测试用表`employees`，查询相应的员工 id(employee_id)，员工电话号码(phone_number)以及薪水(salary)，并将其存入主目录下的 employees 文件,输出文件中的字段将由逗号分隔并用双引号括起来，每条记录将以换行符终止。

```sql
SELECT employee_id,phone_number, salary from employees
  INTO OUTFILE '/path/to/part_employees.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n';
```

- 将整张 employees 表导出到相应的 CSV 文件

```sql
SELECT * INTO OUTFILE '/path/to/full_mployees.csv'
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM employees;
```

- 导出满足特定条件的记录到 CSV 文件

```sql
SELECT * INTO OUTFILE '/path/to/IT.csv'
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM employees
WHERE job_id = 'IT_PROG ';
```

## MySQL 兼容性

`SELECT INTO OUTFILE`语句与 MySQL 8.0 的“SELECT INTO OUTFILE”功能完全兼容

更多详情，请参考[mariadb:SELECT INTO OUTFILE](https://mariadb.com/kb/en/select-into-outfile/)
