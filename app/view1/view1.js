'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'CatGifs', function($scope, CatGifs) {
	$scope.loading = true;
	$scope.loadingStyle = {display: 'block'};
	$scope.images = CatGifs.query(function(data) { $scope.loading = false; $scope.loadingStyle = {display: 'none'}; });
}]);