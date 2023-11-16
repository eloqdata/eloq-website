---
title: 与MySQL重要区别
summary: 本文对 MonographDB 和 MySQL 的区别详细说明
---

# 在 monograph 自增字段的使用

1. 在 monograph 引擎中，所有该字段的手动输入将会被忽略，例如：
   create table t1(i int primary key auto_increment, j int)engine=monograph;
   insert into t1 values(null, 1);
   insert into t1 values(1, 1);
   insert into t1(j) values(1);
   产生的结果是一样的，对于字段 i 的输入将会被忽略。
2. 每个节点将会在启动后第一次插入该表记录时，将会申请一段范围的 id 用于该节点的记录插入。各节点各自申请，结果只用于本节点，因此自增字段不能保证 id 是严格递增的，只能保证是不重复的。当该 range 的 id 在本节点使用完成后，会再次申请，如果该节点中途关闭，则未使用完的 id 将会抛弃。
3. 可以通过下面的命令修改该 table 的 id 范围：
   set global monograph_auto_increment="table_name=t1;offset=10000;increment=15;range=1024";
   table_name: 表单名名称
   offset：自增 id 的初始值
   increment:两次获取 id 的间隔
   range: 节点一次获取 id 的范围
