---
title: Hands-On Journey to MonoSQL
---

# Hands-On Journey to MonoSQL

## Make DynamoDB Easy To Use

MonoSQL is stateless SQL wrapper for DynamoDB, it reduces the initial and ongoing dev cost of using DynamoDB. Customer can still use SQL to write their data applications, while at the same time get consitent performance at scale just like DynamoDB.

Next we will use a simulated **Twitter** use case to illustrate the easy-to-use feature of MonoSQL compared with DynamoDB native SDK.

Let's pick three common access **patterns** in Twitter app:

1. given a tweet, return the latest replies using pagination with tweet reply content and reply time. This access pattern is used to list all the replies ordered by reply time when user clicks a tweet. Pagination is a technique to display only a fixed number of records in a single webpage. User can click page number to switch among the pages.
2. given a tweet, return the top 3 replies having most stars with tweet reply content, replier name, reply time and star count. This access pattern is used to display the top favorate replies when user clicks a tweet.
3. given a tweet, return the top 3 country where the repliers belong to and country count. This is used to display at which countries this tweet is popular.

### Data Modeling
MonoSQL supports both single table design and multiple table design. It's recommended to use mutliple table design to save schema change cost if you migrate from MySQL database. Denormalization is also a best practice in DynamoDB, this can be helpful in MonoSQL as well. Let's take the above three access patterns as example and design the table schema as follows.
```
CREATE TABLE tweet_reply (reply_id bigint, tweetid bigint, rep_time datetime, rep_user_id bigint, rep_user_nation varchar(10), rep_content text, stars int, primary key(reply_id), key(tweetid, rep_time), key(tweetid, stars));
CREATE TABLE user (userid bigint, username varchar(30), nation varchar(10), primary key(userid));
```

Note that we add `rep_user_nation` field into `tweet_reply` table, this is denormalization design pattern. This is used by access pattern #3. Pattern #3 will iterate all the replies in a given tweet to calculate the top 3 countries. This can become time consuming if a tweet contains thousands of replies which is common in Twitter use case. By using denormalization, the additional join can be save with the tradeoff of more storage cost.


### Loading Data
```
INSERT INTO tweet_reply VALUES(1001,100,'2023-07-02 15:01:11',160608,'CHN','It\'s funny',400);
INSERT INTO tweet_reply VALUES(1002,100,'2023-07-02 13:02:22',160609,'US','I like this tweet',3854);
INSERT INTO tweet_reply VALUES(1003,100,'2023-07-02 14:11:42',160610,'US','show me the link',2145);
INSERT INTO tweet_reply VALUES(1004,100,'2023-07-02 16:01:13',160608,'CHN','http://fisddf.md',9999);
INSERT INTO tweet_reply VALUES(1005,100,'2023-07-02 17:03:15',160615,'UK','awsome',233);
INSERT INTO tweet_reply VALUES(1006,100,'2023-07-03 12:01:16',160614,'CHN','so sweet',22);
INSERT INTO tweet_reply VALUES(1007,100,'2023-07-03 12:06:27',160613,'KOR','I like the hero',35);
INSERT INTO tweet_reply VALUES(1008,100,'2023-07-03 13:01:10',160612,'JPN','I miss you',56);
INSERT INTO tweet_reply VALUES(1009,100,'2023-07-04 18:33:21',160616,'DE','who\'s the actor',98);
INSERT INTO tweet_reply VALUES(1010,100,'2023-07-05 18:43:41',160601,'CHN','iron man?',883);
INSERT INTO tweet_reply VALUES(1011,101,'2023-07-07 22:43:47',160608,'CHN','me too',8);
INSERT INTO tweet_reply VALUES(1012,102,'2023-07-01 23:13:46',160608,'CHN','like it',70);

INSERT INTO user VALUES(160601,'miss','CHN');
INSERT INTO user VALUES(160608,'little','CHN');
INSERT INTO user VALUES(160609,'big','US');
INSERT INTO user VALUES(160610,'titan','US');
INSERT INTO user VALUES(160612,'mono','JPN');
INSERT INTO user VALUES(160613,'rr','KOR');
INSERT INTO user VALUES(160614,'mysql','CHN');
INSERT INTO user VALUES(160615,'pg','UK');
INSERT INTO user VALUES(160616,'nobody','DE');
```

### SQL for Access Pattern

By using DynamoDB native SDK, application is required to fetch data from DynamoDB and then manipulate the data (e.g. join, aggregation) to get the final result set. This procedure requires additional dev cost and is error-prone.

In contrast, MonoSQL can use three SQL queries to finish the above access patterns.

Pattern #1.

Pagination is implemented by using `LIMIT` and `OFFSET` clause in MonoSQL just like MySQL. Formula to calculate `OFFSET` value is `OffsetValue = (PageNumber-1) * RecordsPerPage;` Suppose RecordsPerPage is 5 and PageNumber is 2, then the `LIMIT` value is 5 and `OFFSET` value is `(2-1)*5=5`

```
SELECT rep_content, rep_time FROM tweet_reply WHERE tweetid=100 ORDER BY rep_time DESC LIMIT 5 OFFSET 5;
```

Pattern #2.

Show top 3 tweet replies ordered by star count needs to use index(tweetid, stars).

```
SELECT username, rep_content, rep_time, stars FROM tweet_reply, user WHERE tweetid=100 and rep_user_id=userid ORDER BY stars DESC LIMIT 3;

```

Pattern #3.

Using aggregation to calculate the count of user nation in tweet_reply.

```
SELECT rep_user_nation, count(rep_user_nation) FROM tweet_reply WHERE tweetid=100 GROUP BY rep_user_nation ORDER BY count(rep_user_nation) DESC LIMIT 3;
```

### Access Pattern Change

Customer's business may change rapidly, the access pattern will change accordingly. For example, customer needs to get the top 3 nations where the tweet's repliers belong to and country count given a tweer id. But one user could reply a tweet multiple times, which requires to remove the duplicated repliers before calculate the top 3 nations. This needs application side code change by add logic to remove the duplicated repliers when you use DynamoDB native SDK. This is costly and error-prone.

With MonoSQL, access pattern change can be handled by tunning SQL script, which is easier. For example, removing the duplicated repliers can be handled by `distinct` keyword in SQL.

```
SELECT rep_user_nation, count(distinct rep_user_id) FROM tweet_reply where tweetid=100 GROUP BY rep_user_nation ORDER BY count(distinct rep_user_id) DESC LIMIT 3;
```

## Break MySQL Write Bottleneck

For write intensive workload, MySQL often experiences write bottleneck. This bottleneck cannot be removed by scaling up, e.g. scaling from db.r5g.8xlarge to db.r5g.16xlarge. Traditionally, customers can use sharding middleware or choose a distributed SQL databases if business requires the database with more write performance: higher throughput with low latency.

Sharding needs to refactor the application code which is costly, while distributed SQL is expensive and management cost is high. But a large amount of write intensive workloads are suitable for NoSQL use cases. For example game state and player data store in gaming industry, shopping cart and inventory tracking in retail industry, metadata store in entertainment industry, user event and click stream in ad industry etc. Luckily, you can switch from MySQL to MonoSQL easily and break the write bottleneck.

### Hands-On Tutorial

Create Aurora MySQL database with type: db.r5g.16xlarge. Load data using sysbench and workload `oltp_update_non_index` is primary key update which is a typical write intensive workload.

```
sysbench /usr/share/sysbench/oltp_update_non_index.lua --mysql_storage_engine=innodb --tables=1 --table_size=1000000 --mysql-user=sysb --mysql-password=sysb --mysql-host=your_db_endpoint --mysql-port=3306 --mysql-db=sbtest --time=600 --threads=960 --report-interval=10 --auto_inc=off --create_secondary=false --mysql-ignore-errors=all  --rand-type=uniform prepare
sysbench /usr/share/sysbench/oltp_update_non_index.lua --mysql_storage_engine=innodb --tables=1 --table_size=1000000 --mysql-user=sysb --mysql-password=sysb --mysql-host=your_db_endpoint --mysql-port=3306 --mysql-db=sbtest --time=600 --threads=960 --report-interval=10 --auto_inc=off --create_secondary=false --mysql-ignore-errors=all  --rand-type=uniform run
```

The result of Aurora MySQL is about 55000 and scale up doesn't help.
```
thds: 960 tps: 55086.03 qps: 55086.03 (r/w/o: 0.00/55086.03/0.00) lat (ms,95%): 26.20 err/s: 0.00 reconn/s: 0.00
```

Switching to MonoSQL. Without any code change, cusomters can run the same write intensive workload with 8 c5.2xlarge MonoSQL servers.

```
sysbench /usr/share/sysbench/oltp_update_non_index.lua --mysql_storage_engine=innodb --tables=1 --table_size=1000000 --mysql-user=sysb --mysql-password=sysb --mysql-host=your_db_endpoint --mysql-port=3306 --mysql-db=sbtest --time=600 --threads=960 --report-interval=10 --auto_inc=off --create_secondary=false --mysql-ignore-errors=all  --rand-type=uniform prepare
# Remember to provision enough WCU and RCU (250000) for the new created table `sbtest1`. Alternatively you can set --tables=100 and --table_size=10000 to avoid provisioning WCU and RCU and keep table `sbtest*` in on-demand mode.
sysbench /usr/share/sysbench/oltp_update_non_index.lua --mysql_storage_engine=innodb --tables=1 --table_size=1000000 --mysql-user=sysb --mysql-password=sysb --mysql-host=your_db_endpoint --mysql-port=3306 --mysql-db=sbtest --time=600 --threads=960 --report-interval=10 --auto_inc=off --create_secondary=false --mysql-ignore-errors=all  --rand-type=uniform run
```

The TPS increased to 119305. Next you can add more MonoSQL servers e.g. 16 * c5.4xlarge and use more connections. Run the workload again.

```
sysbench /usr/share/sysbench/oltp_update_non_index.lua --mysql_storage_engine=innodb --tables=1 --table_size=1000000 --mysql-user=sysb --mysql-password=sysb --mysql-host=your_db_endpoint --mysql-port=3306 --mysql-db=sbtest --time=600 --threads=1920 --report-interval=10 --auto_inc=off --create_secondary=false --mysql-ignore-errors=all  --rand-type=uniform run
```

The TPS increases to 232533. The experiment indicates the linear scalability of MonoSQL. When you hit the write bottleneck of MySQL, switch to MonoSQL seamlessly. Note that 200000 TPS is not the upper bound of MonoSQL, you can achieve more TPS by adding more MonoSQL server and provision larger WCU/RCU on DynamoDB.

