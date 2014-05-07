'use strict';

/* Controllers */

angular.module('myApp.controllers')

  .controller('EditorCtrl', ['$scope', function($scope) {
    $scope.create = function() {
            alert("create");
        }
            $scope.open = function() {
            alert("open");
        }
  }]);