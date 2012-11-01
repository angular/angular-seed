'use strict';

taggedList.filter('byTag', function(){
    return function(items, tag) {
        if (!tag) {
            return items;
        }
        else {
            var itemsByTag = [];
            angular.forEach(items, function(item) {
               if (item.hasTag(tag)) {
                   itemsByTag.push(item);
               }
            });
            return itemsByTag;
        }
    };
});