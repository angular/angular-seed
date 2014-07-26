'use strict';

angular.module('view1', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'components/view1/view1.html',
      controller: 'MyCtrl1'
    });
  }])

  .controller('MyCtrl1', ['$scope', function($scope) {

  }]);