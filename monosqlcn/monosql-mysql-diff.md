---
title: MonoSQL与MySQL区别
---

## Select
Select语句具有两种一致性级别：**弱一致性读**与**强一致性读**。默认为弱一致性读, 可通过`SET monosql_strongly_consistency=on`切换到强一致性读。参见[Read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)
#### Scan
扫描时需要用等值条件指定索引第一列，否则会导致昂贵的全表扫描。全表扫描在默认配置下被禁止，可通过`SET monosql_full_tbl_scan=on`开启，扫描结果为乱序。

## Insert
#### Semantic
Insert语句具有**Insert**与**Upsert**两种语义，默认语义为Upsert，可通过`SET monosql_upsert_semantic=off`切换到Insert语义。两者区别是当主键已经存在时Upsert会覆盖写入而Insert会失败，且Upsert性能略好于Insert。
#### Bulk insert
在一个Insert语句中插入多行数据时，效果等价于逐行Upsert，不具有原子性，利用[BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html)获得更好性能。可开启事务以牺牲性能换取原子性。

## Update
Update语句的执行过程有两种：**Read-modify-write** 和 **Direct-update**。
#### Read-modify-write 
先通过[GetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html)从DynamoDB读取该行数据，在本地完成修改，最后通过[PutItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html)写入DynamoDB。发生写写冲突时的处理方式与事务相同。涉及主键更改的更新较为特殊，需要额外发送一个[DeleteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html)以删除具有旧主键的行，有极小的可能出现PutItem完成而DeleteItem失败，可以开启一个事务来彻底避免。
#### Direct-update
通过[UpdateItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html)直接更新DynamoDB，只涉及一个请求所以具有原子性和更佳的性能。
触发**Direct-update**需要同时满足条件：
1. 更新不属于事务
2. Where子句通过完整主键指定单行数据
3. 不涉及主键更改
4. 更新操作均为把某列赋值为const，或者数字类型与const之间的加减运算。

## Transaction
MonoSQL的事务基于[DynamoDB Transaction](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html)实现，位于BEGIN与COMMIT之间的操作为具有ACID特性的事务。在AutoCommit模式中，只操作单行数据的statement为一个事务，出于性能考虑，操作多行数据的单个statement默认不具有原子性，但是你可以显示开启事务以牺牲性能换取原子性。  
目前支持两种隔离级别：**Read-committed** 与 **Repeatable-read**。
#### Read-committed
单个事务中，Upsert/Insert/Update/Delete 操作涉及的行的总数不得超过100行。如果两个事务T1，T2发生写写冲突，且T1先于T2提交，则T2会覆盖T1的修改。
#### Repeatable-read
单个事务中，Read/Upsert/Insert/Update/Delete 操作涉及的行的总数不得超过100行。如果两个事务T1，T2发生读写冲突或写写冲突，且T1先于T2提交，则T2会回滚。

## Secondary index
MonoSQL的二级索引对应DynamoDB的[Global Secondary Index](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)。主表与二级索引之间以最终一致性进行同步，所以创建二级索引不会影响更新主表的性能。目前二级索引键最多包含2列，且不能包含被pack的列。
注意，具有二级索引的列的值不能为empty string或empty binary，但可以为NULL。

## Alter table
Alter table可以在很短时间内完成。Add-column后，新加列的默认值都是NULL。Drop-column后，删除列的数据立即不可见，但不会立即清除，要等到后续的Update语句触发的PutItem请求才会被动清除。

## Human-readable DynamoDB
一般情况下，写入DynamoDB的数据都是Human-readable，即MySQL展示的数据与DynamoDB展示的数据基本相同。
例外情况： 1. 当主键宽度为N列时（N>=3），则第2至N列会被pack为二进制形式后存入DynamoDB。
2. 数据类型`timestamp`, `year`, `time`会被存储为数字格式, 在DynamoDB中不是Human-readable。推荐在MonoSQL中使用`datetime`表示时间类型。
