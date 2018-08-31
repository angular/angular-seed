'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.
    module('myApp').
    component('vehicleList',{
        templateUrl: '/components/vehicle-list.html',
        controller: function VehicleController(
            $scope,
            $http
        ) {
            $scope.vehicles = [];
            $http.get('./vehicles.json').then(function(result) {
              $scope.vehicles = result.data;
            });
        }
    })