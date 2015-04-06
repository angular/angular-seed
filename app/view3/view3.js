'use strict';

angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html'
  });
}])

.controller('View3Ctrl', ['$scope', function($scope) {
}])

.controller('AddUserController', ['$scope', function($scope) {
    $scope.message = '';
    $scope.addUser = function(){
        $scope.message = 'Thanks, ' + $scope.user.first + ', we added you!';
    };
}]);
