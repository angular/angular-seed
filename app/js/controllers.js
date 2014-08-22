'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MyCtrl1', ['$scope', 'Information', function($scope, Information) {
        console.log(Information.about());
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
