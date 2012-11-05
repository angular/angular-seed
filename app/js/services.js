'use strict';
angular.module('taggedList.service', ['taggedList.dao']).factory('taggedListService', function (itemDao) {
    var taggedList = new TaggedList();
    taggedList.items = itemDao.query();

    return {
        getItems: function () {
            return taggedList.items;
        },
        getTags: function() {
            return taggedList.tags;
        },
        addItem: function(item) {
            angular.forEach(item.tags, function(tag){
                if (taggedList.tags.indexOf(tag) == -1) {
                    taggedList.tags.push(tag);
                }               
            });                 

            taggedList.items.push(item);
            itemDao.save(item);
        },
        removeItem: function(itemToRemove){
            var globalTagsToRemove = itemToRemove.tags;
            
            taggedList.items.forEach(function(item, key) {
                if (item === itemToRemove) {
                    taggedList.items.splice(key, 1);
                }
                else {
                    angular.forEach(itemToRemove.tags, function(tag, index) {
                        if (item.hasTag(tag)) {
                            globalTagsToRemove.splice(index, 1);
                        }
                    });
                }
            });

            globalTagsToRemove.forEach(function(globalTagToRemove){
                angular.forEach(taggedList.tags, function(tag, index){
                    if (tag === globalTagToRemove) {
                        taggedList.tags.splice(index, 1);
                    }
                })
            });

            itemDao.remove(itemToRemove);
        }
    };
});