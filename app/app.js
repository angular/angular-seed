'use strict';

// define the myApp module
let myApp = angular.module('myApp', []);

// define the vehicle controller on the myapp module
myApp.controller('VehicleController', function VehicleController(
  $scope,
  $http
) {
  $scope.vehicles = [];
  $http.get('./vehicles.json').then(function(result) {
    $scope.vehicles = result.data;
  });
});
