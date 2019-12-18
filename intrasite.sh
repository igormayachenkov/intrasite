#!/bin/bash
PID_FILE="intrasite.pid"
LOG_FILE="intrasite.log"
ERROR_FILE="intrasite.err"

check_status(){
    # read the process pid
    pid=$(cat $PID_FILE 2>/dev/null)

    # verify pid existance
    if [ -n "$pid" ] 
    then
        echo "pid:$pid"
        # verify running state
        if kill -0 $pid 2>/dev/null
        then
            echo "the process is runnning"
        else
            echo "the process is stopped"
        fi
    else
        echo "stopped"
    fi
}

start_server(){
    # read the process pid
    pid=$(cat $PID_FILE 2>/dev/null)

    # verify pid existance
    if [ -n "$pid" ] 
    then
        echo "Already started"
        exit
    fi

    # input the pass
    read -s -p "Enter RSA-key passphrase: "  passphrase
    echo

    # start server
    export PASSPHRASE=$passphrase
    #node index.js  >$LOG_FILE 2>$ERROR_FILE & disown
    nohup node index.js  >$LOG_FILE 2>$ERROR_FILE & 
    pid=$!

    # wait for a time
    sleep 3

    # verify
    if kill -0 $pid 2>/dev/null
    then
        # save the process pid
        echo $pid >> $PID_FILE
        echo "the process is started, pid:$pid"
    else
        # something is wrong
        cat $ERROR_FILE
        exit
    fi

}


stop_server(){
    # read the process pid
    pid=$(cat $PID_FILE 2>/dev/null)

    # verify pid existance
    if [ -z "$pid" ] 
    then
        echo "Already stopped"
        exit
    fi
    echo "PID:"$pid

    # stop the process
    kill $pid 2>/dev/null

    # delete the file
    rm $PID_FILE

    echo "stopped"
}

command=$1
case $command in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    status)
        check_status
        ;;
    *)
        echo "unknown command $command"
esac
