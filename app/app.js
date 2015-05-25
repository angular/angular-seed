'use strict';
 
angular.module('myApp', [
  'ngRoute',
  'myApp.home'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/home'
  });
  // Routes will be here
  
}]);