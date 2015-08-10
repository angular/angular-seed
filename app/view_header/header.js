'use strict';
angular.module('myApp.header', [])

.controller('HeaderController', ['$scope', function($scope){
    $scope.myheader = 'hello world';
}]);
