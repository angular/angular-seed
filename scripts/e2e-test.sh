#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo "-------------------------------------------------------------------"

karma start $BASE_DIR/../config/karma-e2e.conf.js $*
#karma --log-level debug start $BASE_DIR/../config/karma-e2e.conf.js $*
