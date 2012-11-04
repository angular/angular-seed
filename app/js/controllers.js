'use strict';

angular.module('taggedList.controller', ['taggedList.service']).controller('TaggedListController', 
    ['$scope', '$location', 'taggedListService', function ($scope, $location, taggedListService) {

    $scope.items = taggedListService.getItems();
    $scope.tags = taggedListService.getTags();
    $scope.currentTag = null;
    $scope.today = new Date();
    $scope.yesterday = new Date();
    $scope.yesterday.setDate($scope.yesterday.getDate() - 1);

    $scope.createNewItem = function() {
        $location.url('new');
    };

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

    $scope.itemPerTag = function(tag) {
        if (!tag) {
            return $scope.items;
        }
        else {
            var items = [];
            angular.forEach($scope.items, function(item) {
                if (item.hasTag(tag)) {
                    items.push(item);
                }
            });
            return items;
        }
    };
}]);