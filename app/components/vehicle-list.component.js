'use strict';

// // Register `phoneList` component, along with its associated controller and template
// angular.module('myApp').component('vehicleList', {
// // Note: The URL is relative to our `index.html` file
//   templateUrl: '/components/vehicle-list.template.html',

//   controller: function VehicleController($scope, $http) {
//     $scope.vehicles = [];
//     $http.get('./vehicles.json').then(function(result) {
//       $scope.vehicles = result.data;
//     });
//     this.orderProp = 'year';
//   }
// });

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
