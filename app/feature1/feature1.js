'use strict';

angular.module('myApp.feature1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/feature1', {
    templateUrl: 'feature1/feature1.html',
    controller: 'Feature1Ctrl'
  });
}])

.controller('Feature1Ctrl', [function() {

}]);
