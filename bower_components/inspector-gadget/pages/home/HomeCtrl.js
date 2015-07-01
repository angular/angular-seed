/**
*/

'use strict';

angular.module('myApp').controller('HomeCtrl', function($scope, $timeout) {
  $scope.timer = 0;
  $scope.tenSecTimer = 0;
	//TODO - put any directive code here
  
  function tick() {
    $scope.timer++;
    if ($scope.timer % 10 === 0) {
      $scope.tenSecTimer++;
    }
    $timeout(tick, 1000);
  }

  tick();

});
