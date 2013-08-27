'use strict';


// Declare app level module which depends on filters, and services
/*
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
*/

// Shan's own app

var myApp = angular.module('authenticationApp', []).
    config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/login', {
        templateUrl: 'login.html',
        controller:  'loginCtrl'});
      $routeProvider.when('/home', {
        templateUrl: 'home.html',
        controller:  'homeCtrl'
      });
      $routeProvider.otherwise({
        redirectTo:  '/login'
      });
}]);

var loginCtrl = function($scope, $location) {
  //$scope.test = "hello world";
  $scope.authentic = function() {
    if (! $scope.name) {
      alert('No name');
      return;
    }
    if (! $scope.password) {
      alert('No password');
      return;
    }
    $location.path('/home');
  };
};

var homeCtrl = function($scope) {

};