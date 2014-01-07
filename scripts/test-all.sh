#!/bin/bash

set -ex

function cleanUp() {
  kill $WEBSERVER_PID
}

trap cleanUp EXIT

# Define reasonable set of browsers in case we are running manually from commandline
if [[ -z "$BROWSERS" ]]
then
  BROWSERS="Chrome"
fi

if [[ -z "$BROWSERS_E2E" ]]
then
  BROWSERS_E2E="Chrome"
fi

ROOT_DIR=`dirname $0`/..

cd $ROOT_DIR
npm install

./scripts/web-server.js > /dev/null &
WEBSERVER_PID=$!


./node_modules/karma/bin/karma start config/karma.conf.js --single-run --browsers $BROWSERS --reporters=dots --no-colors --no-color
./node_modules/karma/bin/karma start config/karma-e2e.conf.js --browsers $BROWSERS_E2E --reporters=dots --no-colors --no-color
