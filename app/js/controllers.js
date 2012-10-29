'use strict';

taggedList.controller('TaggedListController', ['$scope', 'taggedListService', function ($scope, taggedListService) {
    $scope.items = taggedListService.getItems();
    $scope.tags = taggedListService.getTags();

    $scope.addItem = function () {
        var text = $scope.newItem && $scope.newItem.trim();

        if (text) {
            taggedListService.addItem(Item.createNewItem(text));
            $scope.newItem = '';
        }
    };

    $scope.removeItem = function(itemToRemove) {
        angular.forEach($scope.items, function(item, key) {
            if (item === itemToRemove) {
                $scope.items.splice(key, 1);
                return;
            }
        });
    };
}]);