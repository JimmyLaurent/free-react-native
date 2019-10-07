#!/bin/bash

IP=127.0.0.1
APPLICATION_NAME=TO_REPLACE_WITH_APP_NAME
APPLICATION_DEB=yourpackage.deb 

ssh -p 2222 root@$IP "killall $APPLICATION_NAME; rm -rf /Applications/$APPLICATION_NAME.app" 2> /dev/null
scp -P 2222 ./build/$APPLICATION_DEB root@$IP:/tmp/ > /dev/null
ssh -p 2222 root@$IP "dpkg -i /tmp/$APPLICATION_DEB"
ssh -p 2222 root@$IP "uicache mobile"