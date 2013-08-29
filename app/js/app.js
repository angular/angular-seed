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

var myApp = angular.module('authenticationApp', ['authenticationApp.controllers']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'partials/home.html',
    controller:  'homeCtrl'
  });
  $routeProvider.when('/blogs', {
    templateUrl: 'partials/blogs.html',
    controller:  'blogsCtrl'
  });
  $routeProvider.when('/profile', {
    templateUrl: 'partials/profile.html',
    controller:  'profileCtrl'
  });

  $routeProvider.otherwise({
    redirectTo:  '/home'
  });
}]);





/*
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
*/