'use strict';

// Declare app level module which depends on views, and components
angular.module('hereiam', [
  'ngRoute',
  'hereiam.events',
  'hereiam.people',
  'hereiam.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/events'});
}]);
