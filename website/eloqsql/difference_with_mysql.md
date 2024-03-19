---
title: Difference with MySQL
---

# Difference with MySQL

## auto-increment ID in EloqSQL

1.  In the eloq engine, all manual input of auto-increment will be ignored.
    For example, the following SQL statement is used to create a table named `t1`,
    The table consists of two columns, `i` and `j`, where `i` is the primary key, an integer type, and is set to auto-increment. `j` is also an integer type.

        ```sql
        create table t1(i int primary key auto_increment, j int)engine=eloq;
        ```

        * Case 1
        ```sql
        insert into t1 values(null, 1);
        ```
        * Case 2
        ```sql
        insert into t1 values(1, 1);
        ```
        * Case 3
        ```sql
        insert into t1(j) values(1);
        ```

    Cases 1-3 produce the same result, the input for field `i` will be ignored.

2.  When each node inserts the table record for the first time after startup, it will apply for a range of `id` for the node's record insertion. Each node applies separately, and the result is only used for this node, so the auto-increment field cannot guarantee that the `id` is strictly incremented, only that it is not repeated. When the `id` of the range is used in this node, it will apply again. If the node is closed halfway, the unused `id` will be discarded.

3.  You can modify the id range of the table with the following statement:

    ```sql
    set global eloq_auto_increment="table_name=t1;offset=10000;increment=15;range=1024";
    ```

    `table_name`: table name
    `offset`: the initial value of the auto-increment id
    `increment`: the interval between getting id twice
    `range`: the range in which the node obtains the id at one time
