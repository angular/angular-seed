'use strict';

taggedList.factory('taggedListService', function () {

    var items = [
        {text:'first item', done:false },
        {text:'next item', done:true},
        {text:'third item', done:false}
    ];

    return {
        fetch:function () {
            return items;
        },
        add: function(item) {
            items.push(item);
        }
    };
});