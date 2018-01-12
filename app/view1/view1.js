'use strict';

angular.module('myApp.view1', ['ngRoute', 'core.followers'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'Followers', function($scope, Followers) {
            $scope.updateGitHubFollowers = function updateGitHubFollowers(username) {
                $scope.users = Followers.query({githubId: username});
            }
         }]);