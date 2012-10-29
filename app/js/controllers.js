'use strict';

taggedList.controller('TaggedListController', ['$scope', 'taggedListService', function ($scope, taggedListService) {
    $scope.items = taggedListService.fetch();

    $scope.addItem = function () {
        var newItem = $scope.newItem && $scope.newItem.trim();

        if (newItem) {
            var item = {text:newItem, done:false};
            taggedListService.add(item);

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