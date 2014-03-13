'use strict';

/* Directives */

angular.module('myApp.version.directive', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
