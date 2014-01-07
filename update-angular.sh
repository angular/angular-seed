#! /bin/sh
NG_BUILD_DIR=$1
if [[ ! -e "$NG_BUILD_DIR/angular.js" ]]; then
  echo "Usage: update-angular <build-dir>"
  exit 1
fi

rm -fr app/lib/angular
mkdir app/lib/angular
cp -r $NG_BUILD_DIR/* app/lib/angular
rm -fr app/lib/angular/docs
rm app/lib/angular/*.zip
mv app/lib/angular/angular-mocks.js test/lib/angular
mv app/lib/angular/angular-scenario.js test/lib/angular
cp app/lib/angular/version.txt test/lib/angular
