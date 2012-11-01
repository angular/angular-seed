'use strict';

angular.module('taggedList.controller', ['taggedList.service']).controller('TaggedListController', ['$scope', 'taggedListService', function ($scope, taggedListService) {
    $scope.items = taggedListService.getItems();
    $scope.tags = taggedListService.getTags();
    $scope.currentTag = null;

    $scope.addItem = function () {
        var text = $scope.newItem && $scope.newItem.trim();

        if (text) {
            taggedListService.addItem(Item.createNewItem(text));
            $scope.newItem = '';
        }
    };

    $scope.removeItem = function(itemToRemove) {
        var globalTagsToRemove = [];
        angular.forEach(itemToRemove.tags, function(tag) {
            globalTagsToRemove.push(tag);
        });

        angular.forEach($scope.items, function(item, key) {
            if (item === itemToRemove) {
                $scope.items.splice(key, 1);
            }
            else {
                angular.forEach(itemToRemove.tags, function(tag, index) {
                    if (item.hasTag(tag)) {
                        globalTagsToRemove.splice(index, 1);
                    }
                });
            }
        });

        angular.forEach(globalTagsToRemove, function(globalTagToRemove){
            angular.forEach($scope.tags, function(tag, index){
                if (tag === globalTagToRemove) {
                    $scope.tags.splice(index, 1);
                }
            })
        });
    };

    $scope.setCurrentTag = function(currentTag) {
        $scope.currentTag = null;
        angular.forEach($scope.tags, function(tag){
            if (tag === currentTag) {
                $scope.currentTag = tag;
                return;
            }
        });  
    };
}]);