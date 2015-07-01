/**
*/

'use strict';

angular.module('myApp').controller('TestCtrl', function($scope) {
  $scope.timer = 0;
  $scope.tenSecTimer = 0;
  
  $scope.click = function(i) {
    console.log('click' + i);
  };


});
