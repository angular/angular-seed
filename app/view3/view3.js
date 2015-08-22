(function(){
  'use strict';

  angular
    .module('myApp.view3', [])
    .controller('View3Ctrl', View3Ctrl)
    .controller('AddUserController', AddUserController);

  function View3Ctrl ($scope) {

  }

  function AddUserController ($scope) {
    $scope.message = '';
    $scope.addUser = function(){
        $scope.message = 'Thanks, ' + $scope.user.first + ', we added you!';
    };
  }

})();
