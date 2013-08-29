'use strict';

/* Controllers */
/*
angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);
*/

// Shan's own
var myControllers = angular.module('authenticationApp.controllers', []);

myControllers.controller('homeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  // make 'Home' tab active
  $rootScope.active = 'home';
}]);

myControllers.controller('blogsCtrl', ['$scope', '$rootScope', function($scope, $rootScrope) {
  $rootScrope.active = 'blogs'
}]);

myControllers.controller('profileCtrl', ['$scope', '$rootScope', function($scope, $rootScrope) {
  $rootScrope.active = 'profile'
}]);