'use strict';

angular.module('myApp.view3', [])

.controller('View3Ctrl', ['$scope', function($scope) {
}])

.controller('AddUserController', ['$scope', function($scope) {
    $scope.message = '';
    $scope.addUser = function(){
        $scope.message = 'Thanks, ' + $scope.user.first + ', we added you!';
    };
}]);
