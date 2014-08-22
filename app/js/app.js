'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.providers',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', 'InformationProvider', function($routeProvider, InformationProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
  InformationProvider.setupInformation('Some info to initialize the information class');
}]);
