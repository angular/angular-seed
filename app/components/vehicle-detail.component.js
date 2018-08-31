'use strict';

// Register `vehicleDetail` component, along with its associated controller and template
angular.
  module('vehicleDetail').
  component('vehicleDetail', {
    template: 'TBD: Detail view for <span>{{$ctrl.vehicleId}}</span>',
    controller: ['$routeParams',
      function VehicleDetailController($routeParams) {
        this.vehicleId = $routeParams.vehicleId;
      }
    ]
  });