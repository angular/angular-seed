#! /bin/sh
NG_BUILD_DIR=$1
if [[ ! -e "$NG_BUILD_DIR/angular.js" ]]; then
  echo "Usage: update-angular <build-dir>"
  exit 1
fi

SCRIPT_DIR=$(dirname $0)
ROOT_DIR=$SCRIPT_DIR/../
VERSION=$(cat $NG_BUILD_DIR/version.txt)

cd $ROOT_DIR

rm -fr app/lib/angular
mkdir app/lib/angular
cp -r $NG_BUILD_DIR/* app/lib/angular
rm -fr app/lib/angular/docs
rm app/lib/angular/*.zip
mv app/lib/angular/angular-mocks.js test/lib/angular
mv app/lib/angular/angular-scenario.js test/lib/angular
cp app/lib/angular/version.txt test/lib/angular

# Update the inlined angular-loader in app/index-async.html
sed '/@@NG_LOADER@@/{
    s/@@NG_LOADER@@//g
    r app/lib/angular/angular-loader.min.js
}' app/index-async.html.template > app/index-async.html

git add $ROOT_DIR/app
git add $ROOT_DIR/test
git commit -m "update(angular): bump to $VERSION"
