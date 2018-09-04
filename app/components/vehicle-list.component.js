'use strict';

angular.module('vehicleList').component('vehicleList', {
  controllerAs: 'vm',

  templateUrl: 'components/vehicle-list.template.html',

  controller: function VehicleController($scope, $http) {
    let vm = $scope;

    vm.orderProp = 'year';
    vm.vehicles = [];

    $http.get('./vehicles.json').then(result => {
      vm.vehicles = result.data;
    });
  }
});
