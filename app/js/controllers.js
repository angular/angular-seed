'use strict';

/* Controllers */


angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope', function($scope) {
    $scope.one = 1;
  }]).
  controller('MyCtrl2', ['$scope', function($scope) {
    $scope.two = 2;
  }]);
