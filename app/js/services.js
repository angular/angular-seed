'use strict';

angular.module('taggedList.service', []).factory('taggedListService', function () {
    var items = [];
    var tags = [];

    return {
        getItems:function () {
            if (!items.length) {
                items = [];
                this.addItem(new Item('first item', false, ['tag1']));
                this.addItem(new Item('next item', false, ['tag2']));
                this.addItem(new Item('third item', false, []));
                this.addItem(new Item('fourth item', false, ['tag1', 'tag2']));
            }
            
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