'use strict';

taggedList.controller('TaggedListController', ['$scope', 'taggedListService', function ($scope, taggedListService) {
    $scope.items = taggedListService.fetch();

    $scope.addItem = function () {
        $scope.items.push({text:$scope.itemText, done:false});
        $scope.itemText = '';
    };
}]);