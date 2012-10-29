'use strict';

taggedList.factory('taggedListService', function () {

    var items = [
        {text:'first item', done:false },
        {text:'next item', done:true},
        {text:'third item', done:false}
    ];
    var tags = [];

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