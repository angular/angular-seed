'use strict';

/* Controllers */

var communityControllers = angular.module('communityControllers', []);
var comService;
communityControllers.controller('CommunityListCtrl', ['$scope', 'Community',
  function($scope, Community) {
    comService = Community;
    $scope.communities = Community.query();
    $scope.orderProp = 'category';//name
  }]);

communityControllers.controller('CommunityDetailCtrl', ['$scope', '$routeParams', 'Community',
  function($scope, $routeParams, Community) {
    $scope.phone = Community.get({communityId: $routeParams.communityId}, 
    function(communityId) {
      $scope.mainImageUrl = communityId.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    };
  }]);