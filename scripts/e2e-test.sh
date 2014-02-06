#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Updating WebDriver"
echo $BASE_DIR
echo "-------------------------------------------------------------------"

$BASE_DIR/../node_modules/protractor/bin/webdriver-manager update


echo ""
echo "Starting Protractor tests"
echo $BASE_DIR
echo "-------------------------------------------------------------------"

$BASE_DIR/../node_modules/protractor/bin/protractor $BASE_DIR/../config/protractor-conf.js $*
