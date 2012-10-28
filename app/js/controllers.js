'use strict';

taggedList.controller('TaggedListController', ['$scope', 'taggedListService', function ($scope, taggedListService) {
    $scope.items = taggedListService.fetch();

    $scope.addItem = function () {
        if ($scope.newItem && $scope.newItem.trim()) {
            var item = {text:$scope.newItem, done:false};
            taggedListService.add(item);
            $scope.newItem = '';
        }
    };
}]);