#! /bin/sh
if [ -n "$1" ]; then
  mkdir tmp
  curl https://raw.github.com/angular/code.angularjs.org/master/$1/angular-$1.zip -o tmp/angular.zip
  rm -fr app/lib/angular
  unzip tmp/angular.zip -d app/lib
  mv app/lib/angular-$1 app/lib/angular
  rm -fr app/lib/angular/docs
  mv app/lib/angular/angular-mocks.js test/lib/angular
  mv app/lib/angular/angular-scenario.js test/lib/angular
  cp app/lib/angular/version.txt test/lib/angular

else
  echo "Usage: update-angular <version>"
fi  
