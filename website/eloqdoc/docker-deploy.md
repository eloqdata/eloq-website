---
title: Run EloqDoc using Docker
---

Using `docker run` is the easiest way to get started. This is the preferred method to quickly get a taste of the rich features of **EloqDoc**.

```
# Create subnet for container.
docker network create --subnet=172.20.0.0/16 eloqnet

# Launch eloq-doc container.
docker run -d --net eloqnet --ip 172.20.0.10 -p 27017:27017 --name=eloqdoc-cloud eloqdata/eloqdoc-cloud-ubuntu2204-public

# Check the container launched succeed.
docker ps | grep eloqdoc-cloud
```

To connect to **EloqDoc**, you'll need a MongoDB-compatible client. You can download one using the commands below.

```
wget -c https://download.eloqdata.com/eloqdoc/rocksdbcloud/eloqdoc-v0.2.0-ubuntu22-amd64.tar.gz

mkdir eloqdoc-cloud && cd eloqdoc-cloud && tar -xf eloqdoc-v0.2.0-ubuntu22-amd64.tar.gz

./bin/mongo --host 172.20.0.10 --port 27017 --eval "db.t1.save({k: 1}); db.t1.find();"
```

The mongo client should output

```
MongoDB shell version v4.0.3
connecting to: mongodb://172.20.0.10:27017/
Implicit session: session { "id" : UUID("1fe615c1-d639-44f3-9e82-75e9c92d823d") }
MongoDB server version: 4.0.3
{ "_id" : ObjectId("684f97adabdc6936e88f4690"), "k" : 1 }
```
