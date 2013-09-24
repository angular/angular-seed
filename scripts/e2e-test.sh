#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Protractor (https://github.com/angular/protractor)"
echo "-------------------------------------------------------------------"

./node_modules/.bin/protractor $BASE_DIR/../config/protractor-e2e.conf.js $*
