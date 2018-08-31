'use strict';

let myApp = angular.module('myApp', []);

myApp.controller('VehicleController', function VehicleController(
  $scope,
  $http
) {
  $scope.vehicles = [];
  $http.get('./vehicles.json').then(function(result) {
    $scope.vehicles = result.data;
  });
});
