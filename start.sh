#!/bin/bash
 
echo "Intrasite startup script"

read -s -p "Enter RSA-key passphrase: "  passphrase

node index.js $passphrase >log.txt & disown
