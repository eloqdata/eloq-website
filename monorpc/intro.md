---
title: MonoRPC Overview
---
# Overview of Monograph for RPC

## 简介
"Monograph for RPC" 是一款定制化的数据库服务。面向具体业务逻辑，定制具体的事务处理逻辑，简化操作接口，满足高吞吐高并发处理需求。

传统数据库使用方式中，处理一项业务一般需要执行多次数据库查询请求，由于业务与数据库是独立的，多次数据库请求意味着多次网络交互，无疑增加了业务响应延迟。同时，复杂的业务往往需要复杂的SQL，解析复杂的SQL语句也带来额外的开销。

本项目针对具体业务，通过定制具体的业务处理逻辑和服务接口，将业务处理和数据库操作集成，尽力通过一个接口和单次调用即可处理完成一项业务，以减少业务端和数据库端的交互带来的业务响应延迟。
同时，通过RPC方式提供操作接口，无需做SQL解析，可进一步节省计算资源，减小服务延迟。


## 主要特点
1. 完整的事务处理
2. 定制化（根据具体业务场景，定制处理逻辑和简洁服务接口）。
3. 高吞吐低延迟
4. 轻量接口
5. 不限于关系型数据
6. 多种隔离级别可选：ReadCommitted, RepeatableRead, SnapshotIsolation, Serializable


## 主要接口及示例

#### 本项目针对'转账'服务定制的接口信息

- Account数据录入
    ```
    bool InsertAccount(const remote::InsertAccountRequest &request,
                       remote::InsertAccountResponse &response);
    // request 请求接口
    remote::InsertAccountRequest request;
    request.set_uid(1);
    request.set_utype(1);
    request.set_balance(1000.05);
    request.set_tag("TAG1");
    request.set_ctime(1689937871000000);
    request.set_mtime(1689937871000000);

    // response 返回结果
    remote::InsertAccountResponse response；
    response.error();   // 是否失败
    response.err_msg(); // 错误信息
    ```

    **InsertAccountRequest 与 InsertAccountResponse 的proto信息**
    ```
        message InsertAccountRequest {
            int32 uid = 1;
            int32 utype = 2;
            double balance = 3;
            string tag = 4;
            int64 ctime = 5;
            int64 mtime = 6;
            }

        message InsertAccountResponse {
            bool error = 1;
            string err_msg = 2;
            }
        
    ```

- Account数据查询
    ```
    bool ReadAccount(const remote::ReadAccountRequest &request,
                        remote::ReadAccountResponse &response);
    // request 请求接口
    remote::ReadAccountRequest request;
    request.set_uid(1);
    request.set_utype(1);

    // response 返回结果
    remote::ReadAccountResponse response;
    response.is_deleted();  // 记录是否存在
    response.account();     // 记录详细信息
    ```

    **ReadAccountRequest 与 ReadAccountResponse的proto信息**
    ```
        message ReadAccountRequest {
            int32 uid = 1;
            int32 utype = 2;
            }

        message AccountInfo {
            int32 uid = 1;
            int32 utype = 2;
            double balance = 3;
            string tag = 4;
            uint64 ctime = 5;  // microsecond timepoint
            uint64 mtime = 6;  // microsecond timepoint
            }

        message ReadAccountResponse {
            bool error = 1;
            string err_msg = 2;
            bool is_deleted = 3;
            AccountInfo account = 4;
            }
    ```


- Account转账接口
  ```
    bool TransferAccount(const remote::TransferAccountRequest &request,
                         remote::TransferAccountResponse &response);
    // request 请求接口
    remote::TransferAccountRequest request;
    request.set_from_uid(1);
    request.set_from_utype(1);
    request.set_to_uid(2);
    request.set_to_utype(2);
    request.set_amount(100.05);
    request.set_ref_uid(1);
    request.set_ref_aid(1);
    request.set_ref_tid(1);
    request.set_ref_id(1);
    request.set_op_uid(1);
    request.set_meta("MetaInfo");
    request.set_scene("SceneInfo");
    request.set_ref_type("reftype");
    request.set_op_ip("192.168.0.1");

    // response 返回结果
    remote::TransferAccountResponse response;
    response.error();   // 是否失败
    response.err_msg(); // 错误信息
  ``` 

    
    **TransferAccountRequest 与 TransferAccountResponse 的proto信息**
    ```
        
        message TransferAccountRequest {
            CcProtocolType tx_protocol = 1;
            IsolationType tx_iso_lvl = 2;
            int32 from_uid = 3;
            int32 from_utype = 4;
            int32 to_uid = 5;
            int32 to_utype = 6;
            double amount = 7;
            int32 ref_uid = 8;
            int32 ref_aid = 9;
            int64 ref_tid = 10;
            string meta = 11;
            string scene = 12;
            string ref_type = 13;
            int64 ref_id = 14;
            int32 op_uid = 15;
            string op_ip = 16;
        }

        message TransferAccountResponse {
            bool error = 1;
            string err_msg = 2;
            }
    ```


#### Server端提供的编程接口
###### 1. 已封装的事务与数据操作接口
- 事务创建与初始化
  ```
    TransactionExecution *NewTxInit(
                TxService *tx_service,
                IsolationLevel level = IsolationLevel::ReadCommitted,
                CcProtocol proto = CcProtocol::Locking,
                int retry_count = 8);
  ```

- 事务提交
  ```
    bool CommitTx(txservice::TransactionExecution *txm);
  ```

- 事务中止
  ```
    bool AbortTx(txservice::TransactionExecution *txm)
  ```

- 数据插入
  ```
    bool Insert(TransactionExecution *txm,
                const TableName *table,
                std::unique_ptr<TxKey> monograph_key,
                std::unique_ptr<TxRecord> monograph_rec,
                store::DataStoreHandler *store_hd = nullptr,
                const TableSchema *tbl_schema = nullptr);
  ```
  
- 数据更新
  ```
    bool Update(TransactionExecution *txm,
                const TableName *table,
                std::unique_ptr<TxKey> monograph_key,
                std::unique_ptr<TxRecord> monograph_rec,
                store::DataStoreHandler *store_hd = nullptr,
                const TableSchema *tbl_schema = nullptr);
  ```
  
- 数据删除
  ```
    bool Delete(TransactionExecution *txm,
                const TableName *table,
                std::unique_ptr<TxKey> monograph_key,
                store::DataStoreHandler *store_hd = nullptr,
                const TableSchema *tbl_schema = nullptr);
  ```

- 数据查询-点读
  ```
    RecordStatus PkRead(
                TransactionExecution *txm,
                const TableName *table,
                const TxKey &monograph_key,
                TxRecord &monograph_record,
                bool for_update = false,
                bool for_share = false,
                store::DataStoreHandler *store_hd = nullptr,
                const TableSchema *tbl_schema = nullptr);
  ```

##### 2. 事务与数据操作基本接口
- 事务创建
   ```
   txservice::TransactionExecution *txm = nullptr;
    txm = tx_service->NewTx();
   ```
- 事务初始化
   ```
   // 指定具体的隔离级别和冲突协议
    txm->InitTx(IsolationLevle::ReadCommitted, CcProtocol::OCC);
   ```
- 事务提交
  ```
    txservice::CommitTxRequest commit_req;
    bool success = txm->CommitTx(commit_req);
  ```
- 事务中止
  ```
    AbortTxRequest abort_req;
    txm->Execute(&abort_req);
    abort_req.Wait();
  ```
- 数据查询-点读
  ```
    ReadTxRequest read_req(table, &key, &record);
    txm->Execute(&read_req);
    read_req.Wait();
  ```
- 数据查询-扫描读
  ```
    // 开始扫描
    ScanOpenTxRequest scan_open(
      table_name, ScanIndexType::Primary, start_key, start_inclusive,
      end_key, end_inclusive, direction);
    txm->Execute(&scan_open);
    scan_open.Wait();
    // 读取扫描数据
    ScanBatchTxRequest scan_batch_req(
              scan_alias_, table_name, &scan_batch_)
    txm->Execute(&scan_batch_req);
    scan_batch_req.Wait();
    // 结束扫描
    txm->CloseTxScan(scan_alias_, table_name, unlock_batch_);
  ```

- 数据插入
  ```
    UpsertTxRequest ups_req(table,std::move(key),std::move(rec),OperationType::Insert);
    txm->Execute(&ups_req);
    ups_req.Wait();
  ```
- 数据更新
  ```
    UpsertTxRequest ups_req(table,std::move(key),std::move(rec),OperationType::Update);
    txm->Execute(&ups_req);
    ups_req.Wait();
  ```

###### 3.存储服务主要接口
- 数据查询-点读
  ```
    bool Read(const txservice::TableName &table_name,
              const txservice::TxKey &key,
              txservice::TxRecord &rec,
              bool &found,
              uint64_t &version_ts,
              const txservice::TableSchema *table_schema);
  ```
- 数据查询-快照读
  ```
    bool FetchVisibleArchive(const TableName &table_name,
                             const txservice::KVCatalogInfo *kv_info,
                             const TxKey &key,
                             const uint64_t upper_bound_ts,
                             TxRecord &rec,
                             RecordStatus &rec_status,
                             uint64_t &commit_ts);
  ```
- 数据查询-扫描读
  ```
    void Current(const txservice::TxKey *&key,
                 const txservice::TxRecord *&rec,
                 uint64_t &version_ts,
                 bool &deleted);
    bool MoveNext();
    void End();
  ```
- 数据写入 (写入相关的操作接口由系统内部自动调用完成数据写入)
  ```

    bool PutAll(std::vector<txservice::FlushRecord> &batch,
                const txservice::TableName &table_name,
                const txservice::TableSchema *table_schema,
                uint32_t node_group,
                std::unordered_set<uint32_t> &skipped_record)
  ```



## 操作示例
#### 1. Account信息插入和读取
```
...
#include "proto/mono_api.pb.h"
#include "mono_api_client.h"

std::string server_endpoints_str = "127.0.0.1:7200";

int main()
{
    // 创建连接
    client::MonoApiClient client(server_endpoints_str);

    if (!client.Connect())
    {
        std::cout <<"client connect failed!!!"
                  << std::endl;
        return 1;
    }

    // 插入account
    remote::InsertAccountRequest request;
    remote::InsertAccountResponse response；

    request.set_uid(1);
    request.set_utype(1);
    request.set_balance(1000.05);
    request.set_tag("TAG1");
    request.set_ctime(1689937871000000);
    request.set_mtime(1689937871000000);
    
    bool result = client.InsertAccount(request, response);
    if (result && response.error()){
        std::cout << "failed" << std::endl;
    }
    else {
        std::cout << "inserted" << std::endl;
    }


    // 读取Account记录
    remote::ReadAccountRequest request;
    remote::ReadAccountResponse response;
     bool res = client.ReadAccount(request, response);
    if (res)
    {
        if (response.error())
        {
            std::cout << "ReadAccount(uid:" << request.uid()
                      << ",utype:" << request.utype()
                      << ") failed !!! error:" << response.err_msg()
                      << std::endl;
        }
        else if (!response.is_deleted())
        {
            std::cout << "ReadAccount(uid:" << request.uid()
                      << ",utype:" << request.utype()
                      << ") success === content: \n"
                      << response.account().DebugString() << std::endl;
        }
        else
        {
            std::cout << "ReadAccount(uid:" << request.uid()
                      << ",utype:" << request.utype() << ") success === deleted"
                      << std::endl;
        }
    }
    else
    {
        std::cout << "Rpc call failed!!!" << std::endl;
    }
}

```

#### 2. 转账操作示例
```
...
#include "proto/mono_api.pb.h"
#include "mono_api_client.h"

std::string server_endpoints_str = "127.0.0.1:7200";

int main()
{
    // 创建连接
    client::MonoApiClient client(server_endpoints_str);

    if (!client.Connect())
    {
        std::cout <<"client connect failed!!!"
                  << std::endl;
        return 1;
    }

    // request 请求接口
    remote::TransferAccountRequest request;
    request.set_from_uid(1);
    request.set_from_utype(1);
    request.set_to_uid(2);
    request.set_to_utype(2);
    request.set_amount(100.05);
    request.set_ref_uid(1);
    request.set_ref_aid(1);
    request.set_ref_tid(1);
    request.set_ref_id(1);
    request.set_op_uid(1);
    request.set_meta("MetaInfo");
    request.set_scene("SceneInfo");
    request.set_ref_type("reftype");
    request.set_op_ip("192.168.0.1");

    bool res = client.TransferAccount(request, response);
    if (res)
    {
        if (response.error())
        {
            std::cout << "failed, error: " << response.err_msg() << std::endl;
        }
        else
        {
            std::cout << "success." << std::endl;
        }
    }
    else
    {
        std::cout << "Rpc call failed!!!" << std::endl;
    }

   
```

## benchmark 工具和测试结果

1. 针对转账业务提供的测试工具: mono_api_client3 
    自动生成和录入Account记录，可测试"Account表的单点查询"和 "转账业务"性能。

2. 针对转账业务提供csv数据录入工具:
    (1) mono_api_client_load_csv 可读取csv文件中的Account记录并导入系统。
    (2) mono_api_client3_csv 读取csv文件中的Account记录，并测试"Account表的单点查询"和 "转账业务"性能。

3. 针对"转账业务"的测试结果
   
**测试简介**

   - **T1.1**: 无冲突转账测试，每个测试线程操作选取的转账和收款账户与其他测试线程无重叠。
   - **T2.1**: 每个测试线程每次测试时均在指定的10000个账户中随机选取转账账户，在100万个账户中随机选取收款账户。
   - **T2.2**: 每个测试线程每次测试时均在指定的1000个账户中随机选取转账账户，在100万个账户中随机选取收款账户。
   - **T2.3**: 每个测试线程每次测试时均在指定的100个账户中随机选取转账账户，在100万个账户中随机选取收款账户。
   - **T3.1**: 每个测试线程每次测试时均在指定的100000个账户中随机选取转账账户和收款账户。

**测试设备**
  - **机器**：AWS云服务上创建的服务器。
  - **数据库**：
    - Aurora: 单节点服务器db.r5.8xlarge
    - Monograph for SQL: server(m6i.8xlarge), 3*logserver(m6i.2xlarge,磁盘io2(3000iops)*3副本)
    - Monograph for RPC: server(m6i.8xlarge), 3*logserver(m6i.2xlarge,磁盘io2(3000iops)*3副本)
  - **成本粗估**:
    - Aurora:  1*(db.r5.8xlarge，存储300GB， 基线IO速率100每秒，峰值IO速率20万每秒，峰值IO活动时长100小时每月) 每月成本17,966.90USD; 峰值IO速率设置成10万每秒，每月成本10,046.90USD; 峰值IO速率设置成5万每秒，每月成本7,062.56USD;
    - Monograph for RPC: 1*(m6i.8xlarge) + 3*(m6i.2xlarge) + 3*3*(100GB io2), 每月成本: 2,577.00USD; 磁盘换成gp3类型，每月成本: 2,539.20USD。
  - **测试工具**：
    - TPCC+转账负载 ： 测试"Aurora"和"Monograph for SQL"。
    - mono_api_client3 ： 测试"Monograph for RPC"。

**测试结果**

| 数据库           | client 线程数 |       指标       | T1.1  | T2.1   | T2.2   | T2.3    | T3.1    |
|------------------|---------------|------------------|-------|--------|--------|---------|---------|
 Aurora            | 1000          | TPS(10K/S)       | 1.76  | 1.47   | 1.01   | 0.093   | 1.58    |
 Aurora            | 1000          | Avg-Latency (ms) | 56.82 | 68.02  | 99.00  | 1075    | 63.29   |
 Monograph for SQL | 1000          | TPS(10K/S)       | 5.28  | 5.17   | 5.06   | 2.73    | 5.16    |
 Monograph for SQL | 1000          | Avg-Latency (ms) | 18.93 | 19.34  | 19.76  | 36.63   | 19.37   |
 Monograph for RPC | 1000          | TPS(10K/S)       | 17.09 | 17.37  | 14.61  | 4.25    | 16.68   |
 Monograph for RPC | 1000          | Avg-Latency (ms) | 5.84  | 5.75   | 6.84   | 23.49   | 5.99    |
