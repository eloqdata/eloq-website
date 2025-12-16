### How to start
Install command tool `jq`
```shell
# centos
sudo yum install jq
# ubuntu
sudo apt install jq
```
Add `dmctl` to `PATH`
```shell
export PATH=$PATH:<path/to/dmctl>
```
Edit the task config template file `task_temp.yaml` to fill correct ip, user, password information.
```shell
vim task_temp.yaml
```


Execute serial.sh
```shell
# Please replace `MASTER_ADDR` in this script with the address of DM master.

nohup bash serial.sh > out.txt 2>&1 &
tail -f out.txt
```

### How to recover the previous failed tasks
1. Stop the last errored task.
```
dmctl --master-addr $MASTER_IP stop-task task_name $TASK_NAME
```

2. Drop the created but not finished table in EloqSQL database.
```
drop table failed_table_name;
```

3. Re-execute `serial.sh`
```
nohup bash serial.sh > out.txt 2>&1 &
tail -f out.txt
```
