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
var myControllers = angular.module('authenticationApp.controllers', [
  'authenticationApp.services'
]);

myControllers.controller('homeCtrl', ['$scope', '$rootScope', 'globalService', function($scope, $rootScope, globalService) {
  var section = 'home';
  $rootScope.active = section;
  globalService.footerShow(section);
}]);

myControllers.controller('blogsCtrl', ['$scope', '$rootScope', 'globalService', function($scope, $rootScope, globalService) {
  var section = 'blogs';
  $rootScope.active = section;
  globalService.footerShow(section);
  window.onscroll = function() {
    globalService.footerShow(section);
    $rootScope.$digest();
  };
}]);

myControllers.controller('profileCtrl', ['$scope', '$rootScope', 'globalService', function($scope, $rootScope, globalService) {
  var section = 'profile';
  $rootScope.active = section;
  globalService.footerShow(section);
  window.onscroll = function() {
    globalService.footerShow(section);
    $rootScope.$digest();
  };
}]);

