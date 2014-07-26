'use strict';

angular.module('view2', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'components/view2/view2.html',
      controller: 'MyCtrl2'
    });
  }])

  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);