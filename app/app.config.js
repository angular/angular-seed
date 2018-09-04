'use strict';

angular.module('myApp').config([
  '$locationProvider',
  '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
      .when('/vehicles', {
        template: '<vehicle-list></vehicle-list>'
      })
      .when('/vehicles/:vehicleId', {
        template: '<vehicle-detail></vehicle-detail>'
      })
      .when('/cartform', {
        template: '<cart-form></cart-form>'
      })
      .otherwise('/vehicles');
  }
]);
