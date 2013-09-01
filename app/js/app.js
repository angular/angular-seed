'use strict';


// Declare app level module which depends on filters, and services

var myApp = angular.module('authenticationApp', ['authenticationApp.controllers']);

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
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
  $routeProvider.when('/home', {
    redirectTo: '/'
  });

//  $routeProvider.otherwise({
//    redirectTo:  '/'
//  });

  // Get rid of the '#' in the url.
  $locationProvider.html5Mode(true);
}]);