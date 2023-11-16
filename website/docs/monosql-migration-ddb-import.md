---
title: Migration using MonoSQL Migration Tool
---

# MonoSQL Migration Tool

MonoSQL supply a migration tool program called migration_tool to migration data into MonoSQL.

DynamoDB support import csv,json files from S3 natively. This import stategy is recommended by DynamoDB since it's cost effective compared to load data into DynamoDB through `PutItem` request.

SQL database supports to export table into csv files, but DynamoDB will treat all the csv fields as `string` type, which is not suitable for MonoSQL. Instead json format supports specifying the column type: string(S), integer(N), blob(B) in DynamoDB. As a result, `migration_tool` is designed to convert SQL database exported csv files into json files with DynamoDB column type information.

## Migration Tool Usage

`migration_tool` is released with MonoSQL and installed at `${MONOSQL_INSTALL_PATH}/bin/`

To run `migration_tool` you need to specify the directory of source database exported csv files, e.g. `migrate_csv_dir`.

The directory should contains:

1. the csv files.
2. the ddl.json file which describe the table schema.

The ddl.json contains all the column type for the table to be migrated. The column type contains four attributes:

1. column name: a string.
2. column type: compatible with MySQL data type, includes: tinyint, smallint, mediumint,int,bigint,decimal,float,double,date,datetime,timestamp,time,year,char,varchar,binary,varbinary,tinyblob,tinytext,mediumblob,blob,text,longblob,longtext,enum,set.
3. is column primary key: default false.
4. is column unsigned: default false, valid for digit data type.

The example of ddl.json

```
{
  "columns":[
    {
      "name": "pk",
      "type": "int",
      "unsigned": true,
      "is_primary": true
    },
    {
      "name": "sk",
      "type": "varchar",
      "is_primary": true
    },
    {
      "name": "c1",
      "type": "text",
    }
  ]
}
```

The following command will convert all the csv files in directory `migrate_csv_dir` into json format.

```
./migration_tool migrate_csv_dir
```

## Limitation

MonoSQL's table should specify primary key. The first column of primary key is partition key of DynamoDB table. The rest of columns of primary key are packed into a binary. This packed key is treated as sorted key.

Currently, the packing function of `migration_tool` only support integer type. If the packed key contains non integer column, please use [AWS DMS](http://monographdata.com/docs/monosql-migration-awsdms) to migrate your data.
