'use strict';

angular.module('appVersion', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, element, attributes, controller) {
      element.text(version);
    };
  }]);
