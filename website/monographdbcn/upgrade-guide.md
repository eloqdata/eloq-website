---
title: 软件升级指南
---

# MonographDB 重新安装指南

请将新的安装包`monographdb-all-in-on.tar.gz`解压到用户目录，替代 deployment.yaml 中`tx_image`和`log_image`的位置。

请在**所有节点**删除 deployment.yaml 中`install_dir`和 logserver 的`data_dir`相关目录，默认为/data/opt, /data1/opt/log_data, /data2/opt/log_data, /data3/opt/log_data

请删除**所有节点**的安装用户目录下 Downloads 目录，默认为/home/ubuntu/Downloads

使用新的`cluster_mgr`执行数据库安装。

# MonographDB 原地升级指南

请[联系我们](https://www.monographdata.com/contact)
