'use strict';

// Register `vehicleDetail` component, along with its associated controller and template
angular.
  module('vehicleDetail').
  component('vehicleDetail', {
    controllerAs: 'vm',
    templateUrl: 'components/vehicle-detail.template.html',
    controller: ['$http','$routeParams',
      function VehicleDetailController($http, $routeParams) {

        $http.get('./vehicles.json' )
                .then(res => {
                    this.vehicle = res.data[$routeParams.vehicleId]
                    console.log('CURRENT', this.vehicle)
                })
      }
    ]
  });