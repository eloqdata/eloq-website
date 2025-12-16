#!/bin/bash
set -eu
MASTER_ADDR='127.0.0.1:8261'

jq --version
dmctl --version

wait_task() {
    while true; do
        dmctl --master-addr $MASTER_ADDR query-status $1 >status.json
        local unit=$(jq -r '.sources[0].subTaskStatus[0].unit' status.json)
        local stage=$(jq -r '.sources[0].subTaskStatus[0].stage' status.json)
        local progress='N/A%'
        if [ $unit = 'Dump' ]; then
            progress=$(jq -r '.sources[0].subTaskStatus[0].dump.progress' status.json)
        elif [ $unit = 'Load' ]; then
            progress=$(jq -r '.sources[0].subTaskStatus[0].load.progress' status.json)
        else
            echo "FAIL: unexpected unit '$unit'"
            dmctl --master-addr $MASTER_ADDR stop-task $1
            exit 1
        fi
        echo -ne "[ $unit | $stage | $progress ]\r"
        if [ $unit = 'Load' ] && [ $stage = 'Finished' ]; then
            break
        else
            sleep 5
        fi
    done
}

while read -r tablename; do
    tablename=$(echo $tablename | xargs)
    if [ -z $tablename ] || [ ! -z $(grep -x "$tablename" tables_out.txt) ]; then
        continue
    fi
    taskname="serial_$(date +%s)"
    echo "$(date +%H:%M:%S) ===> table '$tablename' start. $taskname"
    # start
    cp task_temp.yaml task.yaml
    sed -i "s|_TASKNAME_|$taskname|" task.yaml
    sed -i "s|_TABLENAME_|$tablename|" task.yaml
    dmctl --master-addr $MASTER_ADDR start-task task.yaml >>log.txt
    wait_task $taskname
    dmctl --master-addr $MASTER_ADDR stop-task $taskname >>log.txt
    # finished
    echo "$(date +%H:%M:%S) ===> table '$tablename' finished."
    echo "$tablename" >>tables_out.txt
done <tables_in.txt

echo "Done!"
