'use strict';

taggedList.factory('taggedListService', function () {

    var items = [
        new Item('first item', false, ['category1']),
        new Item('next item', true, ['category2']),
        new Item('third item', true, []),
    ];
             
    var tags = ['category1', 'category2'];

    return {
        getItems:function () {
            return items;
        },
        getTags: function() {
            return tags;
        },
        addItem: function(item) {
            angular.forEach(item.tags, function(tag){
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });                 

            items.push(item);
        }    
    };
});